#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import pkg from "scpl-macos-updated";
const { convert } = pkg;
import { writeFileSync, readFileSync, existsSync, mkdirSync, appendFileSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// HELP
// ============================================================================
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
ScPL Updated MCP Server - Create macOS Shortcuts with AI

USAGE:
  npx scpl-updated-mcp-server [OPTIONS]

OPTIONS:
  --setup                    Auto-install for Claude Code (CLI)
  --setup-desktop            Auto-install for Claude Desktop (GUI app)
  --setup-codex              Auto-install for OpenAI Codex CLI (~/.codex)
  --setup-codex=<dir>        Auto-install for Codex forks with custom directory
  --help, -h                 Show this help message

You can combine multiple flags to set up multiple tools at once:
  npx scpl-updated-mcp-server --setup --setup-desktop --setup-codex

EXAMPLES:
  # Claude Code (CLI) only
  npx scpl-updated-mcp-server --setup

  # Claude Desktop (GUI app) only
  npx scpl-updated-mcp-server --setup-desktop

  # Codex only
  npx scpl-updated-mcp-server --setup-codex

  # Custom Codex directory (just-every/code, etc.)
  npx scpl-updated-mcp-server --setup-codex=$CODE_HOME

  # All Claude + Codex tools at once
  npx scpl-updated-mcp-server --setup --setup-desktop --setup-codex

After setup, restart your AI coding tool and ask:
  "Create a shortcut that starts a timer and plays a sound"
`);
  process.exit(0);
}

// ============================================================================
// SETUP FUNCTIONS
// ============================================================================

function setupClaudeCode() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🚀 Setting up ScPL Shortcuts for Claude Code...");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const claudeJsonPath = join(homedir(), ".claude.json");
  const pluginsDir = join(homedir(), ".claude", "plugins", "local", "scpl-shortcuts");
  const installedPluginsPath = join(homedir(), ".claude", "plugins", "installed_plugins.json");

  // Step 1: Add MCP server to ~/.claude.json
  console.log("📝 Step 1: Adding MCP server to ~/.claude.json...");
  try {
    let claudeConfig = {};
    if (existsSync(claudeJsonPath)) {
      claudeConfig = JSON.parse(readFileSync(claudeJsonPath, "utf-8"));
    }

    if (!claudeConfig.mcpServers) {
      claudeConfig.mcpServers = {};
    }

    if (claudeConfig.mcpServers["scpl-shortcuts"]) {
      console.log("   ⏭️  Already configured, skipping...\n");
    } else {
      claudeConfig.mcpServers["scpl-shortcuts"] = {
        type: "stdio",
        command: "npx",
        args: ["-y", "scpl-updated-mcp-server"]
      };
      writeFileSync(claudeJsonPath, JSON.stringify(claudeConfig, null, 2));
      console.log("   ✅ MCP server added!\n");
    }
  } catch (error) {
    console.error("   ❌ Failed:", error.message, "\n");
  }

  // Step 2: Create plugin directory and files
  console.log("📁 Step 2: Installing plugin files...");
  try {
    mkdirSync(join(pluginsDir, "skills"), { recursive: true });

    const pluginJson = {
      name: "scpl-shortcuts",
      version: "1.0.0",
      description: "Create macOS Shortcuts using natural language and ScPL",
      skills: [
        {
          name: "create-shortcut",
          description: "Create a macOS Shortcut using natural language.",
          path: "skills/create-shortcut.md"
        }
      ]
    };
    writeFileSync(join(pluginsDir, "plugin.json"), JSON.stringify(pluginJson, null, 2));

    // Read comprehensive ScPL reference
    const refPath = join(__dirname, "SCPL_REFERENCE.md");
    let skillContent = "";
    if (existsSync(refPath)) {
      const reference = readFileSync(refPath, "utf-8");
      skillContent = `---
description: Create macOS Shortcuts using natural language with ScPL.
tags: [shortcuts, automation, macos, scpl, apple-intelligence]
---

# ScPL Shortcuts Skill

You have access to the ScPL MCP server with **493 actions**.

## Available Tools
- \`create_shortcut\` - Convert ScPL code to .shortcut file
- \`validate_scpl\` - Check syntax without creating file
- \`list_actions\` - Search available actions by category/keyword

${reference}
`;
    } else {
      // Fallback minimal skill if reference not found
      skillContent = `---
description: Create macOS Shortcuts using natural language.
tags: [shortcuts, automation, macos, scpl]
---

# Create Shortcut Skill

You have access to the ScPL MCP server with 493 actions.
Tools: create_shortcut, validate_scpl, list_actions

Basic syntax: \`ActionName "arg"\` or \`ActionName param=value\`
Variables: \`v:Named\`, \`mv:Magic\`, \`s:Special\`
Flow: \`If\`/\`End If\`, \`Repeat\`/\`End Repeat\`
`;
    }
    writeFileSync(join(pluginsDir, "skills", "create-shortcut.md"), skillContent);
    console.log("   ✅ Plugin files created!\n");
  } catch (error) {
    console.error("   ❌ Failed:", error.message, "\n");
  }

  // Step 3: Register plugin
  console.log("📋 Step 3: Registering plugin...");
  try {
    let installedPlugins = { version: 2, plugins: {} };
    if (existsSync(installedPluginsPath)) {
      installedPlugins = JSON.parse(readFileSync(installedPluginsPath, "utf-8"));
    }

    if (installedPlugins.plugins["scpl-shortcuts@local"]) {
      console.log("   ⏭️  Already registered, skipping...\n");
    } else {
      installedPlugins.plugins["scpl-shortcuts@local"] = [
        {
          scope: "user",
          installPath: pluginsDir,
          version: "1.0.0",
          installedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          isLocal: true
        }
      ];
      writeFileSync(installedPluginsPath, JSON.stringify(installedPlugins, null, 2));
      console.log("   ✅ Plugin registered!\n");
    }
  } catch (error) {
    console.error("   ❌ Failed:", error.message, "\n");
  }

  console.log("✅ Claude Code setup complete!\n");
}

function setupClaudeDesktop() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🚀 Setting up ScPL Shortcuts for Claude Desktop...");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Determine config path based on OS
  let configPath;
  const platform = process.platform;
  if (platform === "darwin") {
    configPath = join(homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  } else if (platform === "win32") {
    configPath = join(process.env.APPDATA || "", "Claude", "claude_desktop_config.json");
  } else {
    configPath = join(homedir(), ".config", "Claude", "claude_desktop_config.json");
  }

  console.log(`📝 Adding MCP server to ${configPath}...`);
  try {
    // Ensure directory exists
    mkdirSync(dirname(configPath), { recursive: true });

    let config = {};
    if (existsSync(configPath)) {
      config = JSON.parse(readFileSync(configPath, "utf-8"));
    }

    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    if (config.mcpServers["scpl-shortcuts"]) {
      console.log("   ⏭️  Already configured, skipping...\n");
    } else {
      config.mcpServers["scpl-shortcuts"] = {
        command: "npx",
        args: ["-y", "scpl-updated-mcp-server"]
      };
      writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log("   ✅ MCP server added!\n");
    }
  } catch (error) {
    console.error("   ❌ Failed:", error.message, "\n");
  }

  console.log("✅ Claude Desktop setup complete!\n");
  console.log("ℹ️  Note: Claude Desktop doesn't have plugins/skills.\n");
  console.log("   The MCP tools (create_shortcut, validate_scpl, list_actions)");
  console.log("   will be available, but Claude won't have the full ScPL reference");
  console.log("   loaded as context. Consider using Claude Code for best results.\n");
}

function setupCodex(codexDir) {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`🚀 Setting up ScPL Shortcuts for Codex at ${codexDir}...`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  const codexConfigPath = join(codexDir, "config.toml");
  const skillDir = join(codexDir, "skills", "scpl-shortcuts");

  // Step 1: Add MCP server to config.toml
  console.log(`📝 Step 1: Adding MCP server to ${codexConfigPath}...`);
  try {
    let config = "";
    if (existsSync(codexConfigPath)) {
      config = readFileSync(codexConfigPath, "utf-8");
    }

    if (config.includes('[mcp_servers."scpl-shortcuts"]') || config.includes('[mcp_servers.scpl-shortcuts]')) {
      console.log("   ⏭️  Already configured, skipping...\n");
    } else {
      const tomlBlock = `
[mcp_servers.scpl-shortcuts]
command = "npx"
args = ["-y", "scpl-updated-mcp-server"]
startup_timeout_sec = 60.0
`;
      writeFileSync(codexConfigPath, config + tomlBlock);
      console.log("   ✅ MCP server added!\n");
    }
  } catch (error) {
    console.error("   ❌ Failed:", error.message, "\n");
  }

  // Step 2: Install skill
  console.log(`📁 Step 2: Installing skill to ${skillDir}...`);
  try {
    mkdirSync(skillDir, { recursive: true });

    // Read comprehensive ScPL reference
    const refPath = join(__dirname, "SCPL_REFERENCE.md");
    let skillContent = "";
    if (existsSync(refPath)) {
      const reference = readFileSync(refPath, "utf-8");
      skillContent = `---
name: scpl-shortcuts
description: Create macOS Shortcuts using natural language with ScPL.
metadata:
  short-description: Create macOS Shortcuts with AI
---

# ScPL Shortcuts Skill

You have access to the ScPL MCP server with **493 actions**.

## Available Tools
- \`create_shortcut\` - Convert ScPL code to .shortcut file
- \`validate_scpl\` - Check syntax without creating file
- \`list_actions\` - Search available actions by category/keyword

${reference}
`;
    } else {
      // Fallback minimal skill
      skillContent = `---
name: scpl-shortcuts
description: Create macOS Shortcuts using natural language.
metadata:
  short-description: Create macOS Shortcuts with AI
---

# ScPL Shortcuts Skill

493 actions available. Tools: create_shortcut, validate_scpl, list_actions

Basic syntax: \`ActionName "arg"\` or \`ActionName param=value\`
Variables: \`v:Named\`, \`mv:Magic\`, \`s:Special\`
Flow: \`If\`/\`End If\`, \`Repeat\`/\`End Repeat\`
`;
    }
    writeFileSync(join(skillDir, "SKILL.md"), skillContent);
    console.log("   ✅ Skill installed!\n");
  } catch (error) {
    console.error("   ❌ Failed:", error.message, "\n");
  }

  console.log(`✅ Codex setup complete for ${codexDir}!\n`);
}

// ============================================================================
// PROCESS SETUP FLAGS
// ============================================================================

let didSetup = false;

// Claude Code setup
if (process.argv.includes("--setup")) {
  setupClaudeCode();
  didSetup = true;
}

// Claude Desktop setup
if (process.argv.includes("--setup-desktop")) {
  setupClaudeDesktop();
  didSetup = true;
}

// Codex setups (can have multiple --setup-codex and --setup-codex=<dir>)
const codexArgs = process.argv.filter(arg => arg.startsWith("--setup-codex"));
for (const codexArg of codexArgs) {
  let codexDir = join(homedir(), ".codex"); // default

  if (codexArg.includes("=")) {
    let customDir = codexArg.split("=")[1];
    if (customDir.startsWith("~")) {
      customDir = customDir.replace("~", homedir());
    }
    codexDir = customDir;
  }

  setupCodex(codexDir);
  didSetup = true;
}

// Exit after setup(s)
if (didSetup) {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🎉 All setups complete! Restart your AI tool(s) to use shortcuts.");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log('\nUsage: Just ask to create a shortcut!');
  console.log('  Example: "Create a shortcut that starts a timer"\n');
  process.exit(0);
}

// ============================================================================
// MCP SERVER (runs if no setup flags)
// ============================================================================

const server = new Server(
  {
    name: "scpl-updated-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_shortcut",
        description: "Create a macOS Shortcut from ScPL code. Returns the path to the generated .shortcut file.",
        inputSchema: {
          type: "object",
          properties: {
            scpl_code: {
              type: "string",
              description: "The ScPL code to convert to a shortcut",
            },
            output_name: {
              type: "string",
              description: "Name for the output .shortcut file (without extension)",
            },
            output_dir: {
              type: "string",
              description: "Optional output directory (defaults to ~/Documents)",
            },
          },
          required: ["scpl_code", "output_name"],
        },
      },
      {
        name: "validate_scpl",
        description: "Validate ScPL code syntax without creating a file",
        inputSchema: {
          type: "object",
          properties: {
            scpl_code: {
              type: "string",
              description: "The ScPL code to validate",
            },
          },
          required: ["scpl_code"],
        },
      },
      {
        name: "list_actions",
        description: "List available ScPL actions (493 total). Filter by category or search term.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Optional category filter (e.g., 'Scripting', 'Files', 'AI')",
            },
            search: {
              type: "string",
              description: "Optional search term to filter actions",
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "create_shortcut") {
      const { scpl_code, output_name, output_dir } = args;

      const shortcutBuffer = convert(scpl_code, {
        makePlist: true,
        makeShortcut: true,
      });

      const dir = output_dir || join(homedir(), "Documents");
      const outputPath = join(dir, `${output_name}.shortcut`);

      writeFileSync(outputPath, shortcutBuffer);

      return {
        content: [
          {
            type: "text",
            text: `✅ Shortcut created!\n\nPath: ${outputPath}\n\nTo install: Drag onto Shortcut Source Helper from RoutineHub`,
          },
        ],
      };
    }

    if (name === "validate_scpl") {
      const { scpl_code } = args;

      try {
        convert(scpl_code, { makePlist: false, makeShortcut: false });
        return { content: [{ type: "text", text: "✅ ScPL code is valid!" }] };
      } catch (error) {
        return { content: [{ type: "text", text: `❌ Invalid: ${error.message}` }], isError: true };
      }
    }

    if (name === "list_actions") {
      const { category, search } = args || {};

      const topActions = {
        "is.workflow.actions.askllm": { Name: "Ask LLM", Category: "AI" },
        "is.workflow.actions.askchatgpt": { Name: "Ask ChatGPT", Category: "AI" },
        "com.anthropic.claudeforipad.AskClaudeIntentExtension": { Name: "Ask Claude", Category: "AI" },
        "com.apple.clock.StartStopwatchIntent": { Name: "Start Stopwatch", Category: "Clock" },
        "com.apple.clock.StopStopwatchIntent": { Name: "Stop Stopwatch", Category: "Clock" },
        "com.apple.clock.CreateAlarmIntent": { Name: "Create Alarm", Category: "Clock" },
        "com.apple.VoiceMemos.CreateRecordingIntent": { Name: "Create Recording", Category: "Voice Memos" },
        "com.apple.VoiceMemos.PlayRecordingIntent": { Name: "Play Recording", Category: "Voice Memos" },
        "is.workflow.actions.appearance": { Name: "Set Dark/Light Mode", Category: "System" },
        "is.workflow.actions.takescreenshot": { Name: "Take Screenshot", Category: "System" },
        "is.workflow.actions.lockscreen": { Name: "Lock Screen", Category: "System" },
        "is.workflow.actions.runshellscript": { Name: "Run Shell Script", Category: "Scripting" },
        "is.workflow.actions.runapplescript": { Name: "Run AppleScript", Category: "Scripting" },
        "is.workflow.actions.runjavascriptforautomation": { Name: "Run JavaScript", Category: "Scripting" },
        "is.workflow.actions.file.getfile": { Name: "Get File", Category: "Files" },
        "is.workflow.actions.file.savefile": { Name: "Save File", Category: "Files" },
        "is.workflow.actions.showresult": { Name: "Show Result", Category: "Text" },
        "is.workflow.actions.alert": { Name: "Show Alert", Category: "Text" },
        "is.workflow.actions.setvariable": { Name: "Set Variable", Category: "Variables" },
        "is.workflow.actions.getclipboard": { Name: "Get Clipboard", Category: "Clipboard" },
        "is.workflow.actions.setclipboard": { Name: "Set Clipboard", Category: "Clipboard" },
      };

      let filtered = Object.entries(topActions);

      if (category) {
        filtered = filtered.filter(([_, a]) => a.Category?.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(([id, a]) =>
          id.toLowerCase().includes(s) || a.Name?.toLowerCase().includes(s)
        );
      }

      const results = filtered.map(([id, a]) => `• **${a.Name}** - \`${id}\``).join("\n");
      return { content: [{ type: "text", text: `${filtered.length} actions:\n\n${results}\n\n(493 total available)` }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources: [{ uri: "scpl://examples", name: "ScPL Examples", mimeType: "text/markdown" }] };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "scpl://examples") {
    return { contents: [{ uri: "scpl://examples", mimeType: "text/markdown", text: "# Examples\n\n```scpl\nShowResult \"Hello!\"\n```" }] };
  }
  throw new Error("Unknown resource");
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ScPL Updated MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
