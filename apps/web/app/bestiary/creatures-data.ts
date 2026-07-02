/**
 * Bestiary of Creation — creature data.
 *
 * Shared between the /bestiary grid and /bestiary/[id] detail pages.
 */

export interface Creature {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  danger: "low" | "medium" | "high" | "critical";
  description: string;
  habitat: string;
  weakness: string;
  symptoms: string[];
  icon: string;
  color: string;
}

// Creative obstacle creatures from the Arcanea universe
export const CREATURES: Creature[] = [
  {
    id: 'procrastinox',
    name: 'Procrastinox',
    subtitle: 'The Tomorrow Serpent',
    category: 'Temporal Beast',
    danger: 'high',
    description:
      'A shape-shifting serpent that whispers "later" and "tomorrow" until all your days have passed. It feeds on unfulfilled potential.',
    habitat: 'Comfort zones, endless planning phases',
    weakness: 'Small, immediate actions. Cannot survive direct engagement.',
    symptoms: ['Endless planning', 'Waiting for the perfect moment', 'Starting tomorrow'],
    icon: '🐍',
    color: 'var(--arc-brand-cosmic-blue)',
  },
  {
    id: 'perfectus-demon',
    name: 'The Perfectus Demon',
    subtitle: 'Never Good Enough',
    category: 'Inner Critic',
    danger: 'critical',
    description:
      'A demon that makes every creation seem inadequate. It paralyzes creators by demanding impossible standards before the first stroke.',
    habitat: 'First drafts, revision stages',
    weakness: 'Deliberate imperfection. "Good enough" is its poison.',
    symptoms: ['Cannot finish anything', 'Endless revisions', 'Fear of sharing'],
    icon: '👹',
    color: 'var(--arc-fire)',
  },
  {
    id: 'comparison-wraith',
    name: 'Comparison Wraith',
    subtitle: 'The Shadow of Others',
    category: 'Spectral Parasite',
    danger: 'high',
    description:
      'A ghost that haunts creators by showing them only the polished work of others, never their struggles.',
    habitat: 'Social media, galleries, exhibitions',
    weakness: 'Focus on personal journey. Gratitude practice.',
    symptoms: ['Why bother?', "They're so much better", "I'll never be that good"],
    icon: '👻',
    color: 'var(--arc-void)',
  },
  {
    id: 'impostor-shade',
    name: 'The Impostor Shade',
    subtitle: 'Who Do You Think You Are?',
    category: 'Shadow Self',
    danger: 'high',
    description:
      'A dark reflection that questions your right to create. It whispers that you are a fraud waiting to be exposed.',
    habitat: 'Success moments, recognition events',
    weakness: 'Evidence collection. Recording compliments and wins.',
    symptoms: ['Feeling like a fraud', 'Attributing success to luck', 'Fear of exposure'],
    icon: '🌑',
    color: 'var(--arc-cosmic-void)',
  },
  {
    id: 'resistance-hydra',
    name: 'Resistance Hydra',
    subtitle: 'The Many-Headed Opposition',
    category: 'Mythic Beast',
    danger: 'critical',
    description:
      'A hydra that grows two excuses for every one you defeat. It is the universal force opposing all creative work.',
    habitat: 'The space between intention and action',
    weakness: 'Consistent daily practice. Showing up regardless.',
    symptoms: ['Always a reason not to', 'External blocks multiply', 'Everything feels hard'],
    icon: '🐉',
    color: 'var(--arc-fire)',
  },
  {
    id: 'shiny-object-sprite',
    name: 'Shiny Object Sprite',
    subtitle: 'The Distraction Fairy',
    category: 'Mischief Spirit',
    danger: 'medium',
    description:
      'A playful sprite that constantly presents new, exciting projects before the current one is complete.',
    habitat: 'Creative minds, research phases',
    weakness: 'Single project focus. Writing down new ideas for later.',
    symptoms: ['50 started projects', 'Nothing finished', 'New idea addiction'],
    icon: '✨',
    color: 'var(--arc-brand-arcanean-gold)',
  },
  {
    id: 'blank-page-void',
    name: 'Blank Page Void',
    subtitle: 'The Empty Abyss',
    category: 'Primordial Fear',
    danger: 'medium',
    description:
      'An infinite white emptiness that paralyzes creators before they begin. It feeds on the pressure to create something from nothing.',
    habitat: 'New documents, fresh canvases, empty tracks',
    weakness: 'Starting with anything. Bad first drafts. Stream of consciousness.',
    symptoms: ['Cannot start', 'Staring at empty space', 'Overthinking first moves'],
    icon: '📄',
    color: 'var(--arc-text-primary)',
  },
  {
    id: 'burnout-phoenix',
    name: 'Burnout Phoenix',
    subtitle: 'The Consuming Flame',
    category: 'Elemental Force',
    danger: 'critical',
    description:
      'A phoenix whose flames consume faster than they regenerate. It promises glory through exhaustion but delivers only ashes.',
    habitat: 'Hustle culture, deadline crunches',
    weakness: 'Rest. Sustainable pace. Saying no.',
    symptoms: ['Working through exhaustion', 'Loss of joy', 'Creative numbness'],
    icon: '🔥',
    color: 'var(--arc-fire)',
  },
  {
    id: 'fear-of-judgment-specter',
    name: 'Judgment Specter',
    subtitle: 'What Will They Think?',
    category: 'Social Phantom',
    danger: 'high',
    description:
      'An invisible audience that watches and criticizes every creative move. It speaks with the voices of everyone you know.',
    habitat: 'Public sharing moments, creative discussions',
    weakness: 'Creating for yourself first. Finding your true audience.',
    symptoms: ['Hiding work', 'Seeking constant validation', 'Creating for approval'],
    icon: '👁️',
    color: 'var(--arc-brand-cosmic-blue)',
  },
  {
    id: 'idea-thief',
    name: 'The Idea Thief',
    subtitle: 'Someone Will Steal It',
    category: 'Paranoia Sprite',
    danger: 'low',
    description:
      'A sneaky creature that convinces you to hoard ideas in secret, where they wither and die unshared.',
    habitat: 'Private notebooks, locked folders',
    weakness: 'Execution matters more than ideas. Sharing breeds abundance.',
    symptoms: ['Secret projects', 'Fear of discussing ideas', 'Competitive hoarding'],
    icon: '🦝',
    color: 'var(--arc-void)',
  },
];

export const DANGER_COLORS = {
  low: { bg: 'var(--arc-wind)20', text: 'var(--arc-wind)' },
  medium: { bg: 'var(--arc-brand-arcanean-gold)20', text: 'var(--arc-brand-arcanean-gold)' },
  high: { bg: 'var(--arc-fire)20', text: 'var(--arc-fire)' },
  critical: { bg: 'var(--arc-fire)20', text: 'var(--arc-fire)' },
} as const;

export function getCreature(id: string): Creature | undefined {
  return CREATURES.find((c) => c.id === id);
}
