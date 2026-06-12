# Contributing

Arcanea is source-viewable and selectively collaborative. Contributions are
welcome when they fit the product direction, respect the proprietary license,
and keep the repo verifiable.

## Before You Start

- Read [AGENTS.md](./AGENTS.md).
- Use Node 20.x and pnpm only.
- Work on a focused branch, never directly on a dirty `main`.
- Keep changes narrow and tied to one concern.
- Do not introduce raw visual constants in app code; use `@arcanea/design-system`.

## Pull Request Bar

Every substantial change needs:

- Scope
- Owner
- Files
- Non-goals
- Acceptance criteria
- Verification
- Rollback

Run the relevant checks before opening a PR:

```bash
pnpm install --frozen-lockfile
pnpm run type-check
pnpm run lint
pnpm run build
pnpm run verify:project-workspaces
```

For app media or visual surfaces:

```bash
pnpm --dir apps/web test:media
```

## Contribution Terms

By submitting a pull request, issue, design, document, prompt, or other
contribution, you confirm that you have the right to provide it and you grant
Arcanea permission to use, modify, publish, and distribute it as part of the
project.

Do not submit confidential data, customer data, credentials, licensed assets,
or third-party content that Arcanea does not have permission to use.
