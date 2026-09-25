# The Light She Could Not See · release record

Date: 2026-09-25. Base: `frankxai/arcanea-ai-app` main at `4e104ae5e40d280d04f863137a505483f11e2409`. Owner: illustrated fiction release. Owning quality program: #427.

## Task contract

- **Reader job:** start a complete illustrated first journey, find a chapter again, and understand where the new arc begins.
- **Scope:** one standalone Next.js story route, its manuscript and continuation, 25 existing/new images, reading-specific design tokens and responsive styles.
- **Non-goals:** change the locked *Las Tierras de Luz* novel, the central product navigation, or other book publication states. No private individual is identified in the story or campaign copy.
- **Acceptance:** 16 parsed chapters in order, every illustration resolves, meaningful alt text, readable 375px and desktop compositions, working chapter anchors, truthful continuation status, changed-scope lint/types/build, ready preview, stable production route.
- **Verification:** parse the manuscript and referenced assets locally; run repository gates and Vercel preview build; inspect rendered desktop/mobile, keyboard links, network errors and production URL against the same commit.
- **Rollback:** revert the release commit through normal repository protections and let Vercel restore the earlier production deployment. No data migration.

## Editorial and visual direction

Three viable treatments were considered: (1) a dark cinematic gateway throughout, (2) a clean literary folio with no hero image, (3) an illustrated field journal with a cinematic arrival and warm reading paper. Chosen: **field journal**. The opening image promises a journey; paper, generous leading and a persistent desktop index carry the long read. The product navigation stays in its existing dark language. On mobile the index becomes an explicit disclosure so chapter one is not buried beneath sixteen links. The new river art signals the transition into part II. There is no ambient motion to distract from reading.

Current reader products inform specific choices: [Apple Books](https://authors.apple.com/support/3975-designing-great-book-layouts-interiors) emphasizes navigation and image quality and [its reading app](https://support.apple.com/guide/iphone/read-books-iphc1af7c57/27/ios/27) offers font/layout controls; [Standard Ebooks](https://standardebooks.org/manual/1.8.5/single-page) treats the chapter index as reading navigation. This web edition provides a chapter index and browser-native text zoom without claiming parity with a dedicated ebook app. A later EPUB edition should include its own navigable table of contents, scalable type and verified image descriptions.

The prose contract is more demanding than plot escalation: Selene is capable but fallible; sight never gives consent; Brío has animal limits; Cael carries consequences independent of romance; Iva and Adela change outcomes rather than reward the protagonists. The river guard protects people while withholding information; the mystery must stay measurable. Faith and coincidence open questions that work and other people's choices answer. The academy, river infrastructure, fauna, and future chamber all need costs and maintenance histories. A spectacular confrontation only earns its place if affected communities can act afterward.

## Release gates and evidence

- Manuscript has 12 complete original chapters and four opening chapters of *The Open Road*; part II is labeled as an opening, not sold as a finished book.
- This Selene is 29. The locked *Las Tierras de Luz* Selene is 19. The edition discloses that the continuities are distinct.
- The first 24 illustrations are preserved at their existing chapter positions. The new crossing study is encoded as WebP for the part divider. Chapter 16 intentionally has no new image pending continuity review.
- No human review is implied by this plan. Visual, editorial and engineering judgments here are an internal candidate and must be checked against the actual rendered page and deployment before claiming production readiness.
