# Weight of Wonders — 12-entry runtime source review

**Independent verifier:** `/root/wonders_verifier`  
**Verdict:** **READY FOR REMOTE UPLOAD (source only)**  
**Release verdict:** Pending fresh 12-entry CI artifact and production evidence.

## Reviewed scope

- Staging manifest: `work/wow-v2-runtime-manifest.json`
- Base runtime head: `5f58391e087405bd0d798415543ec4f3e55554f7`
- Merge target carrying the reviewed inert extension: `f3524a8c947d6ed7a54dea90e7496ec726590156`
- Changed paths: 13
- Result: every staged file matches the manifest byte count and SHA-256.

## Findings

1. **Canonical composition is sound.** The loader combines the original six-entry application JSON with the already-reviewed `living-crucibles-entries.json`. It does not duplicate the extension prose. Runtime schema parsing requires exactly 12 unique, reciprocal records: six bosses and six places, all `EXPERIMENTAL`.
2. **The trust boundary remains explicit.** Gallery, collection, dossier, authoring brief, API notice, and MCP response retain experimental/proposal language. The UI says game implementation and book publication are separate. API retrieval still requires both proposal and experimental opt-ins.
3. **The new material is useful in the product surface.** Dossiers render optional growth and food-web material. Copied briefs carry practice, mastery, reward, rematch, and boss ecology. Search includes the new growth, ecology, movement, encounter, ending, and place prose.
4. **Inventory behavior is coherent.** Gallery discovery says 12 concepts; the collection says six pairs; static params derive from the composed entries. The API restricts current public IDs to `01`–`06`, reports 12 only after double opt-in, and retains bounded filters. The MCP client accepts future two-digit IDs but validates experimental status, a maximum of 64 records, and `total === entries.length`; it still uses the fixed production origin and fails closed.
5. **The final browser plan covers the expansion.** It checks API totals and kind counts, all 12 delivered asset hashes, Tharvoss growth/copy content, and Glassroot Hunger ecology/art limits. Desktop capture adds all six new dossiers; mobile adds Othrek’s portrait dossier. Existing desktop, 375 px, reduced-motion, clipboard, keyboard, fallback-font, console, and interaction-latency gates remain in place.
6. **Validation is aligned with runtime composition.** The standalone validator reads the same two canonical sources and verifies record count, reciprocal pairing, experimental status, source paths, unique WebP hashes, exact bytes, dimensions, and checksums.

No source blocker was found in the frozen 13-file staging set.

## Evidence still required for release

- A successful CI artifact built from the uploaded 12-entry source tree, with its merge checkout tree proven identical to the reviewed source tree.
- Independent review of the new desktop/mobile/reduced-motion captures and JSON reports, including the 12-entry API and asset proofs.
- Accessibility evidence showing zero serious or critical findings. This is not established by the source manifest or the earlier six-entry artifact.
- Production exact-commit, route/API/asset, telemetry, performance-scope, rollback/ancestry, and post-deploy receipt evidence.

The successful six-entry artifact from run `34359016340` is accepted as regression evidence for the shared layout and harness only. It does not prove the final 12-entry inventory.
