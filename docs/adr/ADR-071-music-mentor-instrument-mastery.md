# ADR-071: Arcanea Music Mentor — instrument mastery vertical slice
Status: Proposed / draft review. Date: 2026-11-01. Owner: Arcanea Academy.
## Decision
Arcanea owns the instrument-learning experience under /academy/music/mentor. Reuse existing Academy onboarding/Luminor concept (Sonara) and Arcanea web workspace; do not create a new site, canon teacher, DAW, or parallel auth. GenCreator owns general production workflows; Starlight owns portable agent orchestration, receipts, provider routing and evaluation. Cross-repo integration is contract-first and not implied implemented.
## Evidence from repository inspection
- Arcanea monorepo package.json: apps/academy, apps/web, apps/studio, core packages, Turbo tests. Existing docs/plans/ACADEMY_IMPLEMENTATION_PLAN.md specifies Login -> Choose Path -> Luminor Guide -> Progress -> Lore -> Create, Sonara music guide. Existing apps/web/app/music/music-content.tsx is a listening/catalog surface; apps/web/components/studio/music-panel.tsx is text-prompt music creation, not instrument instruction.
- GenCreator package.json: Next 16, AI SDK 7, Vitest/Playwright, Supabase; lib/tool-registry-meta.ts has audio-music category. Consume its production capabilities by explicit adapter, not database joins.
- Starlight website package.json: platform tests, run receipts, agent identity and orchestration contracts; lib/agent-specialists.ts exposes specialist naming. Its public web app is not automatically an instrument-analysis service.
## First vertical slice
Piano only; novice to early intermediate; one 4-bar public-domain or original exercise; 60-90 second single-camera recording, audio-first evaluation with optional video coaching. No real-time grading in v1. User selects skill goal and tempo, sees notation and reference MIDI, records/uploads, gets deterministic onset/pitch/timing alignment with confidence and 1-2 actionable suggestions, practices again, sees before/after evidence and can export/delete the recording. Mentor persona is Sonara (existing academy reference) pending canon review; no fabricated historical master likeness.
## Architecture
Next.js Academy page -> authenticated session -> signed direct upload to private object store -> async job + idempotency key -> media validation -> audio feature extraction -> score/MIDI alignment -> structured evidence -> model-generated explanation grounded only in evidence -> human-readable feedback and versioned practice plan -> progress ledger. Gemini video reasoning is optional, separately consented and never sole source for pitch/timing scores. AI SDK is UI/tool orchestration; provider adapters remain swappable. Do not send raw media to external AI by default. Explicit consent and provider disclosure required. Every feedback claim references an evidence span and algorithm version.
## Non-goals
Full DAW, multi-instrument coverage, automatic technique diagnosis from arbitrary camera angles, voice cloning, historical avatar reenactments, publishing to Records, clinical posture claims, opaque holistic skill scores, paid enrollment.
## Security and governance
Private-by-default media, short-lived signed URLs, tenant-scoped RLS, deletion propagation, job idempotency, bounded upload size/duration, MIME and codec verification, malware scanning, encryption, provider consent, no training on student media without opt-in. Separate creative quality from measurable performance. Source music rights and child safety reviewed before launch.
## Rollout gates
Feature-flagged pilot; no production deployment from this PR. First ship deterministic fixtures and contract tests, then internal usability study, then opt-in pilot. Owner approval for canon, privacy, licensing and retention.
## Cross-repo boundaries
Arcanea: curriculum, UX, student progress, evidence. GenCreator: optional export to creation studio with explicit user action and portable artifact contract. Starlight: async job receipts, trace IDs, model policy, evaluation and spend limits. Never grant unrestricted agent access to media or publishing.
## Alternatives rejected
Separate music-academy domain (identity fragmentation); generic LMS purchase (cannot express evidence-linked practice loop); LLM-only feedback (unreliable timing/pitch); Gemini-only app (provider lock-in); video-first analysis (expensive and imprecise for note-level grading).
