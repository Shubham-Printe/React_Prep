import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Image,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode, type AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import HubShell from '@/components/hub/HubShell';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type MediaItem = { uri: string; type: 'photo' | 'video' };

const PREVIEW_MAX_HEIGHT = Math.min(360, Dimensions.get('window').height * 0.36);

export default function CameraScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const tint = palette.tint;
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = media.length > 0 ? media[selectedIndex] : null;

  useEffect(() => {
    if (selectedIndex >= media.length && media.length > 0) {
      setSelectedIndex(media.length - 1);
    }
  }, [media.length, selectedIndex]);

  const requestPermissions = async (includeMicrophone = false) => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert(
        'Camera access',
        'Please allow camera access in Settings to take photos and videos.'
      );
      return false;
    }

    if (includeMicrophone) {
      const micPermission = await Audio.requestPermissionsAsync();
      if (micPermission.status !== 'granted') {
        Alert.alert(
          'Microphone access',
          'Please allow microphone access in Settings to record videos with audio.'
        );
        return false;
      }
    }

    return true;
  };

  const takePhoto = async () => {
    const ok = await requestPermissions();
    if (!ok) return;
    setLoading('photo');
    try {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        setMedia((prev) => [{ uri: result.assets[0].uri, type: 'photo' }, ...prev]);
        setSelectedIndex(0);
        if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      Alert.alert('Camera error', String(err));
    } finally {
      setLoading(null);
    }
  };

  const takeVideo = async () => {
    const ok = await requestPermissions(true);
    if (!ok) return;
    setLoading('video');
    try {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        videoMaxDuration: 60,
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        setMedia((prev) => [{ uri: result.assets[0].uri, type: 'video' }, ...prev]);
        setSelectedIndex(0);
        if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      Alert.alert('Camera error', String(err));
    } finally {
      setLoading(null);
    }
  };

  const onVideoPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded && 'error' in status && status.error) {
      Alert.alert('Video', `Could not play this clip: ${status.error}`);
    }
  }, []);

  const previewBg = colorScheme === 'dark' ? palette.ink : '#0d0c0c';

  return (
    <HubShell
      section="camera"
      eyebrow="Camera workspace"
      title="Photo and video capture"
      subtitle="Native iOS camera, then preview photos and play videos in-app. Tap a thumbnail to switch."
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
        <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Capture actions</Text>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Open the native camera</Text>
        <Text style={[styles.cardBody, { color: palette.muted }]}>
          Photos use the system camera. Videos request the microphone so clips can include audio.
        </Text>

        <View style={styles.buttons}>
          <Pressable
            onPress={takePhoto}
            disabled={!!loading}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: tint, opacity: loading || pressed ? 0.8 : 1 },
            ]}>
            <Text style={styles.primaryButtonLabel}>
              {loading === 'photo' ? 'Opening...' : 'Take photo'}
            </Text>
          </Pressable>
          <Pressable
            onPress={takeVideo}
            disabled={!!loading}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                borderWidth: 2,
                borderColor: tint,
                backgroundColor: 'transparent',
                opacity: loading || pressed ? 0.8 : 1,
              },
            ]}>
            <Text style={[styles.primaryButtonLabel, { color: tint }]}>
              {loading === 'video' ? 'Opening...' : 'Record video'}
            </Text>
          </Pressable>
        </View>
      </View>

      {media.length > 0 && selected && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              shadowColor: palette.shadow,
            },
          ]}>
          <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Preview</Text>
          <Text style={[styles.cardTitle, { color: palette.text }]}>In-app viewer</Text>
          <Text style={[styles.cardBody, { color: palette.muted }]}>
            Videos use native play/pause controls. Tap a thumbnail below to change what is shown.
          </Text>

          <View style={[styles.previewFrame, { backgroundColor: previewBg }]}>
            {selected.type === 'photo' ? (
              <Image
                source={{ uri: selected.uri }}
                style={styles.previewImage}
                resizeMode="contain"
                accessibilityLabel="Captured photo preview"
              />
            ) : (
              <Video
                key={selected.uri}
                source={{ uri: selected.uri }}
                style={styles.previewVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                onPlaybackStatusUpdate={onVideoPlaybackStatusUpdate}
                accessibilityLabel="Captured video preview"
              />
            )}
          </View>
        </View>
      )}

      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            shadowColor: palette.shadow,
          },
        ]}>
        <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Recent media</Text>
        <Text style={[styles.cardTitle, { color: palette.text }]}>
          {media.length > 0 ? `Captured (${media.length})` : 'No captures yet'}
        </Text>
        <Text style={[styles.cardBody, { color: palette.muted }]}>
          {media.length > 0
            ? 'Select a thumbnail to update the preview above.'
            : 'Use the actions above to capture; items appear here for this session.'}
        </Text>

        {media.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaScroll}>
            {media.map((item, i) => {
              const isSelected = i === selectedIndex;
              return (
                <Pressable
                  key={`${item.uri}-${i}`}
                  onPress={() => {
                    setSelectedIndex(i);
                    if (Platform.OS === 'ios') Haptics.selectionAsync();
                  }}
                  style={[
                    styles.mediaThumb,
                    {
                      backgroundColor: palette.paper,
                      borderColor: isSelected ? tint : palette.border,
                      borderWidth: isSelected ? 3 : 1,
                    },
                  ]}>
                  {item.type === 'photo' ? (
                    <Image source={{ uri: item.uri }} style={styles.thumbImage} />
                  ) : (
                    <View style={[styles.thumbImage, styles.videoThumbInner]}>
                      <Text style={[styles.playGlyph, { color: tint }]}>▶</Text>
                      <Text style={[styles.videoLabel, { color: palette.muted }]}>Video</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            shadowColor: palette.shadow,
          },
        ]}>
        <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Workflow</Text>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Native capability preserved</Text>
        <Text style={[styles.cardBody, { color: palette.muted }]}>
          Capture still uses expo-image-picker and the real camera UI. Preview uses expo-av Video for
          clips and Image for photos—no WebView.
        </Text>
      </View>
    </HubShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
    gap: 12,
  },
  cardEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 23,
  },
  buttons: {
    gap: 16,
    marginTop: 4,
  },
  primaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  previewFrame: {
    width: '100%',
    maxHeight: PREVIEW_MAX_HEIGHT,
    minHeight: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: PREVIEW_MAX_HEIGHT,
  },
  previewVideo: {
    width: '100%',
    height: PREVIEW_MAX_HEIGHT,
  },
  mediaScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 4,
  },
  mediaThumb: {
    width: 120,
    height: 120,
    borderRadius: 18,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  videoThumbInner: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  playGlyph: {
    fontSize: 28,
    opacity: 0.95,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  videoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
