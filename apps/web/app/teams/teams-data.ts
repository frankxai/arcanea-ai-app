/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// Plain data — no client imports
// Icons are passed in teams-content.tsx to avoid pulling Phosphor into a non-client module

export const HERO_STATS = [
  { value: "7", label: "teams", color: "var(--arc-brand-atlantean-teal)" },
  { value: "27", label: "repos", color: "var(--arc-brand-atlantean-teal)" },
  { value: "MIT", label: "license", color: "var(--arc-void)" },
  { value: "Discord + GitHub", label: "open channels", color: "var(--arc-brand-arcanean-gold)" },
];

export const PRINCIPLES = [
  {
    title: "Ship in public",
    body: "Every feature has a public spec, a public repo, a public Discord channel. No dark-mode development.",
    color: "var(--arc-brand-atlantean-teal)",
    glyph: "◎",
  },
  {
    title: "BYOK everything",
    body: "Every team's output works with any LLM. No Arcanea-only paths. Bring your own keys, your own models.",
    color: "var(--arc-brand-atlantean-teal)",
    glyph: "◈",
  },
  {
    title: "Creator-first",
    body: "Decisions routed through /community-hub. Every major change opens an AIP — Arcanean Improvement Proposal.",
    color: "var(--arc-void)",
    glyph: "◐",
  },
  {
    title: "Minimal surface",
    body: "Each team owns at most 5 repos. If it grows beyond that, we split the team before we split focus.", // facts-ok
    color: "var(--arc-brand-arcanean-gold)",
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
