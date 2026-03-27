# Native iOS app — build playbook

**AI voice notes · Renovation photo intelligence**

This playbook is the **hands-on story** of how you build the native client: what to build in order, what you are learning at each step, and how to keep moving when the backend is still catching up.

**Companion doc:** [`../ios-native-ai-renovation-architecture.md`](../ios-native-ai-renovation-architecture.md) — **why**, trust boundaries, and leadership summary. **This folder** is **how you ship**.

---

## Phase index

| Phase | Focus | Doc |
|-------|--------|-----|
| **0** | Foundations — shell, audio, photos, mock API | [phase-0-foundations.md](./phase-0-foundations.md) |
| **1** | Voice → AI note (MVP) | [phase-1-voice-ai-note.md](./phase-1-voice-ai-note.md) |
| **2** | Photo intelligence (tags, before/after) | [phase-2-photo-intelligence.md](./phase-2-photo-intelligence.md) |
| **3** | Picture + voice, push, longer jobs | [phase-3-picture-voice-jobs.md](./phase-3-picture-voice-jobs.md) |
| **4** | Hardening, App Store, scale | [phase-4-hardening-scale.md](./phase-4-hardening-scale.md) |

Work **0 → 4** in order unless you consciously parallelize UI and API work.

---

## The story in one arc

Field users capture **voice** and **photos** in a renovation context, send them to **your company’s API**, and **review AI-assisted drafts** before anything is final. The app never holds third-party AI keys; it **captures**, **uploads**, **waits for a job**, **shows drafts**, and **saves confirmed** content through the API.

**Pattern:** **Capture → upload (with context IDs) → wait (poll or push) → review → persist.**

---

## Before line one of code

| Area | You need |
|------|-----------|
| **Machine** | Mac with current **Xcode**. |
| **Apple** | **Apple ID**; for device/TestFlight/App Store, **Apple Developer Program** (~USD 99/year) and a role that can create apps and certificates. |
| **Device** | At least one **physical iPhone** for mic, camera, and real performance. |
| **Decisions** | Minimum iOS version; iPhone-only vs iPad; **auth** for v1. |
| **API** | Eventually: URLs, auth, upload, job status, draft, save. **Until then:** **mock** or a frozen contract. |

**Skills you will grow:** Swift, **SwiftUI**, **AVFoundation**, **PhotosUI** / camera, **URLSession**, **async/await**, **Info.plist** permissions, state for upload/review flows.

---

## How to use this playbook

1. Complete each phase’s **exit criteria** before moving on.
2. Keep a **short changelog** after each phase (what works on device, what is mocked).
3. If the backend slips, **freeze the API contract** (JSON/OpenAPI) and use **stubs**.
4. **Diary:** when a phase is done, add a one-line note at the **bottom** of that phase’s markdown file (date + what shipped).

**Indicative calendar** (one iOS engineer, sequential): on the order of **~3–6 months** through picture + voice, plus hardening — see §3 in the architecture doc for ranges. Planning guidance only.

---

## Running threads (all phases)

- **Copy:** short, field-friendly strings for recording, waiting, errors.
- **Design:** touch targets and clear **uploading / processing** states.
- **Legal / privacy:** mic, camera, photos (and location if used); align retention with backend.

---

## Suggested code shape

```text
Views (SwiftUI)
    → View models / coordinators
        → Services (APIClient, AudioRecorder, MediaPicker)
            → Models (Codable, domain types)
```

Keep **secrets** and third-party AI off the device; production traffic goes to **your API** only.

---

## Glossary

| Term | Meaning |
|------|---------|
| **Job** | Server work after upload until a draft is ready. |
| **Draft** | AI-proposed content; final only after user saves. |
| **Context IDs** | Project, visit, user, org — per API. |
| **System of record** | Backend owns canonical notes, labels, media metadata. |

---

## Start here

→ **[Phase 0 — Foundations](./phase-0-foundations.md)**
