# Music Mentor v1 — Product specification and user journey
## Job to be done
Help a learner master an instrument through measurable deliberate practice, not AI-generated encouragement.
## First learner
Beginner pianist with phone/laptop microphone and no MIDI keyboard. Start with a 4-bar monophonic melody in 4/4 at 70 BPM; record 2 attempts. Stretch: MIDI keyboard.
## Journey
1. Landing: "Play your first four bars better in ten minutes." Choose piano and goal; see sample lesson before signup.
2. Auth and consent: reuse Academy auth; explicit opt-in for recording, storage and optional third-party analysis. No default public sharing.
3. Guided practice: score, tempo, reference performance, count-in, recording tips; no fantasy lore required.
4. Capture: local preview, permissions, duration/format validation, private upload and visible processing status.
5. Feedback: per-note pitch and onset timing, missed/extra notes, confidence, uncertainty labels; one focus area and targeted 30-second drill. No unsupported hand-position claims.
6. Retry: same score and settings; overlay previous/current measurable performance with caveats.
7. Reflect: learner rates feedback helpfulness; save progress and next practice task; export or delete.
## Success metrics (pilot targets, hypotheses)
>=70% of enrolled pilot users finish first recording; >=50% submit a second attempt; >=60% of second attempts improve one prespecified objective metric; >=80% of feedback items cite a correct evidence span; p95 processing <45 seconds for <=90-second clips; <2% unrecoverable jobs. No claims of validated impact until measured.
## Acceptance
One authenticated learner can record, review, retry, delete, and retrieve two evidence-linked attempts. Network retries do not create duplicate jobs. No feedback shown when evidence confidence is below threshold; show "unable to assess" and recording tips instead.
## Rollout
A: offline evaluation corpus + reviewer rubric. B: gated internal prototype. C: 10-person pilot. D: expand to guitar or voice only after audio measurement validity and retention proven.
## Dependencies
Rights-cleared score and reference audio; instrument alignment engine; RLS-backed data; private object storage; privacy/legal review; observability; canonical Sonara approval.
