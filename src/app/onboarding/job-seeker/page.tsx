'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadCloud, CheckCircle, Loader2, ArrowRight, User, Target, Info, X, Plus } from 'lucide-react';

export default function JobSeekerOnboardingPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [profileData, setProfileData] = useState<{
    firstName: string;
    lastName: string;
    education: string;
    fieldOfInterest: string;
    experienceLevel: string;
    careerGoal: string;
    extractedSkills: string[];
  } | null>(null);

  const [manualFormData, setManualFormData] = useState({
    firstName: '',
    lastName: '',
    education: '',
    fieldOfInterest: '',
    experienceLevel: 'ENTRY_LEVEL',
    careerGoal: '',
    skills: [] as string[],
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      setFile(selectedFile);
      await parseCV(selectedFile);
    }
  };

  const parseCV = async (cvFile: File) => {
    setParsing(true);
    setError('');

    const formData = new FormData();
    formData.append('file', cvFile);

    try {
      const res = await fetch('/api/onboarding/parse-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse CV');

      setProfileData({
        firstName: data.parsedProfile.firstName || 'Professional',
        lastName: data.parsedProfile.lastName || 'User',
        education: data.parsedProfile.education || '',
        fieldOfInterest: data.parsedProfile.fieldOfInterest || '',
        experienceLevel: data.parsedProfile.experienceLevel || 'MID_LEVEL',
        careerGoal: data.parsedProfile.careerGoal || '',
        extractedSkills: data.parsedProfile.extractedSkills || [],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during CV parsing');
      }
    } finally {
      setParsing(false);
    }
  };

  const handleAddSkillToProfile = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || !profileData) return;
    if (!profileData.extractedSkills.includes(trimmed)) {
      setProfileData({
        ...profileData,
        extractedSkills: [...profileData.extractedSkills, trimmed],
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkillFromProfile = (skillToRemove: string) => {
    if (!profileData) return;
    setProfileData({
      ...profileData,
      extractedSkills: profileData.extractedSkills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddSkillToManual = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!manualFormData.skills.includes(trimmed)) {
      setManualFormData({
        ...manualFormData,
        skills: [...manualFormData.skills, trimmed],
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkillFromManual = (skillToRemove: string) => {
    setManualFormData({
      ...manualFormData,
      skills: manualFormData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleConfirmProfile = async () => {
    if (!profileData) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'JOB_SEEKER',
          firstName: profileData.firstName || 'Professional',
          lastName: profileData.lastName || 'User',
          education: profileData.education,
          fieldOfInterest: profileData.fieldOfInterest,
          experienceLevel: profileData.experienceLevel,
          careerGoal: profileData.careerGoal,
          skills: profileData.extractedSkills,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to confirm profile');

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to confirm profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleManualFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'JOB_SEEKER',
          firstName: manualFormData.firstName || 'Professional',
          lastName: manualFormData.lastName || 'User',
          education: manualFormData.education,
          fieldOfInterest: manualFormData.fieldOfInterest,
          experienceLevel: manualFormData.experienceLevel,
          careerGoal: manualFormData.careerGoal,
          skills: manualFormData.skills,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save profile');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-[#1E1B4B] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white border border-[#E4E0FF] rounded-3xl p-8 sm:p-10 shadow-xl overflow-hidden">
        {/* Top Header Graphic */}
        <div className="relative w-full h-36 mb-6 rounded-2xl overflow-hidden bg-[#F5F4FE] border border-[#E4E0FF] flex items-center justify-center">
          <Image
            src="/Career-Professional-OnBoarding.png"
            alt="Career Professional Onboarding Header"
            fill
            className="object-contain p-2"
            priority
          />
        </div>

        {/* Header Titles */}
        {!showManualForm ? (
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">Let's start with your CV</h1>
            <p className="text-xs sm:text-sm text-[#52528C] mt-2 font-medium leading-relaxed max-w-lg mx-auto">
              Upload it and we'll read between the lines — pulling out your skills, experience, and the story you're trying to tell.
            </p>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">Getting to know you</h1>
            <p className="text-xs sm:text-sm text-[#52528C] mt-2 font-medium leading-relaxed max-w-lg mx-auto">
              Fill out your details to create your starter profile.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {!profileData && !showManualForm ? (
          <div className="space-y-6">
            {/* Dropzone Container */}
            <label className="block border-2 border-dashed border-[#E4E0FF] hover:border-[#6C5CE7] rounded-3xl p-12 text-center transition-all bg-[#EFEFF6] hover:bg-[#E7E7F2] cursor-pointer group">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-[#1E1B4B] shadow-sm group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6 text-[#1E1B4B]" />
                </div>
                <p className="text-sm sm:text-base font-bold text-[#1E1B4B]">
                  Drop your CV here, or click to browse
                </p>
                <p className="text-xs text-[#64748B]">Supports PDF or DOCX up to 5MB</p>
              </div>
            </label>

            {parsing && (
              <div className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-[#F5F4FE] border border-[#E4E0FF] text-[#6C5CE7] text-sm font-bold">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>AI Parsing CV text & extracting starter profile...</span>
              </div>
            )}

            {/* Bottom Redirect Link */}
            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm text-[#52528C]">
                Don't have a CV yet?{' '}
                <button
                  type="button"
                  onClick={() => setShowManualForm(true)}
                  className="font-extrabold text-[#6C5CE7] hover:underline focus:outline-none"
                >
                  Build your starter profile instead
                </button>
              </p>
            </div>
          </div>
        ) : showManualForm && !profileData ? (
          /* Manual Profile Form View */
          <form onSubmit={handleManualFormSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">First Name</label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3 top-3 text-[#8E9BBA]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={manualFormData.firstName}
                    onChange={(e) => setManualFormData({ ...manualFormData, firstName: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morgan"
                  value={manualFormData.lastName}
                  onChange={(e) => setManualFormData({ ...manualFormData, lastName: e.target.value })}
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
                    This is your highest level of education or university degree.
                    <div className="absolute right-2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#1E1B4B]"></div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. B.Sc. Business Administration"
                value={manualFormData.education}
                onChange={(e) => setManualFormData({ ...manualFormData, education: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Field of Interest</label>
              <input
                type="text"
                required
                placeholder="e.g. Marketing, Product Management, Data Analytics"
                value={manualFormData.fieldOfInterest}
                onChange={(e) => setManualFormData({ ...manualFormData, fieldOfInterest: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Career Goal / Target Position</label>
              <div className="relative">
                <Target className="h-4 w-4 absolute left-3 top-3 text-[#8E9BBA]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Marketing Lead"
                  value={manualFormData.careerGoal}
                  onChange={(e) => setManualFormData({ ...manualFormData, careerGoal: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Manual Skills Section */}
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {manualFormData.skills.map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#E8E5FF] border border-[#D8D2FF] text-[#6C5CE7] text-xs font-extrabold">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillFromManual(skill)}
                      className="text-[#6C5CE7] hover:text-red-600 transition-colors p-0.5 rounded-full"
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
                      handleAddSkillToManual(newSkillInput);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#F8F9FE] border border-[#E4E0FF] text-[#1E1B4B] text-xs focus:bg-white focus:border-[#6C5CE7] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkillToManual(newSkillInput)}
                  className="px-4 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white text-xs font-extrabold flex items-center space-x-1 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="py-3.5 px-5 rounded-2xl bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#1E1B4B] font-extrabold text-sm transition-colors"
              >
                Back to CV Upload
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Complete Profile & Go to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Parsed Profile Confirmation View */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>CV parsed successfully! Review and customize your profile below:</span>
            </div>

            <div className="space-y-4 bg-[#F8F9FE] p-6 rounded-2xl border border-[#E4E0FF]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    value={profileData?.firstName || ''}
                    onChange={(e) => profileData && setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:border-[#6C5CE7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={profileData?.lastName || ''}
                    onChange={(e) => profileData && setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:border-[#6C5CE7] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1 uppercase tracking-wider">Education</label>
                <input
                  type="text"
                  value={profileData?.education || ''}
                  onChange={(e) => profileData && setProfileData({ ...profileData, education: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1 uppercase tracking-wider">Career Goal / Target Position</label>
                <input
                  type="text"
                  value={profileData?.careerGoal || ''}
                  onChange={(e) => profileData && setProfileData({ ...profileData, careerGoal: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E4E0FF] text-[#1E1B4B] text-sm focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              {/* Skills Section */}
              <div>
                <label className="block text-xs font-extrabold text-[#1E1B4B] mb-1.5 uppercase tracking-wider">Extracted Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profileData?.extractedSkills?.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#E8E5FF] border border-[#D8D2FF] text-[#6C5CE7] text-xs font-extrabold">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillFromProfile(skill)}
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
                    placeholder="Add a new skill (e.g. React, Python)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkillToProfile(newSkillInput);
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E4E0FF] text-[#1E1B4B] text-xs focus:border-[#6C5CE7] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkillToProfile(newSkillInput)}
                    className="px-4 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white text-xs font-extrabold flex items-center space-x-1 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmProfile}
              disabled={saving}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Confirm & Proceed to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
