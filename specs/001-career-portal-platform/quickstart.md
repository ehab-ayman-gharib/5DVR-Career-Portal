# Quickstart & End-to-End Validation Guide: Career Portal

**Feature Branch**: `001-career-portal-platform`
**Created**: 2026-07-21
**Status**: Ready for Implementation

This guide provides runnable scenarios to validate the implementation of the Career Portal platform.

---

## 1. Prerequisites & Environment Setup

Ensure environment variables are configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Engine Configuration
# Development / Testing Mode (Low-Cost Modal Endpoint - Unauthenticated)
LLM_PROVIDER=custom_dev
LLM_BASE_URL=https://ehab-ayman-gh--ep-qwen3-6-27b-fp8-server.eu-west.modal.direct/v1
LLM_MODEL_ID=Qwen/Qwen3.6-27B-FP8

# Production Mode (Official OpenAI Endpoint)
# LLM_PROVIDER=openai
# OPENAI_API_KEY=sk-your-openai-key
# LLM_MODEL_ID=gpt-4o-mini

3RD_PARTY_AVATAR_EMBED_URL=https://avatar.provider.com/embed
```

---

## 2. Seed Whitelist Data

Insert test emails into Supabase PostgreSQL:
```sql
INSERT INTO "WhitelistEntry" (id, email, "addedAt")
VALUES 
  (gen_random_uuid(), 'whitelisted@example.com', NOW()),
  (gen_random_uuid(), 'student@example.com', NOW());
```

---

## 3. End-to-End Validation Scenarios

### Scenario 1: Unwhitelisted Email Block
1. Navigate to `http://localhost:3000`.
2. Click "Sign in with Google" and authenticate using `unapproved@example.com`.
3. **Expected Outcome**: Redirected immediately to `http://localhost:3000/access-denied`. Dashboard routes remain inaccessible.

### Scenario 2: Student Dual-Path Onboarding & Discovery
1. Sign in using `student@example.com` (whitelisted).
2. On the Onboarding screen, choose **"Start My Journey" (Student)**.
3. Fill out the starter profile form (Name, Education, Goal) and submit.
4. **Expected Outcome**: Redirected to Student Dashboard displaying streak tracker, discovery assessment CTA, and 0% roadmap progress.
5. Complete 1 Career Discovery Assessment (7 questions).
6. **Expected Outcome**: Career Archetype results render; career matches show correlation scores.

### Scenario 3: Job Seeker CV Upload & ATS Analysis
1. Sign in using `whitelisted@example.com` (whitelisted).
2. Choose **"Get Interview-Ready" (Job Seeker)** on Onboarding screen.
3. Drag and drop a sample 2-page PDF resume (under 5MB).
4. **Expected Outcome**: Profile auto-populates from parsed CV data. After confirming, user lands on Job Seeker Dashboard with radial ATS Score widget (e.g. 74/100).
5. Navigate to CV Intelligence -> Job Description Matcher.
6. Paste job description text and click "Analyze Match".
7. **Expected Outcome**: JD Match Report displays match score %, missing keywords table, and salary negotiation tips.

### Scenario 4: Technical Mock Interview & Avatar Room
1. From Job Seeker Dashboard, click "Start Mock Interview".
2. Select **Technical Interview** mode.
3. Proceed through preparation checklist; verify iframe container for 3rd-party Avatar embeds correctly.
4. Complete the 3-question session and submit.
5. **Expected Outcome**: Evaluation Report renders with overall score, category breakdown (Communication & Technical Depth), and side-by-side transcript vs. `✅ Improved Answer` comparison.

### Scenario 5: AI Avatar Mentor Embedded Iframe Integration
1. Click the "Ask AI Mentor" button on the global navigation/dashboard.
2. Verify the AI Mentor side panel drawer opens (`AIMentorIframeDrawer.tsx`).
3. **Expected Outcome**: The 3rd-party AI Avatar solution loads and renders cleanly inside the `<iframe>` container (including its native chat input, voice recording, file upload, and video avatar UI).
4. Click a platform navigation link inside the drawer header (e.g. "Mock Interviews").
5. **Expected Outcome**: Platform routes seamlessly to `/interview`.
