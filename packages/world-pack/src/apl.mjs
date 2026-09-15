// Arcanean Prompt Language, v0.1.
//
// A typed template compiler. Input: a template, a slot binding, a world pack and
// a canon index. Output: a prompt string with the canon constraints embedded and
// an output contract the caller can validate a model's answer against.
//
// The compiler makes no model call and reads no network. It is the deterministic
// half of generation — the half you can test.

import { contentHash } from "./pack.mjs";

export const APL_VERSION = "0.1";

/** Slot types the compiler knows how to bind and constrain against canon. */
export const SLOT_TYPES = Object.freeze([
  "text",
  "gate",
  "element",
  "house",
  "originClass",
  "wisdom",
  "rank",
  "integer",
  "enum",
  "nodeRef",
]);

/**
 * @typedef {object} AplTemplate
 * @property {string} id
 * @property {string} version
 * @property {string} intent
 * @property {string} produces entity node type the model must return
 * @property {Array<{name:string,type:string,required?:boolean,values?:string[],max?:number}>} slots
 * @property {string[]} forbid extra prohibitions, in prose
 */

/** @type {Record<string, AplTemplate>} */
export const TEMPLATES = Object.freeze({
  "character.constrained.v1": {
    id: "character.constrained.v1",
    version: APL_VERSION,
    intent:
      "Draft one character who is legal inside Arcanean canon and inside this world.",
    produces: "Character",
    slots: [
      { name: "role", type: "text", required: true, max: 120 },
      { name: "gate", type: "gate", required: true },
      { name: "gatesOpen", type: "integer", required: true },
      { name: "element", type: "element", required: true },
      { name: "house", type: "house", required: false },
      { name: "originClass", type: "originClass", required: false },
      { name: "setting", type: "nodeRef", required: false },
    ],
    forbid: [
      "Do not name the character after any locked canon entity.",
      "Do not invent a new origin class; the eight are closed.",
      "Do not assert a Gate frequency other than the one given.",
    ],
  },
  "location.constrained.v1": {
    id: "location.constrained.v1",
    version: APL_VERSION,
    intent:
      "Draft one location that sits inside this world without contradicting canon geography.",
    produces: "Location",
    slots: [
      { name: "kind", type: "text", required: true, max: 80 },
      { name: "element", type: "element", required: true },
      { name: "gate", type: "gate", required: false },
      { name: "era", type: "nodeRef", required: false },
    ],
    forbid: [
      "Do not place this location inside a named Realm of the Kingdom of Light unless the world pack already contains it.",
      "Do not describe corridors as fixed; corridors drift.",
    ],
  },
});

export class AplError extends Error {}

function checkSlot(slot, value, canon, pack) {
  const fail = (msg) => {
    throw new AplError(`slot '${slot.name}': ${msg}`);
  };
  if (value == null || value === "") {
    if (slot.required) fail("is required");
    return null;
  }
  switch (slot.type) {
    case "gate": {
      const n = Number(value);
      const gate = canon.gates.find((g) => g.index === n);
      if (!gate) fail(`gate ${value} is not one of the ten`);
      return gate;
    }
    case "element":
      if (!canon.elements.includes(value))
        fail(
          `'${value}' is not a canonical element (${canon.elements.join(", ")})`,
        );
      return value;
    case "house": {
      const h = String(value).replace(/^House\s+/i, "");
      if (!canon.houses.includes(h))
        fail(`'${value}' is not one of the seven Academy Houses`);
      return `House ${h}`;
    }
    case "originClass": {
      const hit = canon.originClasses.find(
        (o) => o.name.toLowerCase() === String(value).toLowerCase(),
      );
      if (!hit)
        fail(
          `'${value}' is not a catalogued origin class; the eight are closed`,
        );
      return hit;
    }
    case "wisdom":
      if (!canon.wisdoms.some((w) => w.name === value))
        fail(`'${value}' is not one of the Seven Wisdoms`);
      return value;
    case "rank":
      if (!canon.ranks.some((r) => r.rank === value))
        fail(`'${value}' is not a magic rank`);
      return value;
    case "integer": {
      const n = Number(value);
      if (!Number.isInteger(n)) fail("must be an integer");
      return n;
    }
    case "nodeRef": {
      const node = pack.nodes.find((n) => n.id === value || n.name === value);
      if (!node) fail(`'${value}' is not a node in this world pack`);
      return node;
    }
    case "enum":
      if (!slot.values.includes(value))
        fail(`must be one of ${slot.values.join(", ")}`);
      return value;
    default: {
      const s = String(value);
      if (slot.max && s.length > slot.max)
        fail(`is longer than ${slot.max} characters`);
      return s;
    }
  }
}

/**
 * Compile a template into a prompt. No model call.
 * @returns {{prompt:string, contract:object, constraints:string[], bindings:object, hash:string, templateId:string}}
 */
export function compile(templateId, bindings, { canon, pack }) {
  const template = TEMPLATES[templateId];
  if (!template) throw new AplError(`unknown template: ${templateId}`);
  if (!canon)
    throw new AplError(
      "a canon index is required; APL never compiles unconstrained",
    );

  const bound = {};
  for (const slot of template.slots)
    bound[slot.name] = checkSlot(slot, bindings[slot.name], canon, pack);

  const constraints = [];
  const gate = bound.gate;
  if (gate) {
    constraints.push(
      `Gate ${gate.index} is ${gate.name}, ${gate.frequencyHz} Hz, kept by ${gate.god}, bonded Godbeast ${gate.godbeast}. These four facts are locked and may not be restated differently.`,
    );
  }
  if (bound.gatesOpen != null) {
    const rank = canon.ranks.find(
      (r) => bound.gatesOpen >= r.minGates && bound.gatesOpen <= r.maxGates,
    );
    if (rank)
      constraints.push(
        `With ${bound.gatesOpen} gates open the rank is exactly ${rank.rank}. Luminor is a rank, never a species.`,
      );
  }
  if (bound.element)
    constraints.push(
      `Element is ${bound.element}. The canonical elements are ${canon.elements.join(", ")} and no others.`,
    );
  if (bound.house)
    constraints.push(
      `${bound.house} is institutional, not geographic; members come from many Realms.`,
    );
  if (bound.originClass)
    constraints.push(
      `Origin class is ${bound.originClass.name} (power source: ${bound.originClass.powerSource}). The eight origin classes are closed.`,
    );
  constraints.push(
    "Nero is not evil. Shadow is corrupted Void, the Dark Lord's perversion of Nero's gift.",
  );
  constraints.push(
    `Do not use any of these locked canon names for a new entity: ${lockedNameSample(canon).join(", ")}.`,
  );

  const contract = {
    format: "AplOutputContract.v1",
    produces: template.produces,
    required: ["name", "description", "attributes"],
    attributes: attributeContract(template, bound),
    rules: [
      "Return one JSON object and nothing else.",
      `"type" must be "${template.produces}".`,
      "The caller stamps layer, governance and rights; do not invent them.",
    ],
  };

  const world = pack?.world;
  const prompt = [
    `# Arcanean Prompt Language v${APL_VERSION} — ${template.id}`,
    "",
    "## Intent",
    template.intent,
    "",
    "## World",
    world
      ? `${world.name} (${world.id}), a creator-owned world inside the Arcanea universe.`
      : "No world bound.",
    pack?.canon?.sourceHash
      ? `Canon binding: ${pack.canon.document} @ ${pack.canon.sourceHash}`
      : "Canon binding: unbound.",
    "",
    "## Request",
    ...template.slots
      .filter((s) => bound[s.name] != null)
      .map((s) => `- ${s.name}: ${renderBinding(bound[s.name])}`),
    "",
    "## Canon constraints (hard)",
    ...constraints.map((c) => `- ${c}`),
    "",
    "## Forbidden",
    ...template.forbid.map((f) => `- ${f}`),
    "",
    "## Output contract",
    JSON.stringify(contract, null, 2),
  ].join("\n");

  return {
    templateId: template.id,
    prompt,
    contract,
    constraints,
    bindings: bound,
    hash: contentHash({
      templateId: template.id,
      bindings: bound,
      constraints,
      canonSourceHash: canon.sourceHash,
    }),
  };
}

function renderBinding(value) {
  if (value && typeof value === "object")
    return value.name ?? value.id ?? JSON.stringify(value);
  return String(value);
}

function attributeContract(template, bound) {
  const out = {};
  if (bound.gate) {
    out.gate = bound.gate.index;
    out.frequencyHz = bound.gate.frequencyHz;
    out.guardian = bound.gate.god;
    out.godbeast = bound.gate.godbeast;
  }
  if (bound.gatesOpen != null) out.gatesOpen = bound.gatesOpen;
  if (bound.element) out.element = bound.element;
  if (bound.house) out.house = bound.house;
  if (bound.originClass) out.originClass = bound.originClass.name;
  return out;
}

function lockedNameSample(canon, limit = 12) {
  return Object.values(canon.names)
    .filter((n) => n.status === "locked")
    .slice(0, limit)
    .map((n) => n.name);
}

/**
 * Turn a model's answer into a pack node, stamping the governance the model was
 * never allowed to assert. Attributes the contract fixed are overwritten, not trusted.
 */
export function materialize(
  compiled,
  answer,
  { id, layer = "generated", governance },
) {
  return {
    id,
    type: compiled.contract.produces,
    name: answer.name,
    description: answer.description,
    layer,
    attributes: {
      ...(answer.attributes || {}),
      ...compiled.contract.attributes,
    },
    provenance: {
      apl: compiled.templateId,
      aplVersion: APL_VERSION,
      promptHash: compiled.hash,
    },
    governance,
  };
}
