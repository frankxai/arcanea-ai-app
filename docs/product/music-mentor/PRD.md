# Arcanea Music Mentor — flagship PRD (proposal)

Status: draft; no production authorization. Owner: Arcanea Academy. Date: 2026-11-01.

## Decision
Deliver one complete instrument mastery loop, starting with **piano**, not an avatar catalog or generic DAW. User selects a beginner motif exercise, hears a reference, records or uploads 20–60 seconds of playing, receives timestamped evidence-based feedback, retries, and sees measured improvement. The experience must work without knowledge of Arcanea lore.

## User journey
Discover /academy/music -> choose Piano -> choose beginner motif -> see reference and score -> grant mic permission or upload recording -> inspect analysis and confidence -> practice one corrective drill -> record second attempt -> compare -> save progress and optionally share an explicitly approved showcase item.

## Functional requirements
- Instrument-first onboarding; beginner piano initial slice, extensible instrument taxonomy.
- Consent-first audio capture and deletion; clear private-by-default projects.
- Reference MIDI/score with versioned exercise IDs; practice attempt and analysis lineage.
- Deterministic onset/rhythm comparison first; pitch feedback only when confidence supports it.
- Mentor explanations reference actual measurements; never fabricate listening or observations.
- One original Arcanea guide reconciled with existing Luminor/canon before publication; historical composers optional teaching lenses, not cloned voices.
- Accessible non-immersive UI; keyboard controls, transcripts and reduced-motion support.

## Non-goals
Full DAW, live low-latency duet, automatic grading of artistic merit, autonomous publishing, expensive video avatars, cross-instrument mastery, marketplace.

## Outcome metrics and launch gates
Activation: percentage who complete first recorded attempt; practice completion; retry rate; median upload-to-feedback latency; analysis failure rate; correction direction on second attempt; self-reported feedback usefulness. Baselines unmeasured. Pilot gates: zero cross-user data exposure, zero fabricated measurements in golden tests, correct deletion behavior, user-visible uncertainty, and explicit release approval.

## Strategic alignment
Arcanea owns learner experience, canon and Academy; GenCreator owns generalized creator tooling; Starlight owns governed intelligence primitives. Portfolio strategy and work-in-progress limits live in frankxai/agentic-ops. This PR proposes, does not supersede, any reviewed strategy.
