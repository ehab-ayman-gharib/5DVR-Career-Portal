import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized user.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      path,
      firstName,
      lastName,
      education,
      fieldOfInterest,
      experienceLevel,
      careerGoal,
      skills,
      extractedSkills,
    } = body;

    const finalFirstName = (firstName || '').trim() || 'Candidate';
    const finalLastName = (lastName || '').trim() || 'User';
    const skillsList = Array.isArray(skills) ? skills : (Array.isArray(extractedSkills) ? extractedSkills : []);

    if (!path) {
      return NextResponse.json(
        { error: 'Missing required profile path.' },
        { status: 400 }
      );
    }

    // Ensure no conflicting stale UserProfile with the same email exists under a different ID
    const existingByEmail = await prisma.userProfile.findUnique({
      where: { email: user.email.toLowerCase() },
    });

    if (existingByEmail && existingByEmail.id !== user.id) {
      await prisma.userProfile.delete({
        where: { id: existingByEmail.id },
      });
    }

    const profile = await prisma.userProfile.upsert({
      where: { id: user.id },
      update: {
        firstName: finalFirstName,
        lastName: finalLastName,
        path,
        education: education || null,
        fieldOfInterest: fieldOfInterest || null,
        experienceLevel: experienceLevel || 'ENTRY_LEVEL',
        careerGoal: careerGoal || null,
        skills: skillsList,
      },
      create: {
        id: user.id,
        email: user.email.toLowerCase(),
        firstName: finalFirstName,
        lastName: finalLastName,
        path,
        education: education || null,
        fieldOfInterest: fieldOfInterest || null,
        experienceLevel: experienceLevel || 'ENTRY_LEVEL',
        careerGoal: careerGoal || null,
        skills: skillsList,
      },
    });

    // Initialize daily streak
    await prisma.dailyStreak.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        currentStreak: 1,
        weeklyLog: {
          mon: true,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
          sun: false,
        },
      },
    });

    return NextResponse.json(
      { success: true, profileId: profile.id, redirectUrl: '/dashboard' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in /api/onboarding/profile:', error);
    return NextResponse.json(
      { error: 'Failed to create starter profile.' },
      { status: 500 }
    );
  }
}
