'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/Sidebar';
import { AIMentorIframeDrawer } from '@/components/mentor/AIMentorIframeDrawer';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    firstName: string;
    lastName: string;
    path: 'STUDENT' | 'JOB_SEEKER';
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (!data.profile) {
          router.push('/onboarding');
          return;
        }

        setUserProfile(data.profile);
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#F8F9FE] flex flex-col items-center justify-center text-slate-500 space-y-3 font-sans">
        <Loader2 className="h-9 w-9 text-[#6C5CE7] animate-spin" />
        <span className="text-xs font-extrabold text-[#1E1B4B]">Loading your portal...</span>
      </div>
    );
  }

  const fullName = userProfile
    ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim()
    : 'User';

  return (
    <div className="flex h-screen bg-[#F8F9FE] text-[#1E1B4B] overflow-hidden font-sans">
      <Sidebar
        userPath={userProfile?.path || 'JOB_SEEKER'}
        userName={fullName || 'User'}
        onOpenMentor={() => setIsMentorOpen(true)}
      />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {children}
      </main>

      <AIMentorIframeDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
      />
    </div>
  );
}

