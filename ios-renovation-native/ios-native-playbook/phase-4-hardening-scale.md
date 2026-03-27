# Phase 4 — Hardening and scale

**Indicative duration:** not fixed in architecture doc; often ~2–6 weeks depending on policy and scope.

← [Phase 3](./phase-3-picture-voice-jobs.md) · [Playbook home](./README.md)

---

## Story beat

The same features survive bad networks, impatient double-taps, and **App Review** / policy questions.

---

## Build

- **Retries** with backoff for safe reads; **upload** retry rules (idempotency keys if API supports them).
- **Rate limiting** UX when the server pushes back.
- **Accessibility:** VoiceOver on main flows; Dynamic Type where feasible.
- **App Store:** privacy nutrition labels, **Privacy Policy** links, **data deletion** paths if required.
- Optional: **certificate pinning** (test thoroughly).

---

## Learn

- Lightweight logging / Instruments for upload issues.
- **TestFlight** with non-engineers.

---

## Exit criteria

- [ ] You can state **what data** leaves the device and **why** (App Review + your own clarity).
- [ ] No duplicate notes/labels from double-submit on common paths.

---

## Phase log (your diary)

_Add one line per milestone._
