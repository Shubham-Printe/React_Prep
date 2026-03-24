import 'dart:async';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:record/record.dart';

import '../theme/hub_palette.dart';
import '../widgets/hub_card.dart';

class VoiceClip {
  VoiceClip({required this.id, required this.path, required this.durationSec});

  final String id;
  final String path;
  final int durationSec;
}

class VoiceScreen extends StatefulWidget {
  const VoiceScreen({super.key});

  @override
  State<VoiceScreen> createState() => _VoiceScreenState();
}

class _VoiceScreenState extends State<VoiceScreen> with SingleTickerProviderStateMixin {
  final AudioRecorder _recorder = AudioRecorder();
  final AudioPlayer _player = AudioPlayer();

  bool _checkingPermission = true;
  bool _micGranted = false;
  bool _isRecording = false;
  bool _isStarting = false;
  bool _isPlaying = false;
  int _elapsedSec = 0;
  Timer? _tick;
  late final AnimationController _pulse;

  final List<VoiceClip> _clips = [];
  String? _selectedId;
  @override
  void initState() {
    super.initState();
    _pulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat(reverse: true);
    _pulse.stop();
    _checkMic();
    _player.onPlayerComplete.listen((_) {
      if (mounted) setState(() => _isPlaying = false);
    });
  }

  Future<void> _checkMic() async {
    final s = await Permission.microphone.request();
    setState(() {
      _checkingPermission = false;
      _micGranted = s.isGranted;
    });
  }

  @override
  void dispose() {
    _tick?.cancel();
    _recorder.dispose();
    _player.dispose();
    _pulse.dispose();
    super.dispose();
  }

  String _fmt(int sec) {
    final m = sec ~/ 60;
    final s = sec % 60;
    return '$m:${s.toString().padLeft(2, '0')}';
  }

  Future<void> _start() async {
    if (!_micGranted || _isRecording || _isStarting) return;
    setState(() => _isStarting = true);
    try {
      if (!await _recorder.hasPermission()) {
        await _checkMic();
        if (!_micGranted) return;
      }
      final dir = await getTemporaryDirectory();
      final filePath = p.join(dir.path, 'voice_${DateTime.now().millisecondsSinceEpoch}.m4a');
      await _recorder.start(const RecordConfig(encoder: AudioEncoder.aacLc), path: filePath);
      setState(() {
        _isRecording = true;
        _elapsedSec = 0;
      });
      _pulse.repeat(reverse: true);
      _tick = Timer.periodic(const Duration(seconds: 1), (_) {
        if (mounted) setState(() => _elapsedSec++);
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Recording failed: $e')));
      }
    } finally {
      if (mounted) setState(() => _isStarting = false);
    }
  }

  Future<void> _stop() async {
    if (!_isRecording) return;
    final durationAtStop = _elapsedSec;
    _tick?.cancel();
    _tick = null;
    _pulse.stop();
    _pulse.reset();
    try {
      final path = await _recorder.stop();
      setState(() => _isRecording = false);
      if (path != null && path.isNotEmpty) {
        final id = 'clip-${DateTime.now().millisecondsSinceEpoch}';
        setState(() {
          _clips.insert(0, VoiceClip(id: id, path: path, durationSec: durationAtStop));
          _selectedId = id;
        });
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('No audio file was saved. Try recording for at least a second.')),
          );
        }
      }
    } catch (e) {
      setState(() => _isRecording = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Stop failed: $e')));
      }
    }
  }

  Future<void> _play(VoiceClip clip) async {
    try {
      await _player.stop();
      setState(() => _isPlaying = true);
      await _player.play(DeviceFileSource(clip.path));
    } catch (e) {
      setState(() => _isPlaying = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Playback failed: $e')));
      }
    }
  }

  void _removeSelected() {
    final id = _selectedId;
    if (id == null) return;
    setState(() {
      _clips.removeWhere((c) => c.id == id);
      _selectedId = _clips.isEmpty ? null : _clips.first.id;
    });
    _player.stop();
    setState(() => _isPlaying = false);
  }

  Future<void> _recordAnother() async {
    await _start();
  }

  VoiceClip? get _selectedClip {
    if (_selectedId == null) return null;
    for (final c in _clips) {
      if (c.id == _selectedId) return c;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final palette = HubPalette.of(context);
    final hasClips = _clips.isNotEmpty;
    final selected = _selectedClip;

    if (_checkingPermission) {
      return HubCard(
        palette: palette,
        child: Column(
          children: [
            CircularProgressIndicator(color: palette.tint),
            const SizedBox(height: 16),
            Text('Checking microphone...', style: TextStyle(color: palette.text)),
          ],
        ),
      );
    }

    if (!_micGranted) {
      return HubCard(
        palette: palette,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Microphone access is required. Enable it in Settings for this app, then tap Try again.',
              style: TextStyle(color: palette.text, fontSize: 16, height: 1.45),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () async {
                setState(() => _checkingPermission = true);
                await _checkMic();
              },
              style: FilledButton.styleFrom(
                backgroundColor: palette.tint,
                foregroundColor: palette.inverseText,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Try again', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
            const SizedBox(height: 10),
            OutlinedButton(
              onPressed: () => openAppSettings(),
              style: OutlinedButton.styleFrom(
                foregroundColor: palette.tint,
                side: BorderSide(color: palette.tint, width: 2),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Open Settings', style: TextStyle(fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        HubCard(
          palette: palette,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('STATUS', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
              Text(
                _isRecording
                    ? 'Recording'
                    : hasClips
                        ? '${_clips.length} clip${_clips.length == 1 ? '' : 's'} saved'
                        : 'Ready to record',
                style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 8),
              Text(
                _isRecording
                    ? 'Microphone is on. Tap Stop when you are done — the clip appears in “Your clips”.'
                    : !hasClips
                        ? 'Tap Start recording, speak, then Stop recording.'
                        : selected != null
                            ? 'Selected: ${_fmt(selected.durationSec)}. Play to hear it, or remove it from the list.'
                            : 'Select a clip below.',
                style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
              ),
            ],
          ),
        ),
        HubCard(
          palette: palette,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('RECORDER', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
              const SizedBox(height: 8),
              if (!_isRecording && !hasClips)
                FilledButton(
                  onPressed: _isStarting ? null : _start,
                  style: FilledButton.styleFrom(
                    backgroundColor: palette.tint,
                    foregroundColor: palette.inverseText,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  ),
                  child: _isStarting
                      ? SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2, color: palette.inverseText))
                      : const Text('Start recording', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                ),
              if (_isRecording) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    FadeTransition(
                      opacity: Tween(begin: 0.35, end: 1.0).animate(_pulse),
                      child: Container(
                        width: 14,
                        height: 14,
                        decoration: BoxDecoration(color: palette.danger, shape: BoxShape.circle),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text('REC', style: TextStyle(color: palette.danger, fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 1)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(_fmt(_elapsedSec), textAlign: TextAlign.center, style: TextStyle(color: palette.text, fontSize: 48, fontWeight: FontWeight.w200)),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: _stop,
                  style: FilledButton.styleFrom(
                    backgroundColor: palette.danger,
                    foregroundColor: palette.inverseText,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  ),
                  child: const Text('Stop recording', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                ),
              ],
              if (!_isRecording && hasClips) ...[
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: (_isPlaying || selected == null) ? null : () => _play(selected!),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: palette.tint,
                          side: BorderSide(color: palette.tint, width: 2),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: Text(_isPlaying ? 'Playing...' : 'Play', style: const TextStyle(fontWeight: FontWeight.w600)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: selected == null ? null : _removeSelected,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: palette.text,
                          side: BorderSide(color: palette.borderStrong, width: 2),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: const Text('Remove', style: TextStyle(fontWeight: FontWeight.w600)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                OutlinedButton(
                  onPressed: _recordAnother,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: palette.tint,
                    side: BorderSide(color: palette.tint, width: 2),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  ),
                  child: const Text('Record another', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ],
            ],
          ),
        ),
        if (hasClips)
          HubCard(
            palette: palette,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('YOUR CLIPS', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
                Text('This session', style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
                Text(
                  'Each stop adds a clip. Tap to select (border). Clips clear when you restart the app unless you add persistence later.',
                  style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 120,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _clips.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 12),
                    itemBuilder: (context, index) {
                      final clip = _clips[index];
                      final n = _clips.length - index;
                      final sel = clip.id == _selectedId;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedId = clip.id),
                        child: Container(
                          width: 112,
                          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
                          decoration: BoxDecoration(
                            color: palette.paper,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: sel ? palette.tint : palette.border, width: sel ? 3 : 1),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text('Voice $n', style: TextStyle(color: palette.text, fontSize: 13, fontWeight: FontWeight.w700)),
                              Text(_fmt(clip.durationSec), style: TextStyle(color: palette.muted, fontSize: 15, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        HubCard(
          palette: palette,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('WORKFLOW', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
              Text('Native audio', style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
              Text(
                'Uses the record package for capture and audioplayers for playback — same roles as expo-av in the RN app.',
                style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
