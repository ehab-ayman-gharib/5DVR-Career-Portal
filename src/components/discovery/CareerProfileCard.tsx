'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

export interface CareerMatchData {
  id: string;
  careerTitle: string;
  matchScore: number;
  matchCategory: 'STRONG_MATCH' | 'GOOD_POTENTIAL' | 'WORTH_EXPLORING';
  whyFits: string;
  skillGaps: string[];
  salaryMedian?: number;
  growthOutlook?: string;
}

interface CareerProfileCardProps {
  match: CareerMatchData;
  onSelectAsTarget?: (careerTitle: string) => void;
}

export function CareerProfileCard({ match, onSelectAsTarget }: CareerProfileCardProps) {
  const categoryConfig = {
    STRONG_MATCH: {
      badge: 'Strong Match',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      scoreClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    GOOD_POTENTIAL: {
      badge: 'Good Potential',
      badgeClass: 'bg-[#F5F4FE] text-[#6C5CE7] border-[#E4E0FF]',
      scoreClass: 'text-[#6C5CE7] bg-[#F5F4FE] border-[#E4E0FF]',
    },
    WORTH_EXPLORING: {
      badge: 'Worth Exploring',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      scoreClass: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  };

  const config = categoryConfig[match.matchCategory] || categoryConfig.GOOD_POTENTIAL;

  return (
    <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        {/* Header Badge & Match Percentage */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3.5 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${config.badgeClass}`}>
            {config.badge}
          </span>
          <div className={`px-3 py-1 rounded-xl border text-sm font-black flex items-center space-x-1 ${config.scoreClass}`}>
            <Sparkles className="h-4 w-4" />
            <span>{match.matchScore}% Match</span>
          </div>
        </div>

        <h3 className="text-xl font-black text-[#1E1B4B] group-hover:text-[#6C5CE7] transition-colors">
          {match.careerTitle}
        </h3>

        <p className="text-xs text-[#52528C] mt-2 leading-relaxed font-medium">
          {match.whyFits}
        </p>

        {/* Skill Gaps to Bridge */}
        <div className="mt-5 pt-4 border-t border-[#E4E0FF]">
          <span className="text-[11px] font-extrabold text-[#8E9BBA] uppercase tracking-wider block mb-2">
            Skill Gaps to Bridge
          </span>
          <div className="flex flex-wrap gap-1.5">
            {match.skillGaps.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#F8F9FE] border border-[#E4E0FF] text-[#52528C] text-xs font-extrabold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 mt-6 border-t border-[#E4E0FF] flex items-center justify-between gap-3">
        <Link
          href={`/discovery/profile/${encodeURIComponent(match.id)}`}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30"
        >
          <span>View Career Profile</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {onSelectAsTarget && (
          <button
            onClick={() => onSelectAsTarget(match.careerTitle)}
            className="py-3 px-4 rounded-2xl bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#1E1B4B] font-extrabold text-xs transition-colors shrink-0"
          >
            Set as Target
          </button>
        )}
      </div>
    </div>
  );
}
