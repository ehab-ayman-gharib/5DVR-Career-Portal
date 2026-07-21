# API Contract: Authentication & Authorization

**Path Base**: `/api/auth`

---

## 1. Verify Whitelist & Session

### `GET /api/auth/verify`

Intercepts request headers/session and checks if current user's email is whitelisted.

#### Request Headers
```http
Authorization: Bearer <supabase_jwt>
```

#### Response 200 OK (Whitelisted)
```json
{
  "status": "APPROVED",
  "email": "user@example.com",
  "isWhitelisted": true,
  "hasProfile": true,
  "userPath": "JOB_SEEKER"
}
```

#### Response 403 Forbidden (Not Whitelisted)
```json
{
  "status": "DENIED",
  "error": "Access Denied: Your email address is not on the whitelist.",
  "isWhitelisted": false
}
```
