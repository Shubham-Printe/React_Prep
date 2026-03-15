# API versioning policy

This document describes how we version the backend API and how to introduce or retire a version. It is the single source of truth for versioning decisions.

---

## Current rule

- **All public API routes use the prefix `/api/v1`.**  
  There are no unversioned API routes (e.g. no `GET /health`; we use `GET /api/v1/health`).

- **Why:** Versioning in the URL makes the contract explicit. Clients and proxies can see which version they are calling. When we add a new version, old clients keep using `/api/v1` without change.

- **Scope:** Applies to every route that is part of the public API (health, ready, invoices, etc.). Internal or debug routes, if any, should still live under a versioned path or a clearly separate prefix (e.g. `/internal/...`) so the rule stays simple.

- **Enforcement in code:** The `/api/v1` prefix is enforced in code. In `src/app.ts` we register the v1 route plugin with Fastify’s prefix: `await app.register(v1Routes, { prefix: "/api/v1" })`. All v1 routes live in **`src/routes/v1.ts`** and are registered with **relative** paths (e.g. `/health`, `/invoices`). New v1 routes are added in `v1.ts` with a relative path; they automatically get the `/api/v1` prefix. There are no route registrations with the full path `/api/v1/...` in `app.ts`.

- **Check:** When adding a new v1 route, add it in `src/routes/v1.ts` with a relative path (e.g. `fastify.get("/invoices", ...)`). Do not add routes in `app.ts` with a hardcoded `/api/v1/...` path.

---

## List endpoint response contract

All list endpoints (e.g. `GET /api/v1/invoices`) return a **paginated list** with this shape:

| Field   | Type     | Required | Description                          |
|--------|----------|----------|--------------------------------------|
| `items`| array    | yes      | Page of items for the current page.  |
| `page` | number   | yes      | Current page (1-based).              |
| `limit`| number   | yes      | Page size (items per page).          |
| `total`| number   | no (MVP) | Total count of items across all pages. Optional for MVP; may be omitted if expensive to compute. |

- **Contract:** Clients can rely on `{ items, page, limit }` always being present. They should treat `total` as optional and not assume it will be returned until we document that it is guaranteed.
- **Implementation:** The backend uses `listResponse()` from `src/http/list-response.ts` to build this shape. When `total` is available (e.g. from a DB count), pass it so clients can show “page X of Y” or total result count; for MVP it is acceptable to omit `total`.

This convention is part of the v1 API contract. Any change to this shape (e.g. adding required fields or renaming keys) would be a breaking change and would warrant a new version (e.g. v2).

---

## When we need v2

When the API contract must change in a breaking way (e.g. response shape, required fields, status codes), we introduce a new version in parallel instead of changing v1.

### How to add v2

1. **Add routes under `/api/v2`**  
   Register new routes with the `/api/v2` prefix (e.g. `GET /api/v2/health`, `POST /api/v2/invoices`). Implement the new contract in these handlers. v1 routes remain unchanged and continue to serve existing clients.

2. **Do not remove or change v1 routes**  
   Until v1 is officially deprecated and the deprecation window has ended, v1 routes must stay behaviorally the same. Bug fixes and security patches are allowed; breaking changes are not.

3. **Share code where it makes sense**  
   v1 and v2 handlers can share services, repositories, and validation helpers. Only the HTTP boundary (route handlers, request/response shapes) may differ between versions. This keeps business logic in one place while allowing the API surface to evolve.

4. **Document v2**  
   Update API docs (e.g. OpenAPI, README, or `requests/*.http`) so consumers know how to use v2. Optionally add a short note in this file (e.g. “v2 introduced on YYYY-MM-DD with the following changes: …”).

### Example

- Today: `GET /api/v1/invoices` returns `{ "items": [...], "page": 1, "limit": 20 }`.
- We decide list responses must include `nextPageToken` instead of `page`/`limit`.
- We add `GET /api/v2/invoices` with the new shape. `GET /api/v1/invoices` is left as-is. New clients use v2; existing clients keep using v1 until they migrate or until we deprecate v1.

---

## Deprecation

When we decide to retire a version (e.g. v1), we do it in a controlled way so clients have time to migrate.

### Deprecation window

1. **Set a support end date**  
   Decide and document when the old version will stop being supported. Examples:
   - “v1 supported until 2026-08-01.”
   - “Minimum 6 months from the deprecation announcement.”

2. **Announce**  
   Communicate the deprecation and the end date to consumers (release notes, email, or API docs). Record the announcement date and end date in this document or in an ADR.

3. **Signal in responses (recommended)**  
   For the deprecated version, return standard headers so clients and tooling can detect deprecation:
   - `Deprecation: true` (RFC 8594)
   - `Sunset: <date>` (RFC 8594), e.g. `Sunset: Sat, 01 Aug 2026 00:00:00 GMT`  
   Add these in the response for all routes under the deprecated prefix (e.g. in an `onResponse` hook that checks the request path).

4. **Remove only after the window ends**  
   Do not remove or break the deprecated version’s routes before the documented end date. After that date, we may remove the routes or return 410 Gone with a message pointing to the new version.

### Example entry for this document (when we deprecate v1)

```text
## Deprecation log

- **v1**  
  - Deprecation announced: YYYY-MM-DD  
  - Support end date: YYYY-MM-DD  
  - Headers added: Deprecation: true, Sunset: <date>  
  - Routes removed: YYYY-MM-DD (or “not yet”)
```

---

## Summary checklist

- [x] All public API routes use the `/api/v1` prefix (enforced via `app.register(v1Routes, { prefix: "/api/v1" })`).
- [x] v1 routes live in `src/routes/v1.ts` with relative paths; new v1 routes are added there.
- [ ] When introducing v2: add `src/routes/v2.ts` and register with `prefix: "/api/v2"`; leave v1 unchanged.
- [ ] When deprecating a version: set an end date, announce it, add Deprecation/Sunset headers, remove routes only after the window.

This policy is referenced by the backend build plan: Phase 2.5 (API design basics), Step 2.5.1.
