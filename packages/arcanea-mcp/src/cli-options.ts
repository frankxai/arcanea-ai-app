export type CliOptions =
  | { action: "help" }
  | { action: "version" }
  | { action: "serve"; transport: "stdio" | "http"; port: number };

export function parseCliOptions(args: string[]): CliOptions {
  if (args.length === 1 && ["--help", "-h"].includes(args[0]))
    return { action: "help" };
  if (args.length === 1 && ["--version", "-v"].includes(args[0]))
    return { action: "version" };
  let transport: "stdio" | "http" = "stdio";
  let port = 3100;
  const seen = new Set<string>();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    if (!["--transport", "--port"].includes(flag))
      throw new Error(`Unknown option: ${flag}`);
    if (seen.has(flag)) throw new Error(`Duplicate option: ${flag}`);
    seen.add(flag);
    const value = args[index + 1];
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value for ${flag}`);
    if (flag === "--transport") {
      if (value !== "stdio" && value !== "http")
        throw new Error("Transport must be stdio or http.");
      transport = value;
    } else {
      if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) {
        throw new Error("Port must be an integer between 1 and 65535.");
      }
      port = Number(value);
    }
  }
  if (seen.has("--port") && transport !== "http")
    throw new Error("--port requires --transport http.");
  return { action: "serve", transport, port };
}

export const CLI_HELP = `Arcanea worldbuilding MCP

Usage: arcanea-mcp [--transport stdio|http] [--port 3100]
       arcanea-mcp --version
       arcanea-mcp --help

Stdio is the default. HTTP binds to 127.0.0.1 for local, single-user clients.
HTTP session ids are not user authentication; do not expose this listener publicly.
Use ARCANEA_DATA_DIR to choose an absolute directory for saved world graphs.
`;
