import 'package:flutter/material.dart';

import '../theme/hub_palette.dart';

class HubCard extends StatelessWidget {
  const HubCard({
    super.key,
    required this.palette,
    required this.child,
  });

  final HubPalette palette;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: palette.border),
        boxShadow: [
          BoxShadow(
            color: palette.shadow,
            offset: const Offset(0, 12),
            blurRadius: 24,
          ),
        ],
      ),
      child: DefaultTextStyle.merge(
        child: child,
      ),
    );
  }
}
