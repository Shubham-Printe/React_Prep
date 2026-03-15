## Phase 7 — Observability + ops endpoints

### Goal

Make the service debuggable and operable:
- consistent logging
- health/ready semantics
- minimal metrics/tracing approach (optional)

### Study (short)

- `node-backend-story/04-observability-ops.md` §18–19

### Build (steps)

#### Step 7.1 — Logging conventions

Define what every request log must include:
- requestId, method, path
- status, duration
- (later) userId (if authenticated), error code

#### Step 7.2 — Health vs ready

- `health`: process is up
- `ready`: dependencies are reachable (DB, queues, etc.)

#### Step 7.3 — Error logging policy

- log stack traces server-side
- never leak stack traces to clients
- attach requestId to errors

### Deliverable

- runbook-style notes exist: “how to debug 500s”, “how to find a request by id”

