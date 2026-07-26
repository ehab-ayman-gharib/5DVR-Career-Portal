'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Target } from 'lucide-react';

export default function LandingPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-[#1E1B4B] flex flex-col justify-between font-sans">
      <header className="px-8 py-6 flex items-center justify-between border-b border-[#E4E0FF] bg-white">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white shadow-md shadow-[#6C5CE7]/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#1E1B4B]">Career Portal</span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-bold text-sm transition-all shadow-md shadow-[#6C5CE7]/20"
        >
          Sign In
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#E0F7FE] border border-[#BBEFFD] text-[#00C2FF] text-sm font-extrabold mb-8">
          <Sparkles className="h-4 w-4 text-[#00C2FF]" />
          <span>AI-Powered Career Readiness & Development Platform</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-[#1E1B4B] tracking-tight leading-tight mb-6 max-w-4xl">
          From Self-Discovery to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#00C2FF]">Employment Ready</span>
        </h1>

        <p className="text-lg md:text-xl text-[#52528C] max-w-2xl mb-12 leading-relaxed font-medium">
          Tailored learning roadmaps for students and high-impact CV intelligence with realistic mock interview simulations for job seekers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={handleGoogleLogin}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-base transition-all flex items-center justify-center space-x-3 shadow-lg shadow-[#6C5CE7]/30"
          >
            <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.3 7.31 24 12 24z"/>
              <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.01-3.13z"/>
              <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.6l4.01 3.13c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Sign in with Google</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="p-7 rounded-3xl bg-[#F5F4FE] border border-[#E4E0FF] shadow-sm">
            <ShieldCheck className="h-8 w-8 text-[#00C2FF] mb-4" />
            <h3 className="text-lg font-black text-[#1E1B4B] mb-2">Instant Google Sign-In</h3>
            <p className="text-[#64748B] text-xs leading-relaxed">Seamless Google OAuth registration and instant access for all students & job seekers.</p>
          </div>
          <div className="p-7 rounded-3xl bg-[#F5F4FE] border border-[#E4E0FF] shadow-sm">
            <Cpu className="h-8 w-8 text-[#6C5CE7] mb-4" />
            <h3 className="text-lg font-black text-[#1E1B4B] mb-2">CV Intelligence & ATS</h3>
            <p className="text-[#64748B] text-xs leading-relaxed">Real-time resume scoring, keyphrase gap analysis, and job description matching.</p>
          </div>
          <div className="p-7 rounded-3xl bg-[#F5F4FE] border border-[#E4E0FF] shadow-sm">
            <Target className="h-8 w-8 text-[#00C2FF] mb-4" />
            <h3 className="text-lg font-black text-[#1E1B4B] mb-2">Adaptive Roadmaps</h3>
            <p className="text-[#64748B] text-xs leading-relaxed">Personalized milestone pathways that evolve based on assessment and task performance.</p>
          </div>
        </div>
      </main>

      <footer className="px-8 py-6 text-center text-xs text-[#52528C] border-t border-[#E4E0FF] bg-white">
        © 2026 Career Portal. All rights reserved.
      </footer>
    </div>
  );
}
