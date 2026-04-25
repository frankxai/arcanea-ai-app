/**
 * Voice Intent Classifier
 *
 * Maps a transcribed phrase to one of the dashboard's intent kinds. Uses
 * Groq Llama 3.3 70B for sub-500ms classification. The catalog of valid
 * targets (workflows, personas, runtimes) is embedded in the system prompt.
 *
 * Why structured: returning the intent shape directly means the dashboard
 * can `emit()` the result without further parsing. The classifier is the
 * voice → bus adapter.
 *
 * Cost note: Groq's free tier handles this comfortably. If GROQ_API_KEY is
 * unset the route falls back to a deterministic substring matcher so the
 * dashboard still works without the AI provider.
 */

import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ClassifyResult {
  kind: 'workflow' | 'summon' | 'runtime' | 'embed' | 'unknown';
  targetId: string | null;
  confidence: number;
  summary: string;
  raw?: string;
}

/* ------------------------------------------------------------------ */
/*  Catalog (must mirror dashboard/lib/{workflows,agents,runtimes}.ts) */
/* ------------------------------------------------------------------ */

const PERSONA_IDS = ['lumina', 'jarvis', 'draconia', 'lyria', 'alera', 'shinkami', 'nero'];

const WORKFLOWS = [
  { id: 'open-author-team', triggers: ['author team', 'arcanea author', 'author'] },
  { id: 'open-orchestra', triggers: ['orchestra', 'a o', 'arcanea orchestra'] },
  { id: 'open-library', triggers: ['library', 'open library', 'show books', 'books'] },
  { id: 'open-las-tierras', triggers: ['las tierras', 'tierras de luz', 'mira', 'chispa'] },
  { id: 'open-worlds', triggers: ['worlds', 'world graph', 'living worlds', 'realms'] },
  { id: 'design-brief', triggers: ['design brief', 'new design', 'start brief'] },
  { id: 'pulse', triggers: ['pulse', 'daily pulse'] },
  { id: 'sis-recall', triggers: ['sis', 'recall', 'remember'] },
  { id: 'github-prs', triggers: ['github', 'pull requests', 'p rs'] },
  { id: 'vercel-prod', triggers: ['vercel', 'deployments', 'production'] },
  { id: 'voice-page', triggers: ['voice home', 'voice page'] },
  { id: 'studio-vault', triggers: ['vault', 'studio vault'] },
];

const RUNTIME_IDS = ['claude-code', 'gemini-cli', 'codex', 'kilo', 'opencode', 'aichat'];

/* ------------------------------------------------------------------ */
/*  Deterministic fallback                                             */
/* ------------------------------------------------------------------ */

function deterministicMatch(transcript: string): ClassifyResult {
  const q = transcript.toLowerCase().trim();

  // Persona: "summon|talk to|lumina|hey jarvis"
  for (const id of PERSONA_IDS) {
    if (
      q === id ||
      q === `summon ${id}` ||
      q === `talk to ${id}` ||
      q === `hey ${id}` ||
      q.includes(`summon ${id}`) ||
      q.includes(`hey ${id}`) ||
      q.match(new RegExp(`\\b${id}\\b`))
    ) {
      return {
        kind: 'summon',
        targetId: id,
        confidence: 0.85,
        summary: `Summon ${id[0].toUpperCase() + id.slice(1)}`,
      };
    }
  }

  // Workflow
  for (const w of WORKFLOWS) {
    for (const t of w.triggers) {
      if (q === t || q.includes(t)) {
        return {
          kind: 'workflow',
          targetId: w.id,
          confidence: 0.8,
          summary: `Workflow → ${w.id}`,
        };
      }
    }
  }

  // Runtime: "open|launch|use claude|gemini|codex"
  for (const id of RUNTIME_IDS) {
    if (q.includes(`launch ${id}`) || q.includes(`open ${id}`) || q === id || q.includes(`use ${id}`)) {
      return {
        kind: 'runtime',
        targetId: id,
        confidence: 0.8,
        summary: `Runtime → ${id}`,
      };
    }
  }

  // Embed: "show me X on youtube" / "find X" / "search X"
  const ytMatch = q.match(/(?:show me|play|find|search)\s+(.+?)\s+on youtube/i);
  if (ytMatch) {
    const query = ytMatch[1].trim();
    return {
      kind: 'embed',
      targetId: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`,
      confidence: 0.85,
      summary: `Embed YouTube → "${query}"`,
    };
  }
  const searchMatch = q.match(/^(?:search|find|google)\s+(.+)$/i);
  if (searchMatch) {
    const query = searchMatch[1].trim();
    return {
      kind: 'embed',
      targetId: `https://www.google.com/search?igu=1&q=${encodeURIComponent(query)}`,
      confidence: 0.7,
      summary: `Embed search → "${query}"`,
    };
  }

  return {
    kind: 'unknown',
    targetId: null,
    confidence: 0,
    summary: `No match for "${transcript.slice(0, 60)}"`,
  };
}

/* ------------------------------------------------------------------ */
/*  Groq Llama 3.3 classifier                                          */
/* ------------------------------------------------------------------ */

async function groqClassify(transcript: string): Promise<ClassifyResult | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  const system = `You are a strict intent classifier for the Arcanea Voice Dashboard.

Map the user's spoken phrase to ONE of these intents. Output JSON only, no prose.

Available targets (use the EXACT id):

PERSONAS (kind: "summon"):
${PERSONA_IDS.map((id) => `  - ${id}`).join('\n')}

WORKFLOWS (kind: "workflow"):
${WORKFLOWS.map((w) => `  - ${w.id} :: triggers: ${w.triggers.join(', ')}`).join('\n')}

RUNTIMES (kind: "runtime"):
${RUNTIME_IDS.map((id) => `  - ${id}`).join('\n')}

EMBED (kind: "embed"):
  - For "show me X on YouTube" → targetId: "https://www.youtube.com/embed?listType=search&list=<encoded query>"
  - For generic search "find X" → targetId: "https://www.google.com/search?igu=1&q=<encoded query>"

If you cannot confidently match (confidence < 0.6), return kind: "unknown".

Output format (strict JSON, no markdown fences, no prose):
{"kind":"summon|workflow|runtime|embed|unknown","targetId":"id-or-url-or-null","confidence":0.0-1.0,"summary":"<6-word human label>"}`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: transcript },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ClassifyResult>;
    if (
      !parsed.kind ||
      !['summon', 'workflow', 'runtime', 'embed', 'unknown'].includes(parsed.kind)
    ) {
      return null;
    }
    return {
      kind: parsed.kind as ClassifyResult['kind'],
      targetId: parsed.targetId ?? null,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      summary: parsed.summary ?? `Voice → ${parsed.kind}`,
      raw,
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Route                                                               */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest): Promise<Response> {
  let body: { transcript?: unknown };
  try {
    body = (await req.json()) as { transcript?: unknown };
  } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const transcript =
    typeof body.transcript === 'string' ? body.transcript.trim().slice(0, 500) : '';

  if (!transcript) {
    return Response.json({ error: 'transcript required' }, { status: 400 });
  }

  // Always run deterministic first — fast path for high-confidence matches
  const det = deterministicMatch(transcript);
  if (det.confidence >= 0.8) {
    return Response.json({ ...det, source: 'deterministic' });
  }

  // LLM classifier as the smart fallback
  const llm = await groqClassify(transcript);
  if (llm && llm.confidence >= 0.6) {
    return Response.json({ ...llm, source: 'groq' });
  }

  // Last resort — return whatever the deterministic matcher had
  return Response.json({ ...det, source: 'deterministic' });
}
