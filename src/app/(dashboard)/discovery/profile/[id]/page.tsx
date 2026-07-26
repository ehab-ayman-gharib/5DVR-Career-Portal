'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, DollarSign, TrendingUp, CheckCircle2, Briefcase, BookOpen, MapPin, Rocket } from 'lucide-react';

interface CareerDetails {
  id: string;
  title: string;
  matchScore: number;
  matchTier: string;
  summary: string;
  dayInTheLife: string;
  responsibilities: string[];
  requiredSkills: string[];
  salary: {
    p10: string;
    median: string;
    p90: string;
  };
  growthRate: string;
  entryEducation: string;
}

const CAREER_PROFILES: Record<string, CareerDetails> = {
  'ai-data-systems-engineer': {
    id: 'ai-data-systems-engineer',
    title: 'AI & Data Systems Engineer',
    matchScore: 94,
    matchTier: 'Strong Match',
    summary: 'Designs, builds, and deploys high-scale data pipelines and machine learning infrastructure to support real-time AI decision engine models.',
    dayInTheLife: 'Collaborating with data science teams to optimize PyTorch models for latency, setting up automated CI/CD retraining workflows, and monitoring database query throughput.',
    responsibilities: [
      'Architect scalable distributed data processing pipelines using Spark and Kafka',
      'Optimize AI model inference speed and memory footprint on cloud infrastructure',
      'Integrate Vector databases and LLM orchestration layers into core products',
      'Maintain rigorous unit testing, data quality checks, and monitoring dashboards',
    ],
    requiredSkills: ['Python', 'PyTorch / TensorFlow', 'SQL & Vector DBs', 'Docker & Kubernetes', 'System Architecture'],
    salary: {
      p10: '$95,000 / yr',
      median: '$145,000 / yr',
      p90: '$205,000 / yr',
    },
    growthRate: '+32% Over Next 5 Years (Very High Demand)',
    entryEducation: 'Bachelor’s Degree in Computer Science, Software Engineering, or Data Science',
  },
  'product-manager-strategist': {
    id: 'product-manager-strategist',
    title: 'Product Manager & Strategist',
    matchScore: 88,
    matchTier: 'Strong Match',
    summary: 'Owns product vision, roadmap prioritization, user research, and cross-functional execution to deliver high-impact digital products.',
    dayInTheLife: 'Synthesizing customer feedback, facilitating cross-team roadmap planning, defining KPI success metrics, and reviewing launch wireframes.',
    responsibilities: [
      'Define product roadmap strategies aligned with company growth goals',
      'Conduct customer interviews and transform feedback into product user stories',
      'Prioritize sprint backlogs alongside engineering and UX design leads',
      'Track product engagement metrics and iteratively optimize onboarding funnels',
    ],
    requiredSkills: ['Product Strategy', 'Agile & Scrum', 'User Experience (UX)', 'Data Analytics', 'Stakeholder Management'],
    salary: {
      p10: '$85,000 / yr',
      median: '$130,000 / yr',
      p90: '$185,000 / yr',
    },
    growthRate: '+22% Over Next 5 Years (High Demand)',
    entryEducation: 'Bachelor’s Degree in Business, Computer Science, or Design',
  },
};

export default function CareerProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id as string;
  const decodedId = rawId ? decodeURIComponent(rawId) : '';

  const profile = CAREER_PROFILES[decodedId] || {
    id: decodedId,
    title: decodedId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Career Profile',
    matchScore: 85,
    matchTier: 'Strong Match',
    summary: 'Specialized role matching your cognitive preferences and analytical skills profile.',
    dayInTheLife: 'Designing systems, analyzing domain metrics, and collaborating across cross-functional engineering and strategy teams.',
    responsibilities: [
      'Drive core feature design and technical execution',
      'Collaborate with team leads to define strategic milestones',
      'Conduct quality analysis and continuous improvement tasks',
    ],
    requiredSkills: ['Problem Solving', 'Data Analysis', 'Project Execution', 'Domain Knowledge'],
    salary: {
      p10: '$80,000 / yr',
      median: '$125,000 / yr',
      p90: '$175,000 / yr',
    },
    growthRate: '+25% Growth Outlook',
    entryEducation: 'Bachelor’s Degree in Computer Science or related domain',
  };

  const handleSetTarget = () => {
    router.push('/roadmap');
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-12">
      {/* Top Back Nav */}
      <div className="flex items-center space-x-3">
        <Link
          href="/discovery/options"
          className="p-2 rounded-xl bg-white border border-[#E4E0FF] hover:bg-[#F8F9FE] text-[#1E1B4B] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-xs font-extrabold text-[#52528C]">Career Matchmaker / {profile.title}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-[#E4E0FF] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider">
                {profile.matchTier}
              </span>
              <div className="px-3 py-1 rounded-xl bg-[#F5F4FE] border border-[#E4E0FF] text-[#6C5CE7] text-xs font-black flex items-center space-x-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{profile.matchScore}% Match</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#1E1B4B]">
              {profile.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#52528C] mt-2 leading-relaxed max-w-2xl font-medium">
              {profile.summary}
            </p>
          </div>

          <button
            onClick={handleSetTarget}
            className="px-6 py-4 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-[#6C5CE7]/30 shrink-0"
          >
            <Rocket className="h-4 w-4" />
            <span>Set as My Target Path</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Median Salary */}
        <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#8E9BBA] uppercase tracking-wider">Median Compensation</p>
              <p className="text-xl font-black text-[#1E1B4B]">{profile.salary.median}</p>
            </div>
          </div>
          <p className="text-xs text-[#52528C] mt-3 font-medium">Range: {profile.salary.p10} - {profile.salary.p90}</p>
        </div>

        {/* Growth Outlook */}
        <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-[#F5F4FE] text-[#6C5CE7] flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#8E9BBA] uppercase tracking-wider">Industry Demand</p>
              <p className="text-sm font-black text-[#1E1B4B] mt-0.5">{profile.growthRate}</p>
            </div>
          </div>
          <p className="text-xs text-[#52528C] mt-3 font-medium">Based on global market analytics</p>
        </div>

        {/* Education Requirement */}
        <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#8E9BBA] uppercase tracking-wider">Entry Requirement</p>
              <p className="text-xs font-bold text-[#1E1B4B] mt-0.5">{profile.entryEducation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Day in the Life */}
        <div className="bg-white border border-[#E4E0FF] rounded-3xl p-7 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5">
            <Briefcase className="h-5 w-5 text-[#6C5CE7]" />
            <h3 className="text-lg font-black text-[#1E1B4B]">A Day in the Life</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#52528C] leading-relaxed font-medium">
            {profile.dayInTheLife}
          </p>

          <div className="pt-4 border-t border-[#E4E0FF]">
            <h4 className="text-xs font-extrabold text-[#1E1B4B] uppercase tracking-wider mb-3">Key Responsibilities</h4>
            <div className="space-y-2">
              {profile.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#52528C] font-medium leading-relaxed">{resp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Required Core Skills */}
        <div className="bg-white border border-[#E4E0FF] rounded-3xl p-7 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-[#1E1B4B]">Required Core Skills</h3>
          <div className="flex flex-wrap gap-2 pt-2">
            {profile.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#E8E5FF] border border-[#D8D2FF] text-[#6C5CE7] text-xs font-extrabold"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Salary Percentiles Spectrum */}
          <div className="pt-6 border-t border-[#E4E0FF] space-y-3">
            <h4 className="text-xs font-extrabold text-[#1E1B4B] uppercase tracking-wider">Salary Spectrum</h4>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#52528C] mb-1">
                  <span>10th Percentile (Entry)</span>
                  <span>{profile.salary.p10}</span>
                </div>
                <div className="w-full bg-[#F5F4FE] h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-300 h-full w-[35%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#1E1B4B] mb-1">
                  <span>Median Compensation</span>
                  <span className="font-extrabold text-[#6C5CE7]">{profile.salary.median}</span>
                </div>
                <div className="w-full bg-[#F5F4FE] h-2.5 rounded-full overflow-hidden border border-[#E4E0FF]">
                  <div className="bg-[#6C5CE7] h-full w-[65%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#52528C] mb-1">
                  <span>90th Percentile (Senior)</span>
                  <span>{profile.salary.p90}</span>
                </div>
                <div className="w-full bg-[#F5F4FE] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[90%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
