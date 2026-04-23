---
title: GenCreator — Area
aliases: ["gencreator"]
tags: [area, brand, gencreator]
created: 2026-04-21
updated: 2026-04-21
status: stable
brand-registry: gencreator
---

# GenCreator

**Thesis.** Three-tier creator operating system. OS Circle (Whop, $49/mo) → Studio (Stripe, €297/mo) → Retreat.

## Voice

Creator-intimate. Studio-tier excellence. Results without guru register.

## Key surfaces

- gencreator.ai (production, Next.js 16)
- Whop (OS Circle + one-time products)
- Stripe (Studio + Retreat)

## Identity model

Supabase `members` table is single source of truth. Whop, Skool, Stripe are sync sources. Entitlements read from `tier_access` view — never from `tier` string. See `C:\Users\frank\gencreator.ai\CLAUDE.md`.

## Current status (2026-04-21)

Launch 2 days OVERDUE (ARC-139). CI billing block resolved 2026-04-19. Waiting on credentials.

## Cross-brand flow

- FrankX top-of-funnel → GenCreator OS Circle conversion
- GenCreator Studio → Vibeclubs extension as daily-use tool
- GenCreator Retreat → Atelier-tier insight reuse (SIS)

## Anchoring atoms

- [[../05-Atoms/concepts/three-tier-creator]]
- [[../05-Atoms/frameworks/open-core-pricing]]
