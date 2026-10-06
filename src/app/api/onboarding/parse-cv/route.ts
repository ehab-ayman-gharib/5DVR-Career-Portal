import { NextRequest, NextResponse } from 'next/server';
import { openai, TARGET_MODEL } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
        { error: 'Failed to parse CV and extract profile.' },
        { status: 500 }
      );
    }

    // Prompt LLM for structured profile JSON — kept identical to existing behavior
    const prompt = `You are a precise resume parser. Extract profile information from the resume into strict JSON format.

CRITICAL RULE FOR "education":
Extract ONLY the candidate's actual academic degree, major, faculty, and university (e.g., "BACHELOR'S DEGREE, COMPUTER SCIENCE, Faculty of computers & Information Helwan University 2009 - 2013").
Do NOT extract work experience descriptions, project summaries, or sentences mentioning "educational tool", "educational platform", or similar job duties as the candidate's education.

Respond ONLY with a JSON object in this exact structure:
{
  "firstName": "First Name",
  "lastName": "Last Name",
  "education": "Degree, Major, Faculty / University",
  "fieldOfInterest": "Field or Specialization",
  "experienceLevel": "ENTRY_LEVEL | MID_LEVEL | SENIOR | STUDENT",
  "careerGoal": "Target Position or Role",
  "extractedSkills": ["Skill 1", "Skill 2"]
}`;

    let rawParsed: Record<string, any> = {};

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
              { type: 'input_text', text: prompt },
            ],
          },
        ],
      } as any);

      const content: string = (response as any).output_text || '{}';

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          rawParsed = JSON.parse(jsonMatch[0]);
        } else {
          rawParsed = JSON.parse(content);
        }
      } catch (e) {
        console.warn('Failed to parse LLM JSON output, using empty fallback:', e);
      }
    } catch (apiError) {
      console.error('OpenAI Responses API error in parse-cv:', apiError);
      return NextResponse.json(
        { error: 'Failed to parse CV and extract profile.' },
        { status: 500 }
      );
    } finally {
      // Fire-and-forget cleanup — delete the uploaded file from OpenAI
      openai.files.del(fileId).catch((e) =>
        console.warn('Could not delete OpenAI file after parse-cv:', e)
      );
    }

    // Normalize keys (case-insensitive lookup)
    const getVal = (keys: string[]) => {
      for (const k of keys) {
        for (const rawKey of Object.keys(rawParsed)) {
          if (rawKey.toLowerCase() === k.toLowerCase() && rawParsed[rawKey]) {
            return rawParsed[rawKey];
          }
        }
      }
      return null;
    };

    const parsedProfile = {
      firstName: getVal(['firstName', 'first_name', 'name']) || '',
      lastName: getVal(['lastName', 'last_name']) || '',
      education: getVal(['education', 'degree', 'qualification', 'university']) || '',
      fieldOfInterest: getVal(['fieldOfInterest', 'field_of_interest', 'domain', 'specialization']) || 'Technology',
      experienceLevel: getVal(['experienceLevel', 'experience_level']) || 'MID_LEVEL',
      careerGoal: getVal(['careerGoal', 'career_goal', 'target_role', 'title']) || 'Software Professional',
      extractedSkills: getVal(['extractedSkills', 'extracted_skills', 'skills']) || [],
    };

    console.log('Parsed Profile Output:', parsedProfile);

    return NextResponse.json({
      parsedProfile,
      parsedTextSnippet: '',
    });
  } catch (error) {
    console.error('Error in /api/onboarding/parse-cv:', error);
    return NextResponse.json(
      { error: 'Failed to parse CV and extract profile.' },
      { status: 500 }
    );
  }
}
