import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import HubShell from '@/components/hub/HubShell';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const modules = [
    {
      title: 'Voice workspace',
      detail: 'Hold to record, review the clip, and decide whether to keep or discard it.',
      route: '/record' as const,
      badge: 'Recording ready',
    },
    {
      title: 'Camera workspace',
      detail: 'Launch the native camera for photos or videos and keep recent captures in view.',
      route: '/camera' as const,
      badge: 'Photo + video',
    },
  ];

  return (
    <HubShell
      section="home"
      eyebrow="Chapter Hub"
      title="Media dashboard"
      subtitle="A HUB-style shell for iOS with clear module navigation and focused capture workflows."
      actions={[
        { label: 'Dashboard', route: '/' },
        { label: 'Voice', route: '/record' },
        { label: 'Camera', route: '/camera' },
      ]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            shadowColor: palette.shadow,
          },
        ]}>
        <Text style={[styles.sectionEyebrow, { color: palette.muted }]}>Overview</Text>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Current capabilities</Text>
        <Text style={[styles.sectionBody, { color: palette.muted }]}>
          The app now follows the HUB navigation pattern while keeping the two key native flows intact:
          voice recording and photo/video capture.
        </Text>

        <View style={styles.metricRow}>
          <View style={[styles.metricPill, { backgroundColor: palette.paper, borderColor: palette.border }]}>
            <Text style={[styles.metricValue, { color: palette.text }]}>2</Text>
            <Text style={[styles.metricLabel, { color: palette.muted }]}>Active modules</Text>
          </View>
          <View style={[styles.metricPill, { backgroundColor: palette.paper, borderColor: palette.border }]}>
            <Text style={[styles.metricValue, { color: palette.text }]}>100%</Text>
            <Text style={[styles.metricLabel, { color: palette.muted }]}>Native media preserved</Text>
          </View>
        </View>
      </View>

      {modules.map((module) => (
        <Pressable
          key={module.title}
          onPress={() => router.replace(module.route)}
          style={[
            styles.card,
            styles.moduleCard,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              shadowColor: palette.shadow,
            },
          ]}>
          <View style={[styles.moduleBadge, { backgroundColor: palette.accent }]}>
            <Text style={[styles.moduleBadgeText, { color: palette.accentForeground }]}>{module.badge}</Text>
          </View>
          <Text style={[styles.moduleTitle, { color: palette.text }]}>{module.title}</Text>
          <Text style={[styles.moduleBody, { color: palette.muted }]}>{module.detail}</Text>
          <Text style={[styles.moduleLink, { color: palette.text }]}>Open module</Text>
        </Pressable>
      ))}

      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            shadowColor: palette.shadow,
          },
        ]}>
        <Text style={[styles.sectionEyebrow, { color: palette.muted }]}>Pattern notes</Text>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>What changed</Text>
        <Text style={[styles.sectionBody, { color: palette.muted }]}>
          The mobile app now uses a branded shell, module menu, and card-based content hierarchy so it
          feels closer to the existing HUB experience instead of a generic Expo starter.
        </Text>
      </View>
    </HubShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
    gap: 12,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 23,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  metricPill: {
    minWidth: 150,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  moduleCard: {
    alignItems: 'flex-start',
  },
  moduleBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  moduleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  moduleBody: {
    fontSize: 15,
    lineHeight: 23,
  },
  moduleLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
