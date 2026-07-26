'use client';

import { Flame, Check } from 'lucide-react';

export interface WeeklyLogData {
  mon?: boolean;
  tue?: boolean;
  wed?: boolean;
  thu?: boolean;
  fri?: boolean;
  sat?: boolean;
  sun?: boolean;
}

interface StreakTrackerProps {
  currentStreak?: number;
  weeklyLog?: WeeklyLogData;
}

export function StreakTracker({
  currentStreak = 1,
  weeklyLog = { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: true },
}: StreakTrackerProps) {
  // Determine current day of week (0 = Sunday, 1 = Monday, etc.)
  const todayIndex = new Date().getDay();

  const days: { key: keyof WeeklyLogData; label: string; dayIndex: number }[] = [
    { key: 'mon', label: 'Mon', dayIndex: 1 },
    { key: 'tue', label: 'Tue', dayIndex: 2 },
    { key: 'wed', label: 'Wed', dayIndex: 3 },
    { key: 'thu', label: 'Thu', dayIndex: 4 },
    { key: 'fri', label: 'Fri', dayIndex: 5 },
    { key: 'sat', label: 'Sat', dayIndex: 6 },
    { key: 'sun', label: 'Sun', dayIndex: 0 },
  ];

  return (
    <div className="bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full font-sans">
      <div>
        <h3 className="text-sm font-extrabold text-[#1E1B4B] mb-2">Daily Streak</h3>
        <div className="flex items-center space-x-2.5 mb-4">
          <Flame className="h-6 w-6 text-[#FF6B00] fill-[#FF6B00]" />
          <span className="text-base font-black text-[#1E1B4B] tracking-tight">
            {currentStreak} {currentStreak === 1 ? 'DAY' : 'DAYS'}
          </span>
        </div>
        <div className="border-b border-[#E2DFFA] mb-5" />
      </div>

      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {days.map((day) => {
          const isCompleted = !!weeklyLog[day.key];
          const isToday = day.dayIndex === todayIndex;

          return (
            <div key={day.key} className="flex flex-col items-center space-y-2">
              {isToday ? (
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-[#6C5CE7] bg-white flex items-center justify-center shadow-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#6C5CE7]" />
                </div>
              ) : isCompleted ? (
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white shadow-sm shadow-[#6C5CE7]/30">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
              ) : (
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#ECE9FF]" />
              )}
              <span className={`text-[11px] font-extrabold ${isToday ? 'text-[#6C5CE7]' : 'text-[#52528C]'}`}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
