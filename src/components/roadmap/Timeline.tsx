'use client';

import { CheckCircle2, Lock, Sparkles, Clock, ArrowRight } from 'lucide-react';

export interface TimelineStageData {
  id: string;
  stageOrder: number;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  progressPercent: number;
}

interface TimelineProps {
  stages: TimelineStageData[];
  onSelectStage?: (stageOrder: number) => void;
  activeStageOrder?: number;
}

export function Timeline({ stages, onSelectStage, activeStageOrder = 1 }: TimelineProps) {
  return (
    <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#F0EDFF] pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#1E1B4B]">Career Pathway Milestones</h3>
          <p className="text-xs text-[#64748B]">Sequential learning stages leading to job readiness</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#F5F4FE] border border-[#E4E0FF] text-xs font-black text-[#6C5CE7]">
          {stages.filter((s) => s.status === 'COMPLETED').length} of {stages.length} Stages Mastered
        </span>
      </div>

      {/* Horizontal Milestone Connector Track */}
      <div className="relative pt-4 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'COMPLETED';
            const isInProgress = stage.status === 'IN_PROGRESS';
            const isLocked = stage.status === 'LOCKED';
            const isCurrentSelected = activeStageOrder === stage.stageOrder;

            let circleClass = 'bg-[#FAF9FF] text-[#64748B] border-[#E4E0FF]';
            let statusPill = 'bg-slate-100 text-slate-600 border-slate-200';

            if (isCompleted) {
              circleClass = 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20';
              statusPill = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            } else if (isInProgress) {
              circleClass = 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-md shadow-[#6C5CE7]/30 ring-4 ring-[#E8E5FF]';
              statusPill = 'bg-[#F5F4FE] text-[#6C5CE7] border-[#E4E0FF]';
            }

            return (
              <button
                key={stage.id}
                onClick={() => !isLocked && onSelectStage && onSelectStage(stage.stageOrder)}
                disabled={isLocked}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  isCurrentSelected
                    ? 'bg-[#F5F4FE] border-[#6C5CE7] ring-2 ring-[#6C5CE7]/30'
                    : 'bg-white border-[#E4E0FF] hover:border-[#6C5CE7]/60'
                } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`h-8 w-8 rounded-xl border flex items-center justify-center text-xs font-black transition-transform ${circleClass}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isLocked ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <span>{stage.stageOrder}</span>
                    )}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase ${statusPill}`}>
                    {isCompleted ? 'Done' : isInProgress ? 'In Progress' : 'Locked'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-[#8E9BBA] uppercase tracking-wider block">
                    Stage {stage.stageOrder}
                  </span>
                  <h4 className="text-xs font-extrabold text-[#1E1B4B] line-clamp-2 mt-0.5 leading-snug">
                    {stage.title}
                  </h4>
                </div>

                {/* Progress bar inside timeline card */}
                <div className="w-full bg-[#E2DFFA] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-[#6C5CE7]'
                    }`}
                    style={{ width: `${stage.progressPercent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
