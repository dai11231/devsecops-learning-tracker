# System Architecture

The DevSecOps Learning Tracker follows a standard modern web application architecture, bolstered by an automated DevSecOps pipeline.

## High-Level Architecture

```mermaid
graph TD
    Client[Browser Client<br>React SPA] -->|HTTPS / REST| Nginx[Nginx Proxy<br>Port 8080]
    Nginx --> Frontend[Frontend Assets]
    Client -->|HTTPS / REST| API[NestJS API<br>Port 3000]
    
    API -->|Prisma ORM| DB[(PostgreSQL)]
    
    subgraph "Docker Compose (Production)"
        Nginx
        Frontend
        API
        DB
    end
```

## Security Pipeline Flow

```mermaid
graph TD
    Git[GitHub PR] --> CI[Quality Gate]
    CI -->|npm ci, lint, build| Sec[Security Gates]
    
    subgraph "DevSecOps Pipeline"
        Sec -->|Gitleaks| SAST[SAST Gate]
        SAST -->|Semgrep| SCA[SCA Gate]
        SCA -->|OSV, Dependency Review| Cont[Container Gate]
        Cont -->|Hadolint, Trivy| DAST[DAST Gate]
        DAST -->|ZAP Baseline| Deploy
    end
    
    Deploy((Merge & Deploy))
```
