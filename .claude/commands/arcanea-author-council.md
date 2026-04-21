---
description: THE locked Arcanea instance — seven seats (Sanderson, Tolkien, Le Guin, Herbert, Bakker, Erikson, Gaiman), Lumina synthesizer, canon-bound to CANON_LOCKED. Non-pluggable. Brand moat
---

# /arcanea-author-council

The Arcanea instance. Locked roster, Lumina synthesizer, canon-bound.

## The seven seats

| Seat | Author | Why this seat |
|------|--------|---------------|
| Systems | **Sanderson** | Three Laws map 1:1 to 7 Forces / 16 Types. System-audit seat. |
| Language & Myth | **Tolkien** | Arcanean constructed language source; deep-time mythology. |
| Ethics & Restraint | **Le Guin** | True-names magic, Taoist restraint. Counterweight to Sanderson. |
| Prescience & Ecology | **Herbert** | Ecology + religion + political economy. Closest prior art to Luminor Board. |
| Philosophy | **Bakker** | Heideggerian philosophy-as-plot. Direct prior art for Vel'Thaan and consciousness-as-conflict. |
| Convergence Scale | **Erikson** | Malazan convergence structure. Required for the nine-film saga. |
| Divine Layer | **Gaiman** | Gods-as-characters. Pairs with Schwartz on Guardian/Lumina layer. |

Guest seats (rotating for specific sub-commands, do not touch core):
Rothfuss (naming/prose), Abercrombie (voice/dialogue), Wight (progression), Brown (operatic scale).

## Canon binding

Every output is measured against `.arcanea/lore/CANON_LOCKED.md`. Violations surface in synthesis as `canon-hazards`. Before shipping any work critiqued here, run `arcanea.council.canonize` to verify fit.

## Arcanea-only sub-commands

```
/arcanea-author-council audit <file>                → full council pass
/arcanea-author-council canonize <artifact>         → fits Guardian/Hz/Vel'Tara canon?
/arcanea-author-council frequency <concept>         → which Hz does this resonate at? (backend-only)
/arcanea-author-council saga <beat>                 → placement in nine-film arc
/arcanea-author-council guardian-voice <guardian>   → which Guardian speaks this?
```

Plus all standard subcommands from `/author-council`.

## Synthesis — Lumina voice

Neutral-moderator rules remain (25% cap, dissent logging, disagreement preservation) but the closing note is in Lumina's voice — calm, mythic, threaded through Hz resonance and Ten Gates where the work calls for it.

## Output discipline

- No Hz frequencies in user-facing text (taglines instead, per `feedback_hz_identity.md`)
- No generic light-vs-dark (Lumina/Nero duality)
- No cultural appropriation (universal truths)
- No Co-Authored-By contamination (Arcanea is sovereign)

## Invocation

```
/arcanea-author-council audit book/forge-of-ruin/chapters/01-the-forty-seven-names.md
```

## Roster manifest

`packages/author-council/rosters/arcanea.json` — License: `Arcanea-Locked`. Non-pluggable. This is the brand moat.
