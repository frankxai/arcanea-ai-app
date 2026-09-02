# Task Contract — Starlight Growth Core capture

Date: 2026-09-02
Owner: Codex, requested by Frank
Status: implementation branch

## Scope

Replace Arcanea's non-persisting public capture paths with the shared Starlight Growth Core while preserving Arcanea-specific form UX and segmentation.

## Files

- `apps/web/app/api/waitlist/route.ts`
- `apps/web/components/community/newsletter-form.tsx`
- `apps/web/app/pricing/pricing-client.tsx`
- this task contract
- `CURRENT_CHANGELOG_2026-09-02.md`

## Non-goals

- No Arcanea product/auth data moves out of the Arcanea Supabase project.
- No lifecycle-email campaign is added.
- No pricing, offer, lore, or visual-system rewrite.
- No unrelated open PR or worktree is changed.

## Acceptance criteria

1. Footer newsletter submissions persist as `arcanea-newsletter`.
2. Pricing submissions persist as `arcanea-founding-circle`.
3. The route validates input and fails closed if canonical storage rejects or times out.
4. The UI shows success only after a confirmed Growth Core write.
5. Honeypot submissions are screened without persistence.
6. Build, typecheck, CI, preview, and an end-to-end capture receipt pass before promotion.

## Verification

- `pnpm --dir apps/web run type-check`
- `pnpm --dir apps/web run lint`
- `pnpm --dir apps/web run build`
- Vercel preview smoke for `/pricing`, `/community`, and `/api/waitlist`
- Synthetic capture verified in Growth Core, then removed

## Rollback

Revert the PR. The shared Growth Core remains isolated and can continue serving other brands.
