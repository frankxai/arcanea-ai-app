# Author Council — Autonomous Build Plan (2026-04-21)

> 4-hour autonomous sprint. Frank delegated full authority.
> Quality bar: 7-gate excellence standard. Apply to Forge of Ruin Ch.1 as proof.

## Scope

Two-tier architecture (Frank's spec, validated by /starlight-architect):

- `/author-council` — protocol primitive, MIT, fork-ready
- `/{domain}-author-council` — curated rosters (fiction, magic-system, worldbuilding, prose)
- `/arcanea-author-council` — locked instance, bound to canon

Package: `@arcanea/author-council` (new — `@arcanea/council` is Guardian consensus, orthogonal).

## Non-goals

- No scraping copyrighted prose. Tier 1 primary sources only (public essays/interviews/lectures).
- No new UI. MCP + slash commands only.
- No publishing to npm this session (requires `npm login`, already P1.1 in backlog).
- No dependency on Supabase (keep offline-runnable).

## Author Roster (locked 7 + 3 fav + guest pool)

| Seat | Author | Role |
|---|---|---|
| Systems | Sanderson | Hard-magic laws, system audit |
| Language & Myth | Tolkien | Constructed language, deep time |
| Ethics & Restraint | Le Guin | True-names, Taoist restraint |
| Prescience & Ecology | Herbert | Ecology, religion, political economy |
| Philosophy | Bakker | Philosophy-as-plot, consciousness-as-conflict |
| Convergence Scale | Erikson | Malazan convergence architecture |
| Divine Layer | Gaiman | Gods-as-characters, mythic voice |
| Fav (heroic) | Paolini | Classical heroic arc, Fractalverse worldbuilding |
| Fav (Germanic) | Schwartz | Germanic mythic-political (Götterkriege) |
| Fav (mechanics) | Weeks | Magic-as-mechanic, Night Angel + Lightbringer |

Guest pool for sub-commands: Rothfuss (naming/prose), Abercrombie (grimdark voice), Will Wight (progression), Pierce Brown (operatic revolution).

## File Shape (per author)

```
authors/{slug}/
  SOUL.md        # voice fingerprint, obsessions, craft axioms
  SKILLS.md      # role in council, when to invoke
  PATTERNS.md    # structural patterns — plot skeletons, POV, magic formalization
  glossary.json  # coined terms, constructed language
  systems.json   # magic/tech/political systems formalized
  craft.md       # explicit craft rules (mined from essays/interviews only)
  voice.json     # quantified style vector
  sources.md     # citation trail — every claim traceable
```

## Slices (ship order)

1. **Protocol primitive** — `@arcanea/author-council` package: types, 4 deliberation modes, neutral synthesizer, question router
2. **Sanderson corpus** — reference implementation (most public craft material)
3. **Remaining 9 authors** — SOUL/PATTERNS/glossary/systems/craft/voice per author
4. **MCP server** — `council.convene`, `council.audit`, `council.magic-system`, `council.naming`, `council.plot`, `council.prose`, `council.style-transfer`, `council.diverge`, `council.synthesize`, `council.glossary-extract`, `council.reason` + Arcanea-only: `arcanea.council.canonize`, `arcanea.council.frequency`, `arcanea.council.saga`, `arcanea.council.guardian-voice`
5. **Council rosters (YAML manifests)** — arcanea, fiction, magic-system, worldbuilding, prose, grimdark, progression, mythic
6. **Slash commands** — `/author-council`, `/fiction-author-council`, `/arcanea-author-council`
7. **Apply** — run council audit on Forge of Ruin Ch.1, write output to `book/forge-of-ruin/council-audits/`
8. **Handover + commit + push**

## Verification

- `pnpm --filter @arcanea/author-council build` passes
- `pnpm --filter @arcanea/author-council test` passes (unit tests for router, synthesizer, modes)
- MCP server starts without error
- Council audit on Ch.1 produces non-trivial, cite-traceable output
- 7-gate excellence check on final artifact

## Anti-patterns to avoid

- Quoting copyrighted prose in author files
- Building authors' knowledgebases from memory without citations
- Over-engineering: ship simple protocol first, vector retrieval later
- Creating UI: this is MCP + slash, no web surface this session
