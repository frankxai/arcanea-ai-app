# Contributing to @arcanea/orchestrator

Thank you for considering contributing. This package is a small, focused dispatcher — we keep it that way on purpose.

## Development setup

```bash
git clone https://github.com/frankxai/arcanea-ai-app.git
cd arcanea-ai-app
pnpm install --filter "@arcanea/router-spec" --filter "@arcanea/orchestrator"
pnpm --filter @arcanea/router-spec build
pnpm --filter @arcanea/orchestrator build
pnpm --filter @arcanea/orchestrator test

# Link for local development:
cd packages/orchestrator
npm link
arcanea-orchestrator --version
```

## Project structure

```
packages/orchestrator/
├── src/
│   ├── cli.ts              # Commander entry — add subcommands here
│   ├── config.ts           # ~/.arcanea/config.yaml read/write
│   ├── history.ts          # ~/.arcanea/history.jsonl append-only log
│   ├── adaptive.ts         # Phase 8 ranking algorithm
│   ├── ao-bridge.ts        # Composio AO connector (graceful degrade)
│   ├── runtimes.ts         # provider → CLI binary + argv mapping
│   └── commands/           # one file per subcommand
├── tests/                  # node:test + tsx
├── workflows/              # built-in *.yml compositions
├── scripts/install.sh      # curl-installable bootstrap
├── AGENTS.md               # agent-readable package policy
└── CHANGELOG.md
```

## Opening a PR

### Small changes (typo, docs, single-file fix)

1. Fork, branch, commit, push, open PR.
2. CI runs `orchestrator-ci.yml` on every push touching `packages/orchestrator/**` or `packages/router-spec/**`.
3. Tests must pass. No exceptions.

### New commands

1. Add a file under `src/commands/<name>.ts` with a single exported command function.
2. Register it in `src/cli.ts` with a one-line description.
3. Add a test in `tests/<name>.test.ts` (at minimum, cli-smoke exit-code + output regex).
4. Update `README.md` in the "Use" section.
5. Add to `CHANGELOG.md` under "Unreleased".

### New models or task classes

Edit `packages/router-spec/models.yaml`, **not this package**. The dispatcher reads the spec — adding a model here just means the dispatcher will route to it as soon as the spec knows about it.

### New runtime (e.g. grok-cli, cursor-cli)

Edit `src/runtimes.ts`:

1. Add `'grok'` to the `RuntimeId` type union.
2. Map `provider → runtime` in `runtimeFor()`.
3. Register `RUNTIMES['grok'] = { binary, argv }` with the correct argv shape.
4. Add a case to `commands/doctor.ts` `detectAuth()` that infers auth tier.
5. Test with a real call if possible.

### New workflow template

Drop a `.yml` file in `workflows/` matching the existing shape. Tests auto-pick it up from `workflow list` smoke tests.

## Output discipline

- **Stderr** for routing decisions and meta info (`[arcanea] task=... → model via runtime`).
- **Stdout** for the actual sub-CLI response. This makes the tool pipe-friendly.
- Machine-readable modes: every subcommand that prints human output should accept `--json`.

## Code style

- TypeScript strict (no `any` unless narrowing is infeasible).
- No new deps without an issue first. Current deps: `commander`, `execa`, `kleur`, `yaml`, `@arcanea/router-spec`. That's enough.
- Files under 200 lines. Split commands by concern.
- No global mutable state. Load config/history on demand per command.

## Performance budget

- Dispatcher startup: <100ms (measured via `time arcanea-orchestrator --version`).
- Resident memory after `--version`: <50MB.
- If a change regresses either, justify in the PR.

## Things we won't accept

- New TUI surfaces. This package is headless. If you want a TUI, build on top.
- Telemetry or analytics. Prompts are private, and local history stays local.
- Dependencies that phone home.
- Model-specific hardcoding. Route through the spec.
- Breaking changes to `~/.arcanea/config.yaml` or `history.jsonl` without a migration path.

## Release process

1. Update `package.json` version (semver).
2. Add a `CHANGELOG.md` entry.
3. `pnpm build && pnpm test`
4. `pnpm publish --access public --no-git-checks`
5. Git tag `@arcanea/orchestrator@X.Y.Z`, push.

## Security

Report security issues privately to friemerx@gmail.com. Do not open public issues for vulnerabilities.

## License

By contributing, you agree your contributions will be licensed under the MIT License.
