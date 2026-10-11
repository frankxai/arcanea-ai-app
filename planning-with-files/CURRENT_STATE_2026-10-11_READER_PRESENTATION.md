# Reader presentation, 11 October 2026

Scope: let a reader reach the first paragraph without repeated book/chapter metadata. This is a craft slice of creator programme #276, not completion of the premium creator, paid storage/API/credits or client/harness programme.

Owner: codex:01a123df-58c6-72f3-b86c-65083426cf65, existing exclusively claimed Foundation worktree, branch agent/codex/project-document-recovery-20261011. The previous document slice PR590 is merged and its original pushed revision and evidence remain preserved. The installed guard refused a different branch in this reserved checkout. Supported same-owner/same-branch adoption admits this new explicit scope; no lease or guard was edited manually.

Base: accepted main eeba317030e2b4b268d77f756c400e39ac917db9, normally integrated at b969d2353accae4b0b0c926ae7e06ffb14cfb447 with seven incoming accepted sources preserved exactly. New private-retention PR580 has since merged separately; its final production and customer gates are separate from this reader change.

Files: chapter-reader.tsx; new lib/content/reader-presentation.ts; new scripts/tests/reader-presentation.test.cjs; existing reader browser verifier, CI and bounded independent-review packet; this record. No authored manuscript, canon, published route or storage configuration changes.

User job: open an existing chapter, read its first paragraph, navigate meaningful sections, and select original prose for scene creation. Repeated opening metadata currently pushes prose down the desktop and 375px initial render. Actual c38ebdb3 reader captures establish this visual problem; functional reader tests previously passed without detecting it.

| Before                                                                              | After                                                                                            | Why                                                            |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| UI chapter heading followed by manuscript book heading and repeated chapter heading | One UI chapter heading; only matching opening H1/H2 metadata omitted from the displayed Markdown | Reach the prose sooner while keeping later section headings    |
| TOC includes opening headings duplicated by the header                              | TOC reads the same display projection as the prose                                               | Avoid an extra entry for metadata removed from the reader      |
| Original manuscript supplies scene creation                                         | Original manuscript continues to supply scene creation                                           | Preserve source identity, selected passages and source offsets |

Alternative: rewriting manuscript files would alter authored source and downstream selection/export. A bounded display projection preserves the original bytes and requires no migration or new dependency. No competitive advantage or market demand is claimed.

Acceptance: reproduce duplicate headings with actual ChapterReader/ChatMarkdown rendering before the fix; matching metadata removed once only at the opening; nonmatching headings, later repeated titles, code, quotations, Unicode and CRLF preserved; meaningful prose preserved exactly; SceneVisualizer receives the entire original source. Verify actual existing book journeys before hydration and after hydration in desktop/mobile/reduced-motion remote CI, with exact source hashes and capture companions. Inspect resulting desktop/mobile renders. Build/typecheck/lint and independent exact-revision review must pass before release.

Verification: small native Node tests are allowed under machine HOLD. No local full build/browser, new agents, dependencies or worktrees are started. Existing remote CI/reviewer authority stays bounded to its admitted owner/repository/branch/manual event. Preserve existing document, security, SQL and reader recovery gates. A synthetic rendering test cannot prove customer usefulness or full accessibility.

Non-goals: global typography, toolbar/preferences, full TOC anchor repair, public landing redesign, lore approval, new image/video generation, private production provisioning or financial activation. Source inspection reveals broader existing craft issues; this slice does not certify them.

Rollback: revert the bounded reader projection and its import/call sites through a reviewed PR; raw manuscripts and scene source remain untouched. Retain failing evidence and review receipts. Stop before release on regression, ownership change, source mismatch or a blocking independent finding.

Guidance: root AGENTS.md, shared product outcome policy, unchanged .arcanea/CLAUDE.md and MASTER_PLAN.md, TASTE.md and DESIGN.md explicitly inspected in this session; Emil design engineering selected/read and applied to the review table. Higher-priority founder Higgsfield ban and TASTE restraint govern conflicts in the older DESIGN.md. No image generation, assets, raw visual constants or motion is added. Explicit guide reads do not reload native startup or establish universal runtime enforcement.

Current local evidence: actual duplicate-title regression fails before the fix (2 titles versus 1); its two preservation controls pass. The repaired reader passes all 10 native tests, including all four actual entry manuscripts and the existing chapter-title loader. Numbered chapter prefixes were added after inspecting the real Heart/Tides/Song openings; a strict plain-title-only repair would have left their duplicates. The actual unchanged scene source is asserted for every entry. Syntax checks and unchanged independent-review admission test pass. Hosted build/types/lint/browser and independent review remain pending at the eventual committed revision. Original harness namespace and escaped-apostrophe assertion failures are retained as test-harness failures, not product regressions.
