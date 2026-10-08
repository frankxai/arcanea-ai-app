export type EditionRelease = {
  state: "preview" | "released";
  merchantApproved: boolean;
  priceApproved: boolean;
  rightsApproved: boolean;
  termsApproved: boolean;
  fulfillmentVerified: boolean;
  // Exact provider path reviewed against this edition, price and file benefit.
  approvedCheckoutPath: string | null;
};

export type ShopEdition = {
  slug: string;
  sku: string;
  title: string;
  subtitle: string;
  audience: "creators" | "collectors";
  format: string;
  priceEur: number;
  priceState: "proposed" | "approved";
  license: string;
  outcome: string;
  description: string;
  includes: readonly string[];
  excludes: readonly string[];
  previewHref: string;
  checkoutEnv: string;
  release: EditionRelease;
};

const previewRelease: EditionRelease = {
  state: "preview",
  merchantApproved: false,
  priceApproved: false,
  rightsApproved: false,
  termsApproved: false,
  fulfillmentVerified: false,
  approvedCheckoutPath: null,
};

export const SHOP_ORIGIN = "https://www.arcanea.ai";
export const SHOP_UPDATED = "2026-10-07";

// Offer authority stays in source. Environment configuration cannot approve an edition.
export const SHOP_EDITIONS: readonly ShopEdition[] = [
  {
    slug: "worldbuilder-production-edition",
    sku: "ARC-WORLD-001",
    title: "Worldbuilder",
    subtitle: "Production Edition",
    audience: "creators",
    format: "Editable production kit",
    priceEur: 99,
    priceState: "proposed",
    license: "Individual creator license",
    outcome:
      "Take an original world from scattered notes to a coherent story packet.",
    description:
      "A structured production edition for adult writers and visual worldbuilders. Follow one worked example, build your own world brief, and carry the result into the tools you already use.",
    includes: [
      "World bible, character, scene and continuity templates",
      "One complete original demonstration world and worked scene",
      "Visual direction and character consistency worksheets",
      "Production budget, revision and release checklists",
      "Editable Markdown and JSON files with a readable guide",
    ],
    excludes: [
      "Model/API credits",
      "Custom writing or individual critique",
      "Rights to official Arcanea characters",
      "Guaranteed publishing or commercial results",
    ],
    previewHref: "/shop/sample",
    checkoutEnv: "ARCANEA_SHOP_WORLDBUILDER_CHECKOUT_URL",
    release: { ...previewRelease },
  },
  {
    slug: "worldbuilder-studio-license",
    sku: "ARC-WORLD-STUDIO-001",
    title: "Worldbuilder",
    subtitle: "Studio License",
    audience: "creators",
    format: "Production kit · five named creators",
    priceEur: 299,
    priceState: "proposed",
    license: "Five named users in one studio",
    outcome:
      "Give a small team one shared method for world, story and visual continuity.",
    description:
      "The Production Edition with a five-person studio license, team review worksheets and a shared handoff format. Keep your team's own fiction and source material under your control.",
    includes: [
      "Everything in the Production Edition",
      "Use by five named people in one organization",
      "Shared continuity review and editor handoff templates",
      "Documented ownership and version handoff method",
    ],
    excludes: [
      "Resale or redistribution of the kit",
      "Public courses or sublicensing",
      "Hosted collaboration or generation credits",
      "Custom implementation",
    ],
    previewHref: "/shop/sample",
    checkoutEnv: "ARCANEA_SHOP_STUDIO_CHECKOUT_URL",
    release: { ...previewRelease },
  },
  {
    slug: "living-cosmos-first-edition",
    sku: "ARC-COSMOS-001",
    title: "Living Cosmos",
    subtitle: "First Edition",
    audience: "collectors",
    format: "Digital art collection",
    priceEur: 29,
    priceState: "proposed",
    license: "Personal display and reading",
    outcome:
      "Keep a small collection of imaginative worlds on your screen and in your library.",
    description:
      "A curated collection of six artworks, purpose-made desktop and mobile compositions, and an illustrated companion booklet. Existing gallery imagery previews the art direction; the edition's manifest defines the downloads.",
    includes: [
      "Six artworks as one collection",
      "Separate desktop and mobile compositions",
      "Illustrated companion booklet",
      "An exact file and resolution manifest",
    ],
    excludes: [
      "Commercial reproduction",
      "Prints or physical shipping",
      "Source prompts and production masters",
      "A native 4K claim without verified source files",
    ],
    previewHref: "/gallery/sovereign-depths",
    checkoutEnv: "ARCANEA_SHOP_COSMOS_CHECKOUT_URL",
    release: { ...previewRelease },
  },
  {
    slug: "first-collection-bundle",
    sku: "ARC-COLLECTION-001",
    title: "First Collection",
    subtitle: "Creator + Collector",
    audience: "creators",
    format: "Two editions · one collection",
    priceEur: 119,
    priceState: "proposed",
    license: "Each included edition keeps its own license",
    outcome:
      "Explore the finished art and the production method behind original worlds.",
    description:
      "The individual Worldbuilder Production Edition and Living Cosmos First Edition together. Available for sale only after both included editions and this bundle have passed their release checks.",
    includes: [
      "Worldbuilder Production Edition",
      "Living Cosmos First Edition",
      "A single versioned contents manifest",
      "The respective individual and personal-use licenses",
    ],
    excludes: [
      "The five-person Studio License",
      "Rights to resell artwork or kit files",
      "Subscriptions or generation credits",
    ],
    previewHref: "/shop/sample",
    checkoutEnv: "ARCANEA_SHOP_COLLECTION_CHECKOUT_URL",
    release: { ...previewRelease },
  },
];

export function findEdition(slug: string): ShopEdition | undefined {
  return SHOP_EDITIONS.find((edition) => edition.slug === slug);
}

export function editionReleased(edition: ShopEdition): boolean {
  const r = edition.release;
  if (edition.slug === "first-collection-bundle") {
    const components = [
      "worldbuilder-production-edition",
      "living-cosmos-first-edition",
    ];
    if (
      !components.every((slug) => {
        const component = findEdition(slug);
        return component && editionReleased(component);
      })
    )
      return false;
  }
  return (
    edition.priceState === "approved" &&
    r.state === "released" &&
    r.merchantApproved &&
    r.priceApproved &&
    r.rightsApproved &&
    r.termsApproved &&
    r.fulfillmentVerified &&
    /^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/?$/.test(
      r.approvedCheckoutPath || "",
    )
  );
}

// Collector editions are art collections, not production kits.
export function isArtEdition(edition: ShopEdition): boolean {
  return edition.audience === "collectors";
}

// Edition-page copy that depends on the edition type. Art editions link to a
// public gallery (not a sample of the paid files) and never show kit-only
// tool or license copy.
export function editionPageCopy(edition: ShopEdition) {
  const art = isArtEdition(edition);
  const released = editionReleased(edition);
  return {
    previewNoun: art ? ("gallery" as const) : ("sample" as const),
    previewDelivery: art
      ? "Paid files are not released."
      : "Paid files are not released. The linked sample is free.",
    previewScope: art
      ? "These are the intended contents of the proposed paid edition. A release must match an exact file manifest."
      : "These are the intended contents of the proposed paid edition. A release must match an exact file manifest. The sample does not establish paid-edition readiness.",
    tools: art
      ? null
      : "Use the materials with your existing writing and production tools.",
    rights: art
      ? null
      : `${released ? "The edition license" : "The proposed license"} governs the kit and its examples. Your original characters, setting and story remain yours. Software, sample artwork and official Arcanea IP have separate permissions.`,
  };
}

export function editionDescription(edition: ShopEdition): string {
  return editionReleased(edition)
    ? edition.description
    : `Proposed edition: ${edition.description}`;
}

export function productStructuredData(edition: ShopEdition) {
  // Preview pricing never becomes a search-engine Offer or fabricated availability.
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${edition.title} — ${edition.subtitle}`,
    description: editionDescription(edition),
    sku: edition.sku,
    brand: { "@type": "Brand", name: "Arcanea" },
    url: `${SHOP_ORIGIN}/shop/${edition.slug}`,
  };
}
