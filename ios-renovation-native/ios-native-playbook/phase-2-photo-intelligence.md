# Phase 2 — Photo intelligence (before/after, tags)

**Indicative duration:** 3–6 weeks (see architecture doc §3).

← [Phase 1](./phase-1-voice-ai-note.md) · [Playbook home](./README.md) · Next: [Phase 3 — Picture + voice](./phase-3-picture-voice-jobs.md)

---

## Story beat

User attaches **multiple photos** to a **visit**, uploads with the same **context IDs** as voice, waits, sees **suggestions** (phase, room, labels, etc.), corrects them, and **saves** final labels through the API.

---

## Build

- **Batch selection** and ordered list UI (thumbnails, remove, reorder if required).
- **Upload** for many images (single vs chunked — follow API).
- **Suggestion review:** toggles, chips, or forms; “accept all” vs per-field edit.
- Optional: **pair two photos** as before/after with explicit user action.

---

## Learn

- Memory pressure with many full-size images (preview downscale; upload originals per contract).
- UX for **partial failures** (e.g. 3 up, 1 failed).

---

## Exit criteria

- [ ] Multi-photo capture / upload / review / save on device.
- [ ] User can **override** every suggested field before save.

---

## Phase log (your diary)

_Add one line per milestone._
