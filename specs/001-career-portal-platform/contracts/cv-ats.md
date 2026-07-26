# API Contract: CV Intelligence & ATS Analyzer

**Path Base**: `/api/cv`

---

## 0. Active Resume Management

### `GET /api/cv/resume`
Retrieves the user's latest active resume stored in PostgreSQL.

#### Response 200 OK
```json
{
  "resume": {
    "id": "res_12345",
    "fileName": "John_Doe_Resume.pdf",
    "fileSizeBytes": 1245000,
    "uploadedAt": "2026-07-26T12:00:00.000Z",
    "parsedText": "John Doe Software Engineer..."
  }
}
```

### `POST /api/cv/resume`
Uploads or updates the candidate's active resume in PostgreSQL.

#### Request (multipart/form-data)
- `file`: File (PDF/DOCX, <= 5MB)

#### Response 200 OK
```json
{
  "success": true,
  "resume": {
    "id": "res_12345",
    "fileName": "John_Doe_Resume.pdf",
    "fileSizeBytes": 1245000,
    "uploadedAt": "2026-07-26T12:00:00.000Z"
  }
}
```

---

## 1. ATS Score Analysis

### `POST /api/cv/ats`

Analyzes active or uploaded CV and returns ATS Score breakdown.

#### Request (multipart/form-data)
- `file`: File (PDF/DOCX, <= 5MB)

#### Response 200 OK
```json
{
  "reportId": "ats_12345",
  "resumeId": "res_12345",
  "score": 74,
  "metrics": {
    "missingKeywordsCount": 5,
    "formattingIssuesCount": 2,
    "redFlagsCount": 1
  },
  "actionableFixes": [
    {
      "type": "RED_FLAG",
      "issue": "Missing contact phone number",
      "recommendation": "Add a professional mobile phone number at the top header."
    },
    {
      "type": "FORMATTING",
      "issue": "Visual skill rating bars detected",
      "recommendation": "Replace graphical skill bars with plain text skill lists."
    }
  ]
}
```

---

## 2. Job Description Matcher

### `POST /api/cv/match`

Compares candidate's active resume against typed/pasted job description text using LLM structured output.

#### Request JSON
```json
{
  "resumeId": "res_12345",
  "jobDescriptionText": "Seeking a Senior Data Analyst proficient in SQL, Python, and Tableau...",
  "positionTitle": "Senior Data Analyst",
  "companyName": "TechCorp"
}
```

#### Response 200 OK
```json
{
  "matchReportId": "jdm_998877",
  "resumeId": "res_12345",
  "resumeFileName": "John_Doe_Resume.pdf",
  "overallMatchScore": 83,
  "matchQualityTier": "STRONG_FIT",
  "context": {
    "positionTitle": "Senior Data Analyst",
    "companyName": "TechCorp"
  },
  "strengths": [
    "3+ years experience with Python and Pandas",
    "Documented SQL query performance optimization"
  ],
  "criticalGaps": [
    "No Power BI experience mentioned",
    "Missing AWS cloud keyphrases"
  ],
  "keywordAnalysis": {
    "present": ["SQL", "Python", "Tableau", "ETL"],
    "missing": ["Power BI", "AWS", "A/B Testing"]
  },
  "salaryAlignment": {
    "marketRange": "$85,000 - $110,000",
    "targetSalary": "$105,000",
    "impliedCompanyBudget": "$95,000 - $115,000",
    "negotiationTip": "Anchor negotiations at $110,000 highlighting your verified 40% SQL optimization results."
  }
}
```
