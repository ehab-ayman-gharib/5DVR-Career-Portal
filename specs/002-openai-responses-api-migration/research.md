# Research: OpenAI Responses API Migration

**Feature**: 002-openai-responses-api-migration
**Date**: 2026-10-06

---

## Decision 1: How to Upload a PDF to the OpenAI Responses API

**Decision**: Use the OpenAI Responses API (`openai.responses.create`) with an `input` array. The PDF file bytes are uploaded using the Files API (`openai.files.create`) or passed directly as an inline base64-encoded `input_file` within the `input` array.

The preferred approach is:
1. Read the PDF `ArrayBuffer` from the incoming `Request`
2. Create a `File` object from the buffer (or use a `Blob`)
3. Upload the file to OpenAI using `openai.files.create({ file, purpose: 'user_data' })`
4. Reference the uploaded file ID in the `responses.create` call via `{ type: 'input_file', file_id: fileId }`
5. Delete the file after the response is received (optional, but good hygiene)

**Rationale**: The Responses API is the successor to Chat Completions for models supporting reasoning. It natively handles file inputs as first-class `input` items.

**Alternatives considered**:
- **Inline base64**: Supported but increases request body size significantly for large PDFs. File ID approach is cleaner.
- **Continuing with Chat Completions**: Not compatible with `gpt-6.1-sol` reasoning effort parameter. Responses API is required.

---

## Decision 2: Reasoning Effort Parameter

**Decision**: Use `reasoning: { effort: 'low' }` in the `responses.create` call.

**Rationale**: Low reasoning effort is the most cost- and speed-efficient setting. The ATS analysis and CV parsing prompts are structured extraction tasks that do not require deep chain-of-thought reasoning.

**Alternatives considered**:
- `medium` / `high`: Higher accuracy but slower and more expensive. Appropriate for multi-step problem solving, not JSON extraction.

---

## Decision 3: `parsedTextSnippet` Field in parse-cv Response

**Decision**: Return an empty string `""` for `parsedTextSnippet` since there is no locally extracted text anymore. The frontend uses this field for debug display only; it is not rendered in the main UI.

**Rationale**: Avoids storing redundant or AI-reconstructed text. The contract is preserved — the field exists with an empty value.

**Alternatives considered**:
- Return AI-extracted summary: Would require an extra prompt or parsing. Over-engineered for a debug field.

---

## Decision 4: Resume `parsedText` Database Field

**Decision**: Store an empty string `""` in `parsedText` for new uploads processed via the Responses API (since no local extraction occurs). Existing records with locally extracted text are unaffected.

**Rationale**: The `parsedText` field is not surfaced to the frontend directly. The ATS analysis JSON body re-analysis path (via `resumeId`) will have an empty `parsedText`. In that case, the route falls back to passing the stored file through OpenAI again — but since we can't re-upload without the original file, that path will use the stored `parsedText` (empty) or return an error if no file is available.

**Alternative**: Store a brief AI-generated summary in `parsedText`. Requires an extra extraction step. Not required by FR.

**Resolved**: The JSON body re-analysis path (`application/json` with `resumeId`) will continue to read `parsedText` from the database. Since `parsedText` may now be empty for newly uploaded files, this path is a degraded-mode fallback. The primary path (file upload) always works.

---

## Decision 5: OpenAI SDK Version & Responses API Surface

**Decision**: Use the existing `openai` npm package (v4+). The Responses API is accessed via `openai.responses.create(...)`.

**Confirmed API surface**:
```typescript
const response = await openai.responses.create({
  model: 'gpt-6.1-sol',
  reasoning: { effort: 'low' },
  input: [
    {
      role: 'user',
      content: [
        { type: 'input_file', file_id: uploadedFileId },
        { type: 'input_text', text: prompt }
      ]
    }
  ]
});
const outputText = response.output_text;
```

---

## Decision 6: File Type Validation

**Decision**: Validate that the uploaded file's MIME type is `application/pdf` (or check extension `.pdf`) before uploading to OpenAI.

**Rationale**: OpenAI Responses API accepts PDF natively. Sending non-PDF files would produce an API error; it's better to fail fast with a clear validation message.

---

## Decision 7: Cleanup of `src/lib/openai.ts`

**Decision**: Simplify `openai.ts` to remove `LLM_BASE_URL`, `LLM_MODEL_ID`, `getTargetModel()`, and the Qwen fallback. Replace with a clean OpenAI client using only `OPENAI_API_KEY`, and export a constant `TARGET_MODEL = 'gpt-6.1-sol'`.

**Rationale**: Removes all Qwen/custom provider code. Maintains single-responsibility for the module.

---

## Decision 8: Error Handling for OpenAI API Errors

**Decision**: Wrap `openai.responses.create` and `openai.files.create` in try/catch. On error, log the error server-side and return the existing error response format:
- ATS route: `{ error: 'Failed to analyze resume for ATS score.' }` with status 500
- Parse-CV route: `{ error: 'Failed to parse CV and extract profile.' }` with status 500

**Rationale**: Matches the existing frontend error handling contracts.
