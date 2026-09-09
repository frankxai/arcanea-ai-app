# Weight of Wonders — nonfinal CI artifact review

Verifier: `/root/wonders_verifier`  
Review date: 2026-09-09  
Artifact: GitHub Actions artifact `10105100024`  
Downloaded ZIP SHA-256: `92fcebb7507673d97b79605e704f8e13c89d1cf96709d6b152ec7c7dac4049bc`

## Status and limit

**BLOCKED and nonfinal.** The artifact contains 26 files from a run that stopped on the old reduced-motion string assertion. It has complete desktop and 375px Weight of Wonders reports/captures but no complete reduced-motion state, fallback specimen or built-app manifest. It cannot prove a release commit. It is useful diagnostic evidence for the next exact-head run.

## Concrete findings

1. Desktop measured interaction latency is 256 ms for the first explicit “Destroy Orvess” radio selection, above the unchanged 200 ms gate. A collection-to-dossier navigation interaction is 208 ms. Mobile's slowest qualifying interaction is 152 ms. The desktop performance gate is truthfully false and must not be relabeled or waived.
2. Each completed state records four console errors from the two Vercel telemetry scripts under local `next start`. The harness correctly classifies the two 404 records whose locations are the telemetry paths, but the paired strict-MIME errors point to `/gallery` and remain unexpected. Any local-only exception must match the exact MIME-refusal template, parse its embedded URL to the loopback origin and one of the two allowlisted paths, retain the raw record, and remain subject to a production HTTP 200 check.
3. The desktop collection-hero capture contains typography and controls over a black background; both desktop dossier captures show empty dark artwork boxes. The mobile hero and dossier captures render the same images correctly, and the separately inspected live preview renders the desktop hero. This isolates a decode-to-screenshot paint race in the evidence harness. A paint settle and new visible captures are required.
4. The 375px authoring-desk type specimen is readable and demonstrates Instrument Serif, Geist and Geist Mono roles, but its tall element screenshot contains the sticky site header across the middle and obscures phase copy. The isolated mobile and fallback specimens must suppress that capture artifact or use a clean viewport specimen.

## What passed in this partial run

- Desktop and mobile navigation, phase change, native radio keyboard behavior, clipboard success, stale-status reset, forced clipboard rejection and full manual selection.
- Desktop and mobile horizontal reflow checks.
- Intended computed family declarations: `Instrument Serif` heading at 400, Geist body/control, Geist Mono manual-copy text.
- Public API counts `0 / 0 / 6`, `EXPERIMENTAL` status, and six delivered image hashes in the desktop report.
- Desktop LCP 608 ms and CLS 0.02435; mobile LCP 448 ms and CLS 0. These are local built-app lab observations, not field or production URL metrics.

These passing observations remain supporting diagnostics only. The next artifact must reproduce them at the exact reviewed tree and close every blocker above.
