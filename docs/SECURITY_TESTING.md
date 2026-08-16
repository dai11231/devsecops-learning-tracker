# Security Testing Guide (Pipeline Showcase)

This project implements strict DevSecOps security gates that are designed to fail and block code deployments if vulnerabilities are detected. 

To demonstrate this capability in a portfolio presentation or local test, follow this workflow to intentionally trigger the security gates **without** polluting the `main` branch with actual secrets.

## 1. Create a Testing Branch
Always use a separate branch so that your main repository remains clean.
```bash
git checkout -b feat/security-test
```

## 2. Trigger Gitleaks (Secret Gate)
Create a temporary file named `aws-config.js` and paste a fake AWS credential:
```javascript
// aws-config.js
const AWS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
```
*Commit and push this file. Observe that the GitHub Action `security.yml` fails on the Gitleaks step with an exit code 1.*

## 3. Trigger Semgrep (SAST Gate)
Create a temporary file `backend/src/insecure.ts` with a dangerous SQL pattern:
```typescript
// backend/src/insecure.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function vulnerableQuery(userInput: string) {
  // Vulnerable to SQL injection
  return await prisma.$queryRawUnsafe(`SELECT * FROM User WHERE username = '${userInput}'`);
}
```
*Commit and push. Semgrep will flag `prisma.$queryRawUnsafe` and block the pipeline.*

## 4. Remediation (Pass the Pipeline)
1. Delete `aws-config.js` and `backend/src/insecure.ts`.
2. Commit the fixes.
3. Observe the pipeline passing successfully and the pull request being cleared for merging.

> **Note:** The `main` branch is protected by these gates. Any PR attempting to merge vulnerabilities will be strictly denied.
