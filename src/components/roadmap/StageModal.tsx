'use client';

import { X, CheckCircle2, BookOpen, Code, Video, ExternalLink, Sparkles, Trophy } from 'lucide-react';
import { StageData } from './MilestoneCard';

interface StageModalProps {
  stage: StageData | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleItem: (itemId: string, currentStatus: boolean) => void;
}

export function StageModal({ stage, isOpen, onClose, onToggleItem }: StageModalProps) {
  if (!isOpen || !stage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-white border border-[#E4E0FF] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col justify-between shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E4E0FF] bg-[#F5F4FE] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white font-black text-sm shadow-sm">
              {stage.stageOrder}
            </div>
            <div>
              <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-wider">
                Stage {stage.stageOrder} Details
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#1E1B4B] leading-tight">
                {stage.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#1E1B4B] hover:bg-[#E8E5FF] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Stage Overview */}
          <div className="bg-[#FAF9FF] border border-[#E4E0FF] rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-black text-[#1E1B4B] uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-[#6C5CE7]" />
              <span>Learning Stage Objectives</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#52528C] leading-relaxed font-medium">
              Master core concepts, complete hands-on practice tasks, and validate your skills with interactive interview simulation checkpoints before unlocking dependent stages.
            </p>
          </div>

          {/* Activity Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#1E1B4B] uppercase tracking-wider">
              Stage Activities & XP Rewards
            </h4>

            <div className="space-y-3">
              {stage.items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    item.isCompleted
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                      : 'bg-white border-[#E4E0FF] text-[#1E1B4B]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onToggleItem(item.id, item.isCompleted)}
                      className={`h-6 w-6 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${
                        item.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-[#D8D2FF] hover:border-[#6C5CE7]'
                      }`}
                    >
                      {item.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div>
                      <p className={`text-xs sm:text-sm font-extrabold ${item.isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] font-semibold text-[#8E9BBA]">
                        {item.itemType === 'LECTURE'
                          ? '📖 Core Reading & Video Lecture'
                          : item.itemType === 'PRACTICE_TASK'
                          ? '💻 Hands-on Code Exercise'
                          : '🎥 Mock Interview Simulation Checkpoint'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black">
                      +{item.xpValue} XP
                    </span>

                    <button
                      onClick={() => onToggleItem(item.id, item.isCompleted)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                        item.isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#6C5CE7] hover:bg-[#5849E0] text-white shadow-sm'
                      }`}
                    >
                      {item.isCompleted ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E0FF] bg-[#F5F4FE] flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#64748B]">
            Stage Progress: {stage.progressPercent}%
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs shadow-md shadow-[#6C5CE7]/30"
          >
            Close Stage Details
          </button>
        </div>
      </div>
    </div>
  );
}
