# The Weight of Wonders — independent release verdict

**Verifier:** `/root/wonders_verifier`  
**Verdict:** **PASS**  
**Production:** `https://www.arcanea.ai/gallery/weight-of-wonders`  
**Production commit:** `141ad072132597f741979eee58671b3bd4e26a88`  
**Production tree:** `10474f7c77b78371719ca6f593e993ba66215a4b`  
**Rollback:** `f3524a8c947d6ed7a54dea90e7496ec726590156`

The reviewed source, CI merge checkout, and deployed production commit share the exact same tree. The production commit changes exactly the declared 18 paths, and the rollback commit is its distinct direct parent and verified ancestor.

The final release contains 12 reciprocal experimental concepts: six bosses and six places. Gallery, dossier, API, authoring brief, and MCP surfaces preserve the proposal/experimental boundary and make no shipped-game, published-book, or locked-canon claim.

The quality bars pass:

- Editorial: **18/20**
- Typography: **15/16**
- Visual: **28/30**
- Motion: reviewed cut; no decorative animation shipped
- Accessibility: no serious or critical issue observed in the scoped production and exact-tree interaction review
- Exact-tree CI lab performance: LCP 660/416/568 ms, CLS 0.02435/0/0.00216, INP-style interaction 192/96/128 ms across desktop/mobile/reduced motion

The final CI artifact contains 42 files and 33 decodable PNGs; all 33 capture byte counts and SHA-256 values match its manifest. API, all 12 media hashes, keyboard, clipboard success/rejection, reflow, reduced motion, fonts/fallback, and unexpected console/page-error gates pass.

Production verification confirms the collection and all 12 dossier pages return 200, all 12 live WebPs match reviewed bytes and SHA-256 values, API totals and filters return `0/0/0/12`, `6/6`, and the targeted single results, the malformed query returns 400, private MCP remains 401, Sovereign Depths remains 36, and both Vercel telemetry scripts return JavaScript with HTTP 200. The production browser confirms 12 atlas links, all dossier headings and experimental labels, all 24 primary/related images at expected native dimensions, loaded host typography, no horizontal overflow, and the Othrek phase/outcome/copy/reward interaction.

Production field INP and raw console were not instrumented. No field-performance or production-console claim is made; those categories remain explicitly scoped to the exact deployed tree's CI lab artifact.

`release-evidence.json` passes the portable `starlight.web_release_evidence.v1` validator against the SHA-verified Git evidence repository. The approver remains `/root`; this verifier did not merge or approve its own work.
