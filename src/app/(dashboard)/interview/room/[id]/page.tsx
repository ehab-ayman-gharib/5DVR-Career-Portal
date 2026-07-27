'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AvatarIframe } from '@/components/interview/AvatarIframe';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Loader2,
  Video,
  ExternalLink,
} from 'lucide-react';

export default function ActiveInterviewRoomPage() {
  const routeParams = useParams();
  const interviewId = (routeParams?.id as string) || '';
  const router = useRouter();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [embedUrl, setEmbedUrl] = useState('https://5d-ai-hub.com/avatars/5dVR@HelmyDev_7cc59');
  const [modeTitle, setModeTitle] = useState('Technical Interview');

  // Load session avatar config
  useEffect(() => {
    async function initRoom() {
      try {
        const res = await fetch('/api/interview/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'TECHNICAL' }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.avatarConfig?.embedUrl) {
            setEmbedUrl(data.avatarConfig.embedUrl);
          }
          if (data.mode) {
            const formatted = data.mode.replace('_', ' ');
            setModeTitle(formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase());
          }
        }
      } catch (err) {
        console.error('Failed to load session details:', err);
      } finally {
        setLoadingSession(false);
      }
    }

    initRoom();
  }, []);

  // Timer counter for the whole interview session
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishInterview = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          elapsedSeconds,
        }),
      });

      if (!res.ok) {
        throw new Error('Evaluation failed');
      }

      const data = await res.json();
      router.push(`/interview/report/${data.reportId || interviewId}`);
    } catch (err) {
      console.error('Failed to submit evaluation:', err);
      alert('Generating report...');
      router.push(`/interview/report/${interviewId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 font-sans text-slate-500">
        <Loader2 className="h-10 w-10 text-[#6C5CE7] animate-spin" />
        <span className="text-sm font-extrabold text-[#1E1B4B]">Connecting to 5D AI Avatar Interviewer...</span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 font-sans max-w-7xl mx-auto overflow-hidden pb-2">
      {/* Room Header */}
      <div className="bg-white border border-[#E4E0FF] rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center space-x-4">
          <div className="h-9 w-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white font-bold">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-[#1E1B4B]">{modeTitle} Session</h1>
            <p className="text-[10px] text-[#64748B]">3rd-Party Avatar Interviewer</p>
          </div>
        </div>

        {/* Elapsed Timer & Complete Action */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-[#F5F4FE] px-4 py-1.5 rounded-xl border border-[#E4E0FF] text-xs font-extrabold text-[#1E1B4B]">
            <Clock className="h-4 w-4 text-[#6C5CE7]" />
            <span>Interview Time: {formatTimer(elapsedSeconds)}</span>
          </div>

          <button
            onClick={handleFinishInterview}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white text-xs font-extrabold shadow-md shadow-[#6C5CE7]/30 transition-all flex items-center space-x-2 disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Evaluating Session...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>End & Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Full-Size 5D AI Avatar Interview Room */}
      <div className="flex-1 w-full h-full min-h-0">
        <AvatarIframe embedUrl={embedUrl} />
      </div>
    </div>
  );
}
