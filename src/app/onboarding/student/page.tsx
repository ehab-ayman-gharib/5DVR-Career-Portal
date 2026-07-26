'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Target, ArrowRight, Loader2, Info, X, Plus } from 'lucide-react';

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    education: '',
    fieldOfInterest: '',
    experienceLevel: 'STUDENT',
    careerGoal: '',
    skills: [] as string[],
  });

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!formData.skills.includes(trimmed)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmed],
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'STUDENT',
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-[#1E1B4B] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white border border-[#E4E0FF] rounded-3xl p-8 shadow-xl overflow-hidden">
        {/* Top Header Graphic */}
        <div className="relative w-full h-36 mb-6 rounded-2xl overflow-hidden bg-[#F5F4FE] border border-[#E4E0FF] flex items-center justify-center">
          <Image
            src="/Student-OnBoarding.png"
            alt="Student Starter Profile Header"
            fill
            className="object-contain p-2"
            priority
          />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-[#1E1B4B]">Getting to know you</h1>
          <p className="text-xs sm:text-sm text-[#52528C] mt-1.5 font-medium leading-relaxed max-w-md mx-auto">
            We'll read between the lines - pulling out your skills, experience, and the story you're trying to tell.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">First Name</label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3 top-3 text-[#8E9BBA]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Norhan"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Last Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Mohamed"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold text-[#1E1B4B] uppercase tracking-wider">Education</label>
              <div className="relative group/tooltip flex items-center">
                <button
                  type="button"
                  className="text-[#8E9BBA] hover:text-[#6C5CE7] transition-colors p-0.5 rounded-full"
                  aria-label="Education Info"
                >
                  <Info className="h-4 w-4" />
                </button>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 p-2.5 bg-[#1E1B4B] text-white text-xs rounded-xl shadow-lg z-20 font-normal leading-tight">
                  This is the college or university you are currently enrolled in.
                  <div className="absolute right-2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#1E1B4B]"></div>
                </div>
              </div>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Cairo University - Computer Science"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Field of Interest</label>
            <input
              type="text"
              required
              placeholder="e.g. Data Science & Analytics, AI, Cyber Security"
              value={formData.fieldOfInterest}
              onChange={(e) => setFormData({ ...formData, fieldOfInterest: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Career Goal / Target Role</label>
            <div className="relative">
              <Target className="h-4 w-4 absolute left-3 top-3 text-[#8E9BBA]" />
              <input
                type="text"
                required
                placeholder="e.g. Data Visualization Specialist"
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Interactive Skills Section */}
          <div>
            <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#E8E5FF] border border-[#D8D2FF] text-[#6C5CE7] text-xs font-extrabold">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#6C5CE7] hover:text-red-600 transition-colors p-0.5 rounded-full"
                    aria-label={`Remove skill ${skill}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a skill and click Add..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(newSkillInput);
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-xs focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkillInput)}
                className="px-4 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white text-xs font-extrabold flex items-center space-x-1 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30 mt-6"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Complete Profile & Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
