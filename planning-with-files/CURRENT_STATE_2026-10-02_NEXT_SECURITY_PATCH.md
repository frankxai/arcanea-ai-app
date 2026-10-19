# Next.js ImageResponse security patch

## Task contract

Scope: upgrade the root development dependency, web runtime dependency and root
override from Next.js 16.3.5 to 16.3.6; update their existing lockfile references
and exact registry integrity values. Owner: Codex, [issue #503](https://github.com/frankxai/arcanea-ai-app/issues/503). Base: `b86549cd04562471a677301e5c095cd6f093919e` on main. Branch:
`agent/codex/arcanea-next-security-20261002`.

Files: `package.json`, `apps/web/package.json`, `pnpm-lock.yaml` and this record.
The existing consolidation draft #487 at `5a2b22af8a77fc3544b071e6970c9a4e314c9858`
remains on its own branch. The patch can be reviewed independently of that fold.

Acceptance: parsed lock graph changes only Next.js, its matching env/SWC packages
and references to their version; both manifests and root override agree; independent
provider review is bound to the exact diff; native CI accepts the frozen lockfile
and passes Lint, TypeScript, Build and CI Status. Final source and receipts belong
in the owning issue/PR and the existing agentic-ops-hub handover.

Rollback: revert this four-file commit through the existing reviewed-merge process.
That restores the known affected version and is not an approved production
mitigation. No deployment or data rollback is performed by this draft.

## Security evidence and limits

[GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j)
describes remote code execution when the Node.js `next/og` ImageResponse receives
attacker-controlled SVG content, attributes or styles. The upstream advisory fixes
Next.js 16.3.6 and excludes the Edge implementation and applications without such
attacker-controlled values. [The release](https://github.com/vercel/next.js/releases/tag/v16.3.6)
contains that security fix.

At preparation, the repository has 35 open Dependabot alerts. Alerts 68, 69 and 70
are this one critical advisory across the web manifest, root manifest and lockfile.
The other 32 remain outside this patch. No alert is dismissed or closed manually.

Selected source reads show the world OG route and Twitter image use Edge; the root
OG image uses Node with static source/local assets. This limited inspection does
not establish complete exploitability, the deployed dependency version or live
remediation. No exploit or production change is attempted.

## Lockfile preparation

The sparse checkout has no installed dependency tree. Under the machine's bounded
storage posture, this targeted lockfile edit uses HTTPS metadata from the official
npm registry, not a local pnpm resolver run. Twenty exact metadata records cover
ten packages at both versions. All eleven old package snapshots match the old
registry SHA-512 values before replacement; all eleven new snapshots use the new
values. The graph contains two Next.js peer variants, one env package and eight
platform SWC packages. Next.js changes only its matching env/SWC dependency pins;
the inspected engines, peer requirements and other dependencies remain equal.

Main's React 19.3.0 graph and all unrelated resolution entries are preserved.
The initial private formatter used JSON parsing for the package manifest, which
collapsed `workspaces`; native CI rejected that formatting. Using the package
manifest's `json-stringify` parser restores the original array formatting.
The existing `.prettierignore` excludes the native-format pnpm lockfile.
`eslint-config-next` is already 16.3.6. Existing security overrides remain enabled.
Actual `.nvmrc` and native CI specify Node 22, and packageManager/CI pin pnpm 8.15.0.
The pinned base AGENTS contract directs agents to those executable runtime sources.

Local verification with the existing YAML 2.9.1 parser passes for all 1,850 package
snapshots, eleven upgrades and twenty registry records. It compares the complete
parsed graph against the pinned Git base, validates exact metadata integrities and
rejects unrelated graph changes. The multilingual manifest keeps its existing
Next peer range `>=16.2.6`; its lock specifier follows the root Next override.
There are no standalone `satori` or `@vercel/og` package snapshots in this parsed
lockfile. This patch covers the Next.js-bundled `next/og` implementation only.
That name check does not establish absence of vendored code or other repositories.
Native CI's pinned `pnpm install --frozen-lockfile` is the authoritative dependency
consumer check for its Linux platform. It verifies fetched applicable artifacts;
optional binaries for other platforms are not thereby installed or exercised. This record does not claim a generated lockfile, local install or
local build. Formatting, graph checks and reviews retain failed attempts.

## Delivery and remaining work

One lead performs the patch; independent review is one serial tools-disabled
provider call per revision after fresh review admission, capped at $2 per call
and 180 seconds. No new agents, installations, worktrees, servers or media jobs.
Final CI and review results must be read from their exact-head receipts.

The upstream workaround is to prevent untrusted SVG values entering Node
ImageResponse if upgrade is unavailable. The patch selects the released fix;
selected routes do not justify a speculative runtime rewrite.

The broader Arcanea work remains open under #276 and the existing hub handover.
This patch leaves the source-consolidation and creator drafts, canon, skill
readiness, launcher ownership and licence/Heart choices unchanged. Named merges
#408, publishing #277 and source-bound release #427 retain their gates. No merge,
deployment, skill promotion, archive, rename, licence or commerce decision is made.
