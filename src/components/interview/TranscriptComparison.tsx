'use client';

import { CheckCircle2, AlertTriangle, Sparkles, HelpCircle, MessageSquare } from 'lucide-react';

export interface TranscriptItem {
  question: string;
  detectedTranscript: string;
  weaknesses?: string[];
  improvedAnswer: string;
}

interface TranscriptComparisonProps {
  items: TranscriptItem[];
}

export function TranscriptComparison({ items }: TranscriptComparisonProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center space-x-3 mb-2">
        <div className="h-9 w-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white shadow-md">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-[#1E1B4B]">
            STAR Method Answer Breakdown
          </h3>
          <p className="text-xs text-[#52528C]">
            Compare your detected response against optimal recruiter-backed answers
          </p>
        </div>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-[#E4E0FF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all hover:shadow-md"
        >
          {/* Question Header */}
          <div className="flex items-start space-x-3 pb-4 border-b border-[#F0EDFF]">
            <span className="px-3 py-1 rounded-xl bg-[#F5F4FE] border border-[#E4E0FF] text-xs font-black text-[#6C5CE7] shrink-0">
              Q{index + 1}
            </span>
            <h4 className="text-base font-extrabold text-[#1E1B4B] leading-snug">
              {item.question}
            </h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Candidate Original Answer Card */}
            <div className="bg-[#FAF9FF] border border-[#E4E0FF] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-[#64748B]">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  <span>Your Recorded Answer</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1E1B4B] leading-relaxed italic bg-white p-4 rounded-xl border border-[#E4E0FF]/60 font-medium">
                  "{item.detectedTranscript}"
                </p>
              </div>

              {/* Weaknesses / Areas for Improvement */}
              {item.weaknesses && item.weaknesses.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E4E0FF]/50">
                  <span className="text-[11px] font-extrabold text-amber-600 flex items-center space-x-1 uppercase tracking-wider">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Areas for Improvement</span>
                  </span>
                  <div className="space-y-1.5">
                    {item.weaknesses.map((w, wIdx) => (
                      <div
                        key={wIdx}
                        className="flex items-start space-x-2 text-xs font-semibold text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60"
                      >
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Improved STAR Answer Card */}
            <div className="bg-gradient-to-br from-[#F5F4FE] to-[#EEECFF] border border-[#D8D2FF] rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-black text-[#6C5CE7]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="uppercase tracking-wider">✅ Improved STAR Answer</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6C5CE7] text-white text-[10px] font-extrabold uppercase">
                  Model Response
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#D8D2FF] text-xs sm:text-sm text-[#1E1B4B] leading-relaxed font-medium shadow-2xs space-y-2">
                {item.improvedAnswer}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
