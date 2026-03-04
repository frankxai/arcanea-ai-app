---
id: M008
title: Onboarding & Conversion Optimization
guardian: Maylinn
gate: Heart
priority: P0
status: planned
progress: 0
created: 2026-03-01
target: 2026-03-10
tags: [onboarding, conversion, ux, analytics]
depends_on: [M005]
---

# M008: Onboarding & Conversion Optimization

> First impressions determine everything. Make the first 5 minutes magical.

## Tasks

### T1: Onboarding Wizard (v0)
- [ ] Integrate v0-generated onboarding flow
- [ ] Creator type → profiles.creator_types
- [ ] Guardian quiz → profiles.guardian + profiles.active_gate
- [ ] First creation → /api/creations + celebration animation
- [ ] Set gates_open = 1, magic_rank = 'Apprentice'
- [ ] Redirect to personalized dashboard

### T2: Welcome Dashboard
- [ ] Post-onboarding landing: "Your Universe" overview
- [ ] Guardian greeting (personality-matched welcome message)
- [ ] Suggested next actions (create, explore library, join community)
- [ ] Gate progress ring with first gate glowing

### T3: Activation Loops
- [ ] Day 1: Welcome email with guardian wisdom
- [ ] Day 3: "Your guardian noticed you haven't created yet" nudge
- [ ] Day 7: Weekly digest of community highlights
- [ ] Streak tracking with XP bonuses

### T4: Conversion Tracking
- [ ] Add PostHog/Plausible analytics
- [ ] Track: signup → onboarding complete → first creation → return visit
- [ ] A/B test hero copy variants
- [ ] CTA click tracking on all pages

### T5: Auth UX Polish
- [ ] Social login (Google, GitHub, Discord)
- [ ] Magic link option (passwordless)
- [ ] Error state improvements
- [ ] Loading states during auth flow
