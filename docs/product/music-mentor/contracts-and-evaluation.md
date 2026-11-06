# Music Mentor — API contracts and evaluation plan

Status: draft; illustrative TypeScript contract, not a shipped API.

```ts
type Instrument = 'piano';
type AttemptStatus = 'created' | 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed' | 'deleted';
type PracticeAttempt = {
  id: string; learnerId: string; exerciseId: string; exerciseVersion: string;
  instrument: Instrument; status: AttemptStatus; consentVersion: string;
  mediaAssetId?: string; createdAt: string; retentionUntil?: string;
};
type Observation = {
  id: string; attemptId: string; algorithm: string; algorithmVersion: string;
  kind: 'onset_offset_ms' | 'tempo_variance' | 'note_match' | 'signal_quality';
  value: number | null; unit: 'ms' | 'bpm' | 'ratio' | 'none';
  confidence: number; referenceSpanMs?: [number, number];
  evidenceSpanMs?: [number, number]; abstained?: boolean;
};
type MentorFeedback = {
  attemptId: string; observationIds: string[]; explanation: string;
  drillId?: string; uncertainty: string[]; promptVersion: string;
};
```

## Proposed endpoints
POST /api/music/practice-attempts (auth, consent, exercise ID); POST /api/music/practice-attempts/:id/upload-intent (private scoped upload); POST /api/music/practice-attempts/:id/analyze (idempotent enqueue); GET /api/music/practice-attempts/:id (owner only); DELETE /api/music/practice-attempts/:id (media + metadata lifecycle). Export route subject to existing platform conventions.

## Evaluation fixtures
- Synthetic MIDI-rendered reference with known onset offsets: bounded error tolerance recorded before implementation.
- Two tempos and three rhythmic error types: correct classification and directional improvement.
- Silence, clipping, noisy room, mixed instruments: abstain or low confidence, never fabricated pitch.
- Repeated upload, retry, concurrent enqueue: idempotency and correct ownership.
- Wrong learner access: 403/404 and no signed asset leak.
- Deletion and retention expiry: asset revocation and deletion verification.
- Prompt injection in media metadata/transcript: no unauthorized tools or narrative claims.
- Mentor narrative golden set: every quantitative assertion maps to observation IDs.
- Accessibility: mic-denied upload fallback, keyboard and screen reader, reduced motion.

## Validation required before implementation merge
Typecheck, unit tests, contract tests, RLS/security tests, golden DSP fixtures, prompt-grounding tests, 375/768/1440 UI screenshots, upload/delete integration test, cost/latency budget, review by product, music pedagogy, security, and canon owners.
