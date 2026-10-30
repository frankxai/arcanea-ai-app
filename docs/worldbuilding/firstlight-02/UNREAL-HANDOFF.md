# The Severed Crossing — production handoff

Status: proposed extension to the Firstlight / Lantern Crossing vertical-slice plan. No Unreal project, rigged character, generated video or console build is included in this delivery. The browser trial is a local scripted simulation.

The next production result is one 75-second playable sequence with Orra, Kethr and Pelora. A player discovers a cut thread, repairs a joint handoff and earns passage into a sheltered tideway. Warmth provides the reason to return. The opponent supplies pressure; ordinary companions do not acquire horror features to signal power.

## Shot and play contract

| Time    | Player action                              | Visible consequence                                                    | Required evidence                                              |
| ------- | ------------------------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| 0–12 s  | Approach Orra at a wind-cut pass           | Woven copper ears and one broken thread read in silhouette             | Approved Orra identity sheet; third-person scale test          |
| 12–28 s | Follow Seli's warning to the torn lantern  | A source mark visibly differs from its return socket                   | Authored interactable with a reproducible fault state          |
| 28–46 s | Hold the crossing while Orra reconnects it | Kethr interrupts the route once; both roles are necessary              | Input replay proves neither role alone completes the encounter |
| 46–62 s | Carry the repaired signal to Velis         | The verifier tests it; a false source fails visibly                    | Positive and negative evidence fixtures                        |
| 62–75 s | Step into Pelora's sheltered tideway       | The environment relaxes; the same completed signal remains inspectable | Restored state, source receipt and recovery test               |

This sequence extends the existing Firstlight plan; it does not imply approval to replace earlier companions or accepted lore.

## Asset package before engine work

The new image batch provides identity and mood references. A character artist must author and inspect the actual production mesh. Image-to-3D output remains a draft until topology, scale, deformation and material checks pass.

For each character retain the entity ID, concept version, exact source asset hashes, canon state and review decision. Supply front, side and rear orthographic views in neutral light; a readable silhouette; detail callouts for joints, surfaces and the object the character refuses to surrender. Do not resolve conflicting views by averaging away a distinctive feature.

Orra needs an authored quadruped rig, woven ear secondary motion, jaw/eye controls and locomotion, listen, bind, repair and recover clips. Kethr needs an armored humanoid rig, readable anticipation, a single non-graphic interrupt and a recoverable retreat. Pelora begins as a distant cinematic guardian with authored head/neck/fin motion; a fully simulated habitat is outside this slice.

Web exports use inspected GLB/glTF assets when that downstream surface is admitted; Unreal source remains in the project’s adopted DCC/import format with documented units, pivots and skeleton naming. Identity masters are never inferred from filenames alone.

## Engine structure

Pin the installed project’s supported Unreal version before production. The documentation retrieved on 30 October 2026 currently presents 5.8; that observation is not an instruction to upgrade an existing project.

Use an authored encounter state machine for discover → interrupt → repair → review → passage. StateTree supports hierarchical states, tasks and transitions; it is a candidate for that authored behavior, not a mandate to add a third-party behavior plugin. [Epic: StateTree overview](https://dev.epicgames.com/documentation/unreal-engine/overview-of-state-tree-in-unreal-engine)

Gameplay Abilities are a candidate for bounded interaction costs, activation conditions and cancellation. Every ability must terminate on success, failure and interruption. [Epic: Gameplay Abilities](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-abilities-in-unreal-engine)

PCG is limited here to habitat dressing around a hand-authored traversal route. It does not generate the encounter logic or decide where a player can safely stand. [Epic: PCG framework](https://dev.epicgames.com/documentation/unreal-engine/procedural-content-generation-framework-in-unreal-engine)

Use Sequencer for the final reveal after the encounter state is committed. The gameplay state controls whether the sequence can begin; finishing a cinematic never awards evidence acceptance. [Epic: Sequencer overview](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-sequencer-movie-tool-overview?lang=en-US)

These are proposed production choices grounded in current primary documentation. None is implemented in the browser trial.

## Image-to-video direction cards

Use the approved hero image as the identity reference. These prompts are prepared, not executed. Estimate provider cost and obtain a bounded generation envelope before a paid video batch. Keep generated labels out of the footage; add factual text as editable overlays after review.

1. **Orra / 6 seconds.** Low camera beside a fox-sized threadkeeper on a wind-cut stone pass. Preserve the exact copper woven ear silhouette, coat pattern and body proportions from the reference. One frayed thread catches on a paw. Orra gently pulls it free, looks toward the off-screen expedition, then anchors the thread. Small ear and fur motion, grounded paw contact, morning side light. One continuous restrained dolly; no new anatomy, costume, camera cuts or dialogue.
2. **Kethr / 5 seconds.** Preserve the armored opponent's reference silhouette, weapon count and scale. The severed standard drags across a limestone bridge. Kethr takes one deliberate blocking step, stops, and opens a visible escape route on the far side. Cloth weight and metal inertia read clearly. Frightening composure without gore or frantic motion. Low fixed camera, dust in side light; no morphing or duplicated limbs.
3. **Velis / 6 seconds.** Preserve the archivist’s reference identity, clothing and prop. The assembled signal is beautiful but one source mark is wrong. Velis rotates it once, points to the mismatch, and returns it to the team without anger. Readable hand-object contact and eye line; no invented lettering or interface graphics. Quiet medium shot with warm practical light.
4. **Pelora / 8 seconds.** Preserve the colossal seahorse guardian and its habitat from the approved reference. A tiny boat enters the protected tideway beneath its curled body. Pelora tilts its head and the water settles into sheltered ripples; plants bend with the movement. Scale remains legible through boat, people and architecture. Slow wide crane reveal, dawn haze, no sudden camera flight, added limbs or collapsing habitat.

## Release gate

Name a target machine before claiming performance. Proposed desktop target: stable 60 fps at 1080p on the chosen test configuration, with recorded frame-time captures, memory peak and shader compilation behavior. Set mobile and console targets only after separate scope and hardware verification; no PS5-quality claim follows from concept art.

The slice passes only when an unfamiliar player can identify the next action, both cooperative roles matter, the wrong signal is rejected, interrupted interaction recovers without double cost, input replay reaches the same acceptance state, and loading a checkpoint cannot bypass independent review. Capture 375/768/1440 browser evidence for the web companion surface, plus engine playthrough and profiler captures for Unreal.

Take down or roll back a rendition by immutable asset/version ID. Keep its provenance and rejection history. The production runtime remains separate from fictional abilities, and no game action grants a tool capability.
