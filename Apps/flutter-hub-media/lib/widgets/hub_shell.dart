import 'package:flutter/material.dart';

import '../theme/hub_palette.dart';

enum HubSection { home, voice, camera }

class HubShell extends StatelessWidget {
  const HubShell({
    super.key,
    required this.section,
    required this.eyebrow,
    required this.title,
    required this.subtitle,
    required this.onNavigate,
    required this.child,
    this.actionChips = const [],
  });

  final HubSection section;
  final String eyebrow;
  final String title;
  final String subtitle;
  final ValueChanged<HubSection> onNavigate;
  final Widget child;
  final List<({String label, HubSection target})> actionChips;

  static const _nav = <({HubSection key, String label, String detail, IconData icon})>[
    (key: HubSection.home, label: 'Dashboard', detail: 'Overview and next steps', icon: Icons.grid_view_rounded),
    (key: HubSection.voice, label: 'Voice', detail: 'Record and review clips', icon: Icons.mic_rounded),
    (key: HubSection.camera, label: 'Camera', detail: 'Photo and video capture', icon: Icons.photo_camera_rounded),
  ];

  @override
  Widget build(BuildContext context) {
    final palette = HubPalette.of(context);
    final wide = MediaQuery.sizeOf(context).width >= 900;

    void go(HubSection s, {bool popDrawer = false}) {
      if (popDrawer) Navigator.of(context).pop();
      onNavigate(s);
    }

    Widget sidebar({required bool drawerMode}) {
      return ColoredBox(
        color: palette.ink,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('the HUB', style: TextStyle(color: palette.inverseText, fontSize: 28, fontWeight: FontWeight.w800)),
                Text('by Chapter', style: TextStyle(color: palette.inverseMuted, fontSize: 14, fontWeight: FontWeight.w500)),
                const SizedBox(height: 24),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: palette.inkSoft,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: palette.inkBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('WORKSPACE', style: TextStyle(color: palette.inverseMuted, fontSize: 12, fontWeight: FontWeight.w600)),
                      Text('Media Hub', style: TextStyle(color: palette.inverseText, fontSize: 18, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
                const SizedBox(height: 28),
                Text('NAVIGATE', style: TextStyle(color: palette.inverseMuted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
                const SizedBox(height: 12),
                Expanded(
                  child: ListView(
                    children: [
                      for (final item in _nav)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Material(
                            color: section == item.key ? palette.inkSoft : Colors.transparent,
                            borderRadius: BorderRadius.circular(18),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(18),
                              onTap: () => go(item.key, popDrawer: drawerMode),
                              child: Container(
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(
                                    color: section == item.key ? palette.accent : Colors.transparent,
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: section == item.key ? palette.accent : palette.inkBorder,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Icon(item.icon, color: palette.ink, size: 22),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(item.label, style: TextStyle(color: palette.inverseText, fontSize: 16, fontWeight: FontWeight.w700)),
                                          Text(item.detail, style: TextStyle(color: palette.inverseMuted, fontSize: 13, height: 1.3)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: palette.inkSoft,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: palette.inkBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('DESIGN PATTERN', style: TextStyle(color: palette.inverseMuted, fontSize: 12, fontWeight: FontWeight.w600)),
                      Text('Chapter Hub mobile', style: TextStyle(color: palette.inverseText, fontSize: 18, fontWeight: FontWeight.w700)),
                      Text('Branded shell, module navigation, and focused content cards.', style: TextStyle(color: palette.inverseMuted, fontSize: 13, height: 1.35)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final scroll = CustomScrollView(
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              _HeroCard(
                palette: palette,
                eyebrow: eyebrow,
                title: title,
                subtitle: subtitle,
                section: section,
                onNavigate: onNavigate,
                extraChips: actionChips,
              ),
              const SizedBox(height: 20),
              child,
            ]),
          ),
        ),
      ],
    );

    if (wide) {
      return Scaffold(
        backgroundColor: palette.background,
        body: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(
              width: 286,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  border: Border(right: BorderSide(color: palette.borderStrong)),
                ),
                child: sidebar(drawerMode: false),
              ),
            ),
            Expanded(child: scroll),
          ],
        ),
      );
    }

    final active = _nav.firstWhere((e) => e.key == section);

    return Scaffold(
      backgroundColor: palette.background,
      drawer: Drawer(
        backgroundColor: palette.ink,
        child: sidebar(drawerMode: true),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ColoredBox(
            color: palette.ink,
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                child: Row(
                  children: [
                    Builder(
                      builder: (ctx) => IconButton(
                        onPressed: () => Scaffold.of(ctx).openDrawer(),
                        style: IconButton.styleFrom(
                          foregroundColor: palette.inverseText,
                          side: BorderSide(color: palette.inkBorder),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.menu_rounded),
                      ),
                    ),
                    Expanded(
                      child: Column(
                        children: [
                          Text('the HUB', style: TextStyle(color: palette.inverseText, fontSize: 22, fontWeight: FontWeight.w800)),
                          Text('by Chapter', style: TextStyle(color: palette.inverseMuted, fontSize: 12)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(
                        color: palette.inkSoft,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: palette.inkBorder),
                      ),
                      child: Text(active.label, style: TextStyle(color: palette.inverseText, fontSize: 13, fontWeight: FontWeight.w700)),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Expanded(child: scroll),
        ],
      ),
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard({
    required this.palette,
    required this.eyebrow,
    required this.title,
    required this.subtitle,
    required this.section,
    required this.onNavigate,
    required this.extraChips,
  });

  final HubPalette palette;
  final String eyebrow;
  final String title;
  final String subtitle;
  final HubSection section;
  final ValueChanged<HubSection> onNavigate;
  final List<({String label, HubSection target})> extraChips;

  @override
  Widget build(BuildContext context) {
    final chips = extraChips.isNotEmpty
        ? extraChips
        : [
            (label: 'Dashboard', target: HubSection.home),
            (label: 'Voice', target: HubSection.voice),
            (label: 'Camera', target: HubSection.camera),
          ];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: palette.border),
        boxShadow: [
          BoxShadow(color: palette.shadow, offset: const Offset(0, 14), blurRadius: 28),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            eyebrow.toUpperCase(),
            style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1.1),
          ),
          const SizedBox(height: 10),
          Text(title, style: TextStyle(color: palette.text, fontSize: 32, fontWeight: FontWeight.w800, height: 1.1)),
          const SizedBox(height: 8),
          Text(subtitle, style: TextStyle(color: palette.muted, fontSize: 16, height: 1.45)),
          const SizedBox(height: 18),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              for (final c in chips)
                Material(
                  color: section == c.target ? palette.ink : palette.paper,
                  borderRadius: BorderRadius.circular(999),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(999),
                    onTap: () => onNavigate(c.target),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: section == c.target ? palette.ink : palette.border),
                      ),
                      child: Text(
                        c.label,
                        style: TextStyle(
                          color: section == c.target ? palette.inverseText : palette.text,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
