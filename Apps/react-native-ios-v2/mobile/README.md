# Media Demo — React Native (iOS)

A small **React Native** app to evaluate native feel: **voice recording**, **photos**, and **videos**. Uses Expo and runs on **iOS Simulator** or a **physical iPhone**.

---

## What’s in the app

- **Home** — Short intro and what to try.
- **Voice** — Hold a button to record, then play back or discard. Haptic feedback on start/stop (physical device).
- **Camera** — “Take photo” and “Record video” open the **system iOS camera** (not an in-app preview). Captured items show in a horizontal list.

All media uses **native iOS APIs** (AVFoundation, UIImagePicker). No WebView.

---

## Prerequisites

- **Mac** with **Xcode** (from the Mac App Store). Open Xcode once and accept the license; install any requested components.
- **Node.js 20+ required** (`node -v`). Node 18 will fail with `configs.toReversed is not a function` because Metro uses ES2023 APIs. Use Node 20 LTS or newer (see [nodejs.org](https://nodejs.org) or `nvm install 20`).
- **iOS Simulator** (included with Xcode) or a **physical iPhone** with **Expo Go** installed (App Store).

---

## How to run and test

### 1. Install dependencies

From the repo (this folder: `Apps/react-native-ios-v2/mobile`):

```bash
cd Apps/react-native-ios-v2/mobile
npm install
```

### 2. Start the dev server

```bash
npm start
```

(or `npx expo start`). A QR code and menu will appear in the terminal.

### 3. Open on iOS

**Option A — iOS Simulator (easiest on Mac)**

1. With the dev server running, press **`i`** in the terminal to open the app in the **iOS Simulator**.
2. Or: in the terminal menu, choose **“Run on iOS simulator”** and pick a device (e.g. iPhone 16).

**Option B — Physical iPhone (Expo Go)**

1. Install **Expo Go** from the App Store on your iPhone.
2. Ensure phone and Mac are on the **same Wi‑Fi**.
3. In the terminal, press **`s`** to switch to “tunnel” if “LAN” doesn’t connect, or scan the **QR code** with the iPhone camera and open in Expo Go.

> **Camera and microphone:** The **simulator has no real camera/mic**. For a full test of recording and photo/video, use a **physical device** with Expo Go.

### Voice → AI notes (Groq, no backend)

- Put **`EXPO_PUBLIC_GROQ_API_KEY`** in **`mobile/.env`** (see `.env.example`), then run **`npx expo start -c`**.
- Use **Expo Go on a real iPhone** (or iOS Simulator for layout only). **Mac browser** preview cannot call Groq reliably (CORS).
- Step-by-step iPhone setup: **`IPHONE-SETUP.md`** (includes Part E for AI).

### 4. What to try

1. **Tabs** — Switch between Home, Voice, and Camera. Check that the tab bar and transitions feel smooth and iOS-like.
2. **Voice (on device)** — On a real iPhone, go to **Voice**, allow microphone access, then **hold** “Hold to record”, release to stop. Tap **Play** to hear the recording, **Discard** to clear. You should feel light haptics on start/stop.
3. **Camera (on device)** — On a real iPhone, go to **Camera**, allow camera access. Tap **Take photo** — the system camera should open; take a photo and confirm it appears in “Captured”. Tap **Record video** — record a short clip and confirm it appears.
4. **Simulator** — You can still test navigation, layout, and buttons; camera/voice will either be unavailable or use placeholder behavior.

---

## If something goes wrong

- **“Command Line Tools” / Simulator not found**  
  Xcode → Settings → Locations → set **Command Line Tools** to your Xcode version. Then run `npm start` and press `i` again.

- **Metro cache issues**  
  ```bash
  npx expo start -c
  ```
  (clears cache and restarts).

- **Node version / `configs.toReversed is not a function`**  
  Metro requires Node 20+ (ES2023). On Node 18 you get this error. Switch to Node 20: e.g. `nvm install 20 && nvm use 20`, then `npm install` and `npm start` again.

- **Camera / mic not working on device**  
  Confirm you tapped “Allow” for Camera and Microphone when prompted. If you denied, go to **Settings → Media Demo** (or Expo Go) and enable Camera and Microphone.

---

## Deciding: React Native vs Flutter

Use this app to judge:

- **Scrolling and tabs** — Any jank or lag?
- **Voice** — Does record/play feel responsive? Do haptics fire when you expect?
- **Camera** — Does the system camera open and return without delay? Do photos/videos show up quickly?

If it feels smooth and native enough, you can proceed with **React Native** for your real app. If not, you can try the same flow in **Flutter** and compare.

---

## Project layout

```
app/
  _layout.tsx          # Root layout, SafeAreaProvider, theme
  (tabs)/
    _layout.tsx        # Tab bar (Home, Voice, Camera)
    index.tsx          # Home screen
    record.tsx         # Voice recording + playback
    camera.tsx          # Photo / video capture
    two.tsx             # (hidden tab — leftover from template)
```

Libraries: **expo-av** (audio), **expo-image-picker** (camera), **expo-haptics** (haptics), **expo-router** (tabs/navigation), **react-native-safe-area-context** (safe areas).
