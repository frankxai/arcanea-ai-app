import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultReaderPrefs,
  FONT_SIZES,
  FONT_SIZE_CLASSES,
  parseReaderPrefs,
} from "../reader-preferences";

test("missing, malformed and non-object storage falls back to readable defaults", () => {
  for (const raw of [null, "", "{", "null", "false", "18", "[]", '"serif"']) {
    assert.deepEqual(parseReaderPrefs(raw), defaultReaderPrefs());
  }
});

test("valid preferences survive storage round trips at every supported size", () => {
  for (const fontSize of FONT_SIZES) {
    const prefs = {
      theme: "sepia",
      fontFamily: "sans",
      lineHeight: "relaxed",
      fontSize,
    };
    assert.deepEqual(parseReaderPrefs(JSON.stringify(prefs)), prefs);
  }
  assert.deepEqual(
    FONT_SIZES.map((size) => FONT_SIZE_CLASSES[size]),
    ["text-sm", "text-lg", "text-xl", "text-2xl", "text-3xl"],
  );
});

test("legacy size labels retain their actual rendered size", () => {
  assert.equal(parseReaderPrefs('{"fontSize":22}').fontSize, 20);
  assert.equal(parseReaderPrefs('{"fontSize":26}').fontSize, 24);
});

test("invalid fields fall back independently without discarding valid choices", () => {
  assert.deepEqual(
    parseReaderPrefs(
      JSON.stringify({
        theme: "unknown",
        fontSize: "30",
        fontFamily: "sans",
        lineHeight: {},
      }),
    ),
    {
      ...defaultReaderPrefs(),
      fontFamily: "sans",
    },
  );
  for (const fontSize of [-1, 0, 999, null, {}, ["18"]]) {
    assert.equal(parseReaderPrefs(JSON.stringify({ fontSize })).fontSize, 18);
  }
});
