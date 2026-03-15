## Backend Build Plan — Reusable Playbook

This folder is a **step-wise guide** to build an industry-standard backend server (separate from the frontend). Each phase document includes the **scripts, code snippets, and instructions** you need; you can follow the playbook without relying on other resources to build a solid Node backend.

- **Goal**: if you ever start a new backend project, follow these phases and you’ll know *what to build next*, *why it matters*, and *what “done” looks like*.
- **Scope**: Node.js backend API (TypeScript) with clean layering, tests, observability, and deployability.
- **Default stack (recommended)**:
  - **Runtime**: Node 20 LTS (use Node 18 only if required)
  - **Framework**: Fastify
  - **Validation**: Zod
  - **DB**: Prisma (SQLite dev → Postgres prod)
  - **Testing**: Vitest (unit + integration via server inject)
  - **Lint/format**: ESLint + Prettier
  - **Logging**: structured JSON logs (Pino/Fastify logger)

### How to use this playbook

- Each phase includes:
  - **Study**: what to read (short)
  - **Build**: what to implement (you run commands yourself)
  - **Deliverable (“done when”)**: acceptance criteria
  - **Repo shape**: what your folder tree should look like
- For every phase/step, follow this loop:
  - **Learn**: read the linked concept section(s) (keep it small).
  - **Implement**: ship the smallest working increment for that step.
  - **Verify**: add tests and run them; also manually hit the endpoint(s) if relevant.
  - **Document**:
    - update the playbook phase file if you learned something new (edge cases, gotchas)
    - write an ADR if you made a choice that future-you might question
  - **Compare state**: check that your codebase matches the “Repo shape” + “Done when” checklist for the phase.
  - **Move on** only when the phase is complete.
- Keep a tiny “decision log” as you go (ADRs). Template is included.

### Phases

- **Phase 0 — Project bootstrap**: [`01-phase-0-bootstrap.md`](./01-phase-0-bootstrap.md)
- **Phase 0.5 — Route playground tooling** (REST Client/Bruno/Postman/curl, etc.): [`01b-phase-0-5-route-playground.md`](./01b-phase-0-5-route-playground.md)
- **Phase 1 — HTTP foundation** (health, request-id, logging, errors): [`02-phase-1-http-foundation.md`](./02-phase-1-http-foundation.md)
- **Phase 2 — Validation-first endpoints** (Zod + 422 errors): [`03-phase-2-validation.md`](./03-phase-2-validation.md)
- **Phase 2.5 — API design basics** (versioning + pagination): [`03b-phase-2-api-design.md`](./03b-phase-2-api-design.md)
- **Phase 3 — Service layer + repositories** (no DB yet): [`04-phase-3-service-repo.md`](./04-phase-3-service-repo.md)
- **Phase 4 — Persistence** (Prisma + migrations): [`05-phase-4-persistence.md`](./05-phase-4-persistence.md)
- **Phase 5 — Auth + authorization**: [`06-phase-5-auth.md`](./06-phase-5-auth.md)
- **Phase 6 — Security + resilience** (rate limit, headers, sanitization): [`07-phase-6-security-resilience.md`](./07-phase-6-security-resilience.md)
- **Phase 7 — Observability + ops** (ready/health, metrics, tracing-lite): [`08-phase-7-observability-ops.md`](./08-phase-7-observability-ops.md)
- **Phase 8 — Deploy** (env, process, CI basics): [`09-phase-8-deploy.md`](./09-phase-8-deploy.md)

### Milestones (what “done” means at each stage)

- **Milestone A — Backend foundation (no DB yet)**
  - stable API response shapes
  - input validation
  - error handling
  - health endpoint
  - logging + request id
  - tests for core domain logic
- **Milestone B — Core domain API** (example: invoice)
  - create entity
  - fetch entity by id (owner)
  - fetch public entity by publicId (public)
  - state transitions (example: mark paid)
  - tests for schemas + service logic
- **Milestone C — Persistence**
  - swap in real DB via repository interface (Prisma + SQLite for dev; Postgres later)

### Working rule (non-negotiable)

Don’t move to the next phase until:
- the current phase has **tests**, and
- you’ve read the linked concept section(s).

### Decision log (ADRs)

- **Template**: [`templates/adr-template.md`](./templates/adr-template.md)
- **0001** — Backend stack (Node 20, ESM, Fastify, npm): [`adr/0001-backend-stack-node20-esm-fastify-npm.md`](./adr/0001-backend-stack-node20-esm-fastify-npm.md)
- **0002** — Phase 0: Project structure and entrypoint split: [`adr/0002-phase-0-project-structure-and-entrypoint.md`](./adr/0002-phase-0-project-structure-and-entrypoint.md)
- **0003** — Phase 0.5: Route playground tooling: [`adr/0003-phase-0-5-route-playground-tooling.md`](./adr/0003-phase-0-5-route-playground-tooling.md)
- **0004** — Phase 1: HTTP foundation (request-id, errors, logging): [`adr/0004-phase-1-http-foundation.md`](./adr/0004-phase-1-http-foundation.md)
- **0005** — Phase 2: Validation (schemas, validate boundary, 422): [`adr/0005-phase-2-validation.md`](./adr/0005-phase-2-validation.md)

### Source

This playbook is derived from:
- `Apps/upi-invoice-follow-up/docs/backend-build-plan/00-backend-build-plan.md`

