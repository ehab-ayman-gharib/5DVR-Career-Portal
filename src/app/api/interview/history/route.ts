import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interviews = await prisma.mockInterview.findMany({
      where: { userId: user.id },
      include: {
        report: {
          select: {
            id: true,
            communicationScore: true,
            technicalDepthScore: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    return NextResponse.json({ interviews });
  } catch (err) {
    console.error('Failed to fetch interview history:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
