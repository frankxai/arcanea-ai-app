# Arcanea worldbuilding MCP

Local tools for drafting characters, places, relationships, production plans and visual prompts. Connect through stdio or a loopback HTTP listener. Use `tools/list` for the inventory supplied by your installed build.

## Release status

This source is a **1.0.0 release candidate**. Building or packing it does not publish it. The previously published `@arcanea/mcp-server@0.7.0` contains an unresolved `workspace:*` dependency; a fresh consumer install fails. Do not use that release as the installation path for this candidate.

The development repository is `frankxai/arcanea-ai-app` and requires repository access. The public `frankxai/arcanea` mirror may contain an older revision. A release must pass the package and fresh-consumer checks below before its npm installation command is advertised.

## Build from an authorized checkout

Use Node 22 and pnpm 8.15.0, matching this repository's runtime and lockfile. Run from the repository root:

```sh
pnpm --filter @arcanea/mcp-server install --frozen-lockfile
pnpm --dir packages/arcanea-mcp build
pnpm --dir packages/arcanea-mcp test:delivery
node packages/arcanea-mcp/dist/cli.js --version
node packages/arcanea-mcp/dist/cli.js --help
```

Start a local stdio server by giving your MCP host an absolute path to the built CLI. Replace the example paths with paths on your machine:

```json
{
  "mcpServers": {
    "arcanea-world": {
      "command": "node",
      "args": [
        "/absolute/path/to/arcanea-ai-app/packages/arcanea-mcp/dist/cli.js"
      ],
      "env": {
        "ARCANEA_DATA_DIR": "/absolute/path/to/your/arcanea-data"
      }
    }
  }
}
```

On Windows, use forward slashes in JSON paths, such as `C:/projects/arcanea-ai-app/packages/arcanea-mcp/dist/cli.js`. These are generic MCP host settings; hosts can use different configuration formats. The CLI writes protocol messages to stdout and startup diagnostics to stderr.

## What runs locally

| Capability                                    | Behavior and limits                                                                                                                                               |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worldbuilding generators                      | Produce structured drafts using local rules and templates. They do not call an AI model or establish canon.                                                       |
| Production planning and visual prompts        | Produce briefs and handoff material. They do not render images, video, music, or complete books.                                                                  |
| Creation graph                                | Tracks generated creations and their relationships within the running process.                                                                                    |
| `save_world`                                  | Explicitly writes a graph snapshot to local disk, replacing a previous snapshot with the same session id.                                                         |
| `load_world`                                  | Restores a graph into memory, replacing that session's current graph. With no id, lists saved worlds.                                                             |
| Creative journey memory                       | Lives in the process. Graph snapshots do not include journey history, preferences or milestones.                                                                  |
| Agent orchestration                           | Returns planning and routing scaffolding. The executor currently returns placeholders; it does not launch the named models or a real agent swarm.                 |
| Vault and media lookup                        | Some tools rely on repository-local vaults or a local media manifest. Those assets are not bundled in the npm tarball.                                            |
| Sovereign Depths and Weight of Wonders search | Separately registered by the CLI; retain explicit proposal and experimental opt-ins. These tools can read remote proposal archives and never promote canon.       |
| World Context Gateway                         | Separate `@arcanea/mcp-server/gateway` API with its own authority and verification contracts. Its authentication does not apply to the local HTTP listener below. |

Core world generation, graph storage and planning need no provider key. Other connectors, renderers or model hosts you add have their own credentials and costs. Keep sensitive manuscripts and private world material in a data directory you control.

## Saved worlds

Generated creation, planning-task and planning-session identifiers are opaque
strings backed by UUIDs. Rapid calls, equal timestamps and clock corrections do
not reuse a timestamp as the identity. Use `createdAt`/`startedAt` for chronology;
do not parse time, world or agent identity from an id. Existing saved node ids
remain unchanged when loaded, and callers may continue choosing their world
session ids. The planner still returns scaffolding rather than launching models.

The default directory is `~/.arcanea/worlds`, resolved using the operating system's home directory. Set `ARCANEA_DATA_DIR` to an **absolute path** to choose a different data root; snapshots go in its `worlds` subdirectory. Storage is independent of the package's installation directory.

World ids must contain 1–128 letters, digits, underscores or hyphens and cannot be reserved Windows filenames. Snapshots validate their identity, node and relationship structure before loading. A corrupt file produces an explicit error and is preserved. A listing fails visibly if it encounters an invalid snapshot, so corruption is not mistaken for an empty library.

Writes use a temporary file and an atomic replacement on the same filesystem. There is no cross-process lock: do not run multiple writers against the same world id and data directory. This change does not move or delete existing data. If an older checkout saved under its repository's `.arcanea/worlds`, point `ARCANEA_DATA_DIR` at that repository's `.arcanea` directory to access it, or copy reviewed snapshots into your chosen data directory.

## Local HTTP

```sh
node packages/arcanea-mcp/dist/cli.js --transport http --port 3100
```

Connect a Streamable HTTP MCP client to `http://127.0.0.1:3100/mcp`. `/health` reports the actual package version and current session count. Use MCP `tools/list` for tool discovery.

The listener binds only to `127.0.0.1`, validates local Host and Origin headers, limits JSON requests to 1 MiB and caps active sessions at 32. Idle sessions expire after 30 minutes. Each protocol session gets a separate MCP server; world and journey state still belong to the same local user and can be shared through explicit world session ids.

Session ids route clients; they are **not authentication**. This is a local single-user transport, not a hosted or multi-tenant service. Do not publish it through a proxy or tunnel. Stop with Ctrl+C to close the listener and its sessions.

## Package verification

From `packages/arcanea-mcp`, using the repository's pinned pnpm:

```sh
pnpm build
pnpm test
pnpm verify:package
pnpm pack --pack-destination /absolute/path/to/release-artifacts
```

`prepack` rebuilds the artifact and rejects missing entrypoints or local-only runtime dependencies. `prepublishOnly` also runs the delivery tests. No script publishes automatically.

Before release, install the resulting tarball into a fresh directory outside this workspace with install scripts disabled. Run the CLI's help and version commands there, then run `tests/runtime-delivery.test.mjs` with `ARCANEA_MCP_ENTRY` set to the installed `dist/cli.js`. This proves real MCP initialization, tool discovery, a saved world and restoration after restart without relying on workspace dependencies.

The package's existing license declaration is MIT. See the repository license and review any separately supplied assets under their own terms.

## Search a local Markdown library

The `search_library` MCP tool reads the dedicated folder selected by the server
operator in `ARCANEA_LIBRARY_DIR`. Set an absolute folder path in the MCP server's
`env` configuration, alongside `ARCANEA_DATA_DIR` if used. Without this setting,
the tool returns a configuration error. It never guesses a parent `book` folder,
searches your home directory, downloads texts, or bundles the repository library.
Every client allowed to call this server can receive excerpts from this folder.

Search terms match literally and case-insensitively; any matching term contributes
to ranking. Responses include the relative file, collection, heading, excerpt and
score. For example, call `search_library` with `{"query":"river memory","limit":5}`.
Repeated terms do not inflate scores. Returned excerpts are source material, not
instructions or an assertion that the text is approved Arcanea canon.

Each call accepts up to 512 query characters and 32 distinct words, returns 1–20
results, and reads at most 1,000 Markdown files, 5,000 directory entries, eight
nested directory levels and 8 MiB of text. Individual files are limited to 512 KiB.
Hidden entries, README files and child symbolic links/junctions are excluded.
The `scan` field reports skipped entries and incomplete scans; partial counts only
describe files actually read. Folder access failures return explicit errors.
This is bounded local lookup, not an OS sandbox against concurrent filesystem changes.
