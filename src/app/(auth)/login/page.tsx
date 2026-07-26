'use client';

import { createClient } from '@/lib/supabase/client';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
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
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-[#E4E0FF] rounded-3xl p-8 shadow-xl text-center">
        <div className="h-12 w-12 rounded-2xl bg-[#6C5CE7] flex items-center justify-center mx-auto mb-6 text-white shadow-md shadow-[#6C5CE7]/30">
          <Sparkles className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-black text-[#1E1B4B] mb-2">Welcome to Career Portal</h1>
        <p className="text-[#64748B] text-xs mb-8 leading-relaxed">
          Sign in or register instantly with any Google account to access your personalized portal.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full px-6 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-sm transition-all flex items-center justify-center space-x-3 shadow-md shadow-[#6C5CE7]/30"
        >
          <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.3 7.31 24 12 24z"/>
            <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.01-3.13z"/>
            <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.6l4.01 3.13c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-8 text-xs text-[#52528C]">
          Open to all students, job seekers, and career professionals.
        </p>
      </div>
    </div>
  );
}
