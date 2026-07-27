'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DISCOVERY_ASSESSMENTS } from '@/lib/data/discovery-questions';
import { Compass, UserCheck, Zap, Brain, BookOpen, Clock, CheckCircle2, ArrowRight, Sparkles, Trophy } from 'lucide-react';

const iconMap: Record<string, any> = {
  Compass,
  UserCheck,
  Zap,
  Brain,
  BookOpen,
};

export default function CareerDiscoveryHubPage() {
  const [completedTypes, setCompletedTypes] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await fetch('/api/discovery/assessment');
        const data = await res.json();
        if (data.assessments) {
          const map: Record<string, boolean> = {};
          data.assessments.forEach((a: any) => {
            if (a.status === 'COMPLETED') {
              map[a.type] = true;
            }
          });
          setCompletedTypes(map);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssessments();
  }, []);

  const totalCompleted = Object.values(completedTypes).filter(Boolean).length;
  const overallProgress = Math.round((totalCompleted / DISCOVERY_ASSESSMENTS.length) * 100);

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-12">
      {/* Header Banner Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#2D2A6E] to-[#6C5CE7] p-8 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md">
            Students Only • Undergrad Pathway
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            Career Discovery Assessments
          </h1>
          <p className="text-sm text-purple-100 mt-2 leading-relaxed">
            Uncover your strengths, motivators, personality traits, and cognitive style to unlock ranked career matches tailored for you.
          </p>

          <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <span className="text-xs font-extrabold text-white">
                {totalCompleted} of {DISCOVERY_ASSESSMENTS.length} Assessments Completed
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div className="text-xs font-semibold text-purple-200">
              {overallProgress}% Overall Progress
            </div>
          </div>
        </div>

        {/* Decorative Floating Spheres */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#6C5CE7]/30 blur-3xl" />
        <div className="absolute right-20 top-4 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl" />
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DISCOVERY_ASSESSMENTS.map((assessment) => {
          const IconComponent = iconMap[assessment.iconName] || Compass;
          const isDone = !!completedTypes[assessment.type];

          return (
            <div
              key={assessment.id}
              className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#F5F4FE] border border-[#E4E0FF] flex items-center justify-center text-[#6C5CE7] group-hover:scale-110 transition-transform">
                    <IconComponent className="h-6 w-6 text-[#6C5CE7]" />
                  </div>

                  {isDone ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#F8F9FE] text-[#52528C] border border-[#E4E0FF] text-xs font-extrabold">
                      Not Started
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-[#1E1B4B]">
                  {assessment.title}
                </h3>
                <p className="text-xs text-[#52528C] mt-1.5 leading-relaxed font-medium">
                  {assessment.subtitle}
                </p>

                <div className="flex items-center space-x-4 mt-4 text-xs font-bold text-[#8E9BBA]">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>~{assessment.estimatedMinutes} mins</span>
                  </div>
                  <span>•</span>
                  <span>{assessment.totalQuestions} Questions</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E4E0FF]">
                <Link
                  href={`/discovery/quiz/${assessment.id}`}
                  className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all ${
                    isDone
                      ? 'bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#1E1B4B]'
                      : 'bg-[#6C5CE7] hover:bg-[#5849E0] text-white shadow-md shadow-[#6C5CE7]/30'
                  }`}
                >
                  <span>{isDone ? 'Retake Assessment' : 'Start Assessment'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA to View Career Matches */}
      <div className="p-8 rounded-3xl bg-[#F5F4FE] border border-[#E4E0FF] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-white border border-[#E4E0FF] flex items-center justify-center text-[#6C5CE7] shadow-sm shrink-0">
            <Sparkles className="h-7 w-7 text-[#6C5CE7]" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1E1B4B]">Ready to explore your matched careers?</h3>
            <p className="text-xs text-[#52528C] mt-0.5 font-medium">
              View your ranked career recommendations based on your assessment results.
            </p>
          </div>
        </div>

        <Link
          href="/discovery/options"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30 shrink-0"
        >
          <span>View Career Matches</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
