'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DISCOVERY_ASSESSMENTS } from '@/lib/data/discovery-questions';
import { QuizEngine } from '@/components/discovery/QuizEngine';
import { ArrowLeft } from 'lucide-react';

export default function DiscoveryQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  const assessment = DISCOVERY_ASSESSMENTS.find((a) => a.id === quizId);

  if (!assessment) {
    return (
      <div className="max-w-md mx-auto text-center py-20 font-sans space-y-4">
        <h2 className="text-xl font-bold text-[#1E1B4B]">Assessment Not Found</h2>
        <p className="text-xs text-[#52528C]">The requested career discovery quiz does not exist.</p>
        <Link
          href="/discovery"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#6C5CE7] text-white font-extrabold text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discovery Hub</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto pb-12">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => router.push('/discovery')}
          className="p-2 rounded-xl bg-white border border-[#E4E0FF] hover:bg-[#F8F9FE] text-[#1E1B4B] transition-colors"
          aria-label="Back to Hub"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-extrabold text-[#52528C]">Career Discovery / {assessment.title}</span>
      </div>

      <QuizEngine assessment={assessment} />
    </div>
  );
}
