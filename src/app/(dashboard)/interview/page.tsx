'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Video,
  Code,
  Users,
  DollarSign,
  Brain,
  Clock,
  ArrowRight,
  Sparkles,
  History,
  CheckCircle2,
  Play,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface InterviewModeCard {
  id: 'TECHNICAL' | 'HR_BEHAVIORAL' | 'SALARY_NEGOTIATION' | 'PROBLEM_SOLVING';
  title: string;
  subtitle: string;
  duration: string;
  icon: any;
  color: string;
  badgeColor: string;
  description: string;
  features: string[];
}

const MODES: InterviewModeCard[] = [
  {
    id: 'TECHNICAL',
    title: 'Technical Interview',
    subtitle: 'System Design & Code Logic',
    duration: '20 Mins',
    icon: Code,
    color: 'from-blue-600 to-indigo-700',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'Practice high-frequency system architecture, database optimization, and algorithm question scenarios.',
    features: ['System Design & Concurrency', 'Database Query Optimization', 'STAR Technical Breakdown'],
  },
  {
    id: 'HR_BEHAVIORAL',
    title: 'HR & Behavioral',
    subtitle: 'Soft Skills & Culture Fit',
    duration: '15 Mins',
    icon: Users,
    color: 'from-purple-600 to-indigo-700',
    badgeColor: 'bg-purple-100 text-purple-800',
    description: 'Master situational answers using the STAR method (Situation, Task, Action, Result) for executive HR rounds.',
    features: ['Conflict Resolution Scenarios', 'Leadership & Ownership', 'STAR Answer Comparison'],
  },
  {
    id: 'SALARY_NEGOTIATION',
    title: 'Salary Negotiation',
    subtitle: 'Offer Strategy & Compensation',
    duration: '10 Mins',
    icon: DollarSign,
    color: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Simulate high-stakes counter-offer conversations, target salary justification, and benefit package pitching.',
    features: ['Market Benchmark Justification', 'Handling Initial Lowballs', 'Total Package Pitching'],
  },
  {
    id: 'PROBLEM_SOLVING',
    title: 'Problem Solving & Case',
    subtitle: 'Analytical & Estimation',
    duration: '20 Mins',
    icon: Brain,
    color: 'from-amber-600 to-orange-700',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Tackle unstructured business problems, Fermi estimations, and metrics drop-off diagnostics.',
    features: ['Root Cause Analysis Frameworks', 'Market Sizing Estimations', 'Trade-off Decision Making'],
  },
];

export default function MockInterviewHubPage() {
  const router = useRouter();
  const [loadingMode, setLoadingMode] = useState<string | null>(null);

  const handleStartInterview = async (mode: string) => {
    setLoadingMode(mode);
    try {
      const res = await fetch('/api/interview/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });

      if (!res.ok) {
        throw new Error('Failed to create interview session');
      }

      const data = await res.json();
      router.push(`/interview/room/${data.interviewId}`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Unable to launch interview session. Please try again.');
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-12">
      {/* Top Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#2D2A6E] to-[#6C5CE7] p-8 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md">
              AI Avatar Mock Interviews
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Avatar Ready</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Practice Real-Time Video Interviews
          </h1>

          <p className="text-sm text-purple-100 mt-2 leading-relaxed font-medium">
            Simulate realistic interviews with our 5D AI Avatar. Receive instant STAR-method scorecards, transcript breakdowns, and recruiter-grade answer improvements.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10">
            <Link
              href="/interview/history"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs transition-colors backdrop-blur-md border border-white/10"
            >
              <History className="h-4 w-4 text-[#00C2FF]" />
              <span>View Past Practice History</span>
            </Link>
          </div>
        </div>

        {/* Decorative Spheres */}
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[#6C5CE7]/30 blur-3xl" />
        <div className="absolute right-16 top-4 h-36 w-36 rounded-full bg-indigo-400/20 blur-2xl" />
      </div>

      {/* Mode Selection Grid Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl font-black text-[#1E1B4B]">Select Practice Mode</h2>
          <p className="text-xs text-[#52528C] mt-0.5">
            Choose an interview style tailored to your current interview preparation goals
          </p>
        </div>
      </div>

      {/* 4 Interview Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isLoading = loadingMode === mode.id;

          return (
            <div
              key={mode.id}
              className="bg-white border border-[#E4E0FF] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-[#F5F4FE] border border-[#E4E0FF] flex items-center justify-center text-[#6C5CE7] group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-[#6C5CE7]" />
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F5F4FE] border border-[#E4E0FF] text-[11px] font-extrabold text-[#6C5CE7]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{mode.duration}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-[#00C2FF] uppercase tracking-wider">
                    {mode.subtitle}
                  </span>
                  <h3 className="text-2xl font-black text-[#1E1B4B] mt-0.5">
                    {mode.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#52528C] leading-relaxed font-medium">
                  {mode.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#F0EDFF]">
                  {mode.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs font-extrabold text-[#1E1B4B]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E4E0FF]">
                <button
                  onClick={() => handleStartInterview(mode.id)}
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#6C5CE7]/30 disabled:opacity-75"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Initializing AI Avatar Session...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>Start {mode.title}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
