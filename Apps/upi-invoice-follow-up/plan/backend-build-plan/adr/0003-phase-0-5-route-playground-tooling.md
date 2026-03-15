## ADR: Phase 0.5 — Route playground tooling

- **Date**: 2026-02-20
- **Status**: accepted

### Context

Before building many endpoints, we need a fast, repeatable way to hit the API during development and to document requests. Options range from in-editor files to GUI clients to OpenAPI/Swagger. We want something that fits the daily loop and, separately, a path to production-grade API documentation.

### Decision

- **Day-to-day API interactions**: Use **REST Client** (VSCode/Cursor extension) with `backend/requests/*.http` files. Requests live in the repo under `backend/requests/` (e.g. `health.http`, `error-handling.http`, `invoices.http`). No separate GUI app required; run requests from the editor with a fast loop.
- **Canonical API documentation (production-grade)**: Plan for **OpenAPI + Swagger UI** later. This is the long-term contract and interactive docs for API consumers; we do not block Phase 0.5 or Phase 1 on it.
- **Safety**: Never commit secrets (tokens, API keys, cookies). Use `.env` locally; commit only `.env.example`. Any exported collections must be sanitized before commit.

### Alternatives considered

- **Postman / Bruno / Insomnia**: GUI clients are fine for debugging and sharing, but we preferred in-editor `.http` files for speed and git-friendly documentation.
- **curl-only**: Scriptable but less convenient for ad-hoc exploration and for keeping request examples next to the code.
- **OpenAPI-first from day 1**: Would slow early phases; we deferred OpenAPI/Swagger to when we have a stable set of endpoints and want formal docs.

### Consequences

- **Pros**: Fast in-editor loop; request files double as documentation; no extra runtime or account. Clear path to OpenAPI later.
- **Cons / risks**: REST Client is editor-dependent (VSCode/Cursor); team members using other editors can use curl or the same `.http` files with another tool that supports the format.
- **Follow-ups**: Add OpenAPI spec and Swagger UI when we reach a phase that calls for canonical API docs (e.g. before external consumers or Phase 8 deploy).
