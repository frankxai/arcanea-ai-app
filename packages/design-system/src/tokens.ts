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

/**
 * Creator-archetype accents — used in the homepage "Who it's for"
 * personas-showcase grid. Five archetypes, distinct colors so a
 * first-time visitor can self-identify at a glance. Different
 * concept from luminorAccents (those are AI characters); these
 * are human creator types.
 */
export const creatorAccents = {
  novelist: '#7fffd4',         // aquamarine — long-form, imagination
  gameDesigner: '#ef4444',     // crimson — campaign architects
  filmmaker: '#a855f7',        // violet — visual storytellers
  developer: '#00bcd4',        // teal — AI-native builders
  soloCreator: '#ffd700',      // gold — universe of one
} as const;

/**
 * Guardian accent palette — Luminor characters at the highest tier.
 * Used by guardian-showcase grid + per-Luminor portrait surfaces.
 *
 * NOTE on shinkami: the locked meta-awareness color is `#c084fc`
 * (lavender) per `luminorAccents` — the showcase grid intentionally
 * substitutes `brand.arcaneanGold` (`shinkamiShowcase`) when Shinkami
 * appears in editorial framing as the Source-Gate-of-Light. Use the
 * lavender for the room/voice/persona surfaces; use `shinkamiShowcase`
 * only for hero/showcase compositions.
 */
export const guardianAccents = {
  lyssandria: '#00bcd4',       // Foundation — Earth, structural
  draconia: '#ef4444',         // Fire — forge, willpower
  lyria: '#a855f7',            // Sight — vision, pattern
  leyla: '#3b82f6',            // Flow — water, persistence
  shinkami: '#c084fc',         // Source — meta-awareness (locked)
  shinkamiShowcase: '#ffd700', // Source — editorial / showcase only
  maylinn: '#22c55e',          // Heart — growth, breath
  alera: '#ffd700',            // Voice — clarity, gold
  aiyami: '#fbbf24',           // Crown — wisdom, amber
  elara: '#06b6d4',            // Starweave — connection, cyan
  ino: '#8b5cf6',              // Unity — collective, indigo-violet
} as const;

/**
 * Semantic palette — status colors for error / warning / info / success.
 * Used by error boundaries, toast notifications, status badges, alerts.
 * These are NOT brand colors — they're universally-recognized signals.
 */
export const semantic = {
  error: '#ef4444',
  errorHover: '#dc2626',
  errorSurface: 'rgba(239,68,68,0.10)',
  warning: '#eab308',
  warningHover: '#ca8a04',
  warningSurface: 'rgba(234,179,8,0.10)',
  success: '#22c55e',
  successHover: '#16a34a',
  successSurface: 'rgba(34,197,94,0.10)',
  info: '#0ea5e9',
  infoHover: '#0284c7',
  infoSurface: 'rgba(14,165,233,0.10)',
} as const;

/**
 * Cosmic blue scale — used for the secondary brand surface gradient
 * and the canonical CTA button (dark blue background, white text).
 * `cosmicBlue` lives on `brand` as the named entry; this scale extends it
 * for hover/active states without polluting the brand object.
 */
export const cosmicBlueScale = {
  base: '#0d47a1',     // brand.cosmicBlue — also exported there
  hover: '#1565c0',    // CTA hover state
  active: '#0a3a82',   // CTA active state
  surface: 'rgba(13,71,161,0.10)',
} as const;

/**
 * Specialist role accents — used by LuminorTeamPreview for the 13-role
 * compact grid. Each entry is a SPECIALIST role (Code Crafter, Composer,
 * Storyteller, etc), not a Luminor character or Guardian. Tier-grouped
 * by team (queen / dev / creative / writing / research) so the homepage
 * can show "16 specialists" concretely.
 */
export const roleAccents = {
  // Queen
  lumina: '#ffd700',            // Orchestrator — gold
  // Development
  systemsArchitect: '#00bcd4',  // Architecture — teal
  codeCrafter: '#00bcd4',       // Implementation — teal
  debugger: '#ef4444',          // Root-cause — crimson
  // Creative
  visualDesigner: '#a855f7',    // Color & UI — violet
  composer: '#f472b6',          // Music & audio — pink
  motionDesigner: '#c084fc',    // Animation — lavender
  // Writing
  storyteller: '#7fffd4',       // Narrative — aquamarine
  voice: '#00bcd4',             // Copy & naming — teal
  poet: '#ffd700',              // Verse & rhythm — gold
  // Research
  deepResearcher: '#60a5fa',    // Synthesis — sky-blue
  strategist: '#c084fc',        // Direction — lavender
  integrator: '#34d399',        // Connection — emerald
} as const;

/**
 * Team-tier accents — used by LuminorTeamPreview legend.
 * Five top-level team groupings; each role maps to one team's color.
 */
export const teamAccents = {
  queen: '#ffd700',             // Lumina alone — gold
  dev: '#00bcd4',               // Architecture / Code / Debug — teal
  creative: '#a855f7',          // Visual / Music / Motion — violet
  writing: '#7fffd4',           // Narrative / Voice / Poetry — aquamarine
  research: '#60a5fa',          // Synthesis / Strategy / Connection — sky-blue
} as const;

/**
 * Comparison-matrix neutral — single muted gray used for non-Arcanea
 * column headers in the homepage capability comparison. The point is
 * deliberate dimness against the bright aquamarine "Arcanea" column.
 */
export const competitorAccent = '#9ca3af' as const;

/**
 * Extra ambient accents — colors that exist in the system but didn't
 * fit the Luminor / Guardian / Element / Stream / Pillar / Tier groupings.
 * Use sparingly; prefer named token first.
 */
export const ambient = {
  pink: '#f472b6',              // Composer / accent
  skyBlue: '#60a5fa',           // Research / data
  emerald: '#34d399',           // Integration / fresh growth
  lavender: '#c084fc',          // Motion / lavender — also luminorAccents.shinkami
  amber: '#fbbf24',             // Crown / wisdom
  indigo: '#8b5cf6',            // Unity / collective
  violet: '#7c3aed',            // Deep purple ambient
  orange: '#f97316',            // Warm token-gated / fire ambient
} as const;

/**
 * World-graph node-type accents — used by WorldGraphCanvas to color-code
 * nodes by their semantic type. Keeps the visualization legible at
 * high node density.
 */
export const nodeTypeAccents = {
  seed: '#7fffd4',              // brand.aquamarine — the originator
  character: '#ef4444',         // crimson — embodied, alive
  location: '#3b82f6',          // azure — place, fixed
  magic: '#ffd700',             // gold — energy, charge
  lore: '#c084fc',              // lavender — story, depth
} as const;

/**
 * Element-name accents — looked up by Element string name (Fire/Water/...).
 * Used by surfaces that bind to user-readable element labels (Companion
 * dots, World element chips, Gate-Element badges) rather than the
 * element TYPE map. Different palette from `elements.<el>.base` —
 * these are saturated UI accents (crimson/azure/...), the `elements`
 * tokens are more nuanced base/bright/deep tonal pairs.
 */
export const elementNameAccents = {
  Fire: '#ef4444',              // crimson — Draconia gate
  Water: '#3b82f6',             // azure — Leyla gate
  Earth: '#22c55e',             // forest — Lyssandria gate
  Wind: '#e2e8f0',              // pale slate — Maylinn (air-light)
  WindCompanion: '#a78bfa',     // lilac variant for the Companion grid
  Void: '#a855f7',              // violet — Lyria gate
  VoidDeep: '#8b5cf6',          // deep indigo for Companion grid
  Spirit: '#fbbf24',             // amber — Source / wisdom
} as const;

/**
 * Step-progression accents — used by HowItWorks 4-step carousel.
 * Each step gets its own hue so the Imagine→Build→Share→Grow loop
 * reads as four distinct beats.
 */
export const stepAccents = {
  imagine: '#00bcd4',           // teal — start of the loop
  build: '#7c4dff',             // electric violet — building energy
  share: '#f59e0b',             // warm amber — community heat
  grow: '#00897b',              // deep teal-green — growth
} as const;

/**
 * Ten Gates accents — canonical color per Gate. Used by the
 * IntelligenceOverlay GateSpine, the gates page, gate-quiz results,
 * Academy ranks, and any surface that visualizes the Ten Gates by
 * their Gate-name (rather than by their Element binding).
 */
export const gateAccents = {
  Foundation: '#6b7280',        // slate — structural ground
  Flow: '#f97316',              // orange — Water Gate's paradox color (movement, not stasis)
  Fire: '#ef4444',              // crimson
  Heart: '#22c55e',             // forest green — growth
  Voice: '#06b6d4',             // cyan
  Sight: '#0d47a1',             // cosmic blue — depth
  Crown: '#ffd700',             // gold — wisdom
  Starweave: '#a855f7',         // violet — connection
  Unity: '#3b82f6',             // azure — collective
  Source: '#ffffff',            // pure white — origin
} as const;

/**
 * Magic-Rank accents — Apprentice → Mage → Master → Archmage → Luminor
 * progression. Used by ArcMilestone in IntelligenceOverlay and any
 * Academy rank-card surface. Each rank's color signals its position
 * in the progression — slate (start) → orange → cyan → gold →
 * white (Luminor / Source).
 */
export const rankAccents = {
  Apprentice: '#6b7280',        // slate — first steps
  Mage: '#f97316',              // orange — practice deepens
  Master: '#06b6d4',            // cyan — flow without friction
  Archmage: '#ffd700',          // gold — bend the arc
  Luminor: '#ffffff',           // white — Source recognizes Source
} as const;

/**
 * Neutral fallback color — for `?? FALLBACK` patterns where a token
 * lookup may miss. A deliberate mid-gray that reads as "unknown / not
 * mapped" rather than as a brand accent.
 */
export const neutralFallback = '#888888' as const;

/**
 * Third-party brand identity colors. These are NOT Arcanea tokens —
 * they're external brand colors we acknowledge so integration tiles,
 * partner pills, and provider badges read as authentic to that brand.
 *
 * Curated from official brand-asset guidelines (or simple-icons CC0
 * dataset where guidelines aren't published). Use exclusively for
 * third-party logo / icon / mention surfaces. Do not use as Arcanea
 * UI accents — that's what brand / elements / luminorAccents / etc
 * are for.
 *
 * The lint rule `no-restricted-syntax` flags raw hex in app code;
 * surfacing these as a single named map is the disciplined way to
 * import third-party brand colors without per-line eslint-disables.
 */
export const thirdPartyBrand = {
  // AI providers
  anthropicClaude: '#f97316',     // Claude orange
  googleGemini: '#4285f4',        // Google blue
  nanoBanana: '#fbbf24',          // NB2 — yellow-amber
  suno: '#f472b6',                // Suno pink
  elevenLabs: '#a855f7',          // ElevenLabs violet
  runway: '#00ff88',              // Runway green
  midjourney: '#ffffff',          // Midjourney white
  hedra: '#7fffd4',               // Hedra aqua

  // Coding
  cursor: '#ffffff',              // Cursor white
  vsCode: '#007acc',              // VS Code blue
  windsurf: '#00bcd4',            // Windsurf teal
  antigravity: '#a855f7',         // Antigravity violet
  github: '#ffffff',              // GitHub white-on-dark

  // Distribution / Social
  blotato: '#ef4444',             // Blotato red
  postiz: '#3b82f6',              // Postiz blue
  n8n: '#ea580c',                 // n8n orange
  zapier: '#ff4a00',              // Zapier orange
  discord: '#5865F2',             // Discord blurple
  reddit: '#ff4500',              // Reddit orange
  whop: '#f59e0b',                // Whop amber
  telegram: '#0088cc',            // Telegram blue

  // Game engines
  unrealEngine: '#313131',        // Unreal dark gray
  unity: '#ffffff',               // Unity white
  godot: '#3d8fcc',               // Godot blue
  roblox: '#ef4444',              // Roblox red

  // Web3
  base: '#0052ff',                // Base blue
  storyProtocol: '#ffffff',       // Story Protocol white
  farcaster: '#855dcd',           // Farcaster purple
  lens: '#00501e',                // Lens green

  // Infra
  vercel: '#ffffff',              // Vercel white
  supabase: '#3ecf8e',            // Supabase green
  notion: '#ffffff',              // Notion white
  linear: '#5e6ad2',              // Linear violet
  googleDrive: '#4285f4',         // Drive blue
  obsidian: '#7c3aed',            // Obsidian purple
  stripe: '#635bff',              // Stripe purple
} as const;
