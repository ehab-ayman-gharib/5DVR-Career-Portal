import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Search by reportId or interviewId
    let report = await prisma.interviewReport.findFirst({
      where: {
        OR: [{ id }, { interviewId: id }],
      },
      include: {
        interview: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (report.interview.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      reportId: report.id,
      interviewId: report.interview.id,
      mode: report.interview.mode,
      overallScore: report.interview.overallScore || 85,
      completedAt: report.interview.completedAt || report.createdAt,
      qualitativeSummary: report.qualitativeSummary,
      communicationScore: report.communicationScore,
      technicalDepthScore: report.technicalDepthScore,
      categoryAnalysis: report.categoryAnalysis,
      transcriptComparison: report.transcriptComparison,
    });
  } catch (err) {
    console.error('Failed to fetch interview report:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
