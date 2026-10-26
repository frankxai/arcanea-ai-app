import { test, describe } from "node:test";
import assert from "node:assert/strict";
import sitemap from "../../app/sitemap";

describe("sitemap", () => {
  test("excludes protected routes", async () => {
    const urls = await sitemap();

    // Test that the protected /studio route is NOT in the sitemap
    const hasStudio = urls.some(entry => entry.url.endsWith("/studio"));
    assert.strictEqual(hasStudio, false, "The /studio route should not be in the sitemap");

    // General sanity check - make sure we actually generated a sitemap
    assert.ok(urls.length > 50, "Sitemap should have many entries");

    // Make sure a known public route is included
    const hasChat = urls.some(entry => entry.url.endsWith("/chat"));
    assert.strictEqual(hasChat, true, "The /chat route should be in the sitemap");
  });
});