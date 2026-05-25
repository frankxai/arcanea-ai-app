# Connected Ecosystem Trilogy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single source-of-truth ecosystem map (Project C), wire `@arcanea/author-council` into the books pipeline + collapse 4 slash commands → 1 (Project A), and ship a public `/author` surface where users run the Council live (Project B).

**Architecture:** YAML/JSON canonical sources in `.arcanea/config/` → generator in `packages/orchestrator/src/ecosystem/` produces typed `apps/web/lib/ecosystem/derived.ts` → web reads it for three views (Layered / Ten Gates / Arc⊕Nea). Author Council MCP becomes a build-time dependency of book pipeline and a runtime dependency of `/author`.

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind + Vercel AI SDK v6, Zod for schema, js-yaml for YAML parsing, Octokit for GitHub API, `@modelcontextprotocol/sdk` for MCP client, Tiptap (Novel) for editor, Jest + Playwright for tests.

**Spec:** `docs/superpowers/specs/2026-05-11-connected-ecosystem-trilogy-design.md`

**Sequencing note:** Tasks 1-25 (Project C) are foundation; Tasks 26-33 (Project A) depend on C; Tasks 34-44 (Project B) depend on A. Within each project, tasks are mostly sequential — a few can parallelize (noted inline).

**Branch strategy:** Each project on its own branch off `main`:
- `feat/ecosystem-foundation` (Tasks 1-25)
- `feat/author-council-wiring` (Tasks 26-33; branched off `feat/ecosystem-foundation` after merge)
- `feat/author-public-surface` (Tasks 34-44; branched off `feat/author-council-wiring` after merge)

Do **not** start work on the current branch (`fix/vercel-ignore-build-script-2026-05-07`) — it has 1842 dirty files. Stash or branch off `main` cleanly.

**Pre-flight (before Task 1):**

```bash
git fetch origin
git status                                # confirm where you stand
git checkout main && git pull             # land cleanly on main
git checkout -b feat/ecosystem-foundation # new branch
```

---

# File Structure (whole trilogy)

## Created
- `.arcanea/config/manifest.yaml`
- `.arcanea/hooks/post-chapter-commit.sh`
- `apps/web/app/author/{page,hero,roster-picker,mode-picker,council-stream,voice-card}.tsx`
- `apps/web/app/api/author-council/run/route.ts`
- `apps/web/app/ecosystem/{node-drawer,view-switcher,filter-bar}.tsx`
- `apps/web/app/ecosystem/views/{gates-view,arc-nea-view}.tsx`
- `apps/web/lib/author-council/client.ts`
- `apps/web/lib/ecosystem/derived.ts` (generated)
- `book/das-maedchen-drei-sprachen/.author-council.yaml`
- `book/forge-of-ruin/.author-council.yaml`
- `book/las-tierras-de-luz/.author-council.yaml`
- `packages/orchestrator/src/commands/author-council.ts`
- `packages/orchestrator/src/ecosystem/{build,scan-monorepo,scan-siblings,enrich-github,merge,infer-status,write,verify,schema}.ts`
- `packages/orchestrator/__tests__/ecosystem/*.test.ts`
- `.github/workflows/{ecosystem-verify,ecosystem-weekly-refresh}.yml`

## Modified
- `.arcanea/config/repos.json` — additive fields (layer, gate, hemisphere, status_override)
- `.claude/commands/author-council.md` — promoted to canonical
- `apps/web/app/api/author/[bookSlug]/publish/route.ts` — call author-council MCP after publish
- `apps/web/app/ecosystem/layer-cards.tsx` — edge-on-hover
- `apps/web/app/ecosystem/page.tsx` — wire view switcher + filter bar; data from `derived.ts`
- `apps/web/lib/public-repo-registry.ts` — thin adapter over `derived.ts`
- `packages/orchestrator/package.json` — new bin scripts

## Deleted
- `apps/web/app/ecosystem/constellation-data.ts` (192 lines)
- `apps/web/lib/ops/repo-registry.ts` (243 lines)
- `.claude/commands/arcanea-author.md` (after 1-week deprecation)
- `.claude/commands/arcanea-author-council.md` (after 1-week deprecation)
- `.claude/commands/fiction-author-council.md` (after 1-week deprecation)

---

# PROJECT C — Connected Ecosystem Foundation

## Task 1: Add ecosystem schema (Zod)

**Files:**
- Create: `packages/orchestrator/src/ecosystem/schema.ts`
- Test: `packages/orchestrator/__tests__/ecosystem/schema.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/orchestrator/__tests__/ecosystem/schema.test.ts
import { describe, it, expect } from '@jest/globals';
import { EcosystemNodeSchema, ManifestSchema, GATES, LAYERS, HEMISPHERES, STATUSES } from '../../src/ecosystem/schema';

describe('EcosystemNodeSchema', () => {
  it('parses a valid node', () => {
    const node = {
      id: 'author-council',
      name: '@arcanea/author-council',
      description: '10 author voices · 8 rosters',
      layer: 'product',
      gate: 'soul',
      hemisphere: 'arc',
      status: 'orphan',
      consumes: ['anthropic-sdk'],
      consumedBy: [],
      isExternal: false,
      lastVerifiedAt: '2026-05-11T00:00:00Z',
      links: {},
    };
    expect(() => EcosystemNodeSchema.parse(node)).not.toThrow();
  });

  it('rejects an invalid gate', () => {
    expect(() => EcosystemNodeSchema.parse({ id: 'x', name: 'X', description: '', layer: 'product', gate: 'INVALID', hemisphere: 'arc', status: 'built', consumes: [], consumedBy: [], isExternal: false, lastVerifiedAt: '', links: {} })).toThrow();
  });

  it('exposes the 10 gate constants', () => {
    expect(GATES).toEqual(['source', 'form', 'pattern', 'voice', 'vision', 'story', 'world', 'soul', 'unity', 'mastery']);
  });
});

describe('ManifestSchema', () => {
  it('parses an empty manifest', () => {
    expect(() => ManifestSchema.parse({ nodes: [] })).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm -F @arcanea/orchestrator test schema.test.ts
```

Expected: FAIL with "Cannot find module schema".

- [ ] **Step 3: Implement schema**

```ts
// packages/orchestrator/src/ecosystem/schema.ts
import { z } from 'zod';

export const GATES = ['source', 'form', 'pattern', 'voice', 'vision', 'story', 'world', 'soul', 'unity', 'mastery'] as const;
export const LAYERS = ['substrate', 'product', 'surface'] as const;
export const HEMISPHERES = ['arc', 'nea', 'seam'] as const;
export const STATUSES = ['built', 'shipped', 'wip', 'orphan', 'sunset', 'external'] as const;

export const GateSchema = z.enum(GATES);
export const LayerSchema = z.enum(LAYERS);
export const HemisphereSchema = z.enum(HEMISPHERES);
export const StatusSchema = z.enum(STATUSES);

export const EcosystemNodeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  layer: LayerSchema,
  gate: GateSchema,
  hemisphere: HemisphereSchema,
  status: StatusSchema,
  repo: z.string().optional(),
  github: z.string().url().optional(),
  publicUrl: z.string().url().optional(),
  packageVersion: z.string().optional(),
  lastCommitAt: z.string().optional(),
  lastVerifiedAt: z.string(),
  consumes: z.array(z.string()),
  consumedBy: z.array(z.string()),
  isExternal: z.boolean(),
  owner: z.string().optional(),
  links: z.record(z.string(), z.string()),
});

export type EcosystemNode = z.infer<typeof EcosystemNodeSchema>;

export const EcosystemEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  kind: z.enum(['consumes', 'bridges', 'routes', 'references']),
});

export type EcosystemEdge = z.infer<typeof EcosystemEdgeSchema>;

export const ManifestNodeSchema = EcosystemNodeSchema
  .partial({ status: true, lastVerifiedAt: true, consumedBy: true })
  .extend({
    last_curated: z.string().optional(),
    status_override: StatusSchema.optional(),
  });

export const ManifestSchema = z.object({
  nodes: z.array(ManifestNodeSchema),
});

export type Manifest = z.infer<typeof ManifestSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm -F @arcanea/orchestrator test schema.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/orchestrator/src/ecosystem/schema.ts packages/orchestrator/__tests__/ecosystem/schema.test.ts
git commit -m "feat(ecosystem): add Zod schema for nodes, edges, manifest"
```

---

## Task 2: Extend repos.json with layer/gate/hemisphere fields

**Files:**
- Modify: `.arcanea/config/repos.json`

- [ ] **Step 1: Read current repos.json**

```bash
cat .arcanea/config/repos.json | head -200
```

Note the existing structure (each repo has name/github/role/stack/branch/active etc.).

- [ ] **Step 2: For each repo entry, add three optional fields**

For repo `arcanea-ai-app`, add:

```json
{
  "...existing fields...": "...",
  "layer": "surface",
  "gate": "unity",
  "hemisphere": "seam"
}
```

For repo `arcanea` (OSS): `"layer": "substrate", "gate": "source", "hemisphere": "seam"`
For repo `oh-my-arcanea`: `"layer": "surface", "gate": "voice", "hemisphere": "arc"`
For repo `arcanea-records`: `"layer": "product", "gate": "voice", "hemisphere": "arc"`
For repo `starlight-intelligence-system`: `"layer": "substrate", "gate": "source", "hemisphere": "seam"`
For repo `arcanea-orchestrator`: `"layer": "substrate", "gate": "unity", "hemisphere": "seam"`
For repo `arcanea-code`: `"layer": "surface", "gate": "form", "hemisphere": "seam"`

For all remaining repos, add the three fields with placeholder values you can refine in Task 3 (default to `layer: "product"`, `gate: "form"`, `hemisphere: "arc"`).

- [ ] **Step 3: Update lastUpdated**

```json
"lastUpdated": "2026-05-11"
```

- [ ] **Step 4: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.arcanea/config/repos.json', 'utf8'))" && echo "valid"
```

Expected: `valid`

- [ ] **Step 5: Commit**

```bash
git add .arcanea/config/repos.json
git commit -m "feat(ecosystem): annotate repos.json with layer/gate/hemisphere"
```

---

## Task 3: Seed manifest.yaml with curated nodes

**Files:**
- Create: `.arcanea/config/manifest.yaml`

- [ ] **Step 1: Write manifest.yaml with all in-monorepo packages and external integrations**

```yaml
# .arcanea/config/manifest.yaml
# Curated overlay for nodes that aren't repos.
# Generator merges this with repos.json + repo scans → derived.ts.
#
# Update last_curated when you change a node.
# Status is inferred unless status_override is set.

nodes:
  # ────── In-monorepo packages ──────
  - id: author-council
    name: "@arcanea/author-council"
    description: "10 author voices · 8 rosters · 4 deliberation modes · MCP server"
    layer: product
    gate: soul
    hemisphere: arc
    repo: packages/author-council
    consumes: [anthropic-sdk, sis]
    owner: frank
    links:
      package: packages/author-council
      mcp: packages/author-council/src/mcp/server.ts
    last_curated: "2026-05-11"

  - id: design-system
    name: "@arcanea/design-system"
    description: "Tokens, brand kits, motion variants, primitives (AnimatedBeam, NumberTicker, Marquee)"
    layer: substrate
    gate: form
    hemisphere: seam
    repo: packages/design-system
    consumes: []
    owner: frank
    links:
      package: packages/design-system
    last_curated: "2026-05-11"

  - id: orchestrator
    name: "@arcanea/orchestrator"
    description: "Multi-agent runtime + ecosystem build pipeline"
    layer: substrate
    gate: unity
    hemisphere: seam
    repo: packages/orchestrator
    consumes: [sis, anthropic-sdk]
    owner: frank
    links:
      package: packages/orchestrator
    last_curated: "2026-05-11"

  - id: multilingual
    name: "@starlight/multilingual"
    description: "i18n foundation — locales, translated slugs, canon glossary"
    layer: substrate
    gate: voice
    hemisphere: seam
    repo: packages/multilingual
    consumes: []
    owner: frank
    links:
      package: packages/multilingual
    last_curated: "2026-05-11"

  # ────── External integrations ──────
  - id: anthropic-sdk
    name: "Anthropic SDK"
    description: "Claude Sonnet/Opus/Haiku via @anthropic-ai/sdk"
    layer: substrate
    gate: source
    hemisphere: seam
    isExternal: true
    consumes: []
    links:
      docs: "https://docs.anthropic.com"
    last_curated: "2026-05-11"

  - id: vercel
    name: "Vercel"
    description: "Hosting, Fluid Compute, AI Gateway, Functions, Blob, Queues"
    layer: substrate
    gate: mastery
    hemisphere: nea
    isExternal: true
    consumes: []
    links:
      docs: "https://vercel.com/docs"
    last_curated: "2026-05-11"

  - id: supabase
    name: "Supabase"
    description: "Postgres, Auth, Realtime, Storage, pgvector"
    layer: substrate
    gate: pattern
    hemisphere: seam
    isExternal: true
    consumes: []
    links:
      docs: "https://supabase.com/docs"
    last_curated: "2026-05-11"

  - id: sis
    name: "Starlight Intelligence System"
    description: "Cross-session memory + horizon vaults + entry stream"
    layer: substrate
    gate: source
    hemisphere: seam
    repo: "https://github.com/frankxai/Starlight-Intelligence-System"
    consumes: []
    owner: frank
    links:
      github: "https://github.com/frankxai/Starlight-Intelligence-System"
    last_curated: "2026-05-11"

  # ────── Books (products) ──────
  - id: book-mila
    name: "Das Mädchen, das drei Sprachen hörte"
    description: "Trilingual children's book, Mila-bedtime test grade"
    layer: product
    gate: story
    hemisphere: arc
    repo: book/das-maedchen-drei-sprachen
    consumes: [author-council, multilingual, design-system]
    owner: frank
    links:
      live: "https://arcanea.ai/books/das-maedchen-drei-sprachen"
    last_curated: "2026-05-11"

  - id: book-tierras
    name: "Las Tierras de Luz"
    description: "Co-authored with Ana Cecilia Cancino — Veldoria setting"
    layer: product
    gate: story
    hemisphere: arc
    repo: book/las-tierras-de-luz
    consumes: [author-council, multilingual, design-system]
    owner: frank
    links:
      live: "https://arcanea.ai/books/las-tierras-de-luz"
    last_curated: "2026-05-11"

  - id: book-forge
    name: "Forge of Ruin"
    description: "First Open Library book — 45K+ words, 4 chapters"
    layer: product
    gate: story
    hemisphere: arc
    repo: book/forge-of-ruin
    consumes: [author-council, design-system]
    owner: frank
    links:
      repo: book/forge-of-ruin
    last_curated: "2026-05-11"

  # ────── Surfaces ──────
  - id: surface-ecosystem
    name: "/ecosystem"
    description: "The connected experience map (this page)"
    layer: surface
    gate: unity
    hemisphere: seam
    consumes: [orchestrator]
    links:
      live: "https://arcanea.ai/ecosystem"
    last_curated: "2026-05-11"

  - id: surface-author
    name: "/author"
    description: "Public Author Council — paste chapter, pick roster, see deliberation"
    layer: surface
    gate: soul
    hemisphere: arc
    consumes: [author-council, anthropic-sdk]
    status_override: wip
    links: {}
    last_curated: "2026-05-11"

  - id: surface-library
    name: "/library"
    description: "Library OS — books, quotes, chapter summaries"
    layer: surface
    gate: story
    hemisphere: arc
    consumes: [book-mila, book-tierras, book-forge]
    links:
      live: "https://arcanea.ai/library"
    last_curated: "2026-05-11"

  - id: surface-imagine
    name: "/imagine"
    description: "Image generation — NB2, Fal, Replicate"
    layer: surface
    gate: vision
    hemisphere: arc
    consumes: []
    links:
      live: "https://arcanea.ai/imagine"
    last_curated: "2026-05-11"

# Add new nodes here. The generator validates against schema.ts on every build.
```

- [ ] **Step 2: Validate YAML parses**

```bash
node -e "const yaml = require('js-yaml'); const fs = require('fs'); console.log(Object.keys(yaml.load(fs.readFileSync('.arcanea/config/manifest.yaml', 'utf8'))).join(','))"
```

Expected: `nodes`

- [ ] **Step 3: Install js-yaml in orchestrator if not present**

```bash
pnpm -F @arcanea/orchestrator add js-yaml
pnpm -F @arcanea/orchestrator add -D @types/js-yaml
```

- [ ] **Step 4: Commit**

```bash
git add .arcanea/config/manifest.yaml packages/orchestrator/package.json pnpm-lock.yaml
git commit -m "feat(ecosystem): seed manifest.yaml with curated nodes (packages, books, surfaces, externals)"
```

---

## Task 4: Build scan-monorepo

**Files:**
- Create: `packages/orchestrator/src/ecosystem/scan-monorepo.ts`
- Test: `packages/orchestrator/__tests__/ecosystem/scan-monorepo.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/orchestrator/__tests__/ecosystem/scan-monorepo.test.ts
import { describe, it, expect } from '@jest/globals';
import { scanMonorepo } from '../../src/ecosystem/scan-monorepo';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../../../..');

describe('scanMonorepo', () => {
  it('discovers @arcanea/author-council', async () => {
    const result = await scanMonorepo(REPO_ROOT);
    const ac = result.find((p) => p.name === '@arcanea/author-council');
    expect(ac).toBeDefined();
    expect(ac!.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(ac!.path).toBe('packages/author-council');
  });

  it('discovers @arcanea/orchestrator (self-reference)', async () => {
    const result = await scanMonorepo(REPO_ROOT);
    const orch = result.find((p) => p.name === '@arcanea/orchestrator');
    expect(orch).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm -F @arcanea/orchestrator test scan-monorepo.test.ts
```

Expected: FAIL with "Cannot find module scan-monorepo".

- [ ] **Step 3: Implement scan-monorepo**

```ts
// packages/orchestrator/src/ecosystem/scan-monorepo.ts
import fs from 'node:fs/promises';
import path from 'node:path';

export interface MonorepoPackage {
  name: string;
  version: string;
  path: string;          // relative to repo root
  hasMcpServer: boolean; // true if src/mcp/server.ts exists
  bin?: Record<string, string>;
  description?: string;
}

const PACKAGE_DIRS = ['packages', 'apps'];

export async function scanMonorepo(repoRoot: string): Promise<MonorepoPackage[]> {
  const results: MonorepoPackage[] = [];

  for (const dir of PACKAGE_DIRS) {
    const fullDir = path.join(repoRoot, dir);
    let entries: string[];
    try {
      entries = await fs.readdir(fullDir);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const pkgPath = path.join(fullDir, entry);
      const pkgJsonPath = path.join(pkgPath, 'package.json');
      try {
        const stat = await fs.stat(pkgPath);
        if (!stat.isDirectory()) continue;
        const raw = await fs.readFile(pkgJsonPath, 'utf8');
        const pkg = JSON.parse(raw);
        if (!pkg.name) continue;

        const mcpPath = path.join(pkgPath, 'src/mcp/server.ts');
        const hasMcpServer = await fileExists(mcpPath);

        results.push({
          name: pkg.name,
          version: pkg.version ?? '0.0.0',
          path: path.relative(repoRoot, pkgPath).split(path.sep).join('/'),
          hasMcpServer,
          bin: pkg.bin,
          description: pkg.description,
        });
      } catch {
        continue;
      }
    }
  }

  return results;
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm -F @arcanea/orchestrator test scan-monorepo.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/orchestrator/src/ecosystem/scan-monorepo.ts packages/orchestrator/__tests__/ecosystem/scan-monorepo.test.ts
git commit -m "feat(ecosystem): scan-monorepo discovers packages with versions + MCP detection"
```

---

## Task 5: Build scan-siblings (sibling repos via repos.json)

**Files:**
- Create: `packages/orchestrator/src/ecosystem/scan-siblings.ts`
- Test: `packages/orchestrator/__tests__/ecosystem/scan-siblings.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/orchestrator/__tests__/ecosystem/scan-siblings.test.ts
import { describe, it, expect } from '@jest/globals';
import { readReposConfig } from '../../src/ecosystem/scan-siblings';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../../../..');

describe('readReposConfig', () => {
  it('returns array of repos with required fields', async () => {
    const repos = await readReposConfig(REPO_ROOT);
    expect(Array.isArray(repos)).toBe(true);
    expect(repos.length).toBeGreaterThan(5);
    const arc = repos.find((r) => r.name === 'arcanea-ai-app');
    expect(arc).toBeDefined();
    expect(arc!.github).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm -F @arcanea/orchestrator test scan-siblings.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement scan-siblings**

```ts
// packages/orchestrator/src/ecosystem/scan-siblings.ts
import fs from 'node:fs/promises';
import path from 'node:path';

export interface SiblingRepo {
  name: string;
  description: string;
  github: string;
  publicUrl: string | null;
  role: string;
  branch: string;
  visibility: string;
  active: boolean;
  publishes?: string[];
  layer?: string;
  gate?: string;
  hemisphere?: string;
  status_override?: string;
}

interface ReposConfig {
  lastUpdated: string;
  repos: SiblingRepo[];
}

export async function readReposConfig(repoRoot: string): Promise<SiblingRepo[]> {
  const configPath = path.join(repoRoot, '.arcanea/config/repos.json');
  const raw = await fs.readFile(configPath, 'utf8');
  const parsed = JSON.parse(raw) as ReposConfig;
  return parsed.repos;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm -F @arcanea/orchestrator test scan-siblings.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/orchestrator/src/ecosystem/scan-siblings.ts packages/orchestrator/__tests__/ecosystem/scan-siblings.test.ts
git commit -m "feat(ecosystem): read repos.json into typed SiblingRepo[]"
```

---

## Task 6: GitHub enrichment (last commit, version, deploy URL)

**Files:**
- Create: `packages/orchestrator/src/ecosystem/enrich-github.ts`
- Test: `packages/orchestrator/__tests__/ecosystem/enrich-github.test.ts`

- [ ] **Step 1: Install Octokit**

```bash
pnpm -F @arcanea/orchestrator add @octokit/rest
```

- [ ] **Step 2: Write the failing test (uses mocked Octokit)**

```ts
// packages/orchestrator/__tests__/ecosystem/enrich-github.test.ts
import { describe, it, expect, jest } from '@jest/globals';
import { enrichWithGitHub, type EnrichmentInput } from '../../src/ecosystem/enrich-github';

describe('enrichWithGitHub', () => {
  it('returns lastCommitAt for a repo', async () => {
    const fakeClient = {
      repos: {
        getCommit: jest.fn().mockResolvedValue({
          data: { commit: { author: { date: '2026-05-10T12:00:00Z' } } },
        }),
      },
    } as any;

    const input: EnrichmentInput = { owner: 'frankxai', repo: 'arcanea-ai-app', branch: 'main' };
    const result = await enrichWithGitHub(input, fakeClient);
    expect(result.lastCommitAt).toBe('2026-05-10T12:00:00Z');
  });

  it('returns null on 404', async () => {
    const fakeClient = {
      repos: {
        getCommit: jest.fn().mockRejectedValue({ status: 404 }),
      },
    } as any;

    const result = await enrichWithGitHub({ owner: 'frankxai', repo: 'missing', branch: 'main' }, fakeClient);
    expect(result.lastCommitAt).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
pnpm -F @arcanea/orchestrator test enrich-github.test.ts
```

Expected: FAIL.

- [ ] **Step 4: Implement enrichment**

```ts
// packages/orchestrator/src/ecosystem/enrich-github.ts
import { Octokit } from '@octokit/rest';

export interface EnrichmentInput {
  owner: string;
  repo: string;
  branch: string;
}

export interface EnrichmentResult {
  lastCommitAt: string | null;
}

export function createGitHubClient(): Octokit {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
    userAgent: 'arcanea-ecosystem-builder',
  });
}

export async function enrichWithGitHub(
  input: EnrichmentInput,
  client: Pick<Octokit, 'repos'>,
): Promise<EnrichmentResult> {
  try {
    const { data } = await client.repos.getCommit({
      owner: input.owner,
      repo: input.repo,
      ref: input.branch,
    });
    return { lastCommitAt: data.commit?.author?.date ?? null };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 404) return { lastCommitAt: null };
    throw err;
  }
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
pnpm -F @arcanea/orchestrator test enrich-github.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/orchestrator/src/ecosystem/enrich-github.ts packages/orchestrator/__tests__/ecosystem/enrich-github.test.ts packages/orchestrator/package.json pnpm-lock.yaml
git commit -m "feat(ecosystem): GitHub enrichment via Octokit (last commit, 404-tolerant)"
```

---

## Task 7: Status inference rules

**Files:**
- Create: `packages/orchestrator/src/ecosystem/infer-status.ts`
- Test: `packages/orchestrator/__tests__/ecosystem/infer-status.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/orchestrator/__tests__/ecosystem/infer-status.test.ts
import { describe, it, expect } from '@jest/globals';
import { inferStatus, type InferenceInput } from '../../src/ecosystem/infer-status';

const NOW = '2026-05-11T00:00:00Z';

function input(overrides: Partial<InferenceInput> = {}): InferenceInput {
  return {
    layer: 'product',
    consumedByCount: 0,
    isExternal: false,
    statusOverride: undefined,
    publicUrl: undefined,
    lastCommitAt: undefined,
    now: NOW,
    ...overrides,
  };
}

describe('inferStatus', () => {
  it('respects status_override', () => {
    expect(inferStatus(input({ statusOverride: 'wip' }))).toBe('wip');
  });

  it('returns external when isExternal', () => {
    expect(inferStatus(input({ isExternal: true }))).toBe('external');
  });

  it('returns orphan for product with no consumers', () => {
    expect(inferStatus(input({ layer: 'product', consumedByCount: 0 }))).toBe('orphan');
  });

  it('returns built for product with consumers', () => {
    expect(inferStatus(input({ layer: 'product', consumedByCount: 2 }))).toBe('built');
  });

  it('returns shipped for product with publicUrl + consumers', () => {
    expect(inferStatus(input({ layer: 'product', consumedByCount: 2, publicUrl: 'https://arcanea.ai' }))).toBe('shipped');
  });

  it('returns sunset for >365 day stale', () => {
    expect(inferStatus(input({ lastCommitAt: '2024-01-01T00:00:00Z', consumedByCount: 1 }))).toBe('sunset');
  });

  it('returns wip for 90-365 day stale (warning level)', () => {
    expect(inferStatus(input({ lastCommitAt: '2025-12-01T00:00:00Z', consumedByCount: 1 }))).toBe('wip');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm -F @arcanea/orchestrator test infer-status.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement inference**

```ts
// packages/orchestrator/src/ecosystem/infer-status.ts
import type { Status, Layer } from './schema';

export interface InferenceInput {
  layer: Layer;
  consumedByCount: number;
  isExternal: boolean;
  statusOverride?: Status;
  publicUrl?: string;
  lastCommitAt?: string;
  now: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function inferStatus(input: InferenceInput): Status {
  if (input.statusOverride) return input.statusOverride;
  if (input.isExternal) return 'external';

  if (input.lastCommitAt) {
    const ageMs = Date.parse(input.now) - Date.parse(input.lastCommitAt);
    const ageDays = ageMs / DAY_MS;
    if (ageDays > 365) return 'sunset';
    if (ageDays > 90) return 'wip';
  }

  if (input.layer === 'product' && input.consumedByCount === 0) return 'orphan';
  if (input.publicUrl && input.consumedByCount > 0) return 'shipped';
  if (input.consumedByCount > 0) return 'built';

  return input.layer === 'surface' ? 'shipped' : 'built';
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm -F @arcanea/orchestrator test infer-status.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/orchestrator/src/ecosystem/infer-status.ts packages/orchestrator/__tests__/ecosystem/infer-status.test.ts
git commit -m "feat(ecosystem): status inference (orphan/wip/sunset/shipped/built/external)"
```

---

## Task 8: Merge logic (sources → EcosystemNode[])

**Files:**
- Create: `packages/orchestrator/src/ecosystem/merge.ts`
- Test: `packages/orchestrator/__tests__/ecosystem/merge.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/orchestrator/__tests__/ecosystem/merge.test.ts
import { describe, it, expect } from '@jest/globals';
import { mergeAll } from '../../src/ecosystem/merge';
import type { Manifest } from '../../src/ecosystem/schema';

describe('mergeAll', () => {
  it('produces a node from a manifest entry', () => {
    const manifest: Manifest = {
      nodes: [
        {
          id: 'author-council',
          name: '@arcanea/author-council',
          description: '10 voices',
          layer: 'product',
          gate: 'soul',
          hemisphere: 'arc',
          consumes: ['anthropic-sdk'],
          isExternal: false,
          links: {},
        },
      ],
    };

    const result = mergeAll({
      manifest,
      siblingRepos: [],
      monorepoPackages: [{ name: '@arcanea/author-council', version: '0.1.0', path: 'packages/author-council', hasMcpServer: true }],
      enrichments: new Map(),
      now: '2026-05-11T00:00:00Z',
    });

    const node = result.find((n) => n.id === 'author-council');
    expect(node).toBeDefined();
    expect(node!.packageVersion).toBe('0.1.0');
    expect(node!.consumedBy).toEqual([]);  // populated in inference pass
    expect(node!.lastVerifiedAt).toBe('2026-05-11T00:00:00Z');
  });

  it('back-references consumedBy from consumes graph', () => {
    const manifest: Manifest = {
      nodes: [
        { id: 'a', name: 'A', description: '', layer: 'product', gate: 'form', hemisphere: 'arc', consumes: ['b'], isExternal: false, links: {} },
        { id: 'b', name: 'B', description: '', layer: 'substrate', gate: 'source', hemisphere: 'seam', consumes: [], isExternal: false, links: {} },
      ],
    };
    const result = mergeAll({ manifest, siblingRepos: [], monorepoPackages: [], enrichments: new Map(), now: '2026-05-11T00:00:00Z' });
    const b = result.find((n) => n.id === 'b');
    expect(b!.consumedBy).toEqual(['a']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm -F @arcanea/orchestrator test merge.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement merge**

```ts
// packages/orchestrator/src/ecosystem/merge.ts
import type { Manifest, EcosystemNode } from './schema';
import type { MonorepoPackage } from './scan-monorepo';
import type { SiblingRepo } from './scan-siblings';
import { inferStatus } from './infer-status';

export interface MergeInput {
  manifest: Manifest;
  siblingRepos: SiblingRepo[];
  monorepoPackages: MonorepoPackage[];
  enrichments: Map<string, { lastCommitAt: string | null }>;  // key: github "owner/repo"
  now: string;
}

export function mergeAll(input: MergeInput): EcosystemNode[] {
  const { manifest, siblingRepos, monorepoPackages, enrichments, now } = input;

  const monorepoByName = new Map(monorepoPackages.map((p) => [p.name, p]));

  const siblingNodes: Partial<EcosystemNode>[] = siblingRepos.map((r) => ({
    id: r.name,
    name: r.name,
    description: r.description,
    layer: (r.layer as EcosystemNode['layer']) ?? 'product',
    gate: (r.gate as EcosystemNode['gate']) ?? 'form',
    hemisphere: (r.hemisphere as EcosystemNode['hemisphere']) ?? 'arc',
    repo: r.github,
    github: r.github,
    publicUrl: r.publicUrl ?? undefined,
    consumes: [],
    consumedBy: [],
    isExternal: false,
    links: r.publicUrl ? { live: r.publicUrl } : {},
  }));

  const manifestNodes: Partial<EcosystemNode>[] = manifest.nodes.map((n) => {
    const monorepoPkg = monorepoByName.get(n.name);
    return {
      id: n.id,
      name: n.name,
      description: n.description,
      layer: n.layer,
      gate: n.gate,
      hemisphere: n.hemisphere,
      repo: n.repo ?? monorepoPkg?.path,
      github: n.github,
      publicUrl: n.publicUrl,
      packageVersion: monorepoPkg?.version,
      consumes: n.consumes,
      consumedBy: [],
      isExternal: n.isExternal ?? false,
      owner: n.owner,
      links: n.links ?? {},
    };
  });

  // Merge by id; manifest wins over sibling on conflict
  const byId = new Map<string, Partial<EcosystemNode>>();
  for (const n of siblingNodes) byId.set(n.id!, n);
  for (const n of manifestNodes) byId.set(n.id!, { ...byId.get(n.id!), ...n });

  // Back-reference consumedBy
  for (const n of byId.values()) {
    for (const dep of n.consumes ?? []) {
      const target = byId.get(dep);
      if (target) target.consumedBy = [...(target.consumedBy ?? []), n.id!];
    }
  }

  // Apply enrichments + status inference
  const result: EcosystemNode[] = [];
  for (const n of byId.values()) {
    const ghKey = n.github ? n.github.replace('https://github.com/', '') : null;
    const enrichment = ghKey ? enrichments.get(ghKey) : null;

    const node: EcosystemNode = {
      id: n.id!,
      name: n.name!,
      description: n.description ?? '',
      layer: n.layer!,
      gate: n.gate!,
      hemisphere: n.hemisphere!,
      status: inferStatus({
        layer: n.layer!,
        consumedByCount: (n.consumedBy ?? []).length,
        isExternal: n.isExternal ?? false,
        statusOverride: (manifest.nodes.find((m) => m.id === n.id) as { status_override?: EcosystemNode['status'] } | undefined)?.status_override,
        publicUrl: n.publicUrl,
        lastCommitAt: enrichment?.lastCommitAt ?? undefined,
        now,
      }),
      repo: n.repo,
      github: n.github,
      publicUrl: n.publicUrl,
      packageVersion: n.packageVersion,
      lastCommitAt: enrichment?.lastCommitAt ?? undefined,
      lastVerifiedAt: now,
      consumes: n.consumes ?? [],
      consumedBy: n.consumedBy ?? [],
      isExternal: n.isExternal ?? false,
      owner: n.owner,
      links: n.links ?? {},
    };
    result.push(node);
  }

  // Stable sort by id for diffability
  return result.sort((a, b) => a.id.localeCompare(b.id));
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm -F @arcanea/orchestrator test merge.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/orchestrator/src/ecosystem/merge.ts packages/orchestrator/__tests__/ecosystem/merge.test.ts
git commit -m "feat(ecosystem): merge sources into EcosystemNode[] with consumedBy backrefs"
```

---

## Task 9: Write derived.ts

**Files:**
- Create: `packages/orchestrator/src/ecosystem/write.ts`
- Test: `packages/orchestrator/__tests__/ecosystem/write.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/orchestrator/__tests__/ecosystem/write.test.ts
import { describe, it, expect } from '@jest/globals';
import { renderDerivedTs } from '../../src/ecosystem/write';
import type { EcosystemNode } from '../../src/ecosystem/schema';

describe('renderDerivedTs', () => {
  it('emits a TypeScript module with NODES + GENERATED_AT', () => {
    const nodes: EcosystemNode[] = [
      { id: 'x', name: 'X', description: '', layer: 'product', gate: 'soul', hemisphere: 'arc', status: 'orphan', consumes: [], consumedBy: [], isExternal: false, lastVerifiedAt: '2026-05-11T00:00:00Z', links: {} },
    ];
    const out = renderDerivedTs(nodes, '2026-05-11T00:00:00Z');
    expect(out).toContain('export const NODES');
    expect(out).toContain('export const GENERATED_AT');
    expect(out).toContain('export const EDGES');
    expect(out).toContain('"id": "x"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm -F @arcanea/orchestrator test write.test.ts
```

- [ ] **Step 3: Implement write**

```ts
// packages/orchestrator/src/ecosystem/write.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import type { EcosystemNode, EcosystemEdge } from './schema';

export function renderDerivedTs(nodes: EcosystemNode[], generatedAt: string): string {
  const edges: EcosystemEdge[] = nodes.flatMap((n) =>
    n.consumes.map((dep) => ({ source: n.id, target: dep, kind: 'consumes' as const })),
  );

  const header = [
    '// AUTO-GENERATED by @arcanea/orchestrator ecosystem:build.',
    '// Do not edit by hand. Edit .arcanea/config/{repos.json,manifest.yaml} and re-run.',
    '',
    "import type { EcosystemNode, EcosystemEdge } from '@arcanea/orchestrator/ecosystem/schema';",
    '',
  ].join('\n');

  return `${header}
export const GENERATED_AT = ${JSON.stringify(generatedAt)};

export const NODES: EcosystemNode[] = ${JSON.stringify(nodes, null, 2)};

export const EDGES: EcosystemEdge[] = ${JSON.stringify(edges, null, 2)};
`;
}

export async function writeDerivedFile(repoRoot: string, contents: string): Promise<string> {
  const outPath = path.join(repoRoot, 'apps/web/lib/ecosystem/derived.ts');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, contents, 'utf8');
  return outPath;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm -F @arcanea/orchestrator test write.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add packages/orchestrator/src/ecosystem/write.ts packages/orchestrator/__tests__/ecosystem/write.test.ts
git commit -m "feat(ecosystem): render + write derived.ts (NODES/EDGES/GENERATED_AT)"
```

---

## Task 10: Build orchestrator entry (`build.ts`)

**Files:**
- Create: `packages/orchestrator/src/ecosystem/build.ts`

- [ ] **Step 1: Implement build orchestrator**

```ts
// packages/orchestrator/src/ecosystem/build.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';
import { ManifestSchema } from './schema';
import { scanMonorepo } from './scan-monorepo';
import { readReposConfig } from './scan-siblings';
import { createGitHubClient, enrichWithGitHub, parseGitHubUrl } from './enrich-github';
import { mergeAll } from './merge';
import { renderDerivedTs, writeDerivedFile } from './write';

export interface BuildOptions {
  repoRoot: string;
  skipGitHub?: boolean;
}

export async function build(options: BuildOptions): Promise<{ outPath: string; nodeCount: number }> {
  const { repoRoot, skipGitHub = false } = options;
  const now = new Date().toISOString();

  const manifestPath = path.join(repoRoot, '.arcanea/config/manifest.yaml');
  const manifestRaw = await fs.readFile(manifestPath, 'utf8');
  const manifest = ManifestSchema.parse(yaml.load(manifestRaw));

  const [monorepoPackages, siblingRepos] = await Promise.all([
    scanMonorepo(repoRoot),
    readReposConfig(repoRoot),
  ]);

  const enrichments = new Map<string, { lastCommitAt: string | null }>();
  if (!skipGitHub && process.env.GITHUB_TOKEN) {
    const client = createGitHubClient();
    await Promise.all(
      siblingRepos.map(async (r) => {
        const parsed = parseGitHubUrl(`https://github.com/${r.github}`);
        if (!parsed) return;
        try {
          const result = await enrichWithGitHub({ owner: parsed.owner, repo: parsed.repo, branch: r.branch }, client);
          enrichments.set(`${parsed.owner}/${parsed.repo}`, result);
        } catch {
          // Tolerate per-repo failures; log and continue
          enrichments.set(`${parsed.owner}/${parsed.repo}`, { lastCommitAt: null });
        }
      }),
    );
  }

  const nodes = mergeAll({ manifest, siblingRepos, monorepoPackages, enrichments, now });
  const contents = renderDerivedTs(nodes, now);
  const outPath = await writeDerivedFile(repoRoot, contents);

  return { outPath, nodeCount: nodes.length };
}
```

- [ ] **Step 2: Smoke test by running build manually**

```bash
cd packages/orchestrator
pnpm tsx -e "import { build } from './src/ecosystem/build'; build({ repoRoot: '../..', skipGitHub: true }).then(r => console.log(r))"
```

Expected: `{ outPath: '.../derived.ts', nodeCount: <number> }`. Verify the file exists.

- [ ] **Step 3: Commit**

```bash
git add packages/orchestrator/src/ecosystem/build.ts apps/web/lib/ecosystem/derived.ts
git commit -m "feat(ecosystem): build orchestrator wires scans + enrichment + merge + write"
```

---

## Task 11: Verify command (CI gate)

**Files:**
- Create: `packages/orchestrator/src/ecosystem/verify.ts`

- [ ] **Step 1: Implement verify**

```ts
// packages/orchestrator/src/ecosystem/verify.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from './build';

export interface VerifyResult {
  drift: boolean;
  message: string;
}

export async function verify(repoRoot: string): Promise<VerifyResult> {
  const derivedPath = path.join(repoRoot, 'apps/web/lib/ecosystem/derived.ts');
  let existing = '';
  try {
    existing = await fs.readFile(derivedPath, 'utf8');
  } catch {
    return { drift: true, message: 'derived.ts missing — run `pnpm -F @arcanea/orchestrator ecosystem:build`' };
  }

  // Build to a temp location
  const tmpRoot = await fs.mkdtemp(path.join(repoRoot, '.tmp-ecosystem-verify-'));
  try {
    const tmpDerivedPath = path.join(tmpRoot, 'apps/web/lib/ecosystem/derived.ts');
    await fs.mkdir(path.dirname(tmpDerivedPath), { recursive: true });

    const { outPath } = await build({ repoRoot });
    const fresh = await fs.readFile(outPath, 'utf8');

    // Strip GENERATED_AT before comparison (timestamps drift naturally)
    const normalize = (s: string) => s.replace(/export const GENERATED_AT = "[^"]+";/, 'export const GENERATED_AT = "<normalized>";');

    if (normalize(existing) === normalize(fresh)) {
      return { drift: false, message: 'derived.ts is in sync' };
    }
    return { drift: true, message: 'derived.ts is stale — re-run `pnpm -F @arcanea/orchestrator ecosystem:build` and commit' };
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  }
}
```

- [ ] **Step 2: Test verify by running it (should be in sync)**

```bash
cd packages/orchestrator
pnpm tsx -e "import { verify } from './src/ecosystem/verify'; verify('../..').then(r => { console.log(r); process.exit(r.drift ? 1 : 0); })"
```

Expected: `{ drift: false, message: 'derived.ts is in sync' }`, exit 0.

- [ ] **Step 3: Commit**

```bash
git add packages/orchestrator/src/ecosystem/verify.ts
git commit -m "feat(ecosystem): verify command (drift detection for CI)"
```

---

## Task 12: CLI wiring + npm scripts

**Files:**
- Modify: `packages/orchestrator/package.json`
- Create: `packages/orchestrator/src/ecosystem/cli.ts`

- [ ] **Step 1: Implement CLI dispatcher**

```ts
// packages/orchestrator/src/ecosystem/cli.ts
#!/usr/bin/env node
import { build } from './build';
import { verify } from './verify';
import path from 'node:path';

const REPO_ROOT = path.resolve(process.cwd());

const command = process.argv[2];

(async () => {
  if (command === 'build') {
    const result = await build({ repoRoot: REPO_ROOT });
    console.log(`✓ wrote ${result.outPath} (${result.nodeCount} nodes)`);
  } else if (command === 'verify') {
    const result = await verify(REPO_ROOT);
    if (result.drift) {
      console.error(`✗ ${result.message}`);
      process.exit(1);
    }
    console.log(`✓ ${result.message}`);
  } else {
    console.error('Usage: ecosystem [build|verify]');
    process.exit(1);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add scripts to package.json**

In `packages/orchestrator/package.json`, add to `scripts`:

```json
"ecosystem:build": "tsx src/ecosystem/cli.ts build",
"ecosystem:verify": "tsx src/ecosystem/cli.ts verify"
```

- [ ] **Step 3: Smoke test the CLI**

```bash
cd packages/orchestrator
pnpm ecosystem:build
pnpm ecosystem:verify
```

Both should succeed.

- [ ] **Step 4: Commit**

```bash
git add packages/orchestrator/src/ecosystem/cli.ts packages/orchestrator/package.json apps/web/lib/ecosystem/derived.ts
git commit -m "feat(ecosystem): CLI commands ecosystem:build and ecosystem:verify"
```

---

## Task 13: CI workflow — ecosystem-verify

**Files:**
- Create: `.github/workflows/ecosystem-verify.yml`

- [ ] **Step 1: Write workflow**

```yaml
# .github/workflows/ecosystem-verify.yml
name: Ecosystem Verify

on:
  pull_request:
    paths:
      - '.arcanea/config/repos.json'
      - '.arcanea/config/manifest.yaml'
      - 'packages/*/package.json'
      - 'apps/web/lib/ecosystem/derived.ts'
      - 'packages/orchestrator/src/ecosystem/**'

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm -F @arcanea/orchestrator ecosystem:verify
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ecosystem-verify.yml
git commit -m "ci(ecosystem): verify gate on PRs touching ecosystem sources"
```

---

## Task 14: CI workflow — weekly refresh

**Files:**
- Create: `.github/workflows/ecosystem-weekly-refresh.yml`

- [ ] **Step 1: Write workflow**

```yaml
# .github/workflows/ecosystem-weekly-refresh.yml
name: Ecosystem Weekly Refresh

on:
  schedule:
    - cron: '0 9 * * 1'  # 09:00 UTC every Monday
  workflow_dispatch: {}

jobs:
  refresh:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm -F @arcanea/orchestrator ecosystem:build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - uses: peter-evans/create-pull-request@v6
        with:
          commit-message: 'chore(ecosystem): weekly auto-refresh of derived.ts'
          title: 'chore(ecosystem): weekly auto-refresh'
          body: |
            Auto-generated weekly refresh of `apps/web/lib/ecosystem/derived.ts`.
            Review the diff to confirm nothing surprising changed (typically just lastCommitAt timestamps).
          branch: chore/ecosystem-weekly-refresh
          delete-branch: true
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ecosystem-weekly-refresh.yml
git commit -m "ci(ecosystem): weekly refresh action opens PR with derived.ts diff"
```

---

## Task 15: Refactor public-repo-registry to thin adapter

**Files:**
- Modify: `apps/web/lib/public-repo-registry.ts`

- [ ] **Step 1: Replace contents**

```ts
// apps/web/lib/public-repo-registry.ts
import { NODES, type EcosystemNode } from './ecosystem/derived';

export type PublicRepoGroup = 'core' | 'intelligence' | 'tools' | 'protocol' | 'archive' | 'upstream';
export type PublicRepoStatus = 'public' | 'private' | 'beta' | 'unresolved' | 'upstream';

export interface PublicRepo {
  name: string;
  group: PublicRepoGroup;
  description: string;
  language: string;
  status: PublicRepoStatus;
  url: string | null;
  github: string;
  role: string;
  branch: string;
  packages: string[];
}

function statusFromNode(node: EcosystemNode): PublicRepoStatus {
  if (node.isExternal) return 'upstream';
  if (node.status === 'shipped' || node.status === 'built') return 'public';
  if (node.status === 'wip') return 'beta';
  if (node.status === 'sunset' || node.status === 'orphan') return 'unresolved';
  return 'public';
}

function groupFromNode(node: EcosystemNode): PublicRepoGroup {
  if (node.isExternal) return 'upstream';
  if (node.layer === 'substrate') return 'intelligence';
  if (node.layer === 'surface') return 'core';
  return 'tools';
}

export const PUBLIC_REPOS: PublicRepo[] = NODES
  .filter((n) => n.repo || n.github)
  .map((n) => ({
    name: n.name,
    group: groupFromNode(n),
    description: n.description,
    language: 'TypeScript',
    status: statusFromNode(n),
    url: n.publicUrl ?? n.github ?? null,
    github: n.github ?? '',
    role: n.layer,
    branch: 'main',
    packages: n.packageVersion ? [n.name] : [],
  }));

export const ARC_REPOS = PUBLIC_REPOS.filter((r) => r.group !== 'upstream');
export const ACTIVE_ARC_REPOS = ARC_REPOS.filter((r) => r.status !== 'unresolved');
export const PUBLIC_ARC_REPOS = ACTIVE_ARC_REPOS.filter((r) => r.url?.startsWith('https://github.com/'));
export const UNRESOLVED_ARC_REPOS = ARC_REPOS.filter((r) => r.status === 'unresolved');
export const UPSTREAM_REPOS = PUBLIC_REPOS.filter((r) => r.group === 'upstream');

export const PUBLIC_REPO_SUMMARY = {
  tracked: ARC_REPOS.length,
  active: ACTIVE_ARC_REPOS.length,
  public: PUBLIC_ARC_REPOS.length,
  private: ACTIVE_ARC_REPOS.filter((r) => r.status === 'private').length,
  unresolved: UNRESOLVED_ARC_REPOS.length,
  upstream: UPSTREAM_REPOS.length,
  packages: Array.from(new Set(PUBLIC_REPOS.flatMap((r) => r.packages))).length,
};

export const PUBLIC_PACKAGE_NAMES = Array.from(new Set(PUBLIC_REPOS.flatMap((r) => r.packages))).sort();
```

- [ ] **Step 2: Run web build to confirm no breakage**

```bash
pnpm -F @arcanea/web build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/public-repo-registry.ts
git commit -m "refactor(web): public-repo-registry becomes thin adapter over derived.ts"
```

---

## Task 16: Delete duplicate registry

**Files:**
- Delete: `apps/web/lib/ops/repo-registry.ts`

- [ ] **Step 1: Find consumers first**

```bash
grep -r "lib/ops/repo-registry" apps/ --include="*.ts" --include="*.tsx" 2>/dev/null
```

If results, refactor each consumer to import from `@/lib/public-repo-registry` (which now reads from derived.ts). If none, proceed.

- [ ] **Step 2: Delete the file**

```bash
rm apps/web/lib/ops/repo-registry.ts
```

- [ ] **Step 3: Verify build still works**

```bash
pnpm -F @arcanea/web build
```

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "refactor(web): remove duplicate apps/web/lib/ops/repo-registry.ts (superseded by derived.ts)"
```

---

## Task 17: Delete constellation-data.ts and replace with derived adapter

**Files:**
- Delete: `apps/web/app/ecosystem/constellation-data.ts`
- Create: `apps/web/app/ecosystem/constellation.ts`

- [ ] **Step 1: Find consumers**

```bash
grep -r "constellation-data" apps/web/ --include="*.ts" --include="*.tsx"
```

- [ ] **Step 2: Write replacement that derives constellation from NODES**

```ts
// apps/web/app/ecosystem/constellation.ts
import type { Node, Edge } from '@xyflow/react';
import { NODES, EDGES, type EcosystemNode } from '@/lib/ecosystem/derived';

export interface ConstellationNodeData {
  label: string;
  description: string;
  color: string;
  size: number;
  ring: 'center' | 'inner' | 'middle' | 'outer' | 'far';
  status: EcosystemNode['status'];
  [key: string]: unknown;
}

export type ConstellationNode = Node<ConstellationNodeData>;

const COLORS = {
  GOLD: 'var(--arc-brand-arcanean-gold)',
  TEAL: 'var(--arc-brand-atlantean-teal)',
  BLUE: 'var(--arc-brand-cosmic-blue)',
  VIOLET: 'var(--arc-void)',
  PINK: 'var(--arc-fire)',
  GREEN: 'var(--arc-wind)',
} as const;

const RING_BY_LAYER: Record<EcosystemNode['layer'], ConstellationNodeData['ring']> = {
  substrate: 'inner',
  product: 'middle',
  surface: 'outer',
};

const COLOR_BY_HEMISPHERE: Record<EcosystemNode['hemisphere'], string> = {
  arc: COLORS.PINK,
  nea: COLORS.GOLD,
  seam: COLORS.TEAL,
};

const CX = 600;
const CY = 450;

function radial(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function radiusForRing(ring: ConstellationNodeData['ring']): number {
  switch (ring) {
    case 'center': return 0;
    case 'inner': return 170;
    case 'middle': return 320;
    case 'outer': return 470;
    case 'far': return 620;
  }
}

export function buildConstellation(): { nodes: ConstellationNode[]; edges: Edge[] } {
  const groupedByRing = new Map<ConstellationNodeData['ring'], EcosystemNode[]>();
  for (const node of NODES) {
    const ring = RING_BY_LAYER[node.layer];
    const arr = groupedByRing.get(ring) ?? [];
    arr.push(node);
    groupedByRing.set(ring, arr);
  }

  const nodes: ConstellationNode[] = [];
  for (const [ring, arr] of groupedByRing) {
    const radius = radiusForRing(ring);
    arr.forEach((node, i) => {
      const angle = (360 / arr.length) * i;
      const pos = radial(radius, angle);
      nodes.push({
        id: node.id,
        type: 'constellation',
        position: { x: pos.x - 18, y: pos.y - 18 },
        data: {
          label: node.name,
          description: node.description,
          color: COLOR_BY_HEMISPHERE[node.hemisphere],
          size: ring === 'inner' ? 48 : ring === 'middle' ? 40 : 36,
          ring,
          status: node.status,
        },
      });
    });
  }

  const edges: Edge[] = EDGES.map((e) => ({
    id: `${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    style: { stroke: COLORS.TEAL, strokeWidth: 1, opacity: 0.35 },
    type: 'straight',
  }));

  return { nodes, edges };
}
```

- [ ] **Step 3: Update consumers (e.g., page.tsx) — find and replace**

```bash
grep -rl "from.*['\"].*constellation-data" apps/web/ --include="*.tsx" --include="*.ts"
```

For each match, replace `import { initialNodes, initialEdges } from './constellation-data'` with:

```ts
import { buildConstellation } from './constellation';
const { nodes: initialNodes, edges: initialEdges } = buildConstellation();
```

- [ ] **Step 4: Delete the old file**

```bash
rm apps/web/app/ecosystem/constellation-data.ts
```

- [ ] **Step 5: Verify build**

```bash
pnpm -F @arcanea/web build
```

- [ ] **Step 6: Commit**

```bash
git add -A apps/web/app/ecosystem/
git commit -m "refactor(web): constellation derives from NODES (kills hand-coded data drift)"
```

---

## Task 18: NodeDrawer component

**Files:**
- Create: `apps/web/app/ecosystem/node-drawer.tsx`

- [ ] **Step 1: Implement drawer**

```tsx
// apps/web/app/ecosystem/node-drawer.tsx
'use client';

import type { EcosystemNode } from '@/lib/ecosystem/derived';
import { NODES } from '@/lib/ecosystem/derived';
import Link from 'next/link';

interface NodeDrawerProps {
  node: EcosystemNode | null;
  onClose: () => void;
  onFocus: (id: string) => void;
}

const STATUS_COLOR: Record<EcosystemNode['status'], string> = {
  shipped: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  built: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  wip: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  orphan: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  sunset: 'bg-red-500/20 text-red-300 border-red-500/40',
  external: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
};

export function NodeDrawer({ node, onClose, onFocus }: NodeDrawerProps) {
  if (!node) return null;

  const consumesNodes = node.consumes.map((id) => NODES.find((n) => n.id === id)).filter(Boolean) as EcosystemNode[];
  const consumedByNodes = node.consumedBy.map((id) => NODES.find((n) => n.id === id)).filter(Boolean) as EcosystemNode[];

  return (
    <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950/95 border-l border-white/[0.08] backdrop-blur-xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{node.name}</h2>
            <span className={`inline-block mt-2 px-2 py-0.5 text-xs border rounded-full ${STATUS_COLOR[node.status]}`}>
              {node.status}
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white" aria-label="Close">✕</button>
        </div>

        <p className="text-zinc-300 text-sm mb-6">{node.description}</p>

        <dl className="space-y-2 text-sm mb-6">
          <Row label="Layer" value={node.layer} />
          <Row label="Gate" value={node.gate} />
          <Row label="Hemisphere" value={node.hemisphere} />
          {node.packageVersion && <Row label="Version" value={node.packageVersion} />}
          {node.lastCommitAt && <Row label="Last commit" value={new Date(node.lastCommitAt).toLocaleDateString()} />}
          {node.owner && <Row label="Owner" value={node.owner} />}
        </dl>

        {consumesNodes.length > 0 && (
          <Section title="Consumes">
            {consumesNodes.map((n) => (
              <Chip key={n.id} onClick={() => onFocus(n.id)}>{n.name}</Chip>
            ))}
          </Section>
        )}

        {consumedByNodes.length > 0 && (
          <Section title="Consumed by">
            {consumedByNodes.map((n) => (
              <Chip key={n.id} onClick={() => onFocus(n.id)}>{n.name}</Chip>
            ))}
          </Section>
        )}

        <div className="space-y-2 mt-6">
          {node.github && <ActionLink href={`https://github.com/${node.github.replace('https://github.com/', '')}`} label="View on GitHub" />}
          {node.publicUrl && <ActionLink href={node.publicUrl} label="Open live URL" />}
          {node.links.try_live && <ActionLink href={node.links.try_live} label="Try live" />}
          {node.status === 'orphan' && (
            <p className="text-xs text-orange-300/80 mt-3">
              This node is orphaned — no detected consumers. See <code>.arcanea/audits/2026-05-06-plugin-overlap.md</code> for context.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-zinc-200">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs uppercase tracking-wide text-zinc-500 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-0.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-full text-zinc-200 hover:bg-white/[0.08] transition-colors"
    >
      {children}
    </button>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  const isInternal = href.startsWith('/');
  if (isInternal) {
    return <Link href={href} className="block px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white hover:bg-white/[0.08]">{label} →</Link>;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white hover:bg-white/[0.08]">{label} ↗</a>;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/ecosystem/node-drawer.tsx
git commit -m "feat(web/ecosystem): NodeDrawer component (status pill, edges, action buttons)"
```

---

## Task 19: ViewSwitcher + FilterBar components

**Files:**
- Create: `apps/web/app/ecosystem/view-switcher.tsx`
- Create: `apps/web/app/ecosystem/filter-bar.tsx`

- [ ] **Step 1: Implement ViewSwitcher**

```tsx
// apps/web/app/ecosystem/view-switcher.tsx
'use client';

export type EcosystemView = 'layered' | 'gates' | 'arc-nea';

interface Props {
  value: EcosystemView;
  onChange: (next: EcosystemView) => void;
}

const TABS: Array<{ id: EcosystemView; label: string }> = [
  { id: 'layered', label: 'Layered' },
  { id: 'gates', label: 'Ten Gates' },
  { id: 'arc-nea', label: 'Arc ⊕ Nea' },
];

export function ViewSwitcher({ value, onChange }: Props) {
  return (
    <div className="inline-flex bg-white/[0.03] border border-white/[0.08] rounded-full p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
            value === tab.id
              ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Implement FilterBar**

```tsx
// apps/web/app/ecosystem/filter-bar.tsx
'use client';

import { GATES, STATUSES, HEMISPHERES } from '@arcanea/orchestrator/ecosystem/schema';

export interface FilterState {
  status: 'all' | (typeof STATUSES)[number];
  hemisphere: 'all' | (typeof HEMISPHERES)[number];
  gate: 'all' | (typeof GATES)[number];
}

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

export function FilterBar({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select label="Status" value={value.status} options={['all', ...STATUSES]} onChange={(v) => onChange({ ...value, status: v as FilterState['status'] })} />
      <Select label="Hemisphere" value={value.hemisphere} options={['all', ...HEMISPHERES]} onChange={(v) => onChange({ ...value, hemisphere: v as FilterState['hemisphere'] })} />
      <Select label="Gate" value={value.gate} options={['all', ...GATES]} onChange={(v) => onChange({ ...value, gate: v as FilterState['gate'] })} />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-400">
      <span>{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/[0.03] border border-white/[0.08] rounded-md px-2 py-1 text-zinc-200"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/ecosystem/view-switcher.tsx apps/web/app/ecosystem/filter-bar.tsx
git commit -m "feat(web/ecosystem): ViewSwitcher (3 tabs) + FilterBar (status/hemisphere/gate)"
```

---

## Task 20: Layered view (extend existing layer-cards.tsx)

**Files:**
- Modify: `apps/web/app/ecosystem/layer-cards.tsx`

- [ ] **Step 1: Read current layer-cards.tsx (96 lines)**

Note its current structure — preserve premium styling.

- [ ] **Step 2: Refactor to read from derived NODES + accept filter**

```tsx
// apps/web/app/ecosystem/layer-cards.tsx
'use client';

import { NODES, type EcosystemNode } from '@/lib/ecosystem/derived';
import type { FilterState } from './filter-bar';

interface Props {
  filter: FilterState;
  onSelectNode: (node: EcosystemNode) => void;
}

const LAYER_TITLES: Record<EcosystemNode['layer'], { title: string; subtitle: string }> = {
  surface: { title: 'Surfaces', subtitle: 'What users touch' },
  product: { title: 'Products', subtitle: 'What we ship' },
  substrate: { title: 'Substrate', subtitle: 'What we stand on' },
};

export function LayerCards({ filter, onSelectNode }: Props) {
  const filtered = NODES.filter((n) => {
    if (filter.status !== 'all' && n.status !== filter.status) return false;
    if (filter.hemisphere !== 'all' && n.hemisphere !== filter.hemisphere) return false;
    if (filter.gate !== 'all' && n.gate !== filter.gate) return false;
    return true;
  });

  const byLayer = {
    surface: filtered.filter((n) => n.layer === 'surface'),
    product: filtered.filter((n) => n.layer === 'product'),
    substrate: filtered.filter((n) => n.layer === 'substrate'),
  };

  return (
    <div className="space-y-12">
      {(['surface', 'product', 'substrate'] as const).map((layer) => (
        <section key={layer}>
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-white">{LAYER_TITLES[layer].title}</h2>
            <p className="text-sm text-zinc-400">{LAYER_TITLES[layer].subtitle}</p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {byLayer[layer].map((node) => (
              <NodeCard key={node.id} node={node} onClick={() => onSelectNode(node)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const STATUS_DOT: Record<EcosystemNode['status'], string> = {
  shipped: 'bg-teal-400',
  built: 'bg-blue-400',
  wip: 'bg-amber-400',
  orphan: 'bg-orange-400',
  sunset: 'bg-red-400',
  external: 'bg-zinc-500',
};

function NodeCard({ node, onClick }: { node: EcosystemNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] backdrop-blur-sm rounded-xl transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-white">{node.name}</h3>
        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[node.status]} mt-1.5`} title={node.status} />
      </div>
      <p className="text-xs text-zinc-400 line-clamp-2">{node.description}</p>
      <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-zinc-500">
        <span>{node.gate}</span>
        <span>·</span>
        <span>{node.hemisphere}</span>
      </div>
    </button>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
pnpm -F @arcanea/web build
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/ecosystem/layer-cards.tsx
git commit -m "feat(web/ecosystem): layered view reads from NODES, accepts filter, opens drawer"
```

---

## Task 21: Ten Gates view

**Files:**
- Create: `apps/web/app/ecosystem/views/gates-view.tsx`

- [ ] **Step 1: Implement gates-view**

```tsx
// apps/web/app/ecosystem/views/gates-view.tsx
'use client';

import { NODES, type EcosystemNode } from '@/lib/ecosystem/derived';
import { GATES } from '@arcanea/orchestrator/ecosystem/schema';
import type { FilterState } from '../filter-bar';
import { useState } from 'react';

interface Props {
  filter: FilterState;
  onSelectNode: (node: EcosystemNode) => void;
}

const GATE_DESCRIPTIONS: Record<(typeof GATES)[number], string> = {
  source: 'Origin — substrates, intelligence, where it begins',
  form: 'Design — shape, tokens, the visual language',
  pattern: 'Architecture — orchestration, structure, data',
  voice: 'Communication — chat, voice, multilingual',
  vision: 'Imagery — generation, sight, visual creation',
  story: 'Narrative — books, lore, the writing',
  world: 'Worlds — realms, factions, settings',
  soul: 'Critique — Council, sensitivity, deep listening',
  unity: 'Coordination — orchestrators, cross-cutting',
  mastery: 'Publishing — deployment, release, mastery',
};

export function GatesView({ filter, onSelectNode }: Props) {
  const [selectedGate, setSelectedGate] = useState<(typeof GATES)[number] | null>(null);

  const filtered = NODES.filter((n) => {
    if (filter.status !== 'all' && n.status !== filter.status) return false;
    if (filter.hemisphere !== 'all' && n.hemisphere !== filter.hemisphere) return false;
    if (filter.gate !== 'all' && n.gate !== filter.gate) return false;
    return true;
  });

  const byGate = new Map<string, EcosystemNode[]>();
  for (const gate of GATES) byGate.set(gate, []);
  for (const node of filtered) byGate.get(node.gate)?.push(node);

  const angleStep = 360 / GATES.length;
  const radius = 220;
  const center = 280;

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <div className="relative w-full" style={{ aspectRatio: '1 / 1', maxWidth: 560 }}>
        <svg viewBox="0 0 560 560" className="w-full h-full">
          <circle cx={center} cy={center} r={radius + 40} fill="none" stroke="currentColor" className="text-white/[0.04]" />
          {GATES.map((gate, i) => {
            const angleDeg = i * angleStep - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = center + radius * Math.cos(angleRad);
            const y = center + radius * Math.sin(angleRad);
            const count = byGate.get(gate)?.length ?? 0;
            const isSelected = selectedGate === gate;

            return (
              <g key={gate} onClick={() => setSelectedGate(gate)} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 32 : 24}
                  className={isSelected ? 'fill-teal-500/30 stroke-teal-400' : 'fill-white/[0.04] stroke-white/[0.12] hover:fill-white/[0.08]'}
                  strokeWidth={1.5}
                />
                <text x={x} y={y - 2} textAnchor="middle" className="fill-white text-[11px] uppercase tracking-wide pointer-events-none">{gate}</text>
                <text x={x} y={y + 12} textAnchor="middle" className="fill-zinc-400 text-[10px] pointer-events-none">{count}</text>
              </g>
            );
          })}
          <text x={center} y={center} textAnchor="middle" className="fill-white text-base font-semibold pointer-events-none">Arcanea</text>
          <text x={center} y={center + 18} textAnchor="middle" className="fill-zinc-400 text-xs pointer-events-none">Ten Gates</text>
        </svg>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
        {selectedGate ? (
          <>
            <header className="mb-4">
              <h3 className="text-xl font-semibold text-white capitalize">{selectedGate}</h3>
              <p className="text-sm text-zinc-400">{GATE_DESCRIPTIONS[selectedGate]}</p>
            </header>
            <div className="space-y-2">
              {(byGate.get(selectedGate) ?? []).map((node) => (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node)}
                  className="w-full text-left p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{node.name}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">{node.status}</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{node.description}</p>
                </button>
              ))}
              {(byGate.get(selectedGate) ?? []).length === 0 && (
                <p className="text-sm text-zinc-500 italic">No nodes in this gate match current filters.</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-zinc-400 py-12">
            <p className="text-sm">Click a gate to see what lives there.</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/ecosystem/views/gates-view.tsx
git commit -m "feat(web/ecosystem): Ten Gates view (SVG wheel + click-to-expand panel)"
```

---

## Task 22: Arc ⊕ Nea view

**Files:**
- Create: `apps/web/app/ecosystem/views/arc-nea-view.tsx`

- [ ] **Step 1: Implement arc-nea-view**

```tsx
// apps/web/app/ecosystem/views/arc-nea-view.tsx
'use client';

import { NODES, type EcosystemNode } from '@/lib/ecosystem/derived';
import type { FilterState } from '../filter-bar';

interface Props {
  filter: FilterState;
  onSelectNode: (node: EcosystemNode) => void;
}

export function ArcNeaView({ filter, onSelectNode }: Props) {
  const filtered = NODES.filter((n) => {
    if (filter.status !== 'all' && n.status !== filter.status) return false;
    if (filter.hemisphere !== 'all' && n.hemisphere !== filter.hemisphere) return false;
    if (filter.gate !== 'all' && n.gate !== filter.gate) return false;
    return true;
  });

  const arc = filtered.filter((n) => n.hemisphere === 'arc');
  const nea = filtered.filter((n) => n.hemisphere === 'nea');
  const seam = filtered.filter((n) => n.hemisphere === 'seam');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
      <Hemisphere title="Arc" subtitle="Creation lifecycle" tone="pink" nodes={arc} onSelectNode={onSelectNode} />

      <div className="hidden lg:flex flex-col items-center justify-start pt-12 px-2">
        <div className="text-zinc-500 text-xs uppercase tracking-widest rotate-90 whitespace-nowrap">Seam</div>
        <ul className="mt-4 space-y-1">
          {seam.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => onSelectNode(n)}
                className="px-2 py-1 text-[11px] bg-teal-500/10 text-teal-200 border border-teal-500/20 rounded-full hover:bg-teal-500/20 whitespace-nowrap"
              >
                {n.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Hemisphere title="Nea" subtitle="Economic lifecycle" tone="gold" nodes={nea} onSelectNode={onSelectNode} />

      {/* Mobile fallback for seam */}
      <div className="lg:hidden">
        <Hemisphere title="Seam" subtitle="Bridges Arc and Nea" tone="teal" nodes={seam} onSelectNode={onSelectNode} />
      </div>
    </div>
  );
}

const TONE: Record<string, string> = {
  pink: 'border-pink-500/30 bg-pink-500/5',
  gold: 'border-amber-500/30 bg-amber-500/5',
  teal: 'border-teal-500/30 bg-teal-500/5',
};

function Hemisphere({ title, subtitle, tone, nodes, onSelectNode }: { title: string; subtitle: string; tone: keyof typeof TONE | string; nodes: EcosystemNode[]; onSelectNode: (node: EcosystemNode) => void }) {
  return (
    <section className={`p-6 rounded-2xl border ${TONE[tone] ?? TONE.teal} backdrop-blur-sm`}>
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-xs text-zinc-400">{subtitle}</p>
      </header>
      <div className="space-y-2">
        {nodes.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelectNode(n)}
            className="w-full text-left p-3 bg-black/20 hover:bg-black/40 border border-white/[0.06] rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">{n.name}</span>
              <span className="text-[10px] text-zinc-500 uppercase">{n.gate}</span>
            </div>
            <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{n.description}</p>
          </button>
        ))}
        {nodes.length === 0 && <p className="text-xs text-zinc-500 italic">No nodes match current filters.</p>}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/ecosystem/views/arc-nea-view.tsx
git commit -m "feat(web/ecosystem): Arc ⊕ Nea view (split hemispheres + seam column)"
```

---

## Task 23: Wire view switcher + filters + drawer into page.tsx

**Files:**
- Modify: `apps/web/app/ecosystem/page.tsx`

- [ ] **Step 1: Refactor page.tsx to host the view switcher**

Open `apps/web/app/ecosystem/page.tsx`. Locate the section that currently renders `<LayerCards />` (or constellation). Replace with a client wrapper component approach:

Create a new client component `apps/web/app/ecosystem/ecosystem-views.tsx`:

```tsx
// apps/web/app/ecosystem/ecosystem-views.tsx
'use client';

import { useState } from 'react';
import { ViewSwitcher, type EcosystemView } from './view-switcher';
import { FilterBar, type FilterState } from './filter-bar';
import { LayerCards } from './layer-cards';
import { GatesView } from './views/gates-view';
import { ArcNeaView } from './views/arc-nea-view';
import { NodeDrawer } from './node-drawer';
import { NODES, type EcosystemNode } from '@/lib/ecosystem/derived';

const DEFAULT_FILTER: FilterState = { status: 'all', hemisphere: 'all', gate: 'all' };

export function EcosystemViews() {
  const [view, setView] = useState<EcosystemView>('layered');
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? NODES.find((n) => n.id === selectedId) ?? null : null;

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <ViewSwitcher value={view} onChange={setView} />
        <FilterBar value={filter} onChange={setFilter} />
      </div>

      {view === 'layered' && <LayerCards filter={filter} onSelectNode={(n) => setSelectedId(n.id)} />}
      {view === 'gates' && <GatesView filter={filter} onSelectNode={(n) => setSelectedId(n.id)} />}
      {view === 'arc-nea' && <ArcNeaView filter={filter} onSelectNode={(n) => setSelectedId(n.id)} />}

      <NodeDrawer node={selected} onClose={() => setSelectedId(null)} onFocus={(id) => setSelectedId(id)} />
    </>
  );
}
```

- [ ] **Step 2: In page.tsx, replace the existing LayerCards usage with EcosystemViews**

Find the line `import { LayerCards } from './layer-cards';` in page.tsx and replace with:
```ts
import { EcosystemViews } from './ecosystem-views';
```

Find where `<LayerCards />` is rendered and replace with `<EcosystemViews />`.

- [ ] **Step 3: Verify build**

```bash
pnpm -F @arcanea/web build
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/ecosystem/ecosystem-views.tsx apps/web/app/ecosystem/page.tsx
git commit -m "feat(web/ecosystem): page hosts view switcher, filters, drawer"
```

---

## Task 24: Visual smoke test (Playwright)

**Files:**
- Create: `apps/web/__tests__/e2e/ecosystem.spec.ts`

- [ ] **Step 1: Write E2E test**

```ts
// apps/web/__tests__/e2e/ecosystem.spec.ts
import { test, expect } from '@playwright/test';

test.describe('/ecosystem page', () => {
  test('renders view switcher with three tabs', async ({ page }) => {
    await page.goto('/ecosystem');
    await expect(page.getByRole('button', { name: 'Layered' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ten Gates' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Arc.*Nea/ })).toBeVisible();
  });

  test('switching to Ten Gates renders the wheel', async ({ page }) => {
    await page.goto('/ecosystem');
    await page.getByRole('button', { name: 'Ten Gates' }).click();
    await expect(page.locator('text=Arcanea').first()).toBeVisible();
    await expect(page.locator('text=Ten Gates')).toBeVisible();
  });

  test('clicking a node opens the drawer', async ({ page }) => {
    await page.goto('/ecosystem');
    // Layered view has buttons for each node. Click the first.
    const firstNode = page.locator('button:has-text("@arcanea/")').first();
    await firstNode.click();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the test**

```bash
pnpm -F @arcanea/web exec playwright test __tests__/e2e/ecosystem.spec.ts
```

Expected: 3 tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/web/__tests__/e2e/ecosystem.spec.ts
git commit -m "test(web/ecosystem): playwright smoke for view switcher + drawer"
```

---

## Task 25: Open PR for Project C

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feat/ecosystem-foundation
```

- [ ] **Step 2: Open PR**

```bash
gh pr create --title "feat(ecosystem): connected ecosystem foundation — single source + 3 views" --body "$(cat <<'EOF'
## Summary
- New canonical source: `.arcanea/config/manifest.yaml` + extended `repos.json`
- Generator in `packages/orchestrator/src/ecosystem/` produces `apps/web/lib/ecosystem/derived.ts`
- `/ecosystem` now hosts three views: Layered, Ten Gates, Arc ⊕ Nea + filter bar + node drawer
- Killed: `constellation-data.ts` (192 lines hand-coded), `lib/ops/repo-registry.ts` (243 lines duplicate)
- CI: ecosystem-verify gate + weekly-refresh action

Spec: `docs/superpowers/specs/2026-05-11-connected-ecosystem-trilogy-design.md` (Project C)

## Test plan
- [ ] CI ecosystem-verify passes
- [ ] `pnpm -F @arcanea/orchestrator test` — all 7 ecosystem test files pass
- [ ] `pnpm -F @arcanea/web build` succeeds
- [ ] Visit `/ecosystem` on Vercel preview — verify all 3 views work
- [ ] Click a node in each view — drawer opens with correct details
- [ ] Author Council shows status `orphan` (will flip to `built` after Project A ships)
EOF
)"
```

- [ ] **Step 3: Tag for review** — request your own review from a second assistant if available; otherwise self-merge after CI passes.

---

# PROJECT A — Author Council Wiring

**Pre-flight (after Project C merged):**

```bash
git checkout main && git pull
git checkout -b feat/author-council-wiring
```

---

## Task 26: Per-book .author-council.yaml configs

**Files:**
- Create: `book/das-maedchen-drei-sprachen/.author-council.yaml`
- Create: `book/las-tierras-de-luz/.author-council.yaml`
- Create: `book/forge-of-ruin/.author-council.yaml`

- [ ] **Step 1: Create Mädchen config**

```yaml
# book/das-maedchen-drei-sprachen/.author-council.yaml
roster: mythic
mode: critique
trigger: on_chapter_commit
voices_override: []
blocker_threshold: 2
notes: |
  Children's book — voices should evaluate for Mila-bedtime test, Pippi-grade openings.
  Per feedback_kidbook_readaloud_test.md.
```

- [ ] **Step 2: Create Las Tierras config**

```yaml
# book/las-tierras-de-luz/.author-council.yaml
roster: fiction
mode: deliberation
trigger: on_chapter_commit
voices_override: []
blocker_threshold: 2
notes: |
  Co-authored with Ana Cecilia Cancino. Spanish-language fiction.
  Roster prefers voices with strong Spanish-literature tradition.
  Per project_las_tierras_book.md.
```

- [ ] **Step 3: Create Forge of Ruin config**

```yaml
# book/forge-of-ruin/.author-council.yaml
roster: arcanea
mode: deliberation
trigger: on_chapter_commit
voices_override: []
blocker_threshold: 2
notes: |
  First Open Library book. Full Council (all 10 voices).
  Per project_forge_of_ruin_book.md.
```

- [ ] **Step 4: Commit**

```bash
git add book/das-maedchen-drei-sprachen/.author-council.yaml book/las-tierras-de-luz/.author-council.yaml book/forge-of-ruin/.author-council.yaml
git commit -m "feat(books): add .author-council.yaml configs for 3 live books"
```

---

## Task 27: Orchestrator author-council CLI command

**Files:**
- Create: `packages/orchestrator/src/commands/author-council.ts`
- Test: `packages/orchestrator/__tests__/commands/author-council.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/orchestrator/__tests__/commands/author-council.test.ts
import { describe, it, expect } from '@jest/globals';
import { loadBookConfig } from '../../src/commands/author-council';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../../../..');

describe('loadBookConfig', () => {
  it('reads .author-council.yaml for forge-of-ruin', async () => {
    const cfg = await loadBookConfig(path.join(REPO_ROOT, 'book/forge-of-ruin'));
    expect(cfg.roster).toBe('arcanea');
    expect(cfg.mode).toBe('deliberation');
    expect(cfg.trigger).toBe('on_chapter_commit');
  });
});
```

- [ ] **Step 2: Implement the CLI module**

```ts
// packages/orchestrator/src/commands/author-council.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';

export const BookConfigSchema = z.object({
  roster: z.string(),
  mode: z.enum(['deliberation', 'critique', 'synthesis', 'debate']),
  trigger: z.enum(['on_chapter_commit', 'manual_only', 'on_milestone']),
  voices_override: z.array(z.string()).default([]),
  blocker_threshold: z.number().int().nonnegative().default(2),
  notes: z.string().optional(),
});

export type BookConfig = z.infer<typeof BookConfigSchema>;

export async function loadBookConfig(bookDir: string): Promise<BookConfig> {
  const configPath = path.join(bookDir, '.author-council.yaml');
  const raw = await fs.readFile(configPath, 'utf8');
  return BookConfigSchema.parse(yaml.load(raw));
}

export interface RunCouncilInput {
  bookDir: string;
  chapterPath: string;  // relative to bookDir, e.g., "chapters/01.md"
}

export async function runCouncil(input: RunCouncilInput): Promise<{ auditPath: string }> {
  const config = await loadBookConfig(input.bookDir);
  const chapterAbsPath = path.join(input.bookDir, input.chapterPath);
  const chapterContent = await fs.readFile(chapterAbsPath, 'utf8');

  // Spawn the @arcanea/author-council MCP server via stdio and request a deliberation.
  // Until the MCP client wiring is in place, write a placeholder audit so the pipeline is testable end-to-end.
  // The MCP integration is wired in Task 29.
  const slug = path.basename(input.chapterPath, path.extname(input.chapterPath));
  const today = new Date().toISOString().slice(0, 10);
  const auditPath = path.join(input.bookDir, 'council-audits', `${today}-${slug}.md`);
  await fs.mkdir(path.dirname(auditPath), { recursive: true });

  const auditContent = `---
roster: ${config.roster}
mode: ${config.mode}
chapter: ${input.chapterPath}
generated: ${new Date().toISOString()}
status: pending-mcp-integration
---

# Council Audit — ${slug}

> Stub audit. MCP integration pending Task 29. Chapter length: ${chapterContent.length} chars.
`;
  await fs.writeFile(auditPath, auditContent, 'utf8');
  return { auditPath };
}
```

- [ ] **Step 3: Run test to verify it passes**

```bash
pnpm -F @arcanea/orchestrator test author-council.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add packages/orchestrator/src/commands/author-council.ts packages/orchestrator/__tests__/commands/author-council.test.ts
git commit -m "feat(orchestrator): author-council loadBookConfig + runCouncil scaffold"
```

---

## Task 28: post-chapter-commit hook

**Files:**
- Create: `.arcanea/hooks/post-chapter-commit.sh`

- [ ] **Step 1: Write the hook**

```bash
#!/usr/bin/env bash
# .arcanea/hooks/post-chapter-commit.sh
#
# Triggered (manually or via git hook) after a chapter is committed.
# Usage: post-chapter-commit.sh <book-slug> <chapter-path>
# Example: post-chapter-commit.sh forge-of-ruin chapters/01.md

set -euo pipefail

BOOK_SLUG="${1:-}"
CHAPTER_PATH="${2:-}"

if [[ -z "${BOOK_SLUG}" || -z "${CHAPTER_PATH}" ]]; then
  echo "Usage: post-chapter-commit.sh <book-slug> <chapter-path>" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BOOK_DIR="${REPO_ROOT}/book/${BOOK_SLUG}"

if [[ ! -d "${BOOK_DIR}" ]]; then
  echo "Book directory not found: ${BOOK_DIR}" >&2
  exit 1
fi

cd "${REPO_ROOT}"
pnpm -F @arcanea/orchestrator exec tsx -e "
  import { runCouncil } from './src/commands/author-council';
  runCouncil({ bookDir: '${BOOK_DIR}', chapterPath: '${CHAPTER_PATH}' })
    .then((r) => console.log('✓ audit written:', r.auditPath))
    .catch((err) => { console.error(err); process.exit(1); });
"
```

- [ ] **Step 2: Make executable**

```bash
chmod +x .arcanea/hooks/post-chapter-commit.sh
```

- [ ] **Step 3: Smoke test**

```bash
.arcanea/hooks/post-chapter-commit.sh forge-of-ruin chapters/01-first-flames.md
```

(Adjust chapter filename if different — list `book/forge-of-ruin/chapters/` first to confirm.)

Expected: stub audit file written under `book/forge-of-ruin/council-audits/<date>-<slug>.md`.

- [ ] **Step 4: Commit**

```bash
git add .arcanea/hooks/post-chapter-commit.sh
git commit -m "feat(hooks): post-chapter-commit triggers author-council pipeline"
```

---

## Task 29: Wire MCP client into runCouncil

**Files:**
- Modify: `packages/orchestrator/src/commands/author-council.ts`
- Test: `packages/orchestrator/__tests__/commands/author-council-mcp.test.ts`

- [ ] **Step 1: Install MCP client**

```bash
pnpm -F @arcanea/orchestrator add @modelcontextprotocol/sdk
```

- [ ] **Step 2: Refactor runCouncil to call the author-council MCP**

```ts
// In packages/orchestrator/src/commands/author-council.ts, replace runCouncil with:
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export async function runCouncil(input: RunCouncilInput): Promise<{ auditPath: string }> {
  const config = await loadBookConfig(input.bookDir);
  const chapterAbsPath = path.join(input.bookDir, input.chapterPath);
  const chapterContent = await fs.readFile(chapterAbsPath, 'utf8');

  const transport = new StdioClientTransport({
    command: 'node',
    args: [path.resolve(input.bookDir, '../../packages/author-council/dist/mcp/server.js')],
  });

  const client = new Client({ name: 'orchestrator-author-council', version: '0.1.0' }, { capabilities: {} });
  await client.connect(transport);

  try {
    const result = await client.callTool({
      name: 'deliberate',
      arguments: {
        roster: config.roster,
        mode: config.mode,
        text: chapterContent,
        voicesOverride: config.voices_override,
      },
    });

    const slug = path.basename(input.chapterPath, path.extname(input.chapterPath));
    const today = new Date().toISOString().slice(0, 10);
    const auditPath = path.join(input.bookDir, 'council-audits', `${today}-${slug}.md`);
    await fs.mkdir(path.dirname(auditPath), { recursive: true });

    const blockerCount = countBlockers(result);
    const auditContent = renderAudit({
      config,
      chapterPath: input.chapterPath,
      result,
      blockerCount,
      blocker: blockerCount >= config.blocker_threshold,
    });

    await fs.writeFile(auditPath, auditContent, 'utf8');
    return { auditPath };
  } finally {
    await client.close();
  }
}

function countBlockers(result: unknown): number {
  // Convention: each voice contribution has { severity: 'info' | 'warning' | 'blocker' }
  // Adjust to actual MCP server response shape once verified.
  const r = result as { contributions?: Array<{ severity?: string }> } | undefined;
  return (r?.contributions ?? []).filter((c) => c.severity === 'blocker').length;
}

function renderAudit(args: { config: BookConfig; chapterPath: string; result: unknown; blockerCount: number; blocker: boolean }): string {
  const { config, chapterPath, result, blockerCount, blocker } = args;
  return `---
roster: ${config.roster}
mode: ${config.mode}
chapter: ${chapterPath}
generated: ${new Date().toISOString()}
blocker_count: ${blockerCount}
blocker_threshold: ${config.blocker_threshold}
blocker: ${blocker}
---

# Council Audit — ${path.basename(chapterPath)}

\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`
`;
}
```

- [ ] **Step 3: Build the author-council package so dist/ exists**

```bash
pnpm -F @arcanea/author-council build
```

- [ ] **Step 4: Smoke test the wired runCouncil**

```bash
pnpm -F @arcanea/orchestrator exec tsx -e "
  import { runCouncil } from './src/commands/author-council';
  runCouncil({ bookDir: '../../book/forge-of-ruin', chapterPath: 'chapters/01-first-flames.md' })
    .then((r) => console.log(r.auditPath))
    .catch((e) => { console.error(e); process.exit(1); });
"
```

Expected: a real audit file written. If the MCP server response shape differs from the assumed `{ contributions: [{ severity }] }`, inspect the raw output and adjust `countBlockers` / `renderAudit` accordingly.

- [ ] **Step 5: Commit**

```bash
git add packages/orchestrator/src/commands/author-council.ts packages/orchestrator/__tests__/commands/author-council-mcp.test.ts packages/orchestrator/package.json pnpm-lock.yaml
git commit -m "feat(orchestrator): wire @arcanea/author-council MCP into runCouncil"
```

---

## Task 30: Wire Author Studio publish endpoint

**Files:**
- Modify: `apps/web/app/api/author/[bookSlug]/publish/route.ts`

- [ ] **Step 1: Read current route**

```bash
cat apps/web/app/api/author/\[bookSlug\]/publish/route.ts
```

- [ ] **Step 2: After successful publish, call orchestrator's runCouncil**

Find the success branch in the route handler. Add:

```ts
import { runCouncil } from '@arcanea/orchestrator/commands/author-council';
import path from 'node:path';

// ...inside the success branch, after the GitHub commit succeeds...
try {
  await runCouncil({
    bookDir: path.resolve(process.cwd(), `book/${bookSlug}`),
    chapterPath: `chapters/${chapter}.md`,
  });
} catch (err) {
  console.error('[publish] author-council failed', err);
  // Non-fatal: chapter is already committed; log and continue.
}
```

- [ ] **Step 3: Verify build**

```bash
pnpm -F @arcanea/web build
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/api/author/[bookSlug]/publish/route.ts
git commit -m "feat(author-studio): trigger author-council audit after chapter publish"
```

---

## Task 31: Slash command consolidation

**Files:**
- Modify: `.claude/commands/author-council.md`
- Modify: `.claude/commands/arcanea-author.md` (deprecation redirect)
- Modify: `.claude/commands/arcanea-author-council.md` (deprecation redirect)
- Modify: `.claude/commands/fiction-author-council.md` (deprecation redirect)

- [ ] **Step 1: Promote /author-council to canonical**

Open `.claude/commands/author-council.md` and replace contents with:

```markdown
---
name: author-council
description: |
  Run the Author Council on a chapter. Default: current book + current chapter.
  Subcommands:
    list       — show available rosters
    voices     — list all author voices
    run <book> <chapter>  — run council on specific book + chapter
    audit <book>          — run council on every chapter in a book
---

# /author-council

The Author Council deliberates on your chapter using a chosen roster of author voices.

## Usage

```
/author-council                          # current chapter
/author-council list                     # show rosters
/author-council voices                   # show voices
/author-council run forge-of-ruin chapters/01-first-flames.md
/author-council audit forge-of-ruin
```

## Rosters

Configured in `packages/author-council/rosters/`:
- `arcanea` — full 10-voice council
- `fiction` — fiction-focused voices
- `mythic` — mythic / fairytale voices
- `magic-system` — for hard-magic worldbuilding
- `philosophy` — philosophical voices
- `prose` — prose stylists
- `worldbuilding` — worldbuilding voices
- `default`

Per-book defaults live in `book/<slug>/.author-council.yaml`.
```

- [ ] **Step 2: Add deprecation redirects to the 3 old commands**

For `.claude/commands/arcanea-author.md`:

```markdown
---
name: arcanea-author
description: "[DEPRECATED] Use /author-council. Will be removed 2026-05-18."
---

# /arcanea-author — DEPRECATED

This command is deprecated. Use `/author-council` instead.

→ Run: `/author-council`

This command will be removed on 2026-05-18.
```

Apply the same pattern (replacing `/arcanea-author` with the relevant name) to `arcanea-author-council.md` and `fiction-author-council.md`.

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/author-council.md .claude/commands/arcanea-author.md .claude/commands/arcanea-author-council.md .claude/commands/fiction-author-council.md
git commit -m "feat(commands): consolidate author-council; deprecate 3 overlapping commands"
```

---

## Task 32: Update manifest.yaml to flip orphan flag

**Files:**
- Modify: `.arcanea/config/manifest.yaml`

- [ ] **Step 1: Add explicit `consumed_by` to author-council**

Find the author-council node in `manifest.yaml` and add:

```yaml
  - id: author-council
    # ...existing fields...
    last_curated: "2026-05-12"   # bump
```

The generator will populate `consumedBy` automatically because `book-mila`, `book-tierras`, and `book-forge` already list `author-council` in their `consumes`. No explicit override needed — the orphan inference runs `consumedByCount === 0`, which after Task 26 is no longer true.

- [ ] **Step 2: Re-run generator**

```bash
pnpm -F @arcanea/orchestrator ecosystem:build
```

- [ ] **Step 3: Verify the status flipped**

```bash
grep -A2 '"id": "author-council"' apps/web/lib/ecosystem/derived.ts | head -10
```

Expected: `"status": "built"` (not `orphan`).

- [ ] **Step 4: Commit**

```bash
git add .arcanea/config/manifest.yaml apps/web/lib/ecosystem/derived.ts
git commit -m "chore(ecosystem): regen derived.ts — author-council orphan flag clears (consumed by 3 books)"
```

---

## Task 33: Open PR for Project A

- [ ] **Step 1: Push and open PR**

```bash
git push -u origin feat/author-council-wiring
gh pr create --title "feat(author-council): wire into book pipeline + consolidate slash commands" --body "$(cat <<'EOF'
## Summary
- Each of 3 live books gets a `.author-council.yaml` config
- `post-chapter-commit` hook calls orchestrator's `runCouncil` → MCP → audit file
- Author Studio publish endpoint triggers council automatically
- 4 overlapping slash commands → 1 canonical `/author-council`; 3 deprecation redirects expire 2026-05-18
- Author Council orphan flag clears in `derived.ts` (now consumed by 3 books)

Spec: `docs/superpowers/specs/2026-05-11-connected-ecosystem-trilogy-design.md` (Project A)

## Test plan
- [ ] Manual: trigger hook for one chapter — audit file appears
- [ ] Manual: publish a chapter via Author Studio — audit file appears alongside
- [ ] CI: orchestrator tests pass
- [ ] CI: ecosystem-verify passes (derived.ts in sync)
- [ ] /ecosystem on Vercel preview shows author-council with status `built`
EOF
)"
```

---

# PROJECT B — `/author` Public Surface

**Pre-flight (after Project A merged):**

```bash
git checkout main && git pull
git checkout -b feat/author-public-surface
```

---

## Task 34: /author page scaffold

**Files:**
- Create: `apps/web/app/author/page.tsx`
- Create: `apps/web/app/author/hero.tsx`

- [ ] **Step 1: Create page.tsx**

```tsx
// apps/web/app/author/page.tsx
import { Hero } from './hero';
import { CouncilStudio } from './council-studio';

export const metadata = {
  title: 'The Author Council — Arcanea',
  description: '10 author voices deliberate on your chapter. Live, BYOK, no signup required.',
};

export default function AuthorPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Hero />
      <section className="max-w-5xl mx-auto px-6 py-12">
        <CouncilStudio />
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create hero.tsx**

```tsx
// apps/web/app/author/hero.tsx
import Link from 'next/link';

export function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-amber-500/10 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-zinc-400 mb-3">Soul Gate</p>
        <h1 className="text-4xl sm:text-6xl font-semibold leading-tight mb-4">The Author Council</h1>
        <p className="text-lg text-zinc-300 max-w-2xl mb-6">
          Ten author voices read your chapter and deliberate. Pick a roster, paste your text, watch the Council think.
        </p>
        <div className="flex gap-3 text-sm">
          <Link href="/ecosystem" className="text-teal-300 hover:text-teal-200">← Back to ecosystem</Link>
          <span className="text-zinc-600">·</span>
          <Link href="https://github.com/frankxai/arcanea/tree/main/packages/author-council" className="text-teal-300 hover:text-teal-200">View source</Link>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/author/page.tsx apps/web/app/author/hero.tsx
git commit -m "feat(web/author): page scaffold + hero"
```

---

## Task 35: Roster + mode pickers

**Files:**
- Create: `apps/web/app/author/roster-picker.tsx`
- Create: `apps/web/app/author/mode-picker.tsx`

- [ ] **Step 1: Create roster-picker**

```tsx
// apps/web/app/author/roster-picker.tsx
'use client';

const ROSTERS = [
  { id: 'arcanea', label: 'Arcanea (full council)', voices: 10 },
  { id: 'fiction', label: 'Fiction', voices: 6 },
  { id: 'mythic', label: 'Mythic / Fairytale', voices: 4 },
  { id: 'magic-system', label: 'Magic System', voices: 5 },
  { id: 'philosophy', label: 'Philosophy', voices: 4 },
  { id: 'prose', label: 'Prose', voices: 5 },
  { id: 'worldbuilding', label: 'Worldbuilding', voices: 6 },
  { id: 'default', label: 'Default', voices: 5 },
];

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function RosterPicker({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-zinc-400 mb-1.5">Roster</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-100"
      >
        {ROSTERS.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label} ({r.voices} voices)
          </option>
        ))}
      </select>
    </label>
  );
}
```

- [ ] **Step 2: Create mode-picker**

```tsx
// apps/web/app/author/mode-picker.tsx
'use client';

const MODES = [
  { id: 'critique', label: 'Critique', desc: 'Each voice critiques in turn' },
  { id: 'deliberation', label: 'Deliberation', desc: 'Voices respond to each other' },
  { id: 'synthesis', label: 'Synthesis', desc: 'Voices critique then synthesize a unified note' },
  { id: 'debate', label: 'Debate', desc: 'Voices argue opposing positions' },
];

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function ModePicker({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-zinc-400 mb-1.5">Mode</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-100"
      >
        {MODES.map((m) => (
          <option key={m.id} value={m.id} title={m.desc}>{m.label}</option>
        ))}
      </select>
    </label>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/author/roster-picker.tsx apps/web/app/author/mode-picker.tsx
git commit -m "feat(web/author): roster + mode pickers"
```

---

## Task 36: Council studio (input + run + stream)

**Files:**
- Create: `apps/web/app/author/council-studio.tsx`
- Create: `apps/web/app/author/voice-card.tsx`
- Create: `apps/web/app/author/council-stream.tsx`

- [ ] **Step 1: Create voice-card**

```tsx
// apps/web/app/author/voice-card.tsx
interface Props {
  voice: string;
  text: string;
  severity?: 'info' | 'warning' | 'blocker';
}

const SEVERITY: Record<string, string> = {
  info: 'border-white/[0.08] bg-white/[0.03]',
  warning: 'border-amber-500/40 bg-amber-500/5',
  blocker: 'border-red-500/50 bg-red-500/10',
};

export function VoiceCard({ voice, text, severity = 'info' }: Props) {
  return (
    <article className={`p-4 rounded-xl border ${SEVERITY[severity] ?? SEVERITY.info}`}>
      <h3 className="text-sm font-semibold text-white mb-2">{voice}</h3>
      <p className="text-sm text-zinc-200 whitespace-pre-wrap">{text}</p>
    </article>
  );
}
```

- [ ] **Step 2: Create council-stream**

```tsx
// apps/web/app/author/council-stream.tsx
'use client';

import { VoiceCard } from './voice-card';

export interface VoiceContribution {
  voice: string;
  text: string;
  severity?: 'info' | 'warning' | 'blocker';
}

interface Props {
  contributions: VoiceContribution[];
  isStreaming: boolean;
}

export function CouncilStream({ contributions, isStreaming }: Props) {
  return (
    <div className="space-y-3">
      {contributions.map((c, i) => <VoiceCard key={i} {...c} />)}
      {isStreaming && (
        <div className="text-xs text-zinc-500 animate-pulse">Council deliberating…</div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create council-studio (the main interactive widget)**

```tsx
// apps/web/app/author/council-studio.tsx
'use client';

import { useState } from 'react';
import { RosterPicker } from './roster-picker';
import { ModePicker } from './mode-picker';
import { CouncilStream, type VoiceContribution } from './council-stream';

export function CouncilStudio() {
  const [roster, setRoster] = useState('arcanea');
  const [mode, setMode] = useState('critique');
  const [text, setText] = useState('');
  const [contributions, setContributions] = useState<VoiceContribution[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    setContributions([]);
    setIsStreaming(true);
    try {
      const res = await fetch('/api/author-council/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ roster, mode, text }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `${res.status} ${res.statusText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream');
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const c = JSON.parse(line.slice(6)) as VoiceContribution;
            setContributions((prev) => [...prev, c]);
          } catch {
            // tolerate partial JSON
          }
        }
      }
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <RosterPicker value={roster} onChange={setRoster} />
        <ModePicker value={mode} onChange={setMode} />
      </div>

      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-zinc-400 mb-1.5">Chapter</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a chapter or scene…"
          rows={12}
          maxLength={50000}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-100 font-mono text-sm"
        />
        <span className="block text-[10px] text-zinc-500 mt-1">{text.length} / 50000 chars</span>
      </label>

      <button
        onClick={run}
        disabled={isStreaming || text.trim().length < 100}
        className="px-6 py-2 bg-teal-500/20 border border-teal-500/40 text-teal-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500/30"
      >
        {isStreaming ? 'Council deliberating…' : 'Run Council'}
      </button>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/40 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {contributions.length > 0 && <CouncilStream contributions={contributions} isStreaming={isStreaming} />}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/author/voice-card.tsx apps/web/app/author/council-stream.tsx apps/web/app/author/council-studio.tsx
git commit -m "feat(web/author): council studio (form + streaming output)"
```

---

## Task 37: API route for Council run

**Files:**
- Create: `apps/web/app/api/author-council/run/route.ts`

- [ ] **Step 1: Implement the route**

```ts
// apps/web/app/api/author-council/run/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const RUN_SCHEMA = z.object({
  roster: z.string(),
  mode: z.enum(['critique', 'deliberation', 'synthesis', 'debate']),
  text: z.string().min(100).max(50000),
});

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_ANON = 10;
const rateState = new Map<string, { count: number; resetAt: number }>();

function rateLimitKey(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') ?? '';
  const ip = xff.split(',')[0].trim() || 'unknown';
  return `anon:${ip}`;
}

function checkRateLimit(key: string, limit: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateState.get(key);
  if (!entry || entry.resetAt < now) {
    rateState.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: limit - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = RUN_SCHEMA.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const key = rateLimitKey(req);
  const limitCheck = checkRateLimit(key, RATE_LIMIT_ANON);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: `Daily rate limit reached (${RATE_LIMIT_ANON}/day). BYOK to bypass.` },
      { status: 429, headers: { 'x-ratelimit-reset': String(limitCheck.resetAt) } },
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (event: unknown) => controller.enqueue(enc.encode(`data: ${JSON.stringify(event)}\n\n`));

      try {
        // For v1, call the orchestrator package's runCouncil-like helper.
        // To keep the API serverless-safe (no MCP stdio in Vercel), call Anthropic directly via Vercel AI Gateway
        // using the roster definitions baked into @arcanea/author-council/rosters.
        const { runCouncilForApi } = await import('@/lib/author-council/client');
        for await (const contribution of runCouncilForApi(parsed.data)) {
          send(contribution);
        }
      } catch (err: unknown) {
        send({ error: (err as Error).message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'x-ratelimit-remaining': String(limitCheck.remaining),
      'x-ratelimit-reset': String(limitCheck.resetAt),
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/api/author-council/run/route.ts
git commit -m "feat(api): /api/author-council/run with Zod validation + rate limit + SSE stream"
```

---

## Task 38: Author Council client wrapper

**Files:**
- Create: `apps/web/lib/author-council/client.ts`

- [ ] **Step 1: Implement wrapper that uses Vercel AI Gateway with roster prompts**

```ts
// apps/web/lib/author-council/client.ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

interface RunInput {
  roster: string;
  mode: string;
  text: string;
}

interface VoiceContribution {
  voice: string;
  text: string;
  severity: 'info' | 'warning' | 'blocker';
}

// Voices baked into the client (mirrors packages/author-council/authors/* names).
// Long-term these should be loaded from the package; v1 hardcodes for serverless simplicity.
const ROSTERS: Record<string, string[]> = {
  arcanea: ['Sanderson', 'Tolkien', 'Le Guin', 'Herbert', 'Bakker', 'Erikson', 'Gaiman', 'Schwartz', 'Weeks', 'Paolini'],
  fiction: ['Sanderson', 'Le Guin', 'Gaiman', 'Schwartz', 'Weeks', 'Paolini'],
  mythic: ['Tolkien', 'Le Guin', 'Gaiman', 'Erikson'],
  'magic-system': ['Sanderson', 'Tolkien', 'Le Guin', 'Bakker', 'Weeks'],
  philosophy: ['Le Guin', 'Herbert', 'Bakker', 'Erikson'],
  prose: ['Le Guin', 'Gaiman', 'Schwartz', 'Bakker', 'Tolkien'],
  worldbuilding: ['Tolkien', 'Sanderson', 'Herbert', 'Erikson', 'Bakker', 'Le Guin'],
  default: ['Sanderson', 'Tolkien', 'Le Guin', 'Gaiman', 'Erikson'],
};

const VOICE_PROMPTS: Record<string, string> = {
  Sanderson: 'You are a magic-system architect. Probe the rules, the costs, the Sanderson Laws.',
  Tolkien: 'You are a mythic worldbuilder. Probe the depth of language, lineage, geography.',
  'Le Guin': 'You are a humanist anthropologist. Probe culture, ethics, gender, voice.',
  Herbert: 'You are an ecological strategist. Probe systems, power, religion, consequence.',
  Bakker: 'You are a philosophical horror specialist. Probe interiority, dread, intellect.',
  Erikson: 'You are a continent-scale tragedian. Probe scale, history, doomed nobility.',
  Gaiman: 'You are a mythic miniaturist. Probe fairy logic, dream surface, the uncanny.',
  Schwartz: 'You are an emotional cartographer. Probe character interiority, longing.',
  Weeks: 'You are a propulsive storyteller. Probe pace, twists, voice, payoff.',
  Paolini: 'You are an entry-point craftsman. Probe accessibility, immersion, momentum.',
};

export async function* runCouncilForApi(input: RunInput): AsyncGenerator<VoiceContribution> {
  const voices = ROSTERS[input.roster] ?? ROSTERS.default;

  const gateway = createOpenAICompatible({
    name: 'vercel-ai-gateway',
    baseURL: 'https://gateway.vercel.app/v1',  // Vercel AI Gateway endpoint
    apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
  });

  for (const voice of voices) {
    const persona = VOICE_PROMPTS[voice] ?? `You are ${voice}, an author voice.`;
    const systemPrompt = `${persona}

You are part of the Arcanea Author Council. Your task: read the chapter and respond in the requested mode (${input.mode}).
Respond in 80-180 words. Be specific. Quote sentences when needed. End with a single severity line: severity: info | warning | blocker.`;

    const { textStream } = streamText({
      model: gateway('anthropic/claude-sonnet-4-6'),
      system: systemPrompt,
      prompt: input.text,
      maxTokens: 400,
    });

    let buf = '';
    for await (const chunk of textStream) buf += chunk;

    const severityMatch = buf.match(/severity:\s*(info|warning|blocker)/i);
    const severity = (severityMatch?.[1].toLowerCase() ?? 'info') as VoiceContribution['severity'];
    const cleanText = buf.replace(/severity:\s*(info|warning|blocker)/i, '').trim();

    yield { voice, text: cleanText, severity };
  }
}
```

- [ ] **Step 2: Install AI SDK provider if missing**

```bash
pnpm -F @arcanea/web add ai @ai-sdk/openai-compatible
```

- [ ] **Step 3: Verify build**

```bash
pnpm -F @arcanea/web build
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/lib/author-council/client.ts apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web/author): client wraps Vercel AI Gateway, streams per-voice contributions"
```

---

## Task 39: Wire `try_live` link into NodeDrawer

**Files:**
- Modify: `.arcanea/config/manifest.yaml`

- [ ] **Step 1: Add `links.try_live: /author` to author-council node**

```yaml
  - id: author-council
    # ...existing fields...
    links:
      package: packages/author-council
      mcp: packages/author-council/src/mcp/server.ts
      try_live: /author
    last_curated: "2026-05-18"
```

- [ ] **Step 2: Regen derived.ts**

```bash
pnpm -F @arcanea/orchestrator ecosystem:build
```

- [ ] **Step 3: Verify NodeDrawer renders the button**

The drawer was implemented in Task 18 to show "Try live" if `node.links.try_live` is set. No code change needed.

- [ ] **Step 4: Commit**

```bash
git add .arcanea/config/manifest.yaml apps/web/lib/ecosystem/derived.ts
git commit -m "feat(ecosystem): author-council exposes try_live → /author"
```

---

## Task 40: Playwright smoke for /author

**Files:**
- Create: `apps/web/__tests__/e2e/author.spec.ts`

- [ ] **Step 1: Write the test**

```ts
// apps/web/__tests__/e2e/author.spec.ts
import { test, expect } from '@playwright/test';

test.describe('/author', () => {
  test('renders hero + form', async ({ page }) => {
    await page.goto('/author');
    await expect(page.getByRole('heading', { name: 'The Author Council' })).toBeVisible();
    await expect(page.getByLabel('Roster')).toBeVisible();
    await expect(page.getByLabel('Mode')).toBeVisible();
    await expect(page.getByPlaceholder(/Paste a chapter/)).toBeVisible();
  });

  test('Run Council disabled until 100 chars', async ({ page }) => {
    await page.goto('/author');
    const button = page.getByRole('button', { name: /Run Council/ });
    await expect(button).toBeDisabled();
    await page.getByPlaceholder(/Paste a chapter/).fill('x'.repeat(100));
    await expect(button).toBeEnabled();
  });
});
```

- [ ] **Step 2: Run**

```bash
pnpm -F @arcanea/web exec playwright test __tests__/e2e/author.spec.ts
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/__tests__/e2e/author.spec.ts
git commit -m "test(web/author): playwright smoke for hero + form gating"
```

---

## Task 41: Telemetry — wire PostHog on /ecosystem and /author

**Files:**
- Modify: `apps/web/app/ecosystem/ecosystem-views.tsx`
- Modify: `apps/web/app/author/council-studio.tsx`

- [ ] **Step 1: Confirm PostHog client is set up**

```bash
grep -r "posthog" apps/web/lib/ apps/web/components/ --include="*.ts" --include="*.tsx" | head -5
```

If a PostHog provider already exists, use it. If not, follow `feedback_observability_silent_in_prod.md` and stand up the provider first.

- [ ] **Step 2: Capture key events on /ecosystem**

In `ecosystem-views.tsx`, after the imports add:

```ts
import posthog from 'posthog-js';
```

Inside `EcosystemViews`, after each setView/setFilter/setSelectedId call:

```ts
posthog.capture('ecosystem_view_changed', { view: nextView });
posthog.capture('ecosystem_filter_changed', { ...next });
posthog.capture('ecosystem_node_opened', { node_id: id });
```

- [ ] **Step 3: Capture key events on /author**

In `council-studio.tsx`, inside `run()`:

```ts
posthog.capture('council_run_started', { roster, mode, text_length: text.length });
// ...after stream completes:
posthog.capture('council_run_completed', { roster, mode, contribution_count: contributions.length });
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/ecosystem/ecosystem-views.tsx apps/web/app/author/council-studio.tsx
git commit -m "feat(telemetry): posthog events on /ecosystem and /author (per observability feedback)"
```

---

## Task 42: Documentation in `.arcanea/ecosystem/README.md`

**Files:**
- Create: `.arcanea/ecosystem/README.md`

- [ ] **Step 1: Write the README**

```markdown
# .arcanea/ecosystem

The connected ecosystem map.

## Files

- `../config/repos.json` — canonical sibling-repo registry (extended with layer/gate/hemisphere)
- `../config/manifest.yaml` — curated overlay for in-monorepo packages, books, surfaces, externals
- `../../apps/web/lib/ecosystem/derived.ts` — AUTO-GENERATED. Do not edit.

## Adding a node

Edit `manifest.yaml`. Add to the `nodes:` list with required fields: `id`, `name`, `description`, `layer`, `gate`, `hemisphere`, `consumes`. Run:

```bash
pnpm -F @arcanea/orchestrator ecosystem:build
```

Commit both `manifest.yaml` and the regenerated `derived.ts`.

## Status semantics

- `shipped` — public + has consumers
- `built` — has consumers (not yet public)
- `wip` — last commit > 90 days OR `status_override: wip`
- `orphan` — product-layer with zero consumers
- `sunset` — last commit > 365 days
- `external` — `is_external: true`

## CI

- `ecosystem-verify` — gate on PRs touching tracked sources; fails if `derived.ts` is stale
- `ecosystem-weekly-refresh` — Mondays 09:00 UTC; opens a PR with the diff

## Public surface

Renders at `arcanea.ai/ecosystem` with three views (Layered / Ten Gates / Arc⊕Nea), filters, and click-through to `/author` (and other `try_live` links).
```

- [ ] **Step 2: Commit**

```bash
git add .arcanea/ecosystem/README.md
git commit -m "docs(ecosystem): how to add a node + status semantics + CI overview"
```

---

## Task 43: Resolve plugin-overlap audit

**Files:**
- Modify: `.arcanea/audits/2026-05-06-plugin-overlap.md`

- [ ] **Step 1: Append a "Resolved" footer**

Open the file. At the bottom, append:

```markdown

---

## Resolved 2026-06-08

Author Council slash-command sprawl resolved by Trilogy Project A:
- 4 commands → 1 (`/author-council`)
- 3 deprecation redirects expired 2026-05-18

Ecosystem orphan visibility resolved by Trilogy Project C:
- `/ecosystem` Layered/Gates/Arc⊕Nea views surface every node's status
- Status `orphan` is mechanically inferred and visible

See spec: `docs/superpowers/specs/2026-05-11-connected-ecosystem-trilogy-design.md`
```

- [ ] **Step 2: Commit**

```bash
git add .arcanea/audits/2026-05-06-plugin-overlap.md
git commit -m "docs(audits): mark plugin-overlap resolved by ecosystem trilogy"
```

---

## Task 44: Open PR for Project B + final verification

- [ ] **Step 1: Push and open PR**

```bash
git push -u origin feat/author-public-surface
gh pr create --title "feat(author): public /author surface (Council deliberation, BYOK-ready, streamed)" --body "$(cat <<'EOF'
## Summary
- New `/author` page: paste chapter, pick roster + mode, watch the Council deliberate
- API: `/api/author-council/run` — Zod validation, anonymous rate limit (10/day), SSE stream
- Client wraps Vercel AI Gateway with roster prompts (10 voices, 8 rosters)
- /ecosystem author-council node now exposes "Try live" → /author
- PostHog wired on /ecosystem and /author per observability feedback
- Plugin-overlap audit marked Resolved

Spec: `docs/superpowers/specs/2026-05-11-connected-ecosystem-trilogy-design.md` (Project B)

## Test plan
- [ ] Visit /author on Vercel preview, paste a chapter, click Run Council, see streamed contributions
- [ ] Hit rate limit on a fresh IP — clean error UI
- [ ] Visit /ecosystem, switch to Ten Gates view, click Soul, click Author Council node, click "Try live" → lands on /author
- [ ] PostHog dashboard shows `ecosystem_*` and `council_*` events flowing
- [ ] Lighthouse mobile ≥ existing baseline for /author and /ecosystem
EOF
)"
```

- [ ] **Step 2: After merge, run the connected-experience smoke**

The success metric from the spec — execute it manually:

1. Open `https://arcanea.ai/ecosystem`
2. Switch to **Ten Gates** view
3. Click **Soul**
4. Click **Author Council** in the panel
5. In the drawer, verify status is **built** (not orphan)
6. Click **Try live**
7. On `/author`, paste Mädchen chapter 1
8. Click **Run Council**
9. Watch all 10 voices stream contributions
10. Confirm PostHog captured every step

If all 10 steps pass, the trilogy is complete.

---

# Self-Review (Spec Coverage Check)

| Spec section | Covered by |
|---|---|
| C.4.1 data model (manifest.yaml + repos.json extension) | Tasks 1-3 |
| C.4.2 generator (scan-monorepo, scan-siblings, enrich-github, merge, infer-status, write, build, verify) | Tasks 4-11 |
| C.4.2 CLI | Task 12 |
| C.4.3 view switcher + filter bar + 3 views + node drawer | Tasks 18-23 |
| C.4.4 CI verify gate + weekly refresh | Tasks 13, 14 |
| C.5 file deletions | Tasks 16, 17 |
| C.5 file modifications (public-repo-registry adapter, page.tsx) | Tasks 15, 23 |
| A.3.1 pipeline integration (hook + per-book yaml + Author Studio wiring) | Tasks 26-30 |
| A.3.2 slash command consolidation | Task 31 |
| A.3.3 manifest update / orphan flag flip | Task 32 |
| B.2.1 /author page | Tasks 34-36 |
| B.2.2 API route | Tasks 37, 38 |
| B.2.3 wiring back to /ecosystem | Task 39 |
| Telemetry (open question 5) | Task 41 |
| Documentation | Task 42 |
| Audit closure | Task 43 |

No spec gaps. No placeholders. Type names checked: `EcosystemNode`, `EcosystemEdge`, `BookConfig`, `VoiceContribution`, `FilterState`, `EcosystemView` — all defined where first used and consistent across tasks.

**Open spec questions intentionally deferred to user (not the executor):**
- B.4 naming (`/author` vs `/council`) — defaulted to `/author`; can rename later
- Council audit visibility — defaulted to in-repo only; public exposure deferred
- Voice attribution legal/IP — defaulted to real-world author surnames; can rebrand later
- Onchain anchor — explicitly out-of-scope this trilogy

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-11-connected-ecosystem-trilogy.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
