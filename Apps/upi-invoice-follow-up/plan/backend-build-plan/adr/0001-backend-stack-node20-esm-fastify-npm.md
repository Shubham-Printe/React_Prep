## ADR: Backend stack choices (Node 20 + ESM + Fastify + npm)

- **Date**: 2026-02-24
- **Status**: accepted

### Context

We are building a backend-first project and a reusable backend playbook. We want:
- industry-standard defaults
- modern Node ecosystem conventions
- a clean separation from frontend (separate deployable service)
- a fast local dev loop and test-first workflow

### Decision

We chose:
- **Runtime**: Node **20 LTS**
- **Module system**: **ESM** (`"type": "module"`)
- **Framework**: **Fastify**
- **Package manager**: **npm**
- **Language**: **TypeScript**
- **Dev runner**: **tsx** (watch mode)
- **Testing**: **Vitest**

### Alternatives considered

- **Runtime**
  - Node 18 (older LTS): works, but Node 20 is a better default for modern deps/tooling.
- **Module system**
  - CommonJS: simpler for some legacy libs, but ESM is the modern baseline.
- **Framework**
  - Express: widely used and simpler surface area, but Fastify provides a stronger plugin/hook model and great performance.
- **Package manager**
  - pnpm/yarn: valid choices; we picked npm for simplicity and ubiquity.

### Consequences

- **Pros**:
  - modern ecosystem compatibility (Node 20 + ESM)
  - clean backend architecture patterns (Fastify hooks/plugins)
  - fast dev loop (`tsx watch`) and test discipline (Vitest)
- **Cons / risks**:
  - ESM can require more care with import paths and TS config (`module: NodeNext`)
  - some libraries/docs default to CommonJS; we may need to translate examples
  - team members on Node 18 must upgrade for parity
- **Follow-ups**:
  - add a dedicated ADR if we later change framework, module system, or package manager
  - ensure the playbook documents any ESM/TypeScript gotchas we hit

