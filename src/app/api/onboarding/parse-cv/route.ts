import { NextRequest, NextResponse } from 'next/server';
import { parsePdfBuffer } from '@/lib/pdf-parser';
import { openai, getTargetModel } from '@/lib/openai';

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsedText = await parsePdfBuffer(buffer);

    // Robust helper function to extract degree & university lines
    const extractEducationFallback = (text: string): string => {
      // 1. Try extracting text under an explicit EDUCATION section header
      const sectionMatch = text.match(/(?:^|\n)\s*(?:EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS)\s*(?:\n|$)([\s\S]*?)(?=\n\s*(?:EXPERIENCE|SKILLS|PROJECTS|WORK|SUMMARY)\b|\n\s*\n[A-Z\s]{4,}|$)/i);
      
      const targetText = sectionMatch ? sectionMatch[1] : text;
      const lines = targetText.split('\n').map(l => l.trim()).filter(Boolean);
      
      // Keywords that identify actual degrees/universities vs. prose descriptions
      const degreeKeywords = /bachelor|master|phd|b\.sc|m\.sc|degree|university|faculty|college|diploma|computer\s+science/i;
      const proseIgnoreKeywords = /educational\s+tool|educational\s+content|educational\s+platform|educational\s+game|users\s+engage/i;

      const validEducationLines: string[] = [];
      for (const line of lines) {
        if (degreeKeywords.test(line) && !proseIgnoreKeywords.test(line)) {
          validEducationLines.push(line);
        }
      }

      if (validEducationLines.length > 0) {
        return validEducationLines.slice(0, 3).join(' - ');
      }
      return '';
    };

    // Prompt LLM for structured profile JSON
    const prompt = `You are a precise resume parser. Extract profile information from the resume text into strict JSON format.

CRITICAL RULE FOR "education":
Extract ONLY the candidate's actual academic degree, major, faculty, and university (e.g., "BACHELOR'S DEGREE, COMPUTER SCIENCE, Faculty of computers & Information Helwan University 2009 - 2013").
Do NOT extract work experience descriptions, project summaries, or sentences mentioning "educational tool", "educational platform", or similar job duties as the candidate's education.

Resume Text:
${parsedText.substring(0, 4000)}

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

    const completion = await openai.chat.completions.create({
      model: getTargetModel(),
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    let rawParsed: Record<string, any> = {};

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        rawParsed = JSON.parse(jsonMatch[0]);
      } else {
        rawParsed = JSON.parse(content);
      }
    } catch (e) {
      console.warn('Failed to parse LLM JSON output, using raw text fallback:', e);
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

    let extractedEducation = getVal(['education', 'degree', 'qualification', 'university']);

    // Ignore if LLM erroneously grabbed a work experience sentence like "educational tool..."
    if (!extractedEducation || /educational\s+(tool|content|platform|game|users)/i.test(String(extractedEducation))) {
      extractedEducation = extractEducationFallback(parsedText);
    }

    const parsedProfile = {
      firstName: getVal(['firstName', 'first_name', 'name']) || '',
      lastName: getVal(['lastName', 'last_name']) || '',
      education: extractedEducation || '',
      fieldOfInterest: getVal(['fieldOfInterest', 'field_of_interest', 'domain', 'specialization']) || 'Technology',
      experienceLevel: getVal(['experienceLevel', 'experience_level']) || 'MID_LEVEL',
      careerGoal: getVal(['careerGoal', 'career_goal', 'target_role', 'title']) || 'Software Professional',
      extractedSkills: getVal(['extractedSkills', 'extracted_skills', 'skills']) || [],
    };

    console.log('Parsed Profile Output:', parsedProfile);

    return NextResponse.json({
      parsedProfile,
      parsedTextSnippet: parsedText.substring(0, 300),
    });
  } catch (error) {
    console.error('Error in /api/onboarding/parse-cv:', error);
    return NextResponse.json(
      { error: 'Failed to parse CV and extract profile.' },
      { status: 500 }
    );
  }
}
