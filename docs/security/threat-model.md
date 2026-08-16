# Threat Model

This Threat Model outlines the primary attack vectors targeted during the design of v0.1 and the corresponding security controls implemented to mitigate them.

| Asset | Threat | Attack Vector | Control |
|-------|--------|---------------|---------|
| **User account** | Credential theft | Brute force attacks on login endpoint. | Rate limit (`ThrottlerModule`). |
| **JWT session** | Session theft | XSS payloads stealing tokens from `localStorage`. | HttpOnly & Secure Cookies. |
| **Progress Data** | Insecure Direct Object Reference (IDOR) | Modifying payload `userId` or guessing endpoint params. | Mitigation by design: Extract `userId` exclusively from `req.user.id`. |
| **Notes / Markdown** | Cross-Site Scripting (XSS) | Submitting malicious HTML in markdown content. | Safe rendering (`react-markdown` without `rehype-raw`). |
| **API Endpoints** | SQL Injection / NoSQLi | Injecting malicious characters into input fields. | Strict DTO validation (`class-validator` whitelist). |
| **Dependencies** | Supply-chain attacks | Importing a vulnerable third-party NPM package. | OSV Scanner & Dependency Review in CI. |
| **Source code** | Secret leakage | Accidentally committing `.env` or AWS keys. | Gitleaks secret scanning gate. |
| **Container** | CVE / Exploits | Using outdated or vulnerable base images. | Trivy image scanning. |
| **Dockerfile** | Misconfiguration | Running as root, exposing unnecessary ports. | Hadolint best-practices linter. |
| **Runtime API** | Web Vulnerabilities | Unauthenticated HTTP attacks against live service. | OWASP ZAP Baseline DAST. |

## Mitigation by Design: IDOR
A critical highlight of this model is the structural mitigation of IDOR. By enforcing that the API routes do not accept user identifiers as path parameters (e.g., `GET /users/2/progress`) and actively stripping them from request payloads, the attack surface for cross-user manipulation is categorically eliminated at the architectural level.
