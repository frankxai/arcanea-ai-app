# Homepage experience brief, truthful claims and skill routing

14 October 2026. Pull request [638](https://github.com/frankxai/arcanea-ai-app/pull/638), branch `claude/zealous-ride-l641fr`, merged with main at `c5d500c`. No owning issue exists yet; the open decisions below are candidates for one.

## Creator job and scope

The homepage's job is to get a solo world-builder from one sentence to a named world that remembers, and to bring them back to it. `docs/experience-brief.md` records the reader, the proposed primary conversion (first world generated and saved through `/worlds/create`), the order the page should explain itself, the CTA hierarchy, the emotion arc and the mobile contract.

## Landed in this change

- Homepage claims that the code contradicted are rewritten to match it: storage (Supabase, not local SQLite), keys (browser `localStorage`, sent with each request), creator storefronts (roadmap, not built in), training (matches `/privacy`), and counts sourced from `FACTS`.
- Hero contrast and 44 px tap targets for the chips, send button and Sign In. Accessible text now reads with real spaces: the h1 has a space between its lines, and `SplitText` emits word spans. #640's fail-open start position (`y: 0`) is kept.
- Three analytics events: `home_hero_submit`, `home_hero_chip` and `home_final_cta`. None carries prompt text.
- **Shared operating rule:** a `UserPromptSubmit` hook, `.claude/hooks/skill-activation-prompt.mjs`, now runs on every Claude Code prompt in this repo.
  - It injects an ordered list of skills: `web-release-gate` first, then the framework kits, then specialists. The kits are `nextjs`, `react`, `tailwindcss` and `shadcn`, vendored from claude-skills-library `packs/stack-kits` (upstream blencorp/claude-code-kit, MIT).
  - The list ends with a precedence line ranking `DESIGN.md`, `TASTE.md` and the brief above every skill.
  - It never blocks a prompt.
  - Upgrade it by re-running the pack's `install.sh`. Remove it by deleting its entry in `.claude/settings.json`.

## Proposed, not decided

The brief's target structure is a proposal. No page section has been cut or reordered. Three decisions are Frank's:

1. **First-run economics.** Fund a first world, or have the hero say "bring your key". Today the first chat send returns 401 when no key is set.
2. **Which sections are cut first** when the page goes from about 20 sections to 9.
3. **When the below-fold narrative renders on the server.**

## Open gaps

- Unchecked claims: one-click publishing, Gates unlocking developer permissions, "Free to start … immediately", "absolute data sovereignty" and integrated music.
- No events yet for the header Get Started and Sign In buttons, the product-pillar links, or world-created activation.
- `/studio/image` lane links bounce logged-out visitors to sign-in.

## Verification

The merged tree was checked with CI's own commands:

- `pnpm --dir apps/web run lint`, `pnpm turbo run type-check --filter=@arcanea/web` and `pnpm turbo run build --filter=@arcanea/web` (682 pages).
- `check-facts-drift.mjs` in advisory mode, and the changed-file Prettier ratchet.

Earlier, on the branch alone: Playwright confirmed the exact h1 and h2 text, the hero handoff to `/chat?prompt=`, all three events firing, and no horizontal scroll at 375 / 768 / 1440. A Vercel preview has not been checked on a phone.

## Rollback

- Revert `7350d71` to restore the previous homepage copy.
- Delete the hook entry in `.claude/settings.json` to stop the routing.
- The brief and this record are documentation only.
