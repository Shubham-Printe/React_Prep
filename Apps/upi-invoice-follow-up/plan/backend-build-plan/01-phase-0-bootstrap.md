## Phase 0 — Project bootstrap (repo + tooling baseline)

Start a backend that is TypeScript-first, testable from day one, runnable in dev and prod, and deployable as a standalone API service. Phase 0 is intentionally small so Phase 1 can start without friction.

### Goal

- TypeScript-first
- Testable from day 1
- Runnable in dev and prod
- Deployable as a standalone API service

### Study (short)

- `node-backend-story/01-core-flow.md` §1 (server entrypoint mental model)
- `node-backend-story/02-api-design.md` §11 (config + env discipline)

### Decisions to make (and document in an ADR)

- **Runtime:** Node 20 LTS (preferred) or Node 18 if required
- **Module system:** ESM (recommended) or CommonJS
- **Framework:** Fastify (recommended) or Express
- **Package manager:** npm, pnpm, or yarn (pick one and stay consistent)

### Initialization checklist (Phase 0 scope)

- [ ] Create `backend/` folder — separate deployable unit with its own deps and scripts
- [ ] Initialize package manager (`npm init -y`) — `package.json` as contract for build/test/start
- [ ] Add TypeScript (`typescript`, `@types/node`) — strict types and compile step
- [ ] Add dev runner (recommended: `tsx`; or `nodemon` + `ts-node`) — fast edit→run loop
- [ ] Add test runner (`vitest`) — tests from day 1
- [ ] Add `.gitignore` and `.env.example` — no secrets in git; consistent local setup

---

### Commands (copy/paste)

Run from repo root only where step 1 says so; steps 2–9 run from **`Apps/upi-invoice-follow-up/backend/`** (or your `backend/` path).

---

#### 0) Ensure Node version (prefer Node 20 LTS)

```bash
node -v
```

With nvm:

```bash
nvm install 20
nvm use 20
node -v
```

---

#### 1) Create backend folder and init npm

```bash
mkdir -p Apps/upi-invoice-follow-up/backend
cd Apps/upi-invoice-follow-up/backend
npm init -y
```

---

#### 2) Set project identity and ESM

```bash
npm pkg set name="upi-invoice-follow-up-backend" private=true
npm pkg set type="module"

# Optional: pin Node version
npm pkg set engines.node=">=20"
```

---

#### 3) Add scripts

```bash
npm pkg set scripts.dev="tsx watch src/server.ts"
npm pkg set scripts.test="vitest run"
npm pkg set scripts.test:watch="vitest"
npm pkg set scripts.build="tsc -p tsconfig.json"
npm pkg set scripts.start="node dist/server.js"
```

**You’ll know scripts are correct when:**
- `npm run dev` starts the server and reloads on file changes
- `npm test` exits non-zero on test failures
- `npm run build` creates `dist/` with no TypeScript errors
- `npm start` runs **only** from `dist/` (no TypeScript at runtime in production)

---

#### 4) Install dependencies and tooling

```bash
# Runtime
npm i fastify zod

# Dev
npm i -D typescript @types/node tsx vitest
```

---

#### 5) TypeScript config and folders

```bash
mkdir -p src test

npx tsc --init \
  --rootDir src \
  --outDir dist \
  --module NodeNext \
  --moduleResolution NodeNext \
  --target ES2022 \
  --lib ES2022 \
  --strict true \
  --skipLibCheck true \
  --noEmitOnError true
```

Then edit `tsconfig.json`: add `"include"` and `"exclude"` at the top level (same level as `"compilerOptions"`) so only `src` is compiled. Tests are run by Vitest and are not part of the build output:

```json
  "include": ["src/**/*.ts"],
  "exclude": ["test", "node_modules", "dist"]
```

---

#### 6) `.gitignore` and `.env.example`

Create `backend/.gitignore`:

```txt
node_modules
dist
.env
```

Create `backend/.env.example`:

```txt
PORT=4000
HOST=0.0.0.0
```

---

#### 7) Minimal server (`src/server.ts`)

At Phase 0 the server only needs to **boot and listen**. No routes, validation, or error shape yet (Phase 1).

Create `backend/src/server.ts`:

```ts
import Fastify from "fastify";

const app = Fastify({ logger: true });

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

await app.listen({ port, host });
```

---

#### 8) Smoke test (`test/smoke.test.ts`)

Create `backend/test/smoke.test.ts` to confirm the test runner works:

```ts
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("runs tests", () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

#### 9) Phase 0 smoke checks

From `backend/`:

```bash
npm test
npm run build
npm start    # runs dist/server.js; stop with Ctrl+C
npm run dev  # watch mode; stop with Ctrl+C
```

---

#### 10) (Optional) Add app factory and health early

In this project we added a minimal **app factory** (`src/app.ts`) and `GET /api/v1/health` (and later `GET /api/v1/ready`) in Phase 0 so Phase 0.5 (route playground) had a real endpoint. For a generic backend you can keep Phase 0 minimal and add these in **Phase 1**.

If you add them early, follow **Phase 1** in `02-phase-1-http-foundation.md`:
- Step 1.2 (App factory) — export `createApp()` from `src/app.ts`; have `server.ts` call it and then `listen()`.
- Step 1.6 (Foundation endpoints) — register `GET /api/v1/health` and `GET /api/v1/ready` returning `{ "status": "ok" }`; add inject tests.

**Result:** `src/app.ts`, `src/server.ts` that uses the app factory, `test/health.test.ts`, and optionally `requests/health.http`. Phase 1 will then add request id, error shape, not-found/error handlers, and the trigger-error route for 500 tests.

---

### Deliverable (done when)

- `npm run dev` starts the server without errors
- `npm test` runs and reports (at least the smoke test)
- `npm run build` produces `dist/` with no TypeScript errors
- `npm start` runs `dist/server.js`
- No secrets committed; `.env.example` exists

---

### Repo shape (end of Phase 0)

**Minimal:**

```txt
backend/
  package.json
  tsconfig.json
  .gitignore
  .env.example
  src/
    server.ts
  test/
    smoke.test.ts
```

**If you added app + health early (optional):**

```txt
backend/
  src/
    server.ts
    app.ts
  test/
    smoke.test.ts
    health.test.ts
  requests/
    health.http
```

---

### Done when (Phase 0 complete)

- [ ] `backend/` exists with its own `package.json`, scripts, and deps
- [ ] TypeScript, tsx, vitest, Fastify, and Zod are installed; `tsconfig.json` compiles `src/` to `dist/`
- [ ] `src/server.ts` starts and listens; `test/smoke.test.ts` passes
- [ ] `npm test`, `npm run build`, `npm start`, `npm run dev` all work as described
- [ ] `.gitignore` and `.env.example` are in place; no secrets in git

---

### Key files (end of Phase 0)

- `backend/package.json` — name, type, engines, scripts, dependencies
- `backend/tsconfig.json` — rootDir `src`, outDir `dist`, ESM (NodeNext), strict
- `backend/.gitignore` — node_modules, dist, .env
- `backend/.env.example` — PORT, HOST (or equivalent)
- `backend/src/server.ts` — Fastify app, listen on PORT/HOST
- `backend/test/smoke.test.ts` — minimal Vitest test

Optional (if app + health added early): `backend/src/app.ts`, `backend/test/health.test.ts`, `backend/requests/health.http`.

---

### Notes

- Keep Phase 0 small so Phase 1 is easy to start.
- Do not add DB, auth, or extra structure in Phase 0.
