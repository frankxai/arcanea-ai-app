# Current Backlog — 2026-05-22 — Live Surfaces and Voice Support

## Next actions

1. Add an auto-start mechanism for `pnpm agents:surface:watch` at login or shell bootstrap.
2. Keep `packages/arcanea-voice/src/server.mjs` support-only unless the active Claude branch asks for a coordinated change.
3. Decide whether Antigravity task summaries should be pulled from a cleaner log source than the current transcript tail.
4. Consider a lightweight freshness timestamp in the machine snapshot file so other tools can detect stale visibility without re-scanning the filesystem.

## Non-goals

- Do not rewrite the voice branch.
- Do not touch unrelated ecosystem worktrees unless the status support depends on it.
- Do not add a second overlapping status system; keep the current probe authoritative.
