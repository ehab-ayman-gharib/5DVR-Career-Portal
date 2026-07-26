'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function OnboardingPathSelectionPage() {
  return (
    <div className="min-h-screen bg-white text-[#1E1B4B] flex flex-col items-center justify-center p-6 sm:p-10 font-sans">
      <div className="max-w-4xl w-full text-center">
        {/* Header Title & Subtitle */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E1B4B] mb-3 tracking-tight">
          Where do you want to go?
        </h1>
        <p className="text-[#64748B] text-xs sm:text-sm md:text-base mx-auto mb-12 font-medium">
          Tell us where you are right now so we can build the right path for you.
        </p>

        {/* Dual Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-center max-w-3xl mx-auto">
          {/* Path 1: Student or Early Career */}
          <div className="flex flex-col items-center group">
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1E1B4B] mb-1">
                Student or Early Career
              </h2>

              {/* Graphic Container */}
              <div className="relative w-full h-64 sm:h-72 md:h-80 flex items-center justify-center">
                <Image
                  src="/Student-OnBoarding.png"
                  alt="Student Onboarding Illustration"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>

              <p className="text-xs sm:text-sm text-[#64748B] max-w-xs mx-auto leading-relaxed -mt-4 sm:-mt-6 relative z-10">
                We help you explore careers, develop skills, and practice interviews.
              </p>
            </div>

            <Link
              href="/onboarding/student"
              className="mt-4 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#6C5CE7]/30 transition-all hover:scale-105"
            >
              Start My Journey
            </Link>
          </div>

          {/* Path 2: Career Professional or Job seeker */}
          <div className="flex flex-col items-center group">
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1E1B4B] mb-1">
                Career Professional or Job seeker
              </h2>

              {/* Graphic Container */}
              <div className="relative w-full h-64 sm:h-72 md:h-80 flex items-center justify-center">
                <Image
                  src="/Career-Professional-OnBoarding.png"
                  alt="Career Professional Onboarding Illustration"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>

              <p className="text-xs sm:text-sm text-[#64748B] max-w-xs mx-auto leading-relaxed -mt-4 sm:-mt-6 relative z-10">
                We'll enhance your CV, prepare you for interviews, and help you secure the role.
              </p>
            </div>

            <Link
              href="/onboarding/job-seeker"
              className="mt-4 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#6C5CE7]/30 transition-all hover:scale-105"
            >
              Get Interview-Ready
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
