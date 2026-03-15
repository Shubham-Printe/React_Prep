## Phase 5 — Auth + authorization

### Goal

Add authentication and enforce authorization rules without leaking data.

### Study (short)

- `node-backend-story/01-core-flow.md` §4 (auth/protected routes)
- OWASP basics for session/cookie handling (skim)

### Build (steps)

#### Step 5.1 — Pick auth model (document in ADR)

Common options:
- **Session cookies** (recommended for web apps on same “site”)
- **JWT** (often used for mobile/3rd-party integrations)

Decide:
- where identity is stored
- token/cookie rotation strategy
- logout semantics

#### Step 5.2 — Auth middleware/hook

Create a single place that:
- reads auth credentials
- validates
- attaches `request.user`

#### Step 5.3 — Authorization rules per endpoint

Enforce:
- owners can access `/api/v1/invoices/:id`
- public access only for `publicId` endpoints (and only safe fields)

### Deliverable

- protected endpoints require auth
- authorization is tested (negative tests included)

