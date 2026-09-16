import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getSafeNextPath,
  getOAuthRecoveryPath,
} from "../../apps/web/lib/auth/redirect.ts";

test("return destinations remain relative to Arcanea after URL normalization", () => {
  for (const value of [
    null,
    "",
    "https://elsewhere.example",
    "//elsewhere.example",
    "/\\elsewhere.example",
    "/\t/elsewhere.example",
    "/a/..//elsewhere.example",
    "/%2felsewhere.example",
    "/%5celsewhere.example",
    "javascript:alert(1)",
  ]) {
    assert.equal(getSafeNextPath(value), "/", String(value));
  }
  assert.equal(
    getSafeNextPath("/settings/providers?tab=keys#open"),
    "/settings/providers?tab=keys#open",
  );
  assert.equal(getSafeNextPath("/worlds/../dashboard"), "/dashboard");
});

test("the observed root code return reaches the callback without rendering the homepage", () => {
  const recovered = getOAuthRecoveryPath(
    new URL("https://www.arcanea.ai/?code=test-code&utm_source=private"),
  );
  const target = new URL(recovered, "https://www.arcanea.ai");
  assert.equal(target.pathname, "/auth/callback");
  assert.equal(target.searchParams.get("code"), "test-code");
  assert.equal(target.searchParams.get("next"), "/dashboard");
  assert.equal(target.searchParams.has("utm_source"), false);
});

test("recovery retains safe destinations and rejects external ones", () => {
  for (const [next, expected] of [
    ["/settings/providers", "/settings/providers"],
    ["//elsewhere.example", "/"],
  ]) {
    const url = new URL("https://www.arcanea.ai/?code=test-code");
    url.searchParams.set("next", next);
    const target = new URL(getOAuthRecoveryPath(url), url.origin);
    assert.equal(target.origin, url.origin);
    assert.equal(target.searchParams.get("next"), expected);
  }
});

test("normal pages and the callback itself never enter a recovery loop", () => {
  for (const path of [
    "/",
    "/?code=",
    "/worlds?code=test-code",
    "/auth/callback?code=test-code",
  ]) {
    assert.equal(
      getOAuthRecoveryPath(new URL(path, "https://www.arcanea.ai")),
      null,
    );
  }
});
