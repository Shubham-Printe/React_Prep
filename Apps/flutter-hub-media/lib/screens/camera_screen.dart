import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:video_player/video_player.dart';

import '../theme/hub_palette.dart';
import '../widgets/hub_card.dart';

class CaptureItem {
  CaptureItem({required this.path, required this.isVideo});

  final String path;
  final bool isVideo;
}

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  final ImagePicker _picker = ImagePicker();
  final List<CaptureItem> _items = [];
  int _selectedIndex = 0;
  VideoPlayerController? _videoCtrl;
  bool _loading = false;

  @override
  void dispose() {
    _videoCtrl?.dispose();
    super.dispose();
  }

  Future<void> _ensureCamera() async {
    final c = await Permission.camera.request();
    if (!c.isGranted && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Camera permission is required.')),
      );
    }
    return;
  }

  Future<void> _ensureMic() async {
    await Permission.microphone.request();
  }

  Future<void> _takePhoto() async {
    await _ensureCamera();
    if (!await Permission.camera.isGranted) return;
    setState(() => _loading = true);
    try {
      final x = await _picker.pickImage(source: ImageSource.camera, imageQuality: 100);
      if (x != null && mounted) {
        setState(() {
          _items.insert(0, CaptureItem(path: x.path, isVideo: false));
          _selectedIndex = 0;
        });
        _syncVideoController();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Camera error: $e')));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _takeVideo() async {
    await _ensureCamera();
    await _ensureMic();
    if (!await Permission.camera.isGranted) return;
    setState(() => _loading = true);
    try {
      final x = await _picker.pickVideo(source: ImageSource.camera, maxDuration: const Duration(seconds: 60));
      if (x != null && mounted) {
        setState(() {
          _items.insert(0, CaptureItem(path: x.path, isVideo: true));
          _selectedIndex = 0;
        });
        _syncVideoController();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Camera error: $e')));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _syncVideoController() async {
    await _videoCtrl?.dispose();
    _videoCtrl = null;
    if (_items.isEmpty) return;
    final sel = _items[_selectedIndex];
    if (!sel.isVideo) {
      if (mounted) setState(() {});
      return;
    }
    final ctrl = VideoPlayerController.file(File(sel.path));
    try {
      await ctrl.initialize();
      ctrl.addListener(() {
        if (mounted) setState(() {});
      });
      if (mounted) {
        setState(() => _videoCtrl = ctrl);
      } else {
        await ctrl.dispose();
      }
    } catch (e) {
      await ctrl.dispose();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Video load failed: $e')));
      }
    }
  }

  void _select(int i) {
    setState(() => _selectedIndex = i);
    _syncVideoController();
  }

  @override
  Widget build(BuildContext context) {
    final palette = HubPalette.of(context);
    final previewBg = Theme.of(context).brightness == Brightness.dark ? palette.ink : const Color(0xFF0d0c0c);
    final hasItems = _items.isNotEmpty;
    final selected = hasItems ? _items[_selectedIndex] : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        HubCard(
          palette: palette,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('CAPTURE ACTIONS', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
              Text('Open the native camera', style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
              Text(
                'Photos use the system camera. Videos request the microphone when needed for audio.',
                style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
              ),
              const SizedBox(height: 8),
              FilledButton(
                onPressed: _loading ? null : _takePhoto,
                style: FilledButton.styleFrom(
                  backgroundColor: palette.tint,
                  foregroundColor: palette.inverseText,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                ),
                child: Text(_loading ? 'Opening...' : 'Take photo', style: const TextStyle(fontWeight: FontWeight.w600)),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: _loading ? null : _takeVideo,
                style: OutlinedButton.styleFrom(
                  foregroundColor: palette.tint,
                  side: BorderSide(color: palette.tint, width: 2),
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                ),
                child: Text(_loading ? 'Opening...' : 'Record video', style: const TextStyle(fontWeight: FontWeight.w600)),
              ),
            ],
          ),
        ),
        if (hasItems && selected != null) ...[
          HubCard(
            palette: palette,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('PREVIEW', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
                Text('In-app viewer', style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
                Text(
                  'Videos use native controls. Tap a thumbnail below to switch.',
                  style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: ColoredBox(
                    color: previewBg,
                    child: selected.isVideo
                        ? (_videoCtrl != null && _videoCtrl!.value.isInitialized
                            ? Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  AspectRatio(
                                    aspectRatio: _videoCtrl!.value.aspectRatio == 0 ? 16 / 9 : _videoCtrl!.value.aspectRatio,
                                    child: VideoPlayer(_videoCtrl!),
                                  ),
                                  VideoProgressIndicator(
                                    _videoCtrl!,
                                    allowScrubbing: true,
                                    colors: VideoProgressColors(playedColor: palette.tint, bufferedColor: palette.border),
                                  ),
                                  IconButton(
                                    iconSize: 48,
                                    icon: Icon(
                                      _videoCtrl!.value.isPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled,
                                      color: palette.tint,
                                    ),
                                    onPressed: () {
                                      setState(() {
                                        _videoCtrl!.value.isPlaying ? _videoCtrl!.pause() : _videoCtrl!.play();
                                      });
                                    },
                                  ),
                                ],
                              )
                            : const Padding(
                                padding: EdgeInsets.all(48),
                                child: Center(child: CircularProgressIndicator()),
                              ))
                        : Image.file(
                            File(selected.path),
                            fit: BoxFit.contain,
                            width: double.infinity,
                          ),
                  ),
                ),
              ],
            ),
          ),
        ],
        HubCard(
          palette: palette,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('RECENT MEDIA', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
              Text(hasItems ? 'Captured (${_items.length})' : 'No captures yet', style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
              Text(
                hasItems ? 'Tap a thumbnail to update the preview above.' : 'Use the buttons above to capture.',
                style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
              ),
              if (hasItems) ...[
                const SizedBox(height: 12),
                SizedBox(
                  height: 120,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _items.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 12),
                    itemBuilder: (context, i) {
                      final it = _items[i];
                      final sel = i == _selectedIndex;
                      return GestureDetector(
                        onTap: () => _select(i),
                        child: Container(
                          width: 120,
                          decoration: BoxDecoration(
                            color: palette.paper,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: sel ? palette.tint : palette.border, width: sel ? 3 : 1),
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: it.isVideo
                              ? Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.play_circle_outline, color: palette.tint, size: 36),
                                    Text('Video', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w600)),
                                  ],
                                )
                              : Image.file(File(it.path), fit: BoxFit.cover),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ],
          ),
        ),
        HubCard(
          palette: palette,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('WORKFLOW', style: TextStyle(color: palette.muted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1)),
              Text('Native capability', style: TextStyle(color: palette.text, fontSize: 24, fontWeight: FontWeight.w800)),
              Text(
                'image_picker opens the real iOS camera UI. Preview uses Image + video_player — no WebView.',
                style: TextStyle(color: palette.muted, fontSize: 15, height: 1.45),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
