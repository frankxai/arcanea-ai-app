import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  SHOP_EDITIONS,
  editionReleased,
  editionDescription,
  editionPageCopy,
  isArtEdition,
  productStructuredData,
} from "../catalog";
import {
  approvedCheckoutUrl,
  checkoutUrlForEdition,
  prepareCheckout,
  handleCheckoutRequest,
} from "../checkout";

test("preview offers cannot be activated by environment configuration", () => {
  for (const edition of SHOP_EDITIONS) {
    const env = { [edition.checkoutEnv]: "https://buy.polar.sh/approved-link" };
    assert.equal(editionReleased(edition), false);
    assert.equal(checkoutUrlForEdition(edition, env), null);
    assert.equal(prepareCheckout({ slug: edition.slug }, env).status, 503);
    assert.equal("offers" in productStructuredData(edition), false);
    assert.match(editionDescription(edition), /^Proposed edition: /);
    assert.equal(
      productStructuredData(edition).description,
      editionDescription(edition),
    );
  }
});

test("checkout rejects caller-controlled pricing, product IDs and redirects", () => {
  for (const input of [
    null,
    [],
    "worldbuilder",
    {},
    { slug: 12 },
    { slug: "worldbuilder-production-edition", amount: 1 },
    { slug: "worldbuilder-production-edition", currency: "USD" },
    { slug: "worldbuilder-production-edition", productId: "forged" },
    {
      slug: "worldbuilder-production-edition",
      successUrl: "https://evil.example",
    },
  ]) {
    assert.equal(prepareCheckout(input, {}).status, 400);
  }
  assert.equal(prepareCheckout({ slug: "unknown" }, {}).status, 404);
});

test("hosted checkout URLs have an exact HTTPS origin and no override parameters", () => {
  for (const value of [
    undefined,
    "",
    "https://evil.example/checkout",
    "http://buy.polar.sh/x",
    "https://buy.polar.sh.evil.example/x",
    "https://user:pass@buy.polar.sh/x",
    "https://buy.polar.sh:8443/x",
    "https://buy.polar.sh/x?price=1",
    "https://buy.polar.sh/x#redirect",
    "javascript:alert(1)",
    "https://buy.polar.sh/",
  ]) {
    assert.equal(approvedCheckoutUrl(value), null);
  }
  assert.equal(
    approvedCheckoutUrl("https://buy.polar.sh/c/approved-link"),
    "https://buy.polar.sh/c/approved-link",
  );
});

test("a complete release needs every approval and verified fulfillment", () => {
  const approved = {
    ...SHOP_EDITIONS[0],
    priceState: "approved" as const,
    release: {
      state: "released" as const,
      merchantApproved: true,
      priceApproved: true,
      rightsApproved: true,
      termsApproved: true,
      fulfillmentVerified: true,
      approvedCheckoutPath: "/c/verified",
    },
  };
  assert.equal(editionReleased(approved), true);
  assert.equal(editionDescription(approved), approved.description);
  assert.equal(
    checkoutUrlForEdition(approved, {
      [approved.checkoutEnv]: "https://buy.polar.sh/c/verified",
    }),
    "https://buy.polar.sh/c/verified",
  );
  assert.equal(
    checkoutUrlForEdition(approved, {
      [approved.checkoutEnv]: "https://buy.polar.sh/c/another-edition",
    }),
    null,
  );
  for (const path of [
    null,
    "",
    "/",
    "/c/../different",
    "https://evil.example/c",
  ]) {
    const unpinned = {
      ...approved,
      release: { ...approved.release, approvedCheckoutPath: path },
    };
    assert.equal(editionReleased(unpinned), false);
    assert.equal(
      checkoutUrlForEdition(unpinned, {
        [approved.checkoutEnv]: "https://buy.polar.sh/c/verified",
      }),
      null,
    );
  }
  for (const key of [
    "merchantApproved",
    "priceApproved",
    "rightsApproved",
    "termsApproved",
    "fulfillmentVerified",
  ] as const) {
    assert.equal(
      editionReleased({
        ...approved,
        release: { ...approved.release, [key]: false },
      }),
      false,
    );
  }
});

test("HTTP checkout enforces origin, byte limits and non-cacheable unavailability", async () => {
  const endpoint = "https://www.arcanea.ai/api/shop/checkout";
  const response = await handleCheckoutRequest(
    new Request(endpoint, {
      method: "POST",
      body: JSON.stringify({ slug: SHOP_EDITIONS[0].slug }),
    }),
    {},
  );
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal((await response.json()).code, "edition_unavailable");
  assert.equal(
    (
      await handleCheckoutRequest(
        new Request(endpoint, {
          method: "POST",
          headers: { origin: "https://evil.example" },
          body: "{}",
        }),
        {},
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleCheckoutRequest(
        new Request(endpoint, {
          method: "POST",
          body: "not JSON",
        }),
        {},
      )
    ).status,
    400,
  );
  // Multibyte data with no Content-Length is limited by bytes, not string length.
  assert.equal(
    (
      await handleCheckoutRequest(
        new Request(endpoint, {
          method: "POST",
          body: "€".repeat(700),
        }),
        {},
      )
    ).status,
    413,
  );
});

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

// Claims the Estate Editor failed on the live shop (#542): the art masters are
// not accepted yet, and the linked gallery is not a sample of the paid files.
const forbiddenClaims = [
  /\baccepted\b/i,
  /selected and reviewed/i,
  /explore the sample/i,
  /linked sample is free/i,
];
const kitCopy = [
  /existing writing and production/i,
  /governs the kit/i,
  /sample does not establish/i,
];

function renderedText(edition: (typeof SHOP_EDITIONS)[number]): string {
  const copy = editionPageCopy(edition);
  return [
    edition.description,
    editionDescription(edition),
    JSON.stringify(productStructuredData(edition)),
    ...edition.includes,
    `Explore the ${copy.previewNoun}`,
    copy.previewDelivery,
    copy.previewScope,
    copy.tools ?? "",
    copy.rights ?? "",
  ].join("\n");
}

test("art editions carry no acceptance, review or sample claims", () => {
  const artEditions = SHOP_EDITIONS.filter(isArtEdition);
  assert.ok(artEditions.length > 0);
  for (const edition of artEditions) {
    const text = renderedText(edition);
    for (const claim of [...forbiddenClaims, ...kitCopy]) {
      assert.doesNotMatch(text, claim, `${edition.slug}: ${claim}`);
    }
    const copy = editionPageCopy(edition);
    assert.equal(copy.previewNoun, "gallery");
    assert.equal(copy.tools, null);
    assert.equal(copy.rights, null);
  }
});

test("no edition description, metadata or JSON-LD claims accepted artworks", () => {
  for (const edition of SHOP_EDITIONS) {
    for (const value of [
      edition.description,
      editionDescription(edition),
      JSON.stringify(productStructuredData(edition)),
      ...edition.includes,
    ]) {
      assert.doesNotMatch(value, /accepted artworks/i);
      assert.doesNotMatch(value, /selected and reviewed/i);
    }
  }
});

test("creator kits keep their kit copy and sample link", () => {
  for (const edition of SHOP_EDITIONS.filter((e) => !isArtEdition(e))) {
    const copy = editionPageCopy(edition);
    assert.equal(copy.previewNoun, "sample");
    assert.match(copy.tools ?? "", /existing writing and production tools/);
    assert.match(copy.rights ?? "", /governs the kit and its examples/);
  }
});

test("edition page and action render type-dependent copy only via the catalog", () => {
  for (const file of [
    "app/shop/[slug]/page.tsx",
    "components/shop/checkout-action.tsx",
  ]) {
    const source = readFileSync(join(webRoot, file), "utf8");
    for (const claim of [...forbiddenClaims, ...kitCopy]) {
      assert.doesNotMatch(source, claim, `${file}: ${claim}`);
    }
  }
});
