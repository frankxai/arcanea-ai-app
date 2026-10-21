import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { SHOP_GUIDES, findGuide } from "../guides";

test("all shop guides have required metadata and valid sections", () => {
  assert.ok(SHOP_GUIDES.length >= 3);
  for (const guide of SHOP_GUIDES) {
    assert.ok(guide.slug.length > 0);
    assert.ok(guide.title.length > 0);
    assert.ok(guide.searchTitle.length > 0);
    assert.ok(guide.description.length > 0);
    assert.ok(guide.category.length > 0);
    assert.ok(guide.intro.length > 0);
    assert.ok(guide.sections.length > 0);
    for (const section of guide.sections) {
      assert.ok(section.title.length > 0);
      assert.ok(section.paragraphs.length > 0);
    }
  }
});

test("findGuide resolves existing guides and handles unknown slugs", () => {
  assert.equal(findGuide("worldbuilding-bible")?.slug, "worldbuilding-bible");
  assert.equal(findGuide("visual-continuity")?.slug, "visual-continuity");
  assert.equal(
    findGuide("ai-disclosure-canon-provenance")?.slug,
    "ai-disclosure-canon-provenance",
  );
  assert.equal(findGuide("non-existent-slug"), undefined);
});

test("Pillar guide 2 includes sourced and dated platform rules for Steam, KDP, and USCO", () => {
  const guide = findGuide("ai-disclosure-canon-provenance");
  assert.ok(guide, "Pillar guide 2 must exist");

  const fullText = [
    guide.title,
    guide.description,
    guide.intro,
    ...guide.sections.flatMap((s) => [s.title, ...s.paragraphs]),
  ].join("\n");

  // Steam rule verification
  assert.match(fullText, /Steam \/ Valve Policy/i);
  assert.match(fullText, /January 2024/i);
  assert.match(
    fullText,
    /https:\/\/store\.steampowered\.com\/news\/group\/4145017\/view\/3862463717997849405/,
  );

  // Amazon KDP rule verification (including that AI-created drafts stay AI-generated after substantial human edits)
  assert.match(fullText, /Amazon KDP AI Guidelines/i);
  assert.match(fullText, /September 2023/i);
  assert.match(
    fullText,
    /https:\/\/kdp\.amazon\.com\/en_US\/help\/topic\/G200672300/,
  );
  assert.match(
    fullText,
    /still classifies as AI-generated even if a human later applies substantial edits/i,
  );

  // US Copyright Office rule verification
  assert.match(fullText, /US Copyright Office Policy/i);
  assert.match(fullText, /March 2023/i);
  assert.match(fullText, /https:\/\/www\.copyright\.gov\/ai\//);
});

test("Pillar guide 2 worked example preserves mandatory KDP AI-generated disclosure and qualifies supporting records", () => {
  const guide = findGuide("ai-disclosure-canon-provenance");
  assert.ok(guide);

  const fullText = [
    guide.intro,
    ...guide.sections.flatMap((s) => [s.title, ...s.paragraphs]),
  ].join("\n");

  assert.match(fullText, /canon-state/i);
  assert.match(fullText, /canonState: 'proposal'/i);
  assert.match(fullText, /canonState: 'in_review'/i);
  assert.match(fullText, /canonState: 'accepted'/i);
  assert.match(fullText, /human transformation delta/i);
  assert.match(
    fullText,
    /mandatory `'AI-generated'` disclosure on Amazon KDP/i,
  );
  assert.match(
    fullText,
    /supporting production records.*do not constitute legal advice or guarantee copyright eligibility/i,
  );
  assert.doesNotMatch(
    fullText,
    /verifiable proof of human authorship and exact platform disclosure compliance/i,
  );
});

test("Pillar guide 2 includes capture links with UTM parameters and guide page retains worked-example provenance", () => {
  const guide = findGuide("ai-disclosure-canon-provenance");
  assert.ok(guide);

  const fullText = [
    guide.intro,
    ...guide.sections.flatMap((s) => s.paragraphs),
  ].join("\n");

  assert.match(fullText, /utm_source=arcanea_guides/);
  assert.match(fullText, /utm_medium=field_note/);
  assert.match(fullText, /utm_campaign=pillar_guide_2_disclosure/);

  const pagePath = path.resolve(
    import.meta.dirname,
    "../../../app/shop/guides/[slug]/page.tsx",
  );
  const pageSource = fs.readFileSync(pagePath, "utf8");
  assert.match(
    pageSource,
    /The example is an AI-assisted proposal outside official Arcanea\s+canon/i,
  );
});
