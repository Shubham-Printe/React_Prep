## Phase 0.5 — Route playground tooling (try everything, then decide)

Set up several ways to interact with your API so you can pick a default. This phase is tooling-only: no backend code changes beyond what Phase 0 and Phase 1 add.

### Goal

- In-editor requests (fastest loop)
- CLI requests (scriptable)
- GUI collection tool (debugging + sharing)
- (Later) OpenAPI/Swagger UI (docs + interactive)

### Decision (what we chose)

- **Day-to-day:** **Option A** — `backend/requests/*.http` via REST Client (fast, in-editor, git-friendly).
- **Canonical API docs (later):** **OpenAPI + Swagger UI** (Option F) — contract + interactive docs for consumers.

### When to do this

- After Phase 0 (you can run `npm run dev`).
- Before or while doing Phase 1 (as soon as `/api/v1/health` exists).

Even before health exists you can test: server reachable, 404 behavior.

### Safety rules

- Never commit secrets (tokens, cookies, API keys).
- Use `.env` locally; commit only `.env.example`.
- For exported collections, commit **sanitized** exports only.

### What you will test (same requests across tools)

Once Phase 1 adds the endpoints:

- `GET http://localhost:4000/api/v1/health`
- `GET http://localhost:4000/api/v1/ready`

Optional (after request id is implemented): send `x-request-id: req_12345678` and confirm it is echoed back.

**Note:** Default port is 4000 (`PORT` env); use your server’s host/port if different.

---

## Options (try in any order)

Each option uses the same structure so you can compare. For all options: start the server from `Apps/upi-invoice-follow-up/backend/` with `npm run dev` unless stated otherwise.

---

### Option A — VSCode/Cursor `.http` files (recommended default)

**Why:** Fastest loop (in-editor); requests in git double as documentation.

**Setup**

1. Install extension: **REST Client** (Huachao Mao).
2. Create folder `backend/requests/` and file `backend/requests/health.http`.

**Step-by-step**

1. Start the server: `cd Apps/upi-invoice-follow-up/backend && npm run dev`
2. Open `backend/requests/health.http`
3. Click **Send Request** above the `GET ...` line
4. Confirm status 200 and body `{ "status": "ok" }`

**Troubleshooting**

- No **Send Request**: ensure REST Client is installed and enabled; re-open the file or reload the editor.
- Connection failed: ensure `npm run dev` is running and the server is on `http://localhost:4000`.

**Pros:** Very fast loop; git-friendly; good for onboarding; easy to keep in sync with endpoints.  
**Cons:** Depends on REST Client; weaker than Postman/Bruno for complex auth/environments; no API contract; avoid pasting secrets into committed `.http` files.

**Example**

```http
### Health
GET http://localhost:4000/api/v1/health
```

**Commit:** `backend/requests/**/*.http` (no secrets).  
**Do not commit:** Any `.http` file containing secrets.

---

### Option B — curl (CLI, always available)

**Why:** Universal; good for “what did you run?” documentation.

**Setup:** None.

**Step-by-step**

1. Start the server (see above).
2. In another terminal: `curl -i "http://localhost:4000/api/v1/health"`
3. Confirm status 200 and body `{"status":"ok"}` (format may vary).

Optional — test 404: `curl -i "http://localhost:4000/api/v1/nonexistent"`

**Troubleshooting:** If curl can’t connect, confirm the server is running on `http://localhost:4000`.

**Example**

```bash
curl -i "http://localhost:4000/api/v1/health"
```

With request-id (after Phase 1):

```bash
curl -i "http://localhost:4000/api/v1/health" -H "x-request-id: req_12345678"
```

**Commit:** Optional (e.g. command snippets in docs). **Do not commit:** Secrets in shell history or docs.

---

### Option C — HTTPie (CLI, more ergonomic than curl)

**Why:** More readable than curl for everyday use.

**Setup:** `brew install httpie` (or your platform’s package manager).

**Step-by-step**

1. Start the server (see above).
2. In another terminal: `http GET :4000/api/v1/health`
3. Confirm status 200 and body `{ "status": "ok" }`.

Optional — test 404: `http GET :4000/api/v1/nonexistent`

**Troubleshooting:** If `http` is not found, re-run the install and restart the terminal. If it can’t connect, confirm the server is running.

**Pros:** Nicer UX than curl; easy headers and JSON. **Cons:** Not installed by default; no API contract.

**Example**

```bash
http GET :4000/api/v1/health
```

With request-id: `http GET :4000/api/v1/health x-request-id:req_12345678`

**Commit:** Nothing required. **Do not commit:** Commands containing secrets.

---

### Option D — Bruno (GUI, git-friendly collections)

**Why:** Postman-like UX; collections stored as files (git-friendly).

**Setup**

1. Install Bruno (desktop app).
2. Create folder `backend/bruno/` in the repo.
3. In Bruno: **Create Collection** (not “Open Collection” on an empty folder). Location: `backend/bruno/`. Name e.g. `upi-invoice-follow-up-backend`.

Bruno should create `opencollection.yml` or `bruno.json` in that folder.

**Step-by-step**

1. Start the server (see above).
2. In Bruno: new request **Health**, method GET, URL `http://localhost:4000/api/v1/health`
3. Click **Send**; confirm status 200 and body `{ "status": "ok" }`.

**Expected files:** e.g. `backend/bruno/upi-invoice-follow-up-backend/opencollection.yml` and a `.gitignore`. More request files appear as you add requests.

**Troubleshooting:** “Collection is not valid” usually means an empty folder was opened; use **Create Collection** first so Bruno generates the config, then open it.

**Pros:** Good GUI for debugging; git-friendly; shareable without accounts. **Cons:** Desktop app required; not a contract by itself; keep secrets out of environments.

**Example:** Health request: `GET http://localhost:4000/api/v1/health`

**Commit:** `backend/bruno/**` (sanitized). **Do not commit:** Personal environments with secrets.

---

### Option E — Postman / Insomnia (GUI, widely used)

**Why:** Common in industry; good debugging and UX.

**Downside:** Export/sync into git can be noisy unless you standardize.

**Setup:** Use the app locally. Optionally store sanitized exports in `backend/postman/` or `backend/insomnia/`.

**Do not commit:** Workspace sync data or exports that contain secrets.

---

### Option F (later) — OpenAPI + Swagger UI

**Why:** Living API contract: docs, interactive UI, client generation.

**When:** After Phase 2/2.5 when schemas and response shapes are stable.

**Target:** `GET /docs` serves Swagger UI; `openapi.json` (or equivalent) is generated/served.

---

## Deliverable (done when)

- You can call `GET /api/v1/health` (and optionally `GET /api/v1/ready`) with at least:
  - one editor-based tool (Option A), and
  - one CLI tool (Option B or C).
- You have tried at least one GUI tool (Option D or E).
- You have chosen a default for day-to-day use and noted it (e.g. in this doc or in README).

---

## Repo shape (end of Phase 0.5)

**Recommended baseline**

```txt
backend/
  requests/
    health.http
```

As you add endpoints you may add e.g. `ready.http`, `error-handling.http`, `invoices.http` (or group requests in fewer files). Optional: `backend/bruno/`, `backend/postman/`, or `backend/insomnia/` for GUI collections (sanitized only).

---

## Done when (Phase 0.5 complete)

- [ ] At least one editor-based tool (Option A) can hit `GET /api/v1/health`.
- [ ] At least one CLI tool (Option B or C) can hit the same endpoint.
- [ ] At least one GUI tool (Option D or E) has been tried.
- [ ] A default day-to-day tool is chosen and recorded.
- [ ] No secrets are committed in request files or exported collections.

---

## Key files (end of Phase 0.5)

- `backend/requests/health.http` — In-editor requests (REST Client). Add `ready.http`, `error-handling.http`, `invoices.http` (or similar) as endpoints grow.
- `backend/requests/*.http` — All committed `.http` files must be free of secrets.
- Optional: `backend/bruno/`, `backend/postman/`, `backend/insomnia/` — Sanitized collection exports only.
