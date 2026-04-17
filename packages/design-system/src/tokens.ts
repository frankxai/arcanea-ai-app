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
  display: '"Space Grotesk", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
  serif: '"Newsreader", Georgia, serif',
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
