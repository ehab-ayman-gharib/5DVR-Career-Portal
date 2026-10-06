import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized user' },
        { status: 401 }
      );
    }

    const latestResume = await prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { uploadedAt: 'desc' },
    });

    return NextResponse.json({
      resume: latestResume || null,
    });
  } catch (error) {
    console.error('Error fetching active resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active resume.' },
      { status: 500 }
    );
  }
}

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

    // parsedText is no longer extracted locally — PDF is analyzed directly by OpenAI in the ATS/parse-cv routes
    const parsedText = `Resume file: ${file.name}`;

    // Simple keyword extraction for skills preview
    const skillKeywords = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'Agile'];
    const extractedSkills = skillKeywords.filter((skill) =>
      parsedText.toLowerCase().includes(skill.toLowerCase())
    );

    const resumeRecord = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileUrl: `/uploads/${file.name}`,
        fileSizeBytes: file.size,
        parsedText,
        parsedData: {
          skills: extractedSkills,
          experience: [],
          education: [],
        },
      },
    });

    return NextResponse.json({
      success: true,
      resume: resumeRecord,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to save resume in database.' },
      { status: 500 }
    );
  }
}
