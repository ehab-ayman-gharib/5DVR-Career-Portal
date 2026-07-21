# API Contract: Mock Interview Simulator

**Path Base**: `/api/interview`

---

## 1. Create Interview Session

### `POST /api/interview/session`

Initializes a new mock interview session and returns avatar iframe config.

#### Request JSON
```json
{
  "mode": "TECHNICAL"
}
```

#### Response 201 Created
```json
{
  "interviewId": "int_776655",
  "mode": "TECHNICAL",
  "avatarConfig": {
    "embedUrl": "https://avatar-provider.example.com/embed/session_abc123",
    "token": "tok_xyz789"
  },
  "questions": [
    {
      "id": "q1",
      "text": "Tell me about a complex database query optimization you performed.",
      "suggestedDurationSeconds": 180
    }
  ]
}
```

---

## 2. Submit Answer & Complete Interview

### `POST /api/interview/evaluate`

Submits transcripts/audio and retrieves evaluation report.

#### Request JSON
```json
{
  "interviewId": "int_776655",
  "responses": [
    {
      "questionId": "q1",
      "transcript": "So we had an internal dashboard that was slow, so I looked at SQL queries and fixed them."
    }
  ]
}
```

#### Response 200 OK
```json
{
  "reportId": "rep_112233",
  "overallScore": 82,
  "qualitativeSummary": "Candidate demonstrates solid technical foundations, but responses should include quantified outcomes.",
  "communicationScore": 8,
  "technicalDepthScore": 7,
  "transcriptComparison": [
    {
      "question": "Tell me about a complex database query optimization you performed.",
      "detectedTranscript": "So we had an internal dashboard that was slow, so I looked at SQL queries and fixed them.",
      "weaknesses": [
        "No measurable impact",
        "Technical details are vague"
      ],
      "improvedAnswer": "In my previous role, our main dashboard suffered from 8-second render latencies. I analyzed the underlying PostgreSQL execution plan, refactored sub-optimal JOINs into CTEs, and added composite indexes, reducing query execution time by 65% to under 2.8 seconds."
    }
  ]
}
```
