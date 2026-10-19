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
] as const;

export function findGuide(slug: string) {
  return SHOP_GUIDES.find((guide) => guide.slug === slug);
}
