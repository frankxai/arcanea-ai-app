import assert from "node:assert/strict";
import test from "node:test";
import { buildImageGenerateTool, imageGenerateInputSchema } from "../image";

test("Luminor image request preserves a private draft without inference or billing", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw Error("Unexpected network call");
  };
  try {
    const tool = buildImageGenerateTool();
    assert.equal(typeof tool.execute, "function");
    const prompt = "A lighthouse & sea / <script>draw</script> ? # 🌊";
    const result = await tool.execute!(
      { prompt, aspectRatio: "16:9" },
      { toolCallId: "image-test", messages: [] },
    );
    assert.ok(result && "href" in result);
    assert.equal(result.type, "image_generation_handoff");
    assert.equal(result.status, "awaiting_creator");
    assert.equal(result.aspectRatio, "16:9");
    const url = new URL(result.href, "https://arcanea.ai");
    assert.equal(url.origin, "https://arcanea.ai");
    assert.equal(url.pathname, "/imagine");
    assert.equal(url.searchParams.get("prompt"), prompt);
    assert.equal(calls, 0);
    assert.equal("images" in result, false);
  } finally {
    globalThis.fetch = original;
  }
});

test("Image handoff rejects invalid prompts and aspect ratios before execution", async () => {
  const tool = buildImageGenerateTool();
  for (const prompt of ["", "  ", "x".repeat(2001)]) {
    assert.equal(imageGenerateInputSchema.safeParse({ prompt }).success, false);
    await assert.rejects(async () =>
      tool.execute!({ prompt }, { toolCallId: "image-test", messages: [] }),
    );
  }
  assert.equal(
    imageGenerateInputSchema.safeParse({
      prompt: "Lighthouse",
      aspectRatio: "evil",
    }).success,
    false,
  );
});

test("Chat renders an escaped draft with a local review link instead of a completed image", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { ToolResultBlock } =
    await import("../../../../components/chat/tool-result-block");
  const markup = renderToStaticMarkup(
    createElement(ToolResultBlock, {
      toolName: "image_generate",
      result: {
        type: "image_generation_handoff",
        prompt: "<script>alert(1)</script> lighthouse",
        aspectRatio: "16:9",
        href: "https://untrusted.example/",
      },
    }),
  );
  assert.match(markup, /Review in Imagine/);
  assert.match(markup, /href="\/imagine\?prompt=/);
  assert.match(markup, /&lt;script&gt;/);
  assert.match(markup, /select 16:9 in Imagine/);
  assert.doesNotMatch(markup, /<script>|<img|href="https:\/\/untrusted/);
});
