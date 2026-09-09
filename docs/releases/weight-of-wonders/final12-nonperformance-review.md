# Weight of Wonders — final-12 non-performance artifact review

**Run:** `34363018641`  
**Build job:** `102500070804`  
**Reviewed source:** `10e8579deaa6aa25e7279f24e5a534282c5c78ca`  
**Reviewed source tree:** `fd6cbae1a4ada4df61d11ae9612c925eb08ec151`  
**CI merge checkout:** `d63fe216cb0a41d9c78ba0428074207ab5b66614`  
**Artifact:** `10109069129`  
**Artifact ZIP SHA-256:** `8ca4d8edd670cea5673b6e3a90371de6602af97992b642dcace6ff79014ba27e`  
**Verdict:** **PASS in all reviewed categories except performance; release remains blocked**

## Artifact integrity and coverage

- The artifact contains 42 files, including a built-app manifest, 33 PNG captures, three Weight of Wonders state reports, the normal mobile specimen/report, and the blocked-font specimen/report.
- All 33 capture byte counts and SHA-256 values match the built-app manifest.
- The manifest truthfully distinguishes reviewed source `10e8579...` from CI merge checkout `d63fe216...`. Git tree identity is a separate release-proof requirement.
- The final-12 visual surfaces match the previously reviewed partial artifact. The only source change between the visually reviewed `70cd434...` tree and this run is the two-file harness selector correction.

## Passing evidence

- **Inventory/API:** default/proposal-only/full totals are `0/0/12`; the full result has 12 unique IDs, six bosses, six places, and `EXPERIMENTAL` status.
- **Delivered media:** all 12 image routes return 200 and match their declared SHA-256 values. The expansion’s six desktop dossier captures and Othrek’s mobile portrait remain clean and coherent.
- **Extension behavior:** the report proves Tharvoss growth and copied reward content plus Glassroot Hunger ecology and artwork-limit content.
- **Responsive behavior:** desktop 1440 × 900, mobile 375 × 812, and reduced-motion collection/dossier overflow checks pass.
- **Browser diagnostics:** each state records the four expected local 404/MIME messages for Vercel telemetry, with zero unexpected console errors and zero page errors. The classifier retains the raw errors and production telemetry still requires separate HTTP evidence.
- **Typography:** normal computed roles are Instrument Serif 400 for dossier headings, Geist for body/controls, and Geist Mono for the manual brief. The clean normal and blocked-font specimens both fit 343 px of usable width and remain readable without overlays. Five webfont requests are demonstrably blocked in the fallback run. Typography score remains **15/16** because the CSS family string does not prove which local fallback face the browser selected.
- **Motion:** decorative control animation is absent. The reduced-motion state reports the repository’s `0.01ms` transition cutoff (`1e-05s`).
- **Visual:** the final expansion retains **28/30** from the independent review: hierarchy 5, composition 5, imagery 5, responsive behavior 4, interaction presentation 4, and host fit 5.
- **Accessibility:** the scoped manual and interaction review in `accessibility-review.md` found no serious or critical issue on the tested collection, dossier, and authoring surfaces. This is not an automated or exhaustive WCAG audit.

## Blocking performance result

Desktop local built-app INP observation is **352 ms**, above the 200 ms contract threshold. The slowest interaction is the “Destroy Orvess” radio selection:

- input delay: 6.9 ms
- processing duration: 0.8 ms
- presentation delay: 344.3 ms
- overlapping long task: 72 ms

Mobile is 80 ms and reduced motion is 112 ms. Desktop CLS is 0.02435 and LCP is 576 ms in this local lab scope.

The desktop result is a real failed sample and cannot be averaged away, relabeled as production, or replaced by the earlier partial run. A new exact-source artifact must demonstrate a genuine product-side or measurement-correctness resolution while retaining the 200 ms gate and full diagnostic history.
