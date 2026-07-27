'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StreakTracker } from '@/components/dashboard/StreakTracker';
import { ATSScoreGauge } from '@/components/dashboard/ATSScoreGauge';
import { TaskList } from '@/components/dashboard/TaskList';
import {
  Video,
  FileText,
  Bot,
  Sparkles,
  Briefcase,
  Target,
  Compass,
  Map,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function DashboardPage() {
  const [userPath, setUserPath] = useState<'JOB_SEEKER' | 'STUDENT'>('JOB_SEEKER');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    currentStreak: number;
    weeklyLog: Record<string, boolean>;
    atsScore: number;
    interviewsDone: number;
    improvement: number;
  }>({
    currentStreak: 1,
    weeklyLog: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
    atsScore: 0,
    interviewsDone: 0,
    improvement: 0,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setUserPath(data.profile.path);
            if (data.profile.firstName) {
              setUserName(data.profile.firstName);
            }
          }
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile in dashboard page:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const improvementPercent = Math.min(100, Math.max(0, stats.improvement * 4));

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto font-sans animate-in fade-in duration-200">
        {/* Top Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-6 sm:p-8 flex items-center justify-between min-h-[160px] animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-2xl bg-[#E8E5FF]" />
              <div className="space-y-3">
                <div className="h-7 w-48 bg-[#E2DFFA] rounded-xl" />
                <div className="h-4 w-72 bg-[#E2DFFA]/60 rounded-lg" />
                <div className="h-4 w-56 bg-[#E2DFFA]/60 rounded-lg" />
              </div>
            </div>
            <div className="hidden sm:block h-12 w-44 rounded-2xl bg-[#6C5CE7]/20" />
          </div>
          <div className="bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-6 flex flex-col justify-between min-h-[160px] animate-pulse">
            <div className="h-5 w-32 bg-[#E2DFFA] rounded-lg" />
            <div className="flex justify-between items-center px-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full bg-[#E2DFFA]" />
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-6 min-h-[180px] flex items-center justify-around animate-pulse">
            <div className="h-28 w-28 rounded-full bg-[#E2DFFA]" />
            <div className="h-28 w-28 rounded-full bg-[#E2DFFA]" />
            <div className="h-28 w-28 rounded-full bg-[#E2DFFA]" />
          </div>
          <div className="bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-6 min-h-[180px] space-y-3 animate-pulse">
            <div className="h-5 w-36 bg-[#E2DFFA] rounded-lg" />
            <div className="h-9 w-full bg-[#E2DFFA]/70 rounded-xl" />
            <div className="h-9 w-full bg-[#E2DFFA]/70 rounded-xl" />
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-[#E2DFFA] rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#FAF9FF] border border-[#E4E0FF] rounded-3xl p-5 h-44 flex flex-col justify-between animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-[#E8E5FF]" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-[#E2DFFA] rounded-lg" />
                  <div className="h-3 w-36 bg-[#E2DFFA]/60 rounded-lg" />
                </div>
                <div className="h-9 w-full bg-[#6C5CE7]/20 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Section: Welcome Banner & Daily Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card Banner */}
        <div className="lg:col-span-2 bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center space-x-6 z-10">
            {/* Mascot Robot Graphic */}
            <div className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 flex items-center justify-center bg-[#E8E5FF] rounded-2xl border border-[#D8D2FF] p-2">
              <svg className="w-full h-full text-[#6C5CE7]" viewBox="0 0 100 100" fill="none">
                {/* Robot Head */}
                <rect x="25" y="25" width="50" height="45" rx="12" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="4"/>
                {/* Antenna */}
                <line x1="50" y1="25" x2="50" y2="12" stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="50" cy="10" r="5" fill="#00C2FF"/>
                {/* Robot Eyes */}
                <circle cx="40" cy="42" r="5" fill="#1E1B4B"/>
                <circle cx="60" cy="42" r="5" fill="#1E1B4B"/>
                {/* Cheeks */}
                <circle cx="34" cy="48" r="3" fill="#FF8A8A"/>
                <circle cx="66" cy="48" r="3" fill="#FF8A8A"/>
                {/* Smile */}
                <path d="M 43 54 Q 50 60 57 54" fill="none" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round"/>
                {/* Body */}
                <rect x="30" y="73" width="40" height="20" rx="8" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="4"/>
                <rect x="42" y="80" width="16" height="8" rx="3" fill="#E0F7FE"/>
              </svg>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] tracking-tight">
                Welcome, {userName}!
              </h1>
              <p className="text-xs sm:text-sm text-[#52528C] leading-relaxed max-w-md">
                We're here to help you prepare for the job market with confidence. Practice interviews, strengthen your skills, and get guidance every step of the way.
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 sm:self-end z-10 w-full sm:w-auto">
            <Link
              href="/interview"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#6C5CE7]/30 transition-all whitespace-nowrap"
            >
              Start Mock Interview
            </Link>
          </div>
        </div>

        {/* Daily Streak Tracker */}
        <StreakTracker currentStreak={stats.currentStreak} weeklyLog={stats.weeklyLog} />
      </div>

      {userPath === 'JOB_SEEKER' ? (
        /* Job Seeker Dashboard View */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Middle Section: Metrics Gauge Row & Today's Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ATS Score & Interviews Done Row */}
            <div className="lg:col-span-2 bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-6 shadow-sm flex flex-col justify-center">
              <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
                {/* ATS Score */}
                <ATSScoreGauge score={stats.atsScore} />

                {/* Interviews Done */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-extrabold text-[#1E1B4B] mb-2 uppercase tracking-wider">Interviews Done</span>
                  <div className="h-24 w-24 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white shadow-md shadow-[#6C5CE7]/30">
                    <span className="text-2xl font-black">{stats.interviewsDone}</span>
                  </div>
                </div>

                {/* Improvement */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-extrabold text-[#1E1B4B] mb-2 uppercase tracking-wider">Improvement</span>
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-[#E2DFFA]"
                        strokeWidth="7"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-[#6C5CE7]"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={(2 * Math.PI * 38) * (1 - improvementPercent / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base font-black text-[#6C5CE7]">+{stats.improvement}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Tasks */}
            <TaskList />
          </div>

          {/* Quick Actions Row */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-[#1E1B4B]">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Mock Interviews */}
              <div className="bg-white border border-[#E4E0FF] hover:border-[#6C5CE7] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-[#3C388B] flex items-center justify-center text-white shadow-sm">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1E1B4B] mb-1">Mock Interviews</h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      To enhance your skills and prepare for real interview.
                    </p>
                  </div>
                </div>
                <Link
                  href="/interview"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-bold text-xs text-center shadow-sm transition-colors block"
                >
                  Practice Now
                </Link>
              </div>

              {/* Card 2: ATS Analyzer */}
              <div className="bg-white border border-[#E4E0FF] hover:border-[#6C5CE7] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-[#3C388B] flex items-center justify-center text-white shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1E1B4B] mb-1">ATS Analyzer</h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Get an ATS score and feedback on keywords and formatting.
                    </p>
                  </div>
                </div>
                <Link
                  href="/cv-center/ats"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-bold text-xs text-center shadow-sm transition-colors block"
                >
                  Analyze CV
                </Link>
              </div>

              {/* Card 3: Ask AI Mentor */}
              <div className="bg-white border border-[#E4E0FF] hover:border-[#6C5CE7] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-[#3C388B] flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1E1B4B] mb-1">Ask AI Mentor</h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Get guidance on your next learning step
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const mentorBtn = document.querySelector('button[title="Ask AI Mentor"]') as HTMLButtonElement;
                    if (mentorBtn) mentorBtn.click();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-bold text-xs text-center shadow-sm transition-colors block"
                >
                  Ask Your Mentor
                </button>
              </div>

              {/* Card 4: Match Job Description */}
              <div className="bg-white border border-[#E4E0FF] hover:border-[#6C5CE7] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-[#3C388B] flex items-center justify-center text-white shadow-sm">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1E1B4B] mb-1">Match Job Description</h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Upload a Job Description. The AI compares it to the CV.
                    </p>
                  </div>
                </div>
                <Link
                  href="/cv-center/jd-matcher"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-bold text-xs text-center shadow-sm transition-colors block"
                >
                  Analyze Job Description
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Student Dashboard View */
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Discovery Quiz CTA */}
            <div className="md:col-span-2 bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-7 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-extrabold text-[#6C5CE7] uppercase tracking-wider">Self-Discovery Journey</span>
                <h2 className="text-2xl font-black text-[#1E1B4B] mt-2 mb-3 tracking-tight">Career Discovery Quizzes</h2>
                <p className="text-[#52528C] text-xs sm:text-sm leading-relaxed mb-6">
                  Complete 5 psychological and cognitive assessments to discover your ideal career archetypes and matched roles.
                </p>
              </div>
              <Link
                href="/discovery"
                className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/30 transition-all self-start"
              >
                <Compass className="h-4 w-4" />
                <span>Take Career Discovery Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Roadmap Progress Widget */}
            <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-[#1E1B4B] uppercase tracking-wider">Roadmap Progress</span>
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-xl font-black text-[#1E1B4B] mb-2">Data Visualization</div>
                <div className="w-full bg-[#E0F7FE] h-3 rounded-full overflow-hidden mb-2">
                  <div className="bg-[#00C2FF] h-full w-[42%]" />
                </div>
                <p className="text-xs text-[#00C2FF] font-extrabold">42% In Progress</p>
              </div>

              <Link
                href="/roadmap"
                className="inline-flex items-center space-x-1 text-xs text-[#6C5CE7] hover:underline font-bold mt-4"
              >
                <span>View Full Roadmap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-extrabold text-[#1E1B4B]">Student Learning Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/discovery"
                  className="p-5 rounded-2xl bg-white border border-[#E4E0FF] hover:border-[#00C2FF] transition-all flex items-start space-x-4 group shadow-sm hover:shadow-md"
                >
                  <div className="p-3 rounded-xl bg-[#E0F7FE] text-[#00C2FF] group-hover:scale-105 transition-transform">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#1E1B4B] mb-1">Discovery Assessments</h4>
                    <p className="text-xs text-[#64748B]">Interest, personality & cognitive quizzes.</p>
                  </div>
                </Link>

                <Link
                  href="/roadmap"
                  className="p-5 rounded-2xl bg-white border border-[#E4E0FF] hover:border-[#6C5CE7] transition-all flex items-start space-x-4 group shadow-sm hover:shadow-md"
                >
                  <div className="p-3 rounded-xl bg-[#F5F4FE] text-[#6C5CE7] group-hover:scale-105 transition-transform">
                    <Map className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#1E1B4B] mb-1">Adaptive Roadmap</h4>
                    <p className="text-xs text-[#64748B]">Milestone timeline & XP tracker.</p>
                  </div>
                </Link>
              </div>
            </div>

            <TaskList />
          </div>
        </div>
      )}
    </div>
  );
}
