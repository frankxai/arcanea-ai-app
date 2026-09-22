import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test("prompt-books first HTML is the landing, not an auth null gate", async () => {
  const page = await readFile(
    path.join(repoRoot, "apps/web/app/prompt-books/page.tsx"),
    "utf8",
  );
  const layout = await readFile(
    path.join(repoRoot, "apps/web/app/prompt-books/layout.tsx"),
    "utf8",
  );

  assert.equal(
    page.includes("if (!authChecked) return null"),
    false,
    "auth-pending must not return null; crawlers would see chrome-only HTML",
  );
  assert.match(page, /Your AI Prompt Library/);
  assert.match(page, /if \(!userId\)/);
  assert.match(page, /<PromptBooksLanding \/>/);
  assert.match(layout, /title: ['"]Your AI Prompt Library['"]/);
});
