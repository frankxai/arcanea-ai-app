---
title: Vibeclubs.ai — Area
aliases: ["vibeclubs", "vbc"]
tags: [area, brand, vibeclubs]
created: 2026-04-21
updated: 2026-04-21
status: stable
brand-registry: vibeclubs
---

# Vibeclubs.ai

**Thesis.** Format, not platform. A Chrome extension that overlays vibe-mix + synced Pomodoro on any page. OSS-first.

## Voice

Format-not-platform. OSS-core. Community-built. No guru tone, no hype.

## Architecture

ADR-002 — extension is the runtime. Web app is directory + content layer. See `C:\Users\frank\vibeclubs.ai\CLAUDE.md`.

## Sprint 1 (2026-04-17 → 2026-05-14)

VBC-21 → VBC-40 (ARC-143 → ARC-158). Next ticket: VBC-22 (Supabase migration against real project).

## Key surfaces

- vibeclubs.ai (web directory, Next.js 16)
- `apps/extension` (Plasmo Manifest V3 Chrome extension)
- 5 OSS npm packages: vibe-mix, pomodoro-sync, ai-witness, session-card, suno-bridge

## Invariants (from VISION.md)

1. No WebRTC / LiveKit in web (ADR-002 killed this)
2. No payments in Sprint 1
3. Extension never reads page content
4. AI witness never initiates — only responds
5. Music is per-listener, not broadcast
6. Session cards are deterministic

## Anchoring atoms

- [[../05-Atoms/frameworks/format-not-platform]]
- [[../05-Atoms/concepts/session-witness]]
