/**
 * Arcanea CLI — skills installer entrypoint (registry wiring lands in follow-up slices).
 */
import { Command } from "commander";

const program = new Command();

program
  .name("arcanea")
  .description("Install and manage Arcanea skills for Claude Code, OpenCode, Cursor, and more.")
  .version("0.1.0");

program
  .command("list")
  .description("Browse available skills")
  .action(() => {
    console.log("Skill registry list — run from a connected workspace or see README.");
  });

program
  .command("search")
  .argument("[query]", "search text")
  .description("Find skills matching a query")
  .action((query?: string) => {
    console.log(query ? `Search: ${query}` : "Provide a search query.");
  });

program
  .command("install")
  .argument("[skill]", "skill package id")
  .option("--tool <tool>", "claude-code | opencode | cursor | codex | gemini")
  .option("--force", "overwrite existing install")
  .action((skill?: string) => {
    if (!skill) {
      console.error("Usage: arcanea install <skill-id>");
      process.exitCode = 1;
      return;
    }
    console.log(`Install stub — skill: ${skill} (full installer ships with registry PR).`);
  });

program
  .command("update")
  .argument("[skill]", "skill id, or omit for all")
  .description("Update installed skills")
  .action((skill?: string) => {
    console.log(skill ? `Update: ${skill}` : "Update all — stub.");
  });

program
  .command("uninstall")
  .argument("[skill]", "skill id")
  .option("--all", "remove from every detected tool")
  .action((skill?: string) => {
    if (!skill) {
      console.error("Usage: arcanea uninstall <skill-id>");
      process.exitCode = 1;
      return;
    }
    console.log(`Uninstall stub — skill: ${skill}`);
  });

program.parse();
