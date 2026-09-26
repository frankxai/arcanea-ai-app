#!/usr/bin/env node
import { CLI_HELP, parseCliOptions } from "./cli-options.js";
import { RUNTIME_INFO } from "./runtime-info.js";

try {
  const options = parseCliOptions(process.argv.slice(2));
  if (options.action === "help") {
    process.stdout.write(CLI_HELP);
  } else if (options.action === "version") {
    process.stdout.write(`${RUNTIME_INFO.version}\n`);
  } else {
    const { createRuntimeServer } = await import("./runtime-server.js");
    const { resolveToolsets } = await import("./toolsets.js");
    const { runStdio, runHttp } = await import("./transport.js");
    const toolsets =
      options.toolsets ?? (process.env.ARCANEA_TOOLSETS || "core");
    resolveToolsets(toolsets);
    const create = () => createRuntimeServer({ toolsets });
    if (options.transport === "http") {
      const running = await runHttp(create, options.port);
      const shutdown = () => {
        void running.close().then(() => process.exit(0));
      };
      process.once("SIGINT", shutdown);
      process.once("SIGTERM", shutdown);
    } else {
      await runStdio(create());
    }
  }
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Unable to start Arcanea MCP.",
  );
  process.exitCode = 1;
}
