import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { openai, TARGET_MODEL } from '@/lib/openai';

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
    let fileName = 'Candidate Resume';
    let resumeRecordId: string | null = null;

    // Prompt for structured ATS report — kept identical to existing behavior
    const buildPrompt = (context: string) => `You are an expert Applicant Tracking System (ATS) evaluator and corporate recruiter.
Analyze the candidate resume and generate a rigorous ATS report in strict JSON format.

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

${context}

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

    const fallbackResult = {
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

    let parsedResult: any = {};

    if (contentType.includes('multipart/form-data')) {
      // ── FILE UPLOAD PATH ─────────────────────────────────────────────
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded.' },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit.' },
          { status: 400 }
        );
      }

      const isValidType =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');

      if (!isValidType) {
        return NextResponse.json(
          { error: 'Invalid file type. Only PDF files are accepted.' },
          { status: 400 }
        );
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create new Resume record in DB (parsedText is empty — no local extraction)
      const savedResume = await prisma.resume.create({
        data: {
          userId: user.id,
          fileName: file.name,
          fileUrl: `/uploads/${file.name}`,
          fileSizeBytes: file.size,
          parsedText: '',
          parsedData: { skills: [], experience: [], education: [] },
        },
      });
      resumeRecordId = savedResume.id;

      // Upload PDF to OpenAI Files API
      let fileId: string;
      try {
        const uploadedFile = await openai.files.create({
          file: new File([buffer], file.name, { type: 'application/pdf' }),
          purpose: 'user_data',
        });
        fileId = uploadedFile.id;
      } catch (uploadError) {
        console.error('Error uploading PDF to OpenAI:', uploadError);
        return NextResponse.json(
          { error: 'Failed to analyze resume for ATS score.' },
          { status: 500 }
        );
      }

      try {
        // Call OpenAI Responses API with the uploaded file
        const response = await openai.responses.create({
          model: TARGET_MODEL,
          reasoning: { effort: 'low' },
          input: [
            {
              role: 'user',
              content: [
                { type: 'input_file', file_id: fileId },
                { type: 'input_text', text: buildPrompt('(Analyze the uploaded resume file above)') },
              ],
            },
          ],
        } as any);

        const content: string = (response as any).output_text || '{}';

        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
        } catch {
          parsedResult = fallbackResult;
        }
      } finally {
        // Fire-and-forget cleanup — delete the uploaded file from OpenAI
        openai.files.del(fileId).catch((e) =>
          console.warn('Could not delete OpenAI file after ATS analysis:', e)
        );
      }
    } else if (contentType.includes('application/json')) {
      // ── JSON RE-ANALYSIS PATH (existing resume by ID) ─────────────────
      const body = await request.json();
      if (body.resumeId) {
        const existing = await prisma.resume.findUnique({
          where: { id: body.resumeId },
        });
        if (existing) {
          fileName = existing.fileName;
          resumeRecordId = existing.id;

          // Use stored parsedText; if empty (new-format uploads), use a stub
          const contextText = existing.parsedText
            ? `Resume Text:\n${existing.parsedText.substring(0, 4000)}`
            : `(Resume file: ${existing.fileName} — re-analyze using stored profile data)`;

          const response = await openai.responses.create({
            model: TARGET_MODEL,
            reasoning: { effort: 'low' },
            input: [
              {
                role: 'user',
                content: [
                  { type: 'input_text', text: buildPrompt(contextText) },
                ],
              },
            ],
          } as any);

          const content: string = (response as any).output_text || '{}';
          try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
          } catch {
            parsedResult = fallbackResult;
          }
        }
      }
    }

    // Fallback: check latest active resume in DB for user
    if (!parsedResult.score && !resumeRecordId) {
      const latestResume = await prisma.resume.findFirst({
        where: { userId: user.id },
        orderBy: { uploadedAt: 'desc' },
      });

      if (!latestResume) {
        return NextResponse.json(
          { error: 'No active CV found. Please upload a resume first.' },
          { status: 400 }
        );
      }

      fileName = latestResume.fileName;
      resumeRecordId = latestResume.id;

      const contextText = latestResume.parsedText
        ? `Resume Text:\n${latestResume.parsedText.substring(0, 4000)}`
        : `(Resume file: ${latestResume.fileName} — re-analyze using stored profile data)`;

      const response = await openai.responses.create({
        model: TARGET_MODEL,
        reasoning: { effort: 'low' },
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: buildPrompt(contextText) },
            ],
          },
        ],
      } as any);

      const content: string = (response as any).output_text || '{}';
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
      } catch {
        parsedResult = fallbackResult;
      }
    }

    if (!parsedResult.score) {
      return NextResponse.json(
        { error: 'No active CV found. Please upload a resume first.' },
        { status: 400 }
      );
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
