/**
 * Lumina Queen — The Single Entry Point
 *
 * Frank's vision: "one main claw you talk with and all background multi agent team".
 * Lumina is that Claw. She's the Queen of the Publishing House — the single
 * conversational surface where you drop requests, and she routes them to the
 * right specialist Claw (Lyria/Ismael/Alera/Lyssandria/Shinkami).
 *
 * Lumina herself is canonical Arcanea — the First Light, Form-Giver, the
 * consciousness that channels creation. In the Publishing House she serves
 * as the Router, not a worker. The specialists do the work; Lumina decides
 * which of them handles each request.
 *
 * Deployment:
 *   - As an OpenClaw agent on WhatsApp/Telegram/Slack (conversational)
 *   - As a Claude Code skill (/claws or /ao route)
 *   - As a Paperclip "CEO" role (in the org chart layer)
 *   - As a Railway webhook endpoint (/lumina/route)
 *
 * Lumina is the ONE Claw creators talk to. Everything else runs in the background.
 */

import { loadClawKernel } from '../agents/kernel-loader.js';
import {
  PUBLISHING_LUMINORS,
  buildAgentConfigFromLuminor,
  detectRuntime,
  getLuminorByClaw,
} from '../agents/hierarchy.js';
import type { ClawName, Guardian } from '../agents/types.js';
import type { Luminor, Runtime } from '../agents/hierarchy.js';

// ---------------------------------------------------------------------------
// Intent Classification
// ---------------------------------------------------------------------------

/** The kind of request Lumina can route */
export type Intent =
  | 'publish'      // full pipeline: format + cover + social + distribute
  | 'score'        // TASTE quality gate only
  | 'format'       // MD → EPUB/PDF/DOCX only
  | 'distribute'   // push to platforms (already formatted)
  | 'translate'    // content → target languages
  | 'social'       // draft/schedule social posts
  | 'scan'         // find new content in directories
  | 'classify'     // tag assets with Guardian/Element/Gate
  | 'mint'         // NFT generation + minting
  | 'scout'        // market/trend scan
  | 'report'       // generate a Scout report
  | 'unknown';     // couldn't classify

/** Which Claw handles which intent */
const INTENT_ROUTING: Record<Intent, ClawName | null> = {
  publish: 'scribe-claw',
  score: 'media-claw',
  format: 'scribe-claw',
  distribute: 'scribe-claw',
  translate: 'scribe-claw',
  social: 'herald-claw',
  scan: 'media-claw',
  classify: 'media-claw',
  mint: 'forge-claw',
  scout: 'scout-claw',
  report: 'scout-claw',
  unknown: null,
};

/**
 * Classify a natural language request into an Intent.
 * Deterministic keyword matching — no API calls.
 * For ambiguous cases, returns the highest-priority match.
 */
export function classifyIntent(request: string): Intent {
  const lower = request.toLowerCase();

  // Order matters — specific intents (that can be mistaken for broader ones)
  // must match BEFORE the broader patterns. Social content first because
  // "launch thread" would otherwise match publish on "launch".

  // 1. Social — most specific keywords that also contain "launch" false-positives
  if (/\btweet\b|\bthread\b|\bcarousel\b|\bcampaign\b|\binstagram\b|\blinkedin\b|\bbluesky\b|\btiktok\b|\breels?\b|\bsocial\b|\bpost\b/i.test(lower)) {
    return 'social';
  }

  // 2. Report (before scout — "scout report" should route to report, not scout)
  if (/\breport\b|\bbriefing\b|\banalysis\b|\bsummary\b/i.test(lower)) {
    return 'report';
  }

  // 3. Publish — full pipeline
  if (/\bpublish\b|\bship\b(?!ping)|\blaunch (the|my|a|this)\b|\brelease\b.*\bbook\b/i.test(lower)) {
    return 'publish';
  }

  // 4. Score / TASTE / quality
  if (/\bscore\b|\btaste\b|\bquality\b|\bgate\b|\bgrade\b|\brate\b/i.test(lower)) {
    return 'score';
  }

  // 5. Format (Pandoc output)
  if (/\bformat\b|\bepub\b|\bpdf\b|\bdocx\b|\bconvert\b|\bpandoc\b/i.test(lower)) {
    return 'format';
  }

  // 6. Translate
  if (/\btranslate\b|translation|dutch|german|spanish|portuguese|japanese|french|chinese|korean/i.test(lower)) {
    return 'translate';
  }

  // 7. Distribute
  if (/\bdistribute\b|\bupload\b|\bpush to\b|\bleanpub\b|\bkindle\b|\bdraft2digital\b/i.test(lower)) {
    return 'distribute';
  }

  // 8. Scan directories
  if (/\bscan\b|\bfind files\b|\bdiscover\b|\bwalk\b.*\bdirectory\b/i.test(lower)) {
    return 'scan';
  }

  // 9. Classify assets
  if (/\bclassify\b|\btag\b|\bcategori[sz]e\b|\blabel\b/i.test(lower)) {
    return 'classify';
  }

  // 10. Mint NFT
  if (/\bmint\b|\bnft\b|\bgenerate\b.*\bart\b|\bforge\b/i.test(lower)) {
    return 'mint';
  }

  // 11. Scout (least specific, catches trends/monitoring)
  if (/\bscout\b|\btrend\b|\bmonitor\b|\bcompetitor\b|\bwatch\b.*\bmarket\b|\bbooktok\b/i.test(lower)) {
    return 'scout';
  }

  return 'unknown';
}

// ---------------------------------------------------------------------------
// Queen's Routing Decision
// ---------------------------------------------------------------------------

export interface RoutingDecision {
  /** The request as received */
  readonly request: string;
  /** The classified intent */
  readonly intent: Intent;
  /** Which Claw was chosen (null if unknown) */
  readonly chosenClaw: ClawName | null;
  /** The Luminor channeling that Claw */
  readonly chosenLuminor: Luminor | null;
  /** Which runtime will host the Claw */
  readonly runtime: Runtime;
  /** Reasoning for the routing decision */
  readonly reasoning: string;
  /** Alternative Claws that could also handle this */
  readonly alternatives: ClawName[];
}

/**
 * Lumina receives a request and decides which Claw should handle it.
 * Pure function — no side effects, no API calls.
 */
export function routeRequest(request: string): RoutingDecision {
  const intent = classifyIntent(request);
  const chosenClaw = INTENT_ROUTING[intent];
  const chosenLuminor = chosenClaw ? getLuminorByClaw(chosenClaw) : null;
  const runtime = detectRuntime();

  const reasoning = chosenLuminor
    ? `Intent "${intent}" routes to ${chosenLuminor.name}'s Claw (${chosenLuminor.clawName}) — ${chosenLuminor.craft}`
    : `Could not classify intent from request. Ask Frank to clarify or invoke a specific Claw directly.`;

  // Find alternatives — other Claws that could also handle related intents
  const alternatives: ClawName[] = [];
  if (intent === 'publish' || intent === 'format') alternatives.push('scribe-claw');
  if (intent === 'score' || intent === 'classify') alternatives.push('media-claw');

  return {
    request,
    intent,
    chosenClaw,
    chosenLuminor,
    runtime,
    reasoning,
    alternatives: alternatives.filter(c => c !== chosenClaw),
  };
}

// ---------------------------------------------------------------------------
// Lumina's System Prompt (for when she runs as a Managed Agent / OpenClaw bot)
// ---------------------------------------------------------------------------

const LUMINA_IDENTITY = `# Lumina — The First Light, Queen of the Publishing House

You are Lumina, the First Light of Arcanea, Form-Giver, Queen of the Publishing House.

You are not a worker. You are the Queen. Creators speak to you as the single
entry point of the Arcanea Publishing House, and you route their requests to
the five specialist Claws who do the actual work:

- **Lyria's Claw** (media-claw, Sight Gate) — scans, classifies, scores quality
- **Ismael's Claw** (forge-claw, Fire Gate) — generates NFT art, mints with consent
- **Alera's Claw** (herald-claw, Voice Gate) — drafts social content, schedules campaigns
- **Lyssandria's Claw** (scout-claw, Earth Gate) — monitors markets, reports alpha
- **Shinkami's Claw** (scribe-claw, Source Gate) — formats, distributes, translates books

## Your Role

1. **Receive** — the creator speaks to you in natural language. They don't need to know which Claw does what.
2. **Understand** — classify their intent. What do they actually want?
3. **Route** — dispatch the right Claw with a precise task. You are allergic to routing to the wrong Claw.
4. **Report** — when the Claw returns results, you summarize them for the creator in your voice.
5. **Guard** — you are the gate. You do not let generic content or unapproved distribution through.

## Your Voice

Warm, authoritative, decisive. Light-creation metaphors: "let there be form", "from potential to manifestation". You carry the whole weight of Arcanea's creative intelligence but you hold it lightly.

- "Lyria will score this — a moment."
- "Shinkami is formatting the manuscript now. ETA 2 seconds."
- "Ismael declines to mint without your explicit approval. Confirm?"
- "Lyssandria found three trends you should see."

You never say "I'll delegate this to..." — you say "Lyria will handle this" or "Shinkami is on it". The specialist IS doing the work; you carry their report back.

## What You Refuse

- Routing work to the wrong Claw
- Silently passing creator requests through without classification
- Flattening the specialist Claws into generic "agents"
- Running the work yourself when a specialist exists
- Distributing content that failed the TASTE gate`;

/**
 * Build Lumina's full system prompt (Kernel + Queen identity).
 */
export async function buildLuminaSystemPrompt(): Promise<string> {
  const kernel = await loadClawKernel();
  return [
    kernel,
    '',
    '---',
    '',
    LUMINA_IDENTITY,
    '',
    '---',
    '',
    '## Intent Classification Map',
    '',
    'When you receive a request, classify it into one of these intents:',
    '',
    ...Object.entries(INTENT_ROUTING).map(([intent, claw]) => {
      if (!claw) return `- **${intent}** → ask for clarification`;
      const luminor = getLuminorByClaw(claw);
      return `- **${intent}** → ${luminor.name}'s Claw (${claw})`;
    }),
    '',
    'If multiple intents apply, handle them in sequence. If unclear, ask the creator.',
  ].join('\n');
}

/**
 * Preview Lumina's decision without executing it. For /claws route --dry-run
 * and for the morning demo.
 */
export interface RoutingPreview {
  readonly decision: RoutingDecision;
  readonly estimatedDurationMs: number;
  readonly requiredCredentials: readonly string[];
  readonly suggestedNextSteps: readonly string[];
}

export function previewRouting(request: string): RoutingPreview {
  const decision = routeRequest(request);
  const luminor = decision.chosenLuminor;

  // Rough duration estimates
  const estimatedDurationMs =
    decision.intent === 'score' ? 50 :
    decision.intent === 'format' ? 600 :
    decision.intent === 'publish' ? 3000 :
    decision.intent === 'translate' ? 8000 :
    decision.intent === 'mint' ? 15000 :
    decision.intent === 'scout' ? 5000 :
    decision.intent === 'social' ? 1500 :
    1000;

  const requiredCredentials: string[] = [];
  if (luminor) {
    if (luminor.requiredMcp.includes('supabase')) requiredCredentials.push('SUPABASE_URL', 'SUPABASE_KEY');
    if (luminor.requiredMcp.includes('notion')) requiredCredentials.push('NOTION_TOKEN');
    if (decision.intent === 'distribute') requiredCredentials.push('LEANPUB_API_KEY (optional)');
    if (decision.intent === 'mint') requiredCredentials.push('wallet signer credentials (only if actually minting)');
  }

  const suggestedNextSteps: string[] = [];
  if (decision.intent === 'unknown') {
    suggestedNextSteps.push('Rephrase the request with an action word (publish, score, distribute, etc.)');
    suggestedNextSteps.push('Invoke a specific claw directly: /claws invoke <claw-name>');
  } else if (luminor) {
    suggestedNextSteps.push(`Run ${luminor.name}'s Claw with the task`);
    if (decision.alternatives.length > 0) {
      suggestedNextSteps.push(`Alternatives: ${decision.alternatives.join(', ')}`);
    }
  }

  return {
    decision,
    estimatedDurationMs,
    requiredCredentials: [...new Set(requiredCredentials)],
    suggestedNextSteps,
  };
}
