# `_intelligence/` — Premium Web OS (Arcanea binding)

This repo consumes the **Premium Intelligence Web OS**. The canonical, full OS (taste / design / motion / 3D / copy / workflows / prompts / templates / checklists) lives in
[`claude-skills-library/premium-web-os/`](https://github.com/frankxai/claude-skills-library/tree/main/premium-web-os) and is installable as the `premium-web-os` skill (`/web-os`, aliases `/wos`, `/wde`).

This folder is the **Arcanea-bound operative subset**: it does not duplicate the canon — it binds it to Arcanea's existing design law.

## Authority order (Arcanea)

When building any premium web surface in this repo, read in this order:

1. **`TASTE.md`** (repo root) — curatorial judgment, 7 gates, Motion Canon.
2. **`DESIGN.md`** (repo root) — machine tokens.
3. **`@arcanea/design-system`** — runtime `tokens` + `motion` (`heroReveal`, `staggerContainer`, `magneticHover`, `scrollFade`, `transitions`, easings) + `brand-kits` + `primitives`.
4. The Premium Web OS canon (taste/design/motion/three-webgl) for cross-brand grammar + the build sequence + the gates.

The OS never overrides Arcanea canon — where they overlap, Arcanea wins (it is the brand-specific source). The OS adds the build sequence, the motion/3D discipline, and the quality gates.

## Build sequence (non-negotiable)

read canon → page spec → scene brief → static composition → motion → 3D → polish → visual QA → performance → handover.

## What's here

- [`arcanea-flagship-page-spec.md`](./arcanea-flagship-page-spec.md) — the spec the `/design-lab/web-os` flagship was built from (self-test: it matches what shipped).

## The flagship

`apps/web/app/design-lab/web-os/` — a cinematic proof that the OS produces premium output on the Arcanea stack, reusing `@arcanea/design-system` motion + the shipped R3F hero pattern. It must pass the 7 Arcanea gates and the OS `release-check`.

Built on the Premium Intelligence Web OS.
