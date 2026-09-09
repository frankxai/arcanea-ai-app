# Weight of Wonders — final 12-entry CI verification

**Verdict:** **PASS — ready to merge and proceed to production verification**  
**Reviewed source:** `e8adbc3399420f3a86ff8068132c09ab8410896f`  
**Reviewed source tree:** `10474f7c77b78371719ca6f593e993ba66215a4b`  
**CI merge checkout:** `6b3517317e07b936f48ce918a2aabde65ef5dea5`  
**CI merge tree:** `10474f7c77b78371719ca6f593e993ba66215a4b`  
**CI run / Build job:** `34366773492` / `102518585079`  
**Artifact:** `10110580250`  
**Artifact ZIP SHA-256:** `63b73f6203b8b23c58e7bfb00069b61e8122aff611a019714c372ae06cf9a049`

The actual GitHub merge checkout has the exact reviewed source tree. The artifact manifest also records the merge checkout and reviewed source separately.

## Artifact integrity

- 42 extracted files
- 33 PNG captures, all successfully decoded
- 33/33 capture byte counts and SHA-256 values independently match `built-app-manifest.json`
- Desktop 1440 × 900, mobile 375 × 812, and reduced-motion 1440 × 900 states are present
- Clean normal and blocked-font 375 px specimens and their JSON reports are present

## Final browser results

| State | INP-style lab observation | CLS | LCP | Unexpected console | Page errors |
|---|---:|---:|---:|---:|---:|
| Desktop | 192 ms | 0.02435 | 660 ms | 0 | 0 |
| Mobile 375 | 96 ms | 0 | 416 ms | 0 | 0 |
| Reduced motion | 128 ms | 0.00216 | 568 ms | 0 | 0 |

These metrics are local built-app lab observations tied to `http://127.0.0.1:3001`; they are not relabeled as field or production measurements. All three meet the release contract thresholds of INP ≤ 200 ms, CLS ≤ 0.1, and LCP ≤ 2500 ms.

The desktop slowest interaction is the cold collection navigation at 192 ms. The mobile and reduced-motion slowest interactions are the Destroy Orvess radio update at 96 ms and 128 ms. No long task accompanies the desktop slowest interaction.

## Functional and trust results

- API double opt-in totals: `0 / 0 / 12`
- Full collection: 12 unique IDs, six bosses, six places, all `EXPERIMENTAL`
- All 12 artwork responses return 200 and match their declared SHA-256 values
- Tharvoss growth/copy, Glassroot Hunger ecology, and artwork-limit assertions pass
- Gallery discovery, collection navigation, dossier navigation, phase controls, keyboard order, native radio behavior, clipboard success, clipboard rejection, manual selection, and outcome reset pass
- Collection and dossier reflow pass in every state
- Reduced-motion control cutoff passes
- Every state records only the four narrowly expected local Vercel telemetry 404/MIME messages; unexpected console and page errors are zero

## Independent quality bars

- Editorial: **18/20**
- Typography: **15/16**
- Visual: **28/30**
- Motion: reviewed cut; no decorative motion shipped
- Accessibility: no serious or critical issue observed in the scoped manual/interaction review; no automated axe or exhaustive WCAG claim

The final CI evidence resolves the preceding performance and harness failures without erasing them; `ci-iterations.json` retains the full diagnostic progression.

This verdict authorized merge. Final release evidence still requires the production commit/URL, deployed route/API/assets, computed production fonts, production telemetry/console/category reports, rollback ancestry, and the post-deploy receipt.
