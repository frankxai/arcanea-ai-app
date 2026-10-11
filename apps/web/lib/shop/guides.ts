export const SHOP_GUIDES = [
  {
    slug: "worldbuilding-bible",
    title: "A world bible that earns its pages.",
    searchTitle:
      "Worldbuilding bible template — rules, characters and continuity",
    description:
      "Build a useful world bible for an original story: one binding rule, its cost, a character under pressure, a proof scene and a portable continuity record.",
    category: "Worldbuilding",
    intro:
      "A world bible becomes useful when it changes what you can write. Begin with the smallest record that can hold a scene together. Expand it when the story asks for more.",
    sections: [
      {
        title: "Start with the promise, then the constraint.",
        paragraphs: [
          "Write one sentence about the experience the world should create. Awe, uneasy discovery, intimacy or adventure can each support a different design. Then write a rule that forces a cost. A rule with no limit gives a character too many exits; a cost creates a choice.",
          "In the free demonstration, a coastal city's archive can restore a damaged memory, but the person making the repair loses an equally specific memory of their own. This is a proposed example outside official Arcanea canon. Its usefulness comes from the consequence: the archivist cannot save everything without giving something up.",
        ],
      },
      {
        title: "Make the rule visible in one scene.",
        paragraphs: [
          "Choose a character with a present desire. Give them a reason to resist the world rule and put a decision in front of them. Draft the scene before writing ten pages of history. If the scene works only after an explanatory lecture, simplify the rule or make the consequence easier to observe.",
          "Record what the reader actually sees: an altered object, a failed action, a missing name or a relationship changed by the decision. That evidence becomes the standard for later scenes. The reader should encounter the world's behavior before receiving a catalogue of its institutions.",
        ],
      },
      {
        title: "Keep a small set of connected records.",
        paragraphs: [
          "The first world bible needs a promise, rule, cost, protagonist, place and proof scene. Give each a stable identifier. A character record names their desire and constraint; a location record says what actions it enables or prevents. Link the scene to the rule it demonstrates and the character it changes.",
          "Separate your source notes from accepted facts and generated proposals. A plausible suggestion from a model is still a suggestion. A contradiction record should identify the two conflicting claims and the scenes affected. That makes a deliberate revision possible without silently rewriting the whole world.",
        ],
      },
      {
        title: "Choose visual signals you can review.",
        paragraphs: [
          "Describe materials, light, shapes and recurring forms. 'Beautiful fantasy city' provides little direction. Salt-clouded glass, narrow tide stairs, copper repairs and low morning light give an illustrator or image workflow details that can be accepted or rejected.",
          "Keep the visual brief separate from the final artwork. An image may inspire a new proposal, but it cannot establish a new world law by itself. When a visual detail matters to the story, record the decision in the same continuity ledger as the text.",
        ],
      },
      {
        title: "Export something another person can use.",
        paragraphs: [
          "A portable packet can be plain Markdown and JSON: the current brief, entity records, accepted facts, open conflicts and the proof scene. State its version, file contents and rights. Another writer or artist should be able to tell which material is binding and which is open for revision.",
          "Avoid building a complete encyclopedia before the first scene has passed review. Add timelines, factions and maps when they resolve a real production question. The practical test is simple: does this page help someone make the next scene consistent, emotionally active and specific?",
        ],
      },
    ],
  },
  {
    slug: "visual-continuity",
    title: "Keep a character recognizable.",
    searchTitle: "Character reference sheets and visual continuity for AI art",
    description:
      "A practical reference-sheet and review method for consistent original characters across AI images, story scenes and production tools.",
    category: "Art direction",
    intro:
      "A character's identity must survive a new pose, camera angle and scene. Write the invariant features first. Review each image against them rather than accepting a convincing face in isolation.",
    sections: [
      {
        title: "Distinguish identity from the shot.",
        paragraphs: [
          "Identity includes the silhouette, facial structure, hair, costume construction and a few meaningful objects. The shot adds pose, expression, environment, lens and light. Keep these in separate sections of the brief. Changing the camera should not change the person's age, clothing closures or defining proportions.",
          "For an original archivist, you might specify a short copper-fastened coat, salt-worn gloves and a narrow glass instrument case. These are example decisions, not official Arcanea character lore. A rear view should preserve the coat's construction even when the face is invisible.",
        ],
      },
      {
        title: "Create a reference sheet with a job.",
        paragraphs: [
          "Use a neutral front view, a three-quarter view, profile and one costume detail. Add an expression or action study when the scene demands it. Label accepted images and record which version each production brief uses. An attractive mood board is not a substitute for a reference that resolves proportions and construction.",
          "When a model accepts reference images, use the supported controls and inspect whether they preserve identity. Provider settings and reference weight are production inputs, not a guarantee. Record them when known so a later revision does not depend on a forgotten chat.",
        ],
      },
      {
        title: "Review with a small, explicit rubric.",
        paragraphs: [
          "Compare silhouette, face, hair, costume, significant objects and scene action. Add anatomy, perspective and readable expressions to the image review. A beautiful output with the wrong character is a rejected candidate, not a successful edition asset.",
          "Write the reason for rejection. If the same defect returns across several attempts, repair the reference or narrow the brief before generating again. Account for rejected attempts and human review when estimating the cost of an accepted image.",
        ],
      },
      {
        title: "Preserve the decisions between tools.",
        paragraphs: [
          "Keep a named reference version, prompt/brief, source image identifiers, review verdict and accepted rendition. Text and artwork need separate permissions. A reference taken from another franchise does not grant the right to sell a derived character, and an open software license does not automatically cover bundled illustrations.",
          "A short continuity ledger should show what changed and which scenes use the old version. Apply a costume revision to the affected shots deliberately. Do not let each image workflow invent a fresh character and hope a final color grade will connect them.",
        ],
      },
      {
        title: "Publish the accepted work, not the attempt counter.",
        paragraphs: [
          "A useful edition contains the accepted compositions at their actual resolution with a clear use license. Native masters and upscaled renditions should be distinguished. Quantity is not evidence of a coherent collection; six purposeful images may do more for a reader than a folder of unrelated candidates.",
          "Start with a character sheet and one scene. Ask another person to identify the same character in both without an explanation. Use that observation to strengthen the next revision, then export the reference and decisions with the project.",
        ],
      },
    ],
  },
  {
    slug: "ai-disclosure-canon-provenance",
    title: "AI disclosure and canon provenance for novelists and game developers.",
    searchTitle:
      "AI disclosure & canon provenance guide — Steam, KDP, and US Copyright Office rules",
    description:
      "A practical guide citing Steam (Jan 2024), Amazon KDP (Sept 2023), and US Copyright Office (March 2023) rules with exact dates, source links, and a worked canon-state provenance workflow.",
    category: "Provenance & Legal",
    intro:
      "Navigating platform disclosure requirements and intellectual property protection when using AI models requires distinguishing raw machine proposals from human-authored canon assets. Use this guide to review current platform policies and implement an auditable canon-state provenance workflow.",
    sections: [
      {
        title: "Understand platform disclosure rules and citations.",
        paragraphs: [
          "Major publishing and storefront platforms now require creators to classify how AI models were used during production. Citing rules with exact dates and sources ensures your disclosures remain accurate and compliant:",
          "[Steam / Valve Policy (January 2024)](https://store.steampowered.com/news/group/4145017/view/3862463717997849405): Valve requires game developers to disclose pre-generated AI content (art, code, text, audio) and live-generated AI content in the Steamworks AI survey. Developers must guarantee that pre-generated assets contain no infringing material and that live generation includes guardrails to prevent illegal output.",
          "[Amazon KDP AI Guidelines (September 2023)](https://kdp.amazon.com/en_US/help/topic/G200672300): Amazon Kindle Direct Publishing distinguishes strictly between 'AI-generated' content (text, images, or translations created directly by AI without substantial human modification) and 'AI-assisted' content (human created material refined, brainstormed, or edited using AI). Mandatory disclosure is required during title setup for AI-generated content.",
          "[US Copyright Office Policy (March 2023)](https://www.copyright.gov/ai/): In its Statement of Policy (88 FR 16190, March 16, 2023) and rulings (e.g. *Zarya of the Dawn* and *Thaler v. Perlmutter*), the Copyright Office affirms that copyright requires human authorship. Purely machine-generated outputs cannot be copyrighted and must be disclaimed, whereas human selection, arrangement, and creative transformation remain eligible for copyright protection.",
        ],
      },
      {
        title: "Maintain a canon-state ledger for full auditability.",
        paragraphs: [
          "To satisfy platform disclosure surveys and protect your IP, separate your production state into explicit tiers in a versioned continuity record:",
          "1. **Raw Proposal (`canonState: 'proposal'`)**: Model-generated text or image drafts. Logged with model version, prompt hash, and timestamp. Uncredited and non-binding.",
          "2. **Human Curation & Transformation (`canonState: 'in_review'`)**: Human author selects, edits, restructures, and rewrites the draft, adding character constraints and narrative direction.",
          "3. **Accepted Canon (`canonState: 'accepted'`)**: Binding asset recorded with `authorship: 'human_transformed'` or `'human_authored'`, human edit delta percentage, and platform category ('AI-assisted' for KDP).",
        ],
      },
      {
        title: "Worked example: Canon-state workflow for a novel or game.",
        paragraphs: [
          "Consider developing a game dialogue sequence or novel chapter. In Step 1, an AI model proposes a 500-word character interaction. The workflow marks the entry as `canonState: 'proposal'` with `model: 'claude-3-5-sonnet'`.",
          "In Step 2, the writer rewrites 350 words, inserts an original plot conflict, and alters the character's motivation. The ledger records the human transformation delta (70% human rewrite).",
          "In Step 3, the asset transitions to `canonState: 'accepted'` and generates an automated export manifest. On Amazon KDP, this asset qualifies as 'AI-assisted' (human created and heavily edited), while on Steam's AI survey, pre-generated background textures are logged as disclosed pre-generated AI.",
        ],
      },
      {
        title: "Export an auditable provenance packet with UTM tracking.",
        paragraphs: [
          "When submitting your book or game for release, export plain Markdown and JSON metadata documenting your canon-state history. This provides verifiable proof of human authorship and exact platform disclosure compliance.",
          "Test your project using our open tools and production kits with captured tracking links: try the [Free World Starter](/shop/sample?utm_source=arcanea_guides&utm_medium=field_note&utm_campaign=pillar_guide_2_disclosure) or inspect the full [Worldbuilder Production Edition](/shop/worldbuilder-production-edition?utm_source=arcanea_guides&utm_medium=field_note&utm_campaign=pillar_guide_2_disclosure).",
        ],
      },
    ],
  },
] as const;

export function findGuide(slug: string) {
  return SHOP_GUIDES.find((guide) => guide.slug === slug);
}
