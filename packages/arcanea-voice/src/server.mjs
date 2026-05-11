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
import { createReadStream, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, extname, resolve, dirname, normalize } from 'path';
import { tmpdir, homedir } from 'os';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

import { transcribe, getKey } from './transcribe.mjs';
import { resolvePersona, PERSONAS } from './persona.mjs';
import { TOOLS, executeTool, formatToolResult } from './tools.mjs';
import { getProjectMap } from './workflows.mjs';

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

// JARVIS deep-male candidates from Frank's actual ElevenLabs library
// (verified via /api/voices on 2026-04-30). Override with
// $env:ARCANEA_VOICE_JARVIS_VOICE = 'adam' (or any key below) without code edit.
const JARVIS_VOICE_LIBRARY = {
  brian:    'nPczCjzI2devNBz1zQrb',  // Deep, Resonant, Comforting (default)
  adam:     'pNInz6obpgDQGcFmaJgB',  // Dominant, Firm
  carter:   'qNkzaJoHLLdpvgh5tISm',  // Carter the Mountain King — deepest
  bill:     'pqHfZKP75CvOlQylNhV4',  // Wise, Mature, Balanced (old)
  oxley:    'T5cu6IU92Krx4mh43osx',  // Bill Oxley, mature American male
  george:   'JBFqnCBsd6RMkjVDRZzb',  // Warm, Captivating Storyteller
  daniel:   'onwK4e9ZLuTAKqWW03F9',  // Steady Broadcaster
};
// Priority for picking Jarvis voice: env var > saved choice file > default 'brian'.
function loadJarvisVoiceKey() {
  const envChoice = (process.env.ARCANEA_VOICE_JARVIS_VOICE || '').toLowerCase();
  if (envChoice && JARVIS_VOICE_LIBRARY[envChoice]) return envChoice;
  try {
    const choiceFile = join(homedir(), '.starlight', 'jarvis-voice-choice.txt');
    if (existsSync(choiceFile)) {
      const saved = readFileSync(choiceFile, 'utf-8').trim().toLowerCase();
      if (JARVIS_VOICE_LIBRARY[saved]) return saved;
    }
  } catch {}
  return 'brian';
}
const JARVIS_VOICE_KEY = loadJarvisVoiceKey();
const JARVIS_VOICE_ID = JARVIS_VOICE_LIBRARY[JARVIS_VOICE_KEY];

// Groq Orpheus voice keys: male {austin, daniel, troy} / female {autumn, diana, hannah}.
// Picked per-persona for character fit. Lumina → diana (clear/warm female).
// JARVIS → austin (deep authoritative male) — override via env var below.
const JARVIS_GROQ_VOICE = (process.env.ARCANEA_VOICE_JARVIS_GROQ || 'austin').toLowerCase();
const VOICE_MAP = {
  // Female: Lumina = warm female. Groq diana primary, ElevenLabs Lily override.
  lumina:    { eleven: 'pFZP5JQG7iQjIQuC4Bku', groq: 'diana' },
  // JARVIS = deep male. Groq austin primary, ElevenLabs Brian override.
  jarvis:    { eleven: JARVIS_VOICE_ID,        groq: JARVIS_GROQ_VOICE },
  coach:     { eleven: 'EXAVITQu4vr4xnSDxMaL', groq: 'daniel' },
  draconia:  { eleven: null,                   groq: 'troy' },        // commanding
  shinkami:  { eleven: null,                   groq: 'austin' },      // grounded
};

// ---------------------------------------------------------------------------
// Cockpit feed — in-memory ring buffer of voice/tool events, drained over SSE
// to the LCC dashboard so audiences SEE the agent execute. Zero persistence
// (process-local). Lossy by design — old events drop off the back. Added
// 2026-04-30 as the demo "wow" channel: voice → tools → results all visible.
// ---------------------------------------------------------------------------

const FEED_CAPACITY = 200;
const feedBuffer = [];
let feedSeq = 0;
const feedSubscribers = new Set();

function pushFeedEvent(event) {
  const enriched = { id: ++feedSeq, ts: Date.now(), ...event };
  feedBuffer.push(enriched);
  if (feedBuffer.length > FEED_CAPACITY) feedBuffer.shift();
  for (const send of feedSubscribers) {
    try { send(enriched); } catch {}
  }
  return enriched;
}

// LLM choice: Groq llama-3.3-70b is the default because it pairs strong
// OpenAI-compatible function-calling with sub-second time-to-first-token —
// essential for voice UX (any delay past ~800ms starts to feel broken).
// Switch via `ARCANEA_VOICE_LLM` (e.g. moonshotai/kimi-k2-instruct,
// openai/gpt-oss-120b) if you want different trade-offs; all Groq models
// that expose the `tools` param will work without code changes.
const LLM_MODEL = process.env.ARCANEA_VOICE_LLM || 'llama-3.3-70b-versatile';
// Groq's `playai-tts` was decommissioned 2026. Current model is Orpheus
// (canopylabs/orpheus-v1-english) — verified live 2026-05-01. Voices:
// male: austin, daniel, troy / female: autumn, diana, hannah.
// Speed: ~1.2s total / ~300ms TTFB vs ElevenLabs ~5s typical (3-4x faster).
const TTS_MODEL_GROQ = process.env.ARCANEA_VOICE_TTS || 'canopylabs/orpheus-v1-english';
// TTS provider order: 'groq-first' (default — fast) or 'eleven-first' (premium voice character).
const TTS_PROVIDER_ORDER = (process.env.ARCANEA_VOICE_TTS_ORDER || 'groq-first').toLowerCase();
// Flash is ~75ms first-byte vs turbo's ~250ms. Voice UX feels broken past ~800ms
// total round-trip, so we default to flash. Override via ARCANEA_VOICE_ELEVEN_MODEL
// for higher-quality (turbo / multilingual) when latency doesn't matter.
const TTS_MODEL_ELEVEN = process.env.ARCANEA_VOICE_ELEVEN_MODEL || 'eleven_flash_v2_5';

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

/**
 * Cognition bridge — when COGNITION_BRIDGE_URL is set, route the user's
 * utterance through Starlight's CognitionRouter (typically
 * http://127.0.0.1:7373/api/utterance on voice-operator's FastAPI) instead
 * of running the local Groq+tools loop. Gives "one mind, two bodies": this
 * orb and Starlight's text/voice modes share the same brain, packet schema,
 * approval gate, and dispatcher fleet.
 *
 * Returns the shape runLlmLoop produces, OR null on failure (caller falls
 * back to the local Groq loop so a bridge outage never silences Jarvis).
 */
async function routeViaCognitionBridge(userText) {
  const bridgeUrl = process.env.COGNITION_BRIDGE_URL;
  if (!bridgeUrl) return null;
  const auth = process.env.VOICE_OPERATOR_AUTH_TOKEN || '';
  const headers = { 'content-type': 'application/json' };
  if (auth) headers.authorization = `Bearer ${auth}`;
  try {
    const r = await fetch(bridgeUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text: userText, source: 'arcanea-voice' }),
    });
    if (!r.ok) {
      process.stderr.write(`[BRIDGE] cognition bridge HTTP ${r.status} — falling back to Groq\n`);
      return null;
    }
    const j = await r.json().catch(() => null);
    if (!j || !j.spoken_update) {
      process.stderr.write(`[BRIDGE] cognition bridge returned no spoken_update — falling back\n`);
      return null;
    }
    const toolsUsed = [];
    const toolResults = [];
    if (j.routing && j.routing.status) toolsUsed.push(`packet:${j.routing.status}`);
    if (j.packet) toolResults.push({ name: 'packet', result: j.packet });
    return {
      reply: j.spoken_update,
      toolsUsed,
      toolResults,
      rounds: 1,
    };
  } catch (e) {
    process.stderr.write(`[BRIDGE] cognition bridge error: ${e.message} — falling back to Groq\n`);
    return null;
  }
}


// Track last Groq failure reason so the user-facing error is specific
// (rate-limited / oversized / network) instead of the opaque "LLM unavailable".
let lastGroqError = null;

async function callGroqChat(messages, temperature = 0.5, tools = null) {
  const key = getKey('GROQ_API_KEY');
  if (!key) { lastGroqError = 'GROQ_API_KEY not set'; return null; }
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
  // 3 attempts with exponential backoff — covers transient 429/5xx blips
  // (Groq rate-limits + brief upstream hiccups). Live demos can rapid-fire
  // and a single retry is the difference between "LLM unavailable" and a
  // smooth response.
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let r;
    try {
      r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
        body: JSON.stringify(body),
      });
    } catch (e) {
      lastGroqError = `network error: ${e.message}`;
      if (attempt < maxAttempts) {
        await new Promise((res) => setTimeout(res, 250 * attempt));
        continue;
      }
      return null;
    }
    if (r.ok) {
      const j = await r.json().catch(() => null);
      lastGroqError = null;
      return j?.choices?.[0]?.message || null;
    }
    // Capture body for diagnostics; don't burn time reading on every retry.
    const errBody = attempt === maxAttempts ? await r.text().catch(() => '') : '';
    if (r.status === 429) lastGroqError = 'rate-limited (Groq)';
    else if (r.status >= 500) lastGroqError = `Groq upstream ${r.status}`;
    else if (r.status === 413) lastGroqError = 'prompt too large';
    else lastGroqError = `Groq HTTP ${r.status}: ${errBody.slice(0, 120)}`;
    process.stderr.write(`[GROQ] attempt ${attempt}/${maxAttempts} failed: ${lastGroqError}\n`);
    if (r.status === 429 || r.status >= 500) {
      if (attempt < maxAttempts) {
        await new Promise((res) => setTimeout(res, 400 * attempt));
        continue;
      }
    }
    return null;
  }
  return null;
}

export function getLastGroqError() { return lastGroqError; }

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

/**
 * Build a "Current operator context" envelope appended to the system prompt
 * for every LLM call. Gives the model situational awareness — time of day,
 * available project shortcuts, last few feed events — so it stops treating
 * each utterance as fresh-from-zero. Cheap to compute (no shells, no IO past
 * a hashmap read). Added 2026-04-30 to fix the "tried to install before
 * checking" intelligence gap.
 */
function buildContextEnvelope() {
  const now = new Date();
  const projectMap = getProjectMap();
  const projectNames = Object.keys(projectMap).sort().join(', ');
  // Recent feed events — gives the model continuity across turns within a session.
  const recent = feedBuffer.slice(-6).map((e) => {
    if (e.type === 'transcript') return `  user said: "${(e.text || '').slice(0, 80)}"`;
    if (e.type === 'reply') return `  you replied: "${(e.text || '').slice(0, 80)}"`;
    if (e.type === 'tool_call') return `  you called: ${e.tool}(${JSON.stringify(e.args).slice(0, 80)})`;
    if (e.type === 'tool_result') return `  result: ${e.tool} → ${(typeof e.result === 'object' ? JSON.stringify(e.result) : String(e.result || '')).slice(0, 80)}`;
    if (e.type === 'persona_switch') return `  persona switched to ${e.persona}`;
    return null;
  }).filter(Boolean);
  return [
    '',
    '## Current operator context',
    `- time: ${now.toLocaleString()} (${now.toLocaleString(undefined, { weekday: 'long' })})`,
    `- operator: Frank (Starlight Holding founder, building voice cockpit)`,
    `- known project shortcuts (use as 'project' arg): ${projectNames}`,
    `- last 6 events this session:`,
    recent.length ? recent.join('\n') : '  (this is the first turn)',
    '',
  ].join('\n');
}

async function runLlmLoop(systemPrompt, userText, temperature = 0.5) {
  // Bridge mode: when COGNITION_BRIDGE_URL is set, route through Starlight's
  // CognitionRouter so this orb shares the same brain as text-mode + future
  // voice-operator wake-word. Bridge failures fall back to the local Groq
  // loop so the orb never goes silent.
  const bridged = await routeViaCognitionBridge(userText);
  if (bridged) return bridged;

  const enrichedSystem = systemPrompt + buildContextEnvelope();
  const messages = [
    { role: 'system', content: enrichedSystem },
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
      pushFeedEvent({ type: 'tool_call', tool: name, args });
      const tStart = performance.now();
      const result = await executeTool(name, args);
      const elapsed = Math.round(performance.now() - tStart);
      pushFeedEvent({ type: 'tool_result', tool: name, ms: elapsed, result });
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
  if (!key || !voiceId) {
    process.stderr.write(`[ELEVEN] skipped — key=${!!key} voiceId=${!!voiceId}\n`);
    return null;
  }
  let r;
  try {
    r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`, {
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
  } catch (e) {
    process.stderr.write(`[ELEVEN] network error: ${e.message}\n`);
    return null;
  }
  if (!r.ok) {
    const errBody = await r.text().catch(() => '');
    process.stderr.write(`[ELEVEN] HTTP ${r.status} for voice=${voiceId}: ${errBody.slice(0, 200)}\n`);
    return null;
  }
  if (!r.body) {
    process.stderr.write(`[ELEVEN] no body returned for voice=${voiceId}\n`);
    return null;
  }
  return { body: r.body, mime: 'audio/mpeg' };
}

async function synthesizeGroq(text, voiceName) {
  const key = getKey('GROQ_API_KEY');
  if (!key || !voiceName) {
    process.stderr.write(`[GROQ-TTS] skipped — key=${!!key} voice=${voiceName}\n`);
    return null;
  }
  let r;
  try {
    r = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: TTS_MODEL_GROQ,
        input: text,
        voice: voiceName,
        response_format: 'wav',
      }),
    });
  } catch (e) {
    process.stderr.write(`[GROQ-TTS] network error: ${e.message}\n`);
    return null;
  }
  if (!r.ok) {
    const errBody = await r.text().catch(() => '');
    process.stderr.write(`[GROQ-TTS] HTTP ${r.status} model=${TTS_MODEL_GROQ} voice=${voiceName}: ${errBody.slice(0, 200)}\n`);
    return null;
  }
  if (!r.body) {
    process.stderr.write(`[GROQ-TTS] no body\n`);
    return null;
  }
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
  // groq-first (default): fast Orpheus, fall back to ElevenLabs only if needed.
  // eleven-first: premium voice character, fall back to Groq if quota dies.
  const tryEleven = () => synthesizeElevenLabs(text, voice.eleven);
  const tryGroq = () => synthesizeGroq(text, voice.groq);
  const tryEdge = () => synthesizeEdge(text);
  const order = TTS_PROVIDER_ORDER === 'eleven-first'
    ? [tryEleven, tryGroq, tryEdge]
    : [tryGroq, tryEleven, tryEdge];
  for (const fn of order) {
    const audio = await fn();
    if (audio) return audio;
  }
  return null;
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
  if (buf.length < 2000) {
    // Guard against the client-side thrash bug: any audio this small almost
    // certainly won't transcribe and would just waste a Groq call.
    process.stderr.write(`[VOICE] reject tiny blob (${buf.length} bytes)\n`);
    json(res, 400, { error: `blob too small (${buf.length} bytes) — record at least half a second of audio` });
    return;
  }

  try {
    writeFileSync(stash, buf);
  } catch (e) {
    json(res, 500, { error: 'disk write failed' });
    return;
  }

  const t0 = performance.now();
  const stt = transcribe(stash);
  const tStt = Math.round(performance.now() - t0);
  try { unlinkSync(stash); } catch {}
  if (!stt?.text) {
    process.stderr.write(`[VOICE] transcribe empty (${buf.length} bytes, ${tStt}ms)\n`);
    // Disambiguate the two common causes so the user knows which way to act.
    const hint = buf.length > 200000
      ? 'likely background noise — try a quieter room, move closer to mic, or press Esc to stop sooner'
      : 'audio seemed silent — speak a bit louder or check mic input level';
    json(res, 502, { error: `transcription empty — ${hint}` });
    return;
  }
  process.stderr.write(`[VOICE] stt "${stt.text.slice(0, 80)}" (${buf.length}b, ${tStt}ms)\n`);
  pushFeedEvent({ type: 'transcript', persona: persona.name, text: stt.text });

  const t1 = performance.now();
  const loop = await runLlmLoop(persona.prompt, stt.text, persona.temperature);
  const tLlm = Math.round(performance.now() - t1);
  if (!loop || !loop.reply) { json(res, 502, { error: `LLM unavailable: ${lastGroqError || 'check GROQ_API_KEY'}` }); return; }
  const { reply, toolsUsed, toolResults } = loop;
  pushFeedEvent({ type: 'reply', persona: persona.name, text: reply, tools: toolsUsed, ms: tLlm });

  const t2 = performance.now();
  const audio = await synthesize(reply, persona);
  const tTts = Math.round(performance.now() - t2);
  if (!audio) { json(res, 502, { error: 'TTS unavailable — no working voice backend' }); return; }

  process.stderr.write(`[VOICE] ${persona.name.padEnd(8)} stt=${tStt}ms  llm=${tLlm}ms  tts=${tTts}ms  tools=${toolsUsed.join(',') || 'none'}\n`);

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
    'x-voice-t-stt-ms': String(tStt),
    'x-voice-t-llm-ms': String(tLlm),
    'x-voice-t-tts-ms': String(tTts),
    'access-control-expose-headers':
      'x-voice-transcript,x-voice-reply,x-voice-persona,x-voice-tools-used,x-voice-tool-results,x-voice-t-stt-ms,x-voice-t-llm-ms,x-voice-t-tts-ms',
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

/**
 * Text-input fallback for the orb — same downstream path as voice but skips
 * the Groq Whisper STT step. Lets the user type when the mic is gated by
 * Windows permissions / hardware. The reply still flows through the Starlight
 * cognition bridge (if COGNITION_BRIDGE_URL is set) and gets ElevenLabs TTS.
 */
// B3-lite (2026-05-11): publish voice.turn to SIS brain SSE so the orb's
// native path is observable in the dashboard even when the cognition bridge
// is off / failing. Mirrors the SIS voice-operator voice.turn event contract
// from private/voice-operator/service/brain_publisher.py make_voice_turn().
// Fire-and-forget — orb turn never blocks on dashboard reachability.
const BRAIN_INJECT_URL = process.env.BRAIN_INJECT_URL || 'http://127.0.0.1:3007/api/brain/inject';
const BRAIN_PUBLISH_DISABLED = process.env.BRAIN_PUBLISH_DISABLED === '1';

function newTraceId() {
  return 't-' + Math.random().toString(36).slice(2, 14) + Date.now().toString(36).slice(-4);
}

function publishVoiceTurn(payload) {
  if (BRAIN_PUBLISH_DISABLED) return;
  try {
    const event = {
      kind: 'voice.turn',
      ts: new Date().toISOString(),
      ...payload,
    };
    // Don't await — caller is HTTP handler and must not stall on dashboard.
    fetch(BRAIN_INJECT_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(500),
    }).catch(() => {});
  } catch {
    // Constructor errors only — fully swallowed; observability never blocks the turn.
  }
}

async function handleText(req, res) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const persona = resolvePersona(u.searchParams.get('persona'));
  const traceId = newTraceId();
  const tTurnStart = performance.now();

  let body;
  try {
    const raw = await readRawBody(req);
    body = JSON.parse(raw.toString('utf-8'));
  } catch (e) {
    publishVoiceTurn({ trace_id: traceId, ok: false, route: 'invalid-json', backend: 'orb', turn_total_ms: Math.round(performance.now() - tTurnStart) });
    json(res, 400, { error: 'invalid JSON body' });
    return;
  }
  const text = (body?.text || '').trim();
  if (!text) {
    publishVoiceTurn({ trace_id: traceId, ok: false, route: 'empty', backend: 'orb', turn_total_ms: Math.round(performance.now() - tTurnStart) });
    json(res, 400, { error: 'text required' });
    return;
  }
  if (text.length > 4000) {
    publishVoiceTurn({ trace_id: traceId, ok: false, route: 'too-long', backend: 'orb', turn_total_ms: Math.round(performance.now() - tTurnStart) });
    json(res, 413, { error: 'text too long' });
    return;
  }

  process.stderr.write(`[TEXT] "${text.slice(0, 80)}"\n`);
  pushFeedEvent({ type: 'transcript', persona: persona.name, text, source: 'typed' });

  const t1 = performance.now();
  const loop = await runLlmLoop(persona.prompt, text, persona.temperature);
  const tLlm = Math.round(performance.now() - t1);
  if (!loop || !loop.reply) {
    publishVoiceTurn({ trace_id: traceId, ok: false, route: 'llm-unavailable', backend: 'orb', cognition_ms: tLlm, turn_total_ms: Math.round(performance.now() - tTurnStart) });
    json(res, 502, { error: `LLM unavailable: ${lastGroqError || 'check GROQ_API_KEY or cognition bridge'}` });
    return;
  }
  const { reply, toolsUsed, toolResults } = loop;
  pushFeedEvent({ type: 'reply', persona: persona.name, text: reply, tools: toolsUsed, ms: tLlm });

  const t2 = performance.now();
  const audio = await synthesize(reply, persona);
  const tTts = Math.round(performance.now() - t2);
  if (!audio) {
    publishVoiceTurn({ trace_id: traceId, ok: false, route: 'tts-unavailable', backend: 'orb', cognition_ms: tLlm, turn_total_ms: Math.round(performance.now() - tTurnStart) });
    json(res, 502, { error: 'TTS unavailable — no working voice backend' });
    return;
  }

  const turnTotalMs = Math.round(performance.now() - tTurnStart);
  process.stderr.write(`[TEXT] ${persona.name.padEnd(8)} llm=${tLlm}ms  tts=${tTts}ms  tools=${toolsUsed.join(',') || 'none'}\n`);
  publishVoiceTurn({
    trace_id: traceId,
    ok: true,
    route: toolsUsed.length ? 'orb-tools' : 'orb-reply',
    backend: 'orb',
    cognition_ms: tLlm,
    turn_total_ms: turnTotalMs,
  });

  const truncatedResults = toolResults.slice(0, 3).map(({ name, result }) => ({
    name,
    summary: formatToolResult(name, result).slice(0, 240),
  }));

  res.writeHead(200, {
    'content-type': audio.mime,
    'x-voice-transcript': encodeURIComponent(text),
    'x-voice-reply': encodeURIComponent(reply),
    'x-voice-persona': persona.name,
    'x-voice-tools-used': toolsUsed.join(','),
    'x-voice-tool-results': encodeURIComponent(JSON.stringify(truncatedResults)),
    'x-voice-t-stt-ms': '0',
    'x-voice-t-llm-ms': String(tLlm),
    'x-voice-t-tts-ms': String(tTts),
    'access-control-expose-headers':
      'x-voice-transcript,x-voice-reply,x-voice-persona,x-voice-tools-used,x-voice-tool-results,x-voice-t-stt-ms,x-voice-t-llm-ms,x-voice-t-tts-ms',
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
    // Voice-info debug — confirms which ElevenLabs voice ID + model each persona
    // resolves to right now. Use when the played voice doesn't match expectations.
    // Voice sample — synthesizes a short JARVIS-style line via ElevenLabs for any
    // candidate voice key (brian/adam/carter/bill/oxley/george/daniel) so Frank can
    // A/B them in the dashboard without restarting. Returns audio/mpeg.
    if (u.pathname === '/api/voice-sample') {
      const key = (u.searchParams.get('voice') || 'brian').toLowerCase();
      const voiceId = JARVIS_VOICE_LIBRARY[key];
      if (!voiceId) { json(res, 400, { error: `unknown voice: ${key}` }); return; }
      // Cache samples on disk so a single generation per voice is enough for
      // many demos. Avoids burning ElevenLabs per-key quota every page load.
      const cacheDir = join(homedir(), '.starlight', 'voice-samples');
      try { mkdirSync(cacheDir, { recursive: true }); } catch {}
      const cachePath = join(cacheDir, `${key}-${voiceId}.mp3`);
      if (existsSync(cachePath)) {
        const stat = statSync(cachePath);
        if (stat.size > 1000) {
          res.writeHead(200, {
            'content-type': 'audio/mpeg',
            'cache-control': 'public, max-age=86400',
            'x-voice-key': key,
            'x-voice-id': voiceId,
            'x-voice-source': 'cache',
            'content-length': String(stat.size),
          });
          createReadStream(cachePath).pipe(res);
          return;
        }
      }
      // First-time generation. Use the shortest possible sample to economize.
      const sampleText = u.searchParams.get('text') ||
        'Good evening Frank. JARVIS online.';
      process.stderr.write(`[VOICE-SAMPLE] generating key=${key} voiceId=${voiceId} textLen=${sampleText.length}\n`);
      const audio = await synthesizeElevenLabs(sampleText, voiceId);
      if (!audio) {
        process.stderr.write(`[VOICE-SAMPLE] synthesizeElevenLabs null for ${key}\n`);
        json(res, 502, {
          error: 'ElevenLabs synthesis failed — check orb stderr log. Most likely cause: per-API-key quota exhausted in your ElevenLabs dashboard. Raise it under "API Keys → Edit → Quota".',
        });
        return;
      }
      // Buffer the streamed body so we can both write to disk AND respond.
      const chunks = [];
      if (Buffer.isBuffer(audio.body)) {
        chunks.push(audio.body);
      } else {
        const reader = audio.body.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            chunks.push(Buffer.from(value));
          }
        } catch {}
      }
      const buf = Buffer.concat(chunks);
      try { writeFileSync(cachePath, buf); } catch {}
      res.writeHead(200, {
        'content-type': audio.mime,
        'cache-control': 'public, max-age=86400',
        'x-voice-key': key,
        'x-voice-id': voiceId,
        'x-voice-source': 'fresh',
        'content-length': String(buf.length),
      });
      res.end(buf);
      return;
    }
    // Voice choice — persists Frank's pick to ~/.starlight/jarvis-voice-choice.txt.
    // Effective on next orb restart (env var read at module-load).
    if (u.pathname === '/api/voice-choice' && req.method === 'POST') {
      try {
        const raw = await readRawBody(req);
        const body = JSON.parse(raw.toString('utf-8'));
        const key = (body?.voice || '').toLowerCase();
        if (!JARVIS_VOICE_LIBRARY[key]) { json(res, 400, { error: `unknown voice: ${key}` }); return; }
        const dir = join(homedir(), '.starlight');
        try { mkdirSync(dir, { recursive: true }); } catch {}
        writeFileSync(join(dir, 'jarvis-voice-choice.txt'), key, 'utf-8');
        json(res, 200, { ok: true, choice: key, note: 'Restart orb to apply.' });
      } catch (e) {
        json(res, 500, { error: String(e?.message || e) });
      }
      return;
    }
    if (u.pathname === '/api/voice-info') {
      const out = {};
      for (const [name, p] of Object.entries(PERSONAS)) {
        const v = VOICE_MAP[p.voice] || VOICE_MAP.lumina;
        const cachePath = join(homedir(), '.starlight', 'voice-samples',
          v.eleven ? `${p.voice}-${v.eleven}.mp3` : '');
        out[name] = {
          voice_key: p.voice,
          eleven_voice_id: v.eleven,
          groq_voice: v.groq,
          model: TTS_MODEL_ELEVEN,
          temperature: p.temperature,
        };
      }
      // Cached samples — which voices already have a playable MP3 on disk?
      const cacheDir = join(homedir(), '.starlight', 'voice-samples');
      const cached = {};
      for (const [k, vid] of Object.entries(JARVIS_VOICE_LIBRARY)) {
        const p = join(cacheDir, `${k}-${vid}.mp3`);
        cached[k] = existsSync(p) && statSync(p).size > 1000;
      }
      // Probe ElevenLabs quota best-effort (3s budget).
      let elevenQuota = null;
      try {
        const elevenKey = getKey('ELEVENLABS_API_KEY');
        if (elevenKey) {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 3000);
          const r = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
            headers: { 'xi-api-key': elevenKey },
            signal: ctrl.signal,
          });
          clearTimeout(timer);
          if (r.ok) {
            const j = await r.json().catch(() => null);
            if (j) {
              elevenQuota = {
                tier: j.tier,
                used: j.character_count,
                limit: j.character_limit,
                remaining: j.character_limit - j.character_count,
              };
            }
          }
        }
      } catch {}
      json(res, 200, {
        tts_model: TTS_MODEL_ELEVEN,
        jarvis_voice_choice: JARVIS_VOICE_KEY,
        jarvis_voice_alternatives: Object.keys(JARVIS_VOICE_LIBRARY),
        cached_samples: cached,
        eleven_quota: elevenQuota,
        personas: out,
      });
      return;
    }
    // Cockpit live activity feed (SSE). Streams transcript/reply/tool events
    // to the LCC dashboard so audiences SEE the agent execute. Safe to subscribe
    // from any origin on the local box (CORS already allow-* on this server).
    if (u.pathname === '/api/cockpit-feed') {
      res.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache, no-transform',
        'connection': 'keep-alive',
        'x-accel-buffering': 'no',
      });
      res.write(': cockpit-feed open\n\n');
      // Backfill recent events so a late-joining client sees context.
      for (const evt of feedBuffer.slice(-50)) {
        res.write(`event: ${evt.type}\ndata: ${JSON.stringify(evt)}\n\n`);
      }
      const send = (evt) => {
        try { res.write(`event: ${evt.type}\ndata: ${JSON.stringify(evt)}\n\n`); } catch {}
      };
      feedSubscribers.add(send);
      const heartbeat = setInterval(() => { try { res.write(': hb\n\n'); } catch {} }, 15000);
      req.on('close', () => {
        clearInterval(heartbeat);
        feedSubscribers.delete(send);
      });
      return;
    }
    if (u.pathname === '/api/cockpit-feed/recent') {
      json(res, 200, { events: feedBuffer.slice(-50) });
      return;
    }
    if (u.pathname === '/api/persona-switch' && req.method === 'POST') {
      const to = (u.searchParams.get('to') || 'unknown').toLowerCase();
      const display = to.charAt(0).toUpperCase() + to.slice(1);
      pushFeedEvent({ type: 'persona_switch', persona: display });
      json(res, 200, { ok: true });
      return;
    }
    if (u.pathname === '/api/converse' && req.method === 'POST') {
      try { await handleConverse(req, res); } catch (e) {
        if (!res.headersSent) json(res, 500, { error: String(e?.message || e) });
      }
      return;
    }
    if (u.pathname === '/api/text' && req.method === 'POST') {
      try { await handleText(req, res); } catch (e) {
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
