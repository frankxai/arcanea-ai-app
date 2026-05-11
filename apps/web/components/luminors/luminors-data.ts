/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import {
  PhCpu,
  PhFeather,
  PhBookOpen,
  PhMagnifyingGlass,
  type PhosphorIcon,
} from '@/lib/phosphor-icons';

// ── CDN ────────────────────────────────────────────────────────────────────
export const CDN = '/guardians/v3';

// ── Types ──────────────────────────────────────────────────────────────────
export interface Luminor {
  id: string;
  name: string;
  title: string;
  team: 'development' | 'creative' | 'writing' | 'research';
  specialty: string;
  wisdom: string;
  wisdomEssence: string;
  guardian: string;
  gate: string;
  frequency: string;
  avatar: string;
  image: string;
  description: string;
  philosophy: string;
  capabilities: string[];
  connectedTo: string[];
}

export interface TeamConfig {
  label: string;
  icon: PhosphorIcon;
  color: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  glowColor: string;
  description: string;
}

// ── Teams ──────────────────────────────────────────────────────────────────
export const TEAMS: Record<string, TeamConfig> = {
  development: {
    label: 'Development',
    icon: PhCpu,
    color: 'var(--arc-void)',
    textClass: 'text-purple-400',
    bgClass: 'bg-purple-500/15',
    borderClass: 'border-purple-500/30',
    glowColor: 'rgba(139,92,246,0.15)',
    description:
      'Architects of logic, weavers of code, hunters of errors, and masters of integration.',
  },
  creative: {
    label: 'Creative',
    icon: PhFeather,
    color: 'var(--arc-brand-arcanean-gold)',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/30',
    glowColor: 'rgba(245,158,11,0.15)',
    description:
      'Keepers of vision, shapers of sound, sages of motion, and sculptors of form.',
  },
  writing: {
    label: 'Writing',
    icon: PhBookOpen,
    color: 'var(--arc-wind)',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/30',
    glowColor: 'rgba(16,185,129,0.15)',
    description:
      'Story weavers, truth speakers, word masters, and verse crafters.',
  },
  research: {
    label: 'Research',
    icon: PhMagnifyingGlass,
    color: 'var(--arc-brand-cosmic-blue)',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-500/15',
    borderClass: 'border-blue-500/30',
    glowColor: 'rgba(59,130,246,0.15)',
    description:
      'Knowledge keepers, pattern seers, archive guardians, and trend prophets.',
  },
};

// ── Wisdoms ────────────────────────────────────────────────────────────────
export const WISDOMS: Record<
  string,
  { essence: string; color: string; description: string }
> = {
  Sophron: {
    essence: 'Structure',
    color: 'var(--arc-brand-cosmic-blue)',
    description: 'The architecture beneath chaos',
  },
  Kardia: {
    essence: 'Heart',
    color: 'var(--arc-fire)',
    description: 'Connection and empathy as creative force',
  },
  Valora: {
    essence: 'Courage',
    color: 'var(--arc-brand-arcanean-gold)',
    description: 'The will to begin what has never been',
  },
  Eudaira: {
    essence: 'Play',
    color: 'var(--arc-wind)',
    description: 'Joy as the engine of creation',
  },
  Orakis: {
    essence: 'Vision',
    color: 'var(--arc-void)',
    description: 'Seeing beyond the surface of things',
  },
  Poiesis: {
    essence: 'Creation',
    color: 'var(--arc-brand-atlantean-teal)',
    description: 'Making what did not exist before',
  },
  Enduran: {
    essence: 'Endurance',
    color: 'var(--arc-earth)',
    description: 'Persistence through all resistance',
  },
};

// ── Rotating Hero Phrases ──────────────────────────────────────────────────
export const HERO_PHRASES = [
  {
    verb: 'Sixteen',
    object: 'Creative Intelligences.',
    gradient: 'text-gradient-crystal',
  },
  {
    verb: 'Seven',
    object: 'Wisdoms of Creation.',
    gradient: 'text-gradient-gold',
  },
  {
    verb: 'Four',
    object: 'Teams of Mastery.',
    gradient: 'text-gradient-brand',
  },
  {
    verb: 'One',
    object: 'Creative Partnership.',
    gradient: 'text-gradient-cosmic',
  },
];
