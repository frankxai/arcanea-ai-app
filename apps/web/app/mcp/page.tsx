import type { Metadata } from "next";
import { McpCommandCenter } from "./mcp-command-center";

export const metadata: Metadata = {
  title: "MCP reader",
  description:
    "Connect Claude, Codex, or Cursor to the free Arcanea reader. Public rubric prompts, limited deterministic canon checks and client-specific setup. No local server package or provider key.",
  alternates: { canonical: "/mcp" },
};

export default function McpPage() {
  return <McpCommandCenter />;
}
