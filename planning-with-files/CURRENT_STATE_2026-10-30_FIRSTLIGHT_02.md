# Firstlight 02 product review exhibition

Scope: ten new fictional character proposals, twenty generated image assets,
public review gallery, exact prompts/provenance, a local cooperation trial.
Owner: Codex production agent. Issue: frankxai/arcanea-ai-app#697.
Base: `83bda2865a8fc3a512a8080c466780305f9cefa8`.
Branch: `agent/codex/firstlight-02-review`.

User job: form attachment to a coherent new cast, inspect the original visual
and story decisions, then learn a concrete cooperation pattern through play.
Primary studio: `studio_world_experience`.

Direction: cinematic field guide. It keeps the artwork and character choices
primary, with restrained existing product controls and optional evidence. The
other considered directions were a tactical game HUD (too much interface over
the characters) and a media warehouse (good retrieval, weak world attachment).
No new identity, font, animation library or storage service was introduced.

Authorities loaded: Registry at `f9761fe052a5fb14b26e18dd1f2200e591904082`,
`artifact_arcanean_library_fiction`, `architecture_media_fabric_v2`,
`design_arcanea`; product AGENTS/TASTE/DESIGN and Luminor Engineering Kernel;
shared Arcanea design pack at `99794fdae86db53fb8b090c66028818edd3dba66`.
Fiction source PR: <https://github.com/frankxai/arcanean-library/pull/6>.
Merged fiction source: `8c64a0aab586a0f98ab0ba4670cf378c51f5a27b` (PR #6).

Acceptance: all twenty SHA-bound display approvals and stored original/derived
objects; proposal-only metadata; exact source/projection lineage; keyboard and
responsive UI; no horizontal overflow at 375/768/1440; simulation controls and
export; build/types/lint; independent source/visual review; actual deployment
source and stable-domain verification. A READY preview alone does not pass.

Non-goals: accepted canon promotion, a transactional DAM replacement, new
database/schema, authenticated live agents, real business execution, Unreal
asset production, model/agent benchmark claims or paid sales.

Verification in progress: twenty-two focused tests pass. Initial standalone
typechecking failed because workspace packages were unbuilt; building the
existing dependency graph resolved it. Web typecheck and full lint passed.
Production build then contacted the existing public OpenRouter model catalog;
automatic approval review rejected that build poll pending payload inspection.
Offline reproduction confirmed public GET with no auth/body/project payload.
A build-phase guard now selects the existing static fallback before any supplier
fetch; its two regression tests pass. A disposable Turbopack cache from the
interrupted build was cleared; the subsequent production build passed.

That code preflight used a pending local media manifest. It is not final image
publication evidence; production release remains blocked until actual Blob
URLs, display approvals, source pins, browser and receiving gates are complete.
The approved manifest importer fails closed on missing or pending media.

Browser evidence: independent cloud review observed the current `/gallery`
and the new route's baseline 404. That cloud surface has no viewport resizing.
The pinned Playwright browser CDN returned a corrupt empty archive; a separate
pinned NPM test-browser installation is being attempted. No viewport screenshot
or performance score is claimed without the actual output.

Generated MCP `dist` files and Next route-type output changed during dependency
builds. They are unrelated generated local output and must not be included.
Only the named page, static projection, trial modules, importer/tests and this
documentation belong in the release commit.

Recovery: immutable originals and metadata survive independently from the app
deployment. Revert the bounded app slice through a reviewed PR; no schema or
production account mutation needs reversal.

Release preparation update: all twenty approved display records are imported, with forty immutable Blob objects verified by the media receipt. The gallery code build with the actual media projection passed. The cloud browser baseline observed the existing gallery and the new-route 404. Local isolated Chromium starts then exits with SIGSEGV before any page; no local viewport pass is claimed. The dedicated viewport suite is now wired into the existing hosted Build job, reusing its build and Chromium, with retained artifacts. Estate Guard reports zero critical/high findings; its low warnings in this workflow predate this change. Final receiving CI and hosted browser evidence remain required.

Receiving base: `95774748df7f302d8bb587c3815d7c4577be2356` inherited main's new opt-in preview gate. Its three changed paths do not overlap this release. The candidate explicitly requests one preview with the `[preview]` commit subject marker.
