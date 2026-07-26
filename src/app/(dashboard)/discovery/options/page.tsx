'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CareerProfileCard, CareerMatchData } from '@/components/discovery/CareerProfileCard';
import { Sparkles, Filter, Search, ArrowLeft, RefreshCw } from 'lucide-react';

export default function CareerOptionsMatchmakerPage() {
  const [matches, setMatches] = useState<CareerMatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const res = await fetch('/api/discovery/assessment');
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          setMatches(data.matches);
        } else {
          // Default initial recommendations if user hasn't completed quizzes yet
          setMatches([
            {
              id: 'ai-data-systems-engineer',
              careerTitle: 'AI & Data Systems Engineer',
              matchScore: 94,
              matchCategory: 'STRONG_MATCH',
              whyFits: 'Your high score in complex problem solving and structured logic aligns perfectly with machine learning architecture.',
              skillGaps: ['Deep Learning', 'PyTorch', 'Distributed Systems'],
            },
            {
              id: 'product-manager-strategist',
              careerTitle: 'Product Manager & Strategist',
              matchScore: 88,
              matchCategory: 'STRONG_MATCH',
              whyFits: 'Strong leadership traits and desire for autonomy fit strategic product ownership.',
              skillGaps: ['Agile Leadership', 'Roadmap Prioritization'],
            },
            {
              id: 'full-stack-software-architect',
              careerTitle: 'Full-Stack Software Architect',
              matchScore: 82,
              matchCategory: 'GOOD_POTENTIAL',
              whyFits: 'High craftsmanship focus and love for building systems from scratch.',
              skillGaps: ['System Design', 'Cloud Architecture'],
            },
            {
              id: 'ux-creative-technologist',
              careerTitle: 'UX & Creative Technologist',
              matchScore: 76,
              matchCategory: 'WORTH_EXPLORING',
              whyFits: 'Blends visual design appreciation with interactive technology experimentation.',
              skillGaps: ['Figma Prototyping', 'User Research'],
            },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    const matchesSearch = m.careerTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.whyFits.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || m.matchCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link
              href="/discovery"
              className="p-1.5 rounded-xl bg-white border border-[#E4E0FF] hover:bg-[#F8F9FE] text-[#1E1B4B] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs font-extrabold text-[#6C5CE7] uppercase tracking-wider">
              Career Matchmaker
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B4B]">
            Your Matched Career Paths
          </h1>
          <p className="text-xs sm:text-sm text-[#52528C] mt-1 font-medium">
            Calculated from your assessment responses, cognitive preferences, and interest profile.
          </p>
        </div>

        <Link
          href="/discovery"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#1E1B4B] text-xs font-extrabold transition-colors border border-[#E4E0FF] shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retake Quizzes</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-[#E4E0FF] rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Matches' },
            { id: 'STRONG_MATCH', label: 'Strong Match' },
            { id: 'GOOD_POTENTIAL', label: 'Good Potential' },
            { id: 'WORTH_EXPLORING', label: 'Worth Exploring' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-colors ${
                selectedCategory === tab.id
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'bg-[#F8F9FE] text-[#52528C] hover:bg-[#E4E0FF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-[#8E9BBA]" />
          <input
            type="text"
            placeholder="Search careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-xs focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Career Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-bold text-[#8E9BBA]">
          Calculating career match rankings...
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <CareerProfileCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white border border-[#E4E0FF] rounded-3xl p-8 space-y-3">
          <p className="text-sm font-bold text-[#1E1B4B]">No matching careers found</p>
          <p className="text-xs text-[#52528C]">Try adjusting your search filter or complete more assessments.</p>
        </div>
      )}
    </div>
  );
}
