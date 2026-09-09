# The Weight of Wonders — verified web release

[Open the live gallery](https://www.arcanea.ai/gallery/weight-of-wonders).

Twelve individual artworks connect six bosses to six inhabited dungeons. The collection includes eighteen encounter phases, eighteen consequential endings, twenty-four story seeds and twelve copyable session briefs. The Living Crucibles extension contributes Tharvoss, the Glassroot Hunger and Marshal Othrek with three associated places, ecological pressures and proposed mastery rewards.

All entries remain **EXPERIMENTAL**. Encounters are authored concepts awaiting playable prototypes and balance testing; the companion trilogy is an outline with an opening fragment. The MCP source interface is integrated, but this release does not publish an npm package.

## Source and deployment

- [Production commit 141ad072](https://github.com/frankxai/arcanea-ai-app/commit/141ad072132597f741979eee58671b3bd4e26a88)
- [Runtime PR #375](https://github.com/frankxai/arcanea-ai-app/pull/375)
- [Living Crucibles content PR #376](https://github.com/frankxai/arcanea-ai-app/pull/376)
- [Final CI run 34366773492](https://github.com/frankxai/arcanea-ai-app/actions/runs/34366773492)
- Production deployment: `dpl_H8aPzSHY3RpALorLNTjkeB87ErYB`, READY, with `www.arcanea.ai` and `arcanea.ai` aliases.

The reviewed source, CI merge checkout and production commit have the same Git tree: `10474f7c77b78371719ca6f593e993ba66215a4b`. The direct production parent, `f3524a8c947d6ed7a54dea90e7496ec726590156`, is the recorded rollback commit.

## Verification

- [Portable release manifest](release-evidence.json) and [validator result](validator-output.txt).
- [Production browser receipt](production-browser-receipt.json): all twelve dossiers and native-resolution images loaded; actual phase, ending and clipboard behavior checked.
- [Production HTTP verification](production-http.json): twelve image hashes and byte counts match, thirteen pages return 200, explicit API opt-in boundaries pass, private MCP stays 401, both telemetry scripts return JavaScript, and the existing Sovereign Depths API retains 36 entries.
- [Independent final CI review](final12-ci-verification.md) and [complete built-app captures](artifacts/built-app).
- [Iteration history](ci-iterations.json) preserves failed samples and their resolutions.

Final built-app interaction measurements were 192 ms on desktop, 96 ms at 375px mobile, and 128 ms with reduced motion. These are local CI observations, not production field INP. Production browser console instrumentation was not performed; raw console evidence is scoped to the exact-tree CI run.

The transient scratch workspace loss was recovered from GitHub blobs, the original desktop capture and the verified CI archive. Restored files were checked against their original hashes. Supplemental connector failures remain recorded in `production-http-connector.json`; the original full direct HTTP verification subsequently completed successfully.

This evidence branch records the already deployed production release. It does not promote experimental lore to locked canon.
