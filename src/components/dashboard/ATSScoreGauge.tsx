'use client';

interface ATSScoreGaugeProps {
  score?: number; // 0 to 100
}

export function ATSScoreGauge({ score = 82 }: ATSScoreGaugeProps) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <span className="text-xs font-extrabold text-[#1E1B4B] mb-2 uppercase tracking-wider">ATS Score</span>
      <div className="relative h-28 w-28 flex items-center justify-center">
        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-[#E0F7FE]"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-[#00C2FF] transition-all duration-1000 ease-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-extrabold text-[#6C5CE7]">{score}%</span>
        </div>
      </div>
    </div>
  );
}
