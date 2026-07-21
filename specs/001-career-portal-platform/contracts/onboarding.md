# API Contract: Onboarding & Profile Creation

**Path Base**: `/api/onboarding`

---

## 1. Parse CV for Job Seeker Starter Profile

### `POST /api/onboarding/parse-cv`

Uploads CV document during onboarding and auto-extracts profile fields.

#### Request (multipart/form-data)
- `file`: File (PDF / DOCX, max 5MB)

#### Response 200 OK
```json
{
  "parsedProfile": {
    "firstName": "Ahmed",
    "lastName": "Mohamed",
    "education": "B.Sc. Computer Science",
    "fieldOfInterest": "Data Science & Analytics",
    "experienceLevel": "MID_LEVEL",
    "careerGoal": "Senior Data Analyst",
    "extractedSkills": ["Python", "SQL", "Tableau", "Pandas"],
    "extractedExperience": ["Data Analyst at TechCorp (2 years)"]
  }
}
```

---

## 2. Submit Starter Profile

### `POST /api/onboarding/profile`

Persists starter profile (manual Student submission or confirmed Job Seeker auto-populated profile).

#### Request JSON
```json
{
  "path": "JOB_SEEKER",
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "education": "B.Sc. Computer Science",
  "fieldOfInterest": "Data Science & Analytics",
  "experienceLevel": "MID_LEVEL",
  "careerGoal": "Senior Data Analyst"
}
```

#### Response 201 Created
```json
{
  "success": true,
  "profileId": "usr_98765",
  "redirectUrl": "/dashboard"
}
```
