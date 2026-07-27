# Feature Specification: Career Portal — Full Platform

**Feature Branch**: `001-career-portal-platform`

**Created**: 2026-07-20

**Status**: Draft

**Input**: User description: "Build the AI-powered Career Portal — a career readiness and development platform with Google OAuth authentication, dual-path onboarding (Student vs. Job Seeker), personalized dashboards, CV Intelligence Center with ATS scoring and Job Description matching, Career Discovery quizzes for students, adaptive career roadmaps, AI-powered mock interview simulator with feedback reports, and an AI Avatar Mentor."

## Visual Design References (`App-Screens`)

All user interfaces MUST strictly follow the design layouts, component structures, color schemes, and visual telemetry specified in the reference screenshots located in `App-Screens/`:

| Module / User Story | Reference Screenshots (`App-Screens/`) | Key Design Elements |
|---|---|---|
| **US1 & US2: Onboarding & Path Selection** | `1-Onboarding/OnboardingLight.png`, `CvUpload.png`, `PreData.png` | Dual-path cards ("Start My Journey" vs "Get Interview-Ready"), drag-and-drop CV uploader, student starter profile form |
| **US3: Personalized Dashboards** | `2-Dashboard Home/JobSeekerDashboard.png`, `StudentDashboard.png` | Mon-Sun activity streak tracker, radial ATS score gauge, task list, quick-action cards, roadmap progress widget |
| **US4 & US5: CV Intelligence Center** | `3-CV Center/CV_ATS.png`, `ATSResult.png`, `CV_JobDescription.png`, `CV_JobDescription_Result.png` | Consolidated score out of 100, red flag / formatting issue pills, side-by-side keyword analysis, salary negotiation alignment tips |
| **US6 & US7: Career Discovery & Profile** | `4-Career Discovery.../1.careerDiscovery.png` through `8.career profile modal.png` | 5 assessment cards, quiz question UI with progress bar, archetype result cards, ranked matchmaker options, salary distribution graph |
| **US8: Adaptive Career Roadmap** | `5-Career-Roadmap.../1-Career Roadmap Overview.png` through `Stage details modal.png` | Milestone timeline cards, Completed / In Progress / Locked state badges, stage detail checklist modal, XP score counter |
| **US9 & US10: Mock Interview Simulator** | `6-Mock Interviews.../1-mock interview.png` through `7-Mock interview-Report.png` | Interview mode cards, pre-start prep checklist, 3rd-party avatar iframe container, STAR transcript comparison with ❌/✅ indicators, practice history table |
| **US11: AI Avatar Mentor** | `7-AI Avatar Mentor/AI Mentor.png` | Side drawer hosting embedded 3rd-party iframe, platform quick-action navigation header links |

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Google Authentication & Open Registration (Priority: P1)

A user visits the Career Portal and clicks "Sign in with Google." The system authenticates them via Google OAuth. Any valid Google account holder can register, create a profile, and access the platform. Unauthenticated visitors are redirected to the login page for all protected routes.

**Why this priority**: Authentication and authorization are the absolute prerequisite — no other feature functions without a gated entry point.

**Independent Test**: Sign in with any Google account and confirm profile creation/dashboard flow appears. Visit protected routes unauthenticated and confirm redirect to login.

**Acceptance Scenarios**:

1. **Given** a user is on the landing page, **When** they sign in with Google, **Then** they are directed to onboarding (first time) or their dashboard (returning user).
2. **Given** an unauthenticated visitor, **When** they navigate to any protected route, **Then** they are redirected to the landing/login page.

---

### User Story 2 — Dual-Path Onboarding (Priority: P1)

After authentication, a new user selects one of two paths: **Student / Early Career** ("Start My Journey") or **Job Seeker / Professional** ("Get Interview-Ready"). Both paths result in a starter profile being created, but through different mechanisms:
- **Student path**: The user manually fills out a starter profile form (First Name, Second Name, Education, Field of Interest, Experience Level, Career Goal).
- **Job Seeker path**: The user uploads their CV, and the system's AI parser automatically extracts key information (skills, experience, career history) to populate the starter profile. An alternative "Build your starter profile instead" link is available for users without a CV.

The chosen path determines their entire dashboard experience going forward.

**Why this priority**: Onboarding establishes the user's identity and branches the entire platform experience.

**Independent Test**: Create a new account, select "Student" path, complete the starter profile form manually, and confirm the profile is saved and the Student Dashboard renders. Repeat with "Job Seeker" path, upload a CV, and confirm the profile is auto-populated from the parsed CV data and the Job Seeker Dashboard renders.

**Acceptance Scenarios**:

1. **Given** a new authenticated user, **When** they reach the onboarding screen, **Then** they see two path options: "Start My Journey" (Student) and "Get Interview-Ready" (Job Seeker).
2. **Given** a user selects "Job Seeker," **When** they proceed, **Then** they see a drag-and-drop CV upload zone (max 5MB) and an alternative "Build your starter profile instead" link.
3. **Given** a Job Seeker uploads a valid CV, **When** parsing completes, **Then** their starter profile is automatically populated with extracted data (name, degree/education, career goal, skills tags) and they can interactively add new skills, remove extracted skills, and review/edit profile fields before confirming.
4. **Given** a user selects "Student" or chooses manual profile entry, **When** they fill out the form, **Then** they can enter their details and manage their skills list directly.
5. **Given** a user completes onboarding via either path, **When** they are redirected, **Then** they land on the dashboard variant matching their chosen path with their starter profile and custom skills array fully saved in the database.

---

### User Story 3 — Personalized Dashboard Home (Priority: P1)

A returning user lands on their personalized dashboard. The dashboard displays a tailored welcome message, a daily streak tracker (Mon–Sun visual + day count), today's AI-suggested tasks, and quick-action buttons specific to the user's path. Job Seekers see ATS score, interviews done, and improvement metrics. Students see roadmap progress widgets.

**Why this priority**: The dashboard is the central hub the user interacts with daily — it drives engagement and connects all modules.

**Independent Test**: Log in as a Job Seeker and verify the dashboard shows ATS score widget, interview count, improvement percentage, and quick actions (Mock Interviews, ATS Analyzer, Ask AI Mentor, JD Matcher, Company Analysis). Log in as a Student and verify roadmap progress, discovery quiz CTA, and student-specific quick actions.

**Acceptance Scenarios**:

1. **Given** a Job Seeker user logs in, **When** their dashboard loads, **Then** they see: personalized welcome message, streak tracker, ATS Score widget, Interviews Done count, Improvement percentage, today's tasks, and quick-action buttons.
2. **Given** a Student user logs in, **When** their dashboard loads, **Then** they see: personalized welcome message, streak tracker, roadmap progress widget (showing stages with completion percentages and lock status), today's tasks, and student quick-action buttons (Discovery Assessments, Practice Interview, Ask AI Mentor, Update Roadmap).
3. **Given** a user engages with the platform on consecutive days, **When** the streak tracker updates, **Then** the completed days are visually highlighted and the streak count increments.

---

### User Story 4 — CV Intelligence Center: ATS Analyzer (Priority: P1)

A Job Seeker uploads their resume (max 5MB). The system parses the CV and generates an ATS score out of 100, with metric counters for missing keywords, formatting issues, and recruiter red flags. The system provides specific actionable fixes (e.g., missing phone numbers, generic objective statements, visual elements that ATS cannot read).

**Why this priority**: Core value proposition for job seekers — immediate, actionable resume feedback.

**Independent Test**: Upload a sample resume and verify the ATS score, metric breakdown, and at least three specific actionable fix recommendations appear.

**Acceptance Scenarios**:

1. **Given** a Job Seeker uploads a valid resume, **When** parsing completes, **Then** they see a consolidated ATS score (out of 100), with metric counters for missing keywords, formatting issues, and recruiter red flags.
2. **Given** the ATS report is generated, **When** the user reviews it, **Then** each issue includes a specific, actionable fix recommendation with clear explanation of why it matters.

---

### User Story 5 — CV Intelligence Center: Job Description Matcher (Priority: P2)

A Job Seeker selects/uploads their CV and pastes or types a job description text. The system computes an overall match score, classifies the match quality tier (Strong Fit, Good Potential, etc.), highlights strengths to emphasize, flags critical gaps, provides keyword analysis (present vs. missing), and shows salary expectation alignment with negotiation tips.

**Why this priority**: Directly supports job application strategy with targeted feedback and salary intelligence.

**Independent Test**: Select a CV and paste/type a job description, then verify match score, strengths, gaps, keyword comparison, and salary range/negotiation tip sections all render with data.

**Acceptance Scenarios**:

1. **Given** a Job Seeker submits a CV and a job description, **When** matching completes, **Then** they see: overall match score percentage, match quality tier, position/company/location context, strengths to emphasize, critical gaps, and a keyword analysis table.
2. **Given** the JD match report is generated, **When** the user scrolls to salary alignment, **Then** they see market salary range, their target salary, implied company budget, and a contextual negotiation tip.

---

### User Story 6 — Career Discovery Quizzes (Students Only) (Priority: P2)

A Student user accesses the Career Discovery Assessment Hub and progresses through 5 structured assessments (Career Interest, Personality Traits, Learning Readiness, Cognitive Abilities, Motivators). Each assessment contains 7 questions with progress tracking, save-and-exit capability, and a transition loading animation. Upon completion, the user receives archetype results, core strengths, and ideal career paths.

**Why this priority**: Foundational to the student journey — discovery assessments feed the career matcher and roadmap.

**Independent Test**: Start one assessment, answer all 7 questions, verify the progress bar updates, use "Save and Exit" mid-quiz and resume, then confirm archetype results render on completion.

**Acceptance Scenarios**:

1. **Given** a Student accesses the Assessment Hub, **When** they view the hub, **Then** they see 5 assessments with estimated durations and completion status.
2. **Given** a Student starts an assessment, **When** they answer each question, **Then** the progress bar updates (e.g., "3/7 Questions") and they can navigate between questions.
3. **Given** a Student clicks "Save and Exit" mid-quiz, **When** they return later, **Then** their progress is preserved and they resume from where they left off.
4. **Given** a Student completes all questions, **When** results are processed, **Then** they see their archetype profile, core strengths, ideal career paths, and developmental advice.

---

### User Story 7 — Career Matchmaker & Career Profile (Students Only) (Priority: P2)

After completing assessments, a Student sees a Career Matchmaker Dashboard that ranks career options by correlation strength (Strong Match, Good Potential, Worth Exploring). Each option includes "Why this fits you" reasoning and a skill gap analysis. The Student can select a career to view its full profile: technical skills, entry-level requirements, day-to-day duties, growth paths, and salary distributions.

**Why this priority**: Transforms assessment data into actionable career guidance — the bridge between self-discovery and learning pathways.

**Independent Test**: Complete at least 2 assessments, navigate to the Career Matchmaker, and verify career options appear ranked with match categories. Click on a career and verify the profile page shows skills, requirements, duties, growth paths, and salary data.

**Acceptance Scenarios**:

1. **Given** a Student has completed their assessments, **When** they view the Career Matchmaker, **Then** careers are displayed ranked by match strength with color-coded labels (Strong Match = Green, Good Potential = Yellow, Worth Exploring = Blue).
2. **Given** a Student selects a career option, **When** the profile page loads, **Then** it displays core technical skills, design knowledge, entry-level requirements, daily duties, growth paths, and salary distributions (10th, median, 90th percentile).

---

### User Story 8 — Adaptive Career Roadmap (Students Only) (Priority: P2)

A Student selects a matched career and receives a multi-stage, interactive learning roadmap with estimated completion time. The roadmap adapts based on performance in quizzes, tasks, and interview checkpoints. Each stage contains lectures, practice tasks, and interview simulations. A milestone tracker shows Job-Readiness Score, Learning Streak, and XP earned. Stages display as Completed, In Progress (with percentage), or Locked.

**Why this priority**: Converts career matches into a structured, gamified learning journey that keeps users engaged over months.

**Independent Test**: Select a career from the matchmaker, verify the roadmap renders with multiple stages. Complete a learning item and verify XP increments, stage percentage updates, and streak tracking works.

**Acceptance Scenarios**:

1. **Given** a Student selects a career path, **When** the roadmap loads, **Then** it displays a multi-stage timeline with estimated completion time and adaptive progression messaging.
2. **Given** a Student views the milestone tracker, **When** they check their progress, **Then** they see their Job-Readiness Score, Learning Streak count, and total XP earned.
3. **Given** a Student completes a lecture or practice task, **When** the roadmap updates, **Then** the stage progress percentage increases, XP is awarded, and subsequent stages unlock when prerequisites are met.
4. **Given** a roadmap stage is locked, **When** the Student views it, **Then** it displays a lock indicator and shows the prerequisite stages that must be completed first.

---

### User Story 9 — Mock Interview Simulator (Priority: P1)

A user (either path) selects a mock interview mode: Technical (30-45 min), Salary Negotiation (10-15 min), HR Interview (15-20 min), or Problem-Solving (45-60 min). They receive setup instructions (quiet space, camera, pacing), then enter the active interview with an AI avatar interviewer presenting questions. After the interview, the system generates a detailed evaluation report with overall score out of 100, category analysis (Communication & Articulation, Technical Depth), a full transcript, and an improved-answer comparison tool.

**Why this priority**: The interview simulator is the platform's flagship interactive feature and core value for both user personas.

**Independent Test**: Select "HR Interview" mode, complete setup, answer at least 2 questions, then finish the interview and verify: overall score, category breakdowns, transcript with weakness highlights, and improved answer suggestions all render correctly.

**Acceptance Scenarios**:

1. **Given** a user selects an interview mode, **When** they proceed through setup, **Then** they see preparation checklists (quiet space, tone, camera, pacing) and can start when ready.
2. **Given** an interview is in progress, **When** a question is displayed, **Then** the user sees the question text, a "Start Answering" control, and non-verbal reminder tags.
3. **Given** an interview is completed, **When** the evaluation report generates, **Then** it shows: overall score (out of 100), qualitative summary, Communication & Articulation score (out of 10 with sub-criteria), and Technical Depth score (out of 10 with sub-criteria).
4. **Given** the user views the transcript section, **When** they review their answers, **Then** each answer displays the detected transcript with weakness indicators (❌) alongside a rewritten improved answer (✅) with specific metrics and structure improvements.

---

### User Story 10 — Interview Practice History (Priority: P3)

A user can view their chronological practice history showing: date, interview type, duration, subject, status (Completed/Failed), and a link to the feedback report for each past interview.

**Why this priority**: Allows users to track progress over time and revisit feedback.

**Independent Test**: Complete two mock interviews, navigate to practice history, and verify both entries appear with correct metadata and links to their feedback reports.

**Acceptance Scenarios**:

1. **Given** a user has completed mock interviews, **When** they view practice history, **Then** all past interviews are listed chronologically with date, type, duration, subject, and status.
2. **Given** a user clicks the feedback link for a past interview, **When** the report loads, **Then** it displays the full evaluation report from that session.

---

### User Story 11 — AI Avatar Mentor (Priority: P2)

An AI Avatar Mentor is accessible as an embedded side panel or dedicated view across the platform. The entire AI Avatar interaction — including the visual avatar, text input box, voice-to-text recording, and file attachment uploads (resumes, JDs, certificates) — is provided by an independent, self-contained 3rd-party web solution embedded directly via `<iframe>`. The Career Portal layout surrounds the iframe with direct navigation links to Dashboard, Mock Interviews, ATS Analysis, Company Analysis, and Performance Analytics.

**Why this priority**: The AI Avatar Mentor ties the entire platform together as an omnipresent guidance layer, boosting engagement and discoverability of features.

**Independent Test**: Open the AI Mentor panel, verify the 3rd-party AI Avatar iframe loads cleanly, interact with its native text/voice/attachment features within the iframe, and verify surrounding platform navigation links route correctly.

**Acceptance Scenarios**:

1. **Given** a user opens the AI Mentor side panel or dedicated view, **When** the view loads, **Then** the independent 3rd-party AI Avatar solution is embedded and rendered inside an `<iframe>` container.
2. **Given** the user interacts with the AI Avatar Mentor, **When** they type text, use voice-to-text, or upload file attachments, **Then** these interactions are handled directly within the embedded 3rd-party iframe.
3. **Given** the AI Mentor container displays platform navigation links, **When** the user clicks a link (e.g., "Mock Interviews"), **Then** they are routed to the corresponding module in the Career Portal.

---

### Edge Cases

- **Authentication failure**: If Google OAuth fails (network error, Google outage), the user sees a friendly error message and a "Try Again" button on the login page.
- **Whitelist removal during active session**: The user's session is invalidated on their next request and they are redirected to login with a clear message.
- **CV upload exceeding 5MB**: The system rejects the file with a clear size limit message before any processing begins.
- **Empty quiz resume**: If a Student saves and exits a quiz and never returns, their partial progress persists indefinitely and is available whenever they return.
- **Interview session interruption**: If the mock interview connection drops mid-session, the system saves progress and allows the user to resume or restart.
- **No career matches**: If assessment results do not produce strong matches, the system still shows "Worth Exploring" options with clear reasoning rather than an empty state.
- **Roadmap with all stages locked**: The first stage is always unlocked by default so the user always has a starting point.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST authenticate users via Google OAuth and grant immediate registration and platform access to all valid Google accounts.
- **FR-002**: The system MUST present two onboarding paths: "Student / Early Career" and "Job Seeker / Professional," and branch the entire experience accordingly.
- **FR-003**: The system MUST support CV upload (drag-and-drop, max 5MB) with AI parsing during onboarding for the Job Seeker path.
- **FR-004**: The system MUST provide a starter profile form (name, education, field of interest, experience level, career goal) for the Student path.
- **FR-005**: The system MUST render a personalized dashboard for each path with welcome message, streak tracker, today's tasks, quick actions, and path-specific widgets.
- **FR-006**: The system MUST track daily engagement streaks with a Monday-through-Sunday visual tracker and cumulative day count.
- **FR-007**: The system MUST generate ATS scores (out of 100) with metric counters and specific actionable fix recommendations from uploaded resumes.
- **FR-008**: The system MUST compare an uploaded CV against a pasted or typed job description text and produce a match report with score, strengths, gaps, keyword analysis, and salary alignment.
- **FR-009**: The system MUST provide 5 career discovery assessments (7 questions each) with progress tracking, save-and-exit, and archetype result profiles for students.
- **FR-010**: The system MUST rank career options by match strength and provide "Why this fits" reasoning and skill gap analysis based on completed assessments.
- **FR-011**: The system MUST display detailed career profiles with skills, requirements, duties, growth paths, and salary distributions.
- **FR-012**: The system MUST generate adaptive, multi-stage career roadmaps with lectures, practice tasks, and interview simulation checkpoints.
- **FR-013**: The system MUST award experience points (XP) for completed learning activities and track streak counts.
- **FR-014**: The system MUST support 4 mock interview modes: Technical, Salary Negotiation, HR, and Problem-Solving, each with specified durations.
- **FR-015**: The system MUST generate evaluation reports with an overall score (out of 100), category analysis, and transcript-vs-improved-answer comparisons.
- **FR-016**: The system MUST maintain a chronological practice history log for all completed mock interviews.
- **FR-017**: The system MUST embed an independent 3rd-party AI Avatar solution via `<iframe>` (in a side panel or dedicated view) containing native text input, voice-to-text capabilities, file attachments, and avatar interaction.
- **FR-018**: The system MUST redirect unauthenticated visitors from protected routes to the landing/login page.

### Key Entities

- **UserProfile**: The authenticated user's identity and preferences. Attributes: `id`, `email`, `displayName`, `path` (Student or Job Seeker), `createdAt`.
- **DailyStreak**: Tracks consecutive daily engagement. Attributes: `userId`, `currentStreak`, `weeklyLog` (Mon–Sun).
- **Resume**: An uploaded CV document. Attributes: `id`, `userId`, `fileUrl`, `parsedData`, `uploadedAt`.
- **ATSReport**: Generated ATS analysis results. Attributes: `id`, `resumeId`, `score`, `missingKeywords`, `formattingIssues`, `redFlags`, `fixes`.
- **JDMatchReport**: Job description comparison results. Attributes: `id`, `resumeId`, `jobDescription`, `matchScore`, `matchTier`, `strengths`, `gaps`, `keywordAnalysis`, `salaryAlignment`.
- **Assessment**: A career discovery quiz instance. Attributes: `id`, `userId`, `type` (Interest/Personality/Learning/Cognitive/Motivators), `status`, `answers`, `result`.
- **CareerMatch**: Ranked career option from assessments. Attributes: `id`, `userId`, `careerTitle`, `matchStrength`, `reasoning`, `skillGaps`.
- **Roadmap**: An adaptive learning pathway. Attributes: `id`, `userId`, `careerPath`, `stages`, `completionEstimate`, `jobReadinessScore`, `totalXP`.
- **RoadmapStage**: A single stage within a roadmap. Attributes: `id`, `roadmapId`, `title`, `status` (Completed/In Progress/Locked), `progressPercent`, `items` (lectures, tasks, simulations).
- **MockInterview**: A completed interview session. Attributes: `id`, `userId`, `mode` (Technical/HR/Negotiation/Problem-Solving), `date`, `duration`, `status`, `overallScore`.
- **InterviewReport**: Evaluation output from a mock interview. Attributes: `id`, `interviewId`, `qualitativeSummary`, `communicationScore`, `technicalScore`, `transcript`, `improvedAnswers`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of authentic Google sign-in attempts succeed and redirect to onboarding (new user) or dashboard (returning user) within 2 seconds.
- **SC-002**: New users complete the onboarding flow (path selection through profile/CV) in under 3 minutes.
- **SC-003**: The ATS score report generates within 10 seconds of CV upload for files up to 5MB.
- **SC-004**: The JD match report renders within 15 seconds after both CV and job description are submitted.
- **SC-005**: Users can complete a single career discovery assessment (7 questions) in under 5 minutes.
- **SC-006**: Quiz progress is preserved with 100% reliability — no data loss on save-and-exit.
- **SC-007**: Roadmap stage progress and XP updates reflect within 2 seconds of completing a learning activity.
- **SC-008**: Mock interview evaluation reports generate within 30 seconds of interview completion.
- **SC-009**: The embedded AI Avatar iframe loads and renders within 3 seconds of opening the mentor panel.
- **SC-010**: The daily streak tracker accurately reflects consecutive engagement days with zero false resets.

## Assumptions

- Registration and authentication are open to any valid Google account holder via Google OAuth.
- Career discovery assessment question content (the actual quiz questions and scoring logic) will be provided or curated by the content/product team.
- Salary data for career profiles and JD match salary alignment will be sourced from an external dataset or API.
- The entire AI Avatar module (both AI Avatar Mentor drawer and Mock Interview Simulator) — encompassing the visual avatar, text chat input, voice-to-text recording, and file attachments — is an independent 3rd-party web solution (`https://5d-ai-hub.com/avatars/5dVR@HelmyDev_7cc59`) embedded directly into the platform via `<iframe>`. The Career Portal handles embedding and layout container integration, while the 3rd-party iframe manages all conversational UI, voice input, file uploads, and avatar video generation.
- The platform's AI processing engine utilizes a configurable, OpenAI-compatible client abstraction. During development and testing, inference calls can be routed to an unauthenticated Modal endpoint (`Qwen/Qwen3.6-27B-FP8`) using server-side PDF text parsing (`pdf-parse`), while production deployment connects seamlessly to official OpenAI endpoints via environment configuration.
- "Performance Analytics" appears in navigation/quick-actions but its full implementation is out of scope for this specification and will be addressed in separate feature specs. "Company Analysis" has been removed from Quick Actions.

