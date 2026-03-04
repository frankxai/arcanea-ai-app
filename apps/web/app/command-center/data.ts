// ─── Command Center Data Module ──────────────────────────────────────────────
// Encodes the current Arcanea ecosystem state for the Command Center dashboard.
// Source of truth: .arcanea/projects/milestones/, pnpm-workspace.yaml, progress.md

export type MilestoneStatus = 'active' | 'blocked' | 'planned' | 'completed';
export type PackageStatus = 'published' | 'private' | 'alpha' | 'stale';
export type PackageHealth = 'good' | 'warning' | 'stale';
export type ElementVariant = 'crystal' | 'fire' | 'water' | 'void' | 'gold' | 'brand';

// ─── Milestones ─────────────────────────────────────────────────────────────

export interface Milestone {
  id: string;
  name: string;
  description: string;
  guardian: string;
  element: ElementVariant;
  progress: number;
  status: MilestoneStatus;
  tasksTotal: number;
  tasksDone: number;
  blocked: number;
  target: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'M001',
    name: 'Supabase Auth & Storage Wiring',
    description: 'Full auth flow — SSR-safe client, profile system, 7 tables with RLS, 4 storage buckets, 5 services. Studio wired, auth redirects fixed. Vercel env vars remaining.',
    guardian: 'Lyssandria',
    element: 'crystal',
    progress: 71,
    status: 'active',
    tasksTotal: 17,
    tasksDone: 12,
    blocked: 1,
    target: 'W10',
  },
  {
    id: 'M002',
    name: 'Cloudflare Stream for Video',
    description: 'Video hosting and streaming via Cloudflare Stream — tus.js upload, HLS player, CDN delivery. Blocked by M001.',
    guardian: 'Leyla',
    element: 'water',
    progress: 0,
    status: 'planned',
    tasksTotal: 6,
    tasksDone: 0,
    blocked: 0,
    target: 'W14',
  },
  {
    id: 'M003',
    name: 'Memory System v1 Launch',
    description: 'StarlightVaults with 6 vaults, ArcaneMD format, CLI binary, MEMORY.md bridge. 38/38 tests. MCP server + web API remaining.',
    guardian: 'Lyria',
    element: 'void',
    progress: 75,
    status: 'active',
    tasksTotal: 8,
    tasksDone: 5,
    blocked: 0,
    target: 'W11',
  },
  {
    id: 'M004',
    name: 'Arcanea PM Toolkit',
    description: 'Git-native project management with .arc format, milestones, sprints, velocity tracking. Command Center live with .arc API.',
    guardian: 'Aiyami',
    element: 'gold',
    progress: 60,
    status: 'active',
    tasksTotal: 8,
    tasksDone: 5,
    blocked: 0,
    target: 'W12',
  },
];

// ─── Package Registry ───────────────────────────────────────────────────────

export interface WorkspacePackage {
  name: string;
  version: string;
  status: PackageStatus;
  deps: number;
  health: PackageHealth;
}

export type PackageTier = 'foundation' | 'intelligence' | 'content' | 'extensions' | 'standalone';

export interface PackageTierData {
  id: PackageTier;
  label: string;
  description: string;
  packages: WorkspacePackage[];
}

export const PACKAGE_TIERS: PackageTierData[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Core platform and infrastructure',
    packages: [
      { name: '@arcanea/core', version: '1.3.0', status: 'published', deps: 0, health: 'good' },
      { name: '@arcanea/os', version: '1.2.0', status: 'published', deps: 3, health: 'good' },
      { name: '@arcanea/council', version: '1.2.0', status: 'published', deps: 2, health: 'good' },
      { name: '@arcanea/guardian-memory', version: '1.2.0', status: 'published', deps: 2, health: 'good' },
      { name: 'apps/web', version: '0.1.0', status: 'private', deps: 24, health: 'good' },
      { name: 'apps/premium-web', version: '0.1.0', status: 'private', deps: 8, health: 'warning' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    description: 'AI, memory, and reasoning — your moat',
    packages: [
      { name: '@arcanea/memory-system', version: '1.0.0', status: 'published', deps: 1, health: 'good' },
      { name: '@arcanea/arcanea-mcp', version: '1.2.0', status: 'published', deps: 5, health: 'good' },
      { name: '@arcanea/ai-core', version: '1.0.0', status: 'published', deps: 3, health: 'warning' },
      { name: '@arcanea/starlight-runtime', version: '1.0.0', status: 'published', deps: 4, health: 'warning' },
      { name: '@arcanea/overlay-intelligence', version: '1.2.0', status: 'published', deps: 2, health: 'good' },
      { name: '@arcanea/overlay-lore', version: '1.2.0', status: 'published', deps: 1, health: 'good' },
      { name: '@arcanea/overlay-creative', version: '1.2.0', status: 'published', deps: 1, health: 'good' },
      { name: '@arcanea/overlay-collaboration', version: '1.2.0', status: 'published', deps: 1, health: 'good' },
      { name: '@arcanea/overlay-academy', version: '1.2.0', status: 'published', deps: 1, health: 'good' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    description: 'Lore, media, and creative assets',
    packages: [
      { name: '@arcanea/media', version: '0.1.0', status: 'alpha', deps: 0, health: 'warning' },
      { name: '@arcanea/lore-engine', version: '1.0.0', status: 'published', deps: 2, health: 'good' },
      { name: '@arcanea/content-loader', version: '1.0.0', status: 'private', deps: 1, health: 'good' },
    ],
  },
  {
    id: 'extensions',
    label: 'Extensions',
    description: 'IDE, browser, and platform integrations',
    packages: [
      { name: '@arcanea/vscode', version: '0.1.1', status: 'published', deps: 3, health: 'good' },
      { name: '@arcanea/chrome-extension', version: '0.1.0', status: 'alpha', deps: 4, health: 'good' },
      { name: 'apps/desktop', version: '0.1.0', status: 'alpha', deps: 6, health: 'warning' },
    ],
  },
  {
    id: 'standalone',
    label: 'Standalone',
    description: 'Independent tools and systems',
    packages: [
      { name: 'arcanea-opencode', version: '4.0.0', status: 'private', deps: 12, health: 'good' },
      { name: 'arcanea-flow', version: '3.0.0', status: 'private', deps: 8, health: 'good' },
      { name: 'arcanea-companion', version: '0.1.0', status: 'alpha', deps: 5, health: 'good' },
      { name: 'arcanea-mobile', version: '0.1.0', status: 'alpha', deps: 10, health: 'stale' },
      { name: 'arcanea-onchain', version: '0.1.0', status: 'alpha', deps: 7, health: 'stale' },
      { name: 'arcanea-infogenius', version: '1.0.0', status: 'private', deps: 3, health: 'good' },
      { name: 'arcaneabot', version: '1.0.0', status: 'private', deps: 58, health: 'warning' },
      { name: 'codex-arcanea', version: '0.1.0', status: 'private', deps: 4, health: 'good' },
      { name: 'claude-arcanea', version: '0.1.0', status: 'private', deps: 3, health: 'good' },
      { name: 'gemini-arcanea', version: '0.1.0', status: 'private', deps: 3, health: 'good' },
      { name: 'intelligence-os', version: '1.0.0', status: 'private', deps: 2, health: 'good' },
      { name: 'starlight-intelligence-system', version: '1.0.0', status: 'private', deps: 0, health: 'good' },
    ],
  },
];

// ─── Sprint Data ────────────────────────────────────────────────────────────

export interface SprintData {
  id: string;
  name: string;
  arc: string;
  capacity: number;
  completed: number;
  startDate: string;
  endDate: string;
}

export const CURRENT_SPRINT: SprintData = {
  id: 'W09',
  name: 'Wave 9 — Command & Control',
  arc: 'Foundation Arc',
  capacity: 40,
  completed: 34,
  startDate: '2026-02-24',
  endDate: '2026-03-02',
};

// ─── Activity Log ───────────────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  category: 'build' | 'deploy' | 'milestone' | 'fix' | 'feature';
}

export const RECENT_ACTIVITY: ActivityEntry[] = [
  { id: 'a00', timestamp: '2026-02-28 14:00', action: 'GitHub Issues created', detail: '6 issues (3 milestones + 3 P0 blockers) — tracking layer 1 live', category: 'milestone' },
  { id: 'a01', timestamp: '2026-02-28 12:00', action: 'Central Orchestrator built', detail: 'MASTER_PLAN.md + orchestrator skill + CLAUDE.md wiring', category: 'feature' },
  { id: 'a02', timestamp: '2026-02-28 02:00', action: 'Academy build fix deployed', detail: 'Server Component → Client Component, Vercel unblocked after 10 failures', category: 'deploy' },
  { id: 'a0a', timestamp: '2026-02-28 00:15', action: 'Profile service fix', detail: 'TypeScript build error resolved — deploys unblocked', category: 'fix' },
  { id: 'a0b', timestamp: '2026-02-27 23:45', action: 'Studio wired to APIs', detail: 'Manifest → /api/creations, Luminor AI → /api/ai/chat streaming', category: 'feature' },
  { id: 'a0c', timestamp: '2026-02-27 23:30', action: 'Auth redirects fixed', detail: 'Removed hardcoded localhost, secured edge runtime', category: 'fix' },
  { id: 'a0d', timestamp: '2026-02-27 23:20', action: 'Content quality pass', detail: 'Removed inflated claims, fake testimonials → real content', category: 'fix' },
  { id: 'a1', timestamp: '2026-02-27 22:30', action: 'Gallery cloud migration', detail: 'Community upload + stats API deployed', category: 'feature' },
  { id: 'a2', timestamp: '2026-02-27 20:15', action: 'Loading skeletons', detail: 'Auth, chat, community, activity pages', category: 'build' },
  { id: 'a3', timestamp: '2026-02-27 18:00', action: 'User flows page', detail: '/user-flows + gallery Supabase Storage', category: 'feature' },
  { id: 'a5', timestamp: '2026-02-27 12:00', action: 'Workflows page', detail: '/workflows + ecosystem diagram + arcanea-code', category: 'feature' },
];

// ─── Ecosystem Stats ────────────────────────────────────────────────────────

export const ECOSYSTEM_STATS = {
  workspacePackages: 37,
  standaloneSystems: 12,
  pagesLive: 54,
  publishedNpm: 28,
  activeMilestones: 4,
  totalTests: 3000,
  loreTexts: 62,
  agents: 65,
} as const;

// ─── Audit Notes (future sprint backlog) ────────────────────────────────────

export interface AuditNote {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

export const AUDIT_NOTES: AuditNote[] = [
  { id: 'n1', severity: 'high', title: 'starlight-runtime AI SDK', detail: 'Uses ai@^3.0.19 — needs upgrade to v6' },
  { id: 'n2', severity: 'high', title: 'ai-core OpenAI SDK', detail: 'Uses openai@^4.24.0 — needs v5.x' },
  { id: 'n3', severity: 'medium', title: 'premium-web duplicates', detail: 'Shares deps with web app — deduplicate' },
  { id: 'n4', severity: 'medium', title: 'desktop React version', detail: 'Uses React 18 — rest is React 19' },
  { id: 'n5', severity: 'low', title: 'arcaneabot bloat', detail: '58 deps — needs pruning' },
  { id: 'n6', severity: 'low', title: 'Overlay activity', detail: '5 overlay packages at v1.2.0 — review needed' },
  { id: 'n7', severity: 'medium', title: 'Media package', detail: '@arcanea/media needs FFmpeg (not installed)' },
];
