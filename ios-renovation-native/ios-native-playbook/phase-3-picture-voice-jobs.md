# Phase 3 — Picture + voice; longer jobs

**Indicative duration:** 4–8 weeks (see architecture doc §3).

← [Phase 2](./phase-2-photo-intelligence.md) · [Playbook home](./README.md) · Next: [Phase 4 — Hardening](./phase-4-hardening-scale.md)

---

## Story beat

One **job** can include **images + short audio**; flow stays **capture → upload → wait → review → save**. Long-running work uses **polling** and/or **push**; optional **background upload** if users leave mid-upload.

---

## Build

- Package **audio + images** in one flow (or **linked job IDs** — per API).
- **Push:** register, entitlements, handle payload → refresh job or navigate to result.
- If required: **background** `URLSession` or tasks for uploads.

---

## Learn

- Push provisioning and **device** testing.
- Matching **job ID** in push to in-app navigation.

---

## Exit criteria

- [ ] Combined media job end-to-end.
- [ ] **Waiting** state is obvious (progress, “we’ll notify you,” or poll UX).

---

## Phase log (your diary)

_Add one line per milestone._
