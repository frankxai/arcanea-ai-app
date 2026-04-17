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
import { TOOLS, executeTool, formatToolResult } from './tools.mjs';

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

// LLM choice: Groq llama-3.3-70b is the default because it pairs strong
// OpenAI-compatible function-calling with sub-second time-to-first-token —
// essential for voice UX (any delay past ~800ms starts to feel broken).
// Switch via `ARCANEA_VOICE_LLM` (e.g. moonshotai/kimi-k2-instruct,
// openai/gpt-oss-120b) if you want different trade-offs; all Groq models
// that expose the `tools` param will work without code changes.
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

async function callGroqChat(messages, temperature = 0.5, tools = null) {
  const key = getKey('GROQ_API_KEY');
  if (!key) return null;
  const body = {
    model: LLM_MODEL,
    temperature,
    max_tokens: 400,
    messages,
  };
  if (tools && tools.length) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) return null;
  const j = await r.json().catch(() => null);
  return j?.choices?.[0]?.message || null;
}

/**
 * Multi-round tool-calling loop.
 *
 * The model can chain tools across up to MAX_ROUNDS turns — e.g. shell_run
 * to inspect state, then file_write to apply a fix, then claude_code_launch
 * to hand off the rest. Hard caps stop runaway loops:
 *   - MAX_ROUNDS: how many times the model can respond with tool_calls
 *   - MAX_TOOL_CALLS: total executions across all rounds (batch-safety)
 *
 * Returns { reply, toolsUsed, toolResults, rounds }.
 */
const MAX_ROUNDS = 4;
const MAX_TOOL_CALLS = 8;

async function runLlmLoop(systemPrompt, userText, temperature = 0.5) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userText },
  ];
  const toolsUsed = [];
  const toolResults = [];
  let rounds = 0;
  let totalCalls = 0;
  let finalContent = '';

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const response = await callGroqChat(messages, temperature, TOOLS);
    if (!response) return null;
    rounds = round + 1;

    const toolCalls = Array.isArray(response.tool_calls) ? response.tool_calls : [];
    if (!toolCalls.length) {
      finalContent = (response.content || '').trim();
      break;
    }

    // Assistant turn with tool_calls (must be echoed back before role:tool messages)
    messages.push({
      role: 'assistant',
      content: response.content || '',
      tool_calls: toolCalls,
    });

    for (const call of toolCalls) {
      if (totalCalls >= MAX_TOOL_CALLS) {
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify({ error: 'tool-call budget exhausted for this turn' }),
        });
        continue;
      }
      const name = call?.function?.name;
      let args = {};
      try { args = JSON.parse(call?.function?.arguments || '{}'); } catch {}
      const result = await executeTool(name, args);
      toolsUsed.push(name);
      toolResults.push({ name, result });
      totalCalls++;
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: JSON.stringify(result).slice(0, 2000),
      });
    }

    // After the last permitted round, force a final spoken summary.
    if (round === MAX_ROUNDS - 1 || totalCalls >= MAX_TOOL_CALLS) {
      messages.push({
        role: 'system',
        content: 'Wrap up in one or two spoken sentences. No more tool calls. No markdown.',
      });
      const finalResp = await callGroqChat(messages, temperature, null);
      finalContent = (finalResp?.content || '').trim();
      break;
    }
  }

  // Fallback if the model never produced narration — describe the first result.
  if (!finalContent && toolResults.length) {
    finalContent = formatToolResult(toolsUsed[0], toolResults[0].result);
  }
  return { reply: finalContent, toolsUsed, toolResults, rounds };
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

  const loop = await runLlmLoop(persona.prompt, stt.text, persona.temperature);
  if (!loop || !loop.reply) { json(res, 502, { error: 'LLM unavailable — check GROQ_API_KEY' }); return; }
  const { reply, toolsUsed, toolResults } = loop;

  const audio = await synthesize(reply, persona);
  if (!audio) { json(res, 502, { error: 'TTS unavailable — no working voice backend' }); return; }

  // Cap tool-result header size to avoid exceeding HTTP header limits.
  const truncatedResults = toolResults.slice(0, 3).map(({ name, result }) => ({
    name,
    summary: formatToolResult(name, result).slice(0, 240),
  }));

  res.writeHead(200, {
    'content-type': audio.mime,
    'x-voice-transcript': encodeURIComponent(stt.text),
    'x-voice-reply': encodeURIComponent(reply),
    'x-voice-persona': persona.name,
    'x-voice-tools-used': toolsUsed.join(','),
    'x-voice-tool-results': encodeURIComponent(JSON.stringify(truncatedResults)),
    'access-control-expose-headers':
      'x-voice-transcript,x-voice-reply,x-voice-persona,x-voice-tools-used,x-voice-tool-results',
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
