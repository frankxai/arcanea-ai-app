# Arcanea visual campaign — machine recovery packet

Status: resumed audit; media execution held  
Inspected through: 2026-08-25 18:47 Europe/Amsterdam  
Execution authority created: no
Goal handoff: the user resumed the prior blocked goal; this is resumed audit turn one and ACV-001 remains the exact execution boundary

## Why this exists

Round 01 cannot use Imagegen while the machine-performance gate is HOLD. This packet identifies recoverable pressure without assuming that another task, server, or pinned workspace may be stopped. It authorizes no archive, process termination, provider call, spend, or image generation.

## Earlier corrected preflight — retained for evidence lineage

This 18:09 receipt is superseded by the newer HOLD receipt in “User resume audit 2” below. It remains here so the recovery history is not silently rewritten.

Receipt: `planning-with-files/arcanea-visual-authority/round-01-preflight-corrected-storage-2026-08-25.json`  
Schema: `arcanea.machine_preflight_receipt.v2`  
Receipt SHA-256: `6f552059ac510026b30d78c5e47c3ee2b7005237bacb8d80f7a958c99d9f2966`  
Verdict: `hold`

Observed blockers:

- 6,558 MB free RAM versus the 10,240 MB overnight requirement;
- 47% CPU load, within the 60% ceiling but insufficient to offset the RAM and runtime blocks;
- 23 Codex task runtimes versus the budget of 6;
- one process currently classified as a dev server;
- projected free memory after the 6,144 MB workload reserve: 414 MB, below the separate 4,096 MB safety floor;
- 78.6 GiB free of 951.6 GiB, or 8.3%; media execution requires at least 15% free space under the machine-performance contract;
- the storage snapshot is bound to corrected plan `storage_20260825_180930_1d44dcca`, raw plan hash `658eb8907b0e099069389e5138441b7eab84e20652b9d6d36f819ad35cee39a7`, and privacy-minimized evidence hash `77cc6bb5810fdd97c9e667d8aa26f7af9a3b5e1201a69b83ded8532abb19e5a5`.

The receipt expired at 2026-08-25 18:24 Europe/Amsterdam and could not become execution authority even before expiry because performance and storage independently forced HOLD. Reaching the 15% media-admission boundary requires approximately 142.7 GiB free, about 64.1 GiB more than the captured state.

The manifest-bound readiness command was run against this receipt and correctly refused execution: `Machine preflight is held by performance or storage policy.` No grant was supplied or created.

## Storage evidence correction

The earlier quick sensor's `11 targets / 10.177 GiB` recommendation was historical, not a current recovery packet. It points to a 2026-07-12 file, while the exact-path revalidation on 2026-07-17 found **0 / 11 targets present** and declared that packet stale. The 2026-08-22 live inventory independently records the same defect. The sensor has now been hardened to check only the packet's named paths on every run. Follow-up plan `storage_20260825_181550_3e582846` reports `0/11 targets present`, `0 GiB of dated-listed logical size among present paths versus 10.177 GiB across the historical packet`, current allocated reclaim unmeasured, and no deletion-review recommendation.

The corrected 18:09 sensor measured 78.6 GiB free of 951.6 GiB, or 8.3%. That places the machine in the estate's TIGHT GiB tier and leaves about a 64.1 GiB gap to the 142.7 GiB media floor. The storage sensor's `critical` label comes from its separate percentage policy, where below 20% is critical; the estate runtime tier uses absolute GiB floors. Neither classification changes the governing result: image generation remains held below 15%.

The full correction and evidence lineage are recorded in `planning-with-files/arcanea-visual-authority/STORAGE_EVIDENCE_CORRECTION_2026-08-25.md`. The direct drive check is diagnostic only; a fresh storage sensor and v2 receipt remain mandatory before execution.

## Earlier task inventory

The inventory below is the earlier 03:05 snapshot, not a claim about current task ownership. The fresh PP plan independently measured 23 Codex task runtimes.

The Codex app returned 13 pinned tasks and the 50 most recent non-pinned tasks:

| Set               | Active | Idle | Not loaded |
| ----------------- | -----: | ---: | ---------: |
| Pinned            |      0 |    6 |          7 |
| Recent non-pinned |      2 |   31 |         17 |

The two active tasks were:

1. `Define Arcanea visual identity` — this task;
2. `$plugin-creator do we have a complete skills of all arcanea…` — separate active work.

Do not archive either active task. Do not mass-archive pinned or idle work from this campaign. The user must decide which completed tasks are safe to archive through the Codex UI so their full process trees close coherently.

## Listening-process evidence

The read-only listener check found:

| Port | Process        | Observed command                                                                                           | Ownership conclusion                                                                                                                             |
| ---: | -------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4321 | Node / Next.js | `next start -H 127.0.0.1 -p 4321` from `.hermes-worktrees/queen-mission-control-20260810/apps/observatory` | Not created by this task. Likely related to the pinned `Codex Control Center` task, but ownership is not proven. Do not stop from this campaign. |
| 5200 | Node           | Starlight Intelligence System gateway daemon                                                               | Control-plane service, not the identified Next server. Do not stop.                                                                              |

The 4321 server began on 2026-08-24 at approximately 13:58 Europe/Amsterdam. Age alone does not prove that it is abandoned. The earlier 03:05 preflight classified zero dev servers, but the fresh 18:09 PP plan classified one; the server therefore remains a current pressure signal whose ownership is still external to this campaign. No process was stopped.

## Safe recovery sequence

1. Let the separate active plugin-creator task finish, or pause it through its own task if the user chooses.
2. In the Codex UI, review the 31 idle recent tasks and archive only work the user confirms is complete. Preserve pinned tasks unless intentionally retired.
3. Open `Codex Control Center` and determine whether the Queen Mission Control server on port 4321 is still needed. Stop it only from its owning task or its documented control surface.
4. Do not reuse the stale July storage packet. Commission a fresh exact-path census with same-minute Git, process-owner, rebuild, and allocated-size evidence; then obtain named-human approval for the exact set. No deletion, move, dehydration, uninstall, or cache purge is authorized by this campaign. Reclaim enough verified space to exceed 15% with safety margin.
5. Wait until sustained CPU falls below 60%, free RAM exceeds 10,240 MB, and Codex runtimes are at or below 6.
6. Run the quick storage sensor again, then capture a new v2 preflight receipt. Do not reuse any HOLD receipt.
7. If and only if the new receipt is allowed or bounded, issue an explicit manifest-bound spend/rights grant for ACV-001–ACV-010.
8. Re-run readiness with both receipts before the first built-in Imagegen call.

## Exact resume command

```powershell
pwsh -NoProfile -File C:\Users\frank\starlight\repos\starlight-agent-config\core\tools\Invoke-StarlightStorageIntelligence.ps1 -Mode Quick
pnpm arcanea:visual:preflight -- --write planning-with-files/arcanea-visual-authority/round-01-preflight.json
pnpm arcanea:visual:readiness -- --round 1 --provider codex-imagegen --preflight <fresh-preflight> --grant <narrow-grant> --require-ready
```

The next valid media action is ACV-001 under current manifest `2f1084f77ec50413d4d6b94f5d0863c6810638a3fc65d3fad54238e881e78fdb`. Generate exactly one asset per built-in Imagegen call and persist every accepted project asset into the governed internal workspace before recording its receipt.

## User resume audit 2 — 18:44–18:47 Europe/Amsterdam

The user confirmed intent to begin creating high-quality visuals and said storage cleanup would follow. Intent did not override the machine gate, and no image-provider call was made.

Fresh corrected storage plan `storage_20260825_184433_3a9efbd5` measured 78.2 GiB free of 951.6 GiB, or 8.2%. The exact-path stale-packet check again found 0/11 historical July targets present. The present dated-listed size is 0 GiB and current allocated reclaim remains unmeasured, so the stale packet is not a cleanup authorization. The measured gap to the 15% Arcanea media floor is approximately 64.5 GiB.

Fresh receipt `planning-with-files/arcanea-visual-authority/round-01-preflight-user-resume-2-2026-08-25.json` has hash `6edd0df24ac87e96790fb28c934df6035b36a75f667bfa9bba6cceedb7fa90cf` and returned HOLD. In addition to storage, it measured 7,130 MB free RAM versus 10,240 MB required, 23 Codex task runtimes versus the budget of 6, and one dev server. It expired at 18:59 Europe/Amsterdam and must never be reused.

ACV-001 is now operationally packaged in `planning-with-files/arcanea-visual-authority/ACV-001_LAUNCH_PACKET_2026-08-25.md`. That packet binds the exact current manifest, contract, provider prompt, one-call grant shape, deterministic recorder command, binary anatomy/composition gate, and canon decision boundary. It creates no execution authority; after cleanup, the complete live sequence remains fresh storage sensor → fresh allowed/bounded v2 receipt → explicit human spend/rights grant → readiness → one built-in Imagegen call.

A follow-up storage-only sensor at 18:54 produced plan `storage_20260825_185446_37a3a2d4` and measured 77.9 GiB / 8.2% free, approximately 64.8 GiB below the 15% media floor. It again found 0/11 historical July targets present and authorized no cleanup or media action. Because storage alone still forced HOLD, no redundant PP receipt or provider call was created.

The 19:07 sensor remained closed: plan `storage_20260825_190704_c2e32d83`, 77.7 GiB / 8.2% free, approximately 65.0 GiB below the media floor, and 0/11 stale July paths present. No provider call was made.
