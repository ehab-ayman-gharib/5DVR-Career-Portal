# Implementation Plan: Career Portal — Full Platform

**Branch**: `001-career-portal-platform` | **Date**: 2026-07-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-career-portal-platform/spec.md`

## Summary

The Career Portal platform is an AI-powered, adaptive career readiness web application built with Next.js (App Router), Tailwind CSS, Supabase (PostgreSQL), Prisma ORM, Google OAuth with email whitelisting middleware, OpenAI/Whisper APIs, and a 3rd-party avatar iframe integration. It provides dual-path onboarding (Student vs. Job Seeker), personalized dashboards, CV Intelligence with ATS scoring & text-based JD matching, 5-stage student career discovery assessments, adaptive roadmaps with XP/streak gamification, 4 mock interview modes with STAR method transcript evaluation, and an AI Avatar Mentor.

## Technical Context

**Language/Version**: TypeScript 5.x (Strict Type Safety), Node.js 20+

**Primary Dependencies**: Next.js 14+ (App Router), React 18, Tailwind CSS, Prisma ORM, Supabase Auth SSR (@supabase/ssr), OpenAI Node SDK (v4+), `pdf-parse` (PDF text extraction), Lucide React (Icons), Framer Motion (Animations)

**AI Engine Provider**: Configurable OpenAI-compatible client (`lib/openai.ts`). Supports **Development / Testing Mode** (`LLM_PROVIDER=custom_dev`, base URL `https://ehab-ayman-gh--ep-qwen3-6-27b-fp8-server.eu-west.modal.direct/v1/chat/completions`, model `Qwen/Qwen3.6-27B-FP8`, unauthenticated) with server-side `pdf-parse` text extraction, and **Production Mode** (`LLM_PROVIDER=openai`, official OpenAI API).

**Storage**: Supabase PostgreSQL managed via Prisma ORM; Supabase Storage Buckets for CV file uploads (PDF/DOCX max 5MB payload limit)

**Testing**: Jest, React Testing Library, Playwright (End-to-End integration testing)

**Target Platform**: Modern Web Browsers (Desktop & Responsive Mobile)

**Project Type**: Full-stack Next.js Web Application

**Performance Goals**: ATS report generation < 10s, JD match report generation < 15s, Embedded AI Avatar iframe load latency < 3s, Page route navigation < 2s

**Constraints**: Strict email whitelisting enforcement, max 5MB resume file size upload limit, entire AI Avatar module (visual avatar, text chat, voice-to-text, attachments) embedded via 3rd-party iframe, zero data loss on quiz exit

**Scale/Scope**: 2 distinct user persona paths, 8 full product modules, 11 primary user stories, 18 testable functional requirements

## Constitution Check

*GATE: Passed before Phase 0 research. Verified post-design.*

| Principle / Technical Standard | Verification Status | Compliance Details |
|---|---|---|
| **I. Responsive, Accessible & Consistent UI** | PASS | Standardized layout shells with Tailwind CSS; distinct Student & Job Seeker dashboard themes. |
| **II. Modular & Reusable UI Architecture** | PASS | Modular components for streak tracker, ATS radial score gauge, dynamic roadmap timeline, and transcript comparison cards. |
| **III. Strict Typing & Robust Error Handling** | PASS | TypeScript strict mode enforced across all models, Prisma schemas, and API contracts. Error boundaries for file uploads and LLM connectors. |
| **IV. Comprehensive Testing** | PASS | Test verification planned for XP tracking, streak counts, assessment state transitions, and STAR method transcript scoring. |
| **V. Performance & Low Latency** | PASS | Active loading states for AI feedback generation; 5MB payload enforcement; optimized streaming response handling. |
| **Tech Standard: Google OAuth & Whitelist** | PASS | Supabase Auth + Next.js Middleware checking PostgreSQL `WhitelistEntry` table. |
| **Tech Standard: OpenAI/Whisper APIs** | PASS | Structured Outputs schema validation for CV parsing, ATS scoring, and STAR interview reports. |

## Project Structure

### Documentation (this feature)

```text
specs/001-career-portal-platform/
├── plan.md              # This implementation plan
├── research.md          # Phase 0 technical research findings
├── data-model.md        # Phase 1 Prisma schema & entity relationship definitions
├── quickstart.md        # Phase 1 runnable end-to-end validation scenarios
├── contracts/           # Phase 1 API specifications
│   ├── auth.md
│   ├── onboarding.md
│   ├── cv-ats.md
│   └── mock-interview.md
├── checklists/
│   └── requirements.md  # Spec quality validation checklist
└── spec.md              # Feature specification
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── access-denied/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── onboarding/
│   │   │   ├── student/page.tsx
│   │   │   └── job-seeker/page.tsx
│   │   ├── cv-center/
│   │   │   ├── ats/page.tsx
│   │   │   └── jd-matcher/page.tsx
│   │   ├── discovery/
│   │   │   ├── page.tsx
│   │   │   └── quiz/[id]/page.tsx
│   │   ├── roadmap/page.tsx
│   │   └── interview/
│   │       ├── page.tsx
│   │       ├── room/[id]/page.tsx
│   │       └── report/[id]/page.tsx
│   ├── api/
│   │   ├── auth/verify/route.ts
│   │   ├── onboarding/parse-cv/route.ts
│   │   ├── onboarding/profile/route.ts
│   │   ├── cv/ats/route.ts
│   │   ├── cv/match/route.ts
│   │   ├── discovery/assessment/route.ts
│   │   ├── roadmap/progress/route.ts
│   │   ├── interview/session/route.ts
│   │   └── interview/evaluate/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── dashboard/
│   │   ├── StreakTracker.tsx
│   │   ├── ATSScoreGauge.tsx
│   │   └── TaskList.tsx
│   ├── cv/
│   │   ├── CVUploader.tsx
│   │   └── FixRecommendations.tsx
│   ├── discovery/
│   │   ├── QuizEngine.tsx
│   │   └── CareerProfileCard.tsx
│   ├── roadmap/
│   │   ├── Timeline.tsx
│   │   └── MilestoneCard.tsx
│   ├── interview/
│   │   ├── AvatarIframe.tsx
│   │   └── TranscriptComparison.tsx
│   ├── mentor/
│   │   └── AIMentorIframeDrawer.tsx
│   └── ui/
├── lib/
│   ├── prisma.ts
│   ├── supabase/
│   ├── openai.ts
│   └── utils.ts
└── middleware.ts

prisma/
└── schema.prisma

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Selected Next.js App Router full-stack web application layout with modular feature components (`components/`), API route handlers (`app/api/`), server middleware (`middleware.ts`), and database ORM layer (`prisma/`).

## Complexity Tracking

*No violations detected. Plan adheres strictly to Constitution guidelines.*
