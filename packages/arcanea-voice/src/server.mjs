/**
 * @arcanea/voice — Local JARVIS-mode server
 *
 * Zero-dep Node HTTP server that:
 *   - Serves the orb room (web/*)
 *   - POST /api/converse?persona=X  → audio body → transcript → LLM → TTS stream
 *   - GET /api/health                → key availability + persona list
 *
 * Runs on localhost. All data stays on-device. No sign-in, no analytics.
 */

import { createServer } from 'http';
import { createReadStream, existsSync, statSync, writeFileSync, unlinkSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, extname, resolve, dirname, normalize } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

import { transcribe, getKey } from './transcribe.mjs';
import { resolvePersona, PERSONAS } from './persona.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, '..', 'web');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const VOICE_MAP = {
  lumina:   { eleven: 'pFZP5JQG7iQjIQuC4Bku', groq: 'Celeste-PlayAI' },
  coach:    { eleven: 'EXAVITQu4vr4xnSDxMaL', groq: 'Arista-PlayAI' },
  draconia: { eleven: null,                   groq: 'Atlas-PlayAI' },
  shinkami: { eleven: null,                   groq: 'Thunder-PlayAI' },
};

const LLM_MODEL = process.env.ARCANEA_VOICE_LLM || 'llama-3.3-70b-versatile';
const TTS_MODEL_GROQ = process.env.ARCANEA_VOICE_TTS || 'playai-tts';
const TTS_MODEL_ELEVEN = process.env.ARCANEA_VOICE_ELEVEN_MODEL || 'eleven_turbo_v2_5';

// ---------------------------------------------------------------------------
// Static file serving (safe path resolution)
// ---------------------------------------------------------------------------

async function serveStatic(req, res) {
  const urlPath = req.url.split('?')[0];
  const rel = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = normalize(join(WEB_ROOT, rel));
  if (!filePath.startsWith(WEB_ROOT)) {
    res.writeHead(403); res.end('forbidden'); return;
  }
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404); res.end('not found'); return;
  }
  const mime = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {
    'content-type': mime,
    'cache-control': 'no-cache',
    'cross-origin-opener-policy': 'same-origin',
  });
  createReadStream(filePath).pipe(res);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readRawBody(req, maxBytes = 20 * 1024 * 1024) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (c) => {
      total += c.length;
      if (total > maxBytes) {
        req.destroy();
        reject(new Error('body too large'));
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolvePromise(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function json(res, code, obj) {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(obj));
}

async function callGroqChat(prompt, userText, temperature = 0.5) {
  const key = getKey('GROQ_API_KEY');
  if (!key) return null;
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: LLM_MODEL,
      temperature,
      max_tokens: 260,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userText },
      ],
    }),
  });
  if (!r.ok) return null;
  const j = await r.json().catch(() => null);
  return j?.choices?.[0]?.message?.content?.trim() || null;
}

async function synthesizeElevenLabs(text, voiceId) {
  const key = getKey('ELEVENLABS_API_KEY');
  if (!key || !voiceId) return null;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: {
      'xi-api-key': key,
      'content-type': 'application/json',
      'accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: TTS_MODEL_ELEVEN,
      voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true },
    }),
  });
  if (!r.ok || !r.body) return null;
  return { body: r.body, mime: 'audio/mpeg' };
}

async function synthesizeGroq(text, voiceName) {
  const key = getKey('GROQ_API_KEY');
  if (!key || !voiceName) return null;
  const r = await fetch('https://api.groq.com/openai/v1/audio/speech', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: TTS_MODEL_GROQ,
      input: text,
      voice: voiceName,
      response_format: 'wav',
    }),
  });
  if (!r.ok || !r.body) return null;
  return { body: r.body, mime: 'audio/wav' };
}

async function synthesizeEdge(text) {
  try {
    const out = join(tmpdir(), `arcanea_tts_${Date.now()}.mp3`);
    const r = spawnSync('edge-tts', ['--voice', 'en-GB-SoniaNeural', '--text', text, '--write-media', out], {
      timeout: 15000, stdio: 'pipe',
    });
    if (r.status === 0 && existsSync(out) && statSync(out).size > 500) {
      const buf = await readFile(out);
      try { unlinkSync(out); } catch {}
      return { body: buf, mime: 'audio/mpeg' };
    }
  } catch {}
  return null;
}

async function synthesize(text, persona) {
  const voice = VOICE_MAP[persona.voice] || VOICE_MAP.lumina;
  return (
    (await synthesizeElevenLabs(text, voice.eleven)) ||
    (await synthesizeGroq(text, voice.groq)) ||
    (await synthesizeEdge(text))
  );
}

// ---------------------------------------------------------------------------
// /api/converse — the full voice loop
// ---------------------------------------------------------------------------

async function handleConverse(req, res) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const persona = resolvePersona(u.searchParams.get('persona'));
  const ext = (u.searchParams.get('ext') || 'webm').replace(/[^a-z0-9]/gi, '').slice(0, 5) || 'webm';
  const stashName = `arcanea_mic_${Date.now()}.${ext}`;
  const stash = join(tmpdir(), stashName);

  let buf;
  try {
    buf = await readRawBody(req);
  } catch (e) {
    json(res, 413, { error: e.message });
    return;
  }
  if (!buf.length) { json(res, 400, { error: 'empty body' }); return; }

  try {
    writeFileSync(stash, buf);
  } catch (e) {
    json(res, 500, { error: 'disk write failed' });
    return;
  }

  const stt = transcribe(stash);
  try { unlinkSync(stash); } catch {}
  if (!stt?.text) { json(res, 502, { error: 'transcription failed — check GROQ_API_KEY or install whisper' }); return; }

  const reply = await callGroqChat(persona.prompt, stt.text, persona.temperature);
  if (!reply) { json(res, 502, { error: 'LLM unavailable — check GROQ_API_KEY' }); return; }

  const audio = await synthesize(reply, persona);
  if (!audio) { json(res, 502, { error: 'TTS unavailable — no working voice backend' }); return; }

  res.writeHead(200, {
    'content-type': audio.mime,
    'x-voice-transcript': encodeURIComponent(stt.text),
    'x-voice-reply': encodeURIComponent(reply),
    'x-voice-persona': persona.name,
    'access-control-expose-headers': 'x-voice-transcript,x-voice-reply,x-voice-persona',
  });

  if (Buffer.isBuffer(audio.body)) {
    res.end(audio.body);
  } else {
    const reader = audio.body.getReader();
    const pump = async () => {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          res.write(Buffer.from(value));
        }
      } catch {}
      res.end();
    };
    pump();
  }
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

export function startServer({ port = 7777, host = '127.0.0.1', onReady } = {}) {
  const server = createServer(async (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('access-control-allow-headers', 'content-type');
    res.setHeader('access-control-allow-methods', 'GET,POST,OPTIONS');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const u = new URL(req.url, `http://${req.headers.host}`);
    if (u.pathname === '/api/health') {
      json(res, 200, {
        ok: true,
        groq: !!getKey('GROQ_API_KEY'),
        eleven: !!getKey('ELEVENLABS_API_KEY'),
        personas: Object.keys(PERSONAS),
      });
      return;
    }
    if (u.pathname === '/api/converse' && req.method === 'POST') {
      try { await handleConverse(req, res); } catch (e) {
        if (!res.headersSent) json(res, 500, { error: String(e?.message || e) });
      }
      return;
    }
    await serveStatic(req, res);
  });

  server.listen(port, host, () => {
    onReady?.({ url: `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}` });
  });
  return server;
}
