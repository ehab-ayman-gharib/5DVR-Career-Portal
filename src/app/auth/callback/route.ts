import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user && data.user.email) {
      // Check User Profile for onboarding redirect
      const profile = await prisma.userProfile.findUnique({
        where: { id: data.user.id },
      });

      if (!profile) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Fallback if auth code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
