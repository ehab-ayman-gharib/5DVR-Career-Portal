# Data Model Specification: Career Portal — Full Platform

**Feature Branch**: `001-career-portal-platform`
**Created**: 2026-07-21
**Status**: Design Phase Complete

This document outlines the database schema entities, relationships, validation rules, and state transitions using Prisma ORM notation for Supabase PostgreSQL.

---

## 1. Entity Relationship Overview

```mermaid
erDiagram
    WhitelistEntry ||--o{ UserProfile : "authorizes"
    UserProfile ||--o1 DailyStreak : "tracks"
    UserProfile ||--o{ Resume : "owns"
    UserProfile ||--o{ Assessment : "completes"
    UserProfile ||--o{ CareerMatch : "receives"
    UserProfile ||--o1 Roadmap : "follows"
    UserProfile ||--o{ MockInterview : "conducts"

    Resume ||--o1 ATSReport : "generates"
    Resume ||--o{ JDMatchReport : "matches"
    
    Roadmap ||--o{ RoadmapStage : "contains"
    RoadmapStage ||--o{ RoadmapItem : "includes"
    
    MockInterview ||--o1 InterviewReport : "produces"
```

---

## 2. Entity Definitions & Schemas

### 2.1 Access Control & User Profiles

#### `WhitelistEntry`
Pre-approved email addresses permitted to sign up and access app content.
- `id` (String, UUID, PK)
- `email` (String, Unique, Index) — lowercased email address
- `addedAt` (DateTime, default `now()`)
- `notes` (String, Optional) — admin notes

#### `UserProfile`
User profile linked to Supabase Auth User ID (`sub`).
- `id` (String, UUID, PK) — matches Supabase `auth.users.id`
- `email` (String, Unique, Index)
- `firstName` (String)
- `lastName` (String)
- `path` (Enum: `STUDENT`, `JOB_SEEKER`)
- `education` (String, Optional)
- `fieldOfInterest` (String, Optional)
- `experienceLevel` (Enum: `ENTRY_LEVEL`, `MID_LEVEL`, `SENIOR`, `STUDENT`)
- `careerGoal` (String, Optional)
- `skills` (Array of String, default `[]`) — list of candidate skills added manually or extracted from CV
- `createdAt` (DateTime, default `now()`)
- `updatedAt` (DateTime, updated)

#### `DailyStreak`
Tracks daily login consistency and weekly activity.
- `id` (String, UUID, PK)
- `userId` (String, FK -> UserProfile.id, Unique)
- `currentStreak` (Int, default 1)
- `lastActiveDate` (DateTime)
- `weeklyLog` (Json) — `{ "mon": bool, "tue": bool, "wed": bool, "thu": bool, "fri": bool, "sat": bool, "sun": bool }`

---

### 2.2 CV Intelligence Center

#### `Resume`
Uploaded user resume document.
- `id` (String, UUID, PK)
- `userId` (String, FK -> UserProfile.id)
- `fileName` (String)
- `fileUrl` (String) — Supabase Storage bucket path
- `fileSizeBytes` (Int) — validation: <= 5242880 (5MB)
- `parsedText` (String, Text)
- `parsedData` (Json) — `{ skills: [], experience: [], education: [] }`
- `uploadedAt` (DateTime, default `now()`)

#### `ATSReport`
Consolidated ATS score evaluation.
- `id` (String, UUID, PK)
- `resumeId` (String, FK -> Resume.id, Unique)
- `score` (Int) — range 0 to 100
- `missingKeywords` (Json) — array of string keywords
- `formattingIssues` (Json) — array of issue objects
- `redFlags` (Json) — array of flag objects
- `actionableFixes` (Json) — array of recommendation objects
- `createdAt` (DateTime, default `now()`)

#### `JDMatchReport`
Comparison report between resume and target Job Description.
- `id` (String, UUID, PK)
- `resumeId` (String, FK -> Resume.id)
- `jobDescriptionText` (String, Text)
- `positionTitle` (String, Optional)
- `companyName` (String, Optional)
- `matchScore` (Int) — range 0 to 100
- `matchTier` (Enum: `STRONG_FIT`, `GOOD_POTENTIAL`, `WORTH_EXPLORING`, `WEAK_MATCH`)
- `strengths` (Json) — array of matching point strings
- `criticalGaps` (Json) — array of gap objects
- `keywordAnalysis` (Json) — `{ present: [], missing: [] }`
- `salaryMin` (Int, Optional)
- `salaryMax` (Int, Optional)
- `targetSalary` (Int, Optional)
- `negotiationTip` (String, Text, Optional)
- `createdAt` (DateTime, default `now()`)

---

### 2.3 Career Discovery & Roadmaps (Student Path)

#### `Assessment`
Single discovery quiz instance.
- `id` (String, UUID, PK)
- `userId` (String, FK -> UserProfile.id)
- `type` (Enum: `CAREER_INTEREST`, `PERSONALITY_TRAITS`, `LEARNING_READINESS`, `COGNITIVE_ABILITIES`, `MOTIVATORS`)
- `status` (Enum: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`)
- `answers` (Json) — key-value question responses
- `scoreSummary` (Json, Optional)
- `completedAt` (DateTime, Optional)

#### `CareerMatch`
Calculated career recommendation based on assessments.
- `id` (String, UUID, PK)
- `userId` (String, FK -> UserProfile.id)
- `careerTitle` (String)
- `matchScore` (Int) — range 0 to 100
- `matchCategory` (Enum: `STRONG_MATCH`, `GOOD_POTENTIAL`, `WORTH_EXPLORING`)
- `whyFits` (String, Text)
- `skillGaps` (Json) — array of gap strings
- `createdAt` (DateTime, default `now()`)

#### `Roadmap`
Interactive adaptive learning timeline.
- `id` (String, UUID, PK)
- `userId` (String, FK -> UserProfile.id, Unique)
- `careerPathTitle` (String)
- `jobReadinessScore` (Int, default 0) — range 0 to 100
- `totalXP` (Int, default 0)
- `estimatedMonths` (Int, default 4)
- `createdAt` (DateTime, default `now()`)

#### `RoadmapStage`
A single chronological phase in a roadmap.
- `id` (String, UUID, PK)
- `roadmapId` (String, FK -> Roadmap.id)
- `stageOrder` (Int)
- `title` (String)
- `status` (Enum: `COMPLETED`, `IN_PROGRESS`, `LOCKED`)
- `progressPercent` (Int, default 0)

#### `RoadmapItem`
Individual learning activity.
- `id` (String, UUID, PK)
- `stageId` (String, FK -> RoadmapStage.id)
- `itemType` (Enum: `LECTURE`, `PRACTICE_TASK`, `INTERVIEW_CHECKPOINT`)
- `title` (String)
- `isCompleted` (Boolean, default false)
- `xpValue` (Int, default 50)

---

### 2.4 Mock Interview Simulator

#### `MockInterview`
Recorded interview session metadata.
- `id` (String, UUID, PK)
- `userId` (String, FK -> UserProfile.id)
- `mode` (Enum: `TECHNICAL`, `SALARY_NEGOTIATION`, `HR_BEHAVIORAL`, `PROBLEM_SOLVING`)
- `durationSeconds` (Int)
- `status` (Enum: `IN_PROGRESS`, `COMPLETED`, `FAILED`)
- `overallScore` (Int, Optional) — range 0 to 100
- `startedAt` (DateTime, default `now()`)
- `completedAt` (DateTime, Optional)

#### `InterviewReport`
Detailed feedback report for a completed interview.
- `id` (String, UUID, PK)
- `interviewId` (String, FK -> MockInterview.id, Unique)
- `qualitativeSummary` (String, Text)
- `communicationScore` (Int) — range 1 to 10
- `technicalDepthScore` (Int) — range 1 to 10
- `categoryAnalysis` (Json) — detailed category ratings
- `transcriptComparison` (Json) — array of `{ question: string, detectedTranscript: string, weaknesses: string[], improvedAnswer: string }`
- `createdAt` (DateTime, default `now()`)

---

### 2.5 AI Avatar Mentor (Embedded Iframe Solution)

*Note: Chat conversation history, voice recordings, and file attachments for the AI Avatar Mentor are managed natively within the 3rd-party embedded iframe web application.*

