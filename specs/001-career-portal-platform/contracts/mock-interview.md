# API Contract: Mock Interview Simulator

**Path Base**: `/api/interview`

---

## 1. Create Interview Session

### `POST /api/interview/session`

Initializes a new mock interview session and returns avatar iframe config. Questions and conversational interaction are handled directly inside the 3rd-party embedded avatar interface.

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
  "durationSeconds": 1200,
  "avatarConfig": {
    "embedUrl": "https://5d-ai-hub.com/avatars/5dVR@HelmyDev_7cc59"
  }
}
```

---

## 2. Complete Interview & Request Evaluation

### `POST /api/interview/evaluate`

Completes the avatar interview session and retrieves recruiter evaluation report.

#### Request JSON
```json
{
  "interviewId": "int_776655",
  "elapsedSeconds": 940
}
```

#### Response 200 OK
```json
{
  "reportId": "rep_112233",
  "interviewId": "int_776655",
  "mode": "TECHNICAL",
  "overallScore": 88,
  "qualitativeSummary": "Candidate completed the full AI Avatar interview round with clear articulation and solid domain knowledge. The responses demonstrated strong structure, confident delivery, and effective technical reasoning throughout the conversation.",
  "communicationScore": 9,
  "technicalDepthScore": 8,
  "categoryAnalysis": [
    {
      "category": "Structure & Flow",
      "score": 90,
      "summary": "Excellent progression and structured presentation of ideas."
    },
    {
      "category": "Technical Accuracy & Vocabulary",
      "score": 86,
      "summary": "Accurate domain terminology and strong problem-solving logic."
    },
    {
      "category": "Executive Tone & Confidence",
      "score": 92,
      "summary": "Direct, clear, and highly engaging verbal delivery."
    },
    {
      "category": "Engagement & Pace",
      "score": 84,
      "summary": "Well-paced timing with good audio-visual presence."
    }
  ]
}
```
