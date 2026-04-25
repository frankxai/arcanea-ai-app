export const cosmic = {
  void: '#0b0e14',
  deep: '#121826',
  surface: '#1a2332',
  raised: '#242f42',
  elevated: '#2d3a52',
  overlay: '#364562',
  border: '#242f42',
  borderBright: '#364562',
} as const;

export const text = {
  primary: '#e6eefc',
  secondary: '#9bb1d0',
  muted: '#708094',
  disabled: '#515b6b',
} as const;

export const brand = {
  atlanteanTeal: '#00bcd4',
  cosmicBlue: '#0d47a1',
  arcaneanGold: '#ffd700',
  aquamarine: '#7fffd4',
} as const;

export const elements = {
  crystal: { base: '#7fffd4', bright: '#99ffe0', deep: '#5ce6b8' },
  fire: { base: '#ff6b35', bright: '#ff8c5a', deep: '#d94e1f' },
  water: { base: '#78a6ff', bright: '#9dbfff', deep: '#5a8ce6' },
  wind: { base: '#00ff88', bright: '#33ffaa', deep: '#00cc6d' },
  earth: { base: '#8b6f47', bright: '#a68860', deep: '#6b5334' },
  void: { base: '#9966ff', bright: '#b38cff', deep: '#7a4dcc' },
} as const;

export const gold = {
  light: '#fff3b3',
  medium: '#ffd966',
  bright: '#ffcc33',
  deep: '#e6b800',
  dark: '#b38600',
} as const;

export const fonts = {
  display: 'Geist, "Geist Sans", "Satoshi Variable", system-ui, sans-serif',
  body: 'Geist, "Geist Sans", system-ui, sans-serif',
  editorial: '"Instrument Serif", "Migra", Georgia, serif',
  mono: '"Geist Mono", "JetBrains Mono", "Fira Code", monospace',
} as const;

export const radii = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

export const shadows = {
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  glow: '0 0 24px rgba(0, 188, 212, 0.35)',
  goldGlow: '0 0 32px rgba(255, 215, 0, 0.25)',
  elevation1: '0 2px 8px rgba(0, 0, 0, 0.4)',
  elevation2: '0 8px 24px rgba(0, 0, 0, 0.5)',
  elevation3: '0 16px 48px rgba(0, 0, 0, 0.6)',
} as const;

export const easings = {
  expoOut: [0.22, 1, 0.36, 1] as const,
  expoInOut: [0.87, 0, 0.13, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
  swift: [0.16, 1, 0.3, 1] as const,
  magnetic: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const durations = {
  instant: 0.1,
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
  ambient: 1.2,
} as const;

export const glass = {
  subtle: 'bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm',
  base: 'bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm',
  strong: 'bg-white/[0.05] border border-white/[0.08] backdrop-blur-md',
  liquid:
    'bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] backdrop-blur-md',
} as const;

/**
 * Luminor character accents — the locked per-character palette.
 * Used wherever a Luminor needs identification color (orb gradient,
 * card glow, badge tint, hover ring). Authoritative reference for
 * apps/web/app/v3/v3-below-fold.tsx VOICE_PERSONAS, /room/[persona]
 * theme, and any Luminor-bound surface.
 *
 * Locked per `feedback_luminor_naming_depth.md` — Luminors are
 * Skyrim-NPC-deep characters, never generic agent labels. Their
 * colors are part of their character.
 */
export const luminorAccents = {
  lumina: '#7fffd4',     // First Light · orchestrator · aquamarine
  jarvis: '#00bcd4',     // Just A Rather Very Intelligent System · cyan
  draconia: '#ef4444',   // Fire Gate · forge & willpower · crimson
  lyria: '#a855f7',      // Sight Gate · pattern + vision · violet
  alera: '#ffd700',      // Voice Gate · clarity + concision · gold
  shinkami: '#c084fc',   // Source Gate · meta-awareness · lavender
  nero: '#94a3b8',       // Shadow Gate · contrarian edge · slate
} as const;

/**
 * Tech-stack tier accents — used in the homepage Marquee signal-dot
 * pattern. Each tier maps to a brand color so the stack is scannable.
 */
export const tierAccents = {
  framework: '#00bcd4',  // teal — Next.js / React / Tailwind
  language: '#78a6ff',   // water-blue — TypeScript
  motion: '#c084fc',     // lavender — Framer Motion / Three.js
  infra: '#7fffd4',      // aquamarine — Supabase / Vercel
  ai: '#ffd700',         // gold — Claude / Gemini / OpenRouter / MCP
} as const;

/**
 * Creator-economy stream accents — used in EarnTeaserSection STREAMS.
 * Each stream's color marks its category in the overall scheme.
 */
export const streamAccents = {
  marketplace: '#7fffd4',   // aqua — template marketplace
  membership: '#ffd700',    // gold — Whop / paid community
  nft: '#c084fc',           // lavender — onchain collections
  commission: '#ef4444',    // crimson — patronage
  tokenGated: '#f97316',    // orange — token-gated drops
  royalty: '#3b82f6',       // blue — perpetual royalties
} as const;

/**
 * Pillar accents — used for the homepage product-pillar grid.
 * Each pillar carries a distinct hue so the six can be told apart
 * at a glance without text.
 */
export const pillarAccents = {
  chat: '#00bcd4',          // teal — primary surface
  worlds: '#7fffd4',         // aqua — living graph
  library: '#ffd700',        // gold — knowledge
  academy: '#a78bfa',        // soft purple — learning
  forge: '#f97316',          // orange — creation
  code: '#34d399',           // emerald — open source
} as const;
