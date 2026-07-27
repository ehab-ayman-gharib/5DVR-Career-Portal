'use client';

import {
  CheckCircle2,
  Lock,
  BookOpen,
  Code,
  Video,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { ItemType, StageStatus } from '@prisma/client';

export interface RoadmapItemData {
  id: string;
  itemType: ItemType;
  title: string;
  isCompleted: boolean;
  xpValue: number;
}

export interface StageData {
  id: string;
  stageOrder: number;
  title: string;
  status: StageStatus;
  progressPercent: number;
  items: RoadmapItemData[];
}

interface MilestoneCardProps {
  stage: StageData;
  onToggleItem: (itemId: string, currentStatus: boolean) => void;
  onOpenStageDetails: (stage: StageData) => void;
}

export function MilestoneCard({ stage, onToggleItem, onOpenStageDetails }: MilestoneCardProps) {
  const isCompleted = stage.status === StageStatus.COMPLETED;
  const isInProgress = stage.status === StageStatus.IN_PROGRESS;
  const isLocked = stage.status === StageStatus.LOCKED;

  const getItemIcon = (type: ItemType) => {
    switch (type) {
      case ItemType.LECTURE:
        return <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />;
      case ItemType.PRACTICE_TASK:
        return <Code className="h-4 w-4 text-purple-500 shrink-0" />;
      case ItemType.INTERVIEW_CHECKPOINT:
        return <Video className="h-4 w-4 text-emerald-500 shrink-0" />;
      default:
        return <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />;
    }
  };

  const getItemBadge = (type: ItemType) => {
    switch (type) {
      case ItemType.LECTURE:
        return 'Lecture';
      case ItemType.PRACTICE_TASK:
        return 'Practice Task';
      case ItemType.INTERVIEW_CHECKPOINT:
        return 'Interview Checkpoint';
      default:
        return 'Learning Resource';
    }
  };

  return (
    <div
      className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between space-y-6 ${
        isLocked
          ? 'border-[#E4E0FF]/60 bg-[#FAF9FF]/40 opacity-75'
          : isInProgress
          ? 'border-[#6C5CE7] ring-1 ring-[#6C5CE7]/20 shadow-md'
          : 'border-[#E4E0FF] hover:border-[#6C5CE7]/60'
      }`}
    >
      <div className="space-y-4">
        {/* Header Stage Order & Status Pill */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`h-9 w-9 rounded-xl border flex items-center justify-center font-black text-xs ${
                isCompleted
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : isInProgress
                  ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                  : 'bg-[#FAF9FF] text-[#8E9BBA] border-[#E4E0FF]'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : stage.stageOrder}
            </div>
            <div>
              <span className="text-[10px] font-black text-[#8E9BBA] uppercase tracking-wider block">
                Stage {stage.stageOrder}
              </span>
              <h3 className="text-lg font-black text-[#1E1B4B] leading-tight">{stage.title}</h3>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider shrink-0 ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isInProgress
                ? 'bg-[#F5F4FE] text-[#6C5CE7] border-[#E4E0FF]'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Locked'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#64748B]">
            <span>Progress</span>
            <span className="text-[#6C5CE7]">{stage.progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E2DFFA] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-emerald-500' : 'bg-[#6C5CE7]'
              }`}
              style={{ width: `${stage.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Learning Activities Checklist */}
        <div className="space-y-2.5 pt-3 border-t border-[#F0EDFF]">
          <span className="text-[11px] font-black text-[#8E9BBA] uppercase tracking-wider block mb-2">
            Learning Activities & Challenges
          </span>

          {stage.items.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                item.isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200/60 text-slate-700'
                  : isLocked
                  ? 'bg-slate-50 border-slate-200/60 text-slate-400'
                  : 'bg-[#FAF9FF] border-[#E4E0FF] hover:bg-white text-[#1E1B4B]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => !isLocked && onToggleItem(item.id, item.isCompleted)}
                  disabled={isLocked}
                  className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                    item.isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white border-[#D8D2FF] hover:border-[#6C5CE7]'
                  }`}
                >
                  {item.isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>

                <div className="flex items-center space-x-2">
                  {getItemIcon(item.itemType)}
                  <div>
                    <p className={`text-xs font-extrabold ${item.isCompleted ? 'line-through text-slate-500' : ''}`}>
                      {item.title}
                    </p>
                    <span className="text-[10px] font-semibold text-[#8E9BBA]">{getItemBadge(item.itemType)}</span>
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black shrink-0">
                +{item.xpValue} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-4 border-t border-[#E4E0FF]">
        <button
          onClick={() => onOpenStageDetails(stage)}
          disabled={isLocked}
          className="w-full py-3 px-4 rounded-2xl bg-[#F5F4FE] hover:bg-[#6C5CE7] hover:text-white text-[#6C5CE7] font-extrabold text-xs flex items-center justify-center space-x-2 transition-all border border-[#E4E0FF] disabled:opacity-50 disabled:hover:bg-[#F5F4FE] disabled:hover:text-[#6C5CE7]"
        >
          <span>Explore Stage Details & Resources</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
