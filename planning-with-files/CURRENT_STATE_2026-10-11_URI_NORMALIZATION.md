# Frozen URI dependency normalization

Owner: Codex thread `01a127b9-5a4e-7b83-ae44-ddc8e8a6a8cb`.
Origin: `https://github.com/frankxai/arcanea-ai-app.git`.
Branch: `agent/codex/uri-normalization-20261011`.
Base: `194f102e3d609ce17e52b8999a702bf76734fcd7`.
Initial reviewed candidate: `eacb8f6a6ef9b3c9d1c5cb21a3a41e6889982d47` on `a561c3e2`.
Issue: [592](https://github.com/frankxai/arcanea-ai-app/issues/592).
Related: programme #276 and Dependabot #67.

User job: keep URI interpretation consistent in the frozen creative-workspace
dependency graph. AJV 8.20.0 currently resolves fast-uri 3.1.7; the accepted override
also pins that vulnerable version. The upstream
[advisory](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj) identifies an inconsistent
host case after percent decoding. Version 3.1.8 fixes the affected 3.x line.
Application exploitability is unproven; this change repairs the actual dependency
behavior without a major upgrade or a claim of new product/customer acceptance.

Before implementation, the exact registry 3.1.7 package was downloaded and its
SHA512 SRI matched the frozen lock. Both 3.1.7 and 3.1.8 archives also matched registry
SHA1/SRI; bounded safe extraction retained all 44 file identities per version.
Neither package has runtime dependencies. The sole runtime-source difference is
the upstream index.js host-normalization correction. No lifecycle install ran.

The same actual six-test Node 24.16.0 script fails two methods against 3.1.7 and
passes all six against 3.1.8. It covers scheme-relative encoded uppercase hosts,
handlers that skip path normalization, nested/reserved escapes, case-sensitive
userinfo/path/query, IP and relative URI meanings, and encoded path separators
and dot segments. These are dependency behavior regressions, not a model benchmark,
an actual network request, or proof of an application allowlist exploit.

Scope: root workspace override, root lockfile, one executable regression test,
one focused hosted workflow and this pickup. The override is limited to affected
3.x versions and pins 3.1.8. The lock change updates that override, package/SRI,
snapshot identity and AJV reference. A complete parsed before/after comparison
proves every other lock field, including all importers, unchanged. Registry SRI is
checked against actual downloaded bytes. This is an explicit scoped lock update;
local PNPM regeneration or frozen installation is not claimed.

The focused workflow uses the repository's Node file and PNPM 11.28.4. It performs
an actual frozen install with lifecycle scripts suppressed for the pure-JavaScript
test, resolves the installed dependency from PNPM's hidden hoist directory, runs
the six behaviors and refuses dependency-input mutation. Required application CI
still performs its ordinary frozen install, build, types, lint and browser gates.
All three action commits were resolved from their official GitHub tags. The
existing security, permission and package-manager contracts remain enabled.

At 17:53 UTC local build preflight was HOLD: 4143 MB free against 8192 required.
Ordinary editing and small sequential tests remain permitted. No local workspace
install/build/browser, new agent, peer process stop, credential/provider request
or machine-setting change occurs. Private v8 and locked canon are unchanged.

Acceptance: installed-graph regressions and unchanged frozen inputs; exact-source
independent review; required build/types/lint/security; normal protected merge;
all applicable receiving checks; stable-domain source binding; actual Dependabot #67
resolution after ingestion; existing issue and hub handover. These hosted,
independent, merge and production gates are pending at this record's revision.
Rollback is a reviewed revert of these five files, preserving red/green evidence
and the known dependency risk. No alert is manually dismissed.

The other eleven dependency alerts remain open and require their own compatible
fix or reachability/remediation work. Atlas's separate lockfile has three high
alerts, including a cache library with no published patch in the reviewed advisory.
Tiptap's 2.x transitive chain through Novel needs compatible remediation; do not
force a 3.x core underneath 2.x extensions. No other dependency or lockfile is changed.
Human manuscript/canon/rights/publication, v8 print/device, funded creative evals,
model promotion and tenant/subscription/customer acceptance remain open.

Root AGENTS 36b534b6, shared intelligence 83ea5b28 and master plan 5c9b74df were
explicitly read in this conversation and rechecked for this lane. Routing and
separate active-peer ownership checks passed; no deeper instruction file was
found for the five paths. Hashes record sources, not native instruction reload
or universal runtime enforcement. Private provenance and red/green receipts stay
under `.starlight/evidence/arcanea-manuscript-selection-20261011/uri-normalization-candidate/`.

Accepted PR590 advanced main during this slice. A normal integration preserves
all six peer source files byte-for-byte from accepted 194f102e; no peer checkout
or in-flight edit is touched. The original eacb8f6a review and passing six-method
frozen-install run remain at their own source. Independent review and required
CI must run again for this combined revision; old acceptance is not transferred.
