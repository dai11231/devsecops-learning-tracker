# DevSecOps Learning Tracker

A comprehensive learning tracker demonstrating a fully mature DevSecOps Software Development Life Cycle (SDLC). This application tracks progress through DevSecOps topics while actively defending itself via a rigorous, blocking CI/CD security pipeline.

## Architecture

The system is built on a modern web architecture, containerized and deployed with a strict security-first mindset.
For detailed documentation, refer to:
- [System Architecture](docs/architecture/system-architecture.md)
- [Database ERD](docs/architecture/database-erd.md)
- [Request Flow](docs/architecture/request-flow.md)

## Tech Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS, TanStack Query.
- **Backend**: NestJS, TypeScript, Prisma.
- **Database**: PostgreSQL.
- **Infrastructure**: Docker, GitHub Actions.

## Security Architecture & DevSecOps Pipeline

This project is defined by its DevSecOps Pipeline. We do not just run scanners; we enforce **Security Gates**. If a vulnerability is detected, the pipeline **FAILS** and the pull request is **BLOCKED**.

```text
PR
 ↓
CI (Lint, Build)
 ↓
Gitleaks (Secret Gate)
 ↓
Semgrep (SAST Gate)
 ↓
OSV (SCA Gate)
 ↓
Dependency Review (SCA Gate)
 ↓
Hadolint (Container Lint)
 ↓
Trivy (Container SCA)
 ↓
OWASP ZAP (DAST Gate)
 ↓
✅ Merge
```

## Security Evidence

This project serves as a portfolio piece for DevSecOps practices. We have documented and proven the following capabilities:

✓ **User Isolation Regression Test**: Backend ignores client-provided `userId` and relies on cryptographically secure HttpOnly cookies, mitigating IDOR by design.
✓ **Intentional Vulnerability Testing**: See [SECURITY_TESTING.md](docs/SECURITY_TESTING.md) for instructions on how to trigger pipeline failures intentionally.
✓ **Secret Scanning Gate**: Gitleaks actively blocks leaked AWS/GCP keys.
✓ **SAST Gate**: Semgrep blocks SQL injections and insecure APIs.
✓ **Dependency Gate**: OSV and Dependency Review block vulnerable NPM packages.
✓ **Container Vulnerability Gate**: Trivy blocks compromised Alpine/Node/Nginx images.
✓ **DAST Gate**: OWASP ZAP Baseline blocks runtime vulnerabilities.

## Security Layers Overview

| Security Layer      | Implementation        |
| ------------------- | --------------------- |
| Authentication      | JWT + HttpOnly Cookie |
| Authorization       | User Isolation        |
| Input Validation    | class-validator       |
| HTTP Security       | Helmet                |
| Secret Scanning     | Gitleaks              |
| SAST                | Semgrep               |
| SCA                 | OSV                   |
| Dependency Security | Dependency Review     |
| Container Lint      | Hadolint              |
| Image Security      | Trivy                 |
| DAST                | OWASP ZAP             |

For a deep dive into the specific threats and controls, review the [Threat Model](docs/security/threat-model.md) and [Security Controls](docs/security/security-controls.md). An extensive internal audit has also been conducted: [Audit Report v0.1](docs/security/audit-report-v0.1.md).

## Local Development
1. Clone the repository.
2. Ensure you have Node 20 and Docker installed.
3. Start the dev database: `docker compose -f docker-compose.dev.yml up -d`
4. Backend: `cd backend && npm ci && npx prisma migrate dev && npm run start:dev`
5. Frontend: `cd frontend && npm ci && npm run dev`

## Production Build
To spin up the production-ready infrastructure (used by the DAST pipeline):
```bash
docker compose -f docker-compose.prod.yml up --build -d
```
This automatically runs database migrations and exposes the frontend on port `8080` and the backend on `3000`.

## Future Improvements (v0.2)
- Authenticated DAST scanning.
- SBOM Generation and Cryptographic Image Signing.
- Kubernetes Deployment & Infrastructure as Code (Terraform).
