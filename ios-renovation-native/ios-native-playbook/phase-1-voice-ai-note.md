# Phase 1 — Voice → AI note (core MVP)

**Indicative duration:** 3–5 weeks (see architecture doc §3).

← [Phase 0](./phase-0-foundations.md) · [Playbook home](./README.md) · Next: [Phase 2 — Photo intelligence](./phase-2-photo-intelligence.md)

---

## Story beat

User records a note, uploads it with **project/visit (and other) IDs**, waits while the server works, sees a **structured draft** (title, body, bullets—per contract), edits it, and **saves** the confirmed note via API.

---

## Build

- **Upload:** multipart or signed URL — match backend; include **metadata** (IDs, locale if needed).
- **Job lifecycle:** **poll** status until `complete` / `failed`, or (later) **push** to the result screen — polling is enough for MVP.
- **Review UI:** editable fields bound to a draft model; **loading**, **empty**, **error** (network, permission, empty transcription).
- **Persist:** confirm → **save** endpoint → navigate to list/detail.
- **Versioned models:** **Codable** with optional fields for API evolution.

---

## Learn

- Large file upload, progress, cancellation.
- Mapping API errors to user-visible messages.
- **Recording UX** for the field: obvious states, large tap targets.

---

## Exit criteria

- [ ] End-to-end **happy path** on device with **real backend** or staging when available.
- [ ] With **mock only**: upload → fake delay → fake draft → save demo.
- [ ] Failures do not strand the user (retry, discard, support copy).

---

## Backend reference (not your spec)

Ingestion, STT, LLM, draft shape, audit — backend team’s document. You need a **stable enough contract** to code against.

---

## Phase log (your diary)

_Add one line per milestone, e.g. `2026-04-01 — Draft review + save live against staging.`_
