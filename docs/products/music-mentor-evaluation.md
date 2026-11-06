# Music Mentor evaluation plan
## Contract tests
- Invalid confidence (<0 or >1), negative timestamps, reversed intervals, missing algorithm version, missing trace ID, feedback with nonexistent evidence indexes rejected.
- Completed assessment without measurements rejected. Low confidence returns insufficient-evidence, not a fabricated grade.
- Same idempotency key + same learner/exercise/media returns same job; collision with different payload returns 409.
- RLS: learner A cannot list, download, grade, or delete learner B's attempts.
- Consent: no third-party video analysis without explicit scope; revocation prevents new dispatch.
- Deletion: remove private object, derivatives, embeddings, provider references where supported; preserve only minimal lawful audit tombstone.
## DSP benchmark
Construct licensed MIDI-rendered ground truth plus recorded piano samples spanning tempo drift, wrong notes, omissions, noise, latency, clipping, polyphony and silence. Split by piece and performer, not random frames. Compare precision/recall for note detection and median onset error. Set thresholds from measured baseline before launch, not arbitrary claimed accuracy.
## Human evaluation
Blind music educator review of 50 attempts across skill levels: evidence correctness, feedback actionability, calibration, harmful or unsupported claims. Disagreement logged. Hallucinated fingering or posture advice = critical failure.
## End-to-end
Webcam/microphone denial, slow network, upload interruption, duplicate submit, processing timeout, signed URL expiry, malformed audio, silent recording, inaccessible reference score, consent revocation, deletion and retry.
## Release gate
Run tests in CI; publish fixtures and results; reviewer sign-off on evidence quality, privacy, rights and accessibility. This draft is not an executed test report.
