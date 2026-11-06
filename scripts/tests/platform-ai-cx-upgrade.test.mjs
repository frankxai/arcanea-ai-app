import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("gateway catalog exposes single-source provider and label helpers", () => {
  const catalogSource = readRepoFile("apps/web/lib/gateway/catalog.ts");
  assert.match(catalogSource, /export function getGatewayModelProvider\(/);
  assert.match(catalogSource, /export function getGatewayModelLabel\(/);
  assert.match(catalogSource, /export function getProviderGatewayModels\(/);
  assert.doesNotMatch(catalogSource, /~2400 tok\/s/);
});

test("use-provider derives model maps from GATEWAY_MODELS and supports multi-provider auto fallback", () => {
  const hookSource = readRepoFile("apps/web/hooks/use-provider.ts");
  assert.match(hookSource, /GATEWAY_MODELS/);
  assert.match(hookSource, /export function resolveAutoProvider\(/);
  assert.match(hookSource, /export function isGatewayModelConfigured\(/);
  assert.match(hookSource, /configuredProviders/);
});

test("use-conversation resolves @mention model aliases to canonical gateway IDs", () => {
  const convSource = readRepoFile("apps/web/hooks/use-conversation.ts");
  assert.match(convSource, /export const MODEL_ALIAS_TO_GATEWAY_ID/);
  assert.match(convSource, /export function resolveModelMentionAlias\(/);
  assert.match(convSource, /gemini:\s*"arcanea-gemini-pro"/);
  assert.match(convSource, /gpt:\s*"arcanea-gpt5"/);
  assert.match(convSource, /opus:\s*"arcanea-opus"/);
  assert.match(convSource, /claude:\s*"arcanea-sonnet"/);
  assert.match(convSource, /r1:\s*"arcanea-deepseek-r1"/);
  assert.match(convSource, /grok:\s*"arcanea-grok"/);
});

test("legacy credit endpoints fail closed and unify with the billing ledger", () => {
  const balanceRoute = readRepoFile(
    "apps/web/app/api/credits/balance/route.ts",
  );
  assert.match(balanceRoute, /getAccount/);
  assert.match(balanceRoute, /status:\s*503/);
  assert.doesNotMatch(balanceRoute, /daily:\s*5/);

  const legacyRoute = readRepoFile("apps/web/app/api/credits/route.ts");
  assert.match(legacyRoute, /status:\s*503/);
  assert.doesNotMatch(legacyRoute, /balance:\s*100/);

  const checkoutRoute = readRepoFile(
    "apps/web/app/api/credits/checkout/route.ts",
  );
  assert.match(checkoutRoute, /stripeCreditPackCheckoutGate/);
});

test("CreditBalance widget reads /api/billing/balance and removes deprecated unlimited claims", () => {
  const widgetSource = readRepoFile(
    "apps/web/components/credits/credit-balance.tsx",
  );
  assert.match(widgetSource, /\/api\/billing\/balance/);
  assert.doesNotMatch(widgetSource, /Unlimited creations/);
});

test("PWA manifests use design-system token hex values instead of raw CSS var() strings", () => {
  const rootManifest = readRepoFile("apps/web/app/manifest.ts");
  assert.match(rootManifest, /from "@arcanea\/design-system\/tokens"/);
  assert.match(rootManifest, /background_color:\s*cosmic\.void/);
  assert.match(rootManifest, /theme_color:\s*brand\.atlanteanTeal/);
  assert.doesNotMatch(rootManifest, /var\(--arc-/);

  const promptBooksManifest = readRepoFile(
    "apps/web/app/prompt-books/manifest.ts",
  );
  assert.match(promptBooksManifest, /from '@arcanea\/design-system\/tokens'/);
  assert.match(promptBooksManifest, /background_color:\s*cosmic\.void/);
  assert.match(promptBooksManifest, /theme_color:\s*brand\.atlanteanTeal/);
  assert.doesNotMatch(promptBooksManifest, /var\(--arc-/);
});
