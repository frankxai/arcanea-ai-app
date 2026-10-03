# Arcanea visual campaign — 29 August recovery packet

Status: media held; deterministic campaign state verified  
Campaign: `arcanea-living-constellation-100` version `1.10.0`  
Repo commit observed: `9fc53dc0e5f75357c812837e0de9424c8c4a3861`  
Branch: `codex/arcanea-living-constellation-v1`

## Outcome

The 100-image campaign remains structurally ready, but no image call is admissible yet. The fresh storage sensor measured `118.0 GiB` free of `951.6 GiB`, or `12.4%`. Arcanea's governed media floor is `15%`, equal to `142.74 GiB`; the current minimum gap is therefore `24.74 GiB`. Cleanup should exceed the boundary with safety margin rather than target it exactly.

No image-generation request, provider spend, output asset, execution grant, or output receipt was created during this audit.

## Fresh machine evidence

- Storage plan: `storage_20260829_055649_c9a6d9a1`
- Captured: `2026-08-29T05:56:49.1862252+02:00`
- Capacity: `118.0 GiB / 951.6 GiB`, `12.4%`
- Sensor classification: `critical`
- Media decision: `HOLD` because free percentage is below `15%`
- Historical rebuildable packet: still `0 / 11` named targets present; it is not a current cleanup authorization
- Mutations performed by the sensor: none

Storage independently closes the media lane, so a PP overnight capture would only create another non-executable short-lived HOLD receipt. Run PP only after a fresh storage sensor reaches the media floor.

## Campaign integrity

Readiness reconstruction returned:

- state: `execution-awaiting-authority`
- provider profile: `codex-imagegen`
- contracted jobs: `10`
- executable jobs: `10`
- recorded jobs: `0`
- next job: `ACV-001`
- current execution manifest: `planning-with-files/arcanea-visual-campaign/execution-manifests/round-01-codex-imagegen-2f1084f77ec50413.json`
- manifest hash: `2f1084f77ec50413d4d6b94f5d0863c6810638a3fc65d3fad54238e881e78fdb`
- source contract-set hash: `be2c4504bbc0366d717658b9993021ca6f49dee6e815c6ec29b0beaf2aa41e13`
- ACV-001 prompt-contract hash: `54d45c53f641a486eab97a067892184f69f86ef4dbee81bfde75d1692bc5b803`
- ACV-001 execution-prompt hash: `58a18b1c633e739b88ebd12c94aac8c3ade969d01caf36fdb4193ac201a79bac`

The first benchmark remains five controlled visual hypotheses applied to the same two anchors: Draconis and Kael Thornfield. The order stays ACV-001 through ACV-010 so each adjacent pair compares one visual hypothesis with minimal temporal provider drift. Round 01 may select a rendering system; it cannot lock either subject's identity because there is no qualified accepted reference set.

## Eight-hour continuation

Heartbeat automation `arcanea-visual-campaign-eight-hour-round-runner` checks this task every thirty minutes through the requested eight-hour window. It may:

1. rerun the storage gate;
2. capture a fresh preflight only after storage opens;
3. reconstruct the first missing job;
4. execute one image call only when a fresh machine receipt and explicit named human spend and rights attestation both exist;
5. record that exact output before advancing;
6. freeze at ten outputs for opaque dual-critic review.

It may not reuse an expired receipt, regenerate an existing job, infer rights, issue an unreceipted call, exceed one call per grant, compile Round 02 without the Round 01 human verdict, or publish any candidate.

## Exact resume sequence

1. Reclaim enough verified space to exceed `142.74 GiB` free, preferably with a practical safety margin.
2. Rerun the Starlight quick storage sensor.
3. Capture a new timestamped `arcanea.machine_preflight_receipt.v2` using the live storage plan and PP overnight result.
4. Record explicit named human spend approval and rights/likeness attestation for the internal Arcanea benchmark.
5. Issue a one-job, one-call, zero-revision grant for `ACV-001` only.
6. Run manifest-bound readiness with `--require-ready`.
7. Submit the immutable ACV-001 execution prompt unchanged through the built-in Imagegen tool, with no image references.
8. Decode, inspect, hash, copy into governed internal storage, dry-run the recorder, and write the receipt.
9. Reconstruct readiness and repeat for the next missing job under a fresh grant.
10. After ACV-010, stop generation and start blind review; do not silently revise a weak but valid image.

## Pending human evidence

The current request explicitly asks for image generation, but the campaign contract requires a named statement for both spend and rights/likeness. Do not manufacture that attestation from project ownership or general intent. Once supplied in this task, bind it to each narrow grant.
