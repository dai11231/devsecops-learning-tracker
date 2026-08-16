# Internal Security Audit Report (v0.1)

**Date**: 2026-08-16
**Scope**: MVP v0.1 DevSecOps Tracker
**Auditor**: Automated DevSecOps Agent

This document audits the implementation status of core security controls.

## Authentication

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| Password hashing | PASS | Implemented using `argon2` in `AuthService`. |
| JWT validation | PASS | `AuthGuard` extracts and verifies payload via `JwtModule`. |
| HttpOnly cookie | PASS | Res.cookie config sets `httpOnly: true`. |
| Secure cookie in production | PASS | Environment conditional toggles `secure: process.env.NODE_ENV === 'production'`. |
| SameSite policy | PASS | Set to `Strict` to mitigate CSRF. |
| Rate limiting | PASS | Implemented via `@nestjs/throttler` globally. |
| Logout | PASS | Implemented by clearing the `jwt` cookie. |
| Invalid credential → generic error | PASS | Returns generic `UnauthorizedException`. |

## Authorization

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| Protected routes | PASS | JWT `AuthGuard` applied globally to `/progress` and `/auth/me`. |
| User isolation | PASS | Backend relies strictly on `req.user.id`. |
| No client-controlled userId | PASS | `ValidationPipe` drops `userId` from incoming DTOs. |
| IDOR regression test | PASS | `test-security-regression.js` validates IDOR protection. |

## Input Security

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| ValidationPipe | PASS | Enabled globally in `main.ts`. |
| whitelist | PASS | `whitelist: true` drops unknown fields. |
| forbidNonWhitelisted | PASS | `forbidNonWhitelisted: true` throws 400 Bad Request. |
| DTO validation | PASS | Configured for all incoming payloads. |
| Invalid IDs handled | PASS | Prisma specific 400/404 mappings implemented via custom interceptors. |

## HTTP Security

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| Helmet | PASS | Applied globally in `main.ts`. |
| CORS | PASS | Configured to allow specific Origins and Credentials. |
| Security headers | PASS | Handled implicitly by Helmet. |

## Database

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| Foreign keys | PASS | Enforced by Prisma Schema and PostgreSQL. |
| Unique constraints | PASS | Applied to `Progress(userId, topicId)`. |
| Restrict deletion | PASS | All Prisma relations use `onDelete: Restrict` to preserve data. |
| Prisma migrations | PASS | Migration history kept; `prisma migrate deploy` used in prod CI. |
| No unnecessary raw SQL | PASS | Query builder exclusively used. |

## Frontend

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| No JWT localStorage | PASS | Application relies entirely on `withCredentials: true`. |
| Safe Markdown rendering | PASS | `react-markdown` implemented without `rehype-raw` (No HTML rendering). |
| API error handling | PASS | Handled cleanly in UI via React Query Error boundaries. |
| Environment-based API URL | PASS | `import.meta.env.VITE_API_URL` applied. |

## Container

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| Multi-stage builds | PASS | Builder and Production stages separate in Dockerfiles. |
| Non-root | PASS | Uses `user node` and `user nginx`. |
| Minimal base images | PASS | `alpine` images used. |
| No secrets | PASS | Secrets injected via Docker Compose / CI Env vars, not baked. |
| Hadolint | PASS | CI gate blocks non-compliant dockerfiles. |
| Trivy | PASS | CI gate blocks images with HIGH/CRITICAL CVEs. |

## CI/CD Pipeline

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| Build & Test Gate | PASS | Code compilation enforces quality before security scans. |
| Gitleaks | PASS | Exit-code 1 blocks secrets. |
| Semgrep | PASS | Exit-code 1 blocks bad coding patterns. |
| OSV | PASS | Exit-code 1 blocks vulnerable packages. |
| Dependency Review | PASS | PR analysis blocks newly introduced CVEs. |
| Trivy | PASS | Exit-code 1 blocks vulnerable OS layers. |
| ZAP Baseline | PASS | Scan targets `/health` and fails explicitly on issues. |

## Out Of Scope (Planned for v0.2)

| Control | Status | Reason / Evidence |
|---------|--------|-------------------|
| Authenticated ZAP | OUT OF SCOPE | v0.1 tests baseline unauthenticated API. |
| Kubernetes Deployment | OUT OF SCOPE | Dev/Prod utilizes Docker Compose. |
| SBOM Generation & Signing | NOT IMPLEMENTED | Pipeline currently blocks CVEs but does not cryptographically sign releases. |
