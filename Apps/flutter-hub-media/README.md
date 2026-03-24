# Media Hub (Flutter)

Flutter counterpart to **`Apps/react-native-ios-v2`**: same **HUB** palette, navigation shell, **Voice** (record → clip list → play/remove), and **Camera** (native camera → in-app photo/video preview + thumbnails).

## Prerequisites

- [Flutter](https://docs.flutter.dev/get-started/install) stable (3.24+ recommended)
- Xcode (for iOS Simulator / device)

## One-time setup

From this folder:

```bash
cd Apps/flutter-hub-media

# If ios/ and android/ are missing, generate platform folders:
flutter create . --project-name media_hub

flutter pub get
```

### iOS permissions (`ios/Runner/Info.plist`)

After `flutter create`, ensure these keys exist (Flutter may add some automatically; merge if needed):

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Record voice clips in the Voice workspace.</string>
<key>NSCameraUsageDescription</key>
<string>Take photos and videos in the Camera workspace.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Access photos when picking from the library if needed.</string>
```

## Run

```bash
flutter run
```

Pick an iOS Simulator or a connected iPhone.

## Parity with React Native

| RN (Expo) | Flutter |
|-----------|---------|
| `HubShell` + drawer / wide sidebar | `HubShell` + `Drawer` / fixed sidebar ≥900px |
| `expo-av` recording + playback | `record` + `audioplayers` |
| `expo-image-picker` + `expo-av` Video | `image_picker` + `video_player` |
| Chapter HUB colors | `lib/theme/hub_palette.dart` |
| Clip list + select + play | `VoiceScreen` |
| Preview + thumbnail strip | `CameraScreen` |

## Project layout

```
lib/
  main.dart                 # App + HubShell + section switching
  theme/hub_palette.dart
  widgets/hub_shell.dart
  widgets/hub_card.dart
  screens/dashboard_screen.dart
  screens/voice_screen.dart
  screens/camera_screen.dart
```

## Notes

- Clips and captures are **in-memory / temp files** for this demo (same idea as the RN session-only list). Add persistence with `path_provider` + a small store if you need it.
- On first run, accept **microphone** and **camera** prompts on device.
