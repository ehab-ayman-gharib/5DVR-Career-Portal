import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { InterviewMode } from '@prisma/client';

const DURATION_BY_MODE: Record<InterviewMode, number> = {
  TECHNICAL: 1200, // 20 mins
  HR_BEHAVIORAL: 900, // 15 mins
  SALARY_NEGOTIATION: 600, // 10 mins
  PROBLEM_SOLVING: 1200, // 20 mins
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const rawMode = body.mode || 'TECHNICAL';

    let mode: InterviewMode = InterviewMode.TECHNICAL;
    if (Object.values(InterviewMode).includes(rawMode as InterviewMode)) {
      mode = rawMode as InterviewMode;
    }

    // Ensure user profile exists
    let profile = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          id: user.id,
          email: user.email || 'user@example.com',
          firstName: user.user_metadata?.first_name || 'User',
          lastName: user.user_metadata?.last_name || '',
          path: 'JOB_SEEKER',
        },
      });
    }

    const durationSeconds = DURATION_BY_MODE[mode] || 900;

    const interview = await prisma.mockInterview.create({
      data: {
        userId: profile.id,
        mode,
        durationSeconds,
        status: 'IN_PROGRESS',
      },
    });

    const embedUrl =
      process.env.NEXT_PUBLIC_3RD_PARTY_AVATAR_EMBED_URL ||
      process.env['3RD_PARTY_AVATAR_EMBED_URL'] ||
      'https://5d-ai-hub.com/avatars/5dVR@HelmyDev_7cc59';

    return NextResponse.json(
      {
        interviewId: interview.id,
        mode: interview.mode,
        durationSeconds: interview.durationSeconds,
        avatarConfig: {
          embedUrl,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Failed to create interview session:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
