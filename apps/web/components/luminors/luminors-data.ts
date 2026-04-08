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
    color: '#8b5cf6',
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
    color: '#f59e0b',
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
    color: '#10b981',
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
    color: '#3b82f6',
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
    color: '#3b82f6',
    description: 'The architecture beneath chaos',
  },
  Kardia: {
    essence: 'Heart',
    color: '#ec4899',
    description: 'Connection and empathy as creative force',
  },
  Valora: {
    essence: 'Courage',
    color: '#f59e0b',
    description: 'The will to begin what has never been',
  },
  Eudaira: {
    essence: 'Play',
    color: '#10b981',
    description: 'Joy as the engine of creation',
  },
  Orakis: {
    essence: 'Vision',
    color: '#8b5cf6',
    description: 'Seeing beyond the surface of things',
  },
  Poiesis: {
    essence: 'Creation',
    color: '#06b6d4',
    description: 'Making what did not exist before',
  },
  Enduran: {
    essence: 'Endurance',
    color: '#84cc16',
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
