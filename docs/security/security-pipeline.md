# DevSecOps Learning Tracker - Security Pipeline

This document explains the security gates integrated into the CI/CD pipeline of this project.

| Layer      | Tool              | Purpose                 | Gate  |
| ---------- | ----------------- | ----------------------- | ----- |
| Secret     | Gitleaks          | Secret leakage          | Block |
| SAST       | Semgrep           | Code vulnerabilities    | Block |
| SCA        | OSV Scanner       | Dependency CVE          | Block |
| Dependency | Dependency Review | New vulnerable packages | Block |
| Container  | Hadolint          | Docker best practices   | Block |
| Container  | Trivy             | Image vulnerabilities   | Block |
| DAST       | ZAP               | Runtime vulnerabilities | Block |

*(To be expanded in Phase 7)*
