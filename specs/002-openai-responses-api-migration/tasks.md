# Tasks: OpenAI Responses API Migration

**Input**: Design documents from `/specs/002-openai-responses-api-migration/`

**Prerequisites**: spec.md ✅ | plan.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Tests**: Not explicitly requested. Manual validation via quickstart.md scenarios.

**Feature**: Migrate CV/ATS Analyzer and CV Parser from Qwen-compatible endpoint to official OpenAI Responses API (`gpt-6.1-sol`, low reasoning effort). Remove `pdf-parse`. No frontend or schema changes.

---

## Phase 1: Setup — Dependency & Client Cleanup

**Purpose**: Remove Qwen/custom-provider code and the pdf-parse dependency. Establish the clean OpenAI client. This phase MUST complete before either user story can be implemented.

**Independent Test**: After this phase, `src/lib/openai.ts` exports only the official OpenAI client with `TARGET_MODEL`. Running `npm ls pdf-parse` returns nothing. The project builds without errors.

- [x] T001 Refactor `src/lib/openai.ts` — remove `LLM_BASE_URL`, `LLM_MODEL_ID`, `getTargetModel()`, Qwen model name, and custom `baseURL`. Replace `getTargetModel` export with `export const TARGET_MODEL = 'gpt-6.1-sol'`. Keep `OPENAI_API_KEY` from environment. No `baseURL` override.
- [x] T002 Delete `src/lib/pdf-parser.ts` entirely — the file is no longer referenced after T003 and T004 complete.
- [x] T003 Remove `pdf-parse` from `package.json` dependencies and run `npm uninstall pdf-parse` to update `package-lock.json`.

---

## Phase 2: User Story 1 — ATS Analysis via Responses API (P1)

**Purpose**: Refactor `/api/cv/ats/route.ts` to use the OpenAI Responses API with direct PDF file upload instead of `pdf-parse` + Chat Completions.

**Story**: US1 — A job seeker uploads a PDF resume. The system sends it directly to OpenAI and receives a structured ATS report.

**Independent Test**: Upload a PDF via `/cv-center/ats`. The page displays a score, metrics, and actionable fixes. The network response matches the existing JSON shape. No `parsePdfBuffer` call in logs.

- [x] T004 [US1] Remove `import { parsePdfBuffer }` and `import { openai, getTargetModel }` from `src/app/api/cv/ats/route.ts`. Add `import OpenAI from 'openai'` and `import { TARGET_MODEL } from '@/lib/openai'`.
- [x] T005 [US1] In the `multipart/form-data` branch of `src/app/api/cv/ats/route.ts`: replace `const buffer = Buffer.from(arrayBuffer); parsedText = await parsePdfBuffer(buffer)` with a PDF file object held in memory. Validate that `file.type === 'application/pdf'` or file name ends with `.pdf`; return 400 with `{ error: 'Invalid file type. Only PDF files are accepted.' }` if not.
- [x] T006 [US1] In `src/app/api/cv/ats/route.ts`, after file validation: upload the PDF to OpenAI using `openai.files.create({ file: new File([buffer], file.name, { type: 'application/pdf' }), purpose: 'user_data' })`. Store the returned `fileId`. Set `parsedText = ''` (no local extraction). Pass `fileId` in scope for the Responses API call.
- [x] T007 [US1] Replace the `openai.chat.completions.create(...)` call in `src/app/api/cv/ats/route.ts` with `openai.responses.create({ model: TARGET_MODEL, reasoning: { effort: 'low' }, input: [{ role: 'user', content: [{ type: 'input_file', file_id: fileId }, { type: 'input_text', text: prompt }] }] })`. Extract output text from `response.output_text`.
- [x] T008 [US1] After the Responses API call in `src/app/api/cv/ats/route.ts`: delete the uploaded file via `openai.files.del(fileId)` in a try/catch (fire-and-forget). Update `parsedText` written to the DB Resume record to `''`.
- [x] T009 [US1] Update the JSON re-analysis path (`application/json` branch) in `src/app/api/cv/ats/route.ts`: when `parsedText` from DB is empty, build a minimal context string `"Candidate Resume — ${fileName}"` and call the Responses API with only `input_text` (no `input_file`) using that stub. Preserve the existing DB-based report upsert.
- [x] T010 [US1] Verify the response shape of `src/app/api/cv/ats/route.ts` still exactly matches `{ reportId, resumeId, fileName, score, metrics: { missingKeywordsCount, formattingIssuesCount, redFlagsCount }, missingKeywords, actionableFixes }`. Confirm no additional fields are added or removed.

---

## Phase 3: User Story 2 — CV Parsing via Responses API (P2)

**Purpose**: Refactor `/api/onboarding/parse-cv/route.ts` to use the OpenAI Responses API with direct PDF file upload instead of `pdf-parse` + Chat Completions.

**Story**: US2 — During onboarding, a user uploads a PDF resume. The system extracts structured profile fields using OpenAI directly.

**Independent Test**: Upload a PDF CV to the onboarding parse endpoint. The response includes a `parsedProfile` with all 7 fields. `parsedTextSnippet` is `""`. No `parsePdfBuffer` references in logs.

- [x] T011 [US2] Remove `import { parsePdfBuffer }` and `import { openai, getTargetModel }` from `src/app/api/onboarding/parse-cv/route.ts`. Add `import OpenAI from 'openai'` and `import { TARGET_MODEL } from '@/lib/openai'`.
- [x] T012 [US2] In `src/app/api/onboarding/parse-cv/route.ts`: replace the `arrayBuffer → buffer → parsePdfBuffer` flow with: validate `file.type === 'application/pdf'` (return 400 if not), then upload via `openai.files.create({ file: new File([buffer], file.name, { type: 'application/pdf' }), purpose: 'user_data' })`. Store `fileId`.
- [x] T013 [US2] Replace `openai.chat.completions.create(...)` in `src/app/api/onboarding/parse-cv/route.ts` with `openai.responses.create({ model: TARGET_MODEL, reasoning: { effort: 'low' }, input: [{ role: 'user', content: [{ type: 'input_file', file_id: fileId }, { type: 'input_text', text: prompt }] }] })`. Extract output text from `response.output_text`. Delete the OpenAI file via `openai.files.del(fileId)` in a try/catch after the call.
- [x] T014 [US2] Remove the `extractEducationFallback` helper function and its inline call from `src/app/api/onboarding/parse-cv/route.ts` — the model now reads the PDF directly and is expected to extract education accurately. Keep the `getVal` key normalization helper and the `parsedProfile` construction block unchanged.
- [x] T015 [US2] Update the response in `src/app/api/onboarding/parse-cv/route.ts`: change `parsedTextSnippet: parsedText.substring(0, 300)` to `parsedTextSnippet: ''`. Verify the full response shape is `{ parsedProfile, parsedTextSnippet }`.

---

## Phase 4: Polish & Validation

**Purpose**: Confirm cleanup is complete, build passes, and no dead code remains.

- [x] T016 [P] Search codebase for any remaining references to `parsePdfBuffer`, `pdf-parse`, `getTargetModel`, `LLM_BASE_URL`, `LLM_MODEL_ID` — confirm zero results.
- [x] T017 [P] Run `npm run build` (or `npx tsc --noEmit`) and confirm zero TypeScript errors. Fix any type errors introduced by the migration (e.g., `openai.responses` type shape for `output_text`).
- [x] T018 [P] Manually validate Quickstart Scenario 1 (ATS upload) and Scenario 4 (onboarding parse) using the guide in `quickstart.md`. Confirm both return expected JSON structures.
- [x] T019 Verify Quickstart Scenario 6 (cleanup verification): `npm ls pdf-parse` returns empty. Full-text search for removed symbols returns zero hits across `src/`.

---

## Phase 5: Evidence-Based ATS Evaluation & Truncation Elimination (Enhancement)

**Purpose**: Upgrade ATS prompt to evidence-based evaluation without job assumptions, remove artificial 3k/4k char cutoffs, and render evidence/severity in UI.

- [x] T020 Remove legacy `.substring(0, 4000)` and `.substring(0, 3000)` character cutoffs in `src/app/api/cv/ats/route.ts` and `src/app/api/cv/match/route.ts` to allow full document context.
- [x] T021 Upgrade ATS system prompt in `src/app/api/cv/ats/route.ts` to 5-category evidence-based scoring (Parseability 25, Content 25, Keywords 25, Structure 15, Readability 10), requiring detected specialization, keyword opportunities supported by resume evidence, strengths, and verbatim evidence citations.
- [x] T022 Update `FixRecommendations.tsx` to display priority severity badges (`HIGH`, `MEDIUM`, `LOW`) and verbatim resume evidence citations.
- [x] T023 Update `cv-center/ats/page.tsx` to render detected specialization banner, 5-category score breakdown, detected strengths, and keyword opportunities.
- [x] T024 Validate TypeScript compilation with `npx tsc --noEmit` and confirm zero regressions.

---

## Dependencies

```
T001 → T004, T011  (openai.ts refactored before route imports updated)
T002 → T004, T011  (pdf-parser.ts deleted after all imports removed)
T003               (uninstall pdf-parse — run after T002)
T004 → T005        (imports cleared before logic changes)
T005 → T006 → T007 → T008  (US1 sequential: validate → upload → call API → cleanup)
T009               (can follow T007, independent code path)
T010               (response shape verification — follows T008)
T011 → T012 → T013 → T014 → T015  (US2 sequential)
T016, T017, T018   (parallel — all after Phase 2 and 3 complete)
T019               (after T003 and T016)
```

## Implementation Strategy

**MVP**: Phase 1 + Phase 2 (T001–T010) — ATS Analyzer fully migrated and verified. Delivers the highest-priority user story (P1).

**Full delivery**: Phase 3 (T011–T015) — CV Parser also migrated.

**Complete**: Phase 4 (T016–T019) — Cleanup verified, build passing.

Estimate: ~3–4 hours for a focused implementation pass. No schema migrations, no frontend changes, no new infrastructure.
