## Phase 6 — Security + resilience (minimum viable, industry standard)

### Goal

Raise the security baseline without overbuilding:
- safer defaults
- rate limiting on public endpoints
- input hardening
- basic headers

### Study (short)

- `node-backend-story/03-security-resilience.md` §15–17

### Build (steps)

#### Step 6.1 — Security headers

Add headers appropriate for an API (and later for web):
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options` (if relevant)

Document what you set and why.

#### Step 6.2 — Rate limiting

Start minimal:
- protect `GET /api/v1/public/**`
- protect auth endpoints (login/otp) if any

Pick strategy:
- in-memory for MVP
- Redis-backed later if you scale horizontally

#### Step 6.3 — Abuse controls

- request size limits (body)
- pagination bounds (`limit` max)
- timeouts (upstream calls later)

### Deliverable

- public endpoints rate limited
- safe headers in place
- input size limits enforced

