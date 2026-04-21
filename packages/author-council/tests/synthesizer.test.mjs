import test from "node:test";
import assert from "node:assert/strict";
import { synthesize } from "../dist/synthesizer/neutral.js";

test("synthesize throws on empty critiques", () => {
  assert.throws(() => synthesize([], "parallel", { persona: "neutral" }), /Cannot synthesize/);
});

test("synthesize preserves disagreements between contradictory actions on same target", () => {
  const critiques = [
    {
      author: "sanderson",
      role: "systems",
      strengths: [],
      concerns: [],
      recommendations: [
        { action: "add", target: "magic cost", proposal: "add a cost line", rationale: "Three Laws" },
      ],
      citations: [],
      confidence: 0.8,
    },
    {
      author: "le-guin",
      role: "ethics-restraint",
      strengths: [],
      concerns: [],
      recommendations: [
        { action: "remove", target: "magic cost", proposal: "remove the cost line", rationale: "restraint" },
      ],
      citations: [],
      confidence: 0.8,
    },
  ];
  const result = synthesize(critiques, "adversarial", { persona: "neutral" });
  assert.ok(result.disagreements.length >= 1, "must surface disagreement");
  assert.equal(result.disagreements[0].topic, "magic cost");
});

test("synthesize caps any author mass at 25%", () => {
  const critiques = [
    {
      author: "sanderson",
      role: "systems",
      strengths: [],
      concerns: [],
      recommendations: Array.from({ length: 20 }, (_, i) => ({
        action: "clarify",
        target: `x${i}`,
        proposal: "p",
        rationale: "r",
      })),
      citations: [],
      confidence: 1.0,
    },
    {
      author: "le-guin",
      role: "ethics-restraint",
      strengths: [],
      concerns: [],
      recommendations: [{ action: "clarify", target: "y", proposal: "p", rationale: "r" }],
      citations: [],
      confidence: 0.5,
    },
    {
      author: "tolkien",
      role: "language-myth",
      strengths: [],
      concerns: [],
      recommendations: [{ action: "clarify", target: "z", proposal: "p", rationale: "r" }],
      citations: [],
      confidence: 0.5,
    },
  ];
  const result = synthesize(critiques, "parallel", { persona: "neutral" });
  for (const [author, weight] of Object.entries(result.authorWeights)) {
    assert.ok(weight <= 0.25 + 1e-9, `${author} weight ${weight} > 0.25`);
  }
});

test("synthesize with requireDissent and 3+ authors forces a disagreement", () => {
  const critiques = [
    { author: "a", role: "systems", strengths: [], concerns: [], recommendations: [{ action: "clarify", target: "x", proposal: "p", rationale: "r" }], citations: [], confidence: 0.7 },
    { author: "b", role: "language-myth", strengths: [], concerns: [], recommendations: [{ action: "clarify", target: "x", proposal: "p", rationale: "r" }], citations: [], confidence: 0.7 },
    { author: "c", role: "ethics-restraint", strengths: [], concerns: [], recommendations: [{ action: "clarify", target: "x", proposal: "p", rationale: "r" }], citations: [], confidence: 0.7 },
  ];
  const result = synthesize(critiques, "parallel", { persona: "neutral", requireDissent: true });
  assert.ok(result.disagreements.length >= 1, "must synthesize at least one dissent when required");
});
