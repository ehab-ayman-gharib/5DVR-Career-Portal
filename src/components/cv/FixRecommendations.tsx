'use client';

import { AlertTriangle, Layout, Tag, CheckCircle } from 'lucide-react';

export interface ActionableFix {
  type: 'RED_FLAG' | 'FORMATTING' | 'KEYWORD';
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  evidence?: string;
  recommendation: string;
}

interface FixRecommendationsProps {
  fixes: ActionableFix[];
}

export function FixRecommendations({ fixes }: FixRecommendationsProps) {
  const typeConfig = {
    RED_FLAG: {
      label: 'Red Flag',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
    },
    FORMATTING: {
      label: 'Formatting Issue',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Layout,
      iconColor: 'text-amber-600',
    },
    KEYWORD: {
      label: 'Keyword Opportunity',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Tag,
      iconColor: 'text-indigo-600',
    },
  };

  const severityConfig = {
    HIGH: 'bg-rose-100 text-rose-800 border-rose-300',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  if (!fixes || fixes.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-3">
        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
        <span>Great job! No major ATS formatting, red flags, or keyword issues detected.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#1E1B4B]">Actionable Fix Recommendations</h3>
        <span className="px-3 py-1 rounded-full bg-[#F5F4FE] text-[#6C5CE7] text-xs font-extrabold border border-[#E4E0FF]">
          {fixes.length} Items Found
        </span>
      </div>

      <div className="space-y-3">
        {fixes.map((fix, idx) => {
          const config = typeConfig[fix.type] || typeConfig.FORMATTING;
          const IconComp = config.icon;

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-[#E4E0FF] shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <div className={`p-2.5 rounded-xl border ${config.badgeClass} shrink-0 self-start`}>
                <IconComp className={`h-5 w-5 ${config.iconColor}`} />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${config.badgeClass}`}>
                    {config.label}
                  </span>
                  {fix.severity && (
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${severityConfig[fix.severity] || severityConfig.MEDIUM}`}>
                      {fix.severity} Priority
                    </span>
                  )}
                  <h4 className="text-sm font-extrabold text-[#1E1B4B]">
                    {fix.issue}
                  </h4>
                </div>

                {fix.evidence && (
                  <div className="text-xs bg-[#F8F9FE] border border-[#E4E0FF] rounded-xl px-3 py-2 text-[#52528C]">
                    <span className="font-bold text-[#1E1B4B]">Evidence from resume: </span>
                    <span className="italic font-medium">{fix.evidence}</span>
                  </div>
                )}

                <p className="text-xs text-[#52528C] leading-relaxed font-medium">
                  {fix.recommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
