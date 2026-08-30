import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PublicMcpToolError, executePublicMcpTool } from "../public-tools";

describe("public MCP tool argument validation", () => {
  it("rejects generate_magic without required arguments", () => {
    assert.throws(
      () => executePublicMcpTool("generate_magic", {}),
      (error: unknown) =>
        error instanceof PublicMcpToolError &&
        /Invalid arguments for generate_magic/.test(error.message),
    );
  });

  it("rejects an out-of-range gate level instead of crashing the generator", () => {
    assert.throws(
      () => executePublicMcpTool("generate_magic", { element: "Fire", gateLevel: 0 }),
      PublicMcpToolError,
    );
  });

  it("rejects a visualize_character payload that is not a blueprint", () => {
    assert.throws(
      () => executePublicMcpTool("visualize_character", { name: "Kaelith" }),
      PublicMcpToolError,
    );
  });

  it("strips unknown keys rather than forwarding caller-controlled fields", () => {
    const hostile = JSON.parse(
      '{"count":1,"__proto__":{"polluted":true},"unexpected":"aaaaaaaa"}',
    ) as Record<string, unknown>;
    const result = executePublicMcpTool("generate_name", hostile) as {
      names: string[];
    };
    assert.equal(result.names.length, 1);
  });

  it("accepts a well-formed payload", () => {
    const result = executePublicMcpTool("generate_magic", {
      element: "Fire",
      gateLevel: 3,
      purpose: "attack",
    }) as { gateRequired: number };
    assert.equal(result.gateRequired, 3);
  });

  it("rejects an unknown tool", () => {
    assert.throws(
      () => executePublicMcpTool("rm_rf", {}),
      PublicMcpToolError,
    );
  });
});
