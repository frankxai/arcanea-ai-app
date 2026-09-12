import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

async function read(relativePath) {
  return readFile(path.join(repoRoot, relativePath), "utf8");
}

test("Worlds onboarding uses the governed modal boundary", async () => {
  const source = await read("apps/web/components/worlds/WorldsOnboarding.tsx");

  for (const contract of [
    'import * as Dialog from "@radix-ui/react-dialog"',
    "<Dialog.Overlay asChild>",
    "<Dialog.Content",
    "<Dialog.Title asChild>",
    "<Dialog.Description asChild>",
    "onOpenAutoFocus",
    "nextButtonRef.current?.focus()",
    "onCloseAutoFocus",
    "returnFocusRef.current?.isConnected",
    'document.getElementById("worlds-heading")',
    "returnTarget?.focus({ preventScroll: true })",
    "onOpenChange",
  ]) {
    assert.ok(
      source.includes(contract),
      `missing onboarding contract: ${contract}`,
    );
  }

  assert.match(source, /aria-live="polite"/);
  assert.match(source, /focus-visible:ring-2/);
  assert.doesNotMatch(source, /role=["']dialog["']/);
});

test("Worlds route exposes one primary heading", async () => {
  const [page, hero, client] = await Promise.all([
    read("apps/web/app/worlds/page.tsx"),
    read("apps/web/app/worlds/worlds-hero.tsx"),
    read("apps/web/app/worlds/worlds-client.tsx"),
  ]);

  const h1Count = [page, hero, client].reduce(
    (count, source) => count + (source.match(/<(?:m\.)?h1\b/g) ?? []).length,
    0,
  );

  assert.equal(h1Count, 1);
  assert.match(hero, /<m\.h1\b/);
  assert.match(hero, /id="worlds-heading"/);
  assert.match(hero, /tabIndex=\{-1\}/);
  assert.match(client, /<h2 className="text-4xl/);
});

test("Worlds process steps use canonical icon components", async () => {
  const source = await read("apps/web/app/worlds/worlds-hero.tsx");

  assert.match(source, /MagicWand, PencilSimple, TreeStructure/);
  assert.match(source, /icon: Icon/);
  assert.match(source, /<Icon className="h-4 w-4" aria-hidden="true" \/>/);
  assert.doesNotMatch(source, /[✍✦⬡]/u);
});
