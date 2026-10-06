# Feature Specification: OpenAI Responses API Migration

**Feature Branch**: `002-openai-responses-api-migration`

**Created**: 2026-10-06

**Status**: Draft

**Input**: User description: "Replace the existing Qwen-based serverless API used by the CV/ATS analyzer with the official OpenAI API using gpt-6.1-sol."

## Overview

This feature migrates the backend AI provider for the CV/ATS Analyzer and CV Parser flows from a Qwen-compatible serverless endpoint to the official OpenAI Responses API. The PDF resume is sent directly to OpenAI as a file input rather than being pre-converted to text via a local PDF library. This is a server-side provider migration with no visible changes to the user interface or user experience.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — CV/ATS Analysis via Uploaded PDF (Priority: P1)

A job seeker uploads a PDF resume through the ATS Analyzer page. The system submits the file directly to the AI provider, which reads the document and returns a structured ATS report including a score, missing keywords, formatting issues, recruiter red flags, and actionable improvement recommendations.

**Why this priority**: This is the primary value delivery of the CV Center. Without it, users cannot receive ATS feedback.

**Independent Test**: Upload a PDF CV through `/cv-center/ats`. The system returns an ATS report (score, metrics, actionable fixes) without relying on any local PDF text extraction.

**Acceptance Scenarios**:

1. **Given** a logged-in user uploads a valid PDF resume ≤ 5MB, **When** they submit for ATS analysis, **Then** the system returns a structured ATS report with a score (0–100), missing keyword count, formatting issue count, red flag count, missing keywords list, and actionable fixes list.
2. **Given** a logged-in user submits without uploading a file and no saved resume exists, **When** the request is processed, **Then** the system returns a clear error message indicating no CV is available.
3. **Given** a logged-in user uploads a file larger than 5MB, **When** they submit, **Then** the system rejects the upload with a file-size error before sending anything to the AI provider.
4. **Given** a logged-in user uploads a file with an unsupported type (e.g., `.docx`), **When** they submit, **Then** the system rejects the file with a type-validation error.
5. **Given** the AI provider returns an error response, **When** the request is processed, **Then** the system returns an error in the format already consumed by the frontend, with no unhandled exception surfaced to the user.
6. **Given** a logged-in user has a previously saved resume record, **When** they request an ATS re-analysis via that resume ID (JSON body), **Then** the system uses the saved resume data to produce a report without requiring a new upload.

---

### User Story 2 — CV Parsing During Onboarding (Priority: P2)

During job-seeker onboarding, a user uploads their PDF resume so the system can extract structured profile information (name, education, field of interest, experience level, career goal, skills). The PDF is sent directly to the AI provider for extraction.

**Why this priority**: CV parsing populates the user's onboarding profile automatically. It saves time but is not required for the ATS analysis to function.

**Independent Test**: Upload a PDF CV to the onboarding parse endpoint. The system returns a structured profile object with extracted fields without any local PDF text extraction.

**Acceptance Scenarios**:

1. **Given** an onboarding user uploads a valid PDF resume ≤ 5MB, **When** the parse request is processed, **Then** the system returns a `parsedProfile` object with `firstName`, `lastName`, `education`, `fieldOfInterest`, `experienceLevel`, `careerGoal`, and `extractedSkills`.
2. **Given** no file is uploaded, **When** the request is processed, **Then** the system returns a 400 error with message "No file uploaded."
3. **Given** a file exceeds 5MB, **When** the request is processed, **Then** the system returns a 400 error with message "File size exceeds 5MB limit."
4. **Given** the AI provider fails to return valid structured JSON, **When** the response is processed, **Then** the system returns a best-effort profile using field normalization rather than crashing.

---

### Edge Cases

- What happens if the uploaded PDF is a valid PDF file but contains no extractable text (scanned image-only)?
  - System forwards the file to OpenAI as-is; the model's response may indicate low-confidence extraction. A fallback empty-field profile is returned rather than an error.
- What happens if the OpenAI API key is missing or expired?
  - The server returns a 500 error with a generic failure message. The API key must never be surfaced in the response.
- What happens if a file is a valid PDF type but is corrupt?
  - OpenAI returns an error; the system catches it and returns a 500 error matching the existing frontend error format.
- What happens when both a file upload and a JSON resume ID are provided simultaneously?
  - The file upload takes precedence; the JSON resume ID path is only used when no file is included.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST accept PDF files (≤ 5MB) and submit them directly to the official OpenAI Responses API without local PDF text extraction.
- **FR-002**: The system MUST use the `gpt-6.1-sol` model with low reasoning effort for all AI calls in this feature.
- **FR-003**: The system MUST remove the Qwen/OpenAI-compatible custom base URL configuration and all provider-specific overrides from the AI client.
- **FR-004**: The system MUST remove the `pdf-parse` library dependency and all associated local PDF-to-text conversion logic.
- **FR-005**: The system MUST validate uploaded files for presence, type (PDF only), and size (≤ 5MB) before any API call is made.
- **FR-006**: The system MUST keep the OpenAI API key exclusively server-side, using the existing environment variable (`OPENAI_API_KEY`). It MUST NOT be exposed to the client.
- **FR-007**: The ATS analysis route MUST return responses in the exact same JSON structure currently consumed by the frontend: `{ reportId, resumeId, fileName, score, metrics, missingKeywords, actionableFixes }`.
- **FR-008**: The CV parse route MUST return responses in the exact same JSON structure: `{ parsedProfile, parsedTextSnippet }`.
- **FR-009**: The system MUST handle OpenAI API errors gracefully and return error responses in the format already expected by the frontend.
- **FR-010**: The ATS analysis route MUST continue to support both multipart/form-data (file upload) and application/json (existing resume ID) request modes.
- **FR-011**: The ATS report MUST continue to be persisted to the database after successful analysis.
- **FR-012**: The existing CV upload modal, frontend flow, validation messages, loading states, and error handling MUST remain unchanged unless a backend structural change requires a frontend adjustment.

### Key Entities

- **Resume**: Represents an uploaded CV file. Attributes: `fileName`, `fileUrl`, `fileSizeBytes`, `parsedText`, `parsedData`. Now stores AI-extracted text summary instead of locally extracted text.
- **ATSReport**: The structured analysis report linked to a Resume. Attributes: `score`, `missingKeywords`, `formattingIssues`, `redFlags`, `actionableFixes`. Unchanged.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: ATS analysis is completed and results displayed to the user within an acceptable response window (no worse than current Qwen endpoint performance).
- **SC-002**: 100% of PDF uploads are processed without any local text extraction step — the file is passed directly to the AI provider.
- **SC-003**: Zero frontend components or pages require modification as a result of this migration.
- **SC-004**: The existing ATS score, metrics, keywords, and actionable fix sections continue to render correctly using the migrated backend.
- **SC-005**: All file validation errors (missing file, wrong type, size exceeded) continue to be surfaced to the user with the same messages as before.
- **SC-006**: The OpenAI API key is never present in any client-side response body, headers, or logs.
- **SC-007**: The `pdf-parse` package is fully removed from the project's dependency tree.

---

## Assumptions

- The `gpt-6.1-sol` model in the OpenAI Responses API supports direct file input (PDF) as an `input_file` parameter.
- "Low reasoning effort" is a supported parameter in the OpenAI Responses API and provides faster, more cost-efficient results than default reasoning.
- The existing ATS prompt wording produces equivalent quality output when the model reads the PDF directly vs. receiving pre-extracted text.
- The `parsedTextSnippet` field returned by the parse-cv route can be an empty string or a brief descriptive placeholder since there is no longer a locally extracted text to sample.
- The existing `OPENAI_API_KEY` environment variable is already configured in the deployment environment.
- No database schema changes are required. The `parsedText` field in the Resume model can store a brief AI-generated summary or be set to an empty string.
- This migration covers only `src/app/api/cv/ats/route.ts`, `src/app/api/onboarding/parse-cv/route.ts`, `src/lib/openai.ts`, and `src/lib/pdf-parser.ts`. All other routes and components are out of scope.
