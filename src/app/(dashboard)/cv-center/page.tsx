'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ActiveCVBanner, ResumeData } from '@/components/cv/ActiveCVBanner';
import { FileText, Target, ArrowRight, CheckCircle2, ShieldCheck, DollarSign, AlertCircle } from 'lucide-react';

export default function CVCenterHubPage() {
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActiveResume() {
      try {
        const res = await fetch('/api/cv/resume');
        const data = await res.json();
        if (data.resume) {
          setActiveResume(data.resume);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadActiveResume();
  }, []);

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#2D2A6E] to-[#6C5CE7] p-8 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md">
            CV Intelligence Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            Optimize Your CV for Recruiter Systems
          </h1>
          <p className="text-sm text-purple-100 mt-2 leading-relaxed font-medium">
            Upload your CV once to run ATS readability analysis, fix critical red flags, and match your skills against target job postings.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10 text-xs font-extrabold text-purple-200">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>ATS Score Evaluation</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Target className="h-4 w-4 text-amber-400" />
              <span>JD Match Analysis</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <DollarSign className="h-4 w-4 text-indigo-300" />
              <span>Salary Intelligence</span>
            </div>
          </div>
        </div>

        {/* Decorative Floating Spheres */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#6C5CE7]/30 blur-3xl" />
        <div className="absolute right-20 top-4 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl" />
      </div>

      {/* Unified Active CV Banner */}
      {!loading && (
        <ActiveCVBanner
          activeResume={activeResume}
          onResumeUpdated={(updatedResume) => setActiveResume(updatedResume)}
        />
      )}

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tool 1: ATS Analyzer */}
        <div className="bg-white border border-[#E4E0FF] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
          <div className="space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-[#F5F4FE] border border-[#E4E0FF] flex items-center justify-center text-[#6C5CE7] group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-[#6C5CE7]" />
            </div>

            <h2 className="text-2xl font-black text-[#1E1B4B]">
              ATS Resume Analyzer
            </h2>

            <p className="text-xs sm:text-sm text-[#52528C] leading-relaxed font-medium">
              Upload or use your active CV to compute an overall ATS score out of 100, detect missing keywords, formatting errors, and recruiter red flags.
            </p>

            <div className="space-y-2 pt-2">
              {[
                'ATS Readability Score (0 - 100)',
                'Missing industry keywords detection',
                'Actionable fix recommendations with severity tags',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-extrabold text-[#1E1B4B]">
                  <CheckCircle2 className="h-4 w-4 text-[#6C5CE7] shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[#E4E0FF]">
            <Link
              href="/cv-center/ats"
              className="w-full py-4 px-6 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30"
            >
              <span>Analyze Resume for ATS</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Tool 2: JD Matcher */}
        <div className="bg-white border border-[#E4E0FF] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
          <div className="space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Target className="h-7 w-7 text-indigo-600" />
            </div>

            <h2 className="text-2xl font-black text-[#1E1B4B]">
              Job Description Matcher
            </h2>

            <p className="text-xs sm:text-sm text-[#52528C] leading-relaxed font-medium">
              Paste any target job description to calculate your match quality tier against your active CV, highlight key strengths, flag critical skill gaps, and get salary negotiation strategies.
            </p>

            <div className="space-y-2 pt-2">
              {[
                'Match Quality Tier (Strong Fit, Good Potential, etc.)',
                'Present vs Missing Keyword breakdown table',
                'Market salary alignment & negotiation strategy tips',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-extrabold text-[#1E1B4B]">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[#E4E0FF]">
            <Link
              href="/cv-center/jd-matcher"
              className="w-full py-4 px-6 rounded-2xl bg-[#1E1B4B] hover:bg-[#2D2A6E] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#1E1B4B]/30"
            >
              <span>Launch Job Description Matcher</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
