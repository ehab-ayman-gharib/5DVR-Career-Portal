# Phase 0 Research: Career Portal — Full Platform

**Feature Branch**: `001-career-portal-platform`
**Created**: 2026-07-21
**Status**: Completed

## 1. Authentication Architecture

### Decision
Use **Supabase Auth with Google OAuth provider** combined with Next.js App Router Middleware (`middleware.ts`) for open registration of all Google accounts.

### Rationale
- Supabase Auth handles OAuth flow securely, returning JWT sessions.
- Middleware intercepts requests to protect private routes and verify authenticated sessions.
- Any valid Google account holder can register and complete onboarding without restriction.

### Alternatives Considered
- *Custom OAuth with NextAuth.js*: Supabase Auth is already specified in the Constitution and directly integrates with PostgreSQL Row Level Security (RLS) and Prisma ORM.

---

## 2. Dual-Path Onboarding & Profile Generation

### Decision
Use Next.js App Router dynamic routes with a unified `UserProfile` schema containing a `path` discriminator (`STUDENT` | `JOB_SEEKER`).

### Rationale
- **Student Path**: User completes a structured multi-step form (`/onboarding/student`).
- **Job Seeker Path**: User uploads CV (`/onboarding/job-seeker`), parsed via `pdf-parse` / `mammoth` and processed by OpenAI Structured Outputs (`gpt-4o-mini`) to extract `displayName`, `education`, `skills`, and `workExperience`, automatically populating the starter profile for review and confirmation.

---

## 3. CV Intelligence & ATS Analysis Engine

### Decision
Serverless API routes (`/api/cv/ats` and `/api/cv/match`) leveraging a **Configurable OpenAI-Compatible LLM Client** with server-side **PDF Text Extractor (`pdf-parse`)**.

### Rationale
- **Configurable LLM Provider Layer (`lib/openai.ts`)**: Uses standard OpenAI Chat Completions SDK initialized with environment variables (`LLM_PROVIDER`, `LLM_BASE_URL`, `LLM_MODEL_ID`).
  - **Development / Testing Mode (`LLM_PROVIDER=custom_dev`)**: Directs inference calls to the Modal endpoint (`https://ehab-ayman-gh--ep-qwen3-6-27b-fp8-server.eu-west.modal.direct/v1/chat/completions`) using model `Qwen/Qwen3.6-27B-FP8` without auth headers for low-cost, high-speed testing.
  - **Production Mode (`LLM_PROVIDER=openai`)**: Directs inference calls to official OpenAI endpoints (`gpt-4o` / `gpt-4o-mini`) using `OPENAI_API_KEY`.
- **PDF Text Parsing Pre-Processing**: Because text-based LLM endpoints require plain text prompts, uploaded CV PDFs are parsed server-side using `pdf-parse` to extract raw text content before inserting into prompt payloads.
- File upload handling uses Next.js Route Handlers with a 5MB payload limit validation middleware.
- Missing keyword analysis performs set-difference operations between normalized JD keyphrases and parsed CV keyphrases.

---

## 4. Career Discovery Quiz & Archetype Algorithm

### Decision
Client-side interactive state engine with server-side result calculation and persistence via Prisma.

### Rationale
- 5 assessments (7 questions each) stored as JSON template definitions.
- Quiz progress saved per-question to `Assessment` table to ensure 100% data loss prevention on exit.
- Archetype matching uses weighted distance scoring across 5 personality dimensions, selecting top archetype profiles and generating matched career options sorted by correlation score (Strong Fit > 80%, Good Potential 60-80%, Worth Exploring < 60%).

---

## 5. Adaptive Career Roadmap & Gamification Engine

### Decision
Event-driven progression calculator updated upon learning task or interview completion.

### Rationale
- `Roadmap` and `RoadmapStage` models track completion percentages and lock statuses.
- Completing tasks triggers an XP transaction (`UserXP`) and increments `JobReadinessScore`.
- Re-calculation logic unlocks dependent stages automatically once prerequisite stage items are verified.
- Daily streak tracker updates via a daily activity check endpoint (`/api/user/streak`), updating Monday–Sunday bitmask/boolean log.

---

## 6. Mock Interview Simulator & 3rd-Party Avatar Integration

### Decision
Embedded 3rd-party AI Avatar iframe for interview presentation/interaction combined with server-side OpenAI STAR method evaluation for post-interview scoring.

### Rationale
- 3rd-party Avatar web solution is embedded in an `<iframe>` container within the interview room UI (`/interview/room/[id]`).
- The embedded avatar iframe handles avatar video, voice/text input, and question delivery.
- Our platform evaluation engine scores candidate responses against STAR criteria (Situation, Task, Action, Result), generating communication ratings (1-10), technical depth ratings (1-10), and rewritten `✅ Improved Answer` feedback snippets.

---

## 7. AI Avatar Mentor Interface

### Decision
Global embedded `<iframe>` drawer container for the independent 3rd-party AI Avatar solution.

### Rationale
- The entire AI Avatar Mentor interaction — visual avatar, text chat, voice-to-text input, and file attachment handling — is natively provided by the 3rd-party web application inside an `<iframe>`.
- The Career Portal layout hosts this iframe inside a responsive side panel or dedicated view (`AIMentorDrawer.tsx`).
- The surrounding container provides platform navigation links allowing users to jump directly to core modules (`/mock-interview`, `/cv-center`, `/dashboard`, etc.).
