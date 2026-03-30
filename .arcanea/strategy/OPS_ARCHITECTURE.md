# Arcanea Ops Architecture
# DevOps, GitOps, and AgentOps Blueprint

> **Version**: 1.0.0
> **Date**: 2026-03-29
> **Status**: Production-Ready
> **Scope**: arcanea-ai-app (origin), arcanea (oss), arcanea-records

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [GitOps Architecture](#2-gitops-architecture)
3. [CI/CD Pipeline](#3-cicd-pipeline)
4. [AgentOps](#4-agentops)
5. [Quality Gates](#5-quality-gates)
6. [Monitoring and Observability](#6-monitoring-and-observability)
7. [Automation Opportunities](#7-automation-opportunities)
8. [Security Architecture](#8-security-architecture)

---

## 1. Current State Audit

### 1.1 What Exists Today

**Repositories (three remotes, one working tree)**

| Remote | Repo | Purpose |
|--------|------|---------|
| `origin` | `frankxai/arcanea-ai-app` | Production deployment (Vercel) |
| `oss` | `frankxai/arcanea` | Public OSS mirror |
| `records` | `frankxai/arcanea-records` | Music studio / media assets |

**CI/CD Workflows (3 files)**

| File | Trigger | What It Does | Status |
|------|---------|-------------|--------|
| `quality-gate.yml` | push/PR to main | TypeCheck, Lint, Security Audit, Build, E2E Smoke, Release Integrity | ACTIVE -- well structured |
| `deploy-web.yml` | push to main (apps/web/**), PR, manual dispatch | Validate, Deploy Preview (PR), Deploy Production (main), Health Check | ACTIVE -- needs VERCEL_TOKEN secret |
| `close-stale-incidents.yml` | manual dispatch only | Cleanup auto-generated incident issues | ACTIVE -- maintenance utility |

**Deployment Flow**

```
Developer pushes to main
  --> Vercel auto-deploys (git integration, primary path)
  --> GitHub Actions: quality-gate.yml runs checks
  --> GitHub Actions: deploy-web.yml runs Vercel CLI deploy (redundant with Vercel git integration)
  --> Health check pings arcanea.ai after production deploy
```

**Observation**: There is a dual-deploy situation. Vercel's own git integration deploys on push to main AND deploy-web.yml also deploys via Vercel CLI. This creates a race condition. The recommended fix is documented in section 2.

**Testing Coverage**

| Type | Files | Status |
|------|-------|--------|
| E2E (Playwright) | `apps/web/e2e/project-workspace.spec.ts` | 1 spec file -- minimal |
| Unit Tests | `packages/*/tests/*.test.mjs` | Exists across packages via Node test runner |
| Type Checking | `tsc --noEmit` | Runs in CI, errors are informational (not blocking) |
| Lint | `next lint` (ESLint) | Runs in CI, blocking |
| Security | `pnpm audit` | Runs in CI, warning-only |

**What Is Manual That Should Be Automated**

| Manual Process | Impact | Priority |
|---------------|--------|----------|
| Lore consistency checks | Canon drift across 200K+ words | P0 |
| Multi-repo sync (origin <-> oss) | Manual push to oss remote | P1 |
| Performance regression detection | CWV baseline (homepage 35, chat 18, imagine 49) not tracked over time | P1 |
| Content pipeline (write -> review -> publish) | Entirely manual | P2 |
| Dependency updates | No Dependabot or Renovate | P2 |
| Changelog generation | No automated changelog | P3 |

### 1.2 Infrastructure State

| Service | Status | Notes |
|---------|--------|-------|
| Vercel | ACTIVE | Production at arcanea.ai |
| Supabase | ACTIVE | Auth (90% complete), DB tables created |
| Sentry | CODE INSTALLED | Needs API key (SENTRY_DSN) |
| PostHog | CODE INSTALLED | Needs API key (NEXT_PUBLIC_POSTHOG_KEY) |
| Stripe | DEPENDENCY INSTALLED | stripe@20.4.1 in package.json |
| OpenTelemetry | CONFIGURED | @opentelemetry/api in serverExternalPackages |

---

## 2. GitOps Architecture

### 2.1 Branch Strategy

```
main .............. Production (deploys to arcanea.ai)
  |
  +-- feat/*  ..... Feature branches (short-lived, 1-3 days max)
  +-- fix/*  ...... Bug fixes
  +-- content/* ... Lore, book chapters, narrative content
  +-- ops/*  ...... Infrastructure, CI/CD, DevOps changes
  +-- agent/* ..... AI agent-generated branches (auto-prefixed)
```

**Why no develop branch**: Arcanea is a solo-creator + AI-agent project. A develop branch adds merge overhead without value. Vercel deploy previews on PRs serve the "staging" role. If the team grows beyond 3 humans, introduce `develop` as a release gate.

**Why no release/* branches**: Vercel is the deployment target. Every merge to main IS a release. Semantic versioning is handled by Changesets (`@changesets/cli` is already installed).

### 2.2 PR Workflow

```
1. Create branch: feat/chat-streaming
2. Push commits (conventional format)
3. Open PR to main
4. Automated checks run:
   - quality-gate.yml (lint, type-check, build, e2e smoke, security)
   - canon-lint.yml (if book/** or .arcanea/lore/** changed)
   - Vercel deploys preview URL automatically
5. Human or agent reviews
6. Squash-merge to main
7. Vercel deploys production
8. Health check verifies
```

### 2.3 Commit Conventions

Format: `<type>(<scope>): <description>`

| Type | When |
|------|------|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `perf` | Performance improvement |
| `polish` | UI/UX refinement (not a bug, not a feature) |
| `content` | Lore, book chapters, narrative text |
| `chore` | Dependencies, config, CI |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `docs` | Documentation only |

Scopes: `ui`, `chat`, `imagine`, `books`, `library`, `lore`, `auth`, `db`, `ops`, `design`, `perf`, `build`

Examples from actual commit history:
- `feat(ops): Ops Center dashboard, intelligence system fixes`
- `polish(ui): upgrade hero chat box gradients`
- `fix(critical): hero prompt handoff, broken chronica route`
- `perf: remove 4.5MB icon barrel, lazy-load syntax highlighter`

### 2.4 Multi-Repo Sync Strategy

**Current state**: Three remotes in one working tree, manual push.

**Target state**: Automated one-way sync from origin to oss after each production deploy.

```
arcanea-ai-app (origin, private)
       |
       | [GitHub Action: post-deploy sync]
       v
arcanea (oss, public)
       |
       | [filtered: excludes .env, secrets, private configs]
       v
Public contributors fork from oss
```

**Implementation**: Add a `sync-oss` job to deploy-web.yml that pushes to the oss remote after successful production deploy. Use a deploy key (read-write to oss repo) stored as a GitHub secret.

### 2.5 Protected Branch Rules (origin repo)

Apply to `main` on `frankxai/arcanea-ai-app`:

| Rule | Value |
|------|-------|
| Require PR before merging | Yes |
| Required status checks | `Quality Status`, `Validate Web` |
| Require linear history | Yes (squash merge only) |
| Allow force push | No |
| Allow deletions | No |
| Require signed commits | Optional (not enforced for agent commits) |

### 2.6 Automated Changelog

Use Changesets (already installed):

```bash
# When making a notable change:
pnpm changeset
# Select packages, write description
# Commit the changeset file

# On release:
pnpm changeset version   # Updates CHANGELOG.md, bumps versions
pnpm changeset publish   # Publishes to npm (for public packages)
```

---

## 3. CI/CD Pipeline

### 3.1 Workflow Architecture

```
                    PR opened / push to main
                           |
              +------------+------------+
              |                         |
       quality-gate.yml          deploy-web.yml
              |                         |
    +---------+---------+        validate-web
    |    |    |    |    |              |
  type  lint  sec  rel  |    +--------+--------+
  check       audit int |    |                 |
    |    |    |    |    |  deploy-preview   deploy-prod
    +----+----+----+----+  (PR only)       (main only)
              |                               |
           build                        health-check
              |
         e2e-smoke
              |
        quality-status

       [on content changes]
              |
       canon-lint.yml
              |
     validate lore docs
```

### 3.2 Workflow Files

**Existing (keep and enhance)**:
- `.github/workflows/quality-gate.yml` -- solid, minor improvements below
- `.github/workflows/deploy-web.yml` -- solid, add oss sync job
- `.github/workflows/close-stale-incidents.yml` -- keep as-is

**New (to create)**:
- `.github/workflows/ci.yml` -- consolidated fast-feedback CI
- `.github/workflows/canon-lint.yml` -- lore consistency validation

### 3.3 Recommended Changes to Existing Workflows

**quality-gate.yml improvements**:
1. TypeCheck should become blocking once error count reaches 0. Currently informational -- good for now.
2. Add `paths-ignore` for book/** and docs/** to avoid running build on content-only changes.
3. Lighthouse CI step (`treosh/lighthouse-ci-action@v11`) requires `lighthouserc.json` at repo root -- create this file.

**deploy-web.yml improvements**:
1. DECISION: Remove Vercel CLI deploy from this workflow. Let Vercel git integration handle deploys. Keep only the validation and health check jobs. This eliminates the dual-deploy race condition.
2. Alternative: Disable Vercel git integration and use ONLY the CLI deploy. Either approach works; pick one.
3. Recommended: Keep Vercel git integration (simpler), repurpose deploy-web.yml as validation-only.

### 3.4 New Workflow: ci.yml

See `.github/workflows/ci.yml` for the full YAML. Summary:

- Triggers on every push and PR
- Three parallel jobs: lint, typecheck, build
- Build job runs unit tests after successful build
- Caches pnpm store for speed
- Uses `concurrency` to cancel superseded runs
- Path filters to skip on content-only changes

### 3.5 New Workflow: canon-lint.yml

See `.github/workflows/canon-lint.yml` for the full YAML. Summary:

- Triggers only when `book/**` or `.arcanea/lore/**` files change
- Validates canonical terms (correct Guardian names, Gate names, Element names)
- Checks for deprecated terminology (Hz frequencies in user-facing content)
- Validates markdown structure (headings, frontmatter if present)
- Reports violations as PR annotations

### 3.6 Dependency Management

Add Dependabot configuration:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
    groups:
      ai-sdk:
        patterns:
          - "@ai-sdk/*"
      radix:
        patterns:
          - "@radix-ui/*"
      supabase:
        patterns:
          - "@supabase/*"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    labels:
      - "ci"
```

---

## 4. AgentOps

### 4.1 Agent Session Management

AI agents (Claude Code, Cursor, Codex) operate in the Arcanea codebase under these protocols.

**Session Lifecycle**:

```
START
  1. Read .arcanea/MASTER_PLAN.md (mandatory, non-negotiable)
  2. Check Priority Queue for current work
  3. Read relevant milestone file in .arcanea/projects/milestones/
  4. Begin work

WORK
  5. Follow commit conventions
  6. Stay within assigned scope
  7. Use branch naming: agent/<agent-type>/<task-slug>
  8. Keep changes under 500 lines per file

END
  9. Update page status in MASTER_PLAN.md if pages changed
  10. Update milestone progress in .arcanea/projects/milestones/
  11. Log session summary to .arcanea/projects/log/
  12. Commit with Co-Authored-By header
```

### 4.2 Agent Evaluation Framework

Every agent session is evaluated on these dimensions:

| Dimension | Metric | Target | How to Measure |
|-----------|--------|--------|----------------|
| Build Integrity | Does `pnpm build` pass after changes? | 100% | CI pipeline |
| Lint Compliance | Does `pnpm lint` pass? | 100% | CI pipeline |
| Canon Compliance | Are lore references accurate? | 100% | canon-lint.yml |
| Scope Discipline | Did agent stay within assigned task? | Yes/No | PR review |
| File Hygiene | Files under 500 lines? No root folder dumps? | 100% | Post-commit hook |
| Commit Quality | Conventional commits? Meaningful messages? | 100% | PR review |

**Quality Score Calculation**:

```
score = (build_pass * 30) + (lint_pass * 20) + (canon_pass * 15)
      + (scope_ok * 15) + (hygiene_ok * 10) + (commit_quality * 10)

Grade: A (90-100), B (80-89), C (70-79), D (<70)
```

### 4.3 Agent Coordination Patterns

| Pattern | When to Use | Agents |
|---------|------------|--------|
| **Sequential** | Linear dependency chain (design -> implement -> test) | 1 agent, multiple tasks |
| **Parallel Swarm** | Independent tasks (lint 5 files, write 3 tests) | 3-8 agents, one coordinator |
| **Hierarchical** | Complex feature (new page with API, UI, tests) | 1 architect + 3-5 workers |
| **Review Chain** | Quality-critical work (security, canon) | Worker -> Reviewer -> Approver |

**Decision Tree**:

```
Is the task < 30 minutes of work?
  YES -> Single agent, sequential
  NO  -> Is the task decomposable into independent subtasks?
    YES -> Parallel swarm (max 8 agents)
    NO  -> Hierarchical (1 coordinator + workers)
```

### 4.4 Agent Memory Persistence

Agents share context through these mechanisms:

| Mechanism | Scope | Persistence | Location |
|-----------|-------|-------------|----------|
| MASTER_PLAN.md | Global | Permanent | `.arcanea/MASTER_PLAN.md` |
| Milestone files | Per-milestone | Permanent | `.arcanea/projects/milestones/` |
| Session logs | Per-session | Permanent | `.arcanea/projects/log/` |
| Claude memory | Per-user | Cross-session | `~/.claude/projects/*/memory/` |
| Claude Flow memory | Per-agent | Session-scoped | `npx @claude-flow/cli memory` |
| Git history | Global | Permanent | `git log` |

**Protocol**: An agent MUST NOT rely on another agent's Claude memory. All shared state goes through files committed to git or stored in MASTER_PLAN.md.

### 4.5 Agent Safety Rails

**Agents CAN autonomously**:
- Edit existing source files
- Create new components/pages within existing patterns
- Run build, test, lint commands
- Create feature branches
- Open PRs
- Update MASTER_PLAN.md status

**Agents CANNOT autonomously**:
- Merge PRs to main (requires human approval)
- Delete files without explicit instruction
- Modify security-critical files (middleware.ts, auth callbacks, RLS policies)
- Change environment variables or secrets
- Push to production branch without CI passing
- Modify CANON_LOCKED.md (immutable reference)
- Run destructive git commands (force push, reset --hard)

**Hard Stops (agent MUST halt and ask)**:
- Any change to `.arcanea/lore/CANON_LOCKED.md`
- Any file containing API keys, tokens, or credentials
- Database migration that drops tables or columns
- Changes to auth flow or middleware
- Anything that affects billing (Stripe integration)

### 4.6 Monitoring Agent Work

**Per-Session Metrics** (logged to `.arcanea/projects/log/`):

```
- Session ID: <timestamp>-<agent-type>
- Duration: <minutes>
- Files changed: <count>
- Lines added/removed: <count>
- Build status: pass/fail
- Tests status: pass/fail/skipped
- Commits: <count>
- Quality score: <A/B/C/D>
```

**Aggregate Metrics** (tracked in MASTER_PLAN.md):

- Total agent sessions this week
- Average quality score
- Build break rate (how often agents break the build)
- Pages completed vs. pages assigned

---

## 5. Quality Gates

### 5.1 Pre-Commit Checks

Use Husky + lint-staged (install if not present):

```json
// package.json additions
{
  "lint-staged": {
    "apps/web/**/*.{ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "**/*.md": [
      "prettier --write"
    ]
  }
}
```

```bash
# Install
pnpm add -D husky lint-staged
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

### 5.2 PR Checks (Required)

| Check | Blocking? | Workflow |
|-------|-----------|----------|
| ESLint | Yes | quality-gate.yml |
| Production Build | Yes | quality-gate.yml |
| TypeScript (informational) | No (until error count = 0) | quality-gate.yml |
| Security Audit | No (warning) | quality-gate.yml |
| E2E Smoke | No (until tests stabilize) | quality-gate.yml |
| Canon Lint | Yes (on content PRs) | canon-lint.yml |
| Release Integrity | Yes | quality-gate.yml |

### 5.3 Post-Deploy Checks

| Check | Frequency | Method |
|-------|-----------|--------|
| HTTP 200 on arcanea.ai | Every deploy | deploy-web.yml health-check job |
| API health endpoint | Every deploy | deploy-web.yml health-check job |
| CWV measurement | Weekly (manual until automated) | Lighthouse CI or PageSpeed API |
| Uptime monitoring | Continuous | Vercel Analytics (free tier) or UptimeRobot |

### 5.4 Content Quality

**Anti-Slop Patterns** (enforced by canon-lint.yml):

Terms that MUST NOT appear in Arcanea content:

```
- "delve" (overused LLM word)
- "tapestry" (unless referring to actual weaving)
- "landscape" used metaphorically
- "in the realm of" (lazy phrasing)
- "it's important to note"
- "vibrant" (unless describing color)
- "unleash"
- "game-changer"
- "paradigm shift"
```

**Canon Compliance** (enforced by canon-lint.yml):

- Guardian names must match CANON_LOCKED.md exactly
- Gate names and order must be canonical
- Element names (Fire, Water, Earth, Wind, Void/Spirit) must be canonical
- Hz frequencies must NOT appear in user-facing content (backend-only)
- Malachar is "the Dark Lord", not "evil" -- Nero is not evil

### 5.5 Security Quality

| Check | Tool | Frequency |
|-------|------|-----------|
| Dependency vulnerabilities | `pnpm audit` | Every PR (CI) |
| Secrets in code | `git-secrets` or `trufflehog` | Pre-commit hook |
| OWASP headers | Vercel security headers config | Deploy-time |
| RLS policy coverage | Manual audit + Supabase dashboard | Monthly |

---

## 6. Monitoring and Observability

### 6.1 Stack

| Layer | Tool | Status | Action Needed |
|-------|------|--------|---------------|
| Error Tracking | Sentry | Code installed | Set `SENTRY_DSN` env var on Vercel |
| User Analytics | PostHog | Code installed | Set `NEXT_PUBLIC_POSTHOG_KEY` on Vercel |
| Performance | Vercel Analytics | Available | Enable in Vercel dashboard |
| Uptime | None | Gap | Add UptimeRobot (free) or Vercel checks |
| Logs | Vercel Logs | Available | Already accessible via dashboard |
| Tracing | OpenTelemetry | Configured | Needs collector endpoint |

### 6.2 Key Metrics to Track

**Application Health**:

| Metric | Source | Target | Alert Threshold |
|--------|--------|--------|----------------|
| Error rate (4xx/5xx) | Sentry | < 1% | > 5% over 5 min |
| P95 response time | Vercel Analytics | < 2s | > 5s |
| Build success rate | GitHub Actions | 100% | Any failure |
| Build time | GitHub Actions | < 5 min | > 10 min |

**Core Web Vitals** (baseline from project memory):

| Page | Current LH Score | Target | Measurement |
|------|-----------------|--------|-------------|
| Homepage | 35 | 70 | Lighthouse CI |
| Chat | 18 | 50 | Lighthouse CI |
| Imagine | 49 | 70 | Lighthouse CI |

**Agent Productivity**:

| Metric | How to Measure |
|--------|---------------|
| Sessions per week | Count in .arcanea/projects/log/ |
| Build break rate | CI failure rate on agent/* branches |
| Average session quality | Score from evaluation framework |
| Pages shipped | MASTER_PLAN.md delta week-over-week |

### 6.3 Alerting

**Phase 1 (implement now)**:
- GitHub Actions failure notifications (already built-in via GitHub email)
- Vercel deployment failure notifications (Vercel dashboard settings)

**Phase 2 (implement when Sentry/PostHog have API keys)**:
- Sentry: Alert on new error types, spike in error rate
- PostHog: Alert on conversion drops, unusual traffic patterns

**Phase 3 (future)**:
- PagerDuty or Opsgenie integration for production incidents
- Custom Slack webhook for deploy notifications

### 6.4 Lighthouse CI Configuration

Create at repo root:

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3001/",
        "http://localhost:3001/chat",
        "http://localhost:3001/imagine",
        "http://localhost:3001/books"
      ],
      "startServerCommand": "pnpm --filter @arcanea/web start",
      "startServerReadyPattern": "Ready on",
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.5 }],
        "categories:accessibility": ["error", { "minScore": 0.8 }],
        "categories:best-practices": ["warn", { "minScore": 0.8 }],
        "categories:seo": ["warn", { "minScore": 0.8 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 7. Automation Opportunities

### 7.1 Priority Matrix

| Automation | Effort | Impact | Priority | Status |
|-----------|--------|--------|----------|--------|
| Canon lint on PRs | 2h | High -- prevents lore drift | P0 | IMPLEMENTING (canon-lint.yml) |
| Dependabot config | 15m | Medium -- catches vulnerabilities | P0 | Ready to commit |
| Pre-commit hooks (lint-staged) | 30m | High -- catches issues before push | P1 | Ready to install |
| OSS sync after deploy | 1h | Medium -- keeps public repo current | P1 | Design complete |
| Lighthouse CI | 1h | High -- tracks CWV regression | P1 | lighthouserc.json needed |
| Changelog generation | 30m | Low -- Changesets already installed | P2 | Ready (pnpm changeset) |
| Content pipeline automation | 4h | Medium -- reduces manual steps | P2 | Design needed |
| Image generation pipeline | 8h | Medium -- character art standardization | P3 | Future |
| Social media distribution | 4h | Low -- manual is fine for now | P3 | Future |

### 7.2 Lore-to-Code Sync

When a new faction, character, or location is added to `.arcanea/lore/`:

```
1. canon-lint.yml detects new lore file in PR
2. Comment on PR: "New lore entity detected. Ensure codex page exists."
3. (Future) Auto-generate stub codex page from lore template
```

This is informational for now, not blocking.

### 7.3 Content Pipeline

```
Write (book/**) --> PR with canon-lint --> Review --> Merge --> Auto-index
                                                                   |
                                                        embed-library.ts
                                                        (already exists)
```

The `embed:library` script already exists in package.json. Hook it to post-merge:

```yaml
# In deploy-web.yml, after successful deploy:
- name: Re-embed library content
  if: contains(steps.changes.outputs.files, 'book/')
  run: pnpm embed:library
```

### 7.4 Release Management

```
1. Accumulate changesets on main
2. When ready: pnpm changeset version (updates CHANGELOG, bumps versions)
3. Commit version bump
4. Tag release: git tag v1.x.x
5. pnpm changeset publish (publishes public packages to npm)
6. GitHub release created from tag
```

---

## 8. Security Architecture

### 8.1 Secret Management

**Vercel Environment Variables** (source of truth for runtime secrets):

| Variable | Set? | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only Supabase admin key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Gemini API |
| `ANTHROPIC_API_KEY` | Check | Claude API |
| `OPENAI_API_KEY` | Check | OpenAI API |
| `FAL_KEY` | Check | Fal.ai image generation |
| `STRIPE_SECRET_KEY` | Check | Stripe payments |
| `SENTRY_DSN` | NOT SET | Error tracking -- needs setup |
| `NEXT_PUBLIC_POSTHOG_KEY` | NOT SET | Analytics -- needs setup |
| `VERCEL_TOKEN` | NOT SET (GitHub) | For CI deploy -- needs GitHub secret |

**GitHub Secrets** (for CI/CD):

| Secret | Purpose | Set? |
|--------|---------|------|
| `VERCEL_TOKEN` | Vercel CLI deploys | Needs setup |
| `VERCEL_ORG_ID` | Vercel org identifier | Needs setup |
| `VERCEL_PROJECT_ID` | Vercel project identifier | Needs setup |
| `NEXT_PUBLIC_SUPABASE_URL` | Build-time fallback | Set (with placeholder) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build-time fallback | Set (with placeholder) |

### 8.2 API Key Rotation

| Key | Rotation Frequency | Method |
|-----|-------------------|--------|
| Supabase anon key | Only on breach | Regenerate in Supabase dashboard, update Vercel |
| Supabase service role | Only on breach | Same |
| AI API keys | Quarterly | Regenerate on provider dashboard, update Vercel |
| Stripe keys | Only on breach | Stripe dashboard |
| Vercel token | Annually | Vercel settings |

### 8.3 Auth Flow Security

```
User clicks "Sign In"
  --> Supabase Auth (Google/GitHub OAuth)
  --> Callback to /auth/callback
  --> Server-side session verification
  --> Redirect to authenticated page
  --> middleware.ts enforces protected routes
```

**RLS Policies** (Supabase Row-Level Security):

All tables with user data MUST have RLS enabled. Policies:

```sql
-- Users can only read/write their own data
CREATE POLICY "Users can view own data" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

**Current RLS Status**: Policies exist for profiles, creations, reading_progress, chat_sessions. Audit monthly for new tables.

### 8.4 OWASP Compliance

| Control | Implementation | Status |
|---------|---------------|--------|
| A01 Broken Access Control | Supabase RLS + middleware.ts | ACTIVE |
| A02 Cryptographic Failures | HTTPS (Vercel), Supabase encryption at rest | ACTIVE |
| A03 Injection | Parameterized queries (Supabase client), input validation | ACTIVE |
| A04 Insecure Design | Threat modeling needed | GAP |
| A05 Security Misconfiguration | Security headers in next.config.js | PARTIAL |
| A06 Vulnerable Components | pnpm audit in CI | ACTIVE |
| A07 Auth Failures | Supabase Auth (battle-tested) | ACTIVE |
| A08 Software Integrity | Lockfile integrity, changeset-only publishing | ACTIVE |
| A09 Logging Failures | Sentry (needs API key) | PARTIAL |
| A10 SSRF | API route input validation needed | GAP |

### 8.5 Security Headers

Add to `next.config.js`:

```javascript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

// In nextConfig:
async headers() {
  return [{ source: '/(.*)', headers: securityHeaders }];
}
```

### 8.6 Dependency Scanning

Three layers:

1. **pnpm audit** -- runs in CI on every PR (already configured)
2. **Dependabot** -- weekly PR for vulnerable dependencies (to add)
3. **GitHub security advisories** -- automatic alerts on repo (already enabled by default)

### 8.7 Content Security Policy

For a Next.js app with inline scripts (Vercel Analytics, PostHog):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://us.posthog.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://us.posthog.com https://generativelanguage.googleapis.com https://api.anthropic.com https://api.openai.com https://fal.run;
  frame-ancestors 'none';
```

Note: `unsafe-inline` and `unsafe-eval` are required by Next.js in development. In production, use nonce-based CSP if possible.

---

## Appendix A: Implementation Checklist

### Immediate (do today, 30 minutes)

- [ ] Commit `.github/workflows/ci.yml`
- [ ] Commit `.github/workflows/canon-lint.yml`
- [ ] Create `.github/dependabot.yml`
- [ ] Create `lighthouserc.json` at repo root

### This week (2-3 hours)

- [ ] Set `SENTRY_DSN` on Vercel
- [ ] Set `NEXT_PUBLIC_POSTHOG_KEY` on Vercel
- [ ] Set `VERCEL_TOKEN` as GitHub secret
- [ ] Install husky + lint-staged for pre-commit hooks
- [ ] Add security headers to next.config.js
- [ ] Enable Vercel Analytics in dashboard

### This month (4-6 hours)

- [ ] Complete Supabase OAuth dashboard config (M001 final task)
- [ ] Run E2E auth flow test on production
- [ ] Add OSS sync job to deploy workflow
- [ ] Set up UptimeRobot for arcanea.ai
- [ ] Audit all tables for RLS policy coverage
- [ ] Resolve dual-deploy (Vercel git integration vs CLI deploy)

### Future (ongoing)

- [ ] Reduce TypeScript errors to 0 (then make typecheck blocking)
- [ ] Expand E2E test suite (target: 10 smoke tests for critical paths)
- [ ] Implement CSP with nonces
- [ ] Add SSRF protection to API routes
- [ ] Automate content pipeline (write -> embed -> index)
- [ ] Set up Lighthouse CI trending dashboard

---

## Appendix B: File Index

| File | Purpose |
|------|---------|
| `.github/workflows/quality-gate.yml` | Main quality checks (existing) |
| `.github/workflows/deploy-web.yml` | Deploy pipeline (existing) |
| `.github/workflows/close-stale-incidents.yml` | Issue cleanup (existing) |
| `.github/workflows/ci.yml` | Fast-feedback CI (new) |
| `.github/workflows/canon-lint.yml` | Lore validation (new) |
| `.arcanea/strategy/OPS_ARCHITECTURE.md` | This document |
| `.arcanea/lore/CANON_LOCKED.md` | Canonical lore reference |
| `.arcanea/MASTER_PLAN.md` | Central orchestrator |
