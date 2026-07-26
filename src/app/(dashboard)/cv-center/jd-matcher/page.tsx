'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ActiveCVBanner, ResumeData } from '@/components/cv/ActiveCVBanner';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, AlertTriangle, Tag, DollarSign, RefreshCw, Briefcase, Building, FileText } from 'lucide-react';

interface MatchReportResult {
  matchReportId: string;
  resumeFileName?: string;
  overallMatchScore: number;
  matchQualityTier: 'STRONG_FIT' | 'GOOD_POTENTIAL' | 'WORTH_EXPLORING' | 'WEAK_MATCH';
  context: {
    positionTitle: string;
    companyName: string;
  };
  strengths: string[];
  criticalGaps: string[];
  keywordAnalysis: {
    present: string[];
    missing: string[];
  };
  salaryAlignment: {
    marketRange: string;
    targetSalary: string;
    impliedCompanyBudget: string;
    negotiationTip: string;
  };
}

export default function JobDescriptionMatcherPage() {
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [loadingActiveResume, setLoadingActiveResume] = useState(true);
  const [positionTitle, setPositionTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<MatchReportResult | null>(null);

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

  const handleAnalyzeMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
      setError('Please paste or type a valid job description (at least 20 characters).');
      return;
    }

    if (!activeResume) {
      setError('Please upload your CV first to perform job description matching.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cv/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionTitle,
          companyName,
          jobDescriptionText,
          resumeId: activeResume.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze match');

      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze job description match');
    } finally {
      setLoading(false);
    }
  };

  const tierBadgeConfig = {
    STRONG_FIT: { label: 'Strong Fit', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    GOOD_POTENTIAL: { label: 'Good Potential', class: 'bg-[#F5F4FE] text-[#6C5CE7] border-[#E4E0FF]' },
    WORTH_EXPLORING: { label: 'Worth Exploring', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    WEAK_MATCH: { label: 'Weak Match', class: 'bg-[#F8F9FE] text-[#52528C] border-[#E4E0FF]' },
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-12">
      {/* Header */}
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
            Job Description Matcher
          </h1>
          <p className="text-xs sm:text-sm text-[#52528C] mt-1 font-medium">
            Compare your active CV against any job description to discover match scores, skill gaps, and salary negotiation tips.
          </p>
        </div>

        {report && (
          <button
            onClick={() => setReport(null)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#1E1B4B] text-xs font-extrabold transition-colors border border-[#E4E0FF] shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Analyze Another Job</span>
          </button>
        )}
      </div>

      {/* Active CV Banner */}
      {!loadingActiveResume && (
        <ActiveCVBanner
          activeResume={activeResume}
          onResumeUpdated={(updatedResume) => {
            setActiveResume(updatedResume);
            setError('');
          }}
        />
      )}

      {!report ? (
        /* Form View */
        <form onSubmit={handleAnalyzeMatch} className="bg-white border border-[#E4E0FF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">
                Position Title (Optional)
              </label>
              <div className="relative">
                <Briefcase className="h-4 w-4 absolute left-3.5 top-3.5 text-[#8E9BBA]" />
                <input
                  type="text"
                  placeholder="e.g. Senior Data Analyst"
                  value={positionTitle}
                  onChange={(e) => setPositionTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-xs focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">
                Company Name (Optional)
              </label>
              <div className="relative">
                <Building className="h-4 w-4 absolute left-3.5 top-3.5 text-[#8E9BBA]" />
                <input
                  type="text"
                  placeholder="e.g. TechCorp Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-xs focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">
              Target Job Description Text *
            </label>
            <textarea
              required
              rows={8}
              placeholder="Paste the full job posting description here including required skills, responsibilities, and qualifications..."
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-xs leading-relaxed focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !activeResume}
            className="w-full py-4 px-6 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Comparing Resume vs Job Description...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Analyze Job Description Match</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Result Report View */
        <div className="space-y-8">
          {/* Header Summary Card */}
          <div className="bg-white border border-[#E4E0FF] rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center space-x-2">
                <span className={`inline-block px-3.5 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${tierBadgeConfig[report.matchQualityTier]?.class || tierBadgeConfig.STRONG_FIT.class}`}>
                  {tierBadgeConfig[report.matchQualityTier]?.label || 'Strong Fit'}
                </span>
                {report.resumeFileName && (
                  <span className="px-3 py-1 rounded-full bg-[#F5F4FE] border border-[#E4E0FF] text-[#6C5CE7] text-xs font-extrabold flex items-center space-x-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>CV: {report.resumeFileName}</span>
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-[#1E1B4B]">
                {report.context.positionTitle}
              </h2>
              <p className="text-xs text-[#52528C] font-semibold">
                {report.context.companyName}
              </p>
            </div>

            {/* Score Pill */}
            <div className="px-6 py-4 rounded-3xl bg-[#F5F4FE] border border-[#E4E0FF] text-center shadow-inner shrink-0">
              <p className="text-3xl font-black text-[#6C5CE7]">{report.overallMatchScore}%</p>
              <p className="text-[11px] font-extrabold text-[#8E9BBA] uppercase tracking-wider mt-0.5">Match Score</p>
            </div>
          </div>

          {/* Strengths & Critical Gaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white border border-[#E4E0FF] rounded-3xl p-7 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-[#1E1B4B]">Strengths to Emphasize</h3>
              </div>
              <div className="space-y-2.5 pt-1">
                {report.strengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 font-semibold flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Gaps */}
            <div className="bg-white border border-[#E4E0FF] rounded-3xl p-7 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <h3 className="text-base font-black text-[#1E1B4B]">Critical Skill Gaps</h3>
              </div>
              <div className="space-y-2.5 pt-1">
                {report.criticalGaps.map((gap, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 font-semibold flex items-start space-x-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keyword Analysis Breakdown */}
          <div className="bg-white border border-[#E4E0FF] rounded-3xl p-7 shadow-sm space-y-5">
            <h3 className="text-base font-black text-[#1E1B4B]">Keyword Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-extrabold text-[#8E9BBA] uppercase tracking-wider mb-3">Present in Resume</p>
                <div className="flex flex-wrap gap-2">
                  {report.keywordAnalysis.present.map((kw, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#8E9BBA] uppercase tracking-wider mb-3">Missing from Resume</p>
                <div className="flex flex-wrap gap-2">
                  {report.keywordAnalysis.missing.map((kw, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
                      × {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Salary Alignment & Negotiation Tip */}
          <div className="bg-gradient-to-r from-[#1E1B4B] to-[#2D2A6E] rounded-3xl p-8 text-white shadow-xl space-y-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">Salary Alignment & Market Compensation</h3>
                <p className="text-xs text-purple-200 font-medium">Estimated salary analytics based on target role requirements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[11px] font-extrabold text-purple-200 uppercase tracking-wider">Market Salary Range</p>
                <p className="text-lg font-black mt-1">{report.salaryAlignment.marketRange}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[11px] font-extrabold text-purple-200 uppercase tracking-wider">Target Salary</p>
                <p className="text-lg font-black text-amber-400 mt-1">{report.salaryAlignment.targetSalary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[11px] font-extrabold text-purple-200 uppercase tracking-wider">Implied Company Budget</p>
                <p className="text-lg font-black text-emerald-400 mt-1">{report.salaryAlignment.impliedCompanyBudget}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/15 text-xs text-purple-100 leading-relaxed font-medium">
              <span className="font-extrabold text-amber-300">Negotiation Strategy: </span>
              {report.salaryAlignment.negotiationTip}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
