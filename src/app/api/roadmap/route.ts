import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { ItemType, StageStatus } from '@prisma/client';

const DEFAULT_STAGES = [
  {
    order: 1,
    title: 'Foundational Math & Python Programming',
    status: StageStatus.IN_PROGRESS,
    progressPercent: 66,
    items: [
      { itemType: ItemType.LECTURE, title: 'Advanced Python OOP & Data Structures', isCompleted: true, xpValue: 50 },
      { itemType: ItemType.PRACTICE_TASK, title: 'Vectorized NumPy & Pandas Data Cleaning', isCompleted: true, xpValue: 100 },
      { itemType: ItemType.INTERVIEW_CHECKPOINT, title: 'Python Core Logic Coding Challenge', isCompleted: false, xpValue: 150 },
    ],
  },
  {
    order: 2,
    title: 'Machine Learning & Statistical Modeling',
    status: StageStatus.LOCKED,
    progressPercent: 0,
    items: [
      { itemType: ItemType.LECTURE, title: 'Supervised Learning: Regression & Classification', isCompleted: false, xpValue: 50 },
      { itemType: ItemType.PRACTICE_TASK, title: 'Train Scikit-Learn Model & Evaluate Metrics', isCompleted: false, xpValue: 100 },
      { itemType: ItemType.INTERVIEW_CHECKPOINT, title: 'ML Algorithms & Feature Engineering Scenario', isCompleted: false, xpValue: 150 },
    ],
  },
  {
    order: 3,
    title: 'Deep Learning & Neural Network Architectures',
    status: StageStatus.LOCKED,
    progressPercent: 0,
    items: [
      { itemType: ItemType.LECTURE, title: 'PyTorch Fundamentals & Backpropagation', isCompleted: false, xpValue: 50 },
      { itemType: ItemType.PRACTICE_TASK, title: 'Build Convolutional & Transformer Neural Nets', isCompleted: false, xpValue: 100 },
      { itemType: ItemType.INTERVIEW_CHECKPOINT, title: 'Deep Learning System Design Simulation', isCompleted: false, xpValue: 150 },
    ],
  },
  {
    order: 4,
    title: 'Production MLOps, Pipelines & Cloud Deployment',
    status: StageStatus.LOCKED,
    progressPercent: 0,
    items: [
      { itemType: ItemType.LECTURE, title: 'Containerizing ML APIs with Docker & FastAPI', isCompleted: false, xpValue: 50 },
      { itemType: ItemType.PRACTICE_TASK, title: 'Deploy Scalable Inference Pipeline to GCP', isCompleted: false, xpValue: 100 },
      { itemType: ItemType.INTERVIEW_CHECKPOINT, title: 'Production Concurrency & Latency Checkpoint', isCompleted: false, xpValue: 150 },
    ],
  },
  {
    order: 5,
    title: 'Capstone System Design & Job Readiness',
    status: StageStatus.LOCKED,
    progressPercent: 0,
    items: [
      { itemType: ItemType.LECTURE, title: 'End-to-End System Design for High Concurrency', isCompleted: false, xpValue: 50 },
      { itemType: ItemType.PRACTICE_TASK, title: 'Complete Full-Stack AI Portfolio Capstone', isCompleted: false, xpValue: 100 },
      { itemType: ItemType.INTERVIEW_CHECKPOINT, title: 'Final Executive Technical Panel Simulation', isCompleted: false, xpValue: 150 },
    ],
  },
];

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedCareer = searchParams.get('career') || 'AI & Data Systems Engineer';

    let profile = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          id: user.id,
          email: user.email || 'user@example.com',
          firstName: user.user_metadata?.first_name || 'Student',
          lastName: user.user_metadata?.last_name || '',
          path: 'STUDENT',
        },
      });
    }

    let roadmap = await prisma.roadmap.findUnique({
      where: { userId: user.id },
      include: {
        stages: {
          orderBy: { stageOrder: 'asc' },
          include: {
            items: true,
          },
        },
      },
    });

    // If no roadmap exists or title changed, seed initial roadmap
    if (!roadmap) {
      roadmap = await prisma.roadmap.create({
        data: {
          userId: user.id,
          careerPathTitle: requestedCareer,
          jobReadinessScore: 35,
          totalXP: 150,
          estimatedMonths: 4,
          stages: {
            create: DEFAULT_STAGES.map((stage) => ({
              stageOrder: stage.order,
              title: stage.title,
              status: stage.status,
              progressPercent: stage.progressPercent,
              items: {
                create: stage.items.map((item) => ({
                  itemType: item.itemType,
                  title: item.title,
                  isCompleted: item.isCompleted,
                  xpValue: item.xpValue,
                })),
              },
            })),
          },
        },
        include: {
          stages: {
            orderBy: { stageOrder: 'asc' },
            include: { items: true },
          },
        },
      });
    } else if (requestedCareer && roadmap.careerPathTitle !== requestedCareer) {
      roadmap = await prisma.roadmap.update({
        where: { id: roadmap.id },
        data: { careerPathTitle: requestedCareer },
        include: {
          stages: {
            orderBy: { stageOrder: 'asc' },
            include: { items: true },
          },
        },
      });
    }

    return NextResponse.json({ roadmap });
  } catch (err) {
    console.error('Failed to get roadmap:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
