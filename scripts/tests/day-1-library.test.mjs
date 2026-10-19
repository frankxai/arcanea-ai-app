import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DOC_PATH = path.resolve(
  process.cwd(),
  "docs/worldbuilding/day-1-library.md",
);

test("day-1 library document existence and structure", () => {
  assert.ok(
    fs.existsSync(DOC_PATH),
    "docs/worldbuilding/day-1-library.md must exist",
  );
  const content = fs.readFileSync(DOC_PATH, "utf8");

  // Check required worked examples
  assert.match(content, /Series bible template and worked example/i);
  assert.match(content, /Campaign ledger template and worked example/i);
  assert.match(content, /Quest kit template and worked example/i);
  assert.match(
    content,
    /Visual novel \(VN\) branch kit template and worked example/i,
  );

  // Check provenance fields
  assert.match(content, /provenance:/);
  assert.match(content, /canon_source:/);
  assert.match(content, /sourced_claims:/);

  // Check World Proof Lab outline
  assert.match(content, /World Proof Lab outline/i);
});

test("day-1 library document headings follow sentence case", () => {
  const content = fs.readFileSync(DOC_PATH, "utf8");
  const lines = content.split("\n");
  const headings = lines.filter((line) => line.startsWith("#"));

  for (const heading of headings) {
    // Strip leading # symbols and leading numbers like "1. " or "2. "
    const text = heading
      .replace(/^#+\s+/, "")
      .replace(/^(\d+\.)\s+/, "")
      .trim();
    if (!text || text.startsWith("```")) continue;

    const words = text.split(/\s+/);
    // Index 0 is the sentence's first word, which SHOULD be capitalized.
    // Words at index > 0 should NOT be capitalized unless they are proper nouns or acronyms.
    for (let i = 1; i < words.length; i++) {
      const word = words[i].replace(/[^a-zA-Z]/g, "");
      if (!word) continue;

      const properNouns = [
        "Arcanea",
        "VN",
        "Tide",
        "Archive",
        "Low",
        "Proof",
        "Lab",
        "ID",
        "YAML",
        "Mara",
      ];
      if (properNouns.includes(word)) continue;

      const isCapitalized = /^[A-Z][a-z]*/.test(word);
      assert.ok(
        !isCapitalized,
        `Heading "${heading}" contains title-cased word "${word}". Expected sentence case.`,
      );
    }
  }
});

test("day-1 library document contains no banned AI prestige words", () => {
  const content = fs.readFileSync(DOC_PATH, "utf8");
  const bannedWords = [
    "elevate",
    "elevating",
    "elevated",
    "delve",
    "delving",
    "tapestry",
    "testament",
    "beacon",
    "unleash",
    "harness",
  ];

  for (const word of bannedWords) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    assert.ok(
      !regex.test(content),
      `Document contains banned AI word/slop: "${word}"`,
    );
  }
});
