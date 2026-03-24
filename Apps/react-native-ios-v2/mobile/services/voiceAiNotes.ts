import Constants from 'expo-constants';
import {
  cacheDirectory,
  copyAsync,
  deleteAsync,
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import { Platform } from 'react-native';

/** Helps Whisper spell product terms; does not control topic (still can hallucinate on silence). */
const WHISPER_CONTEXT_PROMPT =
  'Software and mobile development voice memo. Terms: Expo, React Native, iOS, development build, production build, simulator, deploy, EAS, Xcode, JavaScript, TypeScript, Groq, API.';

const NOTE_SYSTEM_PROMPT = `You format automatic speech-to-text into Markdown. The transcript is often imperfect; Whisper sometimes hallucinates on short or quiet audio (e.g. fake "thank you" or a "meeting" that never happened).

STRICT RULES:
1) Do NOT invent content. Every line must reflect the transcript below. If the transcript does not mention a meeting, wrap-up, or gratitude, you must not write those.
2) If the user said one short instruction or phrase, the note stays short—no multi-section "meeting" write-up.
3) Use this structure:
   ## Title — from transcript only (use "Voice memo" if unclear)
   **What the transcript says** — 1–3 sentences, only paraphrasing/quoting the transcript.
   **Structured detail** — bullets only for distinct ideas actually present; skip fluff.
   **Action items** — only if the transcript implies tasks; otherwise exactly: None
4) You may lightly fix obvious ASR errors for technical terms if the sounds match (e.g. "death build" → "dev build").

If the transcript is empty or obviously nonsense, say the transcription likely failed and suggest re-recording with clearer speech and a few seconds of audio.`;

type Backend = 'groq' | 'openai';

type ResolvedBackend = {
  kind: Backend;
  apiKey: string;
  baseUrl: string;
  transcribeModel: string;
  chatModel: string;
};

function readExtra(): { openaiApiKey?: string; groqApiKey?: string } {
  return (Constants.expoConfig?.extra as { openaiApiKey?: string; groqApiKey?: string } | undefined) ?? {};
}

function resolveBackend(): ResolvedBackend | null {
  const extra = readExtra();
  const groqKey = (process.env.EXPO_PUBLIC_GROQ_API_KEY || extra.groqApiKey || '').trim();
  if (groqKey) {
    return {
      kind: 'groq',
      apiKey: groqKey,
      baseUrl: 'https://api.groq.com/openai/v1',
      // v3 is more accurate than turbo; better for short dev-style phrases (Groq docs).
      transcribeModel: 'whisper-large-v3',
      chatModel: 'llama-3.1-8b-instant',
    };
  }
  const openaiKey = (process.env.EXPO_PUBLIC_OPENAI_API_KEY || extra.openaiApiKey || '').trim();
  if (openaiKey) {
    return {
      kind: 'openai',
      apiKey: openaiKey,
      baseUrl: 'https://api.openai.com/v1',
      transcribeModel: 'whisper-1',
      chatModel: 'gpt-4o-mini',
    };
  }
  return null;
}

function mimeAndNameForUri(uri: string): { type: string; name: string } {
  const path = uri.split('?')[0] ?? '';
  const segment = path.split('/').pop()?.toLowerCase() ?? '';
  const lower = path.toLowerCase();
  const nameFromPath = segment.includes('.') ? segment : `recording.m4a`;

  if (lower.endsWith('.wav') || nameFromPath.endsWith('.wav')) return { type: 'audio/wav', name: nameFromPath };
  if (lower.endsWith('.caf') || nameFromPath.endsWith('.caf')) return { type: 'audio/x-caf', name: nameFromPath };
  if (lower.endsWith('.mp3') || nameFromPath.endsWith('.mp3')) return { type: 'audio/mpeg', name: nameFromPath };
  if (lower.endsWith('.mp4') || lower.endsWith('.m4a') || nameFromPath.endsWith('.m4a') || nameFromPath.endsWith('.mp4')) {
    return { type: 'audio/mp4', name: nameFromPath.endsWith('.mp4') || nameFromPath.endsWith('.m4a') ? nameFromPath : 'recording.m4a' };
  }
  return { type: 'audio/mp4', name: nameFromPath };
}

/**
 * React Native FormData only uploads files when the part is `{ uri, name?, type? }` (see RN FormData.js).
 * `fetch()` often does not attach those parts correctly; XMLHttpRequest is what RN's FormData is built for.
 */
function postMultipartForm(url: string, authorization: string, form: FormData): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText ?? '' });
    xhr.onerror = () => reject(new Error('Transcription upload failed (network).'));
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', authorization);
    // Do not set Content-Type — runtime must set multipart boundary.
    xhr.send(form as unknown as XMLHttpRequestBodyInit);
  });
}

function voiceUploadDebugEnabled(): boolean {
  return process.env.EXPO_PUBLIC_VOICE_UPLOAD_DEBUG === '1';
}

function isMissingMultipartFileError(status: number, message: string): boolean {
  if (status !== 400) return false;
  return (
    message.includes('must be provided') ||
    message.includes('file` or `url`') ||
    message.includes('"invalid_request_error"')
  );
}

async function assertReadableAudioFile(path: string, label: string): Promise<number> {
  const info = await getInfoAsync(path);
  if (!info.exists) {
    throw new Error(
      `Voice upload: ${label} file not found (${path.slice(-56)}). ` +
        (voiceUploadDebugEnabled() ? `full=${path}` : 'Set EXPO_PUBLIC_VOICE_UPLOAD_DEBUG=1 for full paths in errors.')
    );
  }
  const size = info.size ?? 0;
  if (size < 1) {
    throw new Error(`Voice upload: ${label} is 0 bytes.`);
  }
  return size;
}

/**
 * Browser: expo-av gives a `blob:` URL. Web FormData needs a real File/Blob — not `{ uri }` (that becomes [object Object]).
 * Note: Groq/OpenAI often block browser calls with CORS; if you see a network/CORS error, use iOS Simulator/device or a backend proxy.
 */
async function transcribeAudioFileWeb(
  endpointUrl: string,
  apiKey: string,
  model: string,
  uri: string,
  type: string,
  name: string
): Promise<string> {
  let blob: Blob;
  try {
    const r = await fetch(uri);
    if (!r.ok) {
      throw new Error(`Could not read recording in browser (HTTP ${r.status}). URI: ${uri.slice(0, 48)}…`);
    }
    blob = await r.blob();
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        'Could not read the recording in the browser (network or CORS). Voice AI calls from **Safari/Chrome on Mac** are often blocked by Groq/OpenAI (no CORS for API keys). Use **iOS Simulator** (`npx expo run:ios`) or **Expo Go on a phone**, or add a small server that forwards the audio.'
      );
    }
    throw e;
  }

  if (blob.size < 1) {
    throw new Error('Recording is empty in the browser (0 bytes). Try recording again or use the native app.');
  }

  const form = new FormData();
  if (typeof File !== 'undefined') {
    form.append('file', new File([blob], name, { type: blob.type || type }));
  } else {
    form.append('file', blob, name);
  }
  form.append('model', model);
  form.append('language', 'en');
  form.append('temperature', '0');
  form.append('prompt', WHISPER_CONTEXT_PROMPT);

  let res: Response;
  try {
    res = await fetch(endpointUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        'Transcription request failed from the browser (often **CORS**). Groq/OpenAI APIs are not meant to be called with a secret key from a web page. Use **iOS Simulator / device** or a **backend proxy**.'
      );
    }
    throw e;
  }

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Transcription failed (${res.status}): ${detail.slice(0, 400)}`);
  }
  const data = (await res.json()) as { text?: string };
  return (data.text ?? '').trim();
}

async function transcribeWithXhr(
  endpointUrl: string,
  apiKey: string,
  model: string,
  fileUri: string,
  type: string,
  name: string
): Promise<string> {
  const form = new FormData();
  // Some APIs expect the file part before other fields.
  form.append('file', { uri: fileUri, type, name });
  form.append('model', model);
  form.append('language', 'en');
  form.append('temperature', '0');
  form.append('prompt', WHISPER_CONTEXT_PROMPT);

  const { status, body } = await postMultipartForm(endpointUrl, `Bearer ${apiKey}`, form);
  if (status < 200 || status >= 300) {
    const hint =
      voiceUploadDebugEnabled() ? ` [debug: uriTail=${fileUri.slice(-64)} name=${name} type=${type}]` : '';
    throw new Error(`Transcription failed (${status}): ${body.slice(0, 400)}${hint}`);
  }
  try {
    const data = JSON.parse(body) as { text?: string };
    return (data.text ?? '').trim();
  } catch {
    throw new Error(`Transcription response was not JSON: ${body.slice(0, 200)}`);
  }
}

export function assertAiBackendConfigured(): void {
  if (!resolveBackend()) {
    throw new Error(
      'Add an API key in mobile/.env and restart Expo (npx expo start -c). For a free demo, use Groq: EXPO_PUBLIC_GROQ_API_KEY=gsk_... from https://console.groq.com/keys — or use EXPO_PUBLIC_OPENAI_API_KEY for OpenAI.'
    );
  }
}

export async function transcribeAudioFile(uri: string): Promise<string> {
  const cfg = resolveBackend();
  if (!cfg) {
    throw new Error('No AI API key configured.');
  }

  const { type, name } = mimeAndNameForUri(uri);
  const endpointUrl = `${cfg.baseUrl}/audio/transcriptions`;

  if (Platform.OS === 'web') {
    return transcribeAudioFileWeb(endpointUrl, cfg.apiKey, cfg.transcribeModel, uri, type, name);
  }

  const tempPaths: string[] = [];
  const cleanup = async () => {
    await Promise.all(tempPaths.map((p) => deleteAsync(p, { idempotent: true }).catch(() => null)));
  };

  let uploadUri = uri;
  if (cacheDirectory) {
    const copyPath = `${cacheDirectory}voice-transcribe-${Date.now()}-${name.replace(/\s/g, '_')}`;
    await copyAsync({ from: uri, to: copyPath });
    tempPaths.push(copyPath);
    uploadUri = copyPath;
  }

  await assertReadableAudioFile(uploadUri, 'recording copy');

  try {
    try {
      return await transcribeWithXhr(endpointUrl, cfg.apiKey, cfg.transcribeModel, uploadUri, type, name);
    } catch (firstErr) {
      const msg = firstErr instanceof Error ? firstErr.message : String(firstErr);
      const statusMatch = msg.match(/Transcription failed \((\d+)\):/);
      const status = statusMatch ? parseInt(statusMatch[1] ?? '0', 10) : 0;
      const dir = cacheDirectory;
      const canRehydrate = Boolean(dir) && isMissingMultipartFileError(status, msg);

      if (!canRehydrate || !dir) {
        throw firstErr;
      }

      // Re-write bytes via base64 so the file sits in a plain cache path (works around some RN upload quirks).
      const b64 = await readAsStringAsync(uploadUri, { encoding: 'base64' });
      const rehydrated = `${dir}voice-rehydrate-${Date.now()}-${name.replace(/\s/g, '_')}`;
      await writeAsStringAsync(rehydrated, b64, { encoding: 'base64' });
      tempPaths.push(rehydrated);
      await assertReadableAudioFile(rehydrated, 'rehydrated');

      return await transcribeWithXhr(endpointUrl, cfg.apiKey, cfg.transcribeModel, rehydrated, type, name);
    }
  } finally {
    await cleanup();
  }
}

export async function generateMarkdownNoteFromTranscripts(
  segments: { label: string; text: string }[]
): Promise<string> {
  const cfg = resolveBackend();
  if (!cfg) {
    throw new Error('No AI API key configured.');
  }

  const userContent = segments
    .map((s) => `### ${s.label}\n${s.text.length > 0 ? s.text : '(no speech detected)'}`)
    .join('\n\n');

  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: cfg.chatModel,
      temperature: 0.15,
      messages: [
        { role: 'system', content: NOTE_SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Note generation failed (${res.status}): ${detail.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const note = data.choices?.[0]?.message?.content?.trim();
  if (!note) {
    throw new Error('Empty response from the model.');
  }
  return note;
}

export type VoiceAiNoteResult = {
  note: string;
  /** Raw Whisper text per clip — compare to what you said to spot ASR/hallucination. */
  segments: { label: string; text: string }[];
};

/** Oldest clip first (chronological order). */
export async function generateNoteFromClipUrisChronological(
  urisOldestFirst: string[]
): Promise<VoiceAiNoteResult> {
  assertAiBackendConfigured();
  if (urisOldestFirst.length === 0) {
    throw new Error('No voice clips to process.');
  }

  const segments: { label: string; text: string }[] = [];
  for (let i = 0; i < urisOldestFirst.length; i += 1) {
    const uri = urisOldestFirst[i];
    if (!uri) continue;
    const text = await transcribeAudioFile(uri);
    segments.push({ label: `Voice segment ${i + 1}`, text });
  }

  const note = await generateMarkdownNoteFromTranscripts(segments);
  return { note, segments };
}

/** @deprecated Use assertAiBackendConfigured */
export function assertOpenAIKeyConfigured(): void {
  assertAiBackendConfigured();
}
