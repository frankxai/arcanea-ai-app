/**
 * @arcanea/voice — Transcription engine
 * Groq (free, instant, best) → faster-whisper → openai-whisper fallback
 */

import { spawnSync } from 'child_process';
import { platform } from 'os';

export function getKey(name) {
  if (process.env[name]) return process.env[name];
  if (platform() === 'win32') {
    try {
      // -NoProfile is critical — otherwise the user's PowerShell profile banner
      // bleeds into stdout and gets returned as if it were the key.
      const r = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
        `[System.Environment]::GetEnvironmentVariable('${name}','User')`
      ], { encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] });
      const val = r.stdout?.trim();
      // Plausibility guard: real API keys are short, single-line, non-whitespace tokens.
      if (!val || val.length > 512 || /\s/.test(val) || val.includes('\n')) return null;
      return val;
    } catch { return null; }
  }
  return null;
}

export function transcribe(file, useGroq = true) {
  const groqKey = getKey('GROQ_API_KEY');

  // 1. Groq (free, instant, whisper-large-v3-turbo)
  if (useGroq && groqKey) {
    try {
      const r = spawnSync('curl', ['-s',
        'https://api.groq.com/openai/v1/audio/transcriptions',
        '-H', `Authorization: Bearer ${groqKey}`,
        '-F', `file=@${file}`,
        '-F', 'model=whisper-large-v3-turbo',
        '-F', 'response_format=text'
      ], { encoding: 'utf-8', timeout: 30000 });
      const text = r.stdout?.trim();
      if (text && text.length > 3 && !text.includes('"error"')) {
        return { text, backend: 'groq' };
      }
    } catch {}
  }

  // 2. Local whisper (faster-whisper or openai-whisper)
  // Sanitize file path to prevent injection
  const safePath = file.replace(/\\/g, '/').replace(/'/g, "\\'");
  const pyCode = `
import sys, warnings; warnings.filterwarnings('ignore')
try:
    from faster_whisper import WhisperModel
    model = WhisperModel('tiny', compute_type='int8')
    segs, _ = model.transcribe('${safePath}')
    print(' '.join(s.text for s in segs).strip())
    sys.exit(0)
except ImportError: pass
try:
    import whisper; model = whisper.load_model('tiny')
    r = model.transcribe('${safePath}')
    print(r['text'].strip())
except: sys.exit(1)`;

  try {
    const r = spawnSync('python3', ['-c', pyCode],
      { encoding: 'utf-8', timeout: 60000, stdio: ['pipe', 'pipe', 'pipe'] });
    if (r.status === 0 && r.stdout?.trim()) {
      return { text: r.stdout.trim(), backend: 'whisper' };
    }
  } catch {}

  return null;
}
