import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  analyzeEcosystem,
  buildEcologyVisualPrompt,
  validateEcologyEntry,
} from "../dist/ecology/index.js";

function choirheartRose() {
  return {
    schemaVersion: "1.0.0",
    id: "ECO-CHOIRHEART-ROSE",
    slug: "choirheart-rose",
    name: "Choirheart Rose",
    kind: "flora",
    origin: {
      worldId: "arcanea",
      worldName: "Arcanea",
      realmId: "veldoria",
      realmName: "Veldoria",
      biome: "Vael-rain valley repair garden",
    },
    gate: "Heart",
    elementAffinity: ["Earth", "Water"],
    taxonomy: {
      morphology: "A perennial colony presenting one vast rose-like reproductive crown above a buried ring of storage trunks.",
      bodySubstrate: "Cellulose-fibre petal ribs, rose-copper vascular seams, mineralized root buttresses, and living jade epidermis.",
      silhouetteThesis: "A cathedral-sized cupped crown held above the valley by five asymmetric load-bearing sepals.",
      scaleClass: "colossal",
      dimensions: { heightM: 28, spanM: 34, massKg: 190000 },
      structuralAdaptations: [
        "Branching petal ribs redirect wind loads into five mineralized sepals.",
        "A buried ring-trunk distributes water and weight across the valley floor.",
        "Porous bracts vent pressure rather than tearing during storms.",
      ],
      sensesOrTropisms: [
        "Petiole pressure cells turn unopened bracts away from destructive crosswinds.",
        "Root tips follow sustained harmonic vibration from healthy Ledgerroot colonies.",
      ],
    },
    lifeCycle: {
      origin: "A seed germinates only after digestion by a Bractling and burial in active Ledgerroot filaments.",
      reproduction: "The mature crown warms for three nights, drawing Serein Moths that carry heavy paired pollen masses.",
      dispersal: "Bractlings transport fallen seed vessels and scarify their mineral coats during digestion.",
      growth: "A juvenile spends a decade underground building its storage ring before raising its first crown.",
      maturity: "One reproductive crown opens after the storage ring passes its sugar and mineral threshold.",
      senescence: "The crown lowers and drains mobile nutrients into daughter buds while its ribs become pale and brittle.",
      deathAndReturn: "Ledgerroot decomposes the ring-trunk and routes stored minerals toward unrelated seedlings, preventing clonal monopoly.",
      typicalLifespan: "Eighty to one hundred and forty years",
    },
    energy: {
      primarySource: "Photosynthate produced across translucent upper bracts.",
      secondarySource: "Phosphate and trace Vael minerals exchanged through Ledgerroot filaments.",
      intake: "Sunward bracts track diffuse light while root exchange gates open only to contributing fungal strands.",
      storage: "Starch-rich ring trunks and hydrated pith chambers accumulate a decade of bloom reserves.",
      expenditure: "Thermogenesis, scent production, vein-light signaling, and the rapid hydraulic opening of the crown.",
      recovery: "Post-bloom daughter buds remain closed while the root ring restores starch and repairs embolized vessels.",
      failureMode: "A premature second bloom empties the pith chambers, collapses vein pressure, and sterilizes the crown.",
    },
    radiance: {
      mechanism: "vael-resonance",
      carrier: "Trace Vael crystals held inside rose-copper vascular seams.",
      trigger: "Pressure changes from pollen impact, vascular injury, or depletion of stored bloom sugars.",
      appearance: "Warm ivory pulses move from the stigma toward the five sepals; injured paths fade to bruised blue.",
      information: "Pulse direction reports successful pollination, while blue discontinuities expose tissue injury and energy debt.",
      cost: "Each pulse consumes sugar and releases stored mineral charge that takes several hours to replace.",
      failureMode: "Repeated forced signaling desynchronizes the seams and makes viable tissue appear wounded to its pollinators.",
    },
    ecology: {
      niche: "Long-cycle producer and reproductive-season regulator in Vael-rain valleys.",
      trophicRole: "primary-producer",
      habitatFunction: "Its buried ring stabilizes wet slopes; its crown creates a warm nocturnal air column used by pollinators and gliders.",
      keystone: true,
      populationControls: [
        "Ledgerroot withholds phosphate from crowns that fail to return sufficient photosynthate.",
        "Bractlings destroy surplus seedlings while digesting only a small viable fraction.",
      ],
      relationships: [
        {
          targetId: "ECO-LEDGERROOT",
          targetName: "Ledgerroot",
          type: "mutualism",
          direction: "bidirectional",
          effect: "conditional",
          description: "The fungus exchanges phosphorus and Vael traces for sugars, reducing supply when the rose overdraws the network.",
          ifBroken: "The crown cannot reach thermal bloom threshold and the fungal network loses its largest dry-season carbon source.",
          evidence: "design-proposal",
        },
        {
          targetId: "ECO-SEREIN-MOTH",
          targetName: "Serein Moth",
          type: "pollination",
          direction: "bidirectional",
          effect: "beneficial",
          description: "Warm air lifts adult moths between crowns; larvae later repair small petal-rib wounds while feeding on scar tissue.",
          ifBroken: "Pollen remains trapped inside one valley and unrepaired ribs split during the following storm season.",
          evidence: "design-proposal",
        },
        {
          targetId: "ECO-BRACTLING",
          targetName: "Bractling",
          type: "dispersal",
          direction: "bidirectional",
          effect: "conditional",
          description: "Bractlings eat fallen vessels, scarify the seeds, and deposit them beyond the parent root ring.",
          ifBroken: "Seed coats remain sealed; if overabundant, Bractlings instead consume more seedlings than they establish.",
          evidence: "design-proposal",
        },
      ],
      removalConsequence: {
        firstOrder: "Serein Moth breeding collapses and wet valley slopes lose the anchoring pressure of the ring roots.",
        secondOrder: "Ledgerroot carbon income falls, reducing phosphorus exchange across the wider repair garden.",
        cultural: "The valley loses its three-night bloom calendar and the public signal used to ration post-rain harvesting.",
      },
    },
    covenant: {
      gift: "A mature bloom warms the valley, anchors its slopes, and makes successful pollination publicly visible.",
      cost: "The crown consumes a decade of stored energy and cannot safely bloom again until the ring-trunk recovers.",
      balance: "Stewards protect fallen bracts and moth nurseries in exchange for collecting only naturally shed fibres after senescence.",
      stewards: ["Veldorian repair gardeners"],
      taboo: "Cutting a live petal rib or inducing a second bloom for spectacle.",
      breachConsequence: "The vascular pulse fractures, moths read the crown as injured, and the valley loses a reproductive season.",
    },
    narrative: {
      signatureBehavior: "At the first viable pollen strike, one ivory pulse crosses the entire crown and descends into every connected root garden.",
      sensorySignature: "Root palette: warm rain on mineral bark, low pressure-hums underfoot, bruised rose scent, and a brief rise in night air.",
      encounter: "Travellers arrive beneath the closed crown as its repair gardeners debate whether storm damage justifies cancelling the bloom.",
      choicePressure: "Saving the current festival requires a forced bloom that would sterilize the plant and starve its network for years.",
      storyUses: [
        "A public ecological clock whose failure exposes concealed damage upstream.",
        "A negotiation in which beauty, food security, and honest signaling cannot all be preserved.",
      ],
    },
    visual: {
      spark: "A cathedral-sized rose reveals both pollination and injury as pulses travelling through load-bearing petal veins.",
      shapePalettes: ["Root", "Tide"],
      sharpen: [
        "an ordinary rose simply enlarged",
        "decorative neon edging",
        "random crystals pasted onto petals",
        "perfect radial symmetry",
      ],
      visualDNA: "Five asymmetric structural sepals, vaulted ribbed bracts, a deep hollow crown, and public vein-light that behaves like a biological instrument.",
      silhouetteTest: "At thumbnail scale, five buttress sepals hold one tilted cupped crown above a low ring-root horizon.",
      materialLanguage: [
        "translucent ivory bracts with fibrous load ribs",
        "living jade epidermis",
        "restrained rose-copper vascular seams",
      ],
      lightBehavior: "Rain-soft cosmic dusk with ivory signals inside the veins and no ambient neon aura.",
      scaleEvidence: "Gardeners and Serein Moths occupy different depth planes beneath a twenty-eight-metre crown; mist layers cross behind its ribs.",
      camera: "Low three-quarter field view from inside the repair garden, 28mm-equivalent lens, full crown and root buttress in frame.",
      renderIntent: "Premium cinematic 3D natural-history image with tactile botanical surfaces, restrained luxury, and feature-film atmospheric depth.",
    },
    provenance: {
      sources: [
        {
          id: "SRC-VAEL-RAIN",
          type: "staging-lore",
          reference: ".arcanea/lore/CANON_LOCKED.md",
          note: "Vael Rain can mutate flora into singing forests; the source does not define this species or its detailed mechanism.",
        },
        {
          id: "SRC-FORGE-RUN",
          type: "generated",
          reference: "arcanea-ecology-forge:choirheart-rose:v1",
          note: "Records the proposal-generation operation, not evidence for canon.",
        },
      ],
      sourceClaims: [
        {
          id: "CLAIM-VAEL-FLORA",
          claim: "Vael Rain can alter Arcanean flora and is associated with singing forests.",
          sourceIds: ["SRC-VAEL-RAIN"],
          fieldPaths: ["/canon/anchors/0"],
        },
      ],
      proposalMechanics: [
        {
          id: "MECH-ROSE-VASCULAR-LIGHT",
          mechanic: "The rose uses Vael-bearing vascular seams to signal pollination, injury, and energy debt.",
          rationale: "Converts the broad canon anchor into a visible, costly ecological signal without claiming the source specifies it.",
          fieldPaths: ["/radiance", "/visual/lightBehavior"],
          supportedByClaimIds: ["CLAIM-VAEL-FLORA"],
          state: "proposal",
        },
        {
          id: "MECH-ROSE-COVENANT",
          mechanic: "A forced second bloom sterilizes the crown and breaks its pollinator and fungal exchanges.",
          rationale: "Gives colossal beauty a material cost and creates a decision with ecosystem consequences.",
          fieldPaths: ["/energy/failureMode", "/covenant/breachConsequence"],
          supportedByClaimIds: [],
          state: "proposal",
        },
      ],
      originalityNotes: [
        "The central identity is public energy-accounting through structural veins, not a giant flower plus arbitrary glow.",
        "The bloom functions as a negotiated ecological event whose exploitation damages an explicit network.",
      ],
    },
    canon: {
      state: "proposal",
      anchors: ["Vael Rain alters flora into singing forests"],
      note: "Only the general Vael Rain effect is sourced; the organism, anatomy, relationships, and covenant are proposals.",
    },
    review: { state: "draft", score: null, notes: [] },
    media: [],
  };
}

describe("Arcanea EcologyEntry", () => {
  it("accepts a complete proposal in publish mode", () => {
    const result = validateEcologyEntry(choirheartRose(), "publish");
    assert.equal(result.valid, true, JSON.stringify(result.errors, null, 2));
  });

  it("accepts a fully original proposal with no inherited source claims", () => {
    const entry = choirheartRose();
    entry.id = "ECO-FIRSTSEED-SHINKAMI";
    entry.slug = "firstseed-of-shinkami";
    entry.name = "Firstseed of Shinkami";
    entry.provenance.sources = [
      {
        id: "SRC-FIRSTSEED-FORGE-RUN",
        type: "generated",
        reference: "arcanea-ecology-forge:firstseed-of-shinkami:v1",
        note: "Records the original proposal-generation operation and does not substantiate canon.",
      },
    ];
    entry.provenance.sourceClaims = [];
    entry.provenance.proposalMechanics = entry.provenance.proposalMechanics.map((mechanic) => ({
      ...mechanic,
      supportedByClaimIds: [],
    }));
    entry.canon.anchors = ["Original Creator brief for a Source Gate botanical proposal"];
    entry.canon.note = "The organism and every mechanism are original proposals with no inherited botanical claims.";

    const result = validateEcologyEntry(entry, "publish");
    assert.equal(result.valid, true, JSON.stringify(result.errors, null, 2));
  });

  it("does not allow staging entries without source claims", () => {
    const entry = choirheartRose();
    entry.provenance.sourceClaims = [];
    entry.canon = {
      state: "staging",
      anchors: entry.canon.anchors,
      note: entry.canon.note,
    };
    entry.provenance.proposalMechanics = [];

    const result = validateEcologyEntry(entry, "publish");
    assert.ok(result.errors.some((issue) => issue.code === "source_claims"));
  });

  it("rejects generated material as evidence for a source claim", () => {
    const entry = choirheartRose();
    entry.provenance.sourceClaims[0].sourceIds = ["SRC-FORGE-RUN"];
    const result = validateEcologyEntry(entry, "publish");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((issue) => issue.code === "generated_claim_source"));
  });

  it("rejects unknown provenance vocabularies", () => {
    const entry = choirheartRose();
    entry.provenance.sources[0].type = "memory-from-the-model";
    const result = validateEcologyEntry(entry, "publish");
    assert.ok(result.errors.some((issue) => issue.code === "source_type"));
  });

  it("requires credible load paths for gigantic organisms", () => {
    const entry = choirheartRose();
    entry.taxonomy.structuralAdaptations = ["The petals are strong."];
    const result = validateEcologyEntry(entry, "publish");
    assert.ok(result.errors.some((issue) => issue.code === "giant_structure"));
  });

  it("keeps lock authority explicit", () => {
    const entry = choirheartRose();
    entry.canon = {
      state: "locked",
      anchors: entry.canon.anchors,
      note: entry.canon.note,
      approvedBy: "generator",
      approvedAt: new Date().toISOString(),
    };
    const result = validateEcologyEntry(entry, "publish");
    assert.ok(result.errors.some((issue) => issue.code === "lock_authority"));
    assert.ok(result.errors.some((issue) => issue.code === "proposal_mechanics_not_promoted"));
    assert.ok(result.errors.some((issue) => issue.code === "lock_receipt"));
  });

  it("compiles APL without promoting canon", () => {
    const entry = choirheartRose();
    const result = buildEcologyVisualPrompt(entry, { shot: "relationship", aspectRatio: "16:9" });
    assert.match(result.prompt, /^\[WORLD\]/);
    assert.match(result.prompt, /\nSPARK:/);
    assert.match(result.prompt, /\nSHAPE:/);
    assert.match(result.prompt, /\nSHARPEN:/);
    assert.match(result.prompt, /CANON STATE: proposal/);
    assert.match(result.prompt, /Heart Gate · Maylinn · Laeylinn/);
    assert.equal(result.canonState, "proposal");
  });

  it("supports the 4:3 Wave 01 master-image ratio", () => {
    const result = buildEcologyVisualPrompt(choirheartRose(), {
      shot: "habitat-hero",
      aspectRatio: "4:3",
    });
    assert.equal(result.aspectRatio, "4:3");
    assert.match(result.prompt, /Output: 4:3, single coherent frame/);
  });

  it("reports missing matter-return and population-control functions", () => {
    const report = analyzeEcosystem([choirheartRose()]);
    assert.ok(report.missingFunctions.includes("matter-return path"));
    assert.ok(report.missingFunctions.includes("population control"));
  });
});
