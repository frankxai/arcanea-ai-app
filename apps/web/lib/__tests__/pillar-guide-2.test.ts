import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getBlogPost } from "../blog-data.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const guidePath = path.resolve(
  __dirname,
  "../../app/blog/ai-disclosure-canon-provenance-guide/page.tsx"
);

test("Pillar Guide 2 page exists and contains mandatory exit proof details", () => {
  assert.ok(fs.existsSync(guidePath), "Pillar Guide 2 page file must exist");
  const pageContent = fs.readFileSync(guidePath, "utf-8");

  // Verify platform rules linked and dated
  assert.ok(
    pageContent.includes("https://store.steampowered.com/news/group/4145017/view/3862463747997849618"),
    "Steam policy link must be present"
  );
  assert.ok(pageContent.includes("January 9, 2024"), "Steam rule date must be present");

  assert.ok(
    pageContent.includes("https://kdp.amazon.com/en_US/help/topic/G200672390"),
    "Amazon KDP policy link must be present"
  );
  assert.ok(pageContent.includes("September 2023"), "KDP rule date must be present");

  assert.ok(
    pageContent.includes("https://www.copyright.gov/ai/"),
    "US Copyright Office policy link must be present"
  );
  assert.ok(pageContent.includes("March 16, 2023"), "Copyright Office rule date must be present");

  // Verify worked example using canon-state workflow
  assert.ok(pageContent.includes("CANON_LOCKED.md"), "Worked example must reference CANON_LOCKED.md");
  assert.ok(pageContent.includes("book.yaml"), "Worked example must reference manifest provenance");
  assert.ok(pageContent.includes("prompt_dag_hash"), "Worked example must reference prompt DAG lineage");

  // Verify capture links and UTM parameters
  assert.ok(pageContent.includes("utm_source=blog"), "UTM source parameter must be present");
  assert.ok(pageContent.includes("utm_medium=guide"), "UTM medium parameter must be present");
  assert.ok(pageContent.includes("utm_campaign=ai-disclosure-canon-provenance"), "UTM campaign parameter must be present");
});

test("Pillar Guide 2 is registered in BLOG_POSTS in blog-data.ts", () => {
  const post = getBlogPost("ai-disclosure-canon-provenance-guide");
  assert.ok(post, "Pillar Guide 2 post must be retrievable from blog-data");
  assert.equal(post?.category, "Guide");
  assert.equal(post?.slug, "ai-disclosure-canon-provenance-guide");
});
