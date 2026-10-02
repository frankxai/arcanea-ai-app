export const READER_URL = "https://arcanea-reader.frankxai.workers.dev/mcp";
export const READER_HEALTH_URL =
  "https://arcanea-reader.frankxai.workers.dev/health";
export const CANON_SOURCE_URL =
  "https://github.com/frankxai/arcanea-ai-app/blob/740a6328c4d675e95d7609c20d646173d1c32bc1/.arcanea/lore/CANON_LOCKED.md";

export const READER_LIMITS =
  "The lint checks specific gate-count and Guardian-element wording. It does not check godbeast elements or every contradiction. A clear result means no supported pattern matched; voice, clarity, imagery and publication readiness still need review.";

export const READER_TOOLS = [
  {
    name: "arcanea_rubric",
    detail:
      "Returns a short public rubric prompt for canon-fit or visual-taste. Other names are refused.",
    params: [
      { name: "name", required: true, detail: "canon-fit or visual-taste." },
    ],
    example: { name: "canon-fit" },
  },
  {
    name: "arcanea_canon_lint",
    detail:
      "Flags supported gate-count and Guardian-element contradictions without a model call. Godbeast-element checks are not covered.",
    params: [
      {
        name: "draft",
        required: true,
        detail: "The text to check. Pattern coverage is limited.",
      },
    ],
    example: { draft: "The eleventh gate opened. Lyssandria is of Fire." },
  },
  {
    name: "arcanea_score",
    detail:
      "Runs the same lint. A matched contradiction returns fail. Clear is not a quality score or permission to publish.",
    params: [{ name: "draft", required: true, detail: "The text to check." }],
    example: { draft: "A traveler waited at the gate until dawn." },
  },
  {
    name: "arcanea_doctor",
    detail:
      "Reports this reader's version and scope: no provider key and no generation.",
    params: [],
    example: {},
  },
  {
    name: "arcanea_lore",
    detail:
      "Returns a refusal on this endpoint. Read canonical lore in the public app repository through the source link below.",
    params: [
      {
        name: "query",
        required: false,
        detail: "The endpoint refuses even when a query is supplied.",
      },
    ],
    example: { query: "Shinkami" },
  },
  {
    name: "arcanea_template",
    detail:
      "Returns a refusal on this endpoint. It does not provide Studio templates or grant access to Studio.",
    params: [
      {
        name: "name",
        required: true,
        detail:
          "Required by the tool schema, even though the endpoint refuses.",
      },
    ],
    example: { name: "camera-rig" },
  },
] as const;

export const READER_CLIENTS = [
  {
    name: "Claude Desktop",
    location: "Customize → Connectors → Add custom connector",
    note: "Add a custom connector with this URL, review the detected authentication, and select No sign in for this reader. Enable the connector in your conversation. Team workspaces may need an owner to add it first.",
    body: READER_URL,
    copyLabel: "Copy Claude Desktop URL",
    guide:
      "https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp",
  },
  {
    name: "Claude Code",
    location: "Terminal in your project",
    note: "Run this in your project directory. Local scope keeps the connection private to you in that project. Run claude mcp list, then /mcp in Claude Code to check the connection.",
    body: `claude mcp add --transport http --scope local arcanea ${READER_URL}`,
    copyLabel: "Copy Claude Code command",
    guide: "https://code.claude.com/docs/en/mcp",
  },
  {
    name: "Codex",
    location: ".codex/config.toml in a trusted project",
    note: "Merge this table into your project's config without replacing existing settings. Codex loads project config only in trusted projects. Run codex mcp list to verify it. ~/.codex/config.toml is the alternative for all your projects.",
    body: `[mcp_servers.arcanea]\nurl = "${READER_URL}"`,
    copyLabel: "Copy Codex configuration",
    guide: "https://developers.openai.com/codex/mcp",
  },
  {
    name: "Cursor",
    location: ".cursor/mcp.json in your project",
    note: "Merge the arcanea entry into mcpServers without replacing existing entries, then restart Cursor. ~/.cursor/mcp.json is the alternative for all your projects. Project configuration can be shared with your team.",
    body: JSON.stringify(
      { mcpServers: { arcanea: { url: READER_URL } } },
      null,
      2,
    ),
    copyLabel: "Copy Cursor configuration",
    guide: "https://prod.cursor.com/help/customization/mcp",
  },
] as const;
