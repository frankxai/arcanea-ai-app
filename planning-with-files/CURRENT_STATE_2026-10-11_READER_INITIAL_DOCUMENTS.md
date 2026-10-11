# Read public chapters before application hydration

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

- Four existing public chapters contain their actual prose while every Next
  application JavaScript bundle is blocked on desktop and 375px mobile. Each
  article has over 500 visible text characters, its expected source phrase,
  opaque content and fits the viewport. React's inline streaming script remains
  enabled; full JavaScript-disabled reading remains an open limitation.
- Missing chapters show a readable explanation and a working books link with
  application bundles blocked and with hydration enabled. Unknown books disclose
  no chapter prose.
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
these five paths. Loading policies is distinct from runtime enforcement.

| Before                                     | After                                             | Why                                                                 |
| ------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------- |
| Primary chapter prose waits for JavaScript | Existing Markdown renders in the initial document | Readers can start the actual story immediately                      |
| Missing chapter has no books exit          | Local server boundary links to the catalogue      | Recovery works before hydration and exposes no private book details |

Status: implementation and hosted verification in progress. This slice does not
establish live scene-generation quality, customer adoption, book publication,
commercial viability or completion of the full founder programme.

## Hosted failure and initial-document recovery

At source `7ea7950537ee533e74b614f17e9a3a8dab40009d`, draft CI
38131064194 passes build, types and lint. Ready-PR CI38131483233 builds successfully
but its real JavaScript-disabled browser fails on the first chapter: HTTP 200,
no visible article. Artifact11699371830 binds source7ea to built mergea49c5f984
and retains the failure. No promotion occurred. The direct Markdown import alone
does not satisfy acceptance.

The chapter route forces dynamic rendering beneath three inherited loading
boundaries. Public manuscripts and their fail-closed visibility manifests live
in the immutable deployment content tree; this route has no customer-dependent
data. Render each public chapter as a complete static document on its first
request. Retain the existing loading UI for client navigation, the existing
server public gate and `notFound()` recovery, and avoid a full-book build-time
fanout or changes to global loading boundaries. A manuscript/visibility change
requires a new deployment, as the bundled source already does. Supabase project
and private author routes are outside this change.

The renewed browser proof also records article text/hidden-ancestor observations
and captures the first page before asserting visible prose, so a failed initial
document retains useful evidence. The new rendering policy requires renewed
exact-source review and hosted execution; source inspection is not a pass.

Primary reference: [Next.js static paths at runtime](https://nextjs.org/docs/app/api-reference/functions/generate-static-params).

The next actual hosted run38132364804 at source1ccb6368 still fails the visible
article assertion. Its retained artifact11699717656 contains 8,722 article text
characters under a hidden ancestor and a screenshot of the loading boundary.
This confirms the Markdown renders on the server; first-request static generation
alone still leaves its content dependent on the inline streaming script. No
promotion occurred. Earlier source reasoning did not establish visible reading.

At source661ce591, the repair enumerates all known public chapter paths at build time using the
existing `BOOK_META`, fail-closed `isBookPublic()` and `getChapterFiles()` policy.
This is a larger build-time alternative justified by the real visibility failure.
Unknown paths retain runtime `notFound()` recovery and its visibility gate; no
dynamicParams denial, manifest grant, story rewrite or private route is introduced.
Retain the previous failures and renew final-source review and hosted checks.

Before the next source freeze, accepted main advances to
`46b77c58d5dd4bf1423fd8e45e7d1591ac016e82` through peer PR579. Its five world-editor,
footer and verification files are integrated without conflicts; every incoming
blob equals accepted main. Renewed review uses this accepted base and still has
only the same five reader delta paths at that revision. The runtime remains checked-in Node24 and
pinned pnpm11.28.4, as explicitly selected by Frank. Main integration preserves
the peer's work and does not establish acceptance of this reader repair.

## Acceptance correction after the third hosted failure

CI38133606832 at source661ce591 builds 121 public chapter paths, but its first
JavaScript-disabled chapter still has 8,722 text characters beneath a hidden
streaming boundary. Artifact11699844620 binds the failed browser to built merge
1688019e21a875696b4729db47335950c0789387. No promotion occurred. All three failed
no-script receipts remain evidence; the later acceptance must not label them
successful or claim full no-script reading.

React's documented streaming protocol sends an inline reveal script before the
application loads or hydrates. The consequential repair is readable server prose
when the application's JavaScript cannot load. The revised verifier denies every
`/_next/static/*.js` request, records actual denied requests, asserts visible real
prose and opacity, and follows native recovery links. The inline reveal script
remains enabled. Existing fully hydrated controls still need their separate
desktop/mobile/reduced-motion checks. This explicitly narrows the earlier
no-script acceptance; complete JavaScript-disabled support remains open.

The chapter page is restored byte-for-byte to accepted main46b77. Failed static
mode and build-time enumeration add no value to this repair. The final delta has
four files; no loading boundary, global proxy, framework internals or auth policy
is changed. The source-extracted immutable-Git path probe counted 121 paths in
20 public books and no duplicates. Its two failed native harness attempts and
scoped pass are retained; it does not prove Next or production acceptance.

Primary reference: [React's streaming HTML protocol](https://react.dev/reference/react-dom/server/renderToReadableStream).

Final-source review and the revised hosted browser gate are still pending.
