# Tasks: Career Portal — Full Platform

**Input**: Design documents from `/specs/001-career-portal-platform/` (`spec.md`, `plan.md`, `data-model.md`, `research.md`, `contracts/`, `quickstart.md`)

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story in priority order (P1 → P2 → P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3...)
- Includes exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base application structure

- [x] T001 Initialize Next.js 14+ App Router project with TypeScript and Tailwind CSS in project root
- [x] T002 Install core dependencies (`@supabase/ssr`, `@supabase/supabase-js`, `@prisma/client`, `prisma`, `openai`, `pdf-parse`, `lucide-react`, `framer-motion`) in `package.json`
- [x] T003 [P] Configure TypeScript strict checking and Tailwind theme colors/fonts in `tsconfig.json` and `tailwind.config.js`
- [x] T004 [P] Create environment configuration file `.env.local` with Supabase, LLM Provider, and 3rd-party Avatar variables per `quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database, authentication middleware, and configurable AI client infrastructure required before user stories can begin

- [x] T005 Create Prisma schema with PostgreSQL models (`WhitelistEntry`, `UserProfile`, `DailyStreak`, `Resume`, `ATSReport`, `JDMatchReport`, `Assessment`, `CareerMatch`, `Roadmap`, `RoadmapStage`, `RoadmapItem`, `MockInterview`, `InterviewReport`) in `prisma/schema.prisma`
- [x] T006 [P] Create Prisma database client helper in `src/lib/prisma.ts`
- [x] T007 [P] Create Supabase browser and server authentication client helpers in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`
- [x] T008 [P] Implement configurable OpenAI-compatible LLM client supporting Development Mode (`LLM_PROVIDER=custom_dev`, Modal Qwen3.6-27B-FP8 endpoint) and Production Mode (`LLM_PROVIDER=openai`) in `src/lib/openai.ts`
- [x] T009 [P] Create server-side PDF text extraction helper using `pdf-parse` in `src/lib/pdf-parser.ts`
- [x] T010 Create root application layout with responsive container shell and metadata in `src/app/layout.tsx`

---

## Phase 3: User Story 1 — Google Auth & Open Registration (Priority: P1) 🎯 MVP Core

**Goal**: Authenticate users via Google OAuth and allow instant registration for all Google accounts.

**Independent Test**: Sign in with any Google email and verify profile access/onboarding redirection.

- [x] T011 [US1] Create Auth verification API handler in `src/app/api/auth/verify/route.ts` per `contracts/auth.md`
- [x] T012 [US1] Implement Next.js auth middleware to intercept requests, check Supabase JWT session, and enforce route protection in `src/middleware.ts`
- [x] T013 [P] [US1] Create Landing page with "Sign in with Google" OAuth button in `src/app/page.tsx`
- [x] T014 [P] [US1] Create Login view with Google OAuth redirect trigger in `src/app/(auth)/login/page.tsx`

---

## Phase 4: User Story 2 — Dual-Path Onboarding (Priority: P1)

**Goal**: Allow new authenticated users to select between Student and Job Seeker paths, creating their starter profile manually or auto-populated from CV parsing.

**Independent Test**: Complete Student path by filling profile form and verifying profile creation. Complete Job Seeker path by uploading CV, verifying auto-populated profile fields, and confirming.

- [x] T016 [P] [US2] Implement CV auto-parsing API handler using `pdf-parse` and LLM client in `src/app/api/onboarding/parse-cv/route.ts` per `contracts/onboarding.md`
- [x] T017 [US2] Implement Starter Profile persistence API handler in `src/app/api/onboarding/profile/route.ts` per `contracts/onboarding.md`
- [x] T018 [P] [US2] Create Path Selection view ("Start My Journey" vs "Get Interview-Ready") per `App-Screens/1-Onboarding/OnboardingLight.png` in `src/app/(dashboard)/onboarding/page.tsx`
- [x] T019 [US2] Create Student Starter Profile Form view per `App-Screens/1-Onboarding/PreData.png` in `src/app/(dashboard)/onboarding/student/page.tsx`
- [x] T020 [US2] Create Job Seeker CV Drag-and-Drop Upload & Auto-Populated Profile Review view per `App-Screens/1-Onboarding/CvUpload.png` in `src/app/(dashboard)/onboarding/job-seeker/page.tsx`

---

## Phase 5: User Story 3 — Personalized Dashboard Home (Priority: P1)

**Goal**: Render adaptive command centers for Job Seekers (ATS score, interview metrics, quick actions) and Students (roadmap progress, quiz CTA).

**Independent Test**: Log in as Job Seeker and verify ATS Score radial gauge, interview metrics, and quick actions. Log in as Student and verify roadmap progress and quiz CTA.

- [x] T021 [P] [US3] Create Daily Streak Tracker widget component per `App-Screens/2-Dashboard Home/JobSeekerDashboard.png` in `src/components/dashboard/StreakTracker.tsx`
- [x] T022 [P] [US3] Create ATS Score Radial Gauge widget component per `App-Screens/2-Dashboard Home/JobSeekerDashboard.png` in `src/components/dashboard/ATSScoreGauge.tsx`
- [x] T023 [P] [US3] Create Today's Tasks list widget component per `App-Screens/2-Dashboard Home/JobSeekerDashboard.png` in `src/components/dashboard/TaskList.tsx`
- [x] T024 [US3] Create Main Adaptive Dashboard view (rendering Job Seeker vs Student dashboard variant based on profile) per `App-Screens/2-Dashboard Home/JobSeekerDashboard.png` and `StudentDashboard.png` in `src/app/(dashboard)/dashboard/page.tsx`

---

## Phase 6: User Story 4 — CV Intelligence Center: ATS Analyzer (Priority: P1)

**Goal**: Allow Job Seekers to upload resumes (<=5MB), receive an ATS score out of 100, and review actionable fix recommendations.

**Independent Test**: Upload a sample PDF resume, verify the ATS report calculates a score out of 100, and displays missing keywords, formatting issues, and recruiter red flags.

- [x] T025 [P] [US4] Create ATS Analyzer API handler (`/api/cv/ats`) using LLM Structured Outputs in `src/app/api/cv/ats/route.ts` per `contracts/cv-ats.md`
- [x] T026 [P] [US4] Create File Upload drag-and-drop component with 5MB validation per `App-Screens/3-CV Center/CV_ATS.png` in `src/components/cv/CVUploader.tsx`
- [x] T027 [P] [US4] Create Actionable Fix Recommendations list component per `App-Screens/3-CV Center/ATSResult.png` in `src/components/cv/FixRecommendations.tsx`
- [x] T028 [US4] Create ATS Analyzer page view per `App-Screens/3-CV Center/ATSResult.png` in `src/app/(dashboard)/cv-center/ats/page.tsx`

---

## Phase 7: User Story 9 — Mock Interview Simulator (Priority: P1)

**Goal**: Provide 4 mock interview modes with 3rd-party Avatar iframe integration and OpenAI STAR method evaluation feedback reports.

**Independent Test**: Select Technical Interview mode, verify embedded 3rd-party Avatar iframe loads cleanly, count interview duration, complete session, and verify evaluation report with scores and category feedback.

- [X] T029 [P] [US9] Create Mock Interview Session creation API handler (`/api/interview/session`) returning avatar iframe config in `src/app/api/interview/session/route.ts` per `contracts/mock-interview.md`
- [X] T030 [P] [US9] Create Interview Evaluation API handler (`/api/interview/evaluate`) evaluating avatar session in `src/app/api/interview/evaluate/route.ts` per `contracts/mock-interview.md`
- [X] T031 [P] [US9] Create 3rd-Party Avatar Iframe container component in `src/components/interview/AvatarIframe.tsx`
- [X] T032 [P] [US9] Create STAR Method Transcript Comparison component per `App-Screens/6-Mock Interviews-AI Avatar Interviewer/6-Mock interview-Feedback.png` in `src/components/interview/TranscriptComparison.tsx`
- [X] T033 [US9] Create Interview Mode Selector page per `App-Screens/6-Mock Interviews-AI Avatar Interviewer/1-mock interview.png` in `src/app/(dashboard)/interview/page.tsx`
- [X] T034 [US9] Create Active Interview Room view with embedded avatar iframe and session timer in `src/app/(dashboard)/interview/room/[id]/page.tsx`
- [X] T035 [US9] Create Interview Evaluation & Feedback Report page per `App-Screens/6-Mock Interviews-AI Avatar Interviewer/7-Mock interview-Report.png` in `src/app/(dashboard)/interview/report/[id]/page.tsx`

---

## Phase 8: User Story 5 — CV Intelligence Center: Job Description Matcher (Priority: P2)

**Goal**: Compare an uploaded CV against typed/pasted job description text and generate match scores, critical gaps, keyword breakdowns, and salary negotiation tips.

**Independent Test**: Select a CV, paste job description text, click "Analyze Match", and verify match score %, strengths, gaps, keyword comparison, and salary alignment render.

- [x] T036 [P] [US5] Create Job Description Matcher API handler (`/api/cv/match`) using LLM Structured Outputs in `src/app/api/cv/match/route.ts` per `contracts/cv-ats.md`
- [x] T037 [US5] Create Job Description Matcher page view with dual text/CV input and JD Match Report output per `App-Screens/3-CV Center/CV_JobDescription.png` and `CV_JobDescription_Result.png` in `src/app/(dashboard)/cv-center/jd-matcher/page.tsx`

---

## Phase 9: User Story 6 — Career Discovery Quizzes (Priority: P2)

**Goal**: Provide 5 structured career discovery assessments for students with progress tracking, save-and-exit, and archetype result generation.

**Independent Test**: Complete a 7-question assessment, verify progress bar updates, use save-and-exit, return to complete, and confirm archetype profile output.

- [x] T038 [P] [US6] Create Assessment submission and archetype scoring API handler in `src/app/api/discovery/assessment/route.ts`
- [x] T039 [P] [US6] Create Assessment Question Engine component (with A-E option buttons and progress bar) per `App-Screens/4-Career Discovery.../2.careerDiscoveryQuiz.png` in `src/components/discovery/QuizEngine.tsx`
- [x] T040 [US6] Create Assessment Hub overview page listing all 5 assessments per `App-Screens/4-Career Discovery.../1.careerDiscovery.png` in `src/app/(dashboard)/discovery/page.tsx`
- [x] T041 [US6] Create Interactive Assessment Quiz view with save-and-exit capability per `App-Screens/4-Career Discovery.../2.careerDiscoveryQuiz.png` in `src/app/(dashboard)/discovery/quiz/[id]/page.tsx`

---

## Phase 10: User Story 7 — Career Matchmaker & Career Profile (Priority: P2)

**Goal**: Display ranked career recommendations (Strong Match, Good Potential, Worth Exploring) based on assessment scores, and render detailed career profiles.

**Independent Test**: Complete assessments, navigate to Career Matchmaker, verify ranked matches, click a career option, and verify full profile page renders with skills, duties, and salary distributions.

- [x] T042 [P] [US7] Create Career Profile card component with match tier badge per `App-Screens/4-Career Discovery.../6.CareerOptions.png` in `src/components/discovery/CareerProfileCard.tsx`
- [x] T043 [US7] Create Career Options Matchmaker dashboard view per `App-Screens/4-Career Discovery.../6.CareerOptions.png` in `src/app/(dashboard)/discovery/options/page.tsx`
- [x] T044 [US7] Create Detailed Career Profile view (skills, entry requirements, growth paths, salary 10th/median/90th percentiles) per `App-Screens/4-Career Discovery.../7.Careerprofile.png` in `src/app/(dashboard)/discovery/profile/[id]/page.tsx`

---

## Phase 11: User Story 8 — Adaptive Career Roadmap (Priority: P2)

**Goal**: Provide Students with multi-stage interactive learning pathways that adapt based on progress, tracking Job-Readiness Score, XP, and stage lock states.

**Independent Test**: Open a 5-stage roadmap, complete a practice task, and verify XP increases, stage progress updates, and dependent stages unlock.

- [X] T045 [P] [US8] Create Roadmap progress update API handler in `src/app/api/roadmap/progress/route.ts`
- [X] T046 [P] [US8] Create Timeline milestone visualizer component per `App-Screens/5-Career-Roadmap.../1-Career Roadmap Overview.png` in `src/components/roadmap/Timeline.tsx`
- [X] T047 [P] [US8] Create Milestone Stage Card component (showing Completed/In Progress/Locked states) per `App-Screens/5-Career-Roadmap.../3-Career Roadmap]details.png` in `src/components/roadmap/MilestoneCard.tsx`
- [X] T048 [US8] Create Adaptive Career Roadmap main page view per `App-Screens/5-Career-Roadmap.../3-Career Roadmap]details.png` in `src/app/(dashboard)/roadmap/page.tsx`

---

## Phase 12: User Story 11 — AI Avatar Mentor (Priority: P2)

**Goal**: Provide an omnipresent side panel drawer embedding the 3rd-party AI Avatar solution iframe surrounded by platform quick-navigation links.

**Independent Test**: Open the AI Mentor panel from any page, verify the 3rd-party iframe loads cleanly, interact with its native chat/voice/attachment capabilities, and verify platform navigation links work.

- [X] T049 [P] [US11] Create AI Avatar Mentor embedded iframe drawer component with platform quick-links header per `App-Screens/7-AI Avatar Mentor/AI Mentor.png` in `src/components/mentor/AIMentorIframeDrawer.tsx`
- [X] T050 [US11] Mount AI Mentor drawer globally in main dashboard layout shell `src/app/(dashboard)/layout.tsx`

---

## Phase 13: User Story 10 — Interview Practice History (Priority: P3)

**Goal**: Provide users with a chronological log of past mock interviews with links to full feedback reports.

**Independent Test**: Complete mock interviews, navigate to history page, and verify all past sessions display with date, mode, duration, score, and report links.

- [X] T051 [P] [US10] Create Interview Practice History list view per `App-Screens/6-Mock Interviews.../5-Mock interview-Interviews.png` in `src/app/(dashboard)/interview/history/page.tsx`

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Final application refinement, edge case verification, and end-to-end validation

- [ ] T052 [P] Implement responsive sidebar navigation and active route indicators in `src/components/ui/Sidebar.tsx`
- [ ] T053 [P] Add visual error boundaries and fallback states for API connectors and file uploads in `src/components/ui/ErrorBoundary.tsx`
- [ ] T054 [P] Verify pre-commit lints and TypeScript strict check compliance across the repository
- [ ] T055 Execute full end-to-end validation scenarios from `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — **BLOCKS all user story work**
- **User Stories (Phases 3–13)**: All depend on Phase 2 completion
  - **P1 Stories**: US1 (Auth) → US2 (Onboarding) → US3 (Dashboard) → US4 (ATS Analyzer) & US9 (Mock Interview)
  - **P2 Stories**: US5 (JD Matcher), US6 (Quizzes), US7 (Matchmaker), US8 (Roadmap), US11 (AI Avatar Mentor)
  - **P3 Stories**: US10 (Interview History)
- **Polish (Phase 14)**: Depends on completion of user stories

### Parallel Opportunities

- **Setup Phase**: T003, T004 can run in parallel
- **Foundational Phase**: T006, T007, T008, T009 can run in parallel after T005
- **User Story Phases**: Parallel components marked `[P]` within each phase can be built concurrently
- **Cross-Story Parallel Execution**: US4 (ATS), US5 (JD Matcher), US9 (Mock Interview), US6 (Quizzes), and US11 (AI Avatar Mentor) touch separate file paths and can be implemented concurrently once Phase 2 completes.

---

## Implementation Strategy

### MVP First (Phases 1–3: Auth + Google Sign-In)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (Prisma, Supabase Auth, Configurable LLM client)
3. Complete Phase 3: User Story 1 (Google OAuth & Open Registration)
4. **VALIDATE MVP**: Confirm Google accounts sign in and proceed to onboarding or dashboard.

### Incremental Delivery

1. Foundation + Auth (US1) → Gated entry ready
2. Onboarding (US2) + Dashboard (US3) → Core user onboarding flow ready
3. ATS Analyzer (US4) + JD Matcher (US5) → CV Intelligence suite ready
4. Mock Interview Simulator (US9) → Interview preparation ready
5. Discovery Quizzes (US6), Matchmaker (US7), Roadmap (US8) → Student learning journey ready
6. AI Avatar Mentor (US11) + History (US10) → Platform fully complete
