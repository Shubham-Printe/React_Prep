# Phase 0 — Foundations

**Indicative duration:** 2–4 weeks (see architecture doc §3).

← [Playbook home](./README.md) · Next: [Phase 1 — Voice → AI note](./phase-1-voice-ai-note.md)

---

## Story beat

The app exists. You can sign in (or use a dev bypass), see real navigation, record and play audio on device, pick or capture photos, and hit *something* over the network for lists/detail—even if that something is mock JSON.

---

## Build

- New **SwiftUI** app, sensible **folder structure** (e.g. `Features/`, `Services/`, `Models/`, `DesignSystem/`).
- **Navigation** shell: tabs or stack that matches **project → visit → capture → review** (copy can evolve).
- **Audio:** record and playback with **AVFoundation**; **microphone** permission and interruptions (calls, other apps).
- **Images:** camera and/or photo picker; **camera** and **photo library** usage descriptions in **Info.plist**.
- **Networking stub:** `URLSession` to a **mock** base URL or static JSON for “projects” / “visits” if the API is not ready.
- Optional: placeholder **auth** (debug token or Sign in with Apple skeleton).

---

## Learn

- SwiftUI lifecycle, `@Observable` / view models, sheets and errors.
- How **permissions** fail when strings are missing or the user denies.
- Separating **UI** from a small **API client** (mock ↔ real swap).

---

## Exit criteria

- [ ] On a **physical device**: record ≥10s audio, play it back, pick/take a photo — no crashes.
- [ ] Nav shell matches primary journeys (empty states OK).
- [ ] One **network path** (real or mock) behind a single service type.

---

## Phase log (your diary)

_Add one line per milestone, e.g. `2026-03-24 — Recording + tab shell on device.`_
