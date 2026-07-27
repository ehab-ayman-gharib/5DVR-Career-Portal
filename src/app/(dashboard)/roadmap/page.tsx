'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Timeline } from '@/components/roadmap/Timeline';
import { MilestoneCard, StageData } from '@/components/roadmap/MilestoneCard';
import { StageModal } from '@/components/roadmap/StageModal';
import {
  Map,
  Trophy,
  Award,
  Sparkles,
  Clock,
  ArrowRight,
  Compass,
  CheckCircle2,
  Loader2,
  Target,
} from 'lucide-react';

export default function CareerRoadmapPage() {
  const searchParams = useSearchParams();
  const requestedCareer = searchParams.get('career') || '';

  const [loading, setLoading] = useState(true);
  const [activeStageOrder, setActiveStageOrder] = useState<number>(1);
  const [selectedModalStage, setSelectedModalStage] = useState<StageData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [roadmap, setRoadmap] = useState<{
    id: string;
    careerPathTitle: string;
    jobReadinessScore: number;
    totalXP: number;
    estimatedMonths: number;
    stages: StageData[];
  } | null>(null);

  const fetchRoadmap = async () => {
    try {
      const url = requestedCareer ? `/api/roadmap?career=${encodeURIComponent(requestedCareer)}` : '/api/roadmap';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.roadmap) {
          setRoadmap(data.roadmap);
          // Set active stage to first in-progress or completed stage
          const currentInProg = data.roadmap.stages.find((s: any) => s.status === 'IN_PROGRESS');
          if (currentInProg) {
            setActiveStageOrder(currentInProg.stageOrder);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [requestedCareer]);

  const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/roadmap/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, completed: !currentStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.roadmap) {
          setRoadmap(data.roadmap);
          if (selectedModalStage) {
            const updatedStg = data.roadmap.stages.find((s: StageData) => s.id === selectedModalStage.id);
            if (updatedStg) setSelectedModalStage(updatedStg);
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle roadmap item:', err);
    }
  };

  const handleOpenStageDetails = (stage: StageData) => {
    setSelectedModalStage(stage);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 font-sans text-slate-500">
        <Loader2 className="h-10 w-10 text-[#6C5CE7] animate-spin" />
        <span className="text-sm font-extrabold text-[#1E1B4B]">Generating Adaptive Career Roadmap...</span>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-20 font-sans space-y-4">
        <Target className="h-12 w-12 text-[#6C5CE7] mx-auto" />
        <h2 className="text-2xl font-extrabold text-[#1E1B4B]">No Active Career Roadmap Found</h2>
        <p className="text-xs text-[#52528C] max-w-sm mx-auto">
          Complete a Career Discovery assessment or select a target role to generate your adaptive learning pathway.
        </p>
        <Link
          href="/discovery"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#6C5CE7] text-white font-extrabold text-xs shadow-md shadow-[#6C5CE7]/30"
        >
          <Compass className="h-4 w-4" />
          <span>Explore Career Discovery</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#2D2A6E] to-[#6C5CE7] p-8 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-[#00C2FF] text-xs font-black uppercase tracking-wider backdrop-blur-md">
              Adaptive Learning Pathway • Students
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {roadmap.careerPathTitle} Roadmap
            </h1>

            <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
              Step-by-step sequential learning milestones tailored for job readiness. Earn experience points (XP) and unlock advanced stages as you build skills.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-extrabold text-purple-200">
              <div className="flex items-center space-x-1.5">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>{roadmap.totalXP} Total XP Earned</span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex items-center space-x-1.5">
                <Clock className="h-4 w-4 text-indigo-300" />
                <span>Estimated {roadmap.estimatedMonths} Months Duration</span>
              </div>
            </div>
          </div>

          {/* Job Readiness Score Gauge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center shrink-0 min-w-[200px]">
            <span className="text-[10px] font-black text-purple-200 uppercase tracking-wider mb-2">
              Job Readiness Score
            </span>

            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" className="stroke-white/20" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#00C2FF] transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={238.7}
                  strokeDashoffset={238.7 - (238.7 * roadmap.jobReadinessScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{roadmap.jobReadinessScore}%</span>
              </div>
            </div>

            <Link
              href="/discovery/options"
              className="mt-3 text-[11px] font-bold text-[#00C2FF] hover:underline flex items-center space-x-1"
            >
              <span>Change Target Role</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Decorative Spheres */}
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[#6C5CE7]/30 blur-3xl" />
      </div>

      {/* Timeline Milestone Visualizer */}
      <Timeline
        stages={roadmap.stages}
        activeStageOrder={activeStageOrder}
        onSelectStage={(order) => setActiveStageOrder(order)}
      />

      {/* Stage Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#1E1B4B]">Detailed Stage Breakdown</h2>
          <span className="text-xs text-[#52528C]">Click checkboxes to complete activities and earn XP</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmap.stages.map((stage) => (
            <MilestoneCard
              key={stage.id}
              stage={stage}
              onToggleItem={handleToggleItem}
              onOpenStageDetails={handleOpenStageDetails}
            />
          ))}
        </div>
      </div>

      {/* Integrated Stage Details Modal */}
      <StageModal
        stage={selectedModalStage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleItem={handleToggleItem}
      />
    </div>
  );
}
