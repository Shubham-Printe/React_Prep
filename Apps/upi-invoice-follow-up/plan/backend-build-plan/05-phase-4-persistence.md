## Phase 4 — Persistence (Prisma as a swap-in)

This phase corresponds to “Step 8” in the source plan.

### Goal

Replace the in-memory repo with a DB-backed repo with:
- migrations
- local dev database
- reliable tests
- production-ready connection handling

### Study (short)

- `node-backend-story/01-core-flow.md` §7 (DB & CRUD)
- `node-backend-story/05-advanced.md` (migrations) when ready

### Build (steps)

#### Step 4.1 — Add Prisma

- add Prisma tooling
- define schema for invoice entities
- use SQLite for local dev (cheap, fast)

**Done when**
- you can run migrations locally

#### Step 4.2 — Implement Prisma repository

Implement the same interface as the memory repo:
- `repo-prisma.ts` implements `repo.ts`

**Done when**
- switching repo is a single wiring change

#### Step 4.3 — Ready check uses DB ping

Make `GET /api/v1/ready` check DB connectivity.

**Done when**
- “ready” fails when DB is down

#### Step 4.4 — Test strategy with DB

Pick one:
- use a separate test database file
- run migrations before test suite
- clean tables between tests

**Done when**
- tests are deterministic and fast enough to run often

### Deliverable

- persistence is behind repository interface
- migrations are documented
- ready endpoint checks DB

