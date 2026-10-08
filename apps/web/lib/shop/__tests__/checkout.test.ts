import assert from "node:assert/strict";
import test from "node:test";
import {
  SHOP_EDITIONS,
  editionReleased,
  editionDescription,
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
