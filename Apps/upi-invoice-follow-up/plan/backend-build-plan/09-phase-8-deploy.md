## Phase 8 — Deploy (and keep it boring)

### Goal

Deploy the backend as an independent service with:
- repeatable build
- correct env handling
- predictable process lifecycle

### Study (short)

- your hosting provider docs (Render/Fly/Railway) for Node services

### Build (steps)

#### Step 8.1 — Production config hygiene

- strict env parsing (fail fast on missing vars)
- never read `process.env` throughout the codebase (centralize it)

#### Step 8.2 — Build + start commands

Ensure CI/CD uses:
- `npm ci`
- `npm run build`
- `npm start`

#### Step 8.3 — Health checks

Configure platform health checks:
- `GET /api/v1/health`
- `GET /api/v1/ready` (optional depending on platform)

#### Step 8.4 — CI basics (minimal)

Add CI steps:
- install
- typecheck/build
- tests

### Deliverable

- backend is live at `api.<domain>` (or provider URL)
- logs are visible in provider
- health checks pass

