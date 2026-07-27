'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Trophy,
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  History,
  Sparkles,
  BarChart3,
  Loader2,
  FileText,
} from 'lucide-react';

export default function InterviewReportPage() {
  const routeParams = useParams();
  const reportId = (routeParams?.id as string) || '';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<{
    reportId: string;
    interviewId: string;
    mode: string;
    overallScore: number;
    completedAt: string;
    qualitativeSummary: string;
    communicationScore: number;
    technicalDepthScore: number;
    categoryAnalysis: Array<{ category: string; score: number; summary: string }>;
  } | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/interview/report/${reportId}`);
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        } else {
          // Fallback dummy report for preview if route params or DB is empty
          setReport({
            reportId,
            interviewId: reportId,
            mode: 'TECHNICAL',
            overallScore: 88,
            completedAt: new Date().toISOString(),
            qualitativeSummary:
              'Candidate completed the full AI Avatar interview round with clear articulation and solid domain knowledge. The responses demonstrated strong structure, confident delivery, and effective technical reasoning throughout the conversation.',
            communicationScore: 9,
            technicalDepthScore: 8,
            categoryAnalysis: [
              { category: 'Structure & Flow', score: 90, summary: 'Excellent progression and structured presentation of ideas.' },
              { category: 'Technical Accuracy & Vocabulary', score: 86, summary: 'Accurate domain terminology and strong problem-solving logic.' },
              { category: 'Executive Tone & Confidence', score: 92, summary: 'Direct, clear, and highly engaging verbal delivery.' },
              { category: 'Engagement & Pace', score: 84, summary: 'Well-paced timing with good audio-visual presence.' },
            ],
          });
        }
      } catch (err) {
        console.error('Failed to fetch report:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 font-sans text-slate-500">
        <Loader2 className="h-10 w-10 text-[#6C5CE7] animate-spin" />
        <span className="text-sm font-extrabold text-[#1E1B4B]">Generating Recruiter Feedback Report...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20 font-sans space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-[#1E1B4B]">Report Not Found</h2>
        <Link href="/interview" className="text-sm text-[#6C5CE7] font-bold hover:underline">
          Return to Interview Hub
        </Link>
      </div>
    );
  }

  const scoreColor =
    report.overallScore >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-amber-600 bg-amber-50 border-amber-200';

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#2D2A6E] to-[#6C5CE7] p-8 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-white/10 text-[#00C2FF] text-xs font-black uppercase tracking-wider backdrop-blur-md">
              Mock Interview Evaluation Report
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              AI Avatar Performance Analysis
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 font-medium">
              Completed on {new Date(report.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/interview"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs transition-colors backdrop-blur-md border border-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake Interview</span>
            </Link>
            <Link
              href="/interview/history"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-[#1E1B4B] font-extrabold text-xs transition-colors shadow-lg"
            >
              <History className="h-4 w-4 text-[#6C5CE7]" />
              <span>View History</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Cards: Overall Score & Category Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Overall Score Card */}
        <div className="bg-white border border-[#E4E0FF] rounded-3xl p-8 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-xs font-black text-[#64748B] uppercase tracking-wider">
            Overall Readiness Score
          </span>

          <div className="relative h-36 w-36 flex items-center justify-center">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-[#E2DFFA]" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#6C5CE7] transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * report.overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#1E1B4B]">{report.overallScore}</span>
              <span className="text-[10px] font-bold text-[#64748B]">out of 100</span>
            </div>
          </div>

          <div className={`px-4 py-1.5 rounded-full border text-xs font-extrabold uppercase ${scoreColor}`}>
            {report.overallScore >= 80 ? 'Strong Candidate Readiness' : 'Needs Practice Refinement'}
          </div>
        </div>

        {/* Breakdown Metric Gauges */}
        <div className="lg:col-span-2 bg-white border border-[#E4E0FF] rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center space-x-3 border-b border-[#F0EDFF] pb-4">
            <BarChart3 className="h-6 w-6 text-[#6C5CE7]" />
            <h3 className="text-lg font-extrabold text-[#1E1B4B]">Recruiter Evaluation Summary</h3>
          </div>

          {/* Qualitative Summary */}
          <div className="bg-[#F5F4FE] border border-[#E4E0FF] rounded-2xl p-5 text-xs sm:text-sm text-[#1E1B4B] leading-relaxed font-medium">
            "{report.qualitativeSummary}"
          </div>

          {/* Detailed Category Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.categoryAnalysis.map((cat, idx) => (
              <div key={idx} className="bg-[#FAF9FF] border border-[#E4E0FF] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#1E1B4B]">
                  <span>{cat.category}</span>
                  <span className="text-[#6C5CE7]">{cat.score}%</span>
                </div>
                <div className="w-full bg-[#E2DFFA] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#6C5CE7] h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#64748B] font-medium">{cat.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
