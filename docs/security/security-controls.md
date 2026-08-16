# Security Controls

This document explains the rationale (**"Why"**) behind each implemented security control. We treat security not as a checklist of tools, but as deliberate counter-measures to specific threats.

### 1. Secret Scanning (Gitleaks)
- **Threat**: Developer accidentally commits cloud credentials or database passwords to source control, leading to immediate account compromise.
- **Control**: `Gitleaks` scans repository history on every Push/PR.
- **Policy**: Pipeline **FAILS** and blocks merge if a secret is detected.
- **Reason**: Prevent credential leakage *before* the code reaches protected branches or public visibility.

### 2. Static Application Security Testing (Semgrep)
- **Threat**: Introduction of dangerous code patterns (e.g., raw SQL queries, insecure cryptography, disabling TLS) by developers.
- **Control**: `Semgrep` runs against TypeScript and Node.js rulesets.
- **Policy**: Pipeline **FAILS** if an error-level rule is violated.
- **Reason**: Catch logic vulnerabilities and insecure API usages at the code level without needing to run the application.

### 3. Software Composition Analysis (OSV & Dependency Review)
- **Threat**: The application relies on an NPM package that has a newly discovered critical CVE (e.g., Log4Shell equivalent for Node).
- **Control**: `OSV-Scanner` checks the `package-lock.json`. `Dependency Review` analyzes PR diffs.
- **Policy**: Pipeline **FAILS** if a dependency exceeds the acceptable severity threshold.
- **Reason**: Modern applications are 80% dependencies. Securing our own code is useless if the underlying libraries are compromised.

### 4. Container Linting & Scanning (Hadolint & Trivy)
- **Threat**: The deployed Docker image runs as `root` (privilege escalation risk) or contains outdated Alpine packages with known exploits.
- **Control**: `Hadolint` enforces Dockerfile best practices (e.g., non-root user). `Trivy` scans the final built image.
- **Policy**: Pipeline **FAILS** on HIGH/CRITICAL vulnerabilities or bad instructions.
- **Reason**: Ensure the runtime artifact deployed to production is hardened, minimizing the blast radius if the application is ever compromised.

### 5. Dynamic Application Security Testing (ZAP)
- **Threat**: Web server misconfigurations, missing security headers, or exposed administrative endpoints in the running application.
- **Control**: `OWASP ZAP` baseline scan against the live containers.
- **Policy**: Pipeline **FAILS** if alerts are triggered.
- **Reason**: Validates that static controls actually translate to a secure runtime environment.

### 6. Application-Level Mitigations
- **Threat**: XSS and Session Hijacking.
- **Control**: `HttpOnly` Cookies and `react-markdown` (HTML stripping).
- **Reason**: Completely removes the browser's JavaScript engine's ability to access authentication tokens and execute malicious DOM payloads.
