import 'package:flutter/material.dart';

import '../theme/hub_palette.dart';
import '../widgets/hub_card.dart';
import '../widgets/hub_shell.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key, required this.onOpenModule});

  final void Function(HubSection section) onOpenModule;

  @override
  Widget build(BuildContext context) {
    final palette = HubPalette.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        HubCard(
          palette: palette,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('OVERVIEW', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
              Text('Current capabilities', style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
              Text(
                'This Flutter port mirrors the HUB shell: voice recording and photo/video capture with native pickers and in-app preview.',
                style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  _MetricPill(palette: palette, value: '2', label: 'Active modules'),
                  _MetricPill(palette: palette, value: '100%', label: 'Native media'),
                ],
              ),
            ],
          ),
        ),
        _ModuleCard(
          palette: palette,
          badge: 'Recording ready',
          title: 'Voice workspace',
          body: 'Start/stop recording, review clips in a list, play back with the speaker.',
          link: 'Open module',
          onTap: () => onOpenModule(HubSection.voice),
        ),
        _ModuleCard(
          palette: palette,
          badge: 'Photo + video',
          title: 'Camera workspace',
          body: 'Open the system camera for photos or videos; preview and pick thumbnails in-app.',
          link: 'Open module',
          onTap: () => onOpenModule(HubSection.camera),
        ),
        HubCard(
          palette: palette,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('PATTERN NOTES', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
              Text('Flutter vs React Native', style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
              Text(
                'Same palette, hub navigation, and card hierarchy as the Expo app. Implementation uses image_picker, record, video_player, and audioplayers.',
                style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _MetricPill extends StatelessWidget {
  const _MetricPill({required this.palette, required this.value, required this.label});

  final HubPalette palette;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minWidth: 150),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: palette.paper,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: palette.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value, style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
          Text(label, style: TextStyle(color: palette.muted, fontSize: 13, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _ModuleCard extends StatelessWidget {
  const _ModuleCard({
    required this.palette,
    required this.badge,
    required this.title,
    required this.body,
    required this.link,
    required this.onTap,
  });

  final HubPalette palette;
  final String badge;
  final String title;
  final String body;
  final String link;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: palette.surface,
      borderRadius: BorderRadius.circular(24),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: palette.border),
            boxShadow: [
              BoxShadow(color: palette.shadow, offset: const Offset(0, 12), blurRadius: 24),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(color: palette.accent, borderRadius: BorderRadius.circular(999)),
                child: Text(
                  badge.toUpperCase(),
                  style: TextStyle(color: palette.accentForeground, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 0.6),
                ),
              ),
              const SizedBox(height: 12),
              Text(title, style: TextStyle(color: palette.text, fontSize: 22, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              Text(body, style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45)),
              const SizedBox(height: 8),
              Text(link, style: TextStyle(color: palette.text, fontSize: 14, fontWeight: FontWeight.w700)),
            ],
          ),
        ),
      ),
    );
  }
}
