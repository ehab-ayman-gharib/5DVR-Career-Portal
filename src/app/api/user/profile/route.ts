import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthenticated' },
        { status: 401 }
      );
    }

    // 1. Fetch UserProfile
    const profile = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    // Helper to get current day of week key
    const getTodayKey = (): 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' => {
      const day = new Date().getDay();
      const map: Record<number, 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'> = {
        0: 'sun',
        1: 'mon',
        2: 'tue',
        3: 'wed',
        4: 'thu',
        5: 'fri',
        6: 'sat',
      };
      return map[day] || 'sun';
    };

    const todayKey = getTodayKey();

    // 2. Fetch or initialize DailyStreak
    let streakRecord = await prisma.dailyStreak.findUnique({
      where: { userId: user.id },
    });

    if (!streakRecord && profile) {
      const initialLog = {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
        [todayKey]: true,
      };
      streakRecord = await prisma.dailyStreak.create({
        data: {
          userId: user.id,
          currentStreak: 1,
          lastActiveDate: new Date(),
          weeklyLog: initialLog,
        },
      });
    } else if (streakRecord) {
      // Auto-mark active for today
      const currentLog = (streakRecord.weeklyLog as Record<string, boolean>) || {};
      if (!currentLog[todayKey]) {
        const updatedLog = { ...currentLog, [todayKey]: true };
        streakRecord = await prisma.dailyStreak.update({
          where: { id: streakRecord.id },
          data: {
            weeklyLog: updatedLog,
            lastActiveDate: new Date(),
          },
        });
      }
    }

    // 3. Fetch latest Resume & ATSReport
    const latestResume = await prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { uploadedAt: 'desc' },
      include: { atsReport: true },
    });

    const atsScore = latestResume?.atsReport?.score || (latestResume ? 75 : 0);

    // 4. Fetch count of completed MockInterviews
    let interviewsDone = 0;
    try {
      interviewsDone = await prisma.mockInterview.count({
        where: { userId: user.id },
      });
    } catch {
      interviewsDone = 0;
    }

    // 5. Compute Improvement score
    const improvementValue = atsScore > 0 ? Math.min(25, Math.round((atsScore / 10) + interviewsDone * 2)) : 0;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      profile,
      stats: {
        currentStreak: streakRecord?.currentStreak || 1,
        weeklyLog: streakRecord?.weeklyLog || { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, [todayKey]: true },
        atsScore,
        interviewsDone,
        improvement: improvementValue,
      },
    });
  } catch (err) {
    console.error('Error fetching user profile stats:', err);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
