import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { status: 'UNAUTHENTICATED', error: 'User is not logged in.' },
        { status: 401 }
      );
    }

    const email = user.email.toLowerCase();

    // Check user profile
    const profile = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    return NextResponse.json({
      status: 'APPROVED',
      email,
      hasProfile: !!profile,
      userPath: profile?.path || null,
    });
  } catch (error) {
    console.error('Error in /api/auth/verify:', error);
    return NextResponse.json(
      { status: 'ERROR', error: 'Internal server verification error.' },
      { status: 500 }
    );
  }
}
