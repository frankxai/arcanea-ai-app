# MCP runtime integration

Scope: integrate the existing MCP runtime delivery, identity and tool registration
candidate into the current protected main. The developer's job is to connect a
real MCP host, draft a world, save it and recover it after restart, with a working
consumer package and clear local versus hosted boundaries.

Owner: Codex thread01a123df-58c6-72f3-b86c-65083426cf65, programme issue276.
Origin: https://github.com/frankxai/arcanea-ai-app.git.
Base:2ed6ae8b362689d21075aa983ecc3f438e36bcb6, already live with author556 and
authentication557 receiving CI/CodeQL and stable-production HTTP checks passed.
Lane: exclusively owned arcanea-gateway-admission-20261010 worktree,
agent/codex/mcp-runtime-integration-20261010. No foreign index or uncommitted work.

Source: PR388 head18b13983195514397e32b65c9d21837144b38f20, immutable merge base
870a4d4422122b375d8c38ecef6390ead155ed75, source task
01a086b7-f24a-7d40-98d3-f94d9f6a2ba9. Its34-file patch passed integration
preflight and was applied once with no conflicts. All source commits, the source
PR, its historical records and other owners' lanes remain intact. Original Build
36796888537 failed on gallery locator duplication; this source does not inherit
its old approval. Current main already contains the freshly verified gallery fix.

Files: the34 pinned source paths; ci.yml; review-author-recovery.mjs;
verify-mcp-installed-package.mjs; package tsconfig; this pickup. Dependency versions and lockfile
remain unchanged. The README now uses the actual Node24/pnpm11.28.4 pins, and
package repository metadata points to this canonical repository. The serious
alternative is a direct SDK client against the same tools; verify that through
real protocol initialization and installed consumer tests rather than a CLI mock.

Acceptance: strict package build, all package and HTTP/session tests, real stdio
tool discovery/save/restart/load, safe corruption retention, opaque creation
identity, bounded loopback HTTP capacity/origin/Host validation, an independently
installed packed artifact with lifecycle scripts disabled and consumer SDK
resolution outside the workspace. Full repository lint/types/build/security and
exact-head independent provider review must pass before normal protected merge.
Receiving-main checks and the stable Vercel deployment must then be verified.
Rollback: reviewed revert of this integration, preserving prior author/database
repairs and local user snapshots. Never delete user data to make a test pass.

Fresh registry inspection10October2026: npm latest remains0.7.0 and declares
@arcanea/os workspace:*. Source1.0.0 is a candidate, not an already published
working npm release. Packing, integration and Vercel READY do not prove an npm
release. Local tools use templates; agent executors return scaffolding. No paid
generation, real swarm, public HTTP authentication, canon or publishing acceptance
is established here. HTTP remains explicitly local single-user; session ids are
not authorization. No global MCP config or new provider rail is introduced.

Instructions read explicitly: root AGENTS SHA256
36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5;
base packages/CLAUDE SHA256
8626863fd8c10dee1c877f82f4258bc2b2574ffbb5ff01deff56c7c07216a3b5,
and the incoming package guide; shared WORKFLOW/CLOUD_LOCAL, product outcome,
machine and humanizer guides. No deeper AGENTS override was found for these files.
Routing/ownership checks passed separately. Official MCP transport specification
and SDK documentation were read. Loading policy is not runtime enforcement.

The release handover is hub PR238 at5326dc36c78f324ad7c47573d875c7b9689e8ecb.
Its previous tools-disabled native Grok request stopped at the4GiB memory floor
before any verdict; the owned child job was stopped. It has no passing review
from that attempt. This branch's existing manually gated Gemini rail reviews the
exact public hub commit separately and then this complete MCP source. Each mode
uses one bounded request, final text only and source hashes. No local full web
build/browser or extra swarm starts while machine admission is constrained.
Programme276, real author onboarding, creator505, billing529/511, paid/editorial
usefulness and the original broad platform objective remain open.

The incoming generator registration accepted fractional gate3.5; a direct call
against its real source reproduced a patronGuardian.name exception before the
fix. Gate/count schemas now require integers; regressions check the advertised
schema and protocol errors before another valid generation. Removed any casts
from the new registrations and use unknown for changed graph/result boundaries.
Implicit-any checking is enabled; inherited explicit-any sites outside this scope
remain a separate limitation, so this is not a claim of package-wide type cleanup.
The full changed and unchanged package source packet has a bounded1.2MiB ceiling
on this explicitly owned MCP lane; the prior author/hub ceiling stays900KB.
