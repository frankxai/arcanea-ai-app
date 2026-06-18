/**
 * Arcanea CLI — skills installer and manager.
 */
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import fs from "fs";
import path from "path";
import os from "os";
import { fetchRegistry, getFileContent, getLocalRegistryPath, RegistryItem } from "./registry.js";

const program = new Command();

program
  .name("arcanea")
  .description("Install and manage Arcanea skills for Claude Code, OpenCode, Cursor, and more.")
  .version("0.1.0");

interface ToolTarget {
  id: string;
  name: string;
  skillsPath: string;
}

/**
 * Gets the list of available customization paths on the user's system.
 */
function getAvailableTools(cwd: string = process.cwd()): ToolTarget[] {
  const home = os.homedir();
  const tools: ToolTarget[] = [];

  // 1. Claude Code
  if (fs.existsSync(path.join(home, ".claude"))) {
    tools.push({
      id: "claude-code",
      name: "Claude Code",
      skillsPath: path.join(home, ".claude", "skills"),
    });
  }

  // 2. OpenCode
  if (fs.existsSync(path.join(home, ".opencode"))) {
    tools.push({
      id: "opencode",
      name: "OpenCode",
      skillsPath: path.join(home, ".opencode", "skills"),
    });
  }

  // 3. Cursor
  if (fs.existsSync(path.join(home, ".cursor"))) {
    tools.push({
      id: "cursor",
      name: "Cursor",
      skillsPath: path.join(home, ".cursor", "skills"),
    });
  }

  // 4. Codex
  if (fs.existsSync(path.join(home, ".codex"))) {
    tools.push({
      id: "codex",
      name: "Codex",
      skillsPath: path.join(home, ".codex", "skills"),
    });
  }

  // 5. Gemini Config (Antigravity Global) or Gemini CLI
  if (fs.existsSync(path.join(home, ".gemini", "config"))) {
    tools.push({
      id: "antigravity",
      name: "Antigravity (Global)",
      skillsPath: path.join(home, ".gemini", "config", "skills"),
    });
  } else if (fs.existsSync(path.join(home, ".gemini"))) {
    tools.push({
      id: "gemini",
      name: "Gemini CLI",
      skillsPath: path.join(home, ".gemini", "skills"),
    });
  }

  // 6. Local Workspace (.agents)
  if (fs.existsSync(path.join(cwd, ".agents")) || fs.existsSync(path.join(cwd, "package.json"))) {
    tools.push({
      id: "workspace",
      name: "Local Workspace (.agents)",
      skillsPath: path.join(cwd, ".agents", "skills"),
    });
  }

  return tools;
}

/**
 * Returns the default ToolTarget details for a given ID, even if not pre-detected.
 */
function getToolById(id: string, cwd: string = process.cwd()): ToolTarget {
  const home = os.homedir();
  switch (id) {
    case "claude-code":
      return { id, name: "Claude Code", skillsPath: path.join(home, ".claude", "skills") };
    case "opencode":
      return { id, name: "OpenCode", skillsPath: path.join(home, ".opencode", "skills") };
    case "cursor":
      return { id, name: "Cursor", skillsPath: path.join(home, ".cursor", "skills") };
    case "codex":
      return { id, name: "Codex", skillsPath: path.join(home, ".codex", "skills") };
    case "gemini":
      return { id, name: "Gemini CLI", skillsPath: path.join(home, ".gemini", "skills") };
    case "antigravity":
      return { id, name: "Antigravity (Global)", skillsPath: path.join(home, ".gemini", "config", "skills") };
    case "workspace":
      return { id, name: "Local Workspace (.agents)", skillsPath: path.join(cwd, ".agents", "skills") };
    default:
      throw new Error(`Unknown tool ID: ${id}`);
  }
}

// ==================== COMMAND: list ====================
program
  .command("list")
  .description("Browse available skills in the registry")
  .action(async () => {
    const spinner = ora("Loading skills registry...").start();
    try {
      const registry = await fetchRegistry();
      spinner.succeed(chalk.green("Registry loaded successfully!\n"));

      console.log(chalk.bold.cyan("Available Arcanea Skills:"));
      console.log(chalk.gray("========================================="));

      for (const item of registry.items) {
        console.log(`\n• ${chalk.bold.yellow(item.name)} (v${item.meta.version})`);
        console.log(`  ${chalk.white(item.description)}`);
        console.log(`  ${chalk.gray("Author:")} ${item.author} | ${chalk.gray("Tags:")} ${item.meta.tags.join(", ")}`);
      }
      console.log();
    } catch (e: any) {
      spinner.fail(chalk.red(`Failed to load registry: ${e.message}`));
    }
  });

// ==================== COMMAND: search ====================
program
  .command("search")
  .argument("<query>", "search term")
  .description("Find skills matching a query")
  .action(async (query: string) => {
    const spinner = ora(`Searching for "${query}"...`).start();
    try {
      const registry = await fetchRegistry();
      const q = query.toLowerCase();
      const matches = registry.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
      );

      if (matches.length === 0) {
        spinner.warn(chalk.yellow(`No skills found matching "${query}".`));
        return;
      }

      spinner.succeed(chalk.green(`Found ${matches.length} matching skill(s):\n`));
      for (const item of matches) {
        console.log(`• ${chalk.bold.yellow(item.name)} - ${item.description}`);
      }
      console.log();
    } catch (e: any) {
      spinner.fail(chalk.red(`Search failed: ${e.message}`));
    }
  });

// ==================== COMMAND: install ====================
program
  .command("install")
  .argument("[skill]", "skill package ID")
  .option("--tool <tool>", "claude-code | opencode | cursor | codex | gemini | antigravity | workspace")
  .option("--force", "overwrite existing installations")
  .description("Install an Arcanea skill into your AI tools")
  .action(async (skillName?: string, options?: { tool?: string; force?: boolean }) => {
    try {
      const registry = await fetchRegistry();

      // If no skill specified, prompt list
      let selectedSkill: RegistryItem | undefined;
      if (!skillName) {
        const response = await prompts({
          type: "select",
          name: "skill",
          message: "Select a skill to install:",
          choices: registry.items.map((item) => ({
            title: `${item.name} - ${item.title}`,
            description: item.description,
            value: item,
          })),
        });
        if (!response.skill) return;
        selectedSkill = response.skill;
      } else {
        selectedSkill = registry.items.find(
          (item) => item.name.toLowerCase() === skillName.toLowerCase()
        );
        if (!selectedSkill) {
          console.error(chalk.red(`Error: Skill "${skillName}" not found in registry.`));
          console.log(chalk.gray("Run 'arcanea list' to see all available skills."));
          process.exitCode = 1;
          return;
        }
      }

      const skill = selectedSkill!;
      console.log(chalk.cyan(`Preparing to install ${chalk.bold(skill.name)} (v${skill.meta.version})...`));

      // Resolve targets
      let selectedTools: ToolTarget[] = [];
      if (options?.tool) {
        selectedTools = [getToolById(options.tool)];
      } else {
        const detected = getAvailableTools();
        if (detected.length === 0) {
          console.log(chalk.yellow("No AI tools detected in default home directory paths."));
          const response = await prompts({
            type: "select",
            name: "tool",
            message: "Where would you like to install this skill?",
            choices: [
              { title: "Claude Code (~/.claude/skills)", value: "claude-code" },
              { title: "Gemini CLI (~/.gemini/skills)", value: "gemini" },
              { title: "Antigravity Global (~/.gemini/config/skills)", value: "antigravity" },
              { title: "Local Workspace (.agents/skills)", value: "workspace" },
            ],
          });
          if (!response.tool) return;
          selectedTools = [getToolById(response.tool)];
        } else if (detected.length === 1) {
          selectedTools = [detected[0]];
          console.log(chalk.gray(`Auto-detected tool: ${chalk.bold(detected[0].name)}`));
        } else {
          const response = await prompts({
            type: "multiselect",
            name: "tools",
            message: "Select which tools to install this skill to:",
            choices: detected.map((t) => ({
              title: t.name,
              value: t,
              selected: true,
            })),
            min: 1,
          });
          if (!response.tools || response.tools.length === 0) return;
          selectedTools = response.tools;
        }
      }

      // Execute installation for each selected tool
      for (const tool of selectedTools) {
        const targetSkillDir = path.join(tool.skillsPath, skill.name);
        console.log(chalk.gray(`Installing into ${tool.name}: ${targetSkillDir}`));

        if (fs.existsSync(targetSkillDir) && !options?.force) {
          const confirm = await prompts({
            type: "confirm",
            name: "overwrite",
            message: `Skill folder already exists in ${tool.name}. Overwrite?`,
            initial: false,
          });
          if (!confirm.overwrite) {
            console.log(chalk.yellow(`Skipped ${tool.name} installation.`));
            continue;
          }
        }

        // Create directory
        fs.mkdirSync(targetSkillDir, { recursive: true });

        // Download and write each file
        for (const file of skill.files) {
          const fileSpinner = ora(`Fetching ${path.basename(file.path)}...`).start();
          try {
            const content = await getFileContent(file.path);
            const destinationPath = path.join(targetSkillDir, path.basename(file.path));
            fs.writeFileSync(destinationPath, content, "utf-8");
            fileSpinner.succeed(chalk.green(`Installed ${path.basename(file.path)}`));
          } catch (e: any) {
            fileSpinner.fail(chalk.red(`Failed to install ${path.basename(file.path)}: ${e.message}`));
          }
        }
        console.log(chalk.bold.green(`✓ Successfully installed ${skill.name} in ${tool.name}!\n`));
      }
    } catch (e: any) {
      console.error(chalk.red(`Installation aborted: ${e.message}`));
      process.exitCode = 1;
    }
  });

// ==================== COMMAND: update ====================
program
  .command("update")
  .argument("[skill]", "skill ID to update (omitting updates all)")
  .description("Update installed skills to their latest versions")
  .action(async (skillName?: string) => {
    try {
      const registry = await fetchRegistry();
      const detectedTools = getAvailableTools();

      if (detectedTools.length === 0) {
        console.log(chalk.yellow("No installed tools detected to update."));
        return;
      }

      const skillsToUpdate = skillName
        ? registry.items.filter((item) => item.name.toLowerCase() === skillName.toLowerCase())
        : registry.items;

      if (skillName && skillsToUpdate.length === 0) {
        console.error(chalk.red(`Skill "${skillName}" not found in registry.`));
        return;
      }

      for (const tool of detectedTools) {
        for (const skill of skillsToUpdate) {
          const targetDir = path.join(tool.skillsPath, skill.name);
          // Only update if it is already installed
          if (fs.existsSync(targetDir)) {
            console.log(chalk.cyan(`Updating ${skill.name} in ${tool.name}...`));
            for (const file of skill.files) {
              const fileSpinner = ora(`Updating ${path.basename(file.path)}...`).start();
              try {
                const content = await getFileContent(file.path);
                fs.writeFileSync(path.join(targetDir, path.basename(file.path)), content, "utf-8");
                fileSpinner.succeed(chalk.green(`Updated ${path.basename(file.path)}`));
              } catch (e: any) {
                fileSpinner.fail(chalk.red(`Failed to update ${path.basename(file.path)}: ${e.message}`));
              }
            }
          }
        }
      }
      console.log(chalk.bold.green("✓ Update checks complete!"));
    } catch (e: any) {
      console.error(chalk.red(`Update failed: ${e.message}`));
    }
  });

// ==================== COMMAND: uninstall ====================
program
  .command("uninstall")
  .argument("<skill>", "skill ID to uninstall")
  .option("--all", "remove from every detected tool")
  .description("Uninstall an Arcanea skill")
  .action(async (skillName: string, options?: { all?: boolean }) => {
    try {
      const detectedTools = getAvailableTools();
      if (detectedTools.length === 0) {
        console.log(chalk.yellow("No tools detected. Nothing to uninstall."));
        return;
      }

      let toolsToUninstallFrom = detectedTools;
      if (!options?.all && detectedTools.length > 1) {
        const response = await prompts({
          type: "multiselect",
          name: "tools",
          message: `Uninstall ${skillName} from which tools?`,
          choices: detectedTools.map((t) => ({
            title: t.name,
            value: t,
          })),
          min: 1,
        });
        if (!response.tools || response.tools.length === 0) return;
        toolsToUninstallFrom = response.tools;
      }

      for (const tool of toolsToUninstallFrom) {
        const targetDir = path.join(tool.skillsPath, skillName);
        if (fs.existsSync(targetDir)) {
          const spinner = ora(`Removing ${skillName} from ${tool.name}...`).start();
          try {
            fs.rmSync(targetDir, { recursive: true, force: true });
            spinner.succeed(chalk.green(`Removed from ${tool.name}`));
          } catch (e: any) {
            spinner.fail(chalk.red(`Failed to remove from ${tool.name}: ${e.message}`));
          }
        } else {
          console.log(chalk.gray(`Skill "${skillName}" is not installed in ${tool.name}.`));
        }
      }
      console.log(chalk.bold.green("✓ Uninstall process complete!"));
    } catch (e: any) {
      console.error(chalk.red(`Uninstall failed: ${e.message}`));
    }
  });

program.parse();
