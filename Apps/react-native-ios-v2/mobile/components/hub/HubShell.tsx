import { useMemo, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';

import Colors from '@/constants/Colors';
import { VOICE_MENU_BUILD_LABEL } from '@/constants/voiceWorkspaceVersion';
import { useColorScheme } from '@/components/useColorScheme';

type HubSection = 'home' | 'voice' | 'camera';

type HubAction = {
  label: string;
  route: Href;
};

type SymbolName = ComponentProps<typeof SymbolView>['name'];

type HubShellProps = {
  section: HubSection;
  title: string;
  subtitle: string;
  eyebrow: string;
  actions?: HubAction[];
  children: ReactNode;
};

type NavItem = {
  key: HubSection;
  label: string;
  detail: string;
  route: Href;
  icon: SymbolName;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: 'Dashboard',
    detail: 'Overview and next steps',
    route: '/',
    icon: 'square.grid.2x2.fill',
  },
  {
    key: 'voice',
    label: 'Voice',
    detail: 'Hold to record and review clips',
    route: '/record',
    icon: 'mic.fill',
  },
  {
    key: 'camera',
    label: 'Camera',
    detail: 'Photo and video capture',
    route: '/camera',
    icon: 'camera.fill',
  },
];

function SymbolIcon({ name, tintColor }: { name: SymbolName; tintColor: string }) {
  return <SymbolView name={name} tintColor={tintColor} size={18} />;
}

function BrandLockup({
  palette,
  compact = false,
}: {
  palette: (typeof Colors)['light'];
  compact?: boolean;
}) {
  return (
    <View>
      <Text
        style={[
          styles.brandTitle,
          {
            color: palette.inverseText,
            fontSize: compact ? 24 : 28,
          },
        ]}>
        the HUB
      </Text>
      <Text style={[styles.brandSubtitle, { color: palette.inverseMuted }]}>by Chapter</Text>
    </View>
  );
}

export default function HubShell({
  section,
  title,
  subtitle,
  eyebrow,
  actions = [],
  children,
}: HubShellProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const [menuVisible, setMenuVisible] = useState(false);
  const showSidebar = width >= 900;

  const activeItem = useMemo(
    () => NAV_ITEMS.find((item) => item.key === section) ?? NAV_ITEMS[0],
    [section]
  );

  const handleNavigate = (route: Href) => {
    setMenuVisible(false);
    router.replace(route);
  };

  const navigation = (
    <View
      style={[
        styles.sidebar,
        {
          backgroundColor: palette.ink,
          borderColor: palette.borderStrong,
        },
      ]}>
      <View style={styles.sidebarTop}>
        <BrandLockup palette={palette} />
        <View
          style={[
            styles.workspaceBadge,
            {
              backgroundColor: palette.inkSoft,
              borderColor: palette.inkBorder,
            },
          ]}>
          <Text style={[styles.workspaceLabel, { color: palette.inverseMuted }]}>Workspace</Text>
          <Text style={[styles.workspaceValue, { color: palette.inverseText }]}>Media Hub</Text>
        </View>
      </View>

      <View style={styles.navSection}>
        <Text style={[styles.navHeading, { color: palette.inverseMuted }]}>Navigate</Text>
        {NAV_ITEMS.map((item) => {
          const active = item.key === section;
          return (
            <Pressable
              key={item.key}
              onPress={() => handleNavigate(item.route)}
              style={[
                styles.navItem,
                active && {
                  backgroundColor: palette.inkSoft,
                  borderColor: palette.accent,
                },
              ]}>
              <View
                style={[
                  styles.navIconWrap,
                  {
                    backgroundColor: active ? palette.accent : palette.inkBorder,
                  },
                ]}>
                <SymbolIcon name={item.icon} tintColor={palette.ink} />
              </View>
              <View style={styles.navTextWrap}>
                <View style={styles.navLabelRow}>
                  <Text style={[styles.navLabel, { color: palette.inverseText }]}>{item.label}</Text>
                  {item.key === 'voice' ? (
                    <View
                      style={[
                        styles.voiceBuildTag,
                        {
                          borderColor: palette.inkBorder,
                          backgroundColor: palette.inkSoft,
                        },
                      ]}>
                      <Text style={[styles.voiceBuildTagText, { color: palette.inverseMuted }]}>
                        {VOICE_MENU_BUILD_LABEL}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.navDetail, { color: palette.inverseMuted }]}>{item.detail}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View
        style={[
          styles.userCard,
          {
            backgroundColor: palette.inkSoft,
            borderColor: palette.inkBorder,
          },
        ]}>
        <Text style={[styles.userEyebrow, { color: palette.inverseMuted }]}>Design pattern</Text>
        <Text style={[styles.userTitle, { color: palette.inverseText }]}>Chapter Hub mobile</Text>
        <Text style={[styles.userDetail, { color: palette.inverseMuted }]}>
          Branded shell, module navigation, and focused content cards.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['top', 'left', 'right']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.root}>
        {showSidebar ? (
          navigation
        ) : (
          <>
            <View style={[styles.mobileHeader, { backgroundColor: palette.ink }]}>
              <Pressable
                accessibilityLabel="Open navigation"
                onPress={() => setMenuVisible(true)}
                style={[styles.mobileMenuButton, { borderColor: palette.inkBorder }]}>
                <SymbolIcon name="line.3.horizontal" tintColor={palette.inverseText} />
              </Pressable>
              <BrandLockup palette={palette} compact />
              <View
                style={[
                  styles.mobileSectionBadge,
                  {
                    backgroundColor: palette.inkSoft,
                    borderColor: palette.inkBorder,
                  },
                ]}>
                <View style={styles.mobileSectionRow}>
                  <Text style={[styles.mobileSectionText, { color: palette.inverseText }]}>
                    {activeItem.label}
                  </Text>
                  {activeItem.key === 'voice' ? (
                    <View
                      style={[
                        styles.voiceBuildTag,
                        styles.voiceBuildTagCompact,
                        {
                          borderColor: palette.inkBorder,
                          backgroundColor: palette.inkSoft,
                        },
                      ]}>
                      <Text style={[styles.voiceBuildTagText, { color: palette.inverseMuted }]}>
                        {VOICE_MENU_BUILD_LABEL}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            <Modal
              animationType="slide"
              transparent
              visible={menuVisible}
              onRequestClose={() => setMenuVisible(false)}>
              <View style={styles.modalRoot}>
                <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)} />
                <View style={[styles.drawerWrap, { backgroundColor: palette.ink }]}>
                  {navigation}
                </View>
              </View>
            </Modal>
          </>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.contentScroll}>
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                shadowColor: palette.shadow,
              },
            ]}>
            <Text style={[styles.heroEyebrow, { color: palette.muted }]}>{eyebrow}</Text>
            <View style={styles.heroTitleRow}>
              <Text style={[styles.heroTitle, { color: palette.text }]}>{title}</Text>
              {section === 'voice' ? (
                <View
                  style={[
                    styles.voiceBuildTagHero,
                    {
                      borderColor: palette.border,
                      backgroundColor: palette.paper,
                    },
                  ]}>
                  <Text style={[styles.voiceBuildTagHeroText, { color: palette.muted }]}>
                    {VOICE_MENU_BUILD_LABEL}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.heroSubtitle, { color: palette.muted }]}>{subtitle}</Text>

            {actions.length > 0 && (
              <View style={styles.actionRow}>
                {actions.map((action) => {
                  const selected = action.route === activeItem.route;
                  return (
                    <Pressable
                      key={String(action.route)}
                      onPress={() => handleNavigate(action.route)}
                      style={[
                        styles.actionChip,
                        {
                          backgroundColor: selected ? palette.ink : palette.paper,
                          borderColor: selected ? palette.ink : palette.border,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.actionChipLabel,
                          {
                            color: selected ? palette.inverseText : palette.text,
                          },
                        ]}>
                        {action.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.body}>{children}</View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 286,
    padding: 24,
    borderRightWidth: 1,
    justifyContent: 'space-between',
  },
  sidebarTop: {
    gap: 24,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
  },
  workspaceBadge: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  workspaceLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  workspaceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  navSection: {
    flex: 1,
    marginTop: 28,
    gap: 12,
  },
  navHeading: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 14,
  },
  navIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextWrap: {
    flex: 1,
    gap: 2,
  },
  navLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  voiceBuildTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  voiceBuildTagCompact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  voiceBuildTagText: {
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.3,
  },
  voiceBuildTagHero: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
  },
  voiceBuildTagHeroText: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.4,
  },
  navDetail: {
    fontSize: 13,
    lineHeight: 18,
  },
  userCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  userEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  userTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  userDetail: {
    fontSize: 13,
    lineHeight: 18,
  },
  mobileHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  mobileMenuButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileSectionBadge: {
    minWidth: 80,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  mobileSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  mobileSectionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 31, 32, 0.42)',
  },
  drawerWrap: {
    width: 300,
    paddingTop: 12,
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 108,
    gap: 20,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 3,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    flexShrink: 1,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  actionChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionChipLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  body: {
    gap: 16,
  },
});
