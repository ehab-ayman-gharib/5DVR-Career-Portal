'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ActiveCVBanner, ResumeData } from '@/components/cv/ActiveCVBanner';
import { CVUploader } from '@/components/cv/CVUploader';
import { FixRecommendations, ActionableFix } from '@/components/cv/FixRecommendations';
import { ArrowLeft, RefreshCw, Sparkles, Loader2, FileText, CheckCircle2, AlertTriangle, Tag, Layout } from 'lucide-react';

interface ATSReportResult {
  reportId: string;
  fileName: string;
  score: number;
  metrics: {
    missingKeywordsCount: number;
    formattingIssuesCount: number;
    redFlagsCount: number;
  };
  missingKeywords: string[];
  actionableFixes: ActionableFix[];
}

export default function ATSAnalyzerPage() {
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [loadingActiveResume, setLoadingActiveResume] = useState(true);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ATSReportResult | null>(null);

  useEffect(() => {
    async function loadResume() {
      try {
        const res = await fetch('/api/cv/resume');
        const data = await res.json();
        if (data.resume) {
          setActiveResume(data.resume);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingActiveResume(false);
      }
    }
    loadResume();
  }, []);

  const handleAnalyzeActiveCV = async () => {
    if (!activeResume) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cv/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: activeResume.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze resume');

      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeNewCV = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cv/ats', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse resume');

      setReport(data);
      if (data.resumeId) {
        setActiveResume({
          id: data.resumeId,
          fileName: file.name,
          fileSizeBytes: file.size,
          uploadedAt: new Date().toISOString(),
          parsedText: '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link
              href="/cv-center"
              className="p-1.5 rounded-xl bg-white border border-[#E4E0FF] hover:bg-[#F8F9FE] text-[#1E1B4B] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs font-extrabold text-[#6C5CE7] uppercase tracking-wider">
              CV Intelligence Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B4B]">
            ATS Resume Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-[#52528C] mt-1 font-medium">
            Evaluate your active resume or upload a new one against recruiter ATS algorithms.
          </p>
        </div>

        {report && (
          <button
            onClick={() => setReport(null)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#1E1B4B] text-xs font-extrabold transition-colors border border-[#E4E0FF] shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Analyze Another Resume</span>
          </button>
        )}
      </div>

      {/* Active CV Banner */}
      {!loadingActiveResume && (
        <ActiveCVBanner
          activeResume={activeResume}
          onResumeUpdated={(updatedResume) => setActiveResume(updatedResume)}
        />
      )}

      {!report ? (
        /* Selection & Upload View */
        <div className="space-y-6">
          {/* Active Resume Quick Option */}
          {activeResume && (
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1E1B4B] to-[#2D2A6E] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-black text-purple-200 uppercase tracking-wider">
                  Recommended
                </span>
                <h3 className="text-xl font-black text-white pt-1">
                  Analyze Active Resume
                </h3>
                <p className="text-xs text-purple-200 font-medium">
                  File: <span className="font-bold text-white">{activeResume.fileName}</span>
                </p>
              </div>

              <button
                onClick={handleAnalyzeActiveCV}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Evaluating Active CV...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Run ATS Analysis</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Alternative Upload Box */}
          <div className="bg-white border border-[#E4E0FF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="text-center max-w-md mx-auto space-y-2">
              <h2 className="text-lg font-extrabold text-[#1E1B4B]">
                {activeResume ? 'Or Upload a New Resume' : 'Upload Your Resume'}
              </h2>
              <p className="text-xs text-[#52528C] font-medium leading-relaxed">
                Scan your PDF/DOCX file for ATS keywords, formatting readability, and recruiter red flags.
              </p>
            </div>

            <CVUploader onAnalyze={handleAnalyzeNewCV} loading={loading} />
          </div>
        </div>
      ) : (
        /* ATS Analysis Result Report View */
        <div className="space-y-8">
          {/* Top Score & Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Score Radial Indicator Card */}
            <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="relative h-28 w-28 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#F5F4FE]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#6C5CE7] transition-all duration-1000 ease-out"
                    strokeDasharray={`${report.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-[#1E1B4B]">{report.score}</span>
                  <span className="text-[10px] font-extrabold text-[#8E9BBA] uppercase">/ 100</span>
                </div>
              </div>

              <span className="text-xs font-black text-[#1E1B4B] mt-3 uppercase tracking-wider">
                Overall ATS Score
              </span>
            </div>

            {/* Metric Counter 1: Missing Keywords */}
            <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#8E9BBA] uppercase tracking-wider">Missing Keywords</span>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Tag className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-[#1E1B4B]">{report.metrics.missingKeywordsCount}</p>
                <p className="text-xs text-[#52528C] mt-1 font-medium">Critical terms omitted</p>
              </div>
            </div>

            {/* Metric Counter 2: Formatting Issues */}
            <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#8E9BBA] uppercase tracking-wider">Formatting Issues</span>
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Layout className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-[#1E1B4B]">{report.metrics.formattingIssuesCount}</p>
                <p className="text-xs text-[#52528C] mt-1 font-medium">Structural flaws</p>
              </div>
            </div>

            {/* Metric Counter 3: Red Flags */}
            <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#8E9BBA] uppercase tracking-wider">Recruiter Red Flags</span>
                <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-[#1E1B4B]">{report.metrics.redFlagsCount}</p>
                <p className="text-xs text-[#52528C] mt-1 font-medium">High risk items</p>
              </div>
            </div>
          </div>

          {/* Missing Keywords Box */}
          {report.missingKeywords && report.missingKeywords.length > 0 && (
            <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-sm font-extrabold text-[#1E1B4B] uppercase tracking-wider">
                Recommended Industry Keywords to Add
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.missingKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-[#E8E5FF] border border-[#D8D2FF] text-[#6C5CE7] text-xs font-extrabold"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fix Recommendations List */}
          <FixRecommendations fixes={report.actionableFixes} />
        </div>
      )}
    </div>
  );
}
