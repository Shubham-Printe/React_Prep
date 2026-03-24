# React Native iOS app — REST API roadmap

A **phase-wise** guide to building a **React Native** app that **targets iOS** and **consumes REST APIs**. Assumes familiarity with **React** and **TypeScript**; mobile-specific items are spelled out.

---

## Reality check: native UI, not “web in a container”

React Native does **not** run a web app inside a WebView. Your UI is **native** (UIKit on iOS): `<View>` → UIView, `<Text>` → UILabel, etc. Camera, microphone, and file system use the **same native APIs** as a Swift app. If your app needs **voice recording**, **photos/videos**, and a **natural iOS feel**, see **[native-media-and-ios-feel.md](./native-media-and-ios-feel.md)** for the full picture and where media + native polish fit into these phases.

---

## Phase 0 — Prerequisites & decisions

### Goals

- Confirm machine and accounts.
- Lock stack choices so later phases stay consistent.

### Checklist

| Item | Notes |
|------|--------|
| Mac with macOS | Required for iOS Simulator and App Store builds. |
| Xcode | From App Store; open once to install components. |
| Node.js LTS | e.g. 20.x; use `nvm` if you manage versions. |
| Apple ID | Free tier runs on device via Expo; **$99/year** Developer Program for TestFlight/App Store. |
| Editor | VS Code or Cursor + React Native / Expo extensions. |

### Stack decisions (recommended defaults)

| Choice | Recommendation |
|--------|----------------|
| Runtime | **Expo** (SDK current stable) — faster bootstrap; EAS Build for production iOS. |
| Language | **TypeScript** |
| Navigation | **Expo Router** *or* **React Navigation** (pick one; Expo Router fits file-based mental model). |
| REST + cache | **TanStack Query (React Query)** for GET/POST/PUT/DELETE + loading/error/retry. |
| HTTP client | **fetch** (built-in) or **axios** (interceptors); wrap in one `api` module. |
| Secure token storage | **expo-secure-store** (iOS Keychain). |
| Env / base URL | **expo-constants** + `app.config` extra, or `.env` with `expo-env` pattern — **never** commit production secrets. |
| Voice / camera / video | **expo-av** (recording), **expo-camera** or **react-native-vision-camera**, **expo-image-picker**; **expo-haptics** for native feel. See [native-media-and-ios-feel.md](./native-media-and-ios-feel.md). |

### Deliverable

- Written note: chosen navigation library, where API base URL will live (dev vs prod).

---

## Phase 1 — Bootstrap (Expo + TypeScript + iOS)

### Goals

- Create the project and run it on **iOS Simulator** (and optionally **Expo Go** on a physical device).

### Steps

1. Create app (TypeScript template):

   ```bash
   npx create-expo-app@latest YourAppName --template blank-typescript
   ```

2. Enter project folder, start dev server:

   ```bash
   cd YourAppName
   npx expo start
   ```

3. Press `i` for iOS Simulator (requires Xcode) or scan QR with Expo Go.

4. Install navigation (when you reach Phase 4) — for now verify hot reload works.

### Dependencies to add early (can batch with Phase 4)

- `expo-secure-store` (Phase 7)
- `@tanstack/react-query` (Phase 6)
- `react-native-safe-area-context` (often pulled in by Expo Router / navigation)

### Deliverable

- App launches on simulator; you can edit `App.tsx` and see changes.

### Common issues

- **Simulator won’t open:** Xcode → Settings → Locations → Command Line Tools set.
- **Metro cache:** `npx expo start -c`.

---

## Phase 2 — Project structure & conventions

### Goals

- Keep REST and UI concerns separated so the app scales.

### Suggested layout

```text
src/
  api/                 # HTTP client, endpoints, types derived from API
    client.ts          # base URL, headers, error normalization
    types.ts           # shared DTOs (or colocate per feature)
    invoices.ts        # example: listInvoice(), getInvoice(id)
  features/            # optional: feature folders
    invoices/
      screens/
      components/
      hooks/
  components/          # shared UI
  hooks/               # shared hooks
  navigation/            # if using React Navigation
  constants/
  lib/                 # queryClient, formatters
app/                   # if using Expo Router: _layout.tsx, (tabs)/, etc.
```

### Conventions

| Topic | Convention |
|-------|------------|
| API responses | Parse JSON once; map to **typed** models in `api/` or feature layer. |
| Errors | Normalize to `{ message, code?, status? }` in `client.ts` so UI stays dumb. |
| Base URL | `EXPO_PUBLIC_API_URL` or `extra` in `app.config.js` — document in README. |

### Deliverable

- Folders exist; `App.tsx` (or root layout) only wires providers and root navigator.

---

## Phase 3 — UI foundation (REST-friendly screens)

### Goals

- Build reusable patterns every API-driven screen needs.

### Topics

| Topic | Implementation hints |
|-------|---------------------|
| Lists | `FlatList` or `FlashList` for large lists; `keyExtractor`; `refreshControl` later. |
| Loading | Skeleton or `ActivityIndicator` + centered layout. |
| Empty | Dedicated empty state component (icon + message + CTA). |
| Errors | Banner or inline message + **Retry** button. |
| Forms | `TextInput` + controlled state; submit triggers mutation (Phase 6). |
| Touch | `Pressable` with pressed state; avoid tiny tap targets (min ~44pt). |
| Styling | `StyleSheet.create`; consistent spacing scale (4/8/16). |

### Deliverable

- One **dummy** list screen and one **form** screen (static data OK) matching your design tokens.

---

## Phase 4 — Navigation

### Goals

- Stack for detail flows; tabs if the product needs multiple root sections.

### If using Expo Router

- File-based routes under `app/`; `_layout.tsx` for stack/tabs.
- Typed params for deep links (e.g. `/invoice/[id]`).

### If using React Navigation

- `NavigationContainer` → Native Stack → Tab navigator as needed.
- Type param lists with TypeScript for safe `navigation.navigate`.

### Deliverable

- Login/home placeholder routes (even if fake) so Phase 7 auth flow has somewhere to land.

---

## Phase 5 — REST API layer

### Goals

- Single place for **base URL**, **headers**, **JSON parsing**, and **HTTP errors**.

### Client responsibilities

1. **Base URL** from env.
2. **Headers:** `Content-Type: application/json`; attach `Authorization` when token exists (Phase 7).
3. **Methods:** thin wrappers: `get<T>(path)`, `post<T>(path, body)`, `put`, `patch`, `delete`.
4. **Errors:**
   - Non-2xx: read body if JSON; throw or return `Result` type.
   - Network failures: distinguish **offline** vs **5xx** vs **4xx** for messaging.
5. **Timeouts:** `AbortController` + `setTimeout` or axios `timeout`.

### Example shape (conceptual)

```ts
// api/client.ts — pseudo-structure
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: mergedHeaders });
  if (!res.ok) throw await normalizeError(res);
  return res.json() as Promise<T>;
}
```

### File upload (voice, photos, videos)

- Add **multipart/form-data** support: `postFile(path, fileUri, fieldName)` or similar so you can upload files from camera/recorder (local file URIs). See [native-media-and-ios-feel.md](./native-media-and-ios-feel.md) for capture flow.

### API modules per resource

- `api/invoices.ts`: `fetchInvoices()`, `fetchInvoiceById(id)`, `createInvoice(payload)`.
- Types aligned with backend (or OpenAPI-generated types if you adopt codegen later).

### Deliverable

- Call a **real** GET endpoint from a temporary button/log; log typed response.
- (If using media) Upload a test file via multipart to your API.
- Document required env vars in README.

---

## Phase 6 — Server state (TanStack Query) & UI state

### Goals

- **Queries** for GET (cache, refetch, stale time).
- **Mutations** for POST/PUT/PATCH/DELETE (invalidate related queries on success).

### Setup

- `QueryClientProvider` at root.
- Default options: `retry: 1` or `2` for GET; handle **429** with backoff if API requires it.

### Patterns

| Pattern | Use |
|---------|-----|
| `useQuery` | List/detail screens; `enabled: !!id` for dependent queries. |
| `useMutation` | Create/update/delete; `onSuccess` → `queryClient.invalidateQueries`. |
| `placeholderData` / `keepPreviousData` | Smoother pagination or tab switches. |
| Optimistic updates | Optional; only when UX demands it. |

### Local UI state

- Form fields: `useState` or small context.
- Don’t duplicate server list in global state unless necessary — **Query cache is source of truth** for server data.

### Deliverable

- At least one **list** screen backed by `useQuery` and one **mutation** with invalidation.

---

## Phase 7 — Authentication & secure storage

### Goals

- Store **access** (and refresh if API provides) tokens securely; attach to API client.

### Flow (typical REST)

1. Login: `POST /auth/login` → access token (± refresh token).
2. Save tokens with **`expo-secure-store`** (not AsyncStorage for secrets).
3. `api/client` reads token and sets `Authorization: Bearer <token>`.
4. On **401**: clear tokens, redirect to login (optional: refresh flow if backend supports it).

### Logout

- Remove SecureStore keys; `queryClient.clear()` to drop cached user-specific data.

### Deliverable

- Login screen → stores token → subsequent API calls succeed; logout clears session.

---

## Phase 8 — Error handling, empty states, pull-to-refresh

### Goals

- Production-grade feedback for API-driven screens.

### Checklist

| Case | UX |
|------|-----|
| Loading | Skeleton or spinner; avoid layout jump if possible. |
| Empty list | Illustration + “No invoices yet” + primary action. |
| Error | Human-readable message; **Retry**; log `requestId` if API returns it. |
| Pull-to-refresh | `RefreshControl` on `ScrollView`/`FlatList` bound to `refetch()`. |
| Pagination | Cursor or page params; “Load more” or infinite scroll with `fetchNextPage`. |

### Deliverable

- One list screen covers loading / error / empty / success + pull-to-refresh.

---

## Phase 9 — iOS polish

### Goals

- Behave well on notches, keyboard, and accessibility.

### Topics

| Topic | Action |
|-------|--------|
| Safe area | `SafeAreaProvider` + `useSafeAreaInsets` or safe area aware scroll views. |
| Keyboard | `KeyboardAvoidingView` behavior `padding` on iOS; dismiss on scroll (`keyboardDismissMode`). |
| Status bar | `expo-status-bar` to match light/dark theme. |
| Dynamic Type | Prefer scalable text where design allows. |
| VoiceOver | `accessibilityLabel` on icon-only buttons. |
| Dark mode | Use semantic colors; test in both appearances. |

### Deliverable

- No content hidden under home indicator; forms usable with keyboard open.

---

## Phase 10 — Build, TestFlight & App Store

### Goals

- Ship an iOS build consumers can install.

### Steps (Expo EAS — typical)

1. Install EAS CLI: `npm i -g eas-cli`.
2. `eas login`; `eas build:configure`.
3. **iOS credentials:** let EAS manage distribution cert + provisioning profile (first time).
4. `eas build --platform ios` → download or submit from EAS.
5. **App Store Connect:** new app, bundle ID, screenshots, description, privacy policy URL, **Privacy Nutrition Labels** (data collected).
6. **Internal testing** via TestFlight; then **Submit for Review**.

### Checklist

| Item | Notes |
|------|--------|
| `app.json` / `app.config` | `ios.bundleIdentifier`, version, build number. |
| API base URL | Production URL in build profile or env — not localhost. |
| ATS | If API is HTTPS with valid cert, default OK; HTTP needs ATS exceptions (avoid if possible). |

### Deliverable

- Build in TestFlight; submission checklist completed.

---

## Phase 11 — Hardening (optional)

### Goals

- Maintainability and observability after launch.

| Area | Options |
|------|---------|
| Unit tests | Jest for parsers, `client` error mapping, hooks with `@testing-library/react-native`. |
| E2E | Maestro or Detox for critical flows (login → list → detail). |
| Crash reporting | Sentry (`@sentry/react-native`) with Expo config plugin. |
| Analytics | Privacy-first events (screen views, key actions); disclose in privacy policy. |
| API contract | OpenAPI → codegen (e.g. `openapi-typescript`) to reduce drift with backend. |

---

## Appendix A — REST checklist (backend alignment)

Coordinate with whoever owns the API:

- [ ] Base path and versioning (`/v1/...`).
- [ ] Error body shape (e.g. `{ error: { code, message } }`).
- [ ] Pagination contract (cursor vs offset).
- [ ] Auth header format and token TTL / refresh.
- [ ] Rate limits and idempotency keys for writes if needed.

---

## Appendix B — Suggested timeline (indicative)

| Weeks | Phases |
|-------|--------|
| 1 | 0–1 |
| 2 | 2–4 |
| 3 | 5–6 |
| 4 | 7–8 |
| 5 | 9–10 |
| 6+ | 11 + iterations |

Adjust based on app complexity and design readiness.

---

## Document maintenance

- Bump **Expo SDK** and **React Native** versions periodically; re-run Phase 1 smoke test after upgrades.
- When adding Android later, most phases apply; Phase 10 adds Play Console and `eas build --platform android`.

---

*End of roadmap.*
