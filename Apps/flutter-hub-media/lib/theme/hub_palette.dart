import 'package:flutter/material.dart';

/// Matches `react-native-ios-v2/mobile/constants/Colors.ts`
class HubPalette {
  const HubPalette({
    required this.text,
    required this.background,
    required this.tint,
    required this.surface,
    required this.paper,
    required this.border,
    required this.borderStrong,
    required this.muted,
    required this.accent,
    required this.accentForeground,
    required this.inverseText,
    required this.inverseMuted,
    required this.ink,
    required this.inkSoft,
    required this.inkBorder,
    required this.danger,
    required this.shadow,
  });

  final Color text;
  final Color background;
  final Color tint;
  final Color surface;
  final Color paper;
  final Color border;
  final Color borderStrong;
  final Color muted;
  final Color accent;
  final Color accentForeground;
  final Color inverseText;
  final Color inverseMuted;
  final Color ink;
  final Color inkSoft;
  final Color inkBorder;
  final Color danger;
  final Color shadow;

  static const HubPalette light = HubPalette(
    text: Color(0xFF231f20),
    background: Color(0xFFfaf5ee),
    tint: Color(0xFF231f20),
    surface: Color(0xFFfffdf9),
    paper: Color(0xFFfaf5ee),
    border: Color(0xFFe1cdc0),
    borderStrong: Color(0xFFcfb8aa),
    muted: Color(0xFF73665f),
    accent: Color(0xFFe1cdc0),
    accentForeground: Color(0xFF231f20),
    inverseText: Color(0xFFfaf5ee),
    inverseMuted: Color(0xFFddd0c5),
    ink: Color(0xFF231f20),
    inkSoft: Color(0xFF322d2e),
    inkBorder: Color(0xFF494142),
    danger: Color(0xFFad4c43),
    shadow: Color(0x1E231f20),
  );

  static const HubPalette dark = HubPalette(
    text: Color(0xFFfaf5ee),
    background: Color(0xFF171415),
    tint: Color(0xFFe1cdc0),
    surface: Color(0xFF231f20),
    paper: Color(0xFF2d2829),
    border: Color(0xFF493f39),
    borderStrong: Color(0xFF6d6059),
    muted: Color(0xFFc1b1a5),
    accent: Color(0xFFe1cdc0),
    accentForeground: Color(0xFF231f20),
    inverseText: Color(0xFFfaf5ee),
    inverseMuted: Color(0xFFd7c9bf),
    ink: Color(0xFF110f10),
    inkSoft: Color(0xFF231f20),
    inkBorder: Color(0xFF403738),
    danger: Color(0xFFde8279),
    shadow: Color(0x52000000),
  );

  static HubPalette of(BuildContext context) {
    final b = Theme.of(context).brightness;
    return b == Brightness.dark ? dark : light;
  }
}
