# Contributing to Arcanea

Start with an existing [issue](https://github.com/frankxai/arcanea-ai-app/issues).
Describe the user problem and the smallest change that would resolve it. For
larger changes, agree on scope in an issue before implementing them.

## Creators, authors and game developers

Useful feedback includes a supplied scene or world fragment, the job you tried,
the output you received and the correction you needed. The creative-workflow issue
form asks for that evidence. Use a small invented or cleared example; issues are
public. Remove unpublished manuscripts, personal information, credentials and
material you cannot share.

For a skill proposal, name the existing workflow it improves. Include sources,
support files, attribution and rights status, plus fresh requests with expected
checks and saved failures. Keep accepted world facts separate from proposals.
Official Arcanea changes need a versioned canon source and human review. Creator
worlds retain their supplied rules; adaptations do not automatically change canon.

The proposed curated source is `packages/arcanea-skills/skills`. Its four workflows
are internal candidates with rights, evaluation and release gates open. Reconcile
existing variants before adding another pack or install root. Read the
[package instructions](packages/arcanea-skills/README.md).

## Developers

Clone this repository and use Node from `.nvmrc` and pnpm from `packageManager`
in `package.json`. Current pins are Node 22 and pnpm 8.15.0.

```sh
git clone --depth 1 https://github.com/frankxai/arcanea-ai-app.git
cd arcanea-ai-app
```

For the isolated skill checks, no dependency install or provider account is needed:

```sh
node packages/arcanea-skills/scripts/catalog.cjs
node packages/arcanea-skills/bin/install.js --list
node --test packages/arcanea-skills/tests/catalog.test.mjs
```

Web development requires the workspace dependencies and an isolated development
environment. Install with `pnpm install --frozen-lockfile`. The template is
`apps/web/.env.example`; it is partial, so inspect the requirements checked by
`scripts/check-env.ts` and your selected feature before configuring it. Keep local
values in `apps/web/.env.local`. Do not copy production keys or publishing tokens.
From the repo root, `pnpm --dir apps/web run check:env` checks required variables;
`pnpm dev:web` starts the web app on port 3001. These are development commands,
not a deploy or authorization to call paid providers.

Before editing, read [AGENTS.md](AGENTS.md) and the relevant current task records.
Keep unrelated work and source provenance intact. Use a focused branch and stage
only its files. Use existing schemas, package owners and integrations.

## Pull requests and verification

Describe the resulting behavior, link the owning issue, and record your base/head
commits, checks, failures and rollback. Show an observed before/after result where
useful. Distinguish authored examples, fixture tests, model evaluations and actual
creator or engine use. AI-assisted changes follow the same review requirements.

Run the checks relevant to the changed scope. Before a merge, the repository
contract requires build, typecheck and lint. CI defines Build, Lint, TypeScript and
CI Status jobs; required-check settings and independent review must be checked for
the current PR. An exact-commit review from a different harness/provider is needed
for consequential changes. See the
[review contract](.github/AI_EXACT_HEAD_REVIEW_CONTRACT.md).

Documentation or a passing local test does not approve licensing, canon promotion,
publication, prices or production deployment. Keep those decisions with their
existing human approval gates. Contributions do not create a blanket rights grant:
include applicable source terms and obtain a maintainer rights decision before
material is folded or released.

For bugs, use the bug-report form with a commit/package version, steps and expected
versus actual behavior. For a suspected vulnerability, follow [SECURITY.md](SECURITY.md)
instead of posting exploit details in a public issue.
