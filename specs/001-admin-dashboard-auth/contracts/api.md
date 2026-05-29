# CamelBird API contract

> **Source of truth**: `E:\Sites\api.camelbird.com\docs\openapi.yaml`. Keep this file in sync when the API contract changes.

Base URL: `environment.apiUrl` (production default `https://api.camelbird.com`).

## Authentication

Protected routes require a JWT access token:

```
Authorization: Bearer <access_token>
```

Obtain tokens via `POST /auth/login` or `POST /auth/refresh`.

### Roles

| Role | Description |
|------|-------------|
| `admin` | Full access |
| `maintainer` | Read users; patch users (limited) and devlogs |
| `read_only` | Read users and staff devlog list only |

Forbidden when role lacks permission: **403** `{ "message": string, "code": "INSUFFICIENT_ROLE" }`

## Health

### GET /

Response **200**: `{ "success": true }`

## Auth

### POST /auth/login

Request: `{ "username": string, "password": string }` (username or email)

Response **200**: `AuthTokenResponse`

Response **401**: `{ "message": "Invalid credentials" }`

### POST /auth/refresh

Request: `{ "refresh_token": string }`

Response **200**: `AuthTokenResponse`

Response **401**: `{ "message": string }`

## Users (Bearer required)

| Method | Path | Permission | Roles |
|--------|------|------------|-------|
| GET | `/users` | `users.list` | admin, maintainer, read_only |
| GET | `/users/{id}` | `users.read` | admin, maintainer, read_only |
| POST | `/users` | `users.create` | admin only |
| PATCH | `/users/{id}` | `users.patch` | admin (all fields); maintainer (profile only) |

**UserPublic** (list/get/create/patch response):

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@camelbird.com",
  "first_name": "Daniel",
  "last_name": "Gardner",
  "role": "admin",
  "is_active": true
}
```

**UserCreateRequest** (POST): required `username`, `email`, `password`; optional `first_name`, `last_name`, `role` (defaults to `read_only`).

**UserPatchRequest** (PATCH): at least one field — `username`, `email`, `first_name`, `last_name`, `password` (admin), `role` (admin), `is_active` (admin).

Status codes: **201** create, **200** patch, **401**, **403**, **404**, **409** (duplicate email), **422** validation.

## Devlogs

### GET /devlogs

Dual-mode (optional auth):

| Caller | Bearer | Response |
|--------|--------|----------|
| Public site (`DevblogService`) | No | Published entries only — `DevlogPublic[]` |
| Admin dashboard (`DevblogAdminService`) | Yes | All entries — `DevlogStaff[]` |

**DevlogPublic**: `{ "id", "title", "body", "date" }` — `date` is MySQL datetime (`Y-m-d H:i:s`).

**DevlogStaff**: DevlogPublic + `{ "user": string, "is_published": boolean }`

SPA implementation: admin list sets `STAFF_DEVLOG_REQUEST` HttpContext so interceptors attach Bearer without affecting public reads.

### POST /devlogs

Permission `devlogs.create` — **admin only**. Bearer required.

Request: required `title`; optional `body` (default `""`), `user` (default `admin`), `is_published` (default `false`).

Response **201**: `{ "log_id": "<uuid>" }`

### PATCH /devlogs/{id}

Permission `devlogs.patch` — admin, maintainer. Bearer required.

Request: at least one of `title`, `body`, `user`, `is_published`.

Response **200**: `DevlogStaff`

### DELETE /devlogs/{id}

Permission `devlogs.delete` — **admin only**. Bearer required.

Response **204** (no body)

## Contact (public)

### POST /contact

Rate-limited per IP. Honeypot field `website` (max length 0) silently accepts spam with **201** without sending email.

Request:

```json
{
  "subject": "Resume Request" | "General Question" | "Saying Hello",
  "name": "string (max 100)",
  "email": "email",
  "message": "string (max 5000)",
  "website": ""
}
```

Response **201**: `{ "message": "Your message was sent." }`

Response **422**: `{ "message": string, "errors": { "<field>": string } }`

Response **500**: `{ "message": string }`

## Shared schemas

### AuthTokenResponse

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "user": UserPublic
}
```

### ValidationErrorResponse

```json
{
  "message": "Please check your input",
  "errors": { "email": "Invalid email address" }
}
```

### MessageResponse

```json
{ "message": "string" }
```

## CORS

Allowed origins (configurable): `http://localhost:4200`, `http://127.0.0.1:4200`, `https://www.camelbird.local`, `https://www.camelbird.com`.
