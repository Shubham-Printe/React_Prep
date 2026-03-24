# React Native: not “web in a container” — and your media / native-feel plan

Your app needs **voice recording**, **photos/videos**, and a **natural iOS feel**. This doc does two things:

1. **Corrects the “web-app in a container” idea** — React Native is not that.
2. **Gives a concrete plan** for camera, video, audio, and native feel so you can still ship with React Native confidently.

---

## 1. Myth vs reality: “React Native = web in a box”

**That’s not how React Native works.**

| What people sometimes think | What actually happens |
|----------------------------|------------------------|
| “It’s a web app running in a browser/WebView” | **No.** The main UI is **native**. Your `<View>` becomes a **UIView**, `<Text>` a **UILabel**, `<ScrollView>` a **UIScrollView**, etc. |
| “It’s just HTML/CSS in a wrapper” | **No.** There is no DOM. You use React-style components that map to **native iOS (UIKit) views**. Layout is Yoga (flexbox), not the web engine. |
| “Performance and feel will be web-like” | **Not by default.** If you use native stacks, native lists, and proper gestures, the result is a **real iOS app** that users can’t tell from SwiftUI/UIKit. |

**What *is* running in a “container”:**

- Your **JavaScript/TypeScript** (business logic, state, API calls) runs in a **JS engine** (Hermes or JavaScriptCore).
- That engine talks to the **native side** over a bridge (or JSI in the New Architecture): “create this view,” “update this label,” “play this sound.”
- **Rendering, touch, scrolling, and system APIs** are all native. So camera, microphone, file system, and UI are the same native APIs an iOS app would use.

**So:**  
React Native is **native UI + native device APIs**, with your app logic written in JS/TS. It is **not** a web app inside a WebView. That would be something like **Cordova** or **Capacitor**.

---

## 2. What your app needs and how React Native handles it

You said the app needs to:

- **Record voice**
- **Take photos / videos**
- **Feel naturally good as an iOS app**

All of this is **fully doable** in React Native using the same native capabilities (AVFoundation, camera, etc.) that a Swift app would use — just exposed via JS APIs.

---

## 3. Voice recording

### Options (Expo-first)

| Approach | Use case | Notes |
|----------|----------|--------|
| **expo-av** | Simple record → file → upload or play | Built-in with Expo; `Audio.record()`; outputs to file. Good for “record and send” or “record and attach.” |
| **expo-audio** (when stable) | Newer Expo audio APIs | Check Expo docs for current status. |
| **react-native-audio-recorder-player** | More control (levels, format) | If you need level meters or specific formats. |
| **react-native-live-audio-stream** | Real-time streaming | Only if you’re streaming audio to a server in real time. |

### Practical flow

1. **Permissions:** Request microphone (e.g. `expo-av` or `expo-speech` / permission helpers). Declare usage in `app.json` / `Info.plist` (e.g. “Voice messages”).
2. **Record:** Start recording → get a **file URI** (e.g. in app’s cache/documents).
3. **Playback:** Use `expo-av` to play the file before upload.
4. **Upload:** Use your REST client to `POST` the file (multipart or base64, depending on API). No “web container” — you’re using the same file system and network APIs as a native app.

### Native feel

- Use **expo-haptics** on record start/stop so the device gives subtle feedback.
- Show a **waveform or level meter** (from buffer/level APIs or a small native/JS visualization) so it doesn’t feel like a generic web form.

---

## 4. Photos and videos

### Camera (take new photo/video)

| Approach | Best for |
|----------|----------|
| **expo-camera** | Fast path: take photo/video, get file URI. Works in Expo managed workflow. |
| **react-native-vision-camera** | Advanced: custom UI, frames, barcode, low-light tuning. Use when you need more than “capture and send.” |

Both use the **real iOS camera (AVFoundation)**. You’re not “taking a photo in a web view” — you’re invoking the same camera stack as a native app.

### Picking from library

- **expo-image-picker**: “Choose from library” (photos/videos) with permission handling. Returns asset URIs you can then upload via your REST client.

### Practical flow

1. **Permissions:** Camera and (if needed) photo library. Set in `app.json` / Info.plist and request at runtime.
2. **Capture or pick:** Get back a **local file URI** (or asset identifier).
3. **Upload:** `POST` file in your API layer (multipart). Optionally compress/resize in JS or with a small native module if you need it.

### Native feel

- Use **full-screen camera UI** (no tiny web-style box).
- Use **native-style controls** (record button, flip camera) and **haptics** on capture.
- Respect **safe area** and **notch** so the UI feels like a first-class iOS camera flow.

---

## 5. “Feel naturally good as an iOS app”

This is mostly about **how** you use React Native, not a limitation of the stack.

### Do this

| Area | How |
|------|-----|
| **Navigation** | Use **native stack** (e.g. `@react-navigation/native-stack` or Expo Router with native stack). You get real iOS push/pop and gestures. |
| **Lists** | Use **FlashList** or **FlatList** (virtualized, native scroll). Avoid long HTML-like scroll divs. |
| **Gestures** | Use **react-native-gesture-handler** for swipes, pan, pinch. Under the hood it’s native gesture recognizers. |
| **Haptics** | **expo-haptics** for button tap, record start/stop, success/error. |
| **Keyboard** | **KeyboardAvoidingView** + `keyboardDismissMode` so forms behave like iOS. |
| **Safe area** | **SafeAreaView** or **react-native-safe-area-context** so content isn’t under notch/home indicator. |
| **Look** | Follow **Human Interface Guidelines**: navigation bar style, tab bar, standard controls. Use **platform-specific** styling where it matters (`Platform.OS === 'ios'`). |

### Avoid this

- Don’t build the whole UI like a webpage (fixed header + one big scroll). Use **screen-based navigation** and **native list** patterns.
- Don’t skip haptics and native-style transitions; they’re what make it “feel” iOS.
- Don’t use a WebView for your main UI; then it *would* be “web in a container.”

### Result

If you follow the above, users get:

- **Real native views** (UIKit).
- **Real camera and microphone** (AVFoundation).
- **Real files** and **real network** (REST uploads).
- **Native navigation, gestures, and system behaviors.**

So your app can absolutely “feel naturally good as an iOS app” while still being written in React Native.

---

## 6. When to consider pure native (Swift) instead

React Native is a good fit for your described app. Consider **native iOS** mainly if:

- You need **ultra-low-latency audio** (e.g. professional music/DAW-style apps) or **custom real-time audio processing** that can’t tolerate the JS bridge.
- You need **heavy custom camera pipelines** (e.g. custom encoding, multi-camera, or frame-by-frame processing) and want to live entirely in Swift/Metal.
- Your team is **iOS-only forever** and prefers to invest only in Swift and Apple’s tooling.

For “record voice, take photos/videos, and feel like a good iOS app,” **React Native + Expo (or bare RN) is a solid choice** and uses the same native capabilities under the hood.

---

## 7. Where this fits in your roadmap

- **Phase 0 (decisions):** Confirm you’re using **Expo** (or bare RN) and add **expo-av**, **expo-camera**, **expo-image-picker**, **expo-haptics**, and **react-native-gesture-handler** to your stack list.
- **Phase 3 (UI foundation):** Include a “media capture” pattern: one screen that opens camera or recorder, gets a file URI, and shows a preview (and optionally uploads). That validates permissions and flow early.
- **Phase 5 (REST):** Add **file upload** to your API client (multipart for voice/photos/videos).
- **Phase 9 (iOS polish):** Explicitly add haptics, native stack, safe area, and “no WebView” UI patterns so the app feels native.

You can treat this document as the **media + native-feel** addendum to your main [react-native-ios-rest-api-roadmap.md](./react-native-ios-rest-api-roadmap.md): same phases, with camera, voice, and “feel like iOS” baked in.

---

*Summary: React Native is **native UI and native device APIs**, not a web app in a container. Voice, camera, and video are all native; you just drive them from JavaScript. With the right libraries and patterns, your app can record voice, take photos/videos, and feel naturally good on iOS.*
