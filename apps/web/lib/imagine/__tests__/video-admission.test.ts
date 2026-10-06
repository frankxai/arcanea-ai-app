import assert from "node:assert/strict";
import { test } from "node:test";
import {
  admissionFromSpend,
  isHttpsImageUrl,
  trustedSpendOrigin,
} from "../video-admission";

test("the spend call only goes to an origin this deployment serves", () => {
  const prod = {
    NODE_ENV: "production",
    VERCEL_URL: "arcanea-ai-app-abc123.vercel.app",
    VERCEL_BRANCH_URL: "arcanea-ai-app-git-fix-team.vercel.app",
    VERCEL_PROJECT_PRODUCTION_URL: "www.arcanea.ai",
  };
  assert.equal(
    trustedSpendOrigin("https://www.arcanea.ai", prod),
    "https://www.arcanea.ai",
  );
  assert.equal(
    trustedSpendOrigin("https://arcanea.ai", prod),
    "https://arcanea.ai",
  );
  assert.equal(
    trustedSpendOrigin("https://arcanea-ai-app-abc123.vercel.app", prod),
    "https://arcanea-ai-app-abc123.vercel.app",
  );
  assert.equal(
    trustedSpendOrigin("https://arcanea-ai-app-git-fix-team.vercel.app", prod),
    "https://arcanea-ai-app-git-fix-team.vercel.app",
  );
  for (const forged of [
    "https://evil.example",
    "https://www.arcanea.ai.evil.example",
    "http://www.arcanea.ai",
    "http://localhost:3000",
    "not a url",
  ]) {
    assert.equal(trustedSpendOrigin(forged, prod), null, forged);
  }
  assert.equal(
    trustedSpendOrigin("http://localhost:3000", { NODE_ENV: "development" }),
    "http://localhost:3000",
  );
});

test("only an explicit successful spend admits paid video work", () => {
  assert.deepEqual(admissionFromSpend(200, { success: true }), {
    allowed: true,
  });
  for (const body of [
    null,
    {},
    { success: false },
    { success: "true" },
    "<html>",
  ]) {
    assert.deepEqual(admissionFromSpend(200, body), {
      allowed: false,
      status: 503,
      error: "Credit admission is unavailable",
    });
  }
});

test("anonymous, depleted, throttled and failing spends stay distinct and closed", () => {
  const cases: Array<[number, number]> = [
    [401, 401],
    [402, 402],
    [429, 429],
    [500, 503],
    [404, 503],
  ];
  for (const [spendStatus, expected] of cases) {
    const result = admissionFromSpend(spendStatus, { success: true });
    if (result.allowed)
      throw new Error(`Unexpected admission for ${spendStatus}`);
    assert.equal(result.status, expected);
  }
});

test("only bounded https image URLs are accepted", () => {
  assert.equal(
    isHttpsImageUrl("https://abc.public.blob.vercel-storage.com/u/1.png"),
    true,
  );
  assert.equal(isHttpsImageUrl("https://imgen.x.ai/xai-imgen/abc.jpg"), true);
  const rejected: unknown[] = [
    undefined,
    null,
    42,
    "",
    "http://example.com/a.png",
    "data:image/png;base64,AAAA",
    "file:///etc/passwd",
    "javascript:alert(1)",
    "not a url",
    `https://example.com/${"a".repeat(2100)}`,
  ];
  for (const value of rejected) {
    assert.equal(isHttpsImageUrl(value), false, String(value).slice(0, 40));
  }
});
