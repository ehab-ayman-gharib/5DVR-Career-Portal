import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { DISCOVERY_ASSESSMENTS } from '@/lib/data/discovery-questions';

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

    const body = await request.json();
    const { assessmentId, answers } = body;

    if (!assessmentId || !answers) {
      return NextResponse.json(
        { error: 'Assessment ID and answers are required.' },
        { status: 400 }
      );
    }

    const definition = DISCOVERY_ASSESSMENTS.find((a) => a.id === assessmentId);
    if (!definition) {
      return NextResponse.json(
        { error: 'Invalid assessment ID.' },
        { status: 400 }
      );
    }

    // Determine Archetype & Dominant Traits based on answers
    const answersList = Object.values(answers);
    const scaleNumericValues = Object.entries(answers)
      .map(([k, v]) => Number(v))
      .filter((n) => !isNaN(n));

    const avgScore = scaleNumericValues.length > 0
      ? scaleNumericValues.reduce((a, b) => a + b, 0) / scaleNumericValues.length
      : 3.5;

    let archetypeTitle = 'Strategic Innovator';
    let archetypedesc = 'You thrive on connecting dots, driving progress, and building solutions with strong vision.';

    if (definition.type === 'CAREER_INTEREST') {
      if (avgScore >= 4) {
        archetypeTitle = 'Analytical Architect';
        archetypedesc = 'You excel at deep analytical thinking, structured systems, and complex problem-solving.';
      } else if (avgScore >= 3) {
        archetypeTitle = 'Collaborative Builder';
        archetypedesc = 'You balance technical execution with strong team collaboration and practical results.';
      } else {
        archetypeTitle = 'Exploratory Creator';
        archetypedesc = 'You thrive in flexible, creative, and exploratory work environments.';
      }
    } else if (definition.type === 'PERSONALITY_TRAITS') {
      if (avgScore >= 4) {
        archetypeTitle = 'Disciplined Leader';
        archetypedesc = 'You combine structured planning, logical clarity, and natural leadership drive.';
      } else {
        archetypeTitle = 'Adaptive Strategist';
        archetypedesc = 'You navigate ambiguity with ease, making data-informed decisions in dynamic settings.';
      }
    } else if (definition.type === 'MOTIVATORS') {
      archetypeTitle = 'Impact-Driven Specialist';
      archetypedesc = 'Continuous growth, mastery, and real-world impact drive your highest satisfaction.';
    } else if (definition.type === 'COGNITIVE_ABILITIES') {
      archetypeTitle = 'Systematic Problem Solver';
      archetypedesc = 'You break down massive challenges into clear, actionable steps and fundamental principles.';
    } else if (definition.type === 'LEARNING_READINESS') {
      archetypeTitle = 'Agile Growth Mindset';
      archetypedesc = 'You embrace new domain challenges with high resilience and active feedback loops.';
    }

    const scoreSummary = {
      avgScore: Math.round(avgScore * 10) / 10,
      totalAnswered: answersList.length,
      archetypeTitle,
      archetypedesc,
      completedAt: new Date().toISOString(),
    };

    // Save Assessment to DB
    const assessmentRecord = await prisma.assessment.upsert({
      where: {
        id: body.existingId || `assessment-${user.id}-${definition.type}`,
      },
      update: {
        status: 'COMPLETED',
        answers,
        scoreSummary,
        completedAt: new Date(),
      },
      create: {
        id: `assessment-${user.id}-${definition.type}`,
        userId: user.id,
        type: definition.type,
        status: 'COMPLETED',
        answers,
        scoreSummary,
        completedAt: new Date(),
      },
    });

    // Also seed/update Career Matches for the user if completing assessments
    const mockMatches = [
      {
        careerTitle: 'AI & Data Systems Engineer',
        matchScore: 94,
        matchCategory: 'STRONG_MATCH' as const,
        whyFits: 'Your high score in complex problem solving and structured logic aligns perfectly with machine learning architecture.',
        skillGaps: ['Deep Learning', 'PyTorch', 'Distributed Systems'],
      },
      {
        careerTitle: 'Product Manager & Strategist',
        matchScore: 88,
        matchCategory: 'STRONG_MATCH' as const,
        whyFits: 'Strong leadership traits and desire for autonomy fit strategic product ownership.',
        skillGaps: ['Agile Leadership', 'Roadmap Prioritization'],
      },
      {
        careerTitle: 'Full-Stack Software Architect',
        matchScore: 82,
        matchCategory: 'GOOD_POTENTIAL' as const,
        whyFits: 'High craftsmanship focus and love for building systems from scratch.',
        skillGaps: ['System Design', 'Cloud Architecture'],
      },
      {
        careerTitle: 'UX & Creative Technologist',
        matchScore: 76,
        matchCategory: 'WORTH_EXPLORING' as const,
        whyFits: 'Blends visual design appreciation with interactive technology experimentation.',
        skillGaps: ['Figma Prototyping', 'User Research'],
      },
    ];

    // Seed mock matches into DB if not present
    for (const match of mockMatches) {
      await prisma.careerMatch.upsert({
        where: {
          id: `match-${user.id}-${match.careerTitle.replace(/\s+/g, '-').toLowerCase()}`,
        },
        update: {
          matchScore: match.matchScore,
          matchCategory: match.matchCategory,
          whyFits: match.whyFits,
          skillGaps: match.skillGaps,
        },
        create: {
          id: `match-${user.id}-${match.careerTitle.replace(/\s+/g, '-').toLowerCase()}`,
          userId: user.id,
          careerTitle: match.careerTitle,
          matchScore: match.matchScore,
          matchCategory: match.matchCategory,
          whyFits: match.whyFits,
          skillGaps: match.skillGaps,
        },
      });
    }

    return NextResponse.json({
      success: true,
      assessment: assessmentRecord,
      scoreSummary,
    });
  } catch (error) {
    console.error('Error in /api/discovery/assessment:', error);
    return NextResponse.json(
      { error: 'Failed to process assessment submission.' },
      { status: 500 }
    );
  }
}

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

    const assessments = await prisma.assessment.findMany({
      where: { userId: user.id },
    });

    const matches = await prisma.careerMatch.findMany({
      where: { userId: user.id },
      orderBy: { matchScore: 'desc' },
    });

    return NextResponse.json({
      assessments,
      matches,
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments.' },
      { status: 500 }
    );
  }
}
