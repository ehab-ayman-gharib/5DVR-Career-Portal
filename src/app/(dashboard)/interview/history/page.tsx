'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  Video,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react';

interface InterviewHistoryItem {
  id: string;
  mode: string;
  durationSeconds: number;
  status: string;
  overallScore: number | null;
  startedAt: string;
  completedAt: string | null;
  report: {
    id: string;
    communicationScore: number;
    technicalDepthScore: number;
  } | null;
}

export default function InterviewHistoryPage() {
  const [interviews, setInterviews] = useState<InterviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/interview/history');
        if (res.ok) {
          const data = await res.json();
          if (data.interviews) {
            setInterviews(data.interviews);
          }
        }
      } catch (err) {
        console.error('Failed to load interview history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const completedInterviews = interviews.filter((i) => i.status === 'COMPLETED');
  const avgScore =
    completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / completedInterviews.length
        )
      : 0;

  const formatModeName = (mode: string) => {
    switch (mode) {
      case 'TECHNICAL':
        return 'Technical Interview';
      case 'HR_BEHAVIORAL':
        return 'HR & Behavioral';
      case 'SALARY_NEGOTIATION':
        return 'Salary Negotiation';
      case 'PROBLEM_SOLVING':
        return 'Problem Solving & Case';
      default:
        return mode;
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.round(sec / 60);
    return `${mins} mins`;
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 font-sans text-slate-500">
        <Loader2 className="h-10 w-10 text-[#6C5CE7] animate-spin" />
        <span className="text-sm font-extrabold text-[#1E1B4B]">Loading Interview Practice History...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#2D2A6E] to-[#6C5CE7] p-8 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md">
            Practice Log & Feedback Archive
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            Interview Practice History
          </h1>
          <p className="text-sm text-purple-100 mt-2 leading-relaxed font-medium">
            Review your past mock interview sessions, monitor performance trends over time, and revisit detailed STAR feedback reports.
          </p>

          <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-white/10 text-xs font-extrabold text-purple-200">
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-[#00C2FF]" />
              <span>{interviews.length} Total Sessions Initiated</span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span>{avgScore > 0 ? `${avgScore}% Average Overall Score` : 'No Completed Scores Yet'}</span>
            </div>
          </div>
        </div>

        {/* Decorative Spheres */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#6C5CE7]/30 blur-3xl" />
      </div>

      {/* Main Table / History List */}
      <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#F0EDFF] pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#1E1B4B]">Completed & Past Practice Rounds</h2>
            <p className="text-xs text-[#52528C]">Chronological log of all recorded AI Avatar interview sessions</p>
          </div>

          <Link
            href="/interview"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs shadow-md shadow-[#6C5CE7]/30 transition-colors"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Start New Practice Round</span>
          </Link>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-[#F5F4FE] border border-[#E4E0FF] flex items-center justify-center text-[#6C5CE7] mx-auto">
              <Video className="h-8 w-8 text-[#6C5CE7]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1E1B4B]">No Practice Interviews Found</h3>
            <p className="text-xs text-[#52528C] max-w-sm mx-auto">
              Launch your first 5D AI Avatar interview session to generate feedback scores and STAR performance breakdowns.
            </p>
            <Link
              href="/interview"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#6C5CE7] text-white font-extrabold text-xs shadow-md shadow-[#6C5CE7]/30"
            >
              <span>Explore Interview Modes</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((item) => {
              const isCompleted = item.status === 'COMPLETED';
              const reportId = item.report?.id || item.id;

              return (
                <div
                  key={item.id}
                  className="bg-[#FAF9FF] border border-[#E4E0FF] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-[#E4E0FF] flex items-center justify-center text-[#6C5CE7] shrink-0 shadow-2xs">
                      <Video className="h-6 w-6 text-[#6C5CE7]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-extrabold text-[#1E1B4B]">
                          {formatModeName(item.mode)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-[#64748B] font-medium">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {new Date(item.startedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDuration(item.durationSeconds)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E4E0FF]">
                    {item.overallScore !== null && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase">Overall Score</span>
                        <span className="text-xl font-black text-[#6C5CE7]">{item.overallScore}%</span>
                      </div>
                    )}

                    <Link
                      href={`/interview/report/${reportId}`}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#E4E0FF] hover:bg-[#6C5CE7] hover:text-white text-[#1E1B4B] font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-2xs"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View Feedback Report</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
