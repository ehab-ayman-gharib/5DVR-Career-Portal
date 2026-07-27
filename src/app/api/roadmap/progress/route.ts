import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { StageStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { itemId, completed } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    }

    // Find the item and verify ownership
    const item = await prisma.roadmapItem.findUnique({
      where: { id: itemId },
      include: {
        stage: {
          include: {
            roadmap: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (item.stage.roadmap.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Toggle item completion
    const isCompleted = typeof completed === 'boolean' ? completed : !item.isCompleted;

    await prisma.roadmapItem.update({
      where: { id: itemId },
      data: { isCompleted },
    });

    // Fetch all items in the stage to recompute stage progress
    const stageItems = await prisma.roadmapItem.findMany({
      where: { stageId: item.stageId },
    });

    const completedStageItems = stageItems.filter((i) => i.isCompleted).length;
    const progressPercent = Math.round((completedStageItems / stageItems.length) * 100);

    let stageStatus: StageStatus = StageStatus.IN_PROGRESS;
    if (progressPercent === 100) {
      stageStatus = StageStatus.COMPLETED;
    } else if (progressPercent === 0) {
      stageStatus = item.stage.stageOrder === 1 ? StageStatus.IN_PROGRESS : StageStatus.LOCKED;
    }

    await prisma.roadmapStage.update({
      where: { id: item.stageId },
      data: {
        progressPercent,
        status: stageStatus,
      },
    });

    // If current stage completed (100%), unlock next stage
    if (progressPercent === 100) {
      const nextStage = await prisma.roadmapStage.findFirst({
        where: {
          roadmapId: item.stage.roadmapId,
          stageOrder: item.stage.stageOrder + 1,
        },
      });

      if (nextStage && nextStage.status === StageStatus.LOCKED) {
        await prisma.roadmapStage.update({
          where: { id: nextStage.id },
          data: { status: StageStatus.IN_PROGRESS },
        });
      }
    }

    // Recompute total XP & Job Readiness score across the entire roadmap
    const allStages = await prisma.roadmapStage.findMany({
      where: { roadmapId: item.stage.roadmapId },
      include: { items: true },
    });

    let totalXP = 0;
    let totalItems = 0;
    let completedItemsCount = 0;

    allStages.forEach((stg) => {
      stg.items.forEach((it) => {
        totalItems++;
        if (it.isCompleted) {
          completedItemsCount++;
          totalXP += it.xpValue;
        }
      });
    });

    const jobReadinessScore = totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;

    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: item.stage.roadmapId },
      data: {
        totalXP,
        jobReadinessScore,
      },
      include: {
        stages: {
          orderBy: { stageOrder: 'asc' },
          include: { items: true },
        },
      },
    });

    return NextResponse.json({ roadmap: updatedRoadmap });
  } catch (err) {
    console.error('Failed to update roadmap progress:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
