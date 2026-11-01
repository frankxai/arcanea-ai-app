# ADR-0001 — Evidence-first Music Mentor vertical slice

Status: proposed, pending architecture review. Date: 2026-11-01.

## Context
Existing Arcanea Academy onboarding and Luminor configuration are not yet a verified production music tutoring path. GenCreator has a browser BYOK studio agent, not a proven music DSP API. Starlight estate registry is authoritative for runtime, storage and technology decisions.

## Decision
1. Extend existing Arcanea Academy web experience at /academy/music; avoid a new subdomain or duplicate auth stack for v1.
2. Use Next.js and existing auth conventions; store learner/attempt metadata in existing approved Supabase Postgres schema after migration review; store consented media in approved Vercel Blob with private access controls and retention policy.
3. Use an asynchronous analysis job: signed upload -> persisted attempt -> queued analysis -> deterministic DSP/score alignment -> structured observations -> AI mentor explanation -> user-visible result. Never block a web request on long processing.
4. Keep measurements and AI narrative separate; narrative can cite observation IDs, cannot invent values. Version algorithms, prompts, exercise, and model routes. Apply Starlight estate-guard and reviewed provider routing.
5. Support future Gemini audio/video interpretation only behind capability-specific adapters and explicit consent; no video analysis required in v1. Historical masters are disclosed educational interpretations. Preserve student authorship, export and deletion.
6. Use a stable API contract so GenCreator may later reuse the practice analysis capability without importing Arcanea canon or duplicating storage.

## Rejected alternatives
- Standalone music.academy domain: fragments identity and discovery.
- Avatar-first MVP: high cost and weak proof of learning outcomes.
- Pure LLM assessment: unreliable for precise pitch/timing.
- Unreviewed R2 expansion: conflicts with estate registry; seek ADR if storage economics justify change.
- Immediate cross-repo implementation: contracts and privacy controls require review first.

## Risks / decisions pending
Audio pipeline library and execution runtime require current vendor documentation and benchmark; auth and storage conventions must be confirmed in app; canonical Luminor identity must be reconciled; rights/retention and youth-user handling require policy review. No deployment authorized.
