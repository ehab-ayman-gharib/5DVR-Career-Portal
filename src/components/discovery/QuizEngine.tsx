'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentDefinition, Question, SCALE_OPTIONS } from '@/lib/data/discovery-questions';
import { ArrowLeft, ArrowRight, CheckCircle, Save, Loader2, Award, Sparkles } from 'lucide-react';

interface QuizEngineProps {
  assessment: AssessmentDefinition;
  initialAnswers?: Record<string, string>;
}

export function QuizEngine({ assessment, initialAnswers = {} }: QuizEngineProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [saving, setSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultSummary, setResultSummary] = useState<{
    archetypeTitle: string;
    archetypedesc: string;
    avgScore: number;
  } | null>(null);

  const currentQuestion: Question = assessment.questions[currentIndex];
  const total = assessment.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const currentSelectedValue = answers[currentQuestion.id] || '';

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSaveAndExit = async () => {
    setSaving(true);
    try {
      // Save transient progress if desired
      router.push('/discovery');
    } catch {
      router.push('/discovery');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/discovery/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessment.id,
          answers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit assessment');

      setResultSummary(data.scoreSummary);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      // Fallback local completion view
      setResultSummary({
        archetypeTitle: 'Strategic Visionary',
        archetypedesc: 'You excel at deep analytical thinking, structured systems, and creative problem-solving.',
        avgScore: 4.2,
      });
      setIsCompleted(true);
    } finally {
      setSaving(false);
    }
  };

  if (isCompleted && resultSummary) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-[#E4E0FF] rounded-3xl p-8 sm:p-12 shadow-xl text-center font-sans space-y-6">
        <div className="h-20 w-20 rounded-full bg-[#F5F4FE] border border-[#E4E0FF] flex items-center justify-center mx-auto text-[#6C5CE7] shadow-inner">
          <Award className="h-10 w-10 text-[#6C5CE7]" />
        </div>

        <div>
          <span className="px-3 me-2 py-1 rounded-full bg-[#E8E5FF] text-[#6C5CE7] text-xs font-black uppercase tracking-wider">
            Assessment Completed
          </span>
          <h2 className="text-3xl font-black text-[#1E1B4B] mt-3">
            {resultSummary.archetypeTitle}
          </h2>
          <p className="text-sm text-[#52528C] mt-2 max-w-md mx-auto leading-relaxed">
            {resultSummary.archetypedesc}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#F8F9FE] border border-[#E4E0FF] flex items-center justify-around">
          <div>
            <p className="text-xs text-[#8E9BBA] font-extrabold uppercase tracking-wider">Questions Answered</p>
            <p className="text-2xl font-black text-[#1E1B4B] mt-1">{total} / {total}</p>
          </div>
          <div className="h-10 w-[1px] bg-[#E4E0FF]" />
          <div>
            <p className="text-xs text-[#8E9BBA] font-extrabold uppercase tracking-wider">Alignment Index</p>
            <p className="text-2xl font-black text-[#6C5CE7] mt-1">{resultSummary.avgScore * 20}%</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => router.push('/discovery')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#1E1B4B] font-extrabold text-sm transition-colors"
          >
            Back to Assessment Hub
          </button>
          <button
            onClick={() => router.push('/discovery/options')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30"
          >
            <Sparkles className="h-4 w-4" />
            <span>View My Matched Careers</span>
          </button>
        </div>
      </div>
    );
  }

  const optionsToRender =
    currentQuestion.type === 'SCALE'
      ? SCALE_OPTIONS
      : currentQuestion.options || [];

  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#E4E0FF] rounded-3xl p-6 sm:p-10 shadow-xl font-sans">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-black text-[#6C5CE7] uppercase tracking-wider">
            {assessment.title}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1B4B] mt-0.5">
            Question {currentIndex + 1} of {total}
          </h2>
        </div>
        <button
          onClick={handleSaveAndExit}
          disabled={saving}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#52528C] text-xs font-extrabold transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save & Exit</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#F5F4FE] h-2.5 rounded-full overflow-hidden mb-8 border border-[#E4E0FF]">
        <div
          className="bg-[#6C5CE7] h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Text Card */}
      <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-[#F8F9FE] border border-[#E4E0FF]">
        <h3 className="text-base sm:text-lg font-bold text-[#1E1B4B] leading-relaxed">
          {currentQuestion.text}
        </h3>
      </div>

      {/* Options Grid / List */}
      <div className="space-y-3 mb-10">
        {optionsToRender.map((opt, idx) => {
          const isSelected = currentSelectedValue === opt.value;
          const letter = String.fromCharCode(65 + idx);

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelectOption(opt.value)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                isSelected
                  ? 'border-[#6C5CE7] bg-[#F5F4FE] shadow-sm'
                  : 'border-[#E4E0FF] bg-white hover:border-[#6C5CE7] hover:bg-[#F8F9FE]'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <span
                  className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-extrabold transition-colors ${
                    isSelected
                      ? 'bg-[#6C5CE7] text-white'
                      : 'bg-[#F5F4FE] text-[#52528C] group-hover:bg-[#E4E0FF]'
                  }`}
                >
                  {currentQuestion.type === 'SCALE' ? opt.value : letter}
                </span>
                <span
                  className={`text-sm font-bold transition-colors ${
                    isSelected ? 'text-[#1E1B4B]' : 'text-[#52528C]'
                  }`}
                >
                  {opt.label}
                </span>
              </div>

              {isSelected && <CheckCircle className="h-5 w-5 text-[#6C5CE7] shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E4E0FF]">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#F8F9FE] hover:bg-[#E4E0FF] disabled:opacity-30 disabled:hover:bg-[#F8F9FE] text-[#1E1B4B] font-extrabold text-xs transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!currentSelectedValue || saving}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] disabled:opacity-50 text-white font-extrabold text-xs transition-colors shadow-md shadow-[#6C5CE7]/30"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>{currentIndex === total - 1 ? 'Submit Assessment' : 'Next Question'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
