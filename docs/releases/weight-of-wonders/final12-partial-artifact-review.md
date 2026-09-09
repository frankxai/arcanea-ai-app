# Weight of Wonders — final-12 partial artifact review

**Run:** `34361346906`  
**Build job:** `102500070804`  
**Reviewed source:** `70cd4344497fadee5cfa6aff1716aebf7a2702ec`  
**Reviewed source tree:** `bed6be2dc202f28a16dfceb24748a7f3a9cd5c15`  
**Artifact:** `10108330232`  
**Artifact digest:** `883ae6696aea70b866b20c89d93551470ab0938b7dc8216fe348c1fbcb60d842`  
**Verdict:** **PARTIAL PASS; not release evidence**

The artifact contains 39 files and stops during the blocked-font specimen step, before the fallback specimen and built-app manifest are written. It therefore cannot establish a complete release pass.

## Accepted findings

- All six new desktop dossier captures render the intended artwork cleanly at 1440 × 900: Tharvoss, the Spawning Stair, the Glassroot Hunger, the Glassroot Sepulchre, Othrek, and the Brine Tribunal.
- The Othrek mobile portrait capture at 375 × 812 uses the portrait well, remains within the viewport, preserves legible art-limit copy, and has no horizontal clipping.
- The new artwork is visually distinct, coherent with its paired ecology/conflict, and strong enough to retain the existing visual score of **28/30**. Portrait gutters on desktop Othrek are intentional containment rather than cropping or distortion.
- Desktop, mobile, and reduced-motion reports all record collection and dossier reflow as true, loaded Instrument Serif/Geist/Geist Mono roles, and the repository's exact reduced-motion cutoff.
- Measured local built-app interaction observations are 144 ms desktop, 64 ms mobile, and 96 ms reduced motion, all within the 200 ms gate. These are lab observations tied to localhost URLs, not field or production measurements.
- The desktop report proves API totals `0/0/12`, six bosses, six places, 12 unique IDs, 12 exact delivered artwork hashes, Tharvoss growth/copy content, and Glassroot Hunger ecology/art-limit content.
- Each state retains four raw local Vercel telemetry errors, all narrowly classified as the expected two absent local telemetry endpoints; unexpected console errors and page errors are zero. Production telemetry still requires its separate HTTP proof.
- The normal 375 px typography specimen is clean: no fixed navigation or assistant overlay, no horizontal clipping, and readable hierarchy and controls.

## Failure retained

The fresh blocked-font page exposed two matches for the unscoped `[data-type-specimen]` locator. The artifact does not prove why the hidden duplicate existed. The reviewed correction requires exactly one **visible** specimen inside `main`, samples the visible dossier heading and specimen descendants after fonts and paint settle, and still fails if more than one visible desk exists.

The next complete artifact must supersede this partial result and include the blocked-font specimen, its JSON report, and a content-addressed built-app manifest tied to the reviewed source and merge-checkout tree.
