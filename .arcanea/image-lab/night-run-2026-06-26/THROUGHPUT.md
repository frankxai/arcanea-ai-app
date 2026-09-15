# Arcanea Image Throughput

Updated: 2026-06-26T21:54:59

## Summary

- Target images: 100
- Generated images tracked: 34
- Remaining to target: 66
- Observed active generation time: 49 minutes
- Observed active rate: 41.6 images/hour
- Approved with notes: 12 (35.3%)
- Iterate: 20
- Restart: 2
- Near-or-approved signal: 52.9%

At the observed active rate, 66 more images would take about 95.2 active generation minutes. Review/scoring time is additional.

This is throughput evidence, not quota evidence. Official Codex docs checked earlier do not publish a stable fixed images/hour quota for this built-in image tool.

## Batch Windows

| Batch | Images | Source timestamp window | Active min | Rate | Approved | Iterate | Restart |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| batch-000 | 4 | 03:50:41-03:58:15 | 8 | 30/hr | 0 | 3 | 1 |
| batch-001 | 4 | 04:12:48-04:17:05 | 4 | 60/hr | 0 | 4 | 0 |
| batch-002 | 4 | 04:32:26-04:38:46 | 6 | 40/hr | 0 | 3 | 1 |
| batch-003 | 4 | 13:46:01-13:50:35 | 5 | 48/hr | 1 | 3 | 0 |
| batch-004 | 4 | 13:52:57-13:58:54 | 6 | 40/hr | 0 | 4 | 0 |
| batch-005 | 2 | 14:01:32-14:03:06 | 2 | 60/hr | 1 | 1 | 0 |
| batch-006 | 4 | 16:52:06-16:57:47 | 6 | 40/hr | 2 | 2 | 0 |
| batch-007 | 4 | 21:27:10-21:32:04 | 5 | 48/hr | 4 | 0 | 0 |
| batch-008 | 4 | 21:40:12-21:47:00 | 7 | 34.3/hr | 4 | 0 | 0 |

## Operating Policy

- Keep batches at 4 images.
- Do not generate a new batch until the previous batch is ingested, inspected, scored, and included in this report.
- Prioritize approved-with-notes rate over raw image volume.
- If visible usage warnings, failed generations, or quality collapse appear, stop and record it in `oversight.md`.

Proof JSON: `.loop/arcanea-image-lab/proofs/latest-throughput.json`
