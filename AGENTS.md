# Agents Configuration

## Cursor Cloud specific instructions

### Overview

Arcanea is a pnpm monorepo (Turborepo) with the main web app at `apps/web` (Next.js 16, port 3001). See `README.md` for architecture and quick-start commands; see `package.json` scripts for lint/test/build/dev commands.

### Running the web app

```bash
pnpm dev:web   # starts Next.js dev server on port 3001
```

The dev server starts in ~1 second. Env vars are loaded from `apps/web/.env.local`. A placeholder `.env.local` with dummy values is sufficient to start the app (Supabase/AI features degrade gracefully).

### Known pre-existing issues

- **Lint**: `pnpm lint` (web) reports ~479 pre-existing errors/warnings (mostly `@typescript-eslint/no-explicit-any`, unused vars). These are not regressions.
- **Production build**: `pnpm build --filter=@arcanea/web` fails due to missing icon exports in `apps/web/lib/phosphor-icons.ts` (e.g. `PhMagnifyingGlassMinus`). The dev server is unaffected.
- **Package builds**: Several internal packages (`@arcanea/auth`, `@arcanea/mcp-server`) have build errors due to missing type exports from `@arcanea/core`. Only `@arcanea/core` and `@arcanea/extension-core` build cleanly.
- **Lockfile drift**: `pnpm-lock.yaml` may be out of sync with `package.json` files; use `pnpm install` (not `--frozen-lockfile`) during setup.

### Tests

```bash
pnpm test:quick   # runs node --test on core, extension-core, auth, arcanea-mcp
```

Tests for `core` and `extension-core` require building first: `pnpm build --filter=@arcanea/core --filter=@arcanea/extension-core`. Auth and MCP tests fail due to build issues (pre-existing). 239/248 core+extension-core tests pass; 9 failures are in Guardians canon compliance tests (pre-existing).

### Environment variables

Copy `apps/web/.env.example` to `apps/web/.env.local`. Minimum required for the app to start:
- `NEXT_PUBLIC_SUPABASE_URL` (placeholder OK)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (placeholder OK)
- For AI features: `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`

### Gotchas

- Node.js >=20.9.0 required (the `engines` field enforces this).
- pnpm >=8.0.0 required; `packageManager` is set to `pnpm@8.15.0`.
- The web app runs on port **3001** (not the default 3000).
- The `middleware.ts` file triggers a deprecation warning about the "middleware" convention in Next.js 16; this is cosmetic.
- No Docker, Redis, or external databases are needed for local dev. Supabase is used as an external SaaS dependency.
