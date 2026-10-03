# Arcanea Media Studio source and rights evidence

Observed October 2, 2026. Owner: [program #276](https://github.com/frankxai/arcanea-ai-app/issues/276). This is an evidence and integration recommendation, not a legal ruling; component rights and release acceptance remain pending.

## What changed in the evidence

The fork note in `arcanea-studio` says upstream has no licence and asks for privacy until clarification. Its NOTICE says the component package declares MIT, but the root had no licence at forking. These statements mix a historical observation and a current condition. At recorded fork `6f9cdeeb47b42b833c5be2d181fd5dc95abaa09a`, the root has no `LICENSE` entry and `packages/studio/package.json` declares MIT. Both facts are retained. The fork root was also checked for case-insensitive LICENSE/LICENCE/COPYING prefixes and exact COPYRIGHT/NOTICE filenames; no matches were found. This is a root filename check, not a complete terms scan.

A pinned upstream commit records addition of a [root MIT licence](https://github.com/Anil-Matcha/Open-Generative-AI/commit/1ff3667581047989d21c06871ffb236c0b2ba8a1) on June 12, 2026 (committer timestamp, UTC; the commit API marks LICENSE as added). At observed current `ebebc51eb3740641458a4a11ce03f390e7a58af1`, [LICENSE](https://github.com/Anil-Matcha/Open-Generative-AI/blob/ebebc51eb3740641458a4a11ce03f390e7a58af1/LICENSE) has the same Git blob as that first observed licence tree: `84757c5a0a50431775311bfe496c780d67e87baf`; SHA256 `17cd23239df0ac94d279e0d4da4f2a34148346f9af3407b085b15772673522b6`. Its copyright line names **Open Generative AI Contributors, 2026**. The old note is evidence of the fork's state; it cannot support the assertion that current upstream has no root licence.

This does not establish retroactive authorization, applicability to every imported file or third-party asset, or clearance for Arcanea redistribution. The [GitHub licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) distinguishes a public repository from permission to use, modify and distribute its contents. Package licence metadata and broad open-source descriptions need reconciliation with the actual imported component and notices.

## Exact source comparison

Local Studio source: `edaf7affce77d82411063b8551b6e631b2f5dc12`, 101 tracked files. Comparison uses raw committed Git identities and recursive upstream trees at the fork, the first observed root licence commit and current upstream. All three API trees report `truncated:false`. This is tree-level identity comparison only: the fork notes describe a fresh Git initialization, so shared commit ancestry is not established. No checkout, clone, binary download or code invocation was needed.

| Mechanical comparison class                                          | Files |
| -------------------------------------------------------------------- | ----: |
| Exact same-path blob in both observed root-licensed trees            |    38 |
| Unchanged fork bytes, no exact same-path match in those two trees    |    34 |
| Changed fork-path bytes, no exact same-path match in those two trees |     8 |
| No same-path fork entry; provenance needs separate classification    |    21 |
| Total                                                                |   101 |

The 38 matches include all 26 selected `.webp`, `.mp4`, `.png` and `.svg` assets. This is byte lineage evidence, not clearance for generated artwork, logos, footage or model outputs. Other embedded/reference assets were not comprehensively scanned. Template SVG marks, upstream branding and potential generated/provider demo outputs need asset/trademark review. `app/page.js` also matches upstream `app/assistant/page.js`; this cross-path duplicate adds no file to the 38 count.

The 34 and 8 classes are not declarations that those files are unlicensed. File modification, component scope and historical permission need review; a byte mismatch does not establish absence of rights. The 21 class includes Arcanea documentation, notices, router files, lockfiles and saved patches. A new path alone does not prove original authorship.

The [complete 101-file record](arcanea-media-rights-evidence-2026-10-02.json) includes all compared Git blob IDs and flags. Local LICENSE SHA256 is `99b301ba83ead919aa4538eb6e981e5a64dc1d066be3d53b0d5e26b7da7fde2f`; NOTICE SHA256 is `130a8f0dd2d615a8a4f94a52f494e816f39b5cb9a5368044c9e435f02ac1d222`. The local notice credits Anil Matcha, 2025 and relies on component metadata; the current upstream notice names contributors, 2026. Preserve both historical credit and the applicable upstream notice in any eventual reviewed attribution change. No notice or licence is replaced by this slice. The local LICENSE presents Arcanea copyright over software that includes upstream-derived paths; reconcile copyright and permission scope in the later owner-reviewed notice change.

## Recommended media boundary

Keep the existing Studio work and media owner intact. The intended creator job is to turn a scene into editable media while preserving source, credits, cost and durable output. Customer demand and usefulness for this workflow are unverified. The app remains the one public Arcanea integration source; official canon stays there. Media rendering should consume a reviewed world/scene contract and return proposals and provenance through the existing owner.

Compare two serious implementation options before choosing: retain the historical fork with explicit component/asset review and a measured maintenance burden, or keep a bounded Arcanea adapter to a pinned reviewed current upstream implementation or app media service whose accepted status is unverified. Reduced model-catalogue maintenance is a hypothesis to measure. Both options require the same applicability, notice, asset and provider review; compatibility, authentication, editing/export and interrupted-job recovery still need actual verification. The newer licence is evidence to revisit the hold; it does not select or authorize either integration. No new repo is proposed.

The proposed next preparation is a component and hunk lineage review: identify which of the 34 unchanged and 8 modified paths belong to the MIT-declared component, trace the 21 new-path records, reconcile the exact upstream copyright/permission notice, and classify asset/provider terms. The user goal authorizes audit and reversible draft preparation. Prepare a reviewable patch; owner approval applies before integration or any rights/visibility side effect. The dependency/redistribution hold remains in place. Human release receipts, exact-source checks and independent review must precede app dependency, distribution, hosted integration or Electron release. Preserve #277, #408 and #427.

## Scope and retained gaps

Studio is already public at observation despite its old privacy instruction; this slice changes no repository visibility. Its `docs/UPSTREAM-SYNC.md` says the upstream remote is configured, but local `git remote -v` showed only origin. Sync recipes and selective imports therefore require fresh identity and owner validation. No upstream remote is added, and the old direct-main merge recipe is not execution authority. The current release index returned zero entries (limit100); prior/deleted releases, external binaries and distribution history remain unaudited. Classification of tracked saved patches, .agent-harness.json and local-path documents as public or operator material remains an owner-decision gap. No visibility or file-removal change is recommended from this audit.

Only four app documentation records change. App code, candidates (five, zero ready), locked canon, manuscripts, media bytes, the Studio checkout, dependencies and notices remain untouched. Source comparison is recorded; application CI and independent review must bind the resulting app commit. This is progress on the media source decision, not a working media product, customer acceptance, clearance or revenue result. Full objective remains active. Private raw API responses, local source inputs and receipt hashes are retained with the task evidence.
