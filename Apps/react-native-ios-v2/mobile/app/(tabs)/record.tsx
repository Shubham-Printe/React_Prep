import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import HubShell from '@/components/hub/HubShell';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { generateNoteFromClipUrisChronological } from '@/services/voiceAiNotes';

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type VoiceClip = {
  id: string;
  uri: string;
  durationSec: number;
};

export default function RecordScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const tint = palette.tint;
  const danger = palette.danger;

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [clips, setClips] = useState<VoiceClip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [aiNote, setAiNote] = useState<string | null>(null);
  /** Whisper output per clip — if this is wrong, the note will be wrong too. */
  const [aiTranscript, setAiTranscript] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const clipIdRef = useRef(0);

  const selectedClip = selectedClipId ? clips.find((c) => c.id === selectedClipId) ?? null : null;

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    })();
    return () => {
      if (recordingRef.current) {
        void recordingRef.current.stopAndUnloadAsync().catch(() => null);
        recordingRef.current = null;
      }
      if (soundRef.current) {
        void soundRef.current.unloadAsync().catch(() => null);
        soundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isRecording) return;
    setElapsedSec(0);
    const tick = setInterval(() => setElapsedSec((n) => n + 1), 1000);
    return () => clearInterval(tick);
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording, pulse]);

  useEffect(() => {
    if (clips.length === 0) {
      setAiNote(null);
      setAiTranscript(null);
      setAiError(null);
    }
  }, [clips.length]);

  /** iOS: playback after record needs recording mode off */
  const setModeForRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  };

  const setModeForPlayback = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  };

  const startRecording = async () => {
    if (permissionGranted !== true) {
      Alert.alert('Microphone access', 'Please allow microphone access in Settings to record.');
      return;
    }
    if (isRecording || isStarting) return;

    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        /* ignore */
      }
      soundRef.current = null;
    }
    setIsPlaying(false);

    setIsStarting(true);
    try {
      await setModeForRecording();
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = newRecording;
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Recording failed', String(err));
    } finally {
      setIsStarting(false);
    }
  };

  const stopRecording = async () => {
    const active = recordingRef.current ?? recording;
    if (!active) return;

    const durationAtStop = elapsedSec;

    try {
      if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // URI is only valid *after* stopAndUnloadAsync (expo-av sets _uri during cleanup)
      await active.stopAndUnloadAsync();
      const uri = active.getURI();

      recordingRef.current = null;
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        clipIdRef.current += 1;
        const id = `clip-${clipIdRef.current}-${Date.now()}`;
        const newClip: VoiceClip = { id, uri, durationSec: Math.max(0, durationAtStop) };
        setClips((prev) => [newClip, ...prev]);
        setSelectedClipId(id);
        await setModeForPlayback();
      } else {
        Alert.alert(
          'Recording',
          'Could not read the recorded file. Try recording for at least one second and stop again.'
        );
      }
    } catch (err) {
      Alert.alert('Stop failed', String(err));
      recordingRef.current = null;
      setRecording(null);
      setIsRecording(false);
    }
  };

  const playClip = async (clip: VoiceClip) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      await setModeForPlayback();
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: clip.uri }, { shouldPlay: true });
      soundRef.current = newSound;
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          soundRef.current = null;
          void newSound.unloadAsync();
        }
      });
    } catch (err) {
      Alert.alert('Playback failed', String(err));
      setIsPlaying(false);
    }
  };

  const discardSelectedClip = () => {
    if (!selectedClipId) return;
    if (soundRef.current) {
      void soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setClips((prev) => {
      const next = prev.filter((c) => c.id !== selectedClipId);
      setSelectedClipId(next[0]?.id ?? null);
      return next;
    });
    if (Platform.OS === 'ios') Haptics.selectionAsync();
  };

  const recordNew = async () => {
    await startRecording();
  };

  const generateAiNote = async () => {
    if (clips.length === 0 || isGeneratingNote) return;
    setAiError(null);
    setIsGeneratingNote(true);
    try {
      const oldestFirst = [...clips].reverse().map((c) => c.uri);
      const { note, segments } = await generateNoteFromClipUrisChronological(oldestFirst);
      setAiNote(note);
      setAiTranscript(
        segments.map((s) => `**${s.label}:** ${s.text.trim() || '(empty)'}`).join('\n\n')
      );
      if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setAiError(message);
      if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGeneratingNote(false);
    }
  };

  const shellActions = [
    { label: 'Dashboard', route: '/' },
    { label: 'Voice', route: '/record' },
    { label: 'Camera', route: '/camera' },
  ];

  const hasClips = clips.length > 0;
  const showIdleRecorder = !isRecording && !hasClips;

  if (permissionGranted === null) {
    return (
      <HubShell
        section="voice"
        eyebrow="Voice workspace"
        title="Voice capture"
        subtitle="Checking microphone access."
        actions={shellActions}>
        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border, shadowColor: palette.shadow },
          ]}>
          <ActivityIndicator size="large" color={tint} style={styles.loader} />
          <Text style={[styles.message, { color: palette.text }]}>Checking microphone access...</Text>
        </View>
      </HubShell>
    );
  }

  if (permissionGranted === false) {
    return (
      <HubShell
        section="voice"
        eyebrow="Voice workspace"
        title="Voice capture"
        subtitle="Microphone permission required."
        actions={shellActions}>
        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border, shadowColor: palette.shadow },
          ]}>
          <Text style={[styles.message, { color: palette.text }]}>
            Microphone access is required. Enable it in Settings → Expo Go (or this app) to continue.
          </Text>
        </View>
      </HubShell>
    );
  }

  return (
    <HubShell
      section="voice"
      eyebrow="Voice workspace"
      title="Voice capture"
      subtitle="Stop saves a clip to the list below. Tap a clip to select it, then Play. Generate an AI note from all clips when you are ready."
      actions={shellActions}>
      {Platform.OS === 'web' ? (
        <View
          style={[
            styles.card,
            styles.iphoneTestCard,
            {
              backgroundColor: palette.paper,
              borderColor: tint,
              shadowColor: palette.shadow,
            },
          ]}>
          <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Test on iPhone</Text>
          <Text style={[styles.cardTitle, { color: palette.text }]}>AI voice notes need Expo Go</Text>
          <Text style={[styles.cardBody, { color: palette.muted }]}>
            In the browser, Groq cannot be called from your machine (CORS). You do not need a backend: install{' '}
            <Text style={[styles.bold, { color: palette.text }]}>Expo Go</Text> on your iPhone, run{' '}
            <Text style={[styles.bold, { color: palette.text }]}>npx expo start -c</Text> on your Mac, scan the QR code
            (press <Text style={[styles.bold, { color: palette.text }]}>s</Text> for tunnel if LAN fails). Put{' '}
            <Text style={[styles.bold, { color: palette.text }]}>EXPO_PUBLIC_GROQ_API_KEY</Text> in{' '}
            <Text style={[styles.bold, { color: palette.text }]}>mobile/.env</Text>, then open Voice on the phone and use
            Generate AI note. See <Text style={[styles.bold, { color: palette.text }]}>IPHONE-SETUP.md</Text> for the full
            checklist (Part E = AI).
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            shadowColor: palette.shadow,
          },
        ]}>
        <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Status</Text>
        <Text style={[styles.cardTitle, { color: palette.text }]}>
          {isRecording ? 'Recording' : hasClips ? `${clips.length} clip${clips.length === 1 ? '' : 's'} saved` : 'Ready to record'}
        </Text>
        <Text style={[styles.cardBody, { color: palette.muted }]}>
          {isRecording && 'Microphone is on. Tap Stop when you are done—the clip appears in “Your clips”.'}
          {!isRecording && !hasClips && (
            <>
              Tap <Text style={[styles.bold, { color: palette.text }]}>Start recording</Text>, speak, then{' '}
              <Text style={[styles.bold, { color: palette.text }]}>Stop recording</Text>.
            </>
          )}
          {!isRecording && hasClips && selectedClip && (
            <>
              Selected: <Text style={{ fontVariant: ['tabular-nums'] }}>{formatDuration(selectedClip.durationSec)}</Text>.
              Play to hear it, or remove it from the list.
            </>
          )}
        </Text>
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
        <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Recorder</Text>

        {showIdleRecorder && (
          <Pressable
            onPress={startRecording}
            disabled={isStarting}
            style={({ pressed }) => [
              styles.startButton,
              { backgroundColor: tint, opacity: isStarting || pressed ? 0.85 : 1 },
            ]}>
            {isStarting ? (
              <ActivityIndicator color={palette.inverseText} />
            ) : (
              <Text style={[styles.startButtonLabel, { color: palette.inverseText }]}>Start recording</Text>
            )}
          </Pressable>
        )}

        {isRecording && (
          <View style={styles.recordingBlock}>
            <View style={[styles.recBadge, { borderColor: danger, backgroundColor: `${danger}18` }]}>
              <Animated.View style={[styles.recDot, { opacity: pulse, backgroundColor: danger }]} />
              <Text style={[styles.recText, { color: danger }]}>REC</Text>
            </View>
            <Text style={[styles.timer, { color: palette.text }]}>{formatDuration(elapsedSec)}</Text>
            <Pressable
              onPress={stopRecording}
              style={({ pressed }) => [styles.stopButton, { backgroundColor: danger, opacity: pressed ? 0.92 : 1 }]}>
              <Text style={[styles.stopButtonLabel, { color: palette.inverseText }]}>Stop recording</Text>
            </Pressable>
          </View>
        )}

        {!isRecording && hasClips && (
          <View style={styles.afterBlock}>
            <View style={styles.afterRow}>
              <Pressable
                onPress={() => selectedClip && playClip(selectedClip)}
                disabled={isPlaying || !selectedClip}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  { borderColor: tint, opacity: isPlaying || !selectedClip || pressed ? 0.7 : 1 },
                ]}>
                <Text style={[styles.secondaryButtonLabel, { color: tint }]}>
                  {isPlaying ? 'Playing...' : 'Play'}
                </Text>
              </Pressable>
              <Pressable
                onPress={discardSelectedClip}
                disabled={!selectedClip}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  { borderColor: palette.borderStrong, opacity: !selectedClip || pressed ? 0.5 : 1 },
                ]}>
                <Text style={[styles.secondaryButtonLabel, { color: palette.text }]}>Remove</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={recordNew}
              style={({ pressed }) => [
                styles.outlineButton,
                { borderColor: tint, opacity: pressed ? 0.85 : 1 },
              ]}>
              <Text style={[styles.outlineButtonLabel, { color: tint }]}>Record another</Text>
            </Pressable>
          </View>
        )}
      </View>

      {hasClips && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              shadowColor: palette.shadow,
            },
          ]}>
          <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Your clips</Text>
          <Text style={[styles.cardTitle, { color: palette.text }]}>This session</Text>
          <Text style={[styles.cardBody, { color: palette.muted }]}>
            Each stop adds a clip. Tap one to select (border highlights). Clips stay until you remove them or reload the app.
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.clipScroll}>
            {clips.map((clip, index) => {
              const isSelected = clip.id === selectedClipId;
              const label = `Voice ${clips.length - index}`;
              return (
                <Pressable
                  key={clip.id}
                  onPress={() => {
                    setSelectedClipId(clip.id);
                    if (Platform.OS === 'ios') Haptics.selectionAsync();
                  }}
                  style={[
                    styles.clipChip,
                    {
                      backgroundColor: palette.paper,
                      borderColor: isSelected ? tint : palette.border,
                      borderWidth: isSelected ? 3 : 1,
                    },
                  ]}>
                  <Text style={[styles.clipChipTitle, { color: palette.text }]} numberOfLines={1}>
                    {label}
                  </Text>
                  <Text style={[styles.clipChipDuration, { color: palette.muted }]}>
                    {formatDuration(clip.durationSec)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable
            onPress={generateAiNote}
            disabled={isGeneratingNote}
            style={({ pressed }) => [
              styles.aiNoteButton,
              {
                backgroundColor: tint,
                opacity: isGeneratingNote || pressed ? 0.88 : 1,
              },
            ]}>
            {isGeneratingNote ? (
              <ActivityIndicator color={palette.inverseText} />
            ) : (
              <Text style={[styles.aiNoteButtonLabel, { color: palette.inverseText }]}>
                Generate AI note from all clips
              </Text>
            )}
          </Pressable>
          {aiError ? (
            <Text style={[styles.aiError, { color: danger }]} selectable>
              {aiError}
            </Text>
          ) : null}
          {aiTranscript ? (
            <View style={styles.aiNoteWrap}>
              <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Transcript (Whisper)</Text>
              <Text style={[styles.aiTranscriptHint, { color: palette.muted }]}>
                If this does not match what you said, the note will be wrong—try a slightly longer, clearer take with
                less background noise.
              </Text>
              <ScrollView
                style={[styles.aiNoteScroll, styles.aiTranscriptScroll, { borderColor: palette.border }]}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled">
                <Text style={[styles.aiNoteText, { color: palette.text }]} selectable>
                  {aiTranscript}
                </Text>
              </ScrollView>
            </View>
          ) : null}
          {aiNote ? (
            <View style={styles.aiNoteWrap}>
              <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Generated note</Text>
              <ScrollView
                style={[styles.aiNoteScroll, { borderColor: palette.border }]}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled">
                <Text style={[styles.aiNoteText, { color: palette.text }]} selectable>
                  {aiNote}
                </Text>
              </ScrollView>
            </View>
          ) : null}
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
        <Text style={[styles.cardEyebrow, { color: palette.muted }]}>Workflow</Text>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Native audio</Text>
        <Text style={[styles.cardBody, { color: palette.muted }]}>
          After stop, the file URI is read from the recorder (required for clips to appear). Playback switches iOS audio
          mode so the speaker plays your clip reliably after recording. AI uses Groq Whisper + Llama; very short or
          quiet clips can mis-transcribe—check the Transcript block. Put EXPO_PUBLIC_GROQ_API_KEY in mobile/.env and
          restart with npx expo start -c.
        </Text>
      </View>
    </HubShell>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 8,
  },
  iphoneTestCard: {
    borderWidth: 2,
  },
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
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 23,
  },
  bold: {
    fontWeight: '700',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  startButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  recordingBlock: {
    alignItems: 'stretch',
    gap: 16,
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
  },
  recDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  recText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timer: {
    fontSize: 48,
    fontVariant: ['tabular-nums'],
    fontWeight: '200',
    textAlign: 'center',
  },
  stopButton: {
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
  },
  stopButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  afterBlock: {
    gap: 14,
  },
  afterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    minWidth: 140,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  outlineButton: {
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
  },
  outlineButtonLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  clipScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 4,
  },
  clipChip: {
    width: 112,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
    gap: 6,
  },
  clipChipTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  clipChipDuration: {
    fontSize: 15,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
  aiNoteButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  aiNoteButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  aiError: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiNoteWrap: {
    gap: 8,
    marginTop: 4,
  },
  aiTranscriptHint: {
    fontSize: 13,
    lineHeight: 19,
  },
  aiNoteScroll: {
    maxHeight: 320,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  aiTranscriptScroll: {
    maxHeight: 200,
  },
  aiNoteText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
