// Plain data — no client imports
// Icons are passed in teams-content.tsx to avoid pulling Phosphor into a non-client module

export const HERO_STATS = [
  { value: "7", label: "teams", color: "#7fffd4" },
  { value: "27", label: "repos", color: "#00bcd4" },
  { value: "MIT", label: "license", color: "#c084fc" },
  { value: "Discord + GitHub", label: "open channels", color: "#ffd700" },
];

export const PRINCIPLES = [
  {
    title: "Ship in public",
    body: "Every feature has a public spec, a public repo, a public Discord channel. No dark-mode development.",
    color: "#7fffd4",
    glyph: "◎",
  },
  {
    title: "BYOK everything",
    body: "Every team's output works with any LLM. No Arcanea-only paths. Bring your own keys, your own models.",
    color: "#00bcd4",
    glyph: "◈",
  },
  {
    title: "Creator-first",
    body: "Decisions routed through /community-hub. Every major change opens an AIP — Arcanean Improvement Proposal.",
    color: "#a855f7",
    glyph: "◐",
  },
  {
    title: "Minimal surface",
    body: "Each team owns at most 5 repos. If it grows beyond that, we split the team before we split focus.",
    color: "#ffd700",
    glyph: "◱",
  },
];

export const STACK_ROWS = [
  { team: "Luminor Intelligence", ide: "Claude Code", ai: "Claude Opus 4", deploy: "Vercel", docs: "Notion" },
  { team: "World Engine", ide: "Cursor", ai: "Gemini 3 Pro", deploy: "Supabase", docs: "Markdown" },
  { team: "Creator Platform", ide: "Windsurf", ai: "Claude Sonnet 4", deploy: "Vercel", docs: "Figma" },
  { team: "Protocol & Chain", ide: "VS Code", ai: "Claude Opus 4", deploy: "Base", docs: "Notion" },
  { team: "Infra & Ops", ide: "Claude Code", ai: "Claude Haiku", deploy: "Vercel + Supabase", docs: "Markdown" },
  { team: "Creator Success", ide: "Any", ai: "Claude Sonnet 4", deploy: "Discord / Whop", docs: "Notion" },
  { team: "Author & Lore", ide: "Obsidian", ai: "Claude Opus 4", deploy: "GitHub", docs: "Markdown" },
];

export const TEAM_MEMBERS = {
  "Luminor Intelligence": [
    { name: "Frank", role: "Lead" },
    { name: "Lumina", role: "Orchestrator" },
    { name: "Leyla", role: "Flow Gate" },
    { name: "Maylinn", role: "Heart Gate" },
    { name: "Seraph", role: "Intelligence" },
  ],
  "World Engine": [
    { name: "Frank", role: "Lead" },
    { name: "Oriax", role: "Architect" },
    { name: "Vael", role: "Schema" },
    { name: "Kael", role: "Search" },
  ],
  "Creator Platform": [
    { name: "Frank", role: "Lead" },
    { name: "Leyla", role: "Design" },
    { name: "Maylinn", role: "UX" },
    { name: "Zara", role: "Components" },
  ],
  "Protocol & Chain": [
    { name: "Frank", role: "Lead" },
    { name: "Kael", role: "Contracts" },
    { name: "Vael", role: "Spec" },
  ],
  "Infra & Ops": [
    { name: "Frank", role: "Lead" },
    { name: "Ori", role: "CI/CD" },
    { name: "Nexus", role: "Observability" },
  ],
  "Creator Success": [
    { name: "Frank", role: "Lead" },
    { name: "Maylinn", role: "Community" },
    { name: "Zara", role: "Support" },
    { name: "Lumi", role: "Contests" },
  ],
  "Author & Lore": [
    { name: "Frank", role: "Lead" },
    { name: "Maylinn", role: "Canon" },
    { name: "Leyla", role: "Voice" },
    { name: "Kael", role: "Lore" },
  ],
} as const;
