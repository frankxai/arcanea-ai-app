import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "button.tsx"),
  "utf8",
);

test("shared button names every animated property including filter", () => {
  assert.equal(source.includes("transition-all"), false);
  assert.match(
    source,
    /transition-\[color,background-color,border-color,box-shadow,transform,filter\]/,
  );
  assert.match(source, /motion-reduce:transition-none/);
  assert.match(source, /motion-reduce:animate-none/);
  assert.match(source, /motion-safe:active:scale-\[0\.98\]/);
  assert.match(source, /focus-visible:!transform-none/);
});
