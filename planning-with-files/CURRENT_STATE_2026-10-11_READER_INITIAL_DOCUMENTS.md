# Read public chapters before JavaScript loads

Scope: repair the initial reading document and missing-chapter recovery using the
accepted reader. The user's job is to open an existing public book, read its prose
immediately, and find another chapter if an address is unavailable.

Owner: Codex thread `01a1269f-23eb-7bb2-b609-77d731cacc50`, integration owner
`codex-provider-account-20261011`. Worktree:
`arcanea-provider-account-20261011`; branch
`agent/codex/provider-account-20261011`; origin
`https://github.com/frankxai/arcanea-ai-app.git`. Programme issue 276; preserved
reader feature draft 560. This integration does not promote draft 560.

Base: accepted production `97801884c78afacdb718302c7655bae0f3a86580`.
The owned integration commit `1015c45bd3e2c7e51f2c3939dd7f26f978362073` has the
same tree. Node 24 and pinned pnpm 11.28.4 govern this work, as Frank confirmed.

Files:

- `apps/web/components/saga/chapter-reader.tsx`
- `apps/web/app/books/[bookId]/[chapterId]/not-found.tsx`
- `scripts/verify-reader-entry-browser.cjs`
- this current-state record

Non-goals: manuscript or canon changes, visibility changes, private scene-image
features, new models, billing, migrations, publishing, a second orchestrator, or
changes to accepted account and generation recovery. Existing unfinished reader
and chat reservations and their branches remain preserved.

Acceptance criteria:

- Four existing public chapters contain their actual prose with site JavaScript
  disabled on desktop and 375px mobile; each article has over 500 visible text
  characters, its expected source phrase, and fits the viewport.
- Missing chapters show a readable explanation and a working books link with
  JavaScript disabled and enabled. Unknown books disclose no chapter prose.
  Existing `notFound()` visibility checks and noindex behavior remain intact.
- Existing desktop, touch, reduced-motion, featured entry, next/previous, reload,
  and browser-back journeys continue to pass without runtime errors.
- Required build, types, lint, exact-source independent review and inspected
  source-bound browser captures precede promotion. The canonical deployed initial
  document is verified separately after acceptance.

Verification: the existing CI Build executes
`node scripts/verify-reader-entry-browser.cjs` on ready PRs and main. Retain its
built/source commits, run and attempt, layouts, screenshots and failed receipts.
Run local syntax/format checks using existing dependencies. Review the four-file
delta plus the existing renderer, route, visibility policy, tokens and CI context.
No paid inference is needed. Local build preflight returned HOLD: 4,230 MB RAM
free versus 8,192 MB required, 27 task runtimes. Use hosted CI; start no local
build, browser, server or additional agent. Ordinary edits and small checks remain
permitted under the machine contract.

Rollback: revert only this four-file repair through the normal reviewed path,
preserving manuscripts, canon, other owners' edits and accepted account recovery.

## Reproduction and implementation decision

At production source `97801884`, a seven-request observation bound all responses
to deployment `dpl_7SpakFZiq4Rp5JbzMCEXTTeCxSkc`. All four chapter documents
returned HTTP 200 and an article, but contained zero article prose outside
script/style/template payloads. Source phrases existed only in client payloads.
The invalid chapter was noindex and had no book recovery link. This observation
does not establish a hydrated-client failure or editorial acceptance.

The reader loads its primary Markdown with `ssr: false`. Reuse the existing
Markdown renderer directly; preserve its client controls and lazy code highlighter.
The serious alternative is passing server-rendered children into the interactive
reader, which requires a wider component contract without additional value for
this repair. Keep the existing server route's `notFound()` and add its local
server-rendered recovery boundary.

Prepared handoff: base `3b8120b424fb6f42f1aa62b82870bbb4b5c113de`, patch SHA-256
`a4cfe08ec94bbdbf56cfc7ad606ed54cb02af32829ca376beaeafe608297242a`.
Reconcile its direct renderer import with accepted production and expand its
proposed desktop-only proof to mobile and explicit missing-address recovery.

Relevant skills loaded: Starlight SI routing, Arcanea task contracts, Premium
Web OS, Emil design engineering and humanizer. Root `AGENTS.md` SHA-256:
`36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`.
The applicable app guide is `apps/web/CLAUDE.md`; no deeper AGENTS scope governs
these four paths. Loading policies is distinct from runtime enforcement.

| Before                                     | After                                             | Why                                                                 |
| ------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------- |
| Primary chapter prose waits for JavaScript | Existing Markdown renders in the initial document | Readers can start the actual story immediately                      |
| Missing chapter has no books exit          | Local server boundary links to the catalogue      | Recovery works before hydration and exposes no private book details |

Status: implementation and hosted verification in progress. This slice does not
establish live scene-generation quality, customer adoption, book publication,
commercial viability or completion of the full founder programme.
