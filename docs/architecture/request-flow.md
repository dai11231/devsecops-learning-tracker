# Authentication & Request Flow

The application enforces a strict **User Isolation** policy by relying exclusively on server-side session identification via HttpOnly cookies.

## Flow Diagram

```mermaid
sequenceDiagram
    participant Browser
    participant NestJS_AuthGuard
    participant ProgressService
    participant Database

    Browser->>NestJS_AuthGuard: PATCH /progress/1 (Cookie: jwt=xxx)
    Note over Browser: Maliciously sends {"userId": 2}
    
    NestJS_AuthGuard->>NestJS_AuthGuard: Validate JWT Signature
    NestJS_AuthGuard->>NestJS_AuthGuard: Extract `sub` (userId = 1)
    NestJS_AuthGuard-->>Browser: (If invalid) 401 Unauthorized
    
    Note over NestJS_AuthGuard: Attaches user to Request<br>req.user.id = 1
    
    NestJS_AuthGuard->>ProgressService: updateProgress(topicId=1, payload, req.user.id)
    
    Note over ProgressService: Ignores payload.userId
    ProgressService->>Database: UPDATE Progress WHERE userId = 1 AND topicId = 1
    Database-->>ProgressService: Success
    ProgressService-->>Browser: 200 OK (User 1's progress updated)
```

## Security Invariants
1. **No Client-side Identity Trust**: The frontend is never trusted to identify who is making the request. `userId` in the request body is stripped and ignored by DTO Validation Pipes.
2. **HttpOnly Storage**: The JWT is never accessible to JavaScript (no `localStorage`). This mitigates the risk of token exfiltration via XSS.
