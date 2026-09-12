# Arcanea visual campaign — storage evidence correction

Status: read-only correction; no storage action authorized  
Inspected: 2026-08-25 18:15 Europe/Amsterdam  
Applies to: Round 01 media admission and machine recovery guidance

## Decision

Do not use the Starlight storage sensor's repeated `11 targets / 10.177 GiB` rebuildable-output recommendation as a current reclaim estimate or deletion packet.

The recommendation points to `C:\Users\frank\.starlight\reports\machine-agent-estate\reclaim-approval-packet-2026-07-12.md`. A later exact-path revalidation at `C:\Users\frank\.starlight\storage-intelligence\rebuildable-batch-revalidation-2026-07-17.md` found **0 / 11 targets present** and explicitly invalidated the packet. `C:\Users\frank\.starlight\storage-intelligence\live-inventory-2026-08-22.json` independently lists the same packet as stale. Before the correction, the 2026-08-25 quick sensor still carried the July path and historical aggregate forward, so the figure provided **0 GiB of currently verified reclaim**.

This correction changes recovery guidance, not the media-admission verdict. The v2 Arcanea preflight independently binds the current free-space measurement and requires at least 15% free space for image generation.

## Current capacity boundary

The 18:09 Arcanea preflight binds corrected storage plan `storage_20260825_180930_1d44dcca`, which measured 78.6 GiB free of 951.6 GiB, or 8.3%. After the sensor vocabulary was tightened, follow-up plan `storage_20260825_181550_3e582846` recorded the same capacity and explicitly kept current allocated reclaim unmeasured.

At the later measurement:

- the 15% media floor is 142.74 GiB;
- there is a 64.14 GiB gap to that floor;
- the estate tier is TIGHT under the GiB floor policy (50–79 GiB), while the storage-intelligence percentage policy labels below 20% `critical`;
- the naming mismatch does not change the Arcanea result: media generation is held below 15%.

The capacity measurement is evidence, not execution authority. Only a fresh quick storage sensor plus a fresh Arcanea machine-preflight receipt can reopen the image lane.

## Sensor hardening

`C:\Users\frank\starlight\repos\starlight-agent-config\core\tools\Invoke-StarlightStorageIntelligence.ps1` now shallow-checks only the exact named packet paths. It retains the dated named count and logical size separately from the currently present path count and the dated-listed size associated with those paths, emits `stale-none-present`, `partially-stale`, or `present-needs-revalidation`, and suppresses the deletion-review recommendation unless every named path is still present. It never describes the dated-listed size as current reclaim; same-minute Git, process-owner, allocated-size, and rebuild checks remain mandatory.

The fixture at `C:\Users\frank\starlight\repos\starlight-agent-config\core\tools\tests\Invoke-StarlightStorageIntelligence.Tests.ps1` proves a partially stale packet cannot produce a deletion-review recommendation. The live corrected sensor reports `0/11 targets present`, `0 GiB of dated-listed logical size among present paths versus 10.177 GiB across the historical packet`, keeps current allocated reclaim unmeasured, and recommends a fresh evidence census instead.

## What is and is not actionable

| Candidate | Current evidence | Authority state | Arcanea action |
| --- | --- | --- | --- |
| July rebuildable packet | 0 / 11 targets present | Invalid and stale | Do not reuse |
| Current rebuildable outputs | No fresh exact-path packet | Unknown | Require a new census with same-minute Git and process checks |
| Idle Codex tasks and non-owned dev server | Historical ownership evidence only | User/owning-task decision | Close only through the owning task or UI |
| Installed applications | Historical aggregate only | Named-human, vendor-specific | Fresh per-product audit before keep/uninstall decision |
| Hibernation reserve | Historical 12.57 GiB estimate | Named-human power-policy decision | Consider only as one bounded contribution, not a complete fix |
| Package stores, AppData, agent state, OneDrive, restic | Mixed active, protected, or backup state | No cleanup authority | Never blanket-delete, dehydrate, or prune |

## Required recovery path

1. Reduce runtime pressure through the owning Codex tasks and UI; do not kill shared child processes.
2. Produce a fresh, exact, current storage census rather than inheriting the July packet.
3. For every proposed path, prove the repository boundary, tracked and untracked Git state, process ownership, rebuild route, and expected allocated—not merely logical—reclaim.
4. Obtain named-human approval for the exact set. This document is not that approval.
5. Reclaim enough verified space to exceed the 15% floor with safety margin; do not target the boundary exactly.
6. Re-run the quick storage sensor and `pp preflight --workload overnight`, then capture a new hash-bound Arcanea receipt.
7. Issue the narrow ACV-001–ACV-010 spend/rights grant only after the fresh receipt is executable.

## Integrity statement

No storage candidate or user artifact was deleted, moved, dehydrated, uninstalled, pruned, or overwritten during this audit. The only writes were the sensor code and fixture, the corrected private sensor report, and Arcanea planning/authority evidence. No task or process was stopped. No image-generation call or provider spend occurred.
