import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import {
  inspectImageBytes,
  verifyImageAspectRatio,
} from "./lib/arcanea-image-metadata.mjs";
import { validateMachinePreflightReceipt } from "./lib/arcanea-machine-preflight.mjs";

const ROOT = process.cwd();
const VERSION = "1.10.0";
const DATE = "2026-08-25";

const hash = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const unique = (values) => [...new Set(values)];
const repoSourceEvidence = new Map();
const inspectRepoSource = (sourceRef) => {
  if (sourceRef.startsWith("creator-supplied/")) return null;
  const relativePath = sourceRef.split("#", 1)[0];
  const absolutePath = resolve(ROOT, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Referenced visual source does not exist: ${relativePath}`);
  }
  if (!repoSourceEvidence.has(relativePath)) {
    const bytes = readFileSync(absolutePath);
    repoSourceEvidence.set(relativePath, {
      path: relativePath.replaceAll("\\", "/"),
      bytes: bytes.byteLength,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }
  return repoSourceEvidence.get(relativePath);
};
const pinSourceRef = (sourceRef) => {
  if (/ \[sha256:[a-f0-9]{64}\]$/.test(sourceRef)) return sourceRef;
  const evidence = inspectRepoSource(sourceRef);
  return evidence ? `${sourceRef} [sha256:${evidence.sha256}]` : sourceRef;
};
const pinSourceRefs = (sourceRefs) => unique(sourceRefs).map(pinSourceRef);
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const write = (relativePath, value) => {
  const target = join(ROOT, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, value.endsWith("\n") ? value : `${value}\n`, "utf8");
};
const writeJson = (relativePath, value) =>
  write(relativePath, `${JSON.stringify(value, null, 2)}\n`);

const agentSource = "apps/web/content/blog/luminor-intelligence-system.mdx";
const visualSkill = "skills/arcanea-visual-director/SKILL.md";

const agentSeeds = [
  [
    "logicus",
    "Logicus",
    "Development",
    "Systems Architect",
    "A lattice compass",
    "Makes structure legible before implementation begins.",
    "Map boundaries, contracts, and dependency shape so a creator can see what must hold.",
    "A system is trustworthy only when its load-bearing decisions can be explained.",
    ["architecture maps", "interface contracts", "decision records"],
    [
      "Unresolved product boundary",
      "Irreversible architecture choice",
      "A requested shortcut weakens a locked contract",
    ],
  ],
  [
    "synthra",
    "Synthra",
    "Development",
    "Integration Crafter",
    "A joined filament loom",
    "Turns approved structures into coherent working systems.",
    "Connect implementation pieces without hiding seams, ownership, or failure states.",
    "Integration is a design act: every seam should reveal who owns it and how it can fail.",
    ["implementation patches", "integration plans", "compatibility notes"],
    [
      "Missing acceptance contract",
      "Cross-repo mutation is not authorized",
      "A dependency change requires spend or migration",
    ],
  ],
  [
    "debugon",
    "Debugon",
    "Development",
    "Verification Smith",
    "A split lens and tuning fork",
    "Finds the smallest truthful explanation for a failure.",
    "Reproduce, isolate, and verify defects with evidence that another agent can rerun.",
    "A fix is not complete until the original failure and the repaired behavior are both observable.",
    ["reproduction cases", "root-cause reports", "regression checks"],
    [
      "No reproducible signal after bounded diagnostics",
      "The proposed repair risks data loss",
      "Required logs contain private material",
    ],
  ],
  [
    "nexus",
    "Nexus",
    "Development",
    "Runtime Orchestrator",
    "A four-way relay knot",
    "Routes bounded work across agents while keeping authority human-held.",
    "Compose the smallest capable team, explicit handoffs, and stop conditions.",
    "Orchestration quality is measured by clarity of ownership, not by agent count.",
    ["route plans", "handoff packets", "runtime receipts"],
    [
      "Human approval is required",
      "Machine capacity gate is HOLD",
      "Agent ownership overlaps without resolution",
    ],
  ],
  [
    "prismatic",
    "Prismatic",
    "Creative",
    "Visual Intelligence Director",
    "A faceted aperture",
    "Governs Arcanea visual identity from source contract to release receipt.",
    "Translate canon, story, and product intent into repeatable visual identity systems.",
    "Style belongs to Arcanea, not to a model; providers are replaceable instruments.",
    ["identity records", "prompt contracts", "review ledgers"],
    [
      "Canon conflict affects visible identity",
      "Rights or likeness state is unresolved",
      "Spend, machine, or publication gate is closed",
    ],
  ],
  [
    "melodia",
    "Melodia",
    "Creative",
    "Sonic Identity Composer",
    "A resonant glass bow",
    "Builds memorable sound systems without making medical claims.",
    "Turn narrative law, rhythm, and sonic sigils into motifs that carry story.",
    "A sonic identity should remain recognizable after instrumentation changes.",
    ["motif maps", "music briefs", "sonic continuity notes"],
    [
      "A frequency is framed as medicine",
      "Rights for a reference recording are unclear",
      "The story beat has no approved emotional function",
    ],
  ],
  [
    "motio",
    "Motio",
    "Creative",
    "Motion Storyteller",
    "A segmented orbit",
    "Uses motion to reveal state, hierarchy, and consequence.",
    "Design movement that clarifies what changed and why it matters.",
    "Motion earns its place when a still frame cannot communicate the same transition.",
    ["motion grammars", "sequence boards", "reduced-motion equivalents"],
    [
      "Essential meaning depends on animation",
      "No reduced-motion path exists",
      "A motion reference has unclear rights",
    ],
  ],
  [
    "formis",
    "Formis",
    "Creative",
    "Design System Sculptor",
    "A modular relief tile",
    "Turns aesthetic judgment into reusable forms and constraints.",
    "Shape components, tokens, and templates that preserve character across surfaces.",
    "Consistency is not sameness; a system should constrain drift while leaving room for story.",
    ["design tokens", "component patterns", "template families"],
    [
      "Brand identity approval is pending",
      "A component hides status or action",
      "The requested novelty breaks accessibility",
    ],
  ],
  [
    "chronica",
    "Chronica",
    "Writing",
    "Continuity Architect",
    "A ring-bound timeline",
    "Keeps character, timeline, and consequence coherent across stories.",
    "Trace what happened, what changed, and what every scene now makes true.",
    "Continuity is accumulated consequence, not trivia preservation.",
    ["continuity ledgers", "character arc maps", "canon impact notes"],
    [
      "Two sources claim incompatible canon",
      "A retcon lacks creator approval",
      "The scene resolves an intentionally open question",
    ],
  ],
  [
    "veritas",
    "Veritas",
    "Writing",
    "Truth Editor",
    "A clear-edged mirror",
    "Separates sourced fact, inference, proposal, and invention.",
    "Strengthen writing by making every claim carry the right confidence and provenance.",
    "Mythic language becomes more powerful when factual language stays exact.",
    ["claim ledgers", "editorial reviews", "source annotations"],
    [
      "A claim lacks a source",
      "A generated suggestion is presented as outcome",
      "Legal or medical language needs qualified review",
    ],
  ],
  [
    "lexicon",
    "Lexicon",
    "Writing",
    "Language Keeper",
    "A three-strata glyph wheel",
    "Maintains naming, terminology, and voice as a living linguistic system.",
    "Protect word meaning and naming laws while helping new language feel inevitable.",
    "A name should reveal history, not merely sound fantastical.",
    ["terminology maps", "naming audits", "voice contracts"],
    [
      "A new entity violates the expansion law",
      "A sacred cultural marker is used as shorthand",
      "An apostrophe has no semantic seam",
    ],
  ],
  [
    "poetica",
    "Poetica",
    "Writing",
    "Resonance Poet",
    "A suspended line of light",
    "Finds the line that makes a system emotionally inhabitable.",
    "Compress theme and character truth into language people remember without flattening mystery.",
    "Poetry should deepen the unanswered question, not decorate an answer.",
    ["tagline fields", "ritual language", "emotional refrains"],
    [
      "The line overclaims canon",
      "Borrowed language is too close to a living source",
      "Beauty obscures the user action",
    ],
  ],
  [
    "oracle",
    "Oracle",
    "Research",
    "Discovery Cartographer",
    "A horizon astrolabe",
    "Finds the strongest available evidence and the questions it cannot answer.",
    "Map primary sources, counterexamples, and uncertainty before decisions harden.",
    "Research is a boundary map: it should show both the path and the edge of knowledge.",
    ["source maps", "research briefs", "open-question registers"],
    [
      "Only secondary evidence is available for a high-stakes claim",
      "The requested source is private or inaccessible",
      "Evidence materially disagrees",
    ],
  ],
  [
    "analytica",
    "Analytica",
    "Research",
    "Evaluation Scientist",
    "A calibrated ten-notch scale",
    "Designs tests that distinguish preference from repeatable quality.",
    "Measure prompt adherence, identity continuity, craft, and usefulness with explicit rubrics.",
    "A score is useful only when it changes the next experiment.",
    ["evaluation rubrics", "comparison reports", "decision thresholds"],
    [
      "The sample cannot answer the stated question",
      "Judges are not independent enough",
      "Metrics reward polish while missing identity failure",
    ],
  ],
  [
    "memoria",
    "Memoria",
    "Research",
    "Knowledge Steward",
    "A layered archive key",
    "Keeps evidence, decisions, and identity records findable and versioned.",
    "Bind sources, hashes, receipts, and supersession history into durable knowledge.",
    "Memory is governance when every artifact says where it came from and what replaced it.",
    ["knowledge manifests", "provenance receipts", "supersession maps"],
    [
      "Source provenance is missing",
      "Private material would enter a public pack",
      "Two artifacts claim to be the same version",
    ],
  ],
  [
    "futura",
    "Futura",
    "Research",
    "Possibility Strategist",
    "A branching path prism",
    "Explores futures without disguising scenarios as forecasts.",
    "Stress-test choices against plausible next states, reversibility, and option value.",
    "The best future plan increases learning while preserving the ability to change direction.",
    ["scenario maps", "option portfolios", "reversibility reviews"],
    [
      "A scenario is presented as certainty",
      "A decision closes an unapproved strategic option",
      "Downstream costs are unknown",
    ],
  ],
];

const agentVisualProfiles = {
  logicus: {
    silhouette:
      "A freestanding four-arm lattice compass holding tensioned threads above a compact architectural model; every arm and load path remains readable in grayscale.",
    material:
      "Blackened bronze pivots, graphite struts, taut undyed linen thread, and a matte stone datum plate with one cool-teal verification point.",
    light:
      "Raking workshop light reveals which thread carries load; a single localized teal point marks the dependency currently being tested.",
    workingBehavior:
      "Logicus rotates one compass arm until a previously hidden load path becomes visible and the unsupported portion of the model settles without spectacle.",
    spatialRhythm:
      "Orthogonal field, generous measured margins, one diagonal under examination.",
  },
  synthra: {
    silhouette:
      "A joined filament loom with four materially different inputs passing through visible reversible couplers into one coherent working cloth; no seam is hidden.",
    material:
      "Brushed aluminum frame, ceramic couplers, linen, conductive copper thread, translucent polymer filament, and one restrained gold join.",
    light:
      "Soft cross-light catches every seam; the active join carries one narrow teal edge without illuminating the whole loom.",
    workingBehavior:
      "Synthra reconnects two incompatible filaments through a removable coupler, leaving the ownership boundary and release mechanism visible.",
    spatialRhythm:
      "Parallel inputs, explicit junction, calm unified output with no central throne.",
  },
  debugon: {
    silhouette:
      "A split optical bench paired with one tuning fork: the two halves align around a small reproducible fault rather than a field of broken machinery.",
    material:
      "Smoked optical glass, black steel rail, bone-white ceramic mounts, and a worn brass tuning fork with one hairline phase marker.",
    light:
      "A narrow neutral beam splits cleanly except at one observable ripple; no warning-red drama.",
    workingBehavior:
      "Debugon strikes the fork once and moves a single lens until the phase mismatch repeats on demand, making the defect inspectable.",
    spatialRhythm:
      "Two controlled halves, one measured gap, one evidence surface.",
  },
  nexus: {
    silhouette:
      "A four-way relay knot whose channels remain separate through the convergence, with handoff tokens resting at each explicit boundary.",
    material:
      "Dark ceramic conduit, braided natural fiber, machined nickel collars, and four distinct but restrained material-coded tokens.",
    light:
      "Only the two channels participating in the current handoff carry low teal light; idle routes remain materially present and dark.",
    workingBehavior:
      "Nexus closes one bounded relay and leaves two unnecessary routes visibly dormant, showing orchestration through restraint.",
    spatialRhythm:
      "Four equal approaches, bounded center, no superior axis, ample stop-space between handoffs.",
  },
  prismatic: {
    silhouette:
      "A faceted aperture on a matte ceramic evidence table, translating one source object into five controlled visual test plates without becoming a rainbow portal.",
    material:
      "Optical crystal, satin black ceramic, vellum-white evidence cards outside the image area, and precision brass calibration edges.",
    light:
      "One neutral source enters; shaped teal, gold, and spectral edge behavior appears only inside the aperture and on the active test plate.",
    workingBehavior:
      "Prismatic compares five render hypotheses against the same source object, rejecting the beautiful plate whose silhouette drifted.",
    spatialRhythm:
      "One source, one aperture, five equal candidates, one clear human decision position.",
  },
  melodia: {
    silhouette:
      "A resonant borosilicate bow suspended over a shallow acoustic vessel, with one countable standing wave visible through material response rather than music-note symbols.",
    material:
      "Clear borosilicate glass, dark walnut bridge, fine silver tension wire, and a mineral-water resonance basin.",
    light:
      "Low warm side light reveals vibration nodes; one quiet gold node brightens where story and motif agree.",
    workingBehavior:
      "Melodia adjusts one tension point until a recurring story motif resonates across sound, shape, and pacing without becoming a logo.",
    spatialRhythm:
      "Long arc, repeated intervals, deliberate silence around the active node.",
  },
  motio: {
    silhouette:
      "A segmented orbital track with three physically distinct states of one object; motion is legible through spacing, hinge angle, and consequence rather than speed blur.",
    material:
      "Brushed magnesium segments, dark ceramic bearings, linen motion markers, and one teal counterweight.",
    light:
      "Directional light shifts across the three states while the environment remains stable; no neon trail.",
    workingBehavior:
      "Motio removes one decorative movement and retimes the remaining transition so the changed state becomes unmistakable.",
    spatialRhythm:
      "Before, transition, after; asymmetric timing with a stable visual anchor.",
  },
  formis: {
    silhouette:
      "A modular relief-tile system shown coherently at interface, book, and physical-object scales, each retaining the same corner, aperture, and spacing law.",
    material:
      "Pressed fiber, matte ceramic, anodized aluminum, and tactile paper with restrained teal registration edges.",
    light:
      "Broad neutral studio light proves form across materials; one grazing beam reveals relief depth.",
    workingBehavior:
      "Formis swaps one module across three surfaces and preserves character while the scale and material change.",
    spatialRhythm:
      "Repeatable grid with one sanctioned break; consistent intervals across scales.",
  },
  chronica: {
    silhouette:
      "A ring-bound mechanical timeline whose event plates connect to visible downstream consequence loops; no floating clocks or nostalgic scrolls.",
    material:
      "Inked linen strips, oxidized silver rings, archival paper, and dark wood registration blocks worn by handling.",
    light:
      "A warm archival beam follows one changed event into three later consequences; the rest stays quietly legible.",
    workingBehavior:
      "Chronica moves one corrected event plate and the downstream rings realign, revealing exactly which later claims must change.",
    spatialRhythm:
      "Linear time crossed by sparse causal loops; clear before-and-after reading direction.",
  },
  veritas: {
    silhouette:
      "A clear-edged standing mirror between a physical source object and three claim plates; only supported claims produce a complete reflection.",
    material:
      "Low-iron glass, pale stone base, blackened silver edge, and uncoated paper evidence plates.",
    light:
      "Neutral daylight exposes every edge; an unsupported claim falls into ordinary shadow rather than supernatural darkness.",
    workingBehavior:
      "Veritas rotates the mirror until one polished but unsupported claim disappears and the qualified statement remains.",
    spatialRhythm:
      "Source, lens, claim; three calm planes with no courtroom theatrics.",
  },
  lexicon: {
    silhouette:
      "A three-strata language wheel aligning source term, operational meaning, and public translation through one exact aperture; no generated glyph soup.",
    material:
      "Ivory-toned ceramic rings, charcoal inlay, brushed silver axle, and one teal alignment notch.",
    light:
      "A narrow top light makes the accepted alignment readable as geometry, never as mystical runes.",
    workingBehavior:
      "Lexicon turns the three rings until one term preserves meaning across canon, interface, and teaching context.",
    spatialRhythm:
      "Three concentric strata, one aperture, disciplined radial intervals.",
  },
  poetica: {
    silhouette:
      "A single tensioned filament of light suspended between two heavy material anchors, compressing a larger field of meaning into one memorable line.",
    material:
      "Dark stone anchors, fine silver wire, handmade paper, and a barely luminous warm-gold filament.",
    light:
      "The filament illuminates only the two anchor faces it connects; no floral aura, stars, or decorative particles.",
    workingBehavior:
      "Poetica removes every ornamental strand until one line still carries the character contradiction without explaining it away.",
    spatialRhythm: "Long silence, two anchors, one exact tension line.",
  },
  oracle: {
    silhouette:
      "A horizon astrolabe aligning primary-source plates, counterexamples, and a translucent uncertainty band; never a crystal ball or all-seeing eye.",
    material:
      "Patinated brass arcs, optical glass, pale limestone datum, and black paper source tabs.",
    light:
      "Cool horizon light reveals the uncertainty band while sources remain materially distinct and countable.",
    workingBehavior:
      "Oracle widens the uncertainty band after a counterexample enters the instrument, preventing a premature answer from hardening.",
    spatialRhythm:
      "Low horizon, nested arcs, visible room for what is not known.",
  },
  analytica: {
    silhouette:
      "A calibrated ten-notch balance with three physical hard-floor stops and a set of equal candidate plates; score and veto remain visibly different mechanisms.",
    material:
      "Black steel beam, white ceramic notches, etched brass calibration, and matte candidate plates without text.",
    light:
      "Even evaluation light with one teal datum and three restrained gold hard-floor markers; no casino dashboard glow.",
    workingBehavior:
      "Analytica stops a high-total candidate at the anatomy floor, making the veto visible instead of averaging it away.",
    spatialRhythm:
      "Ten equal measures, three immovable stops, one evidence tray held apart from the verdict.",
  },
  memoria: {
    silhouette:
      "A layered archive key whose nested plates carry source, hash, decision, and supersession grooves; a replacement can slide in without erasing the parent.",
    material:
      "Dark nickel, translucent mica, archival vellum, and one worn brass indexing spine.",
    light:
      "A thin teal line travels only through plates whose lineage verifies; superseded plates remain visible in warm ambient light.",
    workingBehavior:
      "Memoria inserts a revised plate beside—not over—the prior record and closes the key only when both lineage and replacement are readable.",
    spatialRhythm:
      "Nested layers, offset tabs, continuous spine, no infinite-library spectacle.",
  },
  futura: {
    silhouette:
      "A branching path prism with reversible hinges and three materially different option paths, each preserving a visible return route.",
    material:
      "Optical glass branch, blackened brass hinges, matte stone base, and removable pale-wood option markers.",
    light:
      "Neutral light enters the shared trunk; restrained spectral edges reveal divergence without suggesting prophecy.",
    workingBehavior:
      "Futura folds one irreversible branch closed, strengthens two reversible paths, and leaves the learning route visibly open.",
    spatialRhythm:
      "Shared trunk, three asymmetric futures, explicit return paths and unused space.",
  },
};

const agents = agentSeeds.map((seed, index) => {
  const [
    id,
    name,
    domain,
    epithet,
    instrument,
    oneLiner,
    purpose,
    perspective,
    outputs,
    stopConditions,
  ] = seed;
  const visualProfile = agentVisualProfiles[id];
  if (!visualProfile) throw new Error("Missing visual profile for " + id + ".");
  const publicPath = `/downloads/arcanea-constellation/${id}`;
  return {
    id,
    name,
    order: index + 1,
    domain,
    epithet,
    oneLiner,
    purpose,
    perspective,
    instrument,
    inputs: [
      "a bounded creator intention",
      "approved source material",
      "explicit constraints and release state",
    ],
    outputs,
    capabilities:
      domain === "Creative"
        ? [
            "translate narrative intent into a medium-specific contract",
            "preserve identity across variants",
            "record critique and revision evidence",
          ]
        : domain === "Development"
          ? [
              "define executable boundaries",
              "produce inspectable artifacts",
              "verify acceptance conditions",
            ]
          : domain === "Writing"
            ? [
                "protect character and claim integrity",
                "shape distinct language",
                "record canon impact",
              ]
            : [
                "gather evidence",
                "state uncertainty",
                "turn findings into a decision instrument",
              ],
    skillRefs:
      id === "prismatic"
        ? [
            "$arcanea-visual-director",
            "$imagegen",
            "$arcanea-creative-worlds:visual-quality-critic",
          ]
        : [`$arcanea-${id}`, "$arcanea-canon-director"],
    routes:
      id === "prismatic"
        ? [
            "identity-contract",
            "style-benchmark",
            "prompt-compile",
            "visual-review",
            "release-packet",
          ]
        : ["intake", "source-check", "bounded-work", "self-review", "handoff"],
    stopConditions,
    humanGates: [
      "canon lock or retcon",
      "identity approval",
      "external publication",
      "rights or likeness decision",
      "spend or destructive action",
    ],
    authority: {
      identityState: "existing_public_product_identity",
      runtimeState: "public_blueprint_not_autonomous_authority",
      canLockCanon: false,
      canApproveIdentity: false,
      canPublish: false,
      humanHoldsFinalAuthority: true,
    },
    visualIdentity: {
      state: "proposal_requires_human_identity_lock",
      ...visualProfile,
      motif: instrument,
      avoid: [
        "emoji iconography",
        "generic robot face",
        "superhero armor",
        "rainbow galaxy effects",
        "provider-specific style mimicry",
      ],
    },
    downloads: {
      agent: `${publicPath}/AGENT.md`,
      skill: `${publicPath}/SKILL.md`,
      card: `${publicPath}/agent-card.json`,
    },
    sourceRefs: pinSourceRefs([
      agentSource,
      ".arcanea/lore/CANON_LOCKED.md#terminology-locked",
    ]),
  };
});

const domains = ["Development", "Creative", "Writing", "Research"].map(
  (domain) => ({
    id: slug(domain),
    name: domain,
    agentIds: agents
      .filter((agent) => agent.domain === domain)
      .map((agent) => agent.id),
    operatingRule:
      "Activate only the smallest capable set; every route ends at an inspectable human decision surface.",
  }),
);

const constellation = {
  meta: {
    schema: "arcanea.living_constellation.v1",
    version: VERSION,
    generatedAt: `${DATE}T00:00:00.000Z`,
    status: "public-safe-blueprint",
    sourceOfTruth:
      "versioned Git artifacts generated by scripts/build-arcanea-living-constellation.mjs",
    truthBoundary:
      "The 16 names are existing public product identities. Their dossiers and visual forms are proposals, not locked mythology or proof of autonomous runtime deployment.",
  },
  visualDirector: {
    operationalId: "arcanea-visual-director",
    publicFaceAgentId: "prismatic",
    skillRef: visualSkill,
    mandate:
      "Own the governed path from source evidence to identity contract, prompt compilation, adaptive review, provenance receipt, and release proposal.",
    authority:
      "May prepare and reject drafts. May not lock canon, approve identity, spend, or publish without a human gate.",
  },
  domains,
  agents,
  routing: {
    defaultCouncil: ["prismatic", "chronica", "analytica", "memoria"],
    optionalSpecialist:
      "Add at most one medium or story specialist when the campaign requires it.",
    approvalPath: [
      "source check",
      "identity contract",
      "ten-image round",
      "independent scoring",
      "human selection",
      "provenance receipt",
      "release proposal",
    ],
  },
};

const styles = [
  {
    id: "living-codex",
    name: "Living Codex",
    hypothesis:
      "Editorial field-guide rigor plus tactile painted realism makes Arcanea feel authored, collectible, and inspectable.",
    direction:
      "museum field plate, restrained vellum-like ground, blank marginal breathing room reserved for off-image annotation, tactile painted realism, crisp silhouette, material truth, one localized impossible behavior",
    avoid: [
      "aged parchment cosplay",
      "fantasy trading-card clutter",
      "ornamental borders",
      "sepia wash",
      "illegible pseudo-text",
    ],
  },
  {
    id: "prism-realism",
    name: "Prism Realism",
    hypothesis:
      "Cinematic naturalism with shaped spectral light can carry wonder without sacrificing believable anatomy or emotion.",
    direction:
      "cinematic tactile naturalism, physically plausible surfaces, controlled lens depth, shaped colored light only where story requires it, quiet emotional presence",
    avoid: [
      "generic movie-poster grading",
      "excess bloom",
      "neon cyberpunk",
      "beauty retouching",
      "empty spectacle",
    ],
  },
  {
    id: "luminous-atelier",
    name: "Luminous Atelier",
    hypothesis:
      "Restrained painterly romanticism gives characters warmth and mythic intimacy while remaining adult and specific.",
    direction:
      "restrained painterly realism, visible but disciplined brush intelligence, classical value structure, contemporary character specificity, atmospheric edges",
    avoid: [
      "pre-Raphaelite imitation",
      "ethereal sameness",
      "soft-focus faces",
      "costume pastiche",
      "decorative magic",
    ],
  },
  {
    id: "ritual-brutalism",
    name: "Ritual Brutalism",
    hypothesis:
      "Monolithic material systems and negative space can make Arcanea ownable at architecture, artifact, and title scale.",
    direction:
      "monolithic sculptural composition, stone ceramic and metal, severe negative space, architectural light cuts, small human-scale evidence, countable silhouette",
    avoid: [
      "generic dark fantasy",
      "oppressive monochrome",
      "war monument propaganda",
      "unmotivated runes",
      "unreadable scale",
    ],
  },
  {
    id: "mature-feature",
    name: "Mature Feature",
    hypothesis:
      "Stylized dimensional form can support animation, collectibles, and young-adult access without becoming toy-like.",
    direction:
      "mature stylized 3D feature design, graphic planes, tactile materials, expressive posture, believable weight, sophisticated lighting, silhouette-first anatomy",
    avoid: [
      "toy proportions",
      "family-animation house imitation",
      "oversized eyes",
      "plastic skin",
      "comedic mascot energy",
    ],
  },
];

const lockedCanon =
  ".arcanea/lore/CANON_LOCKED.md#tier-2-the-ten-gates--arcanean-gods-locked";
const creatorPacketEvidence = {
  id: "creator-supplied-tenfold-constitution-v1-0-level99",
  label: "ARCANEA_TENFOLD_CONSTITUTION_V1_0_LEVEL99.md",
  authority: "proposal-evidence-not-repo-ssot",
  sha256: "51ead4677134b87e35fd6ded6556dc67f9daa609313bcd9eccc74f6d94de998b",
  bytes: 54406,
  capturedAt: "2026-08-25",
};
const creatorPacket = `creator-supplied/${creatorPacketEvidence.label}#sha256=${creatorPacketEvidence.sha256} (${creatorPacketEvidence.authority})`;

const guardianIdentityUnknowns = [
  "embodiment type and apparent age",
  "facial structure, skin tone, hair, body proportions, and gender expression",
  "garment architecture, maintained objects, and material culture",
  "scale relative to people, architecture, and the bonded Godbeast",
  "cultural or geographic visual language, if any",
];

const guardianReviewRequirements = [
  "Creator selects or rejects the physical identity only after comparative silhouette, portrait, and action studies",
  "Canon review records every accepted physical trait before an identity-master contract is issued",
  "Rights and qualified cultural-origin review are required before using a human reference or culturally specific visual language",
];

const guardians = [
  {
    id: "lyssandria",
    name: "Lyssandria",
    gate: "Foundation",
    domain: "Earth and survival",
    description:
      "A grounded divine presence whose posture redistributes weight rather than dominating it.",
    storyBeat:
      "At a city wall beginning to split, Lyssandria names the load and permits one sacred section to crack so the living center survives.",
    discoveryFocus:
      "Redistribution must read through stance, leverage, and a moved load marker—not bulk, throne language, or immovable-stone cliché.",
  },
  {
    id: "leyla",
    name: "Leyla",
    gate: "Flow",
    domain: "Creativity and emotion",
    description:
      "A listening presence shaped by cycles, reception, and release rather than watery costume shorthand.",
    storyBeat:
      "Leyla opens a perfect reservoir of unshed grief; condensed memory crosses a phase boundary and returns as rain while she remains present for the anger her choice causes.",
    discoveryFocus:
      "Reception and release must read as an enacted cycle—not a water dress, mermaid silhouette, elemental hair, or generic serenity pose.",
  },
  {
    id: "draconia",
    name: "Draconia",
    gate: "Fire",
    domain: "Power and will",
    description:
      "Disciplined force held just before excess; a maker and sovereign, never a generic warrior queen.",
    storyBeat:
      "Draconia examines a flawless blade that shattered before use, laughs when its hidden brittleness becomes visible, and begins reforging it with one honest seam.",
    discoveryFocus:
      "Power must read through disciplined making and the decision to stop—not armor, a crown, fire hair, domination, or invincible-warrior shorthand.",
  },
  {
    id: "maylinn",
    name: "Maylinn",
    gate: "Heart",
    domain: "Love and healing",
    description:
      "Care expressed as consent and circulation, with a visible habit of asking before acting.",
    storyBeat:
      "Maylinn pauses before severing a healing network that preserved life by taking away choice; the broken bough remains beside her as consent made visible.",
    discoveryFocus:
      "Care must read as invitation, listening distance, and a reversible gesture—not maternal stereotype, saintly glow, forced embrace, or floral-healer costume.",
  },
  {
    id: "alera",
    name: "Alera",
    gate: "Voice",
    domain: "Truth and expression",
    description:
      "Consequential speech embodied through composure, breath, and the willingness to remain after speaking.",
    storyBeat:
      "In the Hall of Accord, Alera speaks one unpolished sentence and stays as the resonance stone exposes the half-truths nearest to her.",
    discoveryFocus:
      "Truth must read through breath, consequence, and staying in relation—not an open-mouth performance, sound-wave halo, singer costume, or punitive authority.",
  },
  {
    id: "lyria",
    name: "Lyria",
    gate: "Sight",
    domain: "Intuition and vision",
    description:
      "Perception with an acknowledged edge; observant rather than omniscient, reflective rather than clairvoyant cliché.",
    storyBeat:
      "Lyria maps the visible flood path, marks the hard edge of her aperture, and leaves the unseen consequence visibly unresolved rather than claiming certainty.",
    discoveryFocus:
      "Sight must read through a bounded field, confidence mark, and admitted blind edge—not a third eye, prophecy smoke, galaxy irises, or omniscient gaze.",
  },
  {
    id: "aiyami",
    name: "Aiyami",
    gate: "Crown",
    domain: "Enlightenment",
    description:
      "Illumination that lowers itself to meet another at eye level; no crown-as-status shorthand.",
    storyBeat:
      "Aiyami bows until her eyes meet a novice's and redirects one narrow dawn beam into the novice's working hands—enough light for one difficult task.",
    discoveryFocus:
      "Illumination must read as shared capacity and lowered posture—not a literal crown, enlightenment halo, white-robed guru, or elevated savior.",
  },
  {
    id: "elara",
    name: "Elara",
    gate: "Starweave",
    domain: "Perspective and transformation",
    description:
      "A chooser who lets unrealized paths become absent; transformation expressed by consequence, not costume changes.",
    storyBeat:
      "After choosing one road, Elara buries seven small path tokens and makes room to mourn the lives they will no longer become.",
    discoveryFocus:
      "Choice must read through one committed path and seven material absences—not multiverse clones, costume transformations, cosmic portals, or reversible spectacle.",
  },
  {
    id: "ino",
    name: "Ino",
    gate: "Unity",
    domain: "Partnership",
    description:
      "Communion that preserves two distinct wills; paired geometry must never collapse into sameness.",
    storyBeat:
      "Ino dismantles a single synchronized choir and sets two incompatible scores side by side so their makers can commit to one action without sharing one voice.",
    discoveryFocus:
      "Unity must preserve visible difference and two centers of agency—not mirrored twins, fusion, romantic shorthand, a hive mind, or enforced harmony.",
  },
  {
    id: "shinkami",
    name: "Shinkami",
    gate: "Source",
    domain: "Meta-consciousness",
    description:
      "Source as participation without possession; quiet awareness, never an all-solving supreme hero.",
    storyBeat:
      "At the final threshold, Shinkami refuses Malachar's clenched claim, grieves, and does not compel surrender—preserving freedom at real cost.",
    discoveryFocus:
      "Source must read through restraint, an unoccupied threshold, and non-possession—not supreme scale, omnipotent glow, deity throne, or instant resolution.",
  },
].map((guardian, index) => ({
  ...guardian,
  index: index + 1,
  evidenceState:
    "locked-name-gate-domain-creator-proposed-behavior-physical-identity-open",
  openIdentityVariables: guardianIdentityUnknowns,
  reviewRequirements: guardianReviewRequirements,
  sensitivityReviewRequired: false,
  sourceRefs: [lockedCanon, creatorPacket],
}));

const godbeastReviewRequirements = [
  "Creator explicitly accepts, amends, or rejects the tested morphology candidate against locked canon and the local Godbeast record",
  "Identity review records the accepted clade, Chord anatomy, limb count, face and sensory architecture, locomotion, scale, ecology, and material system before issuing a reference master",
  "Grayscale silhouette, orthographic anatomy, action, habitat, and bonded-dyad studies must agree before any public identity approval",
];

const godbeasts = [
  {
    id: "kaelith",
    name: "Kaelith",
    gate: "Foundation",
    chordCount: 1,
    description:
      "Tested morphology candidate — the Ringback: a colossal stone wyrm closed into a load-bearing annulus, with six load-limbs, a face recessed inside the ring, and the single unbroken annulus as its countable Chord.",
    functionalTruth:
      "The local record grounds gravity density, Foundation anchoring, seismic resonance, and the absorption and redistribution of kinetic force; its exact body remains canon-pending.",
    storyBeat:
      "At a city splitting under the pressure of enforced permanence, Kaelith shifts one load-limb at a time and deliberately lets one sacred wall crack so the living centre survives; the annular body makes redistributed load visible rather than merely glowing with power.",
    openIdentityVariables: [
      "annulus thickness, sectional profile, and load-bearing proportions",
      "recessed face, sensory organs, and expression system",
      "geological composition, strata, fractures, and surface wear",
      "absolute scale relative to people, walls, and terrain",
      "locomotion between anchoring acts, habitat, and ecological effect",
    ],
  },
  {
    id: "veloura",
    name: "Veloura",
    gate: "Flow",
    chordCount: 2,
    description:
      "Locally grounded base form with tested detail candidate — the Phase Wyrm, a Phoenix-Serpent whose two distinct Chord terminals are one condensing feather-fin and one ember edge that ignites only at phase boundaries.",
    functionalTruth:
      "The local record grounds the Phoenix-Serpent base form, constant transformation, emotional resonance, memory currents, and liquid-at-rest or solid-under-pressure material behavior.",
    storyBeat:
      "Inside a reservoir where unmoved memory has thickened into poison, Veloura enters as phase change rather than conquest: one terminal condenses what can no longer flow while the other ignites the boundary, returning the held water to rain.",
    openIdentityVariables: [
      "serpentine body proportions and phoenix-derived anatomy beyond the two terminals",
      "face, sensory architecture, and non-humanoid expression system",
      "feather-fin construction, ember-edge material, and phase boundary behavior",
      "absolute scale, locomotion, and relationship to water and air",
      "habitat, ecological role, and the visible limits of stored emotional memory",
    ],
  },
  {
    id: "draconis",
    name: "Draconis",
    gate: "Fire",
    chordCount: 3,
    description:
      "Tested morphology candidate — the Solar Crucible: a wingless, six-limbed, ceramic-plated draconic progenitor with a recessed mask-face, furnace ribcage, and exactly three functionally distinct temper vanes.",
    functionalTruth:
      "The local record grounds will amplification, sacred forging flame, material tempering, and draconic sovereignty; its exact body remains canon-pending.",
    storyBeat:
      "Beside a flawless blade that shattered before use, Draconis breathes once through its furnace ribs until the old fracture line glows white; the three temper vanes register the brittleness that existed before the break, exposing material truth rather than attacking.",
    openIdentityVariables: [
      "ceramic plate geometry, joinery, wear, and thermal response",
      "recessed mask-face, sensory organs, and posture-based expression",
      "six-limb proportions, stance, and locomotion without membrane wings",
      "temper-vane placement and three distinct material functions",
      "absolute scale, forge ecology, and relationship to later draconids",
    ],
  },
  {
    id: "laeylinn",
    name: "Laeylinn",
    gate: "Heart",
    chordCount: 4,
    description:
      "Locally grounded base form with tested detail candidate — a Worldtree Deer and scion of Enarys, bearing four countable canopy boughs with one visibly self-broken bough that is never regrown.",
    functionalTruth:
      "The local record grounds the Worldtree Deer base form, living-crystal growth, self-healing material, organic bonding without corruption, and Heart resonance.",
    storyBeat:
      "When a healing network begins to erase the agency of those bound into it, Laeylinn breaks one of its own four canopy boughs and refuses to regrow it; the other three remain living, making consent and cost legible without spectacle.",
    openIdentityVariables: [
      "cervid proportions, hoof architecture, face, and sensory system",
      "canopy geometry and the spatial relation of the three living and one broken bough",
      "scale and specificity of the sparse ecosystems hosted by the canopy",
      "living-crystal, bark, tissue, and healed-fracture material language",
      "absolute scale, gait, habitat, and ecological relationship to Enarys",
    ],
  },
  {
    id: "otome",
    name: "Otome",
    gate: "Voice",
    chordCount: 5,
    description:
      "Tested morphology candidate — the Resonance Leviathan: a non-aquatic pressure-being with no conventional whale head, one concentrated eye, and exactly five functionally distinct tuning ribs that alter pressure and architecture.",
    functionalTruth:
      "The local record grounds creation-frequency resonance, truth enforcement, voice amplification, and a material correspondence that shatters near lies; its exact body remains canon-pending.",
    storyBeat:
      "In a hall saturated with polished half-truths, Otome gives one measured call; pressure travels through exactly five tuning ribs and shatters only the resonance stone carrying the lies nearest Alera herself, leaving people and honest architecture untouched.",
    openIdentityVariables: [
      "leviathan body plan beyond the headless thorax candidate",
      "single-eye placement, sensory field, and expression system",
      "five-rib placement, geometry, and distinct acoustic or pressure functions",
      "surface material, structural suspension, and non-aquatic locomotion",
      "absolute scale, habitat, ecology, and safe pressure boundary",
    ],
  },
  {
    id: "yumiko",
    name: "Yumiko",
    gate: "Sight",
    chordCount: 6,
    description:
      "Tested morphology candidate — the Aperture Owl-Serpent: a six-segment non-draconic body with a non-avian face, still forward eyes, and a peripheral sensory mantle; extraordinary behavior is limited to occlusion and aperture.",
    functionalTruth:
      "The local record grounds perception refraction, intention revelation, and intuitive vision while explicitly leaving the physical form canon-pending.",
    storyBeat:
      "At the edge of a flood decision, Yumiko folds its six-segment body behind one architectural arch so only head, tail, or relation can be seen at a time; the occlusion teaches the edge of perception without prophecy effects or omniscient spectacle.",
    openIdentityVariables: [
      "owl-serpent body proportions and the joints between six aperture segments",
      "non-avian face, forward-eye construction, and peripheral sensory mantle",
      "the distinct plane occluded by each segment and how that remains visually countable",
      "surface material, locomotion, and the physical rule of perception refraction",
      "absolute scale, habitat, ecology, and relationship to built apertures",
    ],
  },
  {
    id: "sol",
    name: "Sol",
    gate: "Crown",
    chordCount: 7,
    description:
      "Conflicted morphology candidate — the Heliostat: a compact lens-bodied draconid with one emotionally readable eye and exactly seven radial lens plates; the proposal specifies four limbs while its own proposed draconic-clade law requires six.",
    functionalTruth:
      "The local record grounds immense energy storage, redirected radiance, enlightenment resonance, and volatile white-light overcharge while explicitly leaving the physical form canon-pending.",
    storyBeat:
      "A novice asks only for enough light to finish one difficult task; Sol redirects one narrow dawn beam through seven radial plates into the novice's hands, showing illumination as service rather than crown, explosion, worship, or limitless power.",
    openIdentityVariables: [
      "resolved limb count and whether Sol remains inside the proposed draconic clade",
      "lens-body proportions, plate attachment, and locomotion",
      "single-eye architecture and non-mascot emotional readability",
      "material system for stored, redirected, and overcharged light",
      "absolute scale, habitat, ecology, and safe energy boundary",
    ],
    conflict:
      "Creator packet conflicts internally: the proposed draconic clade requires six limbs while the Sol morphology row specifies four.",
  },
  {
    id: "vaelith",
    name: "Vaelith",
    gate: "Starweave",
    chordCount: 8,
    description:
      "Tested morphology candidate — the Eightfold Parallax Fox, the pantheon's only fox, with exactly eight functionally distinct path-tails and no masks, shrine iconography, wisp-fire, or ninth tail.",
    functionalTruth:
      "The local record grounds partial existence outside spacetime, matter phasing, perspective shifting, and reality-boundary walking while explicitly leaving the physical form canon-pending.",
    storyBeat:
      "At a decision split into eight still-living alternatives, Vaelith lays one path-tail across each road; when Elara chooses, the fox withdraws seven and leaves a simple grave marker for the unchosen lives, making consequence visible without portal spectacle.",
    openIdentityVariables: [
      "fox body proportions, cranial architecture, and non-domestic expression",
      "eight tail silhouettes and the distinct path function of each",
      "surface material and the physical boundary between matter and phase",
      "locomotion and spatial continuity when partially outside spacetime",
      "absolute scale, habitat, ecology, and culturally neutral visual language",
    ],
  },
  {
    id: "kyuro",
    name: "Kyuro",
    gate: "Unity",
    chordCount: 9,
    description:
      "Tested morphology candidate — the Bridge: one arched body with two opposite-facing heads of tigrine cranial architecture, nine countable pillar-limbs, and the shared ninth limb acting as keystone; no tails.",
    functionalTruth:
      "The local record grounds absolute frequency absorption, partnership conditions, silent observation, and total reception while explicitly leaving the physical form canon-pending.",
    storyBeat:
      "Between two communities whose songs must remain distinct, Kyuro arches into one load-bearing crossing; its two heads face opposite banks and neither turns inward to police the other while nine pillar-limbs carry one shared action through total listening.",
    openIdentityVariables: [
      "arched torso geometry and how two heads belong to one coherent organism",
      "tigrine cranial specificity without mascot, heraldic, or borrowed sacred coding",
      "nine pillar-limb joints, gait, and the anatomy of the shared keystone",
      "frequency-absorbing surface material and non-void-black silence behavior",
      "absolute scale, habitat, ecology, and relationship to traversable architecture",
    ],
  },
  {
    id: "source-convergence",
    name: "Source / Ten-Chorded",
    gate: "Source",
    chordCount: 10,
    description:
      "Unresolved ontology candidate — locked repo canon names Source as Shinkami's Godbeast, while the creator proposal replaces a tenth creature with the relational convergence silhouette of all nine Godbeasts plus the Arc.",
    functionalTruth:
      "The local Source record grounds meta-consciousness, all-element embodiment, Source connection, and participation rather than possession, but leaves the physical form canon-pending.",
    storyBeat:
      "At the final threshold, nine distinct Godbeasts sustain their own rhythms without collapsing into one body; the proposed tenth Chord is the relation among them and the unoccupied Arc, present only as consent—not a separate pet, glamour portrait, or supreme creature.",
    openIdentityVariables: [
      "ontology: separate Source Godbeast versus nine-being convergence",
      "whether any convergence silhouette is visible and under what conditions",
      "how ten countable Chords can be legible without erasing nine distinct identities",
      "material, scale, viewpoint, and duration of a relation rather than a body",
      "the visual boundary between participation, possession, fusion, and ownership",
    ],
    conflict:
      "Locked repo canon names Source as Shinkami's Godbeast; the creator proposal says Shinkami has no separate beast and defines a nine-being convergence instead.",
  },
].map((beast, index) => {
  const localSourceId = beast.id === "source-convergence" ? "source" : beast.id;
  const localBaseFormGrounded = ["veloura", "laeylinn"].includes(beast.id);
  return {
    ...beast,
    index: index + 1,
    identityState: beast.conflict
      ? "blocked-canon-reconciliation-required"
      : "morphology-proposal-requires-canon-and-identity-lock",
    evidenceState: beast.conflict
      ? "locked-relation-local-function-proposal-conflict"
      : localBaseFormGrounded
        ? "locked-relation-local-base-form-and-function-grounded-proposed-detail-morphology"
        : "locked-relation-local-function-grounded-physical-form-pending-proposed-morphology",
    openIdentityVariables: beast.openIdentityVariables,
    reviewRequirements: godbeastReviewRequirements,
    sensitivityReviewRequired: false,
    sourceRefs: [
      lockedCanon,
      `.arcanea/lore/godbeasts/${localSourceId}.md`,
      creatorPacket,
    ],
  };
});

const bookCharacters = [
  {
    id: "kael-thornfield",
    name: "Kael Thornfield",
    series: "Chronicles of Arcanea",
    description:
      "Kael is nineteen and six feet tall, though he compresses his posture to take up less space. He has warm deep-brown skin, broad shoulders, close-cropped hair, dark watchful eyes, large calloused hands, and a small white scar across the base of his left thumb. Worn linen and bare feet are more truthful than pristine student robes.",
    storyBeat:
      "Inside the Hollow Root’s reconstruction of Ironhold, Kael kneels beside his father’s silent ghost and selects one reusable stone from the ruined shop instead of fleeing the memory.",
    sourceRefs: [
      "book/chronicles-of-arcanea/series-bible/CHARACTER_BIBLE.md#1-kael-thornfield",
    ],
    evidenceState: "source-complete",
    openIdentityVariables: [],
    reviewRequirements: [],
  },
  {
    id: "mira-tidecrest",
    name: "Mira Tidecrest",
    series: "Chronicles of Arcanea",
    description:
      "Mira is twenty and five-foot-four, with warm medium-brown skin that turns golden in strong light, very dark eyes, and dark salt-waved hair usually pinned back and half-escaped. Line-hauling calluses mark both palms and fingers. Her clothing must remain water-safe and practical; her mother’s fishing cord stays on her left wrist.",
    storyBeat:
      "Wrapped in a thermal blanket after the Memory Pool kept her under, Mira presses her mother’s fishing cord between her fingers and names the frightening possibility that the water has known her name for years.",
    sourceRefs: [
      "book/chronicles-of-arcanea/series-bible/CHARACTER_BIBLE.md#2-mira-tidecrest",
    ],
    evidenceState: "source-complete",
    openIdentityVariables: [],
    reviewRequirements: [],
  },
  {
    id: "ash",
    name: "Ash",
    series: "Chronicles of Arcanea",
    description:
      "Ash is eighteen, lean and wiry from years of missed meals and street survival, with medium olive skin that tans dark, short dark hair, and amber-brown eyes. Burn scars cross his right forearm and the back of his right hand. He wears no jewelry and keeps one folded private paper in an inner pocket. Every movement carries economical readiness.",
    storyBeat:
      "At the edge of a Cinderwall room, Ash locates every exit before sitting, one scarred hand guarding the folded paper he never shows while a controlled coal gives warmth rather than destruction.",
    sourceRefs: [
      "book/chronicles-of-arcanea/series-bible/CHARACTER_BIBLE.md#3-ash",
    ],
    evidenceState: "source-complete",
    openIdentityVariables: [],
    reviewRequirements: [],
  },
  {
    id: "sable-luminaire",
    name: "Sable Luminaire",
    series: "Chronicles of Arcanea",
    description:
      "Sable is pale from life in aurora-crystal spires, five-foot-seven and slim, with extremely straight black hair arranged precisely over one shoulder and held back elsewhere. Her almost-colorless light-grey eyes are unnervingly still. Clothes, posture, and movement are deliberate. A small deep-indigo almost-closed circle marks the inside of her right wrist.",
    storyBeat:
      "Sable holds one precise Void working at the edge of a quiet study while another person speaks; her still attention and the nearly closed indigo wrist mark carry more weight than the phenomenon.",
    sourceRefs: [
      "book/chronicles-of-arcanea/series-bible/CHARACTER_BIBLE.md#4-sable-luminaire",
    ],
    evidenceState: "source-complete",
    openIdentityVariables: [],
    reviewRequirements: [],
  },
  {
    id: "elio-songwright",
    name: "Elio Songwright",
    series: "Chronicles of Arcanea",
    description:
      "Elio is twenty-one, medium height and slender, with structural dark circles, a soft approachable face, wide-set warm-brown eyes, an expressive mouth, and untidy dark hair. His seated posture is musician-straight and he leans forward when listening. String calluses mark his left fingertips. Four comfortable outfits matter less to him than his seven instruments.",
    storyBeat:
      "Elio crosses a room and simply sits beside someone whose loneliness others have organized themselves not to see; one string instrument rests nearby, unused, because complete attention is the action.",
    sourceRefs: [
      "book/chronicles-of-arcanea/series-bible/CHARACTER_BIBLE.md#5-elio-songwright",
    ],
    evidenceState: "source-complete",
    openIdentityVariables: [],
    reviewRequirements: [],
  },
  {
    id: "selene-velara",
    name: "Selene Velara",
    series: "Las Tierras de Luz",
    description:
      "Selene is a nineteen-year-old Caracas-born Venezuelan linguistics student of Venezuelan and Avilaran lineage. She is medium height, with brown skin that turns faintly gold at summer’s end and dark hair to her shoulder blades. Her grandmother’s small gold cross remains at her neck. Niebla, a silver cat, is her companion; prismatic destellos are perceived phenomena, not decorative aura.",
    storyBeat:
      "At her grandmother’s exact kitchen table inside the Foundation Trial, Selene names the light around long-loved objects until the denied room begins to breathe and the amber-rose chamber key rises.",
    sourceRefs: [
      "book/las-tierras-de-luz/BIBLE.md#protagonist--selene-velara-locked",
      "book/las-tierras-de-luz/BIBLE.md#sensitivity--inclusion-protocol",
    ],
    evidenceState: "source-complete-review-required",
    openIdentityVariables: [],
    reviewRequirements: [
      "A paid Venezuelan-Spanish woman reader with diaspora experience reviews cultural, clothing, place, family, and religious-symbol framing before approval.",
      "The visual must not borrow Indigenous Venezuelan clothing, symbols, gestures, or sacred architecture as Avilaran decoration.",
    ],
    sensitivityReviewRequired: true,
  },
  {
    id: "lysara-sablecourt",
    name: "Lysara Sablecourt",
    series: "The Hall of White",
    description:
      "Lysara is fifty-two, an Arcan and Spirit-aligned hexachrome whose halo fills about seven-tenths of each iris in layered concentric colors; the underlying hazel has not appeared uncolored since age twenty-four. Her presence is spare, precise, dry, and kind. The manuscript does not yet lock skin, hair, body build, or clothing silhouette.",
    storyBeat:
      "After an eleven-minute Source-state, Lysara sits beside Sifre in the Wellspring and watches the old deer breathe without trying to interpret the stone-hum in her bones.",
    sourceRefs: ["book/the-hall-of-white/BIBLE.md#lysara-sablecourt"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "hair color, texture, and arrangement",
      "body build and height",
      "Order clothing silhouette and wear pattern",
    ],
    reviewRequirements: [],
  },
  {
    id: "reni-voss",
    name: "Reni Voss",
    series: "The Hall of White",
    description:
      "Reni is twenty-two, Gate-Touched, and three years into Lysara’s mentorship. A faint, untrained sub-red halo forms an inner iris ring. She studies the Order while the Order studies her; the image must hold grief, vigilance, and future capacity without converting her history into fire spectacle. The manuscript does not yet lock face, skin, hair, body, or clothing.",
    storyBeat:
      "Reni completes her first deliberate sub-red draft in the Hall with a properly fitted Yumiko-Prism lens while Lysara witnesses without taking the action away from her.",
    sourceRefs: ["book/the-hall-of-white/BIBLE.md#aspirant-reni-voss"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "hair color, texture, and arrangement",
      "body build and height",
      "Aspirant clothing silhouette and personal wear",
    ],
    reviewRequirements: [],
  },
  {
    id: "aranya",
    name: "Aranya",
    series: "The Hall of White",
    description:
      "Aranya is seventy-three, senior Wellkeeper and institutional voice of Freeing. She is Bonded to Sifre, a forty-one-year-old Laeylinn-touched deer; the bond extends both lives. Her cadence is slow, plain, and shaped by the Wellspring’s stone-hum. The manuscript does not yet lock her face, skin, hair, build, clothing, or Sifre’s exact morphology beyond deer and age.",
    storyBeat:
      "Aranya reads Lysara’s advancing halo in the Wellspring with Sifre breathing nearby, speaking the risk plainly and without adversarial posture or ritual melodrama.",
    sourceRefs: ["book/the-hall-of-white/BIBLE.md#wellkeeper-aranya"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "hair color, texture, arrangement, and age expression",
      "body build and height",
      "Wellkeeper clothing and instrument system",
      "Sifre’s species-specific markings and proportions",
    ],
    reviewRequirements: [],
  },
  {
    id: "veyl-stoneshade",
    name: "Veyl Stoneshade",
    series: "The Hall of White",
    description:
      "Veyl is thirty-eight, the Hall’s Yumiko-Prism lens-shaper and the only documented Cinderfang-Arcan hybrid in current Order records. Her rare wolf form is small and white. She knows bodies through lens wear and offers Lysara a seven-band lens without coercion. Her human face, skin, hair, build, clothing, and hybrid markers are not yet locked.",
    storyBeat:
      "Alone in the lens workshop, Veyl turns a seven-band Yumiko-Prism lens so its twice-refined silver junction thread becomes materially legible before placing the choice in Lysara’s reach.",
    sourceRefs: ["book/the-hall-of-white/BIBLE.md#veyl-stoneshade"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "human-form skin tone and facial structure",
      "hair color, texture, and arrangement",
      "body build and height",
      "visible Cinderfang-Arcan hybrid markers",
      "lens-shaper clothing and workshop protection",
    ],
    reviewRequirements: [],
  },
  {
    id: "tezerin-halevant",
    name: "Tezerin Halevant",
    series: "The Hall of White",
    description:
      "Tezerin is sixty-one, Arcan, House Synthesis trained, and a five-color polychrome who approached Prism State three times without reaching it. As Aspirant-Master, he embodies institutional caution and a thirty-year friendship with Lysara. The manuscript does not yet lock his face, skin, hair, body, or clothing silhouette.",
    storyBeat:
      "At Dusk in the Hall of White, Tezerin asks Lysara to accept Freeing, then weeps when she releases the Order from imagined debt; the scene is friendship under institutional pressure, not confrontation.",
    sourceRefs: ["book/the-hall-of-white/BIBLE.md#master-tezerin-halevant"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "hair color, texture, arrangement, and age expression",
      "body build and height",
      "Aspirant-Master clothing silhouette and personal wear",
    ],
    reviewRequirements: [],
  },
  {
    id: "erivar",
    name: "Erivar",
    series: "Forge of Ruin",
    description:
      "Erivar is in his late thirties, very large in the northern way, with extensive black-veined hands and forearms that reveal a long-bonded Mawfather inheritance. He knows an eight-foot chained circuit by touch and counts everything. The manuscript does not yet lock skin, face, hair, precise height, clothing construction, or protective gear.",
    storyBeat:
      "In the cellar, Erivar runs one black-veined hand along the exact eight-foot chain circuit and counts the names he can still hold, resisting the inheritance through method rather than heroic rage.",
    sourceRefs: ["book/forge-of-ruin/BIBLE.md#erivar-skaldson"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "hair color, texture, and arrangement",
      "precise height and body proportions",
      "work clothing, restraints, and protective wear",
    ],
    reviewRequirements: [],
  },
  {
    id: "bryda",
    name: "Bryda",
    series: "Forge of Ruin",
    description:
      "Bryda is in her late thirties, broad-shouldered, and built by twenty years of hammer work; her hands and forearms are a smith’s evidence, not ornamental strength. She carries her own weight without apology and makes chains, plows, hinges, latches, and cook-pots—not magical weapons. Face, skin, hair, height, and clothing remain open.",
    storyBeat:
      "At her ordinary forge, Bryda sets down the unfinished chain and opens both work-shaped hands before choosing what her craft will no longer maintain.",
    sourceRefs: ["book/forge-of-ruin/BIBLE.md#bryda-halfmourning"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "hair color, texture, and forge-safe arrangement",
      "precise height and body proportions",
      "smith clothing, apron, and protective wear",
    ],
    reviewRequirements: [],
  },
  {
    id: "sigveld",
    name: "Sigveld",
    series: "Forge of Ruin",
    description:
      "Sigveld is in his late fifties: tall, close-cropped iron-grey hair, pale steady eyes, a soft voice, Compact black clothing, and one steel collar pin. His competence and error must coexist; he is not a villain, and visual severity cannot become fascist glamour. Skin tone, facial structure, exact height, and garment construction remain open.",
    storyBeat:
      "Sigveld stands over an inhuman deployment calculation and quietly refuses to execute it, removing the single steel collar pin as an institutional act rather than a redemption pose.",
    sourceRefs: ["book/forge-of-ruin/BIBLE.md#sigveld-the-architect"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "precise height and body proportions",
      "Compact garment construction and regional material language",
    ],
    reviewRequirements: [],
  },
  {
    id: "raskvorn",
    name: "Raskvorn",
    series: "Forge of Ruin",
    description:
      "Raskvorn is in his mid-fifties and large like Erivar but emptied: pit-like eyes, an unnaturally still stance, intact reflexes, and no speech. One hand always holds a small wooden fox whose shape survives in muscle memory. He must not read as tragic nobility, undead spectacle, or monstrous villain. Face, skin, hair, and clothing remain open.",
    storyBeat:
      "At the Mawfather’s Throat, Raskvorn turns toward Alna’s distant voice rather than attacking; the wooden fox stays legible in his hand and the moment remains a fragment of listening, not a cure.",
    sourceRefs: ["book/forge-of-ruin/BIBLE.md#raskvorn-the-hollow"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "hair color, texture, arrangement, and age expression",
      "precise height and body proportions",
      "clothing, wear, and parasite-line markers",
    ],
    reviewRequirements: [],
  },
  {
    id: "odre",
    name: "Odre",
    series: "Forge of Ruin",
    description:
      "Odre is twenty-four when assigned to the chronicle, small and quick, with ink-stained fingers, two satchels of blank-paged ledgers, and Chronicle Hall greys. They witness rather than decorate violence, and their record is ordinary ink rather than a magical artifact. Face, skin, hair, exact build, and garment construction remain open.",
    storyBeat:
      "After Fellgate, Odre reads Erivar’s own chronicle back to him and restores memory from ordinary ink, visibly ending the fiction of neutral observation without turning the ledger into magic.",
    sourceRefs: ["book/forge-of-ruin/BIBLE.md#odre-flachmark"],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "skin tone and facial structure",
      "hair color, texture, and arrangement",
      "precise height and body proportions",
      "Chronicle Hall garment construction and satchel design",
    ],
    reviewRequirements: [],
  },
  {
    id: "korvash",
    name: "Korvash",
    series: "Heart of Pyrathis",
    description:
      "Korvash is twenty, a cold-born Cinderfang adult from Kaldros who has never shifted. In base form they wear wrapped training leathers; ember-veins under the skin are usually dark and later pulse faint amber in answer to the dying Dragon’s Spine. The BIBLE uses they/them while drafted chapters use he/him, and face, skin, hair, build, and final Heartbound form remain unresolved.",
    storyBeat:
      "On the caldera rim, Korvash keeps both hands on warm obsidian as a faint amber rhythm persists in their forearm veins after the dying mountains call specifically to them.",
    sourceRefs: [
      "book/heart-of-pyrathis/BIBLE.md#character-dossiers",
      "book/heart-of-pyrathis/chapters/01-the-cold-season.md",
      "book/heart-of-pyrathis/BIBLE.md#sensitivity-protocol",
    ],
    evidenceState: "source-conflict-review-gated",
    openIdentityVariables: [
      "pronoun and gender identity continuity across BIBLE and chapters",
      "skin tone and facial structure",
      "hair color, texture, and arrangement",
      "base-form height and body proportions",
      "Heartbound and unprecedented shifted morphology",
    ],
    reviewRequirements: [
      "Creator resolves the BIBLE/chapter pronoun conflict before an identity image is generated.",
      "A qualified reader with relevant disability or neurodivergence lived experience reviews the prompt framing before generation and any public use.",
    ],
    sensitivityReviewRequired: true,
    blockedReason:
      "The BIBLE uses they/them while drafted chapters use he/him, and the never-shifted condition is an explicit disability/neurodivergence analogue. Resolve the identity record and complete qualified lived-experience prompt review before generation.",
  },
  {
    id: "solenne",
    name: "Solenne",
    series: "Heart of Pyrathis",
    description:
      "Solenne is a Celestine exile carrying her dead partner’s maps and a pale-blue crystallized-starlight Shard-Blade. Her competence masks stellar grief; she confronts her people’s destruction of a living world and ultimately chooses mortal responsibility on Pyrathis. Species morphology, age, face, skin, hair, build, clothing, and Celestine material language remain open.",
    storyBeat:
      "At the Mirror Lava Fields, Solenne uses her dead partner’s corrected map to save the group, then faces a reflected memory without converting grief into ethereal beauty.",
    sourceRefs: [
      "book/heart-of-pyrathis/BIBLE.md#character-dossiers",
      "book/heart-of-pyrathis/outline/story-architecture.md",
    ],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "Celestine species morphology and age expression",
      "skin tone and facial structure",
      "hair color, texture, and arrangement",
      "body build and height",
      "Celestine clothing, maps, and tool material language",
    ],
    reviewRequirements: [],
  },
  {
    id: "pyrrik",
    name: "Pyrrik",
    series: "Heart of Pyrathis",
    description:
      "Pyrrik is a young lava dragon, frightened and funny through behavior rather than mascot styling. He is also a fragment of the First Fire’s dream, yet his lived bonds remain real. The source locks emotional function and lava-dragon taxonomy—flowing, molten, liquid thought—but not age-equivalent, size, limbs, wings, horns, face, scale structure, or precise material anatomy.",
    storyBeat:
      "In the Cold Chamber, Pyrrik’s fire has gone out and Korvash carries him across absolute volcanic death; fear, weight, and mutual trust must read before comedy or flame effects.",
    sourceRefs: [
      "book/heart-of-pyrathis/BIBLE.md#character-dossiers",
      "book/heart-of-pyrathis/outline/story-architecture.md#dragon-taxonomy",
    ],
    evidenceState: "source-partial",
    openIdentityVariables: [
      "age-equivalent and body scale",
      "limb, wing, horn, and tail counts",
      "facial anatomy and expression range",
      "scale, magma, and cooling-crust material anatomy",
    ],
    reviewRequirements: [],
  },
  {
    id: "an-van-linh",
    name: "An",
    series: "Song of Van Linh",
    description:
      "An is the Unity-rooted protagonist called the Girl Who Heard the River. Before awakening she senses animal emotion and place resonance; the four-book arc moves from Sensitivity toward Listening, Speaking, and Bridging. The BIBLE explicitly marks detailed character files unreviewed and does not provide a trustworthy physical identity lock for visual generation.",
    storyBeat:
      "The eventual visual should show An listening to a river as a specific living ecology rather than posing with Vietnamese myth as scenery; no scene is authorized until the human review protocol is fulfilled.",
    sourceRefs: [
      "book/song-of-van-linh/BIBLE.md#sensitivity-protocol--non-negotiable",
      "book/song-of-van-linh/BIBLE.md#cast--canonical-headlines-from-outline-characters-files-unreviewed",
    ],
    evidenceState: "source-underreview-review-gated",
    openIdentityVariables: [
      "all physical identity traits",
      "age, clothing, place, and family-specific material evidence",
      "the culturally responsible boundary between Earth-Vietnam and Van Linh",
    ],
    reviewRequirements: [
      "Two paid Vietnamese women readers with diaspora and/or in-country experience review the character and visual prompt as the primary cultural gate.",
      "Indigenous Vietnamese traditions require relevant Indigenous-Vietnamese review if Highland material appears.",
    ],
    sensitivityReviewRequired: true,
    blockedReason:
      "Detailed character files are explicitly unreviewed and the BIBLE makes two paid Vietnamese women readers a non-negotiable gate. Complete that review and lock An’s physical identity before visual generation.",
  },
].map((character) => ({
  sensitivityReviewRequired: false,
  blockedReason: null,
  ...character,
}));

const worlds = [
  {
    id: "crystalpeak",
    name: "Crystalpeak",
    readiness: "source-complete",
    canonState: "story_source_defined",
    description:
      "Crystalpeak is the floating upper third of the highest Veil Mountain summit, hovering roughly eight hundred meters above its root and reached by a swaying two-person stone causeway without railing. The Luminary is a millennia-grown crystalline academy rather than one palace: living corridors slowly narrow, seven residential wings catch morning light, and learning spaces expose how material, light, attention, and daily labor work together.",
    storyBeat:
      "At breakfast in the Hall of First Light, the sunrise moves as one slow east-to-west wave across shared student and faculty tables; mismatched student-made ceramic cups, warm bread, light-garden herbs, and the living crystal's mineral wear make education and maintenance legible before wonder.",
    openIdentityVariables: [],
    reviewRequirements: [],
    sourceRefs: [
      "book/chronicles-of-arcanea/series-bible/THE_LUMINARY.md#part-i-architecture",
      "book/chronicles-of-arcanea/series-bible/THE_LUMINARY.md#part-ii-daily-life",
      "book/chronicles-of-arcanea/book-01-the-three-academies/chapter-03-the-crystalpeak.md",
    ],
  },
  {
    id: "avilara",
    name: "Avilara",
    readiness: "source-complete-review-required",
    canonState: "story_source_defined_specialist_review_gate",
    description:
      "Avilara is a warm coastal Realm where Fire and Flow meet at Solavila, a 200,000-person capital built in seven working tiers between the singing Cerro Luminoso and the bioluminescent Mar de Aurora. Coral-pink volcanic stone stays warm and translucent at its edges; dark-blue sea-cliff tile, harbor labor, dye vats, copper shops, inner courtyards, sky gardens, and stairs that hum underfoot form a Caracas-inspired but explicitly non-Earth civic system.",
    storyBeat:
      "At first light, harbor crews unload the Caleta Roja catch while Tier Two artisans open dye vats and copper workshops; breakfast smoke climbs toward the singing stairs, and the Cerro, seven inhabited tiers, and Mar de Aurora remain in one plausible watershed instead of becoming a tropical fantasy postcard.",
    openIdentityVariables: [],
    reviewRequirements: [
      "A paid Venezuelan-Spanish woman reader with diaspora experience reviews architecture, food, labor, language-coded objects, and Caracas resonance before identity approval.",
      "Review confirms that Avilara remains an Arcanean Realm with its own material economy and does not use Indigenous Venezuelan dress, symbols, ritual objects, or sacred architecture as generic fantasy decoration.",
    ],
    sensitivityReviewRequired: true,
    sourceRefs: [
      "book/las-tierras-de-luz/AVILARA.md",
      "book/las-tierras-de-luz/BIBLE.md#sensitivity--inclusion-protocol",
      "book/las-tierras-de-luz/chapters-en/01-avilara-cerro-luminoso.md",
    ],
  },
  {
    id: "pyrathis",
    name: "Pyrathis",
    readiness: "source-complete",
    canonState: "story_source_defined",
    description:
      "Pyrathis is a living volcanic world whose Veinwork makes temperature, ground hum, lava routes, and creature behavior into shared infrastructure. Caldera cities trade along named flows; obsidian forests refract real light; the twenty-seven Dragon's Spine peaks, cold zones, orbital Skyfall Reaches, and species-specific Resonance rules form one ecological crisis moving east to west rather than a generic lava kingdom.",
    storyBeat:
      "At the advancing edge of a cold zone, a six-legged magmaloper herd diverts around newly dead crust while workers compare the fading eye-glow of an Embrite with the Pale Current's reduced heat; wind replaces the Veinwork hum on one side of a materially exact boundary.",
    openIdentityVariables: [],
    reviewRequirements: [],
    sourceRefs: [
      "book/heart-of-pyrathis/worldbuilding/world-bible.md",
      "book/heart-of-pyrathis/BIBLE.md",
    ],
  },
  {
    id: "van-linh",
    name: "Van Linh",
    readiness: "blocked",
    canonState: "source_under_review_specialist_gate",
    description:
      "Van Linh is proposed as Vietnam's remembered animist substrate made manifest: the Breathing Forest, Nine Rivers, Cloud Archipelago, and underground Crystal Web respond after a twenty-to-thirty-year ecological lag. Its current worldbuilding includes living root networks, memory-bearing water, Earth-Vietnam correspondences, Tu Linh echoes, food, altars, Tet, and named cultural landscapes; those details remain under the BIBLE's non-negotiable Vietnamese review boundary.",
    storyBeat:
      "The eventual world plate should follow one river-memory interruption from an Earth-side dam into a specific stagnant reach of the Nine Rivers, with local work, watershed consequence, and listening practice visible; Vietnamese life and sacred traditions may never become exotic atmosphere for an Arcanean spectacle.",
    openIdentityVariables: [
      "reviewed relationship between modern Vietnam and the Arcanean mirror world",
      "culturally responsible architecture, clothing, labor, food, altar, and ritual boundaries",
      "regional specificity across Hanoi, the Mekong Delta, Central Highlands, and Ha Long Bay",
      "visual treatment of Tu Linh and Indigenous Vietnamese traditions",
      "which world-bible claims survive qualified reader review and enter canon",
    ],
    reviewRequirements: [
      "Two paid Vietnamese women readers with diaspora and/or in-country experience review the world contract, prompt, and output before generation may resume.",
      "Relevant Indigenous-Vietnamese review is required before any Central Highlands people, practice, symbol, clothing, architecture, or sacred ecology appears.",
    ],
    sensitivityReviewRequired: true,
    blockedReason:
      "The Song of Van Linh BIBLE makes two paid Vietnamese women readers a non-negotiable gate, and its detailed world material has not yet completed that review. Generation remains closed until the review resolves what may be visualized and records a versioned world contract.",
    sourceRefs: [
      "book/song-of-van-linh/BIBLE.md#sensitivity-protocol--non-negotiable",
      "book/song-of-van-linh/worldbuilding/VAN-LINH-WORLD-BIBLE.md",
    ],
  },
  {
    id: "hall-of-white",
    name: "The Hall of White",
    readiness: "source-complete",
    canonState: "story_source_defined",
    description:
      "The Hall of White is one exact institutional room inside Cinderwall: an octagonal chamber with polished Yumiko-Prism walls, floor, and ceiling; eight clerestory windows keyed to four canonical hours; one central practice circle; twelve Aspirant seats, three senior-Prism seats, and one slightly raised White seat. Prism stone dampens voices, and wear, measurement, risk, and reserved authority must prevent whiteness from reading as empty luxury.",
    storyBeat:
      "At the Hour-of-the-Quiet, the sixteen-seat order is visible around an empty central circle; a seven-band Yumiko-Prism lens rests on its worn inscription, the eastern wall carries one faint unresolved glow, and measured absence makes institutional consequence legible without depicting an unapproved character identity.",
    openIdentityVariables: [],
    reviewRequirements: [],
    sourceRefs: [
      "book/the-hall-of-white/BIBLE.md#geography--the-hall-of-white-and-immediate-surrounds",
      "book/the-hall-of-white/BIBLE.md#the-five-spiritual-beats--the-hall-of-white",
    ],
  },
  {
    id: "forge-realm",
    name: "The Unnamed Forge Realm",
    readiness: "discovery-only",
    canonState: "story_source_partial_geography_open",
    description:
      "The Forge of Ruin setting is a cold, Fire-dominant Heartland Realm whose Arcane lattice gathers under heavy strikes, ringing iron, and pressure. Its page-level places are specific—Galdheim, Vedmark, Nydmark, Harrow's Rest, named passes and siege sites, the Ashenmarch, Deep Wild, and Thornwall—but the Realm itself is deliberately unnamed and unmapped; regional distances, settlement architecture, river and mountain systems, and coastline remain human-author questions.",
    storyBeat:
      "In Galdheim before a winter workday, a repaired cellar chain circuit measures exactly eight feet beside a used ledger, quenching trough, cold well water, and a forge where tool maintenance—not battle spectacle—shows how memory, restraint, iron, heat, and pressure organize daily life.",
    openIdentityVariables: [
      "the Realm's canonical name and linguistic system",
      "map, distances, routes, river system, mountains, and possible coastline",
      "regional settlement and longhouse architecture beyond named rooms",
      "civilian clothing, agricultural economy, seasonal cycle, and transport",
      "visual boundaries among ordinary Fire, kinetic Arcane, Mawfather corruption, and Pale Commander forces",
    ],
    reviewRequirements: [
      "The human author or Lore Master names the Realm and accepts a mapped geography before any wide environmental plate becomes an identity master.",
      "Identity review distinguishes source-defined working objects and sites from provisional regional architecture and cultural material.",
    ],
    sourceRefs: [
      "book/forge-of-ruin/BIBLE.md#the-geography--what-is-on-the-page-so-far",
      "book/forge-of-ruin/BIBLE.md#the-five-elements-in-the-realm",
    ],
  },
  {
    id: "mar-arcano",
    name: "Mar Arcano",
    readiness: "source-complete",
    canonState: "staging_canon_source_defined_plate",
    description:
      "Mar Arcano is not a Realm but a stable inland-sea aquifer corridor through which five Realms touch beneath mountains and continents. The Veldorian coast is locked as tiered towns above chalk cliffs, dyed fabric and caliza panels, navigation by seasonal surface bioluminescence, and deep indigo-black oscuro that is Nero's natural mystery rather than corruption; travelers cannot use the underground corridor and three contributing Realms remain unnamed.",
    storyBeat:
      "At dusk below a tiered Veldorian cliff town, a working captain extinguishes the last deck lamp and reads direction from the sea's shifting bioluminescent organisms; the vast oscuro remains awake but unresponsive, while cargo, chalk wear, dyed sailcloth, and waterline labor keep the multi-Realm cosmology inhabitable.",
    openIdentityVariables: [],
    reviewRequirements: [],
    sourceRefs: [".arcanea/lore/realms/mar-arcano.md"],
  },
  {
    id: "veldoria",
    name: "Veldoria",
    readiness: "source-complete",
    canonState: "council_elevated_realm_source_defined",
    description:
      "Veldoria is a Second-Settling Realm without wound-memory, organized through three materially distinct regions and parish-scale consensual life. In the Valley of Living Stones, the Río Claro, mortarless warm piedra viva, sombraluz plazas, orchards, weekly exchange, acoustic Arcane, and ordinary crafts make awakening possible; the coast and high plateau have their own foods, speech rhythms, fauna, weather, and relation to the land's zumbido.",
    storyBeat:
      "At dusk during a weekly valley market, a baker's long-practiced three-note hum keeps the floración azul open beside the Río Claro while a vocera closes one ordinary public decision under the sombraluz; warm dry-fitted stone, grain, oil, cloth, dogs, and river work carry the world before visible magic.",
    openIdentityVariables: [],
    reviewRequirements: [],
    sourceRefs: [
      ".arcanea/lore/realms/veldoria.md",
      "book/las-tierras-de-luz-valle-v0/BIBLE.md",
    ],
  },
  {
    id: "aurevalde",
    name: "Aurevalde",
    readiness: "blocked",
    canonState: "staging_pure_absence_canon_creator_decision_required",
    description:
      "Aurevalde currently exists through Bela's sixty years of embodied exile: rust-red volcanic piedra roja that releases stored solar heat at night, faster related speech, maíz-solar flatbreads she can never reproduce exactly, a chest-touch gesture, a harvest song whose three notes travel into Veldoria, and one shifted corridor she cannot reopen. Its own lore classifies the Realm as pure-absence canon and leaves villages, map, institutions, borders, dialogue convention, and direct visual identity open.",
    storyBeat:
      "No environmental hero plate is authorized yet. A future study must begin from the small evidence Bela carries—a warm midnight wall, almost-right flatbread, the chest-touch before reaching, and a remembered harvest phrase—only after the creator chooses whether direct depiction should spend Aurevalde's carefully preserved absence.",
    openIdentityVariables: [
      "whether Aurevalde should be depicted directly at all",
      "Bela's home village, map, regions, borders, and relation to other Realms",
      "settlement, market, household, civic, and institutional architecture",
      "language, dialogue convention, clothing, labor, ceremony, and food beyond attested seeds",
      "how First-Settling wound-memory and Fire resonance appear without overwriting exile",
    ],
    reviewRequirements: [
      "Creator explicitly authorizes spending the pure-absence canon resource and selects one bounded scene before visual generation.",
      "Lore review records every extrapolation beyond Bela's attested stone, food, gesture, song, seeing, and corridor memory.",
    ],
    blockedReason:
      "The local Realm record explicitly defines Aurevalde as pure-absence canon and warns that direct depiction may dispel the weight carried through Bela's exile. A creator decision on whether and where to visualize it is required before generation.",
    sourceRefs: [".arcanea/lore/realms/aurevalde.md"],
  },
  {
    id: "ultraworld",
    name: "The Ultraworld",
    readiness: "discovery-only",
    canonState: "locked_staging_meta_realm_visual_identity_open",
    description:
      "The locked repo identifies the Ultraworld only as staging: an AI-native meta-Realm where human imagination and machine intelligence meet. Its current public product system has sixteen named agent identities and a human-held approval boundary, so any older throne, deity, portal, or autonomous-consciousness imagery is non-authoritative evidence. The visual problem is to make co-creation, dissent, provenance, reversible choice, and authorship spatially teachable without turning a chat interface into a cosmic religion.",
    storyBeat:
      "A human changes one consequential choice at a physical evidence table while distinct agent instruments expose source, alternative, dissent, and lineage; the surrounding archive reorganizes only after that choice, making partnership and human sovereignty visible without a pilot throne, holographic dashboard, or generic cyber portal.",
    openIdentityVariables: [
      "spatial ontology and whether the meta-Realm is place, interface, archive, or relational state",
      "canonical relationship between the Ultraworld and the sixteen public product-agent identities",
      "architecture, material system, scale, navigation, and persistence across conversations",
      "how human authorship, agent dissent, provenance, privacy, and reversible choice become visible",
      "which legacy Ultraworld concepts are retained, superseded, or excluded from public identity",
    ],
    reviewRequirements: [
      "Product and lore owners reconcile the staging meta-Realm with the current sixteen-agent system before a public visual identity is approved.",
      "Human-sovereignty review confirms that the composition teaches assistance and inspectability without implying autonomous authority or spiritual fact.",
    ],
    sourceRefs: [
      ".arcanea/lore/CANON_LOCKED.md#the-ultraworld-staging",
      agentSource,
      visualSkill,
    ],
  },
].map((world) => ({
  sensitivityReviewRequired: false,
  blockedReason: null,
  identityState:
    world.readiness === "blocked"
      ? "blocked-world-reconciliation-required"
      : world.readiness === "discovery-only"
        ? "world-visual-discovery-only-no-identity-lock"
        : "source-defined-world-visual-candidate-requires-human-gates",
  evidenceState: world.readiness,
  ...world,
}));

const commonAvoid = [
  "generic fantasy concept art",
  "rainbow galaxy effects",
  "permanent flame crystal or waterfall hair",
  "franchise or living-artist style imitation",
  "appropriated sacred clothing symbols gestures or shrine architecture",
  "illegible pseudo-text",
  "sexualized or childlike treatment",
  "color as the only identity signal",
];

const outputSurfaceByKind = {
  agent: "agent-dossier-and-identity-atlas",
  guardian: "guardian-dossier-and-identity-atlas",
  godbeast: "godbeast-dossier-and-morphology-atlas",
  dyad: "bond-dossier-and-relationship-atlas",
  "book-character": "book-character-dossier-and-identity-atlas",
  world: "world-dossier-and-environment-atlas",
  workflow: "visual-governance-teaching-plate",
  regression: "identity-continuity-evidence-sheet",
};

const cropSafetyByAspectRatio = {
  "1:1":
    "Keep the complete identity silhouette and instrument inside a quiet perimeter; the primary square must survive icon-scale reduction without relying on edge detail.",
  "4:5":
    "Protect the complete subject silhouette, hands or countable limbs, and decisive evidence object from edge loss; no alternate crop is authorized by this contract.",
  "3:2":
    "Keep every compared panel, countable limb, and evidence object complete inside the primary frame; no alternate crop is authorized by this contract.",
  "2:3":
    "Protect the complete vertical silhouette, countable anatomy, and decisive evidence object from edge loss; no alternate crop is authorized by this contract.",
  "4:3":
    "Keep the primary action and causal evidence inside the central field with a quiet perimeter; no alternate crop is authorized by this contract.",
  "3:4":
    "Protect the complete vertical silhouette and decisive evidence object inside the primary frame; no alternate crop is authorized by this contract.",
  "16:9":
    "Protect the foreground action and midground causal evidence inside the central field; distant context may not become the sole story carrier, and no alternate crop is authorized.",
  "9:16":
    "Protect the full vertical action, face or sensory architecture, and decisive evidence object from edge loss; no alternate crop is authorized by this contract.",
  "21:9":
    "Keep both relationship anchors and the decisive interaction inside the central 16:9 safety field; peripheral atmosphere may crop, but no alternate crop is authorized.",
};

function outputContract(composition, kind, deliverable) {
  const aspectRatio = composition.match(
    /\b(21:9|16:9|9:16|4:5|3:2|2:3|4:3|3:4|1:1)\b/,
  )?.[1];
  if (!aspectRatio || !cropSafetyByAspectRatio[aspectRatio]) {
    throw new Error(
      `Prompt composition must declare one supported aspect ratio: ${composition}`,
    );
  }
  const intendedSurface = outputSurfaceByKind[kind];
  if (!intendedSurface) {
    throw new Error(
      `Prompt contract has no intended surface for kind ${kind}.`,
    );
  }
  return {
    assetCount: 1,
    aspectRatio,
    intendedSurface,
    deliveryRole: deliverable ?? "identity master candidate",
    cropSafety: cropSafetyByAspectRatio[aspectRatio],
    generatedTextPolicy: "no-generated-text",
  };
}

function promptContract(entity, options = {}) {
  const style = options.styleId
    ? styles.find((candidate) => candidate.id === options.styleId)
    : null;
  const adaptiveStyle =
    style?.direction ?? "ADAPTIVE_STYLE_PRIMARY_PENDING_AFTER_ROUND_01";
  const sourceRefs = pinSourceRefs(entity.sourceRefs ?? []);
  const subjectLock = options.subjectLock ?? entity.description;
  const evidenceState =
    options.evidenceState ?? entity.evidenceState ?? "source-defined";
  const openIdentityVariables = unique(
    options.openIdentityVariables ?? entity.openIdentityVariables ?? [],
  );
  const reviewRequirements = unique(
    options.reviewRequirements ?? entity.reviewRequirements ?? [],
  );
  const releaseEligibility =
    options.releaseEligibility ??
    (openIdentityVariables.length
      ? "internal-only-until-identity-lock"
      : "candidate-after-human-gates");
  const defaultAllowedVariation =
    {
      agent:
        "Camera, scale, and surrounding evidence objects may vary; instrument silhouette, counts, joints, material system, working behavior, and spatial rhythm may not drift.",
      godbeast:
        "Camera, locomotion phase, and habitat detail may vary; clade, limb and Chord counts, face architecture, scale evidence, ecology, and sovereign behavior may not drift.",
      world:
        "Weather, time of day, and viewpoint may vary; geography, ecology, architecture, labor, inhabitable scale, and material economy may not drift.",
      workflow:
        "Camera and evidence-object arrangement may vary; station order, ownership, handoffs, gates, and human decision boundary may not drift.",
      regression:
        "Crop, pose, action, and camera may vary by panel; identity, anatomy, silhouette, materials, and maintained objects may not drift.",
    }[options.kind] ??
    "Camera, pose, and environmental detail may vary; anatomy, age, body, countable silhouette, role, and story truth may not drift.";
  const allowedVariation =
    options.allowedVariation ??
    entity.allowedVariation ??
    (openIdentityVariables.length
      ? `This is an identity-discovery study, not an identity master. The following variables are deliberately provisional and may be explored without being treated as canon: ${openIdentityVariables.join("; ")}. Only source-defined traits, role or Gate relation, evidence objects, relationship, and story beat may not drift; every variable named as open above must remain visibly provisional.`
      : defaultAllowedVariation);
  const structuralCoherenceConstraint =
    {
      agent:
        "instrument geometry, joints, apertures, counts, and material connections remain coherent",
      godbeast:
        "limbs, Chords, face architecture, locomotion anatomy, and scale evidence remain coherent",
      dyad: "both sovereign figures retain coherent faces, limbs, hands or paws, countable anatomy, and relational distance",
      world:
        "perspective, inhabitable scale, ecology, architecture, labor, and material economy remain coherent",
      workflow:
        "every station, handoff, evidence object, and decision boundary remains spatially coherent",
      regression:
        "the compared identity, anatomy, silhouette, and maintained objects remain continuous across every panel",
    }[options.kind] ??
    "face, hands, limbs, countable anatomy, age, and body proportions remain coherent";
  const composition =
    options.composition ??
    "4:5 vertical field portrait, full silhouette readable, one foreground evidence object, generous negative space for a future dossier caption outside the image.";
  const contract = {
    schema: "arcanea.visual_prompt_contract.v1",
    intent:
      options.intent ??
      (openIdentityVariables.length
        ? `Create an internal identity-discovery study of ${entity.name}; do not present provisional traits as canonical.`
        : `Create an evidence-bound visual study of ${entity.name} for the contracted deliverable.`),
    subject: {
      stableId: entity.id,
      displayName: entity.name,
      kind: options.kind,
      identityLock: subjectLock,
      evidenceState,
      openIdentityVariables,
      allowedVariation,
    },
    storyBeat:
      options.storyBeat ??
      "A quiet working moment one beat before consequence; the subject is doing something specific rather than posing.",
    composition,
    output: outputContract(composition, options.kind, options.deliverable),
    designSystem: {
      styleMode: style?.id ?? "adaptive-primary-pending",
      direction: adaptiveStyle,
      colorLaw:
        "70% ecological/material neutral, 20% identity family, 8% active phenomenon, 2% relational accent.",
      escalation:
        options.escalation ??
        "resonant: one localized impossible behavior; environment remains physically legible",
      materialLaw:
        "Tactile, specific materials with wear, weight, construction, and local environmental response.",
      typography:
        "No text, letters, logos, watermarks, borders, captions, or pseudo-glyphs inside the generated image.",
    },
    light:
      options.light ??
      "Motivated directional light plus one localized Arcanean working signal; preserve skin, material, and atmospheric truth.",
    references: {
      sourceRefs,
      imageRefs: [],
      imageReferencePolicy:
        "Use only owned or licensed references. Record file hash and role: identity, composition, material, or lighting. Never use a reference as permission to imitate its creator.",
    },
    constraints: unique([
      "grayscale silhouette remains identifiable",
      structuralCoherenceConstraint,
      "visible phenomenon serves one story law",
      "adult premium editorial finish; no mascot energy",
      ...(openIdentityVariables.length
        ? [
            "provisional physical choices remain visibly reviewable and must never be described as locked canon",
          ]
        : []),
      ...(options.constraints ?? []),
    ]),
    avoid: unique([
      ...commonAvoid,
      ...(style?.avoid ?? []),
      ...(options.avoid ?? []),
    ]),
    provider: {
      adapter: "runtime-discovered",
      preferredCapabilities: [
        "high-fidelity reference input",
        "iterative editing",
        "consistent identity",
        "generation receipt",
      ],
      model: null,
      seed: null,
      providerParameters: {},
    },
    verification: {
      deterministicChecks: [
        "declared aspect ratio within 1.5% provider-rounding tolerance",
        "file decodes",
        "no embedded prompt text",
        "receipt and output hash recorded",
      ],
      rubric: "arcanea_visual_quality_v1_10x5",
      passThreshold: 42,
      identityFloor: 4,
      canonFloor: 4,
      humanApprovalRequired: true,
    },
    governance: {
      releaseEligibility,
      sensitivityReviewRequired:
        options.sensitivityReviewRequired ??
        entity.sensitivityReviewRequired ??
        false,
      reviewRequirements,
    },
  };
  return { ...contract, contractHash: hash(contract) };
}

const rounds = Array.from({ length: 10 }, (_, index) => ({
  round: index + 1,
  status: "planned",
  purpose: [
    "Controlled style benchmark: one source-complete human and one countable non-human morphology candidate across five systems.",
    "Ten Guardian identity studies.",
    "Ten Godbeast morphology and silhouette studies.",
    "Ten Guardian–Godbeast relationship studies.",
    "First ten named product-agent identity studies.",
    "Remaining six product-agent identities plus four governed workflow scenes.",
    "First ten manuscript character studies.",
    "Second ten manuscript character studies.",
    "Ten world and place system studies.",
    "Identity, crop, grayscale, action, and ensemble regression tests.",
  ][index],
  adaptiveDecision:
    index === 0
      ? "Score all ten; human selects one primary style and one secondary mode before rounds 2–10 compile to a provider."
      : "Blocked from provider compilation until the previous ten-image round is scored and its reflection receipt is accepted.",
  jobs: [],
}));

let sequence = 0;
function addJob(roundNumber, entity, options) {
  sequence += 1;
  const conflict = options.blockedReason ?? entity.conflict ?? null;
  const job = {
    id: `ACV-${String(sequence).padStart(3, "0")}`,
    round: roundNumber,
    slot: rounds[roundNumber - 1].jobs.length + 1,
    entityId: entity.id,
    name: options.name ?? entity.name,
    subjectKind: options.kind,
    deliverable: options.deliverable ?? "identity master candidate",
    sourceRefs: entity.sourceRefs ?? [],
    canonState: options.canonState ?? "proposal_using_sourced_identity",
    identityState:
      options.identityState ?? "proposal_requires_human_identity_lock",
    evidenceState:
      options.evidenceState ?? entity.evidenceState ?? "source-defined",
    openIdentityVariables:
      options.openIdentityVariables ?? entity.openIdentityVariables ?? [],
    reviewRequirements:
      options.reviewRequirements ?? entity.reviewRequirements ?? [],
    sensitivityReviewRequired:
      options.sensitivityReviewRequired ??
      entity.sensitivityReviewRequired ??
      false,
    releaseEligibility:
      options.releaseEligibility ??
      ((options.openIdentityVariables ?? entity.openIdentityVariables ?? [])
        .length
        ? "internal-only-until-identity-lock"
        : "candidate-after-human-gates"),
    rightsState: options.rightsState ?? "internal-draft-source-review-required",
    releaseState: "not-generated",
    generationState: conflict ? "blocked" : "planned",
    blockedReason: conflict,
    styleState: options.styleId ?? "adaptive-primary-pending",
    promptContract: promptContract(entity, options),
    output: null,
    evaluation: null,
    receipts: [],
    decisionReceipts: [],
  };
  rounds[roundNumber - 1].jobs.push(job);
}

const prismatic = agents.find((agent) => agent.id === "prismatic");
const draconisBenchmark = godbeasts.find((beast) => beast.id === "draconis");
const kaelBenchmark = bookCharacters.find(
  (character) => character.id === "kael-thornfield",
);
if (!prismatic || !draconisBenchmark || !kaelBenchmark) {
  throw new Error("Missing one or more controlled benchmark identities.");
}

function godbeastIdentityOptions(beast, overrides = {}) {
  const {
    constraints: overrideConstraints = [],
    avoid: overrideAvoid = [],
    ...rest
  } = overrides;
  return {
    kind: "godbeast",
    deliverable: "Godbeast morphology proposal discovery plate",
    canonState: beast.conflict
      ? "canon_conflict_gate"
      : "locked_relation_local_function_creator_proposed_morphology",
    identityState: beast.identityState,
    subjectLock: `${beast.description} ${beast.functionalTruth}`,
    storyBeat: beast.storyBeat,
    releaseEligibility: "internal-only-until-identity-lock",
    allowedVariation: `This internal study tests one named creator-proposed morphology candidate. Hold its topology and exactly ${beast.chordCount} Chord terminals constant inside this plate so the candidate can be evaluated; vary only the explicitly open detail variables. The held candidate is not canon and implies no acceptance. Locked Gate relation and locally grounded functional phenomena may not drift.`,
    ...rest,
    constraints: [
      `exactly ${beast.chordCount} countable Chord terminals in silhouette`,
      "sovereign ecology, never pet, mount, or visual effect",
      "the named morphology is a controlled proposal under evaluation, never a canonical portrait or identity master",
      beast.functionalTruth,
      ...overrideConstraints,
    ],
    avoid: ["generic dragon", "generic spirit animal", ...overrideAvoid],
  };
}
function agentIdentityEntity(agent) {
  return {
    ...agent,
    description: `${agent.oneLiner} Core instrument: ${agent.instrument}. Silhouette: ${agent.visualIdentity.silhouette} Materials: ${agent.visualIdentity.material} Spatial rhythm: ${agent.visualIdentity.spatialRhythm} Visualize a public product identity and operational instrument, not a mythological deity, generic robot, humanoid mascot, or autonomous authority.`,
  };
}

function agentIdentityOptions(agent, overrides = {}) {
  const {
    constraints: overrideConstraints = [],
    avoid: overrideAvoid = [],
    ...rest
  } = overrides;
  return {
    kind: "agent",
    canonState: "existing_public_product_identity_visual_proposal",
    storyBeat: agent.visualIdentity.workingBehavior,
    light: agent.visualIdentity.light,
    ...rest,
    constraints: [
      `instrument remains recognizable as ${agent.instrument}`,
      `spatial rhythm: ${agent.visualIdentity.spatialRhythm}`,
      "function is legible through material action without generated labels",
      "public product identity, never mythology or autonomous authority",
      ...overrideConstraints,
    ],
    avoid: [
      ...agent.visualIdentity.avoid,
      "matching humanoid uniforms across the agent team",
      "floating holographic dashboard",
      ...overrideAvoid,
    ],
  };
}

for (const style of styles) {
  addJob(
    1,
    draconisBenchmark,
    godbeastIdentityOptions(draconisBenchmark, {
      styleId: style.id,
      name: `Draconis — ${style.name}`,
      deliverable:
        "controlled style benchmark and Godbeast morphology proposal discovery plate",
      constraints: [
        "Draconis remains wingless with exactly six limbs and exactly three temper vanes",
        "the flawless broken blade and its visible old fracture line remain the single evidence object",
      ],
    }),
  );
  addBookCharacterJob(1, kaelBenchmark, {
    styleId: style.id,
    name: `Kael Thornfield — ${style.name}`,
    deliverable:
      "controlled style benchmark and source-complete character identity candidate",
    constraints: [
      "Kael remains nineteen, six feet tall, warm deep-brown skinned, broad-shouldered, close-cropped, and visibly inclined to compress his posture",
      "the small white scar stays at the base of his left thumb and one reusable stone remains the single evidence object",
    ],
  });
}

for (const guardian of guardians) {
  addJob(2, guardian, {
    kind: "guardian",
    deliverable: "comparative Guardian visual identity discovery plate",
    canonState: "locked_name_gate_domain_creator_proposed_visual_identity",
    identityState: "guardian_visual_discovery_only_no_identity_lock",
    storyBeat: guardian.storyBeat,
    constraints: [
      `Gate ${guardian.index}: ${guardian.gate}; domain: ${guardian.domain}`,
      guardian.discoveryFocus,
      "divine authority reads through choice and relation, not ornamental rank",
      "physical embodiment remains provisional; this is not a canonical portrait or identity master",
    ],
  });
}

for (const beast of godbeasts) {
  addJob(3, beast, godbeastIdentityOptions(beast));
}

for (let index = 0; index < guardians.length; index += 1) {
  const guardian = guardians[index];
  const beast = godbeasts[index];
  addJob(
    4,
    {
      id: `dyad-${guardian.id}-${beast.id}`,
      name: `${guardian.name} and ${beast.name}`,
      description: `${guardian.description} ${guardian.discoveryFocus} ${beast.description} ${beast.functionalTruth} The composition must show two sovereign expressions of one Gate in reciprocal consent.`,
      storyBeat: guardian.storyBeat,
      evidenceState:
        "locked-relations-local-godbeast-function-grounded-creator-proposed-behavior-and-morphology-both-identities-open",
      openIdentityVariables: [
        ...guardian.openIdentityVariables.map((item) => `Guardian: ${item}`),
        ...beast.openIdentityVariables.map((item) => `Godbeast: ${item}`),
      ],
      reviewRequirements: [
        ...guardian.reviewRequirements,
        ...beast.reviewRequirements,
      ],
      sensitivityReviewRequired: guardian.sensitivityReviewRequired,
      sourceRefs: [...new Set([...guardian.sourceRefs, ...beast.sourceRefs])],
      conflict: beast.conflict,
    },
    {
      kind: "dyad",
      deliverable:
        "Guardian–Godbeast relationship and identity discovery plate",
      canonState: beast.conflict
        ? "canon_conflict_gate"
        : "mixed_locked_and_creator_proposal",
      identityState:
        "guardian_and_godbeast_visual_discovery_only_no_identity_locks",
      storyBeat: guardian.storyBeat,
      constraints: [
        `Gate ${guardian.index}: ${guardian.gate}`,
        `exactly ${beast.chordCount} Chords remain countable`,
        "no command, riding, ownership, or obedience posture",
        "both physical identities remain provisional and cannot be promoted as canonical identities",
        "the Godbeast morphology is a controlled creator proposal under evaluation, not locked repo canon",
      ],
    },
  );
}

for (const agent of agents.slice(0, 10)) {
  addJob(5, agentIdentityEntity(agent), agentIdentityOptions(agent));
}

for (const agent of agents.slice(10)) {
  addJob(6, agentIdentityEntity(agent), agentIdentityOptions(agent));
}

const workflowScenes = [
  [
    "visual-council",
    "The Visual Council",
    "Prismatic, Chronica, Analytica, and Memoria review one identity plate around a physical evidence table; each role is legible through a distinct instrument and no one is shown as a superior commander.",
    "Prismatic places five equal plates around the source object; Analytica stops the most beautiful one at the anatomy floor, Chronica traces the downstream identity drift, and Memoria sets a supersession plate beside the rejected version while the human decision position remains open.",
  ],
  [
    "human-approval",
    "The Human Approval Gate",
    "A creator makes the final identity choice at a clear decision surface while the agent council presents evidence, dissent, and reversible options.",
    "At the unoccupied decision edge, the creator turns one candidate face down after reading the dissent record, places a removable approval token beside the evidence-backed alternative, and leaves a third option visibly unresolved; every agent instrument remains behind the boundary.",
  ],
  [
    "identity-continuity",
    "The Identity Continuity Test",
    "One character appears across portrait, action, silhouette, and material studies without facial or anatomical drift; the image itself is a sophisticated contact sheet without generated text.",
    "Four material frames show one accepted identity in close portrait, full-body action, grayscale silhouette, and maintained-object detail; a fifth drifting face is physically separated at the edge while the four matching scar, hand, posture, and object markers align.",
  ],
  [
    "release-provenance",
    "The Release and Provenance Desk",
    "A finished visual moves through rights, hash, source, evaluation, and release stations; provenance is shown as an inspectable chain, not a magical seal of truth.",
    "A finished candidate reaches the rights station with source, hash, and two sealed scorecards attached, then stops behind the release boundary because one rights token is absent; the public frame beyond it remains empty.",
  ],
].map(([id, name, description, storyBeat]) => ({
  id,
  name,
  description,
  storyBeat,
  sourceRefs: [visualSkill],
}));
for (const scene of workflowScenes)
  addJob(6, scene, {
    kind: "workflow",
    canonState: "operational_system_proposal",
    storyBeat: scene.storyBeat,
    composition:
      "16:9 editorial systems scene with one clear path and four inspectable stations; no text inside image.",
  });

function addBookCharacterJob(roundNumber, character, overrides = {}) {
  const {
    constraints: overrideConstraints = [],
    avoid: overrideAvoid = [],
    ...rest
  } = overrides;
  const discoveryOnly = character.openIdentityVariables.length > 0;
  const blocked = Boolean(character.blockedReason);
  addJob(roundNumber, character, {
    kind: "book-character",
    deliverable: discoveryOnly
      ? "identity discovery study — not identity master"
      : "identity master candidate",
    canonState: blocked
      ? "source_or_sensitivity_review_gate"
      : discoveryOnly
        ? "manuscript_identity_evidence_partial"
        : "manuscript_identity_candidate",
    identityState: blocked
      ? "blocked_pending_identity_and_review_resolution"
      : discoveryOnly
        ? "source_partial_exploratory_only"
        : "source_complete_requires_human_identity_lock",
    evidenceState: character.evidenceState,
    storyBeat: character.storyBeat,
    openIdentityVariables: character.openIdentityVariables,
    reviewRequirements: character.reviewRequirements,
    sensitivityReviewRequired: character.sensitivityReviewRequired,
    releaseEligibility: discoveryOnly
      ? "internal-only-until-identity-lock"
      : "candidate-after-human-gates",
    blockedReason: character.blockedReason,
    ...rest,
    constraints: [
      `series: ${character.series}`,
      "story-bible evidence outranks name-derived visual shorthand",
      ...(discoveryOnly
        ? [
            "open identity variables are hypotheses for review, never canonical facts",
          ]
        : []),
      ...overrideConstraints,
    ],
    avoid: [
      "name-derived costume or elemental shorthand unsupported by the source",
      "provisional identity traits presented as locked canon",
      ...overrideAvoid,
    ],
  });
}

for (const character of bookCharacters.slice(0, 10))
  addBookCharacterJob(7, character);
for (const character of bookCharacters.slice(10))
  addBookCharacterJob(8, character);

for (const world of worlds) {
  const internalOnly = ["discovery-only", "blocked"].includes(world.readiness);
  addJob(9, world, {
    kind: "world",
    deliverable: internalOnly
      ? "world visual identity discovery plate"
      : "world system identity candidate plate",
    canonState: world.canonState,
    identityState: world.identityState,
    evidenceState: world.evidenceState,
    storyBeat: world.storyBeat,
    openIdentityVariables: world.openIdentityVariables,
    reviewRequirements: world.reviewRequirements,
    sensitivityReviewRequired: world.sensitivityReviewRequired,
    releaseEligibility: internalOnly
      ? "internal-only-until-identity-lock"
      : "candidate-after-human-gates",
    blockedReason: world.blockedReason,
    composition:
      "16:9 inhabitable environmental plate with foreground work, midground social system, and distant ecological consequence; no empty establishing shot.",
    constraints: [
      "foreground labor or maintained evidence, midground social system, and distant ecological consequence all derive from cited sources",
      "geography remains navigable and material economy remains physically plausible",
      "architecture, ecology, climate, labor, and active phenomenon belong to one causal world system",
      ...(internalOnly
        ? [
            "provisional world choices remain visibly reviewable and cannot be promoted as locked canon",
          ]
        : []),
    ],
    avoid: [
      "empty skyline postcard",
      "decorative fantasy megacity without food labor water waste transport or maintenance",
      "portal as the only evidence of a world",
      "monoculture represented by one costume one temple or one color",
    ],
  });
}

const regressionSeeds = [
  [
    "prismatic-portrait",
    "Prismatic portrait continuity",
    agentIdentityEntity(prismatic),
    "4:5 close portrait with the faceted aperture instrument fully legible.",
  ],
  [
    "prismatic-action",
    "Prismatic working action",
    agentIdentityEntity(prismatic),
    "16:9 working scene compiling an identity contract; same identity, no glamour pose.",
  ],
  [
    "prismatic-badge",
    "Prismatic small-scale badge",
    agentIdentityEntity(prismatic),
    "1:1 icon-scale instrument study, readable at 64 pixels without text.",
  ],
  [
    "draconia-portrait",
    "Draconia portrait continuity",
    guardians[2],
    "4:5 character portrait, same provisional body and identity as the human-selected Round 2 discovery reference.",
  ],
  [
    "draconis-silhouette",
    "Draconis grayscale silhouette",
    godbeasts[2],
    "3:2 pure material-and-value silhouette study; six limbs and three vanes countable.",
  ],
  [
    "draconis-action",
    "Draconis material consequence",
    godbeasts[2],
    "16:9 action with pressure and tempering, no fire-breath.",
  ],
  [
    "kael-crop-set",
    "Kael crop continuity",
    bookCharacters[0],
    "3:2 portrait/action/detail triptych without text; face, hands, scar, age, and build remain stable.",
  ],
  [
    "mira-crop-set",
    "Mira crop continuity",
    bookCharacters[1],
    "3:2 portrait/action/detail triptych without text; face, hair, calluses, age, and build remain stable.",
  ],
  [
    "guardian-ensemble",
    "Ten Guardian ensemble hierarchy",
    {
      id: "guardians-ensemble",
      name: "The Ten Guardians",
      description:
        "A future ensemble regression for all ten Guardians. It cannot be rendered truthfully until each Guardian has an accepted versioned physical identity contract and reference hash.",
      storyBeat:
        "All ten Guardians enact distinct Gate choices in one shared civic space without a centered supreme leader; this scene remains unavailable until their individual identities are locked.",
      evidenceState:
        "locked-name-gate-domain-creator-proposed-behavior-physical-identity-open",
      openIdentityVariables: guardianIdentityUnknowns,
      reviewRequirements: guardianReviewRequirements,
      sensitivityReviewRequired: false,
      sourceRefs: [lockedCanon, creatorPacket],
    },
    "21:9 ensemble with no centered supreme leader and no color-only identification.",
  ],
  [
    "agents-ensemble",
    "Sixteen-agent constellation",
    {
      id: "agents-ensemble",
      name: "The Sixteen Agent Identities",
      description: `All sixteen public product identities appear as a cooperative atlas of distinct working instruments, with Prismatic as visual workflow lead but the human approval position visibly open. Preserve these exact identity anchors: ${agents.map((agent) => `${agent.name} — ${agent.visualIdentity.silhouette}`).join(" | ")}`,
      storyBeat:
        "The sixteen instruments pass one evidence object through four domain rhythms, surface one dissent, and stop at a visibly unoccupied human decision position.",
      evidenceState: "source-defined",
      openIdentityVariables: [],
      reviewRequirements: [],
      sensitivityReviewRequired: false,
      sourceRefs: [...new Set(agents.flatMap((agent) => agent.sourceRefs))],
    },
    "21:9 constellation atlas; four domains legible by spatial rhythm, not uniform superhero lineup.",
  ],
];
for (const [id, name, source, composition] of regressionSeeds) {
  const isGuardianDiscovery = id === "draconia-portrait";
  const isGuardianEnsemble = id === "guardian-ensemble";
  const isAgentRegression = id.startsWith("prismatic-");
  const isAgentEnsemble = id === "agents-ensemble";
  const storyBeat =
    source.storyBeat ??
    source.visualIdentity?.workingBehavior ??
    (id === "draconis-silhouette"
      ? "Draconis crosses the frame at neutral pace while all six limbs, mask-face, furnace ribs, and exactly three temper vanes remain readable in grayscale."
      : id === "draconis-action"
        ? "Draconis reveals a hidden brittle seam through pressure and controlled tempering; material consequence replaces fire-breath spectacle."
        : "A quiet working moment one beat before consequence; the subject is doing something specific rather than posing.");
  addJob(
    10,
    {
      ...source,
      id,
      name,
      description:
        source.description ?? `${source.oneLiner} ${source.instrument}.`,
    },
    {
      kind: "regression",
      name,
      deliverable: isGuardianDiscovery
        ? "provisional Guardian continuity discovery test"
        : isGuardianEnsemble
          ? "future Guardian ensemble regression blocked until identity locks"
          : isAgentEnsemble
            ? "multi-identity constellation regression study"
            : "identity continuity regression study",
      canonState:
        id.includes("agents-ensemble") || id.includes("prismatic")
          ? "existing_public_product_identity_visual_proposal"
          : "identity_regression_candidate",
      identityState:
        isGuardianDiscovery || isGuardianEnsemble
          ? "guardian_visual_discovery_only_no_identity_lock"
          : "regression_requires_accepted_reference_hash",
      storyBeat,
      composition,
      blockedReason: isGuardianEnsemble
        ? "All ten Guardian physical identities remain open. An ensemble regression cannot begin until ten versioned identity contracts and accepted reference hashes exist."
        : null,
      constraints: [
        isGuardianDiscovery
          ? "compare against a human-selected internal Draconia discovery reference hash from Round 02; this reference remains provisional and grants no identity approval"
          : isAgentEnsemble
            ? "compare all sixteen instruments against the accepted reference hash for each earlier agent study; stop if any reference is missing"
            : "compare against accepted identity reference hash from an earlier round; stop if no accepted reference exists",
        ...(isGuardianDiscovery
          ? [
              "Draconia remains an internal provisional continuity subject and may not be labeled a canonical portrait or identity master",
            ]
          : []),
        ...(isAgentRegression
          ? [
              "Prismatic remains a faceted aperture instrument; never introduce a humanoid face or body",
            ]
          : []),
        ...(isAgentEnsemble
          ? [
              "all sixteen bespoke instrument silhouettes remain individually legible without matching uniforms, robot bodies, or color-only coding",
              "use one deterministic non-generative reference atlas assembled from all sixteen accepted identity images plus a manifest linking every tile to its source hash; stop if either is absent",
            ]
          : []),
      ],
    },
  );
}

function ensureInside(path, parent, label) {
  const absolute = resolve(path);
  const absoluteParent = resolve(parent);
  if (
    absolute !== absoluteParent &&
    !absolute.startsWith(`${absoluteParent}\\`) &&
    !absolute.startsWith(`${absoluteParent}/`)
  ) {
    throw new Error(`${label} escapes ${absoluteParent}.`);
  }
  return absolute;
}

function hydrateOutputReceipts() {
  const resultsRoot = join(ROOT, "planning-with-files/arcanea-visual-results");
  const receiptIndex = new Map();
  if (!existsSync(resultsRoot)) return receiptIndex;
  const manifestIndexPath = join(
    ROOT,
    "planning-with-files/arcanea-visual-campaign/execution-manifests/index.json",
  );
  if (!existsSync(manifestIndexPath)) {
    throw new Error(
      "Visual output receipts exist but the execution-manifest index is missing.",
    );
  }
  const manifestIndex = JSON.parse(readFileSync(manifestIndexPath, "utf8"));
  const { indexHash, ...indexBody } = manifestIndex;
  if (
    manifestIndex.schema !== "arcanea.provider_execution_manifest_index.v1" ||
    indexHash !== hash(indexBody) ||
    manifestIndex.campaignId !== "arcanea-living-constellation-100" ||
    manifestIndex.currentCampaignVersion !== VERSION
  ) {
    throw new Error("Execution-manifest index is stale or invalid.");
  }
  const currentManifestKeys = new Set(
    manifestIndex.current.map(
      (entry) => `${entry.manifestPath}:${entry.manifestHash}`,
    ),
  );
  const allJobs = rounds.flatMap((round) => round.jobs);
  const receiptsByJob = new Map();
  const seenRevisions = new Set();
  for (const fileName of readdirSync(resultsRoot)
    .filter((name) => name.endsWith(".json"))
    .sort()) {
    const receiptPath = join(resultsRoot, fileName);
    const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    const { receiptHash, ...receiptBody } = receipt;
    if (
      receipt.schema !== "arcanea.visual_output_receipt.v1" ||
      receiptHash !== hash(receiptBody)
    ) {
      throw new Error(`Invalid visual output receipt: ${receiptPath}`);
    }
    const job = allJobs.find((candidate) => candidate.id === receipt.jobId);
    if (!job)
      throw new Error(
        `Output receipt references unknown job ${receipt.jobId}.`,
      );
    if (job.generationState === "blocked")
      throw new Error(`Blocked job ${job.id} cannot have an output receipt.`);
    if (
      receipt.campaignId !== "arcanea-living-constellation-100" ||
      receipt.campaignVersion !== VERSION ||
      receipt.round !== job.round ||
      !Number.isInteger(receipt.revision) ||
      receipt.revision < 1
    ) {
      throw new Error(
        `Output receipt for ${job.id} has stale campaign metadata.`,
      );
    }
    if (
      receipt.releaseState !== "internal-review" ||
      typeof receipt.execution?.provider !== "string" ||
      (receipt.execution?.model !== null &&
        typeof receipt.execution?.model !== "string") ||
      typeof receipt.execution?.modelPolicy !== "string" ||
      typeof receipt.execution?.generationReceipt !== "string" ||
      typeof receipt.execution?.machinePreflightReceipt !== "string" ||
      typeof receipt.execution?.machinePreflightReceiptHash !== "string" ||
      typeof receipt.execution?.executionGrantPath !== "string" ||
      typeof receipt.execution?.executionGrantHash !== "string" ||
      typeof receipt.execution?.spendApprovedBy !== "string" ||
      typeof receipt.execution?.executionManifestPath !== "string" ||
      typeof receipt.execution?.executionManifestHash !== "string" ||
      typeof receipt.execution?.executionPromptHash !== "string" ||
      receipt.deterministicChecks?.decoded !== true ||
      receipt.deterministicChecks?.storedCopyDecoded !== true ||
      receipt.deterministicChecks?.storedBytesMatchSource !== true ||
      receipt.deterministicChecks?.storedDimensionsMatchSource !== true ||
      receipt.deterministicChecks?.hashRecorded !== true
    ) {
      throw new Error(
        `Output receipt for ${job.id} is missing execution evidence.`,
      );
    }
    if (receipt.promptContractHash !== job.promptContract.contractHash) {
      throw new Error(
        `Output receipt for ${job.id} uses a stale prompt contract.`,
      );
    }
    const executionManifestRoot = resolve(
      ROOT,
      "planning-with-files/arcanea-visual-campaign/execution-manifests",
    );
    const executionManifestPath = ensureInside(
      join(ROOT, receipt.execution.executionManifestPath),
      executionManifestRoot,
      `${job.id} execution manifest`,
    );
    if (!existsSync(executionManifestPath)) {
      throw new Error(`Execution manifest for ${job.id} is missing.`);
    }
    const executionManifest = JSON.parse(
      readFileSync(executionManifestPath, "utf8"),
    );
    const { manifestHash, ...manifestBody } = executionManifest;
    const executionJob = executionManifest.jobs?.find(
      (candidate) => candidate.id === job.id,
    );
    if (
      !currentManifestKeys.has(
        `${relative(ROOT, executionManifestPath).replaceAll("\\", "/")}:${manifestHash}`,
      ) ||
      executionManifest.schema !== "arcanea.provider_execution_manifest.v1" ||
      manifestHash !== hash(manifestBody) ||
      manifestHash !== receipt.execution.executionManifestHash ||
      executionManifest.campaignId !== receipt.campaignId ||
      executionManifest.campaignVersion !== receipt.campaignVersion ||
      executionManifest.round !== job.round ||
      executionManifest.profileId !== receipt.execution.providerProfile ||
      executionManifest.profile?.provider !== receipt.execution.provider ||
      executionJob?.executionState !== "executable" ||
      executionJob.promptContractHash !== job.promptContract.contractHash ||
      executionJob.executionPromptHash !==
        receipt.execution.executionPromptHash ||
      JSON.stringify(
        [...(executionJob.referencePlan?.currentReferenceHashes ?? [])].sort(),
      ) !==
        JSON.stringify([...(receipt.execution.referenceHashes ?? [])].sort()) ||
      JSON.stringify(
        executionJob.referencePlan?.qualifiedIdentityReferenceSet ?? null,
      ) !==
        JSON.stringify(
          receipt.execution.qualifiedIdentityReferenceSet ?? null,
        ) ||
      JSON.stringify(executionJob.referencePlan?.acceptedReferences ?? []) !==
        JSON.stringify(receipt.execution.acceptedReferences ?? [])
    ) {
      throw new Error(
        `Output receipt for ${job.id} does not match a current-active immutable execution manifest.`,
      );
    }
    const authorityRoot = resolve(
      ROOT,
      "planning-with-files/arcanea-visual-authority",
    );
    const preflightReceiptPath = ensureInside(
      join(ROOT, receipt.execution.machinePreflightReceipt),
      authorityRoot,
      `${job.id} machine preflight receipt`,
    );
    const executionGrantPath = ensureInside(
      join(ROOT, receipt.execution.executionGrantPath),
      authorityRoot,
      `${job.id} execution grant`,
    );
    if (!existsSync(preflightReceiptPath) || !existsSync(executionGrantPath)) {
      throw new Error(`Execution authority evidence for ${job.id} is missing.`);
    }
    const preflightReceipt = JSON.parse(
      readFileSync(preflightReceiptPath, "utf8"),
    );
    const preflightHash = preflightReceipt.receiptHash;
    const executionGrant = JSON.parse(readFileSync(executionGrantPath, "utf8"));
    const { grantHash, ...grantBody } = executionGrant;
    const recordedAt = Date.parse(receipt.createdAt);
    validateMachinePreflightReceipt(preflightReceipt, {
      now: recordedAt,
      requireExecutable: true,
    });
    const checkedAt = Date.parse(preflightReceipt.checkedAt);
    const preflightExpiresAt = Date.parse(preflightReceipt.expiresAt);
    const issuedAt = Date.parse(executionGrant.issuedAt);
    const grantExpiresAt = Date.parse(executionGrant.expiresAt);
    const stopAt = Date.parse(executionGrant.stopAt);
    const specialistEvidenceIds = new Set(
      (executionGrant.specialistReviewEvidence ?? []).map((item) => item.jobId),
    );
    if (
      preflightHash !== receipt.execution.machinePreflightReceiptHash ||
      executionGrant.schema !== "arcanea.visual_execution_grant.v1" ||
      grantHash !== hash(grantBody) ||
      grantHash !== receipt.execution.executionGrantHash ||
      executionGrant.campaignId !== receipt.campaignId ||
      executionGrant.campaignVersion !== receipt.campaignVersion ||
      executionGrant.round !== job.round ||
      executionGrant.providerProfile !== executionManifest.profileId ||
      executionGrant.provider !== receipt.execution.provider ||
      executionGrant.modelPolicy !== receipt.execution.modelPolicy ||
      executionGrant.model !== receipt.execution.model ||
      executionGrant.runtimeParametersHash !==
        hash(executionGrant.runtimeParameters) ||
      JSON.stringify(executionGrant.runtimeParameters) !==
        JSON.stringify(receipt.execution.parameters) ||
      executionGrant.executionManifestPath !==
        relative(ROOT, executionManifestPath).replaceAll("\\", "/") ||
      executionGrant.executionManifestHash !== manifestHash ||
      executionGrant.sourceContractSetHash !==
        executionManifest.sourceContractSetHash ||
      !executionGrant.jobIds?.includes(job.id) ||
      executionGrant.spendApprovedBy !== receipt.execution.spendApprovedBy ||
      executionGrant.rightsAndLikenessAttestedBy !==
        receipt.execution.rightsAndLikenessAttestedBy ||
      executionGrant.machinePreflightReceiptPath !==
        relative(ROOT, preflightReceiptPath).replaceAll("\\", "/") ||
      executionGrant.machinePreflightReceiptHash !== preflightHash ||
      executionGrant.outputRoot !==
        "planning-with-files/arcanea-visual-assets/v1" ||
      executionGrant.authorityEvidence !==
        receipt.execution.authorityEvidence ||
      executionGrant.humanAttestation !== true ||
      receipt.execution.humanAttestation !== true ||
      !Number.isFinite(recordedAt) ||
      !Number.isFinite(checkedAt) ||
      !Number.isFinite(preflightExpiresAt) ||
      !Number.isFinite(issuedAt) ||
      !Number.isFinite(grantExpiresAt) ||
      !Number.isFinite(stopAt) ||
      checkedAt > recordedAt ||
      issuedAt > recordedAt ||
      recordedAt > stopAt ||
      recordedAt > grantExpiresAt ||
      recordedAt > preflightExpiresAt ||
      (job.sensitivityReviewRequired && !specialistEvidenceIds.has(job.id))
    ) {
      throw new Error(
        `Output receipt for ${job.id} does not match its execution authority chain.`,
      );
    }
    if (
      typeof receipt.output?.storagePath !== "string" ||
      receipt.output.publicUrl !== null
    ) {
      throw new Error(
        `Output receipt for ${job.id} must remain in internal storage until approval.`,
      );
    }
    const internalRoot = resolve(
      ROOT,
      "planning-with-files/arcanea-visual-assets",
    );
    const imagePath = ensureInside(
      join(ROOT, receipt.output.storagePath),
      internalRoot,
      `${job.id} internal output`,
    );
    if (!existsSync(imagePath))
      throw new Error(`Output file for ${job.id} is missing: ${imagePath}`);
    const bytes = readFileSync(imagePath);
    const mediaMetadata = inspectImageBytes(bytes);
    const aspectRatioCheck = verifyImageAspectRatio(
      mediaMetadata.width,
      mediaMetadata.height,
      job.promptContract.output.aspectRatio,
    );
    if (
      mediaMetadata.sha256 !== receipt.output.sha256 ||
      mediaMetadata.bytes !== receipt.output.bytes ||
      mediaMetadata.width !== receipt.output.width ||
      mediaMetadata.height !== receipt.output.height ||
      receipt.deterministicChecks?.dimensionsRecorded !== true ||
      receipt.deterministicChecks?.declaredAspectRatio !==
        aspectRatioCheck.declaredAspectRatio ||
      receipt.deterministicChecks?.actualAspectRatio !==
        aspectRatioCheck.actualAspectRatio ||
      receipt.deterministicChecks?.aspectRatioRelativeError !==
        aspectRatioCheck.aspectRatioRelativeError ||
      receipt.deterministicChecks?.aspectRatioTolerance !==
        aspectRatioCheck.aspectRatioTolerance ||
      receipt.deterministicChecks?.aspectRatioMatchesContract !== true ||
      receipt.deterministicChecks?.storedCopyDecoded !== true ||
      receipt.deterministicChecks?.storedBytesMatchSource !== true ||
      receipt.deterministicChecks?.storedDimensionsMatchSource !== true
    ) {
      throw new Error(`Output file for ${job.id} does not match its receipt.`);
    }
    const revisionKey = `${job.id}:r${receipt.revision}`;
    if (seenRevisions.has(revisionKey)) {
      throw new Error(`Duplicate output receipt revision: ${revisionKey}.`);
    }
    seenRevisions.add(revisionKey);
    const relativeReceiptPath = relative(ROOT, receiptPath).replaceAll(
      "\\",
      "/",
    );
    const entry = { receipt, relativeReceiptPath };
    const jobReceipts = receiptsByJob.get(job.id) ?? [];
    jobReceipts.push(entry);
    receiptsByJob.set(job.id, jobReceipts);
    receiptIndex.set(relativeReceiptPath, entry);
  }

  for (const job of allJobs) {
    const jobReceipts = (receiptsByJob.get(job.id) ?? []).sort(
      (left, right) => left.receipt.revision - right.receipt.revision,
    );
    const latest = jobReceipts.at(-1);
    if (!latest) continue;
    job.generationState = "review";
    job.rightsState = latest.receipt.rightsState;
    job.releaseState = latest.receipt.releaseState;
    job.output = {
      ...latest.receipt.output,
      revision: latest.receipt.revision,
      receiptPath: latest.relativeReceiptPath,
    };
    job.receipts = jobReceipts.map((entry) => entry.relativeReceiptPath);
  }
  return receiptIndex;
}

function hydrateDecisionReceipts(outputReceiptIndex) {
  const decisionsRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-releases",
  );
  if (!existsSync(decisionsRoot)) return;
  const allJobs = rounds.flatMap((round) => round.jobs);
  const decisionsByPath = new Map();
  const decisionsByRevision = new Map();

  for (const fileName of readdirSync(decisionsRoot)
    .filter((name) => name.endsWith(".json"))
    .sort()) {
    const decisionPath = join(decisionsRoot, fileName);
    const receipt = JSON.parse(readFileSync(decisionPath, "utf8"));
    const { receiptHash, ...receiptBody } = receipt;
    if (
      receipt.schema !== "arcanea.visual_release_decision.v1" ||
      receiptHash !== hash(receiptBody)
    ) {
      throw new Error(`Invalid visual release decision: ${decisionPath}`);
    }
    const job = allJobs.find((candidate) => candidate.id === receipt.jobId);
    const outputEntry = outputReceiptIndex.get(receipt.outputReceiptPath);
    if (
      !job ||
      job.generationState === "blocked" ||
      !outputEntry ||
      outputEntry.receipt.jobId !== receipt.jobId ||
      outputEntry.receipt.revision !== receipt.outputRevision ||
      outputEntry.receipt.receiptHash !== receipt.outputReceiptHash ||
      outputEntry.receipt.output.sha256 !== receipt.imageSha256
    ) {
      throw new Error(
        `Release decision has no matching output: ${decisionPath}`,
      );
    }
    if (
      receipt.campaignId !== "arcanea-living-constellation-100" ||
      receipt.campaignVersion !== VERSION ||
      receipt.round !== job.round ||
      !["approved", "rejected", "published"].includes(receipt.decision) ||
      receipt.humanAttestation !== true ||
      typeof receipt.decidedBy !== "string" ||
      receipt.decidedBy.trim().length < 3
    ) {
      throw new Error(`Release decision metadata is invalid: ${decisionPath}`);
    }
    const relativeDecisionPath = relative(ROOT, decisionPath).replaceAll(
      "\\",
      "/",
    );
    const entry = { receipt, relativeDecisionPath };
    decisionsByPath.set(relativeDecisionPath, entry);
    const revisionKey = `${receipt.jobId}:r${receipt.outputRevision}`;
    const entries = decisionsByRevision.get(revisionKey) ?? [];
    entries.push(entry);
    decisionsByRevision.set(revisionKey, entries);
  }

  for (const entries of decisionsByRevision.values()) {
    const byDecision = new Map();
    for (const entry of entries) {
      if (byDecision.has(entry.receipt.decision)) {
        throw new Error(
          `Duplicate ${entry.receipt.decision} decision for ${entry.receipt.jobId} r${entry.receipt.outputRevision}.`,
        );
      }
      byDecision.set(entry.receipt.decision, entry);
    }
    if (byDecision.has("approved") && byDecision.has("rejected")) {
      throw new Error(
        `Conflicting release decisions for ${entries[0].receipt.jobId} r${entries[0].receipt.outputRevision}.`,
      );
    }

    const approved = byDecision.get("approved");
    if (approved) {
      const gateKeys = Object.keys(approved.receipt.gates ?? {}).sort();
      const requiredGateKeys = [
        "brand",
        "canon",
        "identity",
        "rights",
        "sensitivity",
      ];
      const gateValues = Object.values(approved.receipt.gates ?? {});
      if (
        JSON.stringify(gateKeys) !== JSON.stringify(requiredGateKeys) ||
        gateValues.some(
          (value) => typeof value !== "string" || value.trim().length < 5,
        )
      ) {
        throw new Error(
          `Approved decision for ${approved.receipt.jobId} is missing a human gate.`,
        );
      }
      const reflectionPath = ensureInside(
        join(ROOT, approved.receipt.evaluationReflectionPath ?? ""),
        join(ROOT, "planning-with-files/arcanea-visual-reflections"),
        `${approved.receipt.jobId} evaluation reflection`,
      );
      if (!existsSync(reflectionPath)) {
        throw new Error(
          `Approved decision for ${approved.receipt.jobId} has no evaluation reflection.`,
        );
      }
      const reflection = JSON.parse(readFileSync(reflectionPath, "utf8"));
      const { receiptHash, ...reflectionBody } = reflection;
      const candidate = reflection.candidates?.find(
        (item) => item.jobId === approved.receipt.jobId,
      );
      if (
        reflection.schema !== "arcanea.visual_round_reflection.v1" ||
        receiptHash !== hash(reflectionBody) ||
        receiptHash !== approved.receipt.evaluationReceiptHash ||
        reflection.campaignId !== "arcanea-living-constellation-100" ||
        reflection.campaignVersion !== VERSION ||
        reflection.round !== approved.receipt.round ||
        candidate?.outputReceiptPath !== approved.receipt.outputReceiptPath ||
        candidate?.verdict !== "pass-candidate" ||
        candidate?.humanVerdict !== "approved"
      ) {
        throw new Error(
          `Approved decision for ${approved.receipt.jobId} is not supported by a passing independent evaluation.`,
        );
      }
      if (
        typeof approved.receipt.stagedPublicUrl !== "string" ||
        !approved.receipt.stagedPublicUrl.startsWith(
          "/images/arcanea-campaign/",
        ) ||
        approved.receipt.stagedPublicSha256 !== approved.receipt.imageSha256
      ) {
        throw new Error(
          `Approved decision for ${approved.receipt.jobId} has no valid staged public asset.`,
        );
      }
      const publicRoot = join(ROOT, "apps/web/public");
      const stagedPath = ensureInside(
        join(
          publicRoot,
          approved.receipt.stagedPublicUrl.replace(/^[/\\]+/, ""),
        ),
        join(publicRoot, "images/arcanea-campaign"),
        `${approved.receipt.jobId} staged public asset`,
      );
      if (!existsSync(stagedPath)) {
        throw new Error(
          `Approved staged asset for ${approved.receipt.jobId} is missing.`,
        );
      }
      const stagedBytes = readFileSync(stagedPath);
      if (
        createHash("sha256").update(stagedBytes).digest("hex") !==
        approved.receipt.imageSha256
      ) {
        throw new Error(
          `Approved staged asset for ${approved.receipt.jobId} does not match its output.`,
        );
      }
    }

    const rejected = byDecision.get("rejected");
    if (
      rejected &&
      (typeof rejected.receipt.reason !== "string" ||
        rejected.receipt.reason.trim().length < 12)
    ) {
      throw new Error(
        `Rejected decision for ${rejected.receipt.jobId} needs a reason.`,
      );
    }

    const published = byDecision.get("published");
    if (published) {
      const prior = decisionsByPath.get(
        published.receipt.previousDecisionReceipt,
      );
      if (
        !approved ||
        prior?.relativeDecisionPath !== approved.relativeDecisionPath ||
        prior.receipt.receiptHash !== published.receipt.previousDecisionHash ||
        prior.receipt.jobId !== published.receipt.jobId ||
        prior.receipt.outputRevision !== published.receipt.outputRevision ||
        typeof published.receipt.publicationEvidence !== "string" ||
        published.receipt.publicationEvidence.trim().length < 8
      ) {
        throw new Error(
          `Published decision for ${published.receipt.jobId} does not chain to its approval.`,
        );
      }
    }

    const job = allJobs.find(
      (candidate) => candidate.id === entries[0].receipt.jobId,
    );
    if (!job || job.output?.revision !== entries[0].receipt.outputRevision) {
      continue;
    }
    job.decisionReceipts = [approved, rejected, published]
      .filter(Boolean)
      .map((entry) => entry.relativeDecisionPath);
    if (published) job.releaseState = "published";
    else if (approved) job.releaseState = "approved";
    else if (rejected) job.releaseState = "rejected";
    if (approved) {
      job.evaluation = {
        total: approved.receipt.reconciledTotal,
        verdict: "pass-candidate",
      };
      job.output.publicUrl = approved.receipt.stagedPublicUrl;
    }
  }
}

const outputReceiptIndex = hydrateOutputReceipts();
hydrateDecisionReceipts(outputReceiptIndex);

function qualifiedIdentityReferenceSets() {
  const referencesRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-references",
  );
  if (!existsSync(referencesRoot)) return [];
  const sets = [];
  for (const entry of readdirSync(referencesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const entityRoot = join(referencesRoot, entry.name);
    for (const fileName of readdirSync(entityRoot)
      .filter((name) => /^identity-set-.+\.json$/i.test(name))
      .sort()) {
      const path = join(entityRoot, fileName);
      const receipt = JSON.parse(readFileSync(path, "utf8"));
      const { receiptHash, ...body } = receipt;
      if (
        receipt.schema !== "arcanea.visual_identity_reference_set.v1" ||
        receiptHash !== hash(body) ||
        receipt.entityId !== entry.name ||
        receipt.qualification !== "identity-regression-qualified" ||
        receipt.humanAttestation !== true ||
        !Array.isArray(receipt.references) ||
        new Set(receipt.references.map((reference) => reference.imageSha256))
          .size < 8
      ) {
        throw new Error(`Invalid qualified identity reference set: ${path}`);
      }
      sets.push(receipt);
    }
  }
  return sets;
}

const qualifiedReferenceSets = qualifiedIdentityReferenceSets();

for (const round of rounds) {
  const runnable = round.jobs.filter(
    (job) => job.generationState !== "blocked",
  );
  const generated = runnable.filter((job) => job.output !== null).length;
  const published = runnable.filter(
    (job) => job.releaseState === "published",
  ).length;
  round.status =
    generated === 0
      ? "planned"
      : published === runnable.length
        ? "published"
        : generated === runnable.length
          ? "review"
          : "generating";
}

const allCampaignJobs = rounds.flatMap((round) => round.jobs);
const generatedCount = allCampaignJobs.filter(
  (job) => job.output !== null,
).length;
const approvedCount = allCampaignJobs.filter((job) =>
  ["approved", "published"].includes(job.releaseState),
).length;
const publishedCount = allCampaignJobs.filter(
  (job) => job.releaseState === "published",
).length;
const executableCount = allCampaignJobs.filter(
  (job) => job.generationState !== "blocked",
).length;
const blockedJobs = allCampaignJobs.filter(
  (job) => job.generationState === "blocked",
);
const visualDecisionDefinitions = [
  {
    id: "AVD-001",
    title: "Resolve Sol's countable body plan",
    kind: "canon-and-identity-decision",
    affectedJobIds: ["ACV-027", "ACV-037"],
    heldBy: "Creator with canon and identity review",
    question:
      "Does Sol retain the proposed six-limbed draconic clade law, become an explicitly documented four-limbed exception, or leave that clade under a newly defined topology?",
    resolutionPaths: [
      "Retain the six-limbed clade law and revise Sol's four-limb proposal before recompiling both contracts.",
      "Authorize and document a four-limbed exception, including the anatomical and story reason it does not silently weaken the clade law.",
      "Reclassify Sol outside the proposed draconic clade and define a new countable body plan, locomotion, and Chord architecture.",
    ],
    requiredEvidence: [
      "Versioned creator canon decision naming the accepted option and superseded proposal.",
      "Revised Godbeast identity contract with exact limb, Chord, sensory, locomotion, scale, and ecology fields.",
      "New prompt-contract and immutable-manifest hashes for every affected job; old hashes remain historical evidence.",
    ],
    safeWhileOpen:
      "Compare local source statements and prepare silhouette questions; do not generate Sol or the Aiyami/Sol dyad.",
  },
  {
    id: "AVD-002",
    title: "Resolve Source's ontology",
    kind: "locked-canon-reconciliation",
    affectedJobIds: ["ACV-030", "ACV-040"],
    heldBy: "Creator with locked-canon guardian",
    question:
      "Is Source a separate Godbeast bonded to Shinkami, a temporary nine-being convergence, or an explicitly layered relation that preserves both statements without pretending they already agree?",
    resolutionPaths: [
      "Retain Source as a separate Godbeast and supersede the no-separate-beast proposal.",
      "Amend locked canon through the authorized canon process so Source names a convergence rather than a separate being.",
      "Define a layered ontology with exact conditions, boundaries, countable Chords, and visual rules for the separate and convergent states.",
    ],
    requiredEvidence: [
      "Versioned canon decision that explicitly cites and resolves both conflicting sources.",
      "A visual contract stating whether the subject is body, relation, event, or convergence and what may be counted in silhouette.",
      "Recompiled prompt contracts and manifests for Source and the Shinkami dyad.",
    ],
    safeWhileOpen:
      "Study relation diagrams in text only; do not invent a body, fusion, ownership relation, or convergence silhouette.",
  },
  {
    id: "AVD-003",
    title: "Reconcile Korvash's identity and lived-experience framing",
    kind: "continuity-and-specialist-review-gate",
    affectedJobIds: ["ACV-077"],
    heldBy:
      "Creator and continuity editor, followed by a qualified disability or neurodivergence lived-experience reviewer",
    question:
      "What versioned pronoun, gender, base-form, and Heartbound record is authoritative, and does the visual framing preserve agency without turning the never-shifted condition into spectacle or deficit shorthand?",
    resolutionPaths: [
      "Reconcile the BIBLE and drafted chapters into one source-of-truth identity record; no visual inference may choose the answer.",
      "Complete qualified lived-experience review of the revised identity and prompt before generation.",
    ],
    requiredEvidence: [
      "Versioned continuity decision covering pronouns and all changed manuscript references.",
      "Named reviewer evidence with scope, qualification, feedback disposition, and approval boundary.",
      "Revised prompt contract that names what is observable without medicalizing or visually coding worth.",
    ],
    safeWhileOpen:
      "Audit source continuity and reviewer scope; do not generate Korvash or infer identity from the character's name or condition.",
  },
  {
    id: "AVD-004",
    title: "Complete the Song of Van Linh qualified-reader gate",
    kind: "non-bypassable-cultural-review-gate",
    affectedJobIds: ["ACV-080", "ACV-084"],
    heldBy:
      "Creator with two paid Vietnamese women readers; add relevant Indigenous-Vietnamese review if Central Highlands material appears",
    question:
      "Which character and world claims may enter a versioned visual contract after qualified review, and which must be revised, narrowed, or removed?",
    resolutionPaths: [
      "Complete the named review protocol and incorporate or explicitly disposition every finding before generation.",
      "Narrow the visual scope to reviewed evidence only; omission is allowed, unreviewed cultural invention is not.",
    ],
    requiredEvidence: [
      "Two paid reader records with relevant diaspora and/or in-country experience, scope, date, and finding disposition.",
      "Additional Indigenous-Vietnamese review evidence whenever Central Highlands people, practice, symbol, clothing, architecture, or sacred ecology enters scope.",
      "Versioned An identity and Van Linh world contracts with reviewed source boundaries and new hashes.",
    ],
    safeWhileOpen:
      "Prepare source excerpts, open questions, and a compensated review brief; do not generate An or Van Linh imagery.",
  },
  {
    id: "AVD-005",
    title: "Decide whether Aurevalde's absence may be spent",
    kind: "canon-resource-and-campaign-decision",
    affectedJobIds: ["ACV-089"],
    heldBy: "Creator with lore review",
    question:
      "Should Aurevalde remain deliberately unseen, appear only through bounded indirect evidence, or receive one directly authorized memory fragment?",
    resolutionPaths: [
      "Preserve pure absence. Retire or supersede ACV-089 as intentional non-image evidence; if the campaign must still contain 100 images, declare a versioned replacement rather than silently substituting one.",
      "Authorize indirect evidence only—such as Bela's attested object, food, gesture, song, or corridor memory—without depicting the world itself.",
      "Authorize one bounded direct scene and record exactly which absence resource is being spent and which extrapolations remain forbidden.",
    ],
    requiredEvidence: [
      "Creator decision naming the chosen visibility level and its story cost.",
      "Lore review separating attested details from every extrapolation.",
      "A campaign supersession record if ACV-089 changes subject, medium, or image status.",
    ],
    safeWhileOpen:
      "Preserve the empty slot and study Bela's cited memories in text; do not turn missing evidence into a generic Realm skyline.",
  },
  {
    id: "AVD-006",
    title: "Earn the ten-Guardian ensemble prerequisite",
    kind: "identity-maturity-gate",
    affectedJobIds: ["ACV-099"],
    heldBy:
      "Creator and identity council after all ten individual lineages mature",
    question:
      "Have all ten Guardian identities earned versioned locks and qualified reference sets that make ensemble hierarchy measurable rather than invented?",
    resolutionPaths: [
      "Complete individual silhouette, portrait, action, relation, and eight-view reference qualification for every Guardian before the ensemble.",
      "If any identity remains open, keep ACV-099 blocked; there is no collage or prompt-only shortcut.",
    ],
    requiredEvidence: [
      "Ten versioned human identity-lock records.",
      "Ten qualified eight-view reference sets with explicit smallest-sufficient assignments to ACV-099.",
      "Rights and cultural-origin evidence for every visible identity, plus an ensemble-specific continuity plan.",
    ],
    safeWhileOpen:
      "Advance individual Guardian studies and reference maturity; do not generate an ensemble that would silently cast ten open bodies.",
  },
];
const decisionJobIds = visualDecisionDefinitions.flatMap(
  (decision) => decision.affectedJobIds,
);
const blockedJobIds = blockedJobs.map((job) => job.id);
if (
  unique(decisionJobIds).length !== decisionJobIds.length ||
  blockedJobIds.some((id) => !decisionJobIds.includes(id)) ||
  decisionJobIds.some((id) => !blockedJobIds.includes(id))
) {
  throw new Error(
    "Visual decision register must cover every blocked job exactly once and no executable jobs.",
  );
}
const campaignStatus =
  publishedCount === executableCount && executableCount > 0
    ? "published"
    : publishedCount > 0
      ? "publication-in-progress"
      : approvedCount > 0
        ? "approval-in-progress"
        : generatedCount > 0
          ? "generation-in-review"
          : "planned-machine-gated";

const campaign = {
  meta: {
    schema: "arcanea.visual_campaign.v1",
    version: VERSION,
    campaignId: "arcanea-living-constellation-100",
    createdAt: `${DATE}T00:00:00.000Z`,
    status: campaignStatus,
    totalJobs: sequence,
    roundSize: 10,
    generatedCount,
    approvedCount,
    publishedCount,
    blockedCount: rounds
      .flatMap((round) => round.jobs)
      .filter((job) => job.generationState === "blocked").length,
    machineGate:
      generatedCount === 0
        ? "Latest HOLD recorded 2026-08-25 local time: media generation must not start until a fresh pp preflight allows it."
        : "Every generation session requires a fresh recorded machine preflight; each output receipt carries that evidence.",
    previousWave: {
      name: "Resonant Kinforms / Visual Encyclopedia Wave 02",
      evidence: "planning-with-files/design-loop-evidence.json",
      inspectedImages: 100,
      totalPublicationPacketAssets: 130,
      decision: "iterate-not-duplicate",
      campaignRelationship: "historical-proposal-evidence-not-campaign-output",
      rightsState: "pending-human-clearance",
      publicationState: "not-authorized",
      legacyDossierPathRepairsRequired: 30,
      releaseBoundary:
        "Historical proposal evidence, not output from this campaign. Rights remain pending, publication is not authorized, and 30 Wave-01 dossier paths require packet regeneration before ingest.",
    },
    externalSourceEvidence: [creatorPacketEvidence],
    localSourceEvidence: [...repoSourceEvidence.values()].sort((left, right) =>
      left.path.localeCompare(right.path),
    ),
    releaseTruth:
      generatedCount === 0
        ? "No job in this campaign has been generated, approved, or published. All visual identities remain candidates until human approval."
        : `${generatedCount} jobs have recorded outputs; ${approvedCount} are approved and ${publishedCount} are published. Generated outputs remain candidates until their independent review and human gates are complete.`,
  },
  adaptiveProtocol: {
    cadence: "ten images, then mandatory reflection",
    firstDecision:
      "Select one primary system and one secondary mode only after each style is tested on Kael Thornfield, a source-complete human identity, and Draconis, a countable non-human morphology proposal.",
    benchmarkAnchors: [
      {
        entityId: "kael-thornfield",
        role: "source-complete human rendering and story-action control",
      },
      {
        entityId: "draconis",
        role: "countable non-human anatomy, material consequence, and silhouette control",
      },
    ],
    benchmarkLimitation:
      "Round 01 begins without accepted image-reference hashes. Between-style likeness variation is experimental noise; this round may select a rendering hypothesis but cannot lock either identity. Identity continuity claims require later accepted references and regression tests.",
    laterDecision:
      "After each round, retain, revise, or retire rules; record a decision receipt before compiling the next round.",
    laterAllocation:
      "Rounds 02–10 normally allocate the accepted primary system to eight executable jobs and the distinct secondary mode to two deterministic portability probes. A smaller executable set reserves up to two probes while always leaving at least one primary job.",
    probeInterpretation:
      "Probe ids derive from the prior accepted reflection hash. Because later subjects differ, probes are longitudinal portability evidence rather than direct A/B comparisons; one probe can never promote or retire a mode.",
    providerRule:
      "Discover current provider capabilities at runtime. The identity contract remains engine-neutral.",
    humanGates: [
      "canon conflict",
      "identity lock",
      "rights and likeness",
      "cultural sensitivity",
      "spend",
      "external publication",
    ],
  },
  proofProtocol: {
    reviewMethod:
      "Style-blind two-pass critique uses opaque candidate ids, separate sealed scorecards, and unblinding only after both critics finish.",
    identityRule:
      "One approved image is one bounded view. A 5/5 identity-continuity claim needs eight distinct approved regression views, human identity-lock evidence, and an explicit smallest-sufficient assignment to the exact future job.",
    stages: [
      {
        id: "contracted",
        label: "Contracted",
        count: sequence,
        meaning:
          "Source, truth state, open variables, visible brief, governance, and prompt hash exist.",
      },
      {
        id: "recorded",
        label: "Recorded",
        count: generatedCount,
        meaning:
          "Decoded bytes bind an immutable execution manifest, exact prompt, references, and media hash.",
      },
      {
        id: "approved",
        label: "Approved",
        count: approvedCount,
        meaning:
          "Blind review passed and canon, identity, rights, brand, sensitivity, and human gates are recorded.",
      },
      {
        id: "published",
        label: "Published",
        count: publishedCount,
        meaning:
          "The exact approved bytes have canonical external publication evidence.",
      },
      {
        id: "identity-qualified",
        label: "Identity-qualified",
        count: qualifiedReferenceSets.length,
        meaning:
          "Eight approved regression views agree and a human has qualified a versioned identity set.",
      },
    ],
  },
  styles,
  rubric: {
    id: "arcanea_visual_quality_v1_10x5",
    scale: "1–5 per dimension; 50 maximum",
    dimensions: [
      "prompt adherence",
      "source and canon fidelity",
      "identity continuity",
      "silhouette legibility",
      "anatomy and count accuracy",
      "material specificity",
      "composition and hierarchy",
      "emotional story truth",
      "Arcanea distinctiveness",
      "release readiness",
    ],
    threshold: 42,
    hardFloors: {
      "source and canon fidelity": 4,
      "identity continuity": 4,
      "anatomy and count accuracy": 4,
    },
    decision:
      "A hard-floor failure cannot be averaged away. Human approval remains required above threshold.",
  },
  rounds,
};

const guardianIdentityAtlas = {
  meta: {
    schema: "arcanea.guardian_identity_atlas.v1",
    version: VERSION,
    generatedAt: `${DATE}T00:00:00.000Z`,
    sourceOfTruth:
      "Locked Guardian names, Gates, domains, and bonds from CANON_LOCKED.md; behavioral studies from the creator-supplied Tenfold Constitution proposal",
    truthBoundary:
      "No reviewed source currently locks Guardian faces, bodies, apparent ages, garments, scale, or cultural embodiment. Every Guardian render is therefore an internal discovery study until a human-approved, versioned physical identity contract supersedes this atlas.",
  },
  guardians: guardians.map((guardian, index) => {
    const identityJob = allCampaignJobs.find(
      (candidate) =>
        candidate.subjectKind === "guardian" &&
        candidate.entityId === guardian.id,
    );
    const beast = godbeasts[index];
    const dyadJob = allCampaignJobs.find(
      (candidate) =>
        candidate.subjectKind === "dyad" &&
        candidate.round === 4 &&
        candidate.entityId === `dyad-${guardian.id}-${beast.id}`,
    );
    if (!identityJob || !dyadJob) {
      throw new Error(`Missing Guardian campaign jobs for ${guardian.id}.`);
    }
    return {
      id: guardian.id,
      name: guardian.name,
      gate: guardian.gate,
      gateIndex: guardian.index,
      domain: guardian.domain,
      bondedGodbeast: {
        id: beast.id,
        name: beast.name,
        chordCount: beast.chordCount,
      },
      readiness: "discovery-only",
      evidenceState: guardian.evidenceState,
      behaviorThesis: guardian.description,
      storyBeat: guardian.storyBeat,
      discoveryFocus: guardian.discoveryFocus,
      openIdentityVariables: guardian.openIdentityVariables,
      reviewRequirements: guardian.reviewRequirements,
      sensitivityReviewRequired: guardian.sensitivityReviewRequired,
      sourceRefs: pinSourceRefs(guardian.sourceRefs),
      campaign: {
        identityJobId: identityJob.id,
        identityRound: identityJob.round,
        dyadJobId: dyadJob.id,
        dyadRound: dyadJob.round,
        generationState: identityJob.generationState,
        releaseState: identityJob.releaseState,
        releaseEligibility: identityJob.releaseEligibility,
        publicImageUrl: identityJob.output?.publicUrl ?? null,
      },
    };
  }),
};

const guardianReadinessMarkdown = `# Arcanea Guardian Identity Readiness v${VERSION}

> Generated knowledge-base index. Locked cosmology is separated from creator-proposed behavioral myth and still-open physical identity.

## Truth boundary

${guardianIdentityAtlas.meta.truthBoundary}

## Portfolio state

| State | Count | Meaning |
|---|---:|---|
| Discovery only | ${guardianIdentityAtlas.guardians.length} | The campaign may test behavior, posture, silhouette, and style internally. Approval, public staging, and identity-master language are technically denied until the physical identity is locked. |
| Source complete | 0 | No Guardian currently has a source-complete physical identity record. |
| Blocked | 0 | Guardian-only studies are executable; separate Godbeast conflicts still block Sol and Source dyad jobs. |

## Guardian index

| Guardian | Gate | Bond | Identity study | Dyad study | Public eligibility |
|---|---|---|---|---|---|
${guardianIdentityAtlas.guardians.map((guardian) => `| [${guardian.name}](#${slug(guardian.name)}) | ${guardian.gateIndex} · ${guardian.gate} | ${guardian.bondedGodbeast.name} · ${guardian.bondedGodbeast.chordCount} Chord${guardian.bondedGodbeast.chordCount === 1 ? "" : "s"} | ${guardian.campaign.identityJobId} / Round ${String(guardian.campaign.identityRound).padStart(2, "0")} | ${guardian.campaign.dyadJobId} / Round ${String(guardian.campaign.dyadRound).padStart(2, "0")} | ${guardian.campaign.releaseEligibility.replaceAll("-", " ")} |`).join("\n")}

${guardianIdentityAtlas.guardians
  .map(
    (guardian) => `## ${guardian.name}

**Locked relation:** Gate ${guardian.gateIndex} · ${guardian.gate} · ${guardian.domain} · bonded with ${guardian.bondedGodbeast.name}  
**Readiness:** discovery only  
**Campaign:** ${guardian.campaign.identityJobId}, Round ${String(guardian.campaign.identityRound).padStart(2, "0")} · ${guardian.campaign.dyadJobId}, Round ${String(guardian.campaign.dyadRound).padStart(2, "0")}

### Behavioral thesis

${guardian.behaviorThesis}

### Story-bearing frame

${guardian.storyBeat}

### Discovery focus

${guardian.discoveryFocus}

### Open physical identity

${guardian.openIdentityVariables.map((item) => `- ${item}`).join("\n")}

### Required reviews

${guardian.reviewRequirements.map((item) => `- ${item}`).join("\n")}

### Sources

${pinSourceRefs(guardian.sourceRefs)
  .map((item) => `- \`${item}\``)
  .join("\n")}`,
  )
  .join("\n\n")}
`;

const godbeastIdentityAtlas = {
  meta: {
    schema: "arcanea.godbeast_identity_atlas.v1",
    version: VERSION,
    generatedAt: `${DATE}T00:00:00.000Z`,
    sourceOfTruth:
      "Locked Godbeast names, Gates, and bonds from CANON_LOCKED.md; functional phenomena and physical-readiness state from the local Godbeast lore records; morphology candidates and story actions from the creator-supplied Tenfold Constitution proposal",
    truthBoundary:
      "The local records explicitly leave eight physical forms canon-pending and ground only the Phoenix-Serpent base form for Veloura and Worldtree Deer base form for Laeylinn. All detailed morphology remains a creator proposal until human canon reconciliation and a versioned identity lock. Sol and Source are blocked by named contradictions.",
  },
  godbeasts: godbeasts.map((beast, index) => {
    const morphologyJob = allCampaignJobs.find(
      (candidate) =>
        candidate.subjectKind === "godbeast" &&
        candidate.entityId === beast.id &&
        candidate.round === 3,
    );
    const guardian = guardians[index];
    const dyadJob = allCampaignJobs.find(
      (candidate) =>
        candidate.subjectKind === "dyad" &&
        candidate.round === 4 &&
        candidate.entityId === `dyad-${guardian.id}-${beast.id}`,
    );
    if (!morphologyJob || !dyadJob) {
      throw new Error(`Missing Godbeast campaign jobs for ${beast.id}.`);
    }
    return {
      id: beast.id,
      name: beast.name,
      gate: beast.gate,
      gateIndex: beast.index,
      chordCount: beast.chordCount,
      bondedGuardian: { id: guardian.id, name: guardian.name },
      readiness: beast.conflict ? "blocked" : "discovery-only",
      identityState: beast.identityState,
      evidenceState: beast.evidenceState,
      morphologyCandidate: beast.description,
      functionalTruth: beast.functionalTruth,
      storyBeat: beast.storyBeat,
      openIdentityVariables: beast.openIdentityVariables,
      reviewRequirements: beast.reviewRequirements,
      sensitivityReviewRequired: beast.sensitivityReviewRequired,
      blockedReason: beast.conflict,
      sourceRefs: pinSourceRefs(beast.sourceRefs),
      campaign: {
        morphologyJobId: morphologyJob.id,
        morphologyRound: morphologyJob.round,
        dyadJobId: dyadJob.id,
        dyadRound: dyadJob.round,
        generationState: morphologyJob.generationState,
        releaseState: morphologyJob.releaseState,
        releaseEligibility: morphologyJob.releaseEligibility,
        publicImageUrl: morphologyJob.output?.publicUrl ?? null,
      },
    };
  }),
};

const godbeastReadinessMarkdown = `# Arcanea Godbeast Identity Readiness v${VERSION}

> Generated knowledge-base index. Locked relations, locally grounded functional phenomena, creator-proposed morphology, and unresolved conflicts remain visibly separate.

## Truth boundary

${godbeastIdentityAtlas.meta.truthBoundary}

## Portfolio state

| State | Count | Meaning |
|---|---:|---|
| Discovery only | ${godbeastIdentityAtlas.godbeasts.filter((beast) => beast.readiness === "discovery-only").length} | A controlled candidate morphology may be tested internally. It is not canon, an identity master, or public-release eligible. |
| Blocked | ${godbeastIdentityAtlas.godbeasts.filter((beast) => beast.readiness === "blocked").length} | Generation is denied until the named canon or proposal contradiction is resolved. |
| Source complete | 0 | No Godbeast has a complete, human-approved physical identity contract in the reviewed local sources. |

## Godbeast index

| Godbeast | Gate | Chords | Bond | Morphology study | Dyad study | Readiness |
|---|---|---:|---|---|---|---|
${godbeastIdentityAtlas.godbeasts.map((beast) => `| [${beast.name}](#${slug(beast.name)}) | ${beast.gateIndex} · ${beast.gate} | ${beast.chordCount} | ${beast.bondedGuardian.name} | ${beast.campaign.morphologyJobId} / Round ${String(beast.campaign.morphologyRound).padStart(2, "0")} | ${beast.campaign.dyadJobId} / Round ${String(beast.campaign.dyadRound).padStart(2, "0")} | ${beast.readiness.replaceAll("-", " ")} |`).join("\n")}

${godbeastIdentityAtlas.godbeasts
  .map(
    (beast) => `## ${beast.name}

**Locked relation:** Gate ${beast.gateIndex} · ${beast.gate} · bonded with ${beast.bondedGuardian.name}  
**Chord contract:** exactly ${beast.chordCount} countable terminal${beast.chordCount === 1 ? "" : "s"} in the tested candidate  
**Readiness:** ${beast.readiness.replaceAll("-", " ")}  
**Campaign:** ${beast.campaign.morphologyJobId}, Round ${String(beast.campaign.morphologyRound).padStart(2, "0")} · ${beast.campaign.dyadJobId}, Round ${String(beast.campaign.dyadRound).padStart(2, "0")}

### Locally grounded functional phenomena

${beast.functionalTruth}

### Tested morphology candidate

${beast.morphologyCandidate}

### Story-bearing action

${beast.storyBeat}

### Open physical identity

${beast.openIdentityVariables.map((item) => `- ${item}`).join("\n")}

### Required reviews

${beast.reviewRequirements.map((item) => `- ${item}`).join("\n")}

${beast.blockedReason ? `### Blocking conflict\n\n${beast.blockedReason}\n\n` : ""}### Sources

${pinSourceRefs(beast.sourceRefs)
  .map((item) => `- \`${item}\``)
  .join("\n")}`,
  )
  .join("\n\n")}
`;

const worldIdentityAtlas = {
  meta: {
    schema: "arcanea.world_identity_atlas.v1",
    version: VERSION,
    generatedAt: `${DATE}T00:00:00.000Z`,
    sourceOfTruth:
      "The cited manuscript, council-elevated Realm, staging-lore, and product-system records; readiness is assigned per one bounded campaign plate rather than inferred from a world name",
    truthBoundary:
      "A source-complete plate has enough cited geography, material economy, ecology, and action for one internal candidate, not blanket authority over the whole world. Discovery-only plates remain internal. Van Linh is blocked by its Vietnamese review protocol; Aurevalde is blocked because direct depiction would spend an explicitly preserved pure-absence canon resource.",
  },
  worlds: worlds.map((world) => {
    const job = allCampaignJobs.find(
      (candidate) =>
        candidate.subjectKind === "world" && candidate.entityId === world.id,
    );
    if (!job) throw new Error(`Missing world campaign job for ${world.id}.`);
    return {
      id: world.id,
      name: world.name,
      readiness: world.readiness,
      canonState: world.canonState,
      identityState: world.identityState,
      evidenceState: world.evidenceState,
      systemThesis: world.description,
      storyBeat: world.storyBeat,
      openIdentityVariables: world.openIdentityVariables,
      reviewRequirements: world.reviewRequirements,
      sensitivityReviewRequired: world.sensitivityReviewRequired,
      blockedReason: world.blockedReason,
      sourceRefs: pinSourceRefs(world.sourceRefs),
      campaign: {
        jobId: job.id,
        round: job.round,
        generationState: job.generationState,
        releaseState: job.releaseState,
        releaseEligibility: job.releaseEligibility,
        publicImageUrl: job.output?.publicUrl ?? null,
      },
    };
  }),
};

const worldReadinessMarkdown = `# Arcanea World Identity Readiness v${VERSION}

> Generated knowledge-base index. Each record binds a world claim to geography, labor, material economy, ecology, action, open variables, and one exact campaign job.

## Truth boundary

${worldIdentityAtlas.meta.truthBoundary}

## Portfolio state

| State | Count | Meaning |
|---|---:|---|
| Source complete | ${worldIdentityAtlas.worlds.filter((world) => world.readiness === "source-complete").length} | One bounded source-defined system plate may become a candidate after all human gates; this does not lock the whole world. |
| Source complete, specialist review required | ${worldIdentityAtlas.worlds.filter((world) => world.readiness === "source-complete-review-required").length} | Internal exploration is possible; named cultural review evidence is mandatory before approval. |
| Discovery only | ${worldIdentityAtlas.worlds.filter((world) => world.readiness === "discovery-only").length} | Open world variables must stay visible and the release system keeps the result internal. |
| Blocked | ${worldIdentityAtlas.worlds.filter((world) => world.readiness === "blocked").length} | Generation is denied until the named cultural or canon-resource decision is complete. |

## World index

| World | Readiness | Campaign | Release eligibility |
|---|---|---|---|
${worldIdentityAtlas.worlds.map((world) => `| [${world.name}](#${slug(world.name)}) | ${world.readiness.replaceAll("-", " ")} | ${world.campaign.jobId} / Round ${String(world.campaign.round).padStart(2, "0")} | ${world.campaign.releaseEligibility.replaceAll("-", " ")} |`).join("\n")}

${worldIdentityAtlas.worlds
  .map(
    (world) => `## ${world.name}

**Readiness:** ${world.readiness.replaceAll("-", " ")}  
**Canon state:** ${world.canonState.replaceAll("_", " ")}  
**Campaign:** ${world.campaign.jobId}, Round ${String(world.campaign.round).padStart(2, "0")}

### World-system thesis

${world.systemThesis}

### Story-bearing environmental action

${world.storyBeat}

### Open world identity

${world.openIdentityVariables.length ? world.openIdentityVariables.map((item) => `- ${item}`).join("\n") : "- No silent variables for this bounded plate. A wider world identity still requires human review."}

### Required reviews

${world.reviewRequirements.length ? world.reviewRequirements.map((item) => `- ${item}`).join("\n") : "- Standard canon, identity, rights, brand, and release gates."}

${world.blockedReason ? `### Blocking condition\n\n${world.blockedReason}\n\n` : ""}### Sources

${pinSourceRefs(world.sourceRefs)
  .map((item) => `- \`${item}\``)
  .join("\n")}`,
  )
  .join("\n\n")}
`;

const characterIdentityAtlas = {
  meta: {
    schema: "arcanea.character_identity_atlas.v1",
    version: VERSION,
    generatedAt: `${DATE}T00:00:00.000Z`,
    sourceOfTruth:
      "scripts/build-arcanea-living-constellation.mjs plus the cited manuscript BIBLE and character files",
    truthBoundary:
      "A source-complete record is still a candidate until human identity approval. A discovery-only record may generate internal explorations but may not be approved or staged publicly. A blocked record may not be generated.",
  },
  characters: bookCharacters.map((character) => {
    const job = allCampaignJobs.find(
      (candidate) =>
        candidate.subjectKind === "book-character" &&
        candidate.entityId === character.id &&
        [7, 8].includes(candidate.round),
    );
    if (!job) throw new Error(`Missing visual job for ${character.id}.`);
    const readiness = character.blockedReason
      ? "blocked"
      : character.openIdentityVariables.length
        ? "discovery-only"
        : character.sensitivityReviewRequired
          ? "source-complete-review-required"
          : "source-complete";
    return {
      id: character.id,
      name: character.name,
      series: character.series,
      readiness,
      evidenceState: character.evidenceState,
      description: character.description,
      storyBeat: character.storyBeat,
      openIdentityVariables: character.openIdentityVariables,
      reviewRequirements: character.reviewRequirements,
      sensitivityReviewRequired: character.sensitivityReviewRequired,
      blockedReason: character.blockedReason,
      sourceRefs: pinSourceRefs(character.sourceRefs),
      campaign: {
        jobId: job.id,
        round: job.round,
        generationState: job.generationState,
        releaseState: job.releaseState,
        releaseEligibility: job.releaseEligibility,
        publicImageUrl: job.output?.publicUrl ?? null,
      },
    };
  }),
};

const characterReadinessCounts = Object.fromEntries(
  [
    "source-complete",
    "source-complete-review-required",
    "discovery-only",
    "blocked",
  ].map((state) => [
    state,
    characterIdentityAtlas.characters.filter(
      (character) => character.readiness === state,
    ).length,
  ]),
);

const characterReadinessMarkdown = `# Arcanea Character Identity Readiness v${VERSION}

> Generated knowledge-base index. Manuscript evidence is not automatically locked canon or final visual identity.

## Truth boundary

${characterIdentityAtlas.meta.truthBoundary}

## Portfolio state

| State | Count | Meaning |
|---|---:|---|
| Source complete | ${characterReadinessCounts["source-complete"]} | Physical and story evidence can support an internal identity-master candidate; human identity and release gates still apply. |
| Source complete, review required | ${characterReadinessCounts["source-complete-review-required"]} | The identity record is specific enough to explore, but named cultural or lived-experience review must be evidenced before approval. |
| Discovery only | ${characterReadinessCounts["discovery-only"]} | Known facts may guide internal exploration; open physical variables remain provisional and public approval is technically denied. |
| Blocked | ${characterReadinessCounts.blocked} | Generation is denied until the named source, identity, or sensitivity conflict is resolved. |

## Character index

| Character | Series | State | Campaign job | Public eligibility |
|---|---|---|---|---|
${characterIdentityAtlas.characters.map((character) => `| [${character.name}](#${slug(character.name)}) | ${character.series} | ${character.readiness.replaceAll("-", " ")} | ${character.campaign.jobId} / Round ${String(character.campaign.round).padStart(2, "0")} | ${character.campaign.releaseEligibility.replaceAll("-", " ")} |`).join("\n")}

${characterIdentityAtlas.characters
  .map(
    (character) => `## ${character.name}

**Series:** ${character.series}  
**Readiness:** ${character.readiness.replaceAll("-", " ")}  
**Campaign:** ${character.campaign.jobId}, Round ${String(character.campaign.round).padStart(2, "0")}  
**Evidence state:** ${character.evidenceState.replaceAll("-", " ")}

### Identity evidence

${character.description}

### Story-bearing frame

${character.storyBeat}

### Open identity variables

${character.openIdentityVariables.length ? character.openIdentityVariables.map((item) => `- ${item}`).join("\n") : "- None in the current manuscript record; human identity approval still remains required."}

### Required reviews

${character.reviewRequirements.length ? character.reviewRequirements.map((item) => `- ${item}`).join("\n") : "- No specialist review named beyond the standard canon, identity, rights, brand, sensitivity, and human release gates."}

${character.blockedReason ? `### Blocker\n\n${character.blockedReason}\n\n` : ""}### Sources

${pinSourceRefs(character.sourceRefs)
  .map((item) => `- \`${item}\``)
  .join("\n")}`,
  )
  .join("\n\n")}
`;

const coverageMatrixMarkdown = `# Arcanea Visual Coverage Matrix v${VERSION}

> Generated master index · 66 named visual entities · 100 contracted image jobs · ${generatedCount} recorded outputs · ${approvedCount} approved · ${qualifiedReferenceSets.length} identity-qualified reference sets

This matrix joins the agent team, Guardians, Godbeasts, book characters, worlds, workflow scenes, and regression duties without collapsing their truth states. A job row proves that a versioned prompt contract exists; it does not prove that an image exists or that an identity is approved.

## Experimental control

- Round 01 holds Kael Thornfield's source-defined human facts and one Draconis morphology proposal across five rendering systems.
- No accepted reference hashes exist in Round 01, so the result may select a rendering hypothesis but cannot lock likeness.
- Every later round is gated by the previous ten-image reflection.
- One approved image is one bounded view. Identity qualification requires eight distinct approved regression views and an explicit future-job assignment.

## Agent team — 16 identities

| Agent | Domain | Visual job | Generation | Release | Instrument |
|---|---|---|---|---|---|
${agents
  .map((agent) => {
    const job = allCampaignJobs.find(
      (candidate) =>
        candidate.subjectKind === "agent" && candidate.entityId === agent.id,
    );
    return `| ${agent.name} | ${agent.domain} | ${job?.id ?? "unassigned"} | ${job?.generationState ?? "unassigned"} | ${job?.releaseState ?? "unassigned"} | ${agent.instrument} |`;
  })
  .join("\n")}

## Guardians — 10 identities, 20 studies

| Guardian | Gate | Readiness | Solo | Dyad | Release eligibility |
|---|---|---|---|---|---|
${guardianIdentityAtlas.guardians.map((guardian) => `| ${guardian.name} | ${guardian.gate} | ${guardian.readiness} | ${guardian.campaign.identityJobId} | ${guardian.campaign.dyadJobId} | ${guardian.campaign.releaseEligibility} |`).join("\n")}

## Godbeasts — 10 identities, 20 studies

| Godbeast | Gate | Chords | Readiness | Morphology | Dyad |
|---|---|---:|---|---|---|
${godbeastIdentityAtlas.godbeasts.map((godbeast) => `| ${godbeast.name} | ${godbeast.gate} | ${godbeast.chordCount} | ${godbeast.readiness} | ${godbeast.campaign.morphologyJobId} | ${godbeast.campaign.dyadJobId} |`).join("\n")}

## Book characters — 20 identities

| Character | Series | Readiness | Job | Release eligibility |
|---|---|---|---|---|
${characterIdentityAtlas.characters.map((character) => `| ${character.name} | ${character.series} | ${character.readiness} | ${character.campaign.jobId} | ${character.campaign.releaseEligibility} |`).join("\n")}

## Worlds — 10 bounded system plates

| World | Readiness | Job | Release eligibility | System thesis |
|---|---|---|---|---|
${worldIdentityAtlas.worlds.map((world) => `| ${world.name} | ${world.readiness} | ${world.campaign.jobId} | ${world.campaign.releaseEligibility} | ${world.systemThesis} |`).join("\n")}

## Governed workflow scenes

| Job | Scene | Generation | Release eligibility |
|---|---|---|---|
${allCampaignJobs
  .filter((job) => job.subjectKind === "workflow")
  .map(
    (job) =>
      `| ${job.id} | ${job.name} | ${job.generationState} | ${job.releaseEligibility} |`,
  )
  .join("\n")}

## Regression duties

| Job | Test | Generation | Reference gate |
|---|---|---|---|
${allCampaignJobs
  .filter((job) => job.subjectKind === "regression")
  .map(
    (job) =>
      `| ${job.id} | ${job.name} | ${job.generationState} | ${job.promptContract.constraints.find((constraint) => constraint.includes("reference")) ?? "human identity evidence required"} |`,
  )
  .join("\n")}

## Operational surfaces

- Public atlas: \`/constellation\`, 66 named identity dossiers, and 100 static prompt-contract teaching pages.
- Public teaching pack: \`/downloads/arcanea-constellation/README.md\`, 16 AGENT.md/SKILL.md/agent-card.json triplets, four strict schemas, and 100 exact Prompt Atlas JSON contracts.
- Internal visual workbench: \`planning-with-files/arcanea-visual-workbench/index.html\` (ignored, noindex, never deploy).
- Immutable execution evidence: \`planning-with-files/arcanea-visual-campaign/execution-manifests/\`.
- Output, evaluation, release, and reference receipts remain separate so a beautiful draft cannot silently advance its own authority state.
`;

for (const agent of agents) {
  const base = `apps/web/public/downloads/arcanea-constellation/${agent.id}`;
  const visualIdentityMd = `## Visual identity proposal\n\n- **Silhouette:** ${agent.visualIdentity.silhouette}\n- **Material:** ${agent.visualIdentity.material}\n- **Working light:** ${agent.visualIdentity.light}\n- **Working behavior:** ${agent.visualIdentity.workingBehavior}\n- **Spatial rhythm:** ${agent.visualIdentity.spatialRhythm}\n\nThis visual identity remains a proposal requiring human identity approval.\n`;
  const agentMd = `# ${agent.name}\n\n> Public-safe Arcanea agent blueprint · v${VERSION} · ${agent.authority.runtimeState.replaceAll("_", " ")}\n\n## Purpose\n\n${agent.purpose}\n\n## Perspective\n\n${agent.perspective}\n\n## Core instrument\n\n${agent.instrument}.\n\n## Invocation contract\n\nUse ${agent.name} when you need bounded ${agent.epithet.toLowerCase()} work. Its remit: ${agent.oneLiner} Bring a bounded intention, evidence, constraints, truth state, and the decision that must remain human-held. Expect an inspectable artifact—not an oracle answer.\n\n## Inputs\n\n${agent.inputs.map((item) => `- ${item}`).join("\n")}\n\n## Outputs\n\n${agent.outputs.map((item) => `- ${item}`).join("\n")}\n\n## Routes\n\n${agent.routes.map((item) => `- ${item}`).join("\n")}\n\n## Stop conditions\n\n${agent.stopConditions.map((item) => `- ${item}`).join("\n")}\n\n## Human-held authority\n\n${agent.humanGates.map((item) => `- ${item}`).join("\n")}\n\n## Verification questions\n\n- Is every source, inference, proposal, and invention distinguishable?\n- Does the output make the named decision easier without stealing it from the human?\n- Did the agent stop at every listed gate and return unresolved risk visibly?\n- Can another operator reproduce, contest, or supersede the artifact from its evidence?\n\nThis blueprint cannot lock canon, approve identity, spend, or publish. Its public name is an existing Arcanea product identity; this dossier is a proposed operating contract, not locked mythology or evidence of an autonomous deployed runtime.\n`;
  const skillMd = `---\nname: arcanea-${agent.id}\ndescription: >-\n  Use when Arcanea work needs bounded ${agent.epithet.toLowerCase()} judgment, especially where ${agent.name} ${agent.oneLiner.charAt(0).toLowerCase()}${agent.oneLiner.slice(1)}\n---\n\n# ${agent.name} operating skill\n\n## Input contract\n\n${agent.inputs.map((item) => `- ${item}`).join("\n")}\n\nAlso provide the intended audience, truth state, release state, constraints, and the exact human-held decision. Missing evidence stays missing; never fill it with plausible invention.\n\n## Operating loop\n\n1. Read the user intention, source refs, truth state, constraints, and release state.\n2. Stop when any listed stop condition or human gate applies.\n3. Select the smallest valid route from the route list below.\n4. Produce only the smallest inspectable artifact that advances the approved route.\n5. Label fact, inference, proposal, and invention separately.\n6. Verify the output against sources, constraints, stop conditions, and human authority.\n7. Return outputs, evidence, unresolved risks, and the next bounded decision.\n\n## Routes\n\n${agent.routes.map((item) => `- ${item}`).join("\n")}\n\n## Capabilities\n\n${agent.capabilities.map((item) => `- ${item}`).join("\n")}\n\n## Output contract\n\n${agent.outputs.map((item) => `- ${item}`).join("\n")}\n\nEvery output names its evidence, confidence, dissent, open questions, and supersession path.\n\n## Stop conditions\n\n${agent.stopConditions.map((item) => `- ${item}`).join("\n")}\n\n## Human gates\n\n${agent.humanGates.map((item) => `- ${item}`).join("\n")}\n\n## Verification\n\n- Sources and hashes resolve.\n- Required fields and counts are complete.\n- Fact, inference, proposal, and invention are separate.\n- No stop condition or human gate was bypassed.\n- The artifact is reproducible, contestable, and safe to supersede.\n\n## Handoff contract\n\nReturn source references, changed artifacts, checks run, confidence, dissent, rollback or supersession path, and any approval still required.\n`;
  write(
    `${base}/AGENT.md`,
    agentMd.replace(
      "\n\n## Inputs\n\n",
      `\n\n${visualIdentityMd}\n## Inputs\n\n`,
    ),
  );
  write(`${base}/SKILL.md`, skillMd);
  writeJson(`${base}/agent-card.json`, {
    schema: "arcanea.public_agent_card.v1",
    version: VERSION,
    id: agent.id,
    name: agent.name,
    domain: agent.domain,
    epithet: agent.epithet,
    purpose: agent.purpose,
    capabilities: agent.capabilities,
    skillRefs: agent.skillRefs,
    stopConditions: agent.stopConditions,
    humanGates: agent.humanGates,
    authority: agent.authority,
    visualIdentity: agent.visualIdentity,
    sourceRefs: pinSourceRefs(agent.sourceRefs),
    integrity: {
      generatedFrom: "apps/web/data/arcanea-constellation.v1.json",
      cardHash: hash({
        id: agent.id,
        version: VERSION,
        purpose: agent.purpose,
      }),
    },
  });
}

const publicPromptRoot =
  "apps/web/public/downloads/arcanea-constellation/prompts";
const numericMedian = (values) => {
  const ordered = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(ordered.length / 2);
  return ordered.length % 2
    ? ordered[midpoint]
    : Math.round((ordered[midpoint - 1] + ordered[midpoint]) / 2);
};
const promptQualityAuditMarkdown = `# Arcanea Prompt Quality Audit v1

> Campaign: ${campaign.meta.campaignId} · v${VERSION} · structural evidence only

This audit measures the complete engine-neutral contract set before provider execution. It proves structure, specificity, lineage, and truth boundaries; it cannot score image quality or select a winning render system while output count remains ${generatedCount}.

## Current result

- Contracts audited: **${allCampaignJobs.length}**
- Structurally executable jobs: **${executableCount}**
- Truthfully gated jobs: **${campaign.meta.blockedCount}**
- Concrete consequential story beats: **${allCampaignJobs.filter((job) => job.promptContract.storyBeat !== "A quiet working moment one beat before consequence; the subject is doing something specific rather than posing.").length} / ${allCampaignJobs.length}**
- Machine-readable output contracts: **${allCampaignJobs.filter((job) => job.promptContract.output?.assetCount === 1 && job.promptContract.output?.aspectRatio && job.promptContract.output?.intendedSurface && job.promptContract.output?.cropSafety && job.promptContract.output?.generatedTextPolicy === "no-generated-text").length} / ${allCampaignJobs.length}**
- Prompt hashes: **${allCampaignJobs.filter((job) => typeof job.promptContract.contractHash === "string").length} / ${allCampaignJobs.length}**
- Accepted image references before Round 01: **0**
- Generated / approved / published: **${generatedCount} / ${approvedCount} / ${publishedCount}**

## Round portfolio

| Round | Subject mix | Executable | Gated | Median story chars | Median constraints | Open variables |
|---:|---|---:|---:|---:|---:|---:|
${rounds
  .map((round) => {
    const kinds = [...new Set(round.jobs.map((job) => job.subjectKind))].join(
      " + ",
    );
    return `| ${String(round.round).padStart(2, "0")} | ${kinds} | ${round.jobs.filter((job) => job.generationState !== "blocked").length} | ${round.jobs.filter((job) => job.generationState === "blocked").length} | ${numericMedian(round.jobs.map((job) => job.promptContract.storyBeat.length))} | ${numericMedian(round.jobs.map((job) => job.promptContract.constraints.length))} | ${round.jobs.reduce((total, job) => total + job.openIdentityVariables.length, 0)} |`;
  })
  .join("\n")}

## Subject portfolio

| Subject kind | Jobs | Gated | Median identity-lock chars | Median story chars | Median constraints | Named review requirements |
|---|---:|---:|---:|---:|---:|---:|
${[...new Set(allCampaignJobs.map((job) => job.subjectKind))]
  .sort()
  .map((kind) => {
    const kindJobs = allCampaignJobs.filter((job) => job.subjectKind === kind);
    return `| ${kind} | ${kindJobs.length} | ${kindJobs.filter((job) => job.generationState === "blocked").length} | ${numericMedian(kindJobs.map((job) => job.promptContract.subject.identityLock.length))} | ${numericMedian(kindJobs.map((job) => job.promptContract.storyBeat.length))} | ${numericMedian(kindJobs.map((job) => job.promptContract.constraints.length))} | ${kindJobs.reduce((total, job) => total + job.reviewRequirements.length, 0)} |`;
  })
  .join("\n")}

## Non-negotiable lint contract

Every campaign job must retain a valid content hash, at least one source reference, a substantial identity lock, a concrete action-and-consequence beat, a machine-readable one-asset output contract whose aspect ratio agrees with the human composition, an exact intended surface, crop-safety law, no-generated-text policy, material and light laws, unique visible constraints, unique exclusions, explicit allowed variation, deterministic file checks, human approval, and ledger-matching governance. Blocked work remains inspectable but cannot compile to an executable provider job.

The provider compiler must preserve the allocated style direction and job-specific exclusions, remove operational governance from the image-facing prompt, keep creative semantics aligned across lanes, translate FLUX exclusions into positive desired qualities, and bind every execution prompt to an immutable manifest.

## Interpretation boundary

Round 01 compares five rendering hypotheses on two controlled anchors without accepted image references. The audit can show that the contracts are comparable; only full-resolution outputs, blinded two-critic scores, hard-floor evidence, and a human decision can select primary and secondary modes. Rounds 02–10 then use deterministic primary/secondary portability allocation and freeze after each ten-image batch.

The deterministic validator removes only the declared style id, style direction, and that style's exclusions, then proves that every remaining Kael contract is identical across five modes and every remaining Draconis contract is identical across five modes. Subject, story beat, evidence object, composition, geometry, light law, material law, governance, references, and acceptance floors therefore remain matched-pair controls.
`;
const visualDecisionRegisterMarkdown = `# Arcanea Visual Open-Decision Register v1

> Campaign: ${campaign.meta.campaignId} · v${VERSION} · generated from the exact blocked-job ledger

This register turns every generation blocker into a bounded human decision or evidence gate. It recommends no canon answer and grants no authority. A decision takes effect only through its named versioned evidence, revised contract hashes, and the normal verification chain.

## Current boundary

- Contracted jobs: **${allCampaignJobs.length}**
- Structurally executable now: **${executableCount}**
- Blocked jobs: **${blockedJobs.length}**
- Decision or maturity gates: **${visualDecisionDefinitions.length}**
- Silent substitutions allowed: **0**

| Gate | Type | Held by | Affected jobs |
|---|---|---|---|
${visualDecisionDefinitions
  .map(
    (decision) =>
      `| ${decision.id} — ${decision.title} | ${decision.kind} | ${decision.heldBy} | ${decision.affectedJobIds.map((jobId) => `[${jobId}](/constellation/prompts/${jobId.toLowerCase()})`).join(", ")} |`,
  )
  .join("\n")}

${visualDecisionDefinitions
  .map((decision) => {
    const affectedJobs = decision.affectedJobIds.map((jobId) => {
      const job = allCampaignJobs.find((candidate) => candidate.id === jobId);
      if (!job) throw new Error(`Missing decision-register job ${jobId}`);
      return job;
    });
    return `## ${decision.id} — ${decision.title}

- **Gate type:** ${decision.kind}
- **Authority:** ${decision.heldBy}
- **Affected jobs:** ${affectedJobs.map((job) => `${job.id} (${job.name})`).join("; ")}

### Decision question

${decision.question}

### Permitted resolution paths

${decision.resolutionPaths.map((item) => `- ${item}`).join("\n")}

These are neutral paths for a human-held decision, not recommendations or implied canon.

### Evidence required to reopen generation

${decision.requiredEvidence.map((item) => `- ${item}`).join("\n")}

### Current blocker evidence

${affectedJobs.map((job) => `- **${job.id}:** ${job.blockedReason}`).join("\n")}

### Safe work while open

${decision.safeWhileOpen}
`;
  })
  .join("\n")}

## Reopening procedure

1. Record the named human or qualified-review evidence outside the generated campaign data.
2. Update the closest source-of-truth identity, lore, character, or world record through its authorized process.
3. Revise the affected engine-neutral contracts and increment the campaign version when visible meaning changes.
4. Rebuild and verify. The decision register must either remove the affected job ids or bind them to a new explicit gate.
5. Compile new content-addressed provider manifests. Never reuse the manifests or prompt hashes from the blocked state.
6. Obtain a fresh machine preflight and narrow execution grant before any image call.

Keeping an absence, declining a depiction, or requiring more review is a valid decision. If that changes the campaign's exact 100-image target, record a campaign supersession rather than manufacturing a substitute in secret.
`;
for (const job of allCampaignJobs) {
  writeJson(
    `${publicPromptRoot}/${job.id.toLowerCase()}.json`,
    job.promptContract,
  );
}
write(
  `${publicPromptRoot}/PROMPT_ATLAS.md`,
  `# Arcanea Prompt Atlas

One hundred public-safe, engine-neutral visual contracts. Each file separates identity evidence, observable story action, machine-readable output geometry and intended surface, human composition, render-system laws, references, verification, and governance. Provider execution prompts, runtime parameters, grants, spend records, output binaries, and release credentials remain outside this public pack.

- Campaign: ${campaign.meta.campaignId}
- Version: ${VERSION}
- Contracted jobs: ${allCampaignJobs.length}
- Recorded outputs: ${generatedCount}
- Human-approved outputs: ${approvedCount}
- Truth rule: a contract is not an image; an image is not an identity approval.
- Structural audit: [QUALITY_AUDIT.md](./QUALITY_AUDIT.md)
- Open decisions: [OPEN_DECISIONS.md](./OPEN_DECISIONS.md)

| Job | Round | Subject | Evidence | Generation | Contract |
|---|---:|---|---|---|---|
${allCampaignJobs
  .map(
    (job) =>
      `| ${job.id} | ${String(job.round).padStart(2, "0")} | ${job.name} | ${job.evidenceState} | ${job.generationState} | [JSON](./${job.id.toLowerCase()}.json) · [teaching page](/constellation/prompts/${job.id.toLowerCase()}) |`,
  )
  .join("\n")}
`,
);
write(
  "docs/design/ARCANEA_PROMPT_QUALITY_AUDIT_V1.md",
  promptQualityAuditMarkdown,
);
write(`${publicPromptRoot}/QUALITY_AUDIT.md`, promptQualityAuditMarkdown);
write(
  "docs/design/ARCANEA_VISUAL_OPEN_DECISIONS_V1.md",
  visualDecisionRegisterMarkdown,
);
write(`${publicPromptRoot}/OPEN_DECISIONS.md`, visualDecisionRegisterMarkdown);

writeJson("apps/web/data/arcanea-constellation.v1.json", constellation);
writeJson("apps/web/data/arcanea-visual-campaign.v1.json", campaign);
writeJson(
  "apps/web/data/arcanea-guardian-identities.v1.json",
  guardianIdentityAtlas,
);
write(
  "docs/design/ARCANEA_GUARDIAN_IDENTITY_READINESS_V1.md",
  guardianReadinessMarkdown,
);
writeJson(
  "apps/web/data/arcanea-godbeast-identities.v1.json",
  godbeastIdentityAtlas,
);
write(
  "docs/design/ARCANEA_GODBEAST_IDENTITY_READINESS_V1.md",
  godbeastReadinessMarkdown,
);
writeJson("apps/web/data/arcanea-world-identities.v1.json", worldIdentityAtlas);
write(
  "docs/design/ARCANEA_WORLD_IDENTITY_READINESS_V1.md",
  worldReadinessMarkdown,
);
writeJson(
  "apps/web/data/arcanea-character-identities.v1.json",
  characterIdentityAtlas,
);
write(
  "docs/design/ARCANEA_CHARACTER_IDENTITY_READINESS_V1.md",
  characterReadinessMarkdown,
);
write(
  "docs/design/ARCANEA_VISUAL_COVERAGE_MATRIX_V1.md",
  coverageMatrixMarkdown,
);
const publicSchemaFiles = [
  "arcanea.machine_preflight_receipt.v2.schema.json",
  "arcanea.visual_prompt_contract.v1.schema.json",
  "arcanea.visual_execution_grant.v1.schema.json",
  "arcanea.visual_output_receipt.v1.schema.json",
];
for (const schemaFile of publicSchemaFiles) {
  write(
    `apps/web/public/downloads/arcanea-constellation/system/${schemaFile}`,
    readFileSync(join(ROOT, "schemas/arcanea-visual", schemaFile), "utf8"),
  );
}
write(
  "apps/web/public/downloads/arcanea-constellation/system/CONTRACTS.md",
  `# Arcanea visual contract suite

Public-safe machine contracts for implementing Arcanea's evidence-to-image protocol. These schemas describe structure; they do not grant authority, certify a human identity, or turn a generated image into canon.

## Contract chain

1. **Visual prompt contract** — engine-neutral identity evidence, observable story action, explicit one-asset geometry, intended surface, delivery role, crop safety, composition, design laws, visible constraints, exclusions, reference policy, verification floors, and governance boundary.
2. **Machine preflight receipt** — one short-lived overnight PP plan plus a hash-bound, privacy-minimized storage snapshot. Performance and storage are independent gates; either can hold media execution.
3. **Execution grant** — one current immutable manifest, explicit human spend and rights attestations, exact job ids, model policy, runtime parameters, call cap, fresh machine-preflight hash, and stop time.
4. **Output receipt** — one fully decoded internal image bound to the exact prompt, manifest, grant, preflight, provider response, references, declared and measured aspect ratio within the fixed 1.5% provider-rounding tolerance, dimensions, and byte hash; the stored copy is decoded again and must exactly match the ingest source before the receipt is written.
5. **Evaluation and release records** — deliberately separate. An output receipt proves generation lineage, not quality, identity approval, or publication.

## Schemas

- [arcanea.machine_preflight_receipt.v2.schema.json](./arcanea.machine_preflight_receipt.v2.schema.json)
- [arcanea.visual_prompt_contract.v1.schema.json](./arcanea.visual_prompt_contract.v1.schema.json)
- [arcanea.visual_execution_grant.v1.schema.json](./arcanea.visual_execution_grant.v1.schema.json)
- [arcanea.visual_output_receipt.v1.schema.json](./arcanea.visual_output_receipt.v1.schema.json)

## Implementation rule

Keep the provider's image-facing prompt smaller than the full contract. Send only subject, action and consequence, authoritative output geometry, intended surface, crop safety, composition, visual system, light, variation boundary, visible checks, and visual exclusions to the image model. Keep delivery governance, canon state, approval, release, human authority, and specialist-review instructions beside the prompt as machine governance.

Validate structure first, then hashes, current-manifest status, time bounds, rights, references, deterministic media checks, blind evaluation, and human release decisions. Repository hashes preserve integrity and supersession lineage; they are not bearer credentials or proof that the named human personally signed a record.
`,
);
write(
  "apps/web/public/downloads/arcanea-constellation/README.md",
  `# Arcanea Living Constellation\n\nPublic-safe, versioned agent blueprints generated from the Arcanea Living Constellation source. These files teach purpose, routes, outputs, stop conditions, verification, and human-held authority. They are not autonomous credentials and do not grant canon, spend, identity, or publication authority.\n\n- Version: ${VERSION}\n- Agents: ${agents.length}\n- Visual campaign jobs: ${sequence}\n- New campaign outputs recorded: ${generatedCount}\n- Approved outputs: ${approvedCount}\n- Identity-qualified reference sets: ${qualifiedReferenceSets.length}\n- Public face of the governed Visual Director: Prismatic\n\n## Choose the right artifact\n\n- Read **AGENT.md** to understand an identity's mandate, perspective, inputs, outputs, routes, visual proposal, stop conditions, human gates, and verification questions.\n- Read **SKILL.md** when an agent or operator needs a bounded execution loop with explicit input, output, verification, and handoff contracts.\n- Read **agent-card.json** when software needs the same public-safe identity as structured data.\n- Read the [Prompt Atlas](./prompts/PROMPT_ATLAS.md) to inspect all 100 engine-neutral visual contracts without confusing them with execution authority or approved images.\n\n## Human use\n\n1. Start with the decision you need to make, not the agent name.\n2. Choose the smallest route whose outputs match that decision.\n3. Supply source evidence, truth state, constraints, audience, and release state.\n4. Inspect stop conditions and human gates before execution.\n5. Accept, revise, reject, or supersede the artifact; never delegate the held authority.\n\n## Agent use\n\n1. Parse inputs and stop conditions before selecting a route.\n2. Separate fact, inference, proposal, and invention.\n3. Produce the smallest inspectable artifact, then run the verification contract.\n4. Return evidence, confidence, dissent, unresolved risk, and the next bounded human decision.\n5. Treat every visual identity as a proposal until its approval and reference lineage are explicit.\n\n## Visual proof boundary\n\nA generated image is not an approved image. One approved image is one bounded view, not an identity master. A 5/5 identity-continuity claim requires eight distinct approved regression views, human identity-lock evidence, and an explicit smallest-sufficient assignment to the future job.\n\n## Blueprint index\n\n| Identity | Domain | Purpose | Files |\n|---|---|---|---|\n${agents.map((agent) => `| ${agent.name} | ${agent.domain} | ${agent.oneLiner} | [AGENT.md](./${agent.id}/AGENT.md) · [SKILL.md](./${agent.id}/SKILL.md) · [agent-card.json](./${agent.id}/agent-card.json) |`).join("\n")}\n\nEvery pack states its stop conditions and human gates. The sixteen names are existing public product identities; these operating dossiers and visual forms remain proposals until approved.\n`,
);

console.log(
  `Built Arcanea Living Constellation v${VERSION}: ${agents.length} agent packs and ${sequence} visual jobs.`,
);
