# Quickstart Validation Guide: OpenAI Responses API Migration

**Feature**: 002-openai-responses-api-migration
**Date**: 2026-10-06

---

## Prerequisites

- Local dev server running: `npm run dev`
- `.env.local` contains `OPENAI_API_KEY=sk-...` (real key, not placeholder)
- A test PDF resume file ≤ 5MB available locally
- A logged-in user session (for ATS route, which requires auth)

---

## Scenario 1: ATS Analysis — New PDF Upload

**Goal**: Validate that the ATS analyzer processes a PDF directly via OpenAI Responses API and returns a valid report.

**Steps**:
1. Navigate to `/cv-center/ats`
2. Upload a PDF resume via the file picker modal
3. Click "Analyze"
4. Wait for the loading state to complete

**Expected outcome**:
- ATS score gauge renders with a value 0–100
- Missing keywords, formatting issues, red flag counts appear
- Actionable fixes list populates with at least one entry
- No console errors referencing `pdf-parse` or `LLM_BASE_URL`
- Network request to `/api/cv/ats` returns `200` with the response shape:
  ```json
  {
    "reportId": "...",
    "resumeId": "...",
    "fileName": "...",
    "score": 78,
    "metrics": { "missingKeywordsCount": 4, "formattingIssuesCount": 2, "redFlagsCount": 1 },
    "missingKeywords": [...],
    "actionableFixes": [...]
  }
  ```

---

## Scenario 2: ATS Analysis — File Exceeds 5MB

**Goal**: Validate that oversized files are rejected before any API call.

**Steps**:
1. Navigate to `/cv-center/ats`
2. Upload a file larger than 5MB
3. Click "Analyze"

**Expected outcome**:
- Error message displayed: "File size exceeds 5MB limit."
- No OpenAI API call is made (check server logs)
- HTTP 400 returned

---

## Scenario 3: ATS Analysis — Unauthenticated User

**Goal**: Validate that the auth guard is still in place.

**Steps**:
1. Clear session cookies
2. Send a POST to `/api/cv/ats` with a PDF file

**Expected outcome**:
- HTTP 401 returned with `{ "error": "Unauthorized user" }`

---

## Scenario 4: CV Parse — Onboarding Upload

**Goal**: Validate that CV parsing during onboarding extracts profile fields from a PDF via OpenAI.

**Steps**:
1. Navigate to `/onboarding` → select "Career Professional"
2. Upload a PDF resume when prompted
3. Wait for profile extraction

**Expected outcome**:
- Profile fields auto-populated: first name, last name, education, field of interest, experience level, career goal, skills
- `parsedTextSnippet` is empty string (no local text extraction)
- No errors in console referencing `pdf-parse`

---

## Scenario 5: CV Parse — No File Uploaded

**Goal**: Validate error handling when no file is provided.

**Steps**:
1. Send a POST to `/api/onboarding/parse-cv` with an empty form body

**Expected outcome**:
- HTTP 400 with `{ "error": "No file uploaded." }`

---

## Scenario 6: Cleanup Verification

**Goal**: Confirm `pdf-parse` and Qwen code are fully removed.

**Steps**:
1. Run `npm ls pdf-parse` — should return "not found" or empty
2. Search codebase for `LLM_BASE_URL`, `LLM_MODEL_ID`, `getTargetModel`, `parsePdfBuffer`, `pdf-parse` — should return 0 results
3. Run `npm run build` — should complete without errors

**Expected outcome**: No references to removed code. Build succeeds.

---

## Scenario 7: Database Persistence Check

**Goal**: Confirm ATSReport is saved to database after analysis.

**Steps**:
1. Complete Scenario 1 successfully
2. Query Supabase or use Prisma Studio: `SELECT * FROM "ATSReport" ORDER BY "createdAt" DESC LIMIT 1`

**Expected outcome**:
- A new ATSReport record exists with the `score`, `missingKeywords`, and `actionableFixes` from the response

---

## Reference

- **API contracts**: See [plan.md → API Contracts section](./plan.md#api-contracts-unchanged)
- **Data model**: See [data-model.md](./data-model.md)
- **Research decisions**: See [research.md](./research.md)
