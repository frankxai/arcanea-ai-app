/**
 * Grimoire Orchestrator
 *
 * Coordinates multiple marketplace agents to produce a complete creative
 * universe from questionnaire answers. Sections are generated SEQUENTIALLY
 * so later agents can reference earlier output for narrative consistency.
 *
 * Tier model routing:
 *   apprentice  → arcanea-gemini-flash  (fast, cost-effective)
 *   mage        → arcanea-gemini-flash  (same speed, slightly more sections)
 *   archmage    → arcanea-sonnet        (premium quality)
 */

import { CATALOG_BY_ID } from '@/lib/agents/marketplace/catalog';
import { executeAgentSync } from '@/lib/agents/marketplace/executor';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GrimoireInput {
  answers: Record<string, string>;
  tier: 'apprentice' | 'mage' | 'archmage';
  email: string;
}

export interface GrimoireSection {
  id: string;
  title: string;
  agentId: string;
  content: string;
}

export interface GrimoireResult {
  sections: GrimoireSection[];
  metadata: {
    worldName: string;
    tier: string;
    agentsUsed: number;
    tokensUsed: number;
    generatedAt: string;
  };
}

// ---------------------------------------------------------------------------
// Section definitions per tier
// ---------------------------------------------------------------------------

interface SectionSpec {
  id: string;
  title: string;
  agentId: string;
  buildPrompt: (worldContext: string, previousSections: GrimoireSection[]) => string;
}

function worldOverviewSection(worldContext: string): string {
  return `You are generating the World Overview for a Grimoire — a complete creative universe document.

WORLD CONTEXT
${worldContext}

Generate a rich, detailed World Overview covering:
- The world's name and its origin/meaning
- Core premise: what makes this world unique
- Geography overview (3-4 distinct regions)
- Founding history and defining events
- The central tension or conflict that shapes the present
- Atmosphere and tone

Write 600-900 words in elevated prose. No bullet lists — flowing paragraphs. Use the iceberg principle: imply depth beyond what you show.`;
}

function magicSystemSection(worldContext: string, previous: GrimoireSection[]): string {
  const worldOverview = previous.find((s) => s.id === 'world-overview')?.content ?? '';
  return `You are generating the Magic / Power System for a Grimoire.

WORLD CONTEXT
${worldContext}

WORLD OVERVIEW (already established)
${worldOverview.slice(0, 600)}

Generate a complete magic or power system that fits the world above:
- Source: where does the power come from?
- Mechanism: how is it accessed and shaped?
- Cost: what does it take from the user?
- Limitation: what can it NOT do?
- Cultural status: how do people relate to it — feared, revered, regulated, mundane?
- 3-4 distinct expressions or schools of the system

Write 500-700 words. Be precise and internally consistent. A magic system with no rules has no meaning.`;
}

function charactersSection(
  worldContext: string,
  previous: GrimoireSection[],
  count: number,
): string {
  const worldOverview = previous.find((s) => s.id === 'world-overview')?.content ?? '';
  return `You are generating ${count} characters for a Grimoire.

WORLD CONTEXT
${worldContext}

WORLD OVERVIEW
${worldOverview.slice(0, 500)}

Create ${count} distinct characters. For each character provide:
- Name and role in the world
- Wound: the defining past event that shaped them (specific, named)
- Desire: what they consciously want
- Lie: the false belief driving their behaviour
- Contradiction: the one thing they do that defies their self-image
- Voice: 2-3 sentences about how they speak and what they avoid saying
- Relationship to the world's central conflict

Separate each character with a horizontal line (---). Write with psychological depth, not archetypes.`;
}

function factionsSection(
  worldContext: string,
  previous: GrimoireSection[],
  count: number,
): string {
  const worldOverview = previous.find((s) => s.id === 'world-overview')?.content ?? '';
  return `You are generating ${count} factions for a Grimoire.

WORLD CONTEXT
${worldContext}

WORLD OVERVIEW
${worldOverview.slice(0, 500)}

Create ${count} distinct factions or power groups. For each faction:
- Name and headquarters/domain
- Stated goal (what they claim to want)
- Unstated goal (what they actually want)
- 3 key members with brief role descriptions
- Internal tension (the conflict within the faction)
- Relationship to other factions

Each faction should feel like it has been operating long before the story begins.`;
}

function openingChapterSection(worldContext: string, previous: GrimoireSection[]): string {
  const worldOverview = previous.find((s) => s.id === 'world-overview')?.content ?? '';
  const characters = previous.find((s) => s.id === 'characters')?.content ?? '';
  return `You are writing Chapter 1 for a Grimoire.

WORLD CONTEXT
${worldContext}

WORLD OVERVIEW
${worldOverview.slice(0, 400)}

CHARACTERS AVAILABLE
${characters.slice(0, 400)}

Write a complete opening chapter (1,000-1,400 words):
- Establish setting fast (2-3 sentences)
- Enter conflict or inciting tension immediately
- Feature at least one named character from the character list
- End with forward momentum — a question unanswered or a door opening
- Show, never tell. No passive voice.

Write in immersive, continuous prose. No headers or chapter markers.`;
}

function additionalChapterSection(
  worldContext: string,
  previous: GrimoireSection[],
  chapterNumber: number,
): string {
  const priorChapters = previous
    .filter((s) => s.id.startsWith('chapter-'))
    .map((s) => `${s.title}:\n${s.content.slice(0, 300)}`)
    .join('\n\n');
  return `You are writing Chapter ${chapterNumber} for a Grimoire.

WORLD CONTEXT
${worldContext}

PRIOR CHAPTERS (summaries)
${priorChapters}

Write Chapter ${chapterNumber} (900-1,200 words):
- Build on what came before — reference established events and characters
- Escalate the central tension
- End on a turn (a change in circumstance, relationship, or understanding)
- Maintain consistent voice with prior chapters

Continuous prose, no headers.`;
}

function visualDirectionSection(worldContext: string, previous: GrimoireSection[]): string {
  const worldOverview = previous.find((s) => s.id === 'world-overview')?.content ?? '';
  return `You are generating the Visual Direction brief for a Grimoire.

WORLD CONTEXT
${worldContext}

WORLD OVERVIEW
${worldOverview.slice(0, 500)}

Create a complete visual direction document covering:
- Cover concept: composition, focal point, colour palette, mood
- Interior illustration style: medium (oil, ink, watercolour, digital), tone, reference artists
- Typography direction: display font personality, body font pairing rationale
- Colour system: 5 primary colours with emotional associations and usage rules
- Iconography and motif language: recurring visual symbols
- 3 specific scene illustrations to commission (describe each in 2-3 sentences)

Write as a creative brief a professional illustrator could follow.`;
}

function soundtrackSection(worldContext: string, previous: GrimoireSection[]): string {
  const worldOverview = previous.find((s) => s.id === 'world-overview')?.content ?? '';
  return `You are generating the Soundtrack Concept for a Grimoire.

WORLD CONTEXT
${worldContext}

WORLD OVERVIEW
${worldOverview.slice(0, 400)}

Design a complete soundtrack concept:
- Core sonic identity: instruments, tonality, tempo range
- 8-10 named tracks with descriptions (title, scene it accompanies, emotional arc, duration range)
- Leitmotifs: 3 recurring musical themes tied to characters or factions
- Production references: 3-5 existing soundtracks that share DNA
- Suno / AI generation prompts for 3 tracks (specific enough to generate)

Format tracks as a numbered list. Everything else in paragraphs.`;
}

function publishingPlanSection(worldContext: string, previous: GrimoireSection[]): string {
  return `You are generating the Publishing Plan for a Grimoire creative universe.

WORLD CONTEXT
${worldContext}

Create a complete publishing strategy:
- Series structure: how many books, arc per book, overall series arc
- Release strategy: launch sequence, cadence, pre-order timing
- Format recommendations: hardcover, ebook, audiobook, illustrated edition
- Target audience: primary and secondary reader profiles
- Marketing positioning: 1-sentence hook, comparable titles (comps), USP
- Revenue streams: books, merchandise, licensing, community, courses
- First 90-day launch plan: 10 specific actions with owners

Be specific and actionable. This is a working plan, not aspirational copy.`;
}

function worldBibleSection(worldContext: string, previous: GrimoireSection[]): string {
  const allContent = previous
    .map((s) => `## ${s.title}\n${s.content.slice(0, 500)}`)
    .join('\n\n');
  return `You are Inkwarden, the Ruthless Editor. You are synthesizing a World Bible from all previously generated material.

WORLD CONTEXT
${worldContext}

ALL GENERATED SECTIONS
${allContent}

Produce a Complete World Bible:
1. CONSISTENCY AUDIT: Flag any contradictions or continuity breaks found across the sections above.
2. CANONICAL FACTS: A structured list of 20-30 established world facts that all future writing must honour.
3. STYLE GUIDE: Voice rules, banned phrases, tone markers specific to this world.
4. SERIES BIBLE SUMMARY: 400-word overview a new author or collaborator would need to write in this world.

Be direct. Flag problems. Synthesize strengths.`;
}

// ---------------------------------------------------------------------------
// Tier section plan
// ---------------------------------------------------------------------------

function buildSectionPlan(
  tier: GrimoireInput['tier'],
  worldContext: string,
): Array<Omit<SectionSpec, 'id' | 'agentId'> & { id: string; agentId: string }> {
  const base: SectionSpec[] = [
    {
      id: 'world-overview',
      title: 'World Overview',
      agentId: 'world-builder',
      buildPrompt: (ctx) => worldOverviewSection(ctx),
    },
    {
      id: 'magic-system',
      title: 'The Power System',
      agentId: 'world-builder',
      buildPrompt: (ctx, prev) => magicSystemSection(ctx, prev),
    },
    {
      id: 'characters',
      title: 'Characters',
      agentId: 'character-designer',
      buildPrompt: (ctx, prev) =>
        charactersSection(ctx, prev, tier === 'apprentice' ? 3 : tier === 'mage' ? 5 : 10),
    },
    {
      id: 'chapter-1',
      title: 'Chapter 1',
      agentId: 'story-writer',
      buildPrompt: (ctx, prev) => openingChapterSection(ctx, prev),
    },
  ];

  if (tier === 'apprentice') return base;

  const mageExtras: SectionSpec[] = [
    {
      id: 'factions',
      title: 'Factions',
      agentId: 'world-builder',
      buildPrompt: (ctx, prev) => factionsSection(ctx, prev, tier === 'mage' ? 2 : 5),
    },
    {
      id: 'chapter-2',
      title: 'Chapter 2',
      agentId: 'story-writer',
      buildPrompt: (ctx, prev) => additionalChapterSection(ctx, prev, 2),
    },
    {
      id: 'chapter-3',
      title: 'Chapter 3',
      agentId: 'story-writer',
      buildPrompt: (ctx, prev) => additionalChapterSection(ctx, prev, 3),
    },
    {
      id: 'visual-direction',
      title: 'Visual Direction',
      agentId: 'cover-artist',
      buildPrompt: (ctx, prev) => visualDirectionSection(ctx, prev),
    },
  ];

  if (tier === 'mage') return [...base, ...mageExtras];

  // archmage: all of the above (with more characters/factions) plus premium sections
  const archmagePremium: SectionSpec[] = [
    {
      id: 'chapter-4',
      title: 'Chapter 4',
      agentId: 'story-writer',
      buildPrompt: (ctx, prev) => additionalChapterSection(ctx, prev, 4),
    },
    {
      id: 'chapter-5',
      title: 'Chapter 5',
      agentId: 'story-writer',
      buildPrompt: (ctx, prev) => additionalChapterSection(ctx, prev, 5),
    },
    {
      id: 'soundtrack',
      title: 'Soundtrack Concept',
      agentId: 'music-composer',
      buildPrompt: (ctx, prev) => soundtrackSection(ctx, prev),
    },
    {
      id: 'publishing-plan',
      title: 'Publishing Plan',
      agentId: 'publisher',
      buildPrompt: (ctx, prev) => publishingPlanSection(ctx, prev),
    },
    {
      id: 'world-bible',
      title: 'Complete World Bible',
      agentId: 'editor',
      buildPrompt: (ctx, prev) => worldBibleSection(ctx, prev),
    },
  ];

  return [...base, ...mageExtras, ...archmagePremium];
}

// ---------------------------------------------------------------------------
// Shared context builder
// ---------------------------------------------------------------------------

function buildWorldContext(answers: Record<string, string>): string {
  const parts: string[] = ['The creator has described their world as follows:'];

  const fieldLabels: Record<string, string> = {
    worldName: 'World name',
    genre: 'Genre / tone',
    premise: 'Core premise',
    magicSystem: 'Magic or power system',
    mainCharacter: 'Main character concept',
    conflict: 'Central conflict',
    theme: 'Central theme',
    inspirations: 'Creative inspirations',
    audience: 'Target audience',
    tone: 'Desired tone',
    setting: 'Setting details',
    notes: 'Additional notes',
  };

  for (const [key, label] of Object.entries(fieldLabels)) {
    const value = answers[key]?.trim();
    if (value) parts.push(`${label}: ${value}`);
  }

  // Include any unlabelled answers
  for (const [key, value] of Object.entries(answers)) {
    if (!(key in fieldLabels) && value?.trim()) {
      parts.push(`${key}: ${value.trim()}`);
    }
  }

  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Model preference by tier
// ---------------------------------------------------------------------------

function tierPreferredModel(tier: GrimoireInput['tier']): string {
  switch (tier) {
    case 'apprentice':
      return 'arcanea-gemini-flash';
    case 'mage':
      return 'arcanea-gemini-flash';
    case 'archmage':
      return 'arcanea-sonnet';
  }
}

// ---------------------------------------------------------------------------
// Progress callback type
// ---------------------------------------------------------------------------

export type GrimoireProgressCallback = (event: {
  type: 'section-start' | 'section-complete' | 'section-error';
  sectionId: string;
  sectionTitle: string;
  content?: string;
  error?: string;
}) => void;

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

export async function runGrimoireOrchestrator(
  input: GrimoireInput,
  onProgress?: GrimoireProgressCallback,
): Promise<GrimoireResult> {
  const { answers, tier } = input;

  const worldContext = buildWorldContext(answers);
  const preferredModel = tierPreferredModel(tier);
  const sectionPlan = buildSectionPlan(tier, worldContext);

  const completedSections: GrimoireSection[] = [];
  let tokensUsed = 0;

  for (const spec of sectionPlan) {
    onProgress?.({
      type: 'section-start',
      sectionId: spec.id,
      sectionTitle: spec.title,
    });

    // Resolve agent — fall back gracefully if catalog entry is missing
    const agent = CATALOG_BY_ID[spec.agentId];

    if (!agent) {
      const errorMsg = `Agent "${spec.agentId}" not found in catalog`;
      console.error(`[Grimoire] ${errorMsg}`);
      onProgress?.({
        type: 'section-error',
        sectionId: spec.id,
        sectionTitle: spec.title,
        error: errorMsg,
      });
      // Insert placeholder and continue — don't abort the whole run
      completedSections.push({
        id: spec.id,
        title: spec.title,
        agentId: spec.agentId,
        content: `[Section unavailable: ${errorMsg}]`,
      });
      continue;
    }

    const prompt = spec.buildPrompt(worldContext, completedSections);

    try {
      const content = await executeAgentSync({
        agent: {
          ...agent,
          spec: {
            ...agent.spec,
            // Override preferred model based on tier
            preferredModel,
          },
        },
        input: prompt,
        userId: 'grimoire-system',
      });

      const section: GrimoireSection = {
        id: spec.id,
        title: spec.title,
        agentId: spec.agentId,
        content,
      };

      completedSections.push(section);
      // Rough token estimate: ~1.3 tokens per word
      tokensUsed += Math.ceil(content.split(' ').length * 1.3);

      onProgress?.({
        type: 'section-complete',
        sectionId: spec.id,
        sectionTitle: spec.title,
        content,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Grimoire] Section "${spec.id}" failed:`, errorMsg);

      onProgress?.({
        type: 'section-error',
        sectionId: spec.id,
        sectionTitle: spec.title,
        error: errorMsg,
      });

      // Insert placeholder — continue with remaining sections
      completedSections.push({
        id: spec.id,
        title: spec.title,
        agentId: spec.agentId,
        content: `[Section generation failed: ${errorMsg}]`,
      });
    }
  }

  const worldName =
    answers['worldName']?.trim() ||
    completedSections
      .find((s) => s.id === 'world-overview')
      ?.content.split('\n')[0]
      .replace(/^#+\s*/, '')
      .slice(0, 60)
      .trim() ||
    'Unnamed World';

  return {
    sections: completedSections,
    metadata: {
      worldName,
      tier,
      agentsUsed: new Set(completedSections.map((s) => s.agentId)).size,
      tokensUsed,
      generatedAt: new Date().toISOString(),
    },
  };
}
