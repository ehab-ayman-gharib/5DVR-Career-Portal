# API Contract: Authentication & Authorization

**Path Base**: `/api/auth`

---

## 1. Verify User Session & Profile

### `GET /api/auth/verify`

Intercepts request headers/session and checks if current user is authenticated and has a profile.

#### Request Headers
```http
Authorization: Bearer <supabase_jwt>
```

#### Response 200 OK (Authenticated)
```json
{
  "status": "APPROVED",
  "email": "user@example.com",
  "hasProfile": true,
  "userPath": "JOB_SEEKER"
}
```

#### Response 401 Unauthorized (Not Logged In)
```json
{
  "status": "UNAUTHENTICATED",
  "error": "User is not logged in."
}
```

---

## 2. Onboarding Starter Profile Creation

### `POST /api/onboarding/profile`

Creates or updates a user starter profile with choice of path (STUDENT vs JOB_SEEKER), education, target position/career goal, and skills array.

#### Request Body
```json
{
  "path": "JOB_SEEKER",
  "firstName": "Ehab",
  "lastName": "Ayman",
  "education": "Bachelor's Degree in Computer Science, Helwan University",
  "fieldOfInterest": "Game & XR Development",
  "experienceLevel": "MID_LEVEL",
  "careerGoal": "Lead Game & XR Developer",
  "skills": ["Unity", "WebXR", "React", "Unreal Engine"]
}
```

#### Response 201 Created
```json
{
  "success": true,
  "profileId": "uuid-v4",
  "redirectUrl": "/dashboard"
}
```
