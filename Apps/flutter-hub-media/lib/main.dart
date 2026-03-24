import 'package:flutter/material.dart';

import 'screens/camera_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/voice_screen.dart';
import 'theme/hub_palette.dart';
import 'widgets/hub_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MediaHubApp());
}

class MediaHubApp extends StatelessWidget {
  const MediaHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Media Hub',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: _theme(HubPalette.light),
      darkTheme: _theme(HubPalette.dark),
      home: const MediaHubRoot(),
    );
  }

  ThemeData _theme(HubPalette p) {
    final dark = p == HubPalette.dark;
    return ThemeData(
      useMaterial3: true,
      brightness: dark ? Brightness.dark : Brightness.light,
      scaffoldBackgroundColor: p.background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: p.tint,
        brightness: dark ? Brightness.dark : Brightness.light,
        surface: p.surface,
      ),
    );
  }
}

class MediaHubRoot extends StatefulWidget {
  const MediaHubRoot({super.key});

  @override
  State<MediaHubRoot> createState() => _MediaHubRootState();
}

class _MediaHubRootState extends State<MediaHubRoot> {
  HubSection _section = HubSection.home;

  @override
  Widget build(BuildContext context) {
    final meta = switch (_section) {
      HubSection.home => (
          eyebrow: 'Chapter Hub',
          title: 'Media dashboard',
          subtitle: 'A HUB-style shell for iOS with voice recording and photo/video capture — Flutter port of the Expo app.',
        ),
      HubSection.voice => (
          eyebrow: 'Voice workspace',
          title: 'Voice capture',
          subtitle: 'Tap Start, then Stop. Clips appear in “Your clips”; tap one to select, then Play or Remove.',
        ),
      HubSection.camera => (
          eyebrow: 'Camera workspace',
          title: 'Photo and video capture',
          subtitle: 'Native camera via image_picker, then in-app preview and thumbnails — same flow as React Native.',
        ),
    };

    return HubShell(
      section: _section,
      eyebrow: meta.eyebrow,
      title: meta.title,
      subtitle: meta.subtitle,
      onNavigate: (s) => setState(() => _section = s),
      child: switch (_section) {
        HubSection.home => DashboardScreen(onOpenModule: (s) => setState(() => _section = s)),
        HubSection.voice => const VoiceScreen(),
        HubSection.camera => const CameraScreen(),
      },
    );
  }
}
