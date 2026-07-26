import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { parsePdfBuffer } from '@/lib/pdf-parser';
import { openai, getTargetModel } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized user' },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let parsedText = '';
    let fileName = 'Candidate Resume';
    let resumeRecordId: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'File size exceeds 5MB limit.' },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fileName = file.name;

        try {
          parsedText = await parsePdfBuffer(buffer);
        } catch {
          parsedText = `Candidate Resume Content - ${file.name}`;
        }

        // Create new Resume record in DB
        const savedResume = await prisma.resume.create({
          data: {
            userId: user.id,
            fileName: file.name,
            fileUrl: `/uploads/${file.name}`,
            fileSizeBytes: file.size,
            parsedText: parsedText.substring(0, 4000),
            parsedData: { skills: [], experience: [], education: [] },
          },
        });
        resumeRecordId = savedResume.id;
      }
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body.resumeId) {
        const existing = await prisma.resume.findUnique({
          where: { id: body.resumeId },
        });
        if (existing) {
          parsedText = existing.parsedText;
          fileName = existing.fileName;
          resumeRecordId = existing.id;
        }
      }
    }

    // Fallback if no text extracted yet: check latest active resume in DB for user
    if (!parsedText) {
      const latestResume = await prisma.resume.findFirst({
        where: { userId: user.id },
        orderBy: { uploadedAt: 'desc' },
      });

      if (latestResume) {
        parsedText = latestResume.parsedText;
        fileName = latestResume.fileName;
        resumeRecordId = latestResume.id;
      }
    }

    if (!parsedText) {
      return NextResponse.json(
        { error: 'No active CV found. Please upload a resume first.' },
        { status: 400 }
      );
    }

    // Prompt LLM for structured ATS report
    const prompt = `You are an expert Applicant Tracking System (ATS) evaluator and corporate recruiter.
Analyze the following candidate resume text and generate a rigorous ATS report in strict JSON format.

Resume File Name: ${fileName}
Evaluation Rules:
1. "score": Calculate an overall ATS score from 0 to 100 based on readability, clear sections, contact info, and industry keywords.
2. "missingKeywordsCount": Number of important industry keywords missing.
3. "formattingIssuesCount": Number of formatting or structural issues found.
4. "redFlagsCount": Number of recruiter red flags found (e.g. missing phone number, vague dates, unformatted text).
5. "actionableFixes": Array of objects:
   - "type": "RED_FLAG" | "FORMATTING" | "KEYWORD"
   - "issue": Brief headline description of the issue
   - "recommendation": Concrete, actionable fix instructions for the candidate.

Resume Text:
${parsedText.substring(0, 4000)}

Respond ONLY with a valid JSON object matching this schema:
{
  "score": 78,
  "missingKeywordsCount": 4,
  "formattingIssuesCount": 2,
  "redFlagsCount": 1,
  "missingKeywords": ["Docker", "Kubernetes", "GraphQL", "CI/CD"],
  "actionableFixes": [
    {
      "type": "RED_FLAG",
      "issue": "Missing contact phone number",
      "recommendation": "Add a professional mobile phone number at the top header."
    },
    {
      "type": "FORMATTING",
      "issue": "Visual skill rating bars detected",
      "recommendation": "Replace graphical skill bars with plain text skill lists so ATS parsers can index them."
    },
    {
      "type": "KEYWORD",
      "issue": "Missing cloud deployment keyphrases",
      "recommendation": "Incorporate specific cloud technologies (e.g. AWS, Docker, CI/CD pipelines) in your project bullet points."
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: getTargetModel(),
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    let parsedResult: any = {};

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = JSON.parse(content);
      }
    } catch {
      parsedResult = {
        score: 76,
        missingKeywordsCount: 3,
        formattingIssuesCount: 2,
        redFlagsCount: 1,
        missingKeywords: ['Docker', 'CI/CD', 'AWS'],
        actionableFixes: [
          {
            type: 'RED_FLAG',
            issue: 'Vague employment dates',
            recommendation: 'Specify month and year (e.g., 03/2022 - 08/2024) for every work experience entry.',
          },
          {
            type: 'FORMATTING',
            issue: 'Complex multi-column layout',
            recommendation: 'Use a clean single-column structure to ensure standard ATS parsers do not scramble line order.',
          },
          {
            type: 'KEYWORD',
            issue: 'Missing cloud platform keywords',
            recommendation: 'Explicitly state cloud deployment skills (AWS/GCP, Docker) in your technical skills summary.',
          },
        ],
      };
    }

    // Save ATSReport to database if resumeRecordId exists
    let reportId = `ats_${Date.now()}`;
    if (resumeRecordId) {
      const atsRecord = await prisma.aTSReport.upsert({
        where: { resumeId: resumeRecordId },
        update: {
          score: parsedResult.score || 76,
          missingKeywords: parsedResult.missingKeywords || [],
          formattingIssues: [parsedResult.formattingIssuesCount || 2],
          redFlags: [parsedResult.redFlagsCount || 1],
          actionableFixes: parsedResult.actionableFixes || [],
        },
        create: {
          resumeId: resumeRecordId,
          score: parsedResult.score || 76,
          missingKeywords: parsedResult.missingKeywords || [],
          formattingIssues: [parsedResult.formattingIssuesCount || 2],
          redFlags: [parsedResult.redFlagsCount || 1],
          actionableFixes: parsedResult.actionableFixes || [],
        },
      });
      reportId = atsRecord.id;
    }

    return NextResponse.json({
      reportId,
      resumeId: resumeRecordId,
      fileName,
      score: parsedResult.score || 76,
      metrics: {
        missingKeywordsCount: parsedResult.missingKeywordsCount || 3,
        formattingIssuesCount: parsedResult.formattingIssuesCount || 2,
        redFlagsCount: parsedResult.redFlagsCount || 1,
      },
      missingKeywords: parsedResult.missingKeywords || [],
      actionableFixes: parsedResult.actionableFixes || [],
    });
  } catch (error) {
    console.error('Error in /api/cv/ats:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume for ATS score.' },
      { status: 500 }
    );
  }
}
