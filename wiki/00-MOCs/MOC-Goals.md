---
title: MOC — Goals & Gates
aliases: ["goals", "gates", "north stars"]
tags: [moc, goals, starlight-os]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# Goals & Gates — Map of Content

Bound to Starlight OS Goal DB in Notion. Gates are binary + time-bound. A Goal without a Gate is a wish.

## Active Gate (as of 2026-04-21)

See Notion Goal DB + `prompt-os-dashboard` Cowork artifact for the current Gate tag.

Rule: **one active Gate at a time.** Multiple gates = no gate.

## Goal hierarchy

```
North Star  →  Multi-quarter vision (e.g., "€40.5K MRR across 13 surfaces")
     │
     └─ Goal  →  Quarterly outcome (e.g., "GenCreator Studio at €5K MRR by end Q2")
            │
            └─ Gate  →  Binary weekly test (e.g., "5 Studio sign-ups this week")
                   │
                   └─ Move  →  Daily Council Top-3 ("DM 3 principal-tier creators with tailored offer")
```

Each layer writes to a different Notion DB. North Stars persist. Goals turn over quarterly. Gates turn over weekly. Moves turn over daily.

## Load-bearing life goals (Frank's preference layer)

Do not let these overfill the OS — they are reference, not operational:

- Houseboat in Amsterdam
- Ocean villas in Marbella, Fuerteventura, Lanzarote
- Creative hub at brother's in Croatia
- Autonomous EV
- 100-day Lumina streak

These live as atoms in [[../07-Areas/health]] and [[../07-Areas/finance]] — not as OS gates.

## Gate verdict flow

```
Gate set Sunday (Weekly Brief closes)
  →  Top 3 Moves per Daily Brief all week
    →  milestone-scanner writes Move Shipped Date on Linear close
      →  Next Sunday: Weekly Brief computes Gate hit rate
        →  Gate held OR Gate pivoted (never skipped)
```

## Kill criteria

- 3 weeks of Gate pivots without shipping → Gate is theater, refactor
- Move Shipped Date empty for 3 days → milestone-scanner is broken, alert
- Frank doesn't open Gate tracker 4/7 days → Gate is not load-bearing, refactor
