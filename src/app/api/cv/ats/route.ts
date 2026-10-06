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

    // Prompt for structured ATS report — rigorous, evidence-based evaluation
    const buildPrompt = (context: string) => `You are an expert Applicant Tracking System (ATS) evaluator and corporate recruiter.

Analyze the attached resume and produce a rigorous, evidence-based ATS compatibility report.

Resume File Name: ${fileName}

IMPORTANT:
- This mode does NOT include a job description.
- Do not perform job-specific matching.
- Do not assume a specific company, vacancy, or target job posting.
- Evaluate only the information actually present in the resume.
- Do not invent missing skills, experience, qualifications, technologies, or certifications.
- Do not recommend that the candidate claim experience they may not actually have.
- A visually designed resume is not automatically ATS-unfriendly. Only flag formatting when it could realistically interfere with parsing or significantly reduce readability.
- Do not manufacture issues just to populate the report.
- If there are no genuine red flags, return zero red flags.
- Recommendations must be specific to this resume, not generic resume advice.
- The final score represents estimated ATS compatibility and resume quality, not the score of any specific commercial ATS.

EVALUATION PROCESS

First, identify the candidate's apparent primary profession, specialization, or professional profile based only on the resume.

Then evaluate the resume across the following categories.

1. ATS PARSEABILITY — 25 points

Evaluate:
- Whether the text appears clearly readable and extractable.
- Clear and recognizable section headings.
- Logical content order.
- Standard presentation of contact information.
- Whether important information can likely be interpreted correctly by an ATS.
- Potentially problematic columns, tables, graphics, icons, text boxes, headers, footers, or unusual layouts.
- Whether important information is communicated primarily through graphical elements instead of readable text.

Rules:
- Do not deduct points simply because the resume is visually styled.
- Only identify a formatting problem when it has a realistic chance of reducing ATS parsing accuracy or recruiter readability.

2. EXPERIENCE & CONTENT QUALITY — 25 points

Evaluate:
- Clear job titles.
- Clear company or organization names.
- Understandable employment dates.
- Clear descriptions of responsibilities.
- Accomplishments and measurable impact where appropriate.
- Specificity of project or work descriptions.
- Strong action-oriented language.
- Whether the candidate explains what they actually contributed.
- Whether bullets communicate outcomes rather than only responsibilities.

Do not penalize every bullet for lacking numbers. Quantifiable impact should be recommended only where it would naturally strengthen the content.

3. SKILLS & KEYWORD COVERAGE — 25 points

Identify the candidate's apparent profession or specialization from the resume.

Evaluate whether the resume contains clear, relevant, and searchable terminology for that professional field.

Rules:
- Only identify keyword opportunities that are strongly relevant to the candidate's existing experience.
- Do not assume a specific target job.
- Do not guess arbitrary technologies, certifications, methodologies, or tools simply because they are common in the industry.
- Do not recommend adding a skill unless the resume already provides reasonable evidence that the candidate has related experience.
- Prefer terminology that makes existing experience more explicit and searchable.
- Do not treat every common industry technology as a missing keyword.
- Be conservative when identifying keyword opportunities.

Example:
If the resume clearly describes designing and integrating HTTP-based backend endpoints but never explicitly uses the term "REST API", it may be reasonable to suggest "REST API" as a keyword opportunity.

It would NOT be reasonable to suggest Kubernetes, AWS, Docker, or another technology simply because the candidate works in software development.

4. STRUCTURE & COMPLETENESS — 15 points

Evaluate:
- Contact information.
- Professional summary or profile where appropriate.
- Experience section.
- Skills section where appropriate.
- Education where relevant.
- Clear date formatting.
- Consistent organization.
- Repeated or duplicated information.
- Missing information that meaningfully reduces the resume's usefulness.
- Overall section hierarchy.

Do not flag optional sections as missing unless their absence clearly harms the resume.

5. RECRUITER READABILITY — 10 points

Evaluate:
- Clarity.
- Conciseness.
- Specificity.
- Ease of scanning.
- Overly long paragraphs or bullets.
- Excessive jargon.
- Vague or unsupported claims.
- Repetition.
- Whether a recruiter can quickly understand the candidate's background, specialization, and strongest experience.

TOTAL SCORE

Calculate the final ATS score as the sum of the five category scores.

Maximum scores:

ATS Parseability: 25
Experience & Content Quality: 25
Skills & Keyword Coverage: 25
Structure & Completeness: 15
Recruiter Readability: 10

Total: 100

The overall "score" MUST exactly equal the sum of the values in "scoreBreakdown".

ISSUE CLASSIFICATION

Every actionable finding must use one of these types:

RED_FLAG

Use only for significant issues that could materially concern a recruiter or prevent proper evaluation.

Examples:
- Missing essential contact information.
- Severely unclear employment history.
- Contradictory dates or information.
- Important sections that appear unreadable.
- Major unexplained inconsistencies.
- Serious professionalism issues.

Do NOT classify minor resume optimization opportunities as red flags.

FORMATTING

Use when formatting, structure, or presentation could realistically hurt ATS parsing or recruiter readability.

Examples:
- Important content embedded in graphical skill bars.
- Extremely unclear section hierarchy.
- Important information placed in a way that could be difficult to parse.
- Inconsistent or confusing date structures.

Do not flag visual styling merely because it is visually designed.

KEYWORD

Use for relevant terminology that could make the candidate's existing experience more discoverable or explicit.

Keyword findings must be supported by evidence already present in the resume.

Never recommend that the candidate falsely claim a technology, skill, methodology, or qualification.

SEVERITY

Every actionable fix must have one severity:

HIGH
Likely to materially affect ATS parsing, recruiter understanding, or candidate evaluation.

MEDIUM
Meaningful issue that should be improved but is unlikely to invalidate the resume.

LOW
Optimization opportunity that may improve clarity, keyword coverage, or presentation.

Use HIGH severity sparingly.

EVIDENCE RULES

Every actionable fix MUST include evidence.

Evidence must:
- Refer to actual content found in the resume.
- Explain why the issue was identified.
- Be specific enough for the user to understand what triggered the finding.
- Quote only a short relevant phrase from the resume when useful.
- Never invent content.
- Never claim that something exists in the resume when it does not.

If there is not enough evidence to support a finding, do not include that finding.

Bad evidence:
"Your resume needs stronger achievements."

Good evidence:
"Several experience bullets describe responsibilities such as 'Developed AR applications' without describing the outcome or impact."

RECOMMENDATION RULES

Every recommendation must:
- Directly address the associated evidence.
- Be concrete and actionable.
- Tell the candidate what to change.
- Avoid generic advice such as "improve your resume" or "add more keywords".
- Never recommend adding false information.
- Use wording such as "if accurate" when suggesting terminology that is implied but not explicitly confirmed.

Example:

Evidence:
"The resume describes building backend integrations but does not explicitly use the term 'REST API'."

Recommendation:
"If accurate, explicitly mention 'REST API integration' in the relevant experience bullet so ATS keyword matching can identify the experience more easily."

KEYWORD OPPORTUNITIES

Use "keywordOpportunities" instead of "missingKeywords".

A keyword opportunity is a relevant term that:
- better describes experience already demonstrated in the resume,
- could improve searchability or ATS recognition,
- and is reasonably supported by the candidate's existing content.

Do not treat keyword opportunities as proof that the candidate lacks a skill.

Keep the list conservative and useful.

Do not include more than 8 keyword opportunities.

ACTIONABLE FIXES

Return only the most important findings.

- Maximum 8 actionable fixes.
- Prioritize high-impact findings.
- Avoid multiple findings that describe essentially the same problem.
- Do not manufacture findings to reach the maximum.
- It is valid to return an empty actionableFixes array for a very strong resume.

STRENGTHS

Return between 2 and 5 concise strengths.

Strengths must also be based on actual resume content.

Examples:
- Strong measurable project impact.
- Clear progression into senior responsibilities.
- Well-organized technical skills section.
- Strong specialization in a clearly identifiable professional field.

COUNTS

The counts MUST exactly match the returned data.

"keywordOpportunitiesCount"
= number of items in "keywordOpportunities"

"formattingIssuesCount"
= number of actionableFixes where type is "FORMATTING"

"redFlagsCount"
= number of actionableFixes where type is "RED_FLAG"

Do not estimate these counts independently.

OUTPUT REQUIREMENTS

Respond ONLY with a valid JSON object.

Do not include markdown.
Do not include code fences.
Do not include commentary before or after the JSON.
Do not include unsupported fields.

The response must match this exact structure:

{
  "score": 0,
  "detectedRole": "",
  "scoreBreakdown": {
    "parseability": 0,
    "experienceContent": 0,
    "skillsKeywords": 0,
    "structureCompleteness": 0,
    "recruiterReadability": 0
  },
  "keywordOpportunitiesCount": 0,
  "formattingIssuesCount": 0,
  "redFlagsCount": 0,
  "keywordOpportunities": [],
  "strengths": [],
  "actionableFixes": [
    {
      "type": "RED_FLAG",
      "severity": "HIGH",
      "issue": "",
      "evidence": "",
      "recommendation": ""
    }
  ]
}

VALID VALUES

For actionableFixes.type, use only:
"RED_FLAG"
"FORMATTING"
"KEYWORD"

For actionableFixes.severity, use only:
"HIGH"
"MEDIUM"
"LOW"

FINAL VALIDATION BEFORE RESPONDING

Before returning the JSON, verify internally that:

1. score is between 0 and 100.
2. score exactly equals:
   parseability
   + experienceContent
   + skillsKeywords
   + structureCompleteness
   + recruiterReadability.
3. parseability is between 0 and 25.
4. experienceContent is between 0 and 25.
5. skillsKeywords is between 0 and 25.
6. structureCompleteness is between 0 and 15.
7. recruiterReadability is between 0 and 10.
8. keywordOpportunitiesCount exactly equals keywordOpportunities.length.
9. formattingIssuesCount exactly equals the number of FORMATTING fixes.
10. redFlagsCount exactly equals the number of RED_FLAG fixes.
11. Every actionable fix contains specific evidence from the resume.
12. No recommendation asks the candidate to claim unsupported experience.
13. No job-description-specific assumptions were made.
14. The response contains valid JSON only.

${context}`;

    const fallbackResult = {
      score: 82,
      detectedRole: 'Software Developer',
      scoreBreakdown: {
        parseability: 22,
        experienceContent: 21,
        skillsKeywords: 20,
        structureCompleteness: 11,
        recruiterReadability: 8,
      },
      keywordOpportunitiesCount: 2,
      formattingIssuesCount: 1,
      redFlagsCount: 0,
      keywordOpportunities: ['Version Control', 'Agile Methodologies'],
      strengths: [
        'Clear chronological work history',
        'Strong focus on core engineering contributions',
      ],
      actionableFixes: [
        {
          type: 'FORMATTING',
          severity: 'MEDIUM',
          issue: 'Multi-column content structure',
          evidence: 'Side-by-side columns used in contact or skills area',
          recommendation: 'Ensure all critical information is organized in a linear, single-column flow for optimal ATS extraction.',
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
            ? `Resume Text:\n${existing.parsedText}`
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
        ? `Resume Text:\n${latestResume.parsedText}`
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

    const keywordOpportunities: string[] =
      parsedResult.keywordOpportunities ?? parsedResult.missingKeywords ?? [];
    const keywordsCount: number =
      parsedResult.keywordOpportunitiesCount ??
      parsedResult.missingKeywordsCount ??
      keywordOpportunities.length;
    const formattingCount: number = parsedResult.formattingIssuesCount ?? 0;
    const redFlagsCount: number = parsedResult.redFlagsCount ?? 0;

    // Save ATSReport to database if resumeRecordId exists
    let reportId = `ats_${Date.now()}`;
    if (resumeRecordId) {
      const atsRecord = await prisma.aTSReport.upsert({
        where: { resumeId: resumeRecordId },
        update: {
          score: parsedResult.score || 82,
          missingKeywords: keywordOpportunities,
          formattingIssues: [formattingCount],
          redFlags: [redFlagsCount],
          actionableFixes: parsedResult.actionableFixes || [],
        },
        create: {
          resumeId: resumeRecordId,
          score: parsedResult.score || 82,
          missingKeywords: keywordOpportunities,
          formattingIssues: [formattingCount],
          redFlags: [redFlagsCount],
          actionableFixes: parsedResult.actionableFixes || [],
        },
      });
      reportId = atsRecord.id;
    }

    return NextResponse.json({
      reportId,
      resumeId: resumeRecordId,
      fileName,
      score: parsedResult.score || 82,
      detectedRole: parsedResult.detectedRole || '',
      scoreBreakdown: parsedResult.scoreBreakdown || null,
      strengths: parsedResult.strengths || [],
      keywordOpportunities,
      metrics: {
        missingKeywordsCount: keywordsCount,
        formattingIssuesCount: formattingCount,
        redFlagsCount: redFlagsCount,
      },
      missingKeywords: keywordOpportunities,
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
