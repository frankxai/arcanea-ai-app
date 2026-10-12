# Public reader entry repair

Scope: make the public catalog choose a real reader chapter from the correct
content directory, using the same file policy and chapter ID as the reader.
User job: begin an already-public story from its catalog card without knowing
its source layout. Owner: Codex, program #276; reader proof #280, merge/release
contracts #408/#427. Base: e863be8304fdde9f00ba812d7845d66ec52787b9.
Branch: agent/codex/arcanea-reader-entry-20261001, reusing the clean owned
source-consolidation worktree. Consolidation draft #487 and its branch are
retained, with no source-fold changes in this repair.
Files: saga loader/chapter-files, chapter-files and series-entry tests, both
book/chapter readers' shared ID calls, CI test step and this task record.
Non-goals: manuscript/canon changes, publication allowlists/visibility, new
compiler, navigation redesign, pricing, deployment or selecting ARC-REL-001.
Budget: small local tests and text edits; no install, new worktree, server,
media or fanout. Browser-QA admission HOLD (6,349 MB free; 8,192 required).
Acceptance: author notes/bibles/outlines do not win the entry link; three
nested works read chapters/; numbered filenames use the reader's existing
ID transformation; real prologues remain eligible; empty directories have
no read CTA. Counts exclude frontmatter and rejected non-chapter files.
Verify with isolated filesystem fixtures, existing chapter-file tests,
metadata formatting, enabled secrets and exact-head CI. Separate provider
review before release; source/HTTP evidence is not rendered interaction QA.
Rollback: revert this scoped code/test change without editing source stories
or publication gates. Stop at a reviewable draft, with no production action.

Production observed through Vercel: dpl_GG8FqkkKrfTEmBiW8zZVP6EXRBuS,
READY production, Git SHA e863be8304fdde9f00ba812d7845d66ec52787b9,
aliases include arcanea.ai and www.arcanea.ai. Direct public GETs on October 1
confirmed the catalog advertises AUTHORS_NOTE for Forge of Ruin, Heart of
Pyrathis and Tides of Silence, and 01-subject-7 for Song of Van Linh. The
former directory choices and the latter unnormalized ID produce Chapter Not
Found/noindex responses despite streaming HTTP 200. Correct IDs already
render chapter headings at /prologue, /the-cold-season, /the-gyres-hymn and
/subject-7. Publication manifests already mark these works public; no new
visibility decision is made. Raw HTTP hashes/headers and observation times
remain in the private review packet. No rendered, login, export, checkout,
reader-completion or community/revenue proof follows these observations.

Local verification: seven isolated filesystem regressions failed against
the base loader and all seven passed after this repair. The existing five
chapter-policy checks passed before; all six passed after adding ID cases.
Node 22.23.2 ran snapshots transformed with already-installed Sucrase 3.35.1
(TypeScript erasure and CommonJS imports only). Source and output hashes,
stdout, stderr and exit codes are retained in the private review packet.
Local tsx cannot start because its Windows esbuild binary is absent; the
TypeScript 5.9.3 package directory also lacks the compiler. No dependencies
were installed. These checks establish runtime fixture behavior, without
claiming local typechecking or native tsx verification. CI explicitly runs
both suites with frozen-lockfile dependencies and the four required checks.
Implementation keeps numbered saga API chapter slugs. Document loading,
publication manifests, default-deny API registry and manuscripts are unchanged.
Different-harness sign-off and rendered browser verification remain pending.

## Support-file review correction

Independent Claude Sonnet 4.6 HIGH source review at
60fcf333b4f178de0f255b5d8edb057a5ede6d25 returned PASS with a WARN:
bare BIBLE.md inside chapters was still eligible. This correction reserves
only the exact BIBLE and OUTLINE basenames, case-insensitively. Numbered
01-bible.md and 01-outline.md remain eligible; HTML ID casing and numbered
API slugs retain their contracts. Manuscripts and publication gates are unchanged.

Expanded nested/flat/saga fixtures reproduced six of seven series failures
and one of six policy failures before the two-basename fix. All seven series
and six policy checks pass after formatting, using the same existing
Node 22.23.2/Sucrase 3.35.1 runtime method. No install or local typecheck.
Exact-head CI and independent delta review are required for this changed
source; the earlier review does not sign off these new bytes. Rendered
preview QA remains blocked by preview authentication and browser admission.
Draft #490 remains unmerged under #408; this is no release approval.

## October 3: featured links and built-browser journey

Scope: close two remaining featured-passage entry failures and verify the actual existing public reader through built Next/Chromium, on this same owned branch/draft490. Base768066b53996aec1379a316f9a9e28fae32dce4f. Four files: books-data.ts, verify-reader-entry-browser.cjs, existing ci.yml and this record. Same276/280/408/427 owners. The catalog repair alone is the serious alternative; it leaves two static Van Linh featured links with unsupported numeric prefixes.

The two hrefs now use the reader's supported IDs. No passage, source manuscript, visibility/publication registry or styling is edited; whole-file formatting required by changed-file CI can alter layout/quotes. The added bounded Build step runs for this draft too: four catalog entries and six featured links in desktop,375px touch and reduced motion; keyboard entry on desktop/reduced motion, article bounds/content, next/previous/reload, invalid chapter refusal/noindex and browser-back recovery. JSON evidence binds actual built Git commit and PR source head; it is rendered functional proof, without a screenshot/visual-approval, full accessibility or reader-completion claim. No mock manuscripts or model calls. Existing gallery checks retain their conditions.

Fresh local browser admission HOLD:5,723MB free against8,192 required,CPU84%,38 task runtimes. No local browser/build/install/new worktree started. Vercel identifies latest490 deployment FPjeCQ as CANCELED at768066b5, so its preview is not accepted proof. Native cloud Chromium uses the repository's pinned Playwright1.63.0, existing frozen dependency install and built web output. Current official locator/library guidance inspected; no package-manager or check disabled. Missing capability-loading guide on local config and origin/main is recorded, not fabricated.

Acceptance: actual journeys pass on exact candidate; original publication/manuscript/canon blobs unchanged; recovery and content evidence saved on failure/success; independent final-source review and human release pending. Syntax/formatter/secret checks and native CI outcomes go in490/280. Retain initial native failures if encountered. Existing13 fixture tests remain. Stop at a verified reviewable reader candidate; broad Arcanea repo/bundle/plugin/MCP/live/community/revenue outcome stays open. Rollback: scoped revert of these four files, preserving the original catalog repair. No merge/publication/deploy permission inferred. Policy loading is distinct from runtime enforcement.
