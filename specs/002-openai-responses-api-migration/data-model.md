# Data Model: OpenAI Responses API Migration

**Feature**: 002-openai-responses-api-migration
**Date**: 2026-10-06

> **Note**: No database schema changes are required by this migration. This document confirms the existing entity model remains valid and documents what fields change in practice.

---

## Entity: Resume

Represents an uploaded CV file linked to a user.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` (cuid) | Primary key |
| `userId` | `String` | Foreign key to User |
| `fileName` | `String` | Original file name (unchanged) |
| `fileUrl` | `String` | Storage path (unchanged) |
| `fileSizeBytes` | `Int` | File size in bytes (unchanged) |
| `parsedText` | `String` | **Changed**: Now stores `""` for new uploads (no local extraction). Existing records unaffected. |
| `parsedData` | `Json` | Structured metadata (unchanged) |
| `uploadedAt` | `DateTime` | Upload timestamp (unchanged) |

**Behavioral change**: `parsedText` is set to `""` for files processed via the Responses API. The JSON re-analysis path (`resumeId`) reads `parsedText` from the DB; if empty, the analysis will fallback to the text "Candidate Resume - {fileName}" as a minimal context stub.

---

## Entity: ATSReport

Represents the AI-generated ATS analysis result for a Resume.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` (cuid) | Primary key |
| `resumeId` | `String` | Foreign key to Resume (unique — one report per resume) |
| `score` | `Int` | ATS score 0–100 |
| `missingKeywords` | `String[]` | List of missing keywords |
| `formattingIssues` | `Json[]` | Formatting issue counts |
| `redFlags` | `Json[]` | Red flag counts |
| `actionableFixes` | `Json` | Array of fix objects |
| `createdAt` | `DateTime` | Report timestamp |

**No changes** to this entity.

---

## Relationships

```
User (1) ──── (N) Resume (1) ──── (0..1) ATSReport
```

No relationship changes required.

---

## External Data: OpenAI File Object (transient, not persisted)

The OpenAI File object created during each request is **transient** — it is uploaded, used for inference, and deleted. It is not persisted to the application database.

| Property | Value |
|----------|-------|
| `purpose` | `"user_data"` |
| `filename` | Derived from the uploaded file name |
| `media_type` | `"application/pdf"` |
| Lifecycle | Created per-request, deleted after Responses API call completes |
