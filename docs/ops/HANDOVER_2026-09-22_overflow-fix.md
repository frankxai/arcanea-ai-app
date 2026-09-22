# Handover — 2026-09-22

Session: Grok `01a0c11a-55a8-7fa3-a609-ee5b95a14e06` (home workspace). Multi-repo: reboot pack, design-craft production capture, overflow fixes. Arcanea slice is draft-ready PR **#438**.

Full pack: `C:\Users\frank\.starlight\handoffs\2026-09-21-reboot-pc\` plus `visual-proof\design-craft-2026-09-21\CAPTURE.md`.

## What Landed

On **main** before this session (not this Grok):

- gencreator.ai **#76** motion fail-closed (`3019bf4`)
- frankx.ai **#718** GlowButton
- arcanea-ai-app **#433** shared button filter
- arcanea **#435 / #436**, gencreator **#77**, academy **#42** (HOLD list stale)

This session did **not** merge to main.

## What Changed This Session

- Reboot pack for a 1-minute restart: `C:\Users\frank\.starlight\handoffs\2026-09-21-reboot-pc\` (`RESUME.md`, `STREAMS.md`, `PRS.md`, `LOCAL-GIT.md`).
- Production capture 375/768/1440 of `/`, `/research`, `/workshops`, `/prompt-books` via system Chrome. Looked-at clips: GenCreator **Join wa**, Arcanea H1 **Libra**, 768 **Get Started**.
- Isolated worktrees from `origin/main` (not ASPH primaries):
  - `starlight/worktrees/gencreator-nav-overflow-20260921` → https://github.com/frankxai/gencreator.ai/pull/87
  - `starlight/worktrees/arcanea-prompt-books-overflow-20260921` → https://github.com/frankxai/arcanea-ai-app/pull/438
- Arcanea: desktop nav + UserNav at `lg`; prompt-books H1 `text-2xl` + `text-balance`; landing `overflow-x-clip`.
- GenCreator: keep 44px menu; shrink 375 padding/type so **Join waitlist** stays whole. Later lane added `tests/e2e/nav-waitlist-375.spec.ts`.

`starlight-agent-config` not written. No `pp prep`. No ASPH push.

## Current Blockers

- Vercel **team previews are SSO**. Headless Chrome hit `Log in to Vercel`, so 375 recapture of #87/#438 is still required from a logged-in browser or local SDS.
- GitHub will not count frankxai self-review. Frank clicks Approve.
- HOLD unless Frank overrides: SI.ai 5/8/9/11/12, frankx 724/725, Dependabot majors, ASPH local HEADs, heal dirty tree (63 files), academy #52.
- Codex Stop-hook still unverified.
- Control plane `starlight` on `codex/rova` remains ~2000 dirty. Not a product repo.

## Recommended Next Stack

1. **Recapture #87 and #438 at 375/768 while logged into Vercel, or SDS local.** Why: merge gate is a looked-at shot, not CI green alone. #87 already has e2e + Vercel SUCCESS.
2. **Frank Approve + merge #87 then #438, one at a time.** Why: overflow is the defect we captured; do not squash frankx #725; do not mix these with Human Roster.
3. **Human Roster checker on SI.ai #12 only.** Why: greatness stream. Do not steal the heal tree. Do not send Eni.
4. **Do not reopen Jules-watch clones.** Why: doctrine is `01a0ba6d`; watches die on reboot.

## Verification Evidence

| Surface | Evidence |
|---|---|
| Production before fix | `.../visual-proof/design-craft-2026-09-21/*-light.png` |
| gencreator #87 | CI lint/typecheck/unit/build/e2e SUCCESS, Vercel SUCCESS, **not draft** |
| arcanea #438 | not draft; Vercel was building at open; recapture still SSO-blocked |
| Receipts | `run_20260921_003201_grok_ab7a742a` (capture), `run_20260921_015633_grok_be174a62` (overflow) |

---

## Session Wisdom

### Prompts That Worked

- **Named lanes + constraints:** `Continue design-craft. Do not paint pages. Preview+capture PR X/Y/Z. Do not write starlight-agent-config.` produced capture on the control routes instead of a homepage restyle.
- **`/handover` at close** beats another status dump.
- **`why cant you fix and progress`** is the override: after capture, overflow on that route is the write.

### Technical Choices Validated

- Isolated `git worktree add -b agent/grok/... origin/main` is how you fix production clips when primaries are ASPH/other-agent. Writing the Codex `design-craft-20260916` trees would have stolen a lane.
- System Chrome `--headless=new --screenshot=` only persists if you **wait the process** (`Start-Process -Wait`). `& chrome` returns before the PNG exists.
- WCAG `min-h-11` on the hamburger caused the 375 clip. Keep the target; shrink padding/type; do not drop the waitlist words.

### Patterns Discovered

- `Do not paint pages` after a capture pass is not `do not fix overflow`. The next write is the clip you just looked at, on a clean `origin/main` worktree.
- Vercel preview ≠ capturable. Production URLs work unauthenticated; team previews demand SSO. Plan SDS or a public alias before claiming visual proof of a PR.
- CONTINUE.md from 2026-09-18 listed #76/#718/#433 as drafts. GitHub was already merged. Live `gh pr view` before capture.

### What Was Built (Gratitude)

The machine can restart without losing the map, and the clips we actually saw on live pages now have lanes and PRs instead of another screenshot folder. Capture stopped being the whole job.
