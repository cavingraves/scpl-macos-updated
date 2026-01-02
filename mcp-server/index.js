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
const { parse, allActions } = pkg;
import { writeFileSync, readFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to get human-readable parameter type names
function getParamTypeName(paramClass) {
  const typeMap = {
    "WFTextInputParameter": "Text",
    "WFNumberFieldParameter": "Number",
    "WFSwitchParameter": "Boolean (true/false)",
    "WFEnumerationParameter": "Enum (pick from options)",
    "WFDynamicEnumerationParameter": "Dynamic Enum",
    "WFVariablePickerParameter": "Variable",
    "WFVariableFieldParameter": "Variable",
    "WFDictionaryParameter": "Dictionary",
    "WFContentArrayParameter": "Array/List",
    "WFArrayParameter": "Array/List",
    "WFFilterParameter": "Filter",
    "WFDateFieldParameter": "Date",
    "WFTimeOffsetParameter": "Time Offset",
    "WFStepperParameter": "Stepper (Number)",
    "WFSliderParameter": "Slider (Number)",
    "WFLocationFieldParameter": "Location",
    "WFEmailAddressFieldParameter": "Email Address",
    "WFPhoneNumberFieldParameter": "Phone Number",
    "WFContactFieldParameter": "Contact",
    "WFStorageServicePickerParameter": "Storage Service",
    "WFAppPickerParameter": "App",
    "WFWorkflowPickerParameter": "Shortcut",
    "WFCalendarPickerParameter": "Calendar",
    "WFIntentAppPickerParameter": "App (Intent)",
    "WFExpandingParameter": "Expandable Section",
  };
  return typeMap[paramClass] || paramClass.replace(/^WF|Parameter$/g, "");
}

// Read version from package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf-8"));
const VERSION = packageJson.version;

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

You have access to the ScPL MCP server with **495 actions**.

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

You have access to the ScPL MCP server with 495 actions.
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

  // Copy skill ZIP to a user-accessible location
  const skillZipSrc = join(__dirname, "claude-desktop-skill", "scpl-shortcuts.zip");
  if (existsSync(skillZipSrc)) {
    // Try Downloads, then Desktop
    const destinations = [
      join(homedir(), "Downloads", "scpl-shortcuts.zip"),
      join(homedir(), "Desktop", "scpl-shortcuts.zip")
    ];
    let copied = false;
    for (const dest of destinations) {
      try {
        const zipContent = readFileSync(skillZipSrc);
        writeFileSync(dest, zipContent);
        const shortPath = dest.replace(homedir(), "~");
        console.log(`📦 Skill package copied to ${shortPath}\n`);
        console.log("   To add the skill to Claude Desktop:");
        console.log("   1. Open Claude Desktop → Settings → Skills");
        console.log("   2. Click '+ Add' and import the ZIP file");
        console.log("   3. Enable the skill\n");
        copied = true;
        break;
      } catch (e) {
        continue;
      }
    }
    if (!copied) {
      console.log("ℹ️  Skill ZIP available in npm package at:");
      console.log("   node_modules/scpl-updated-mcp-server/claude-desktop-skill/scpl-shortcuts.zip\n");
    }
  } else {
    console.log("ℹ️  For the full ScPL reference skill, download from:");
    console.log("   https://github.com/cavingraves/scpl-macos-updated/tree/master/mcp-server/claude-desktop-skill\n");
  }
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
description: Create macOS Shortcuts using natural language with ScPL. Shortcuts are auto-signed and ready to use.
metadata:
  short-description: Create macOS Shortcuts with AI
---

# ScPL Shortcuts Skill

You have access to the ScPL MCP server with **495 actions**. **Shortcuts are auto-signed by default!**

## Available Tools
- \`create_shortcut\` - Convert ScPL code to signed .shortcut file (auto-signs by default)
- \`validate_scpl\` - Check syntax without creating file
- \`list_actions\` - Search available actions by category/keyword

## After Creating
Shortcuts are auto-signed. To install:
- Double-click the file, or
- Run: \`open ~/Documents/YourShortcut.shortcut\`

${reference}
`;
    } else {
      // Fallback minimal skill
      skillContent = `---
name: scpl-shortcuts
description: Create macOS Shortcuts using natural language. Shortcuts are auto-signed and ready to use.
metadata:
  short-description: Create macOS Shortcuts with AI
---

# ScPL Shortcuts Skill

495 actions available. **Shortcuts are auto-signed by default!**

Tools: create_shortcut (auto-signs), validate_scpl, list_actions

Basic syntax: \`ActionName "arg"\` or \`ActionName param=value\`
Variables: \`v:Named\`, \`mv:Magic\`, \`s:Special\`
Flow: \`If\`/\`End If\`, \`Repeat\`/\`End Repeat\`

After creating: Double-click to install or \`open ~/Documents/YourShortcut.shortcut\`
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
    version: VERSION,
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
        description: "Create a macOS Shortcut from ScPL code. Returns the path to the generated .shortcut file. Set sign=true to auto-sign for immediate use (requires macOS 12+).",
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
            sign: {
              type: "boolean",
              description: "Auto-sign the shortcut using macOS shortcuts CLI (default: true). Signed shortcuts can be opened directly.",
              default: true,
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
        description: "List available ScPL actions. Filter by category or search term.",
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
      {
        name: "get_action_details",
        description: "Get detailed parameter documentation for a specific action. Returns all parameters with their types, default values, and valid options.",
        inputSchema: {
          type: "object",
          properties: {
            action_name: {
              type: "string",
              description: "Action name (e.g., 'askforinput', 'formatdate', 'choosefromlist'). Case-insensitive.",
            },
          },
          required: ["action_name"],
        },
      },
      {
        name: "get_syntax_reference",
        description: "Get ScPL syntax documentation. Covers variables, flow control, field types, and common patterns.",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "Optional topic filter: 'variables', 'flow', 'fields', 'conditions', 'menus', 'all'. Defaults to 'all'.",
            },
          },
        },
      },
      {
        name: "get_examples",
        description: "Get ScPL code examples for common patterns. Includes menus, conditionals, file operations, APIs, and more.",
        inputSchema: {
          type: "object",
          properties: {
            pattern: {
              type: "string",
              description: "Optional pattern filter: 'menu', 'if', 'repeat', 'file', 'api', 'variable', 'notification', 'input', 'all'. Defaults to 'all'.",
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
      const { scpl_code, output_name, output_dir, sign = true } = args || {};

      if (!scpl_code || !output_name) {
        return { content: [{ type: "text", text: "Error: scpl_code and output_name are required" }], isError: true };
      }

      const shortcutBuffer = parse(scpl_code, {
        makePlist: true,
      });

      let dir = output_dir || join(homedir(), "Documents");
      // Expand ~ to home directory
      if (dir.startsWith("~")) {
        dir = dir.replace("~", homedir());
      }
      // Ensure directory exists
      mkdirSync(dir, { recursive: true });

      const outputPath = join(dir, `${output_name}.shortcut`);

      // If signing, write to temp file first, then sign to final location
      if (sign) {
        const unsignedPath = join(dir, `${output_name}_unsigned.shortcut`);
        writeFileSync(unsignedPath, shortcutBuffer);

        try {
          // Sign using macOS shortcuts CLI (available since macOS 12 Monterey)
          execSync(`shortcuts sign --mode anyone --input "${unsignedPath}" --output "${outputPath}"`, {
            stdio: 'pipe',
            timeout: 30000,
          });
          // Remove unsigned temp file
          unlinkSync(unsignedPath);

          return {
            content: [
              {
                type: "text",
                text: `✅ Shortcut created and signed!\n\nPath: ${outputPath}\n\nTo install: Double-click the file or run:\n  open "${outputPath}"`,
              },
            ],
          };
        } catch (signError) {
          // If signing fails, keep unsigned version and inform user
          writeFileSync(outputPath, shortcutBuffer);
          try { unlinkSync(unsignedPath); } catch {}

          return {
            content: [
              {
                type: "text",
                text: `✅ Shortcut created (unsigned - signing failed)\n\nPath: ${outputPath}\n\nSigning error: ${signError.message}\n\nTo sign manually:\n  shortcuts sign --mode anyone --input "${outputPath}" --output "${outputPath.replace('.shortcut', '_signed.shortcut')}"`,
              },
            ],
          };
        }
      } else {
        // No signing requested
        writeFileSync(outputPath, shortcutBuffer);

        return {
          content: [
            {
              type: "text",
              text: `✅ Shortcut created (unsigned)!\n\nPath: ${outputPath}\n\nTo sign and install:\n  shortcuts sign --mode anyone --input "${outputPath}" --output "${outputPath.replace('.shortcut', '_signed.shortcut')}"`,
            },
          ],
        };
      }
    }

    if (name === "validate_scpl") {
      const { scpl_code } = args || {};

      if (!scpl_code) {
        return { content: [{ type: "text", text: "Error: scpl_code is required" }], isError: true };
      }

      try {
        parse(scpl_code, {});
        return { content: [{ type: "text", text: "✅ ScPL code is valid!" }] };
      } catch (error) {
        return { content: [{ type: "text", text: `❌ Invalid: ${error.message}` }], isError: true };
      }
    }

    if (name === "list_actions") {
      const { category, search } = args || {};

      let filtered = allActions;

      if (category) {
        filtered = filtered.filter(a =>
          a._data?.Category?.toLowerCase() === category.toLowerCase() ||
          a._data?.Subcategory?.toLowerCase() === category.toLowerCase()
        );
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(a =>
          a.name?.toLowerCase().includes(s) ||
          a.shortName?.toLowerCase().includes(s) ||
          a.id?.toLowerCase().includes(s) ||
          a._data?.ActionKeywords?.some(k => k.toLowerCase().includes(s))
        );
      }

      // Limit results to prevent overwhelming output
      const limit = 50;
      const total = filtered.length;
      const limited = filtered.slice(0, limit);

      const results = limited.map(a =>
        `• **${a.name}** (\`${a.shortName}\`) - ${a._data?.Category || 'General'}`
      ).join("\n");

      let response = `${total} actions found`;
      if (total > limit) {
        response += ` (showing first ${limit})`;
      }
      response += `:\n\n${results}\n\n(${allActions.length} total available)`;

      return { content: [{ type: "text", text: response }] };
    }

    if (name === "get_action_details") {
      const { action_name } = args || {};
      if (!action_name) {
        return { content: [{ type: "text", text: "Error: action_name is required" }], isError: true };
      }

      const searchName = action_name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const action = allActions.find(a =>
        a.shortName === searchName ||
        a.name?.toLowerCase().replace(/[^a-z0-9]/g, "") === searchName
      );

      if (!action) {
        // Find close matches
        const matches = allActions
          .filter(a => a.shortName.includes(searchName) || searchName.includes(a.shortName))
          .slice(0, 5)
          .map(a => `\`${a.shortName}\``)
          .join(", ");

        return {
          content: [{
            type: "text",
            text: `❌ Action "${action_name}" not found.\n\n${matches ? `Did you mean: ${matches}` : "Use list_actions to search for actions."}`
          }],
          isError: true
        };
      }

      // Build detailed parameter documentation
      let output = `# ${action.name}\n`;
      output += `**ScPL name:** \`${action.shortName}\`\n`;
      output += `**Internal ID:** \`${action.id}\`\n`;
      output += `**Category:** ${action._data?.Category || "General"}`;
      if (action._data?.Subcategory) output += ` > ${action._data.Subcategory}`;
      output += "\n\n";

      if (action._data?.Description?.DescriptionSummary) {
        output += `${action._data.Description.DescriptionSummary}\n\n`;
      }

      // Input info
      if (action._data?.Input) {
        const inp = action._data.Input;
        output += `**Input:** ${inp.Required ? "Required" : "Optional"}`;
        if (inp.Types?.length) {
          output += ` (${inp.Types.join(", ")})`;
        }
        output += "\n";
      }

      // Output info
      if (action._data?.Output) {
        const out = action._data.Output;
        output += `**Output:** ${out.OutputName || "Result"}`;
        if (out.Types?.length) {
          output += ` (${out.Types.join(", ")})`;
        }
        output += "\n";
      }

      output += "\n## Parameters\n\n";

      const params = action._data?.Parameters || [];
      if (params.length === 0) {
        output += "_No parameters_\n";
      } else {
        for (const param of params) {
          if (param.Hidden) continue; // Skip hidden params

          const paramName = (param.Label || param.Key || "unnamed").toLowerCase().replace(/[^a-z0-9]/g, "");
          const paramType = getParamTypeName(param.Class);

          output += `### \`${paramName}\`\n`;
          output += `- **Type:** ${paramType}\n`;
          output += `- **Label:** ${param.Label || param.Key}\n`;

          if (param.Description) {
            output += `- **Description:** ${param.Description}\n`;
          }
          if (param.DefaultValue !== undefined) {
            output += `- **Default:** \`${param.DefaultValue}\`\n`;
          }
          if (param.Items?.length) {
            output += `- **Options:** ${param.Items.map(i => `\`${i}\``).join(", ")}\n`;
          }
          if (param.Placeholder !== undefined) {
            output += `- **Placeholder:** ${param.Placeholder}\n`;
          }
          output += "\n";
        }
      }

      // Usage example
      output += "## Usage Example\n\n```scpl\n";
      const exampleParams = params
        .filter(p => !p.Hidden && p.Label)
        .slice(0, 3)
        .map(p => {
          const name = (p.Label || p.Key).toLowerCase().replace(/[^a-z0-9]/g, "");
          if (p.Items?.length) return `${name}="${p.Items[0]}"`;
          if (p.DefaultValue !== undefined) return `${name}=${JSON.stringify(p.DefaultValue)}`;
          if (p.Class === "WFSwitchParameter") return `${name}=true`;
          if (p.Class === "WFNumberFieldParameter") return `${name}=1`;
          return `${name}="value"`;
        });
      output += `${action.readableName}`;
      if (exampleParams.length) {
        output += ` ${exampleParams.join(" ")}`;
      }
      output += "\n```\n";

      return { content: [{ type: "text", text: output }] };
    }

    if (name === "get_syntax_reference") {
      const { topic } = args || {};
      const t = (topic || "all").toLowerCase();

      let output = "";

      const sections = {
        variables: `# Variables

## Three Variable Types

| Type | Syntax | How to Create | Usage |
|------|--------|---------------|-------|
| Named | \`v:MyVar\` | \`SetVariable v:MyVar\` | Persistent, explicit |
| Magic | \`mv:MyVar\` | \`Action -> mv:MyVar\` | Auto-created, lightweight |
| Special | \`s:Name\` | Built-in | System variables |

## Special Variables
- \`s:ShortcutInput\` - Input passed to shortcut
- \`s:Clipboard\` - Current clipboard
- \`s:CurrentDate\` - Current date/time
- \`s:AskWhenRun\` - Prompt user at runtime

## Setting Variables

\`\`\`scpl
# Named variable (creates SetVariable action)
Text "Hello" -> v:MyText

# Magic variable (just a reference, no action)
Text "Hello" -> mv:MyMagic

# Pre-assignment style
mv:Result = Text "Hello"
\`\`\`

## Using Variables in Text

\`\`\`scpl
Text "Value: \\(v:MyVariable)"
Text "Today: \\(s:CurrentDate)"
\`\`\`
`,

        flow: `# Flow Control

## If/Otherwise/End If

\`\`\`scpl
# Condition tests PREVIOUS action's output
Text "test"
If Equals "test"
    ShowResult "Match!"
Otherwise
    ShowResult "No match"
End If
\`\`\`

## Available Conditions
- \`Equals\` / \`Is\` - Exact match
- \`Contains\` - Substring match
- \`Begins With\` / \`Ends With\`
- \`Is Greater Than\` / \`Is Less Than\` (numbers)
- \`Has Any Value\` - Not empty

**Important:** Conditions test the PREVIOUS action's output. The value being tested is implicit.

## Repeat

\`\`\`scpl
Repeat 5
    ShowResult "Loop iteration"
End Repeat
\`\`\`

## Repeat with Each

\`\`\`scpl
List ["a", "b", "c"]
RepeatWithEach
    ShowResult "Item: \\(mv:RepeatItem)"
End RepeatWithEach
\`\`\`
`,

        menus: `# Menus (Choose From Menu)

## Basic Menu

\`\`\`scpl
ChooseFromMenu prompt="Pick one"
Case "Option A"
    ShowResult "You chose A"
Case "Option B"
    ShowResult "You chose B"
End Menu
\`\`\`

## Menu with Variable Capture

\`\`\`scpl
ChooseFromMenu prompt="Select action" -> mv:Choice
Case "Save"
    # Save logic here
Case "Delete"
    # Delete logic here
End Menu
\`\`\`

**Important:** Each \`Case\` must exactly match an option from the menu prompt.
`,

        conditions: `# Conditional Logic

## If Statement Behavior

The If action tests the **output of the previous action**. You don't specify what to test—it's implicit.

\`\`\`scpl
# This tests if the Text output equals "yes"
Text "yes"
If Equals "yes"
    ShowResult "Confirmed"
End If
\`\`\`

## Condition Operators

| Condition | Use Case |
|-----------|----------|
| \`Equals\` | Exact string/number match |
| \`Contains\` | Substring search |
| \`Begins With\` | Prefix check |
| \`Ends With\` | Suffix check |
| \`Is Greater Than\` | Number comparison |
| \`Is Less Than\` | Number comparison |
| \`Has Any Value\` | Not empty/null |

## File/Count Existence Check Pattern

\`\`\`scpl
GetFile path="~/file.txt" errorifnotfound=false
Count
If "Is Greater Than" 0
    # File exists
Otherwise
    # File doesn't exist
End If
\`\`\`
`,

        fields: `# Field Types

## Text
\`\`\`scpl
Text "Single line"
Text
| Multiline text
| Second line
\`\`\`

## Numbers
\`\`\`scpl
Number 42
Number 3.14
Number -100
\`\`\`

## Booleans
\`\`\`scpl
SetWifi true
SetBluetooth false
\`\`\`

## Lists
\`\`\`scpl
List ["item1", "item2", "item3"]
# or
List
| Item 1
| Item 2
\`\`\`

## Dictionaries
\`\`\`scpl
Dictionary {
    key: "value"
    number: 42
    nested: {inner: "data"}
}
\`\`\`

## Comments
\`\`\`scpl
# This is a comment
// Also a comment
-- Also works
\`\`\`
`
      };

      if (t === "all") {
        output = Object.values(sections).join("\n---\n\n");
      } else if (sections[t]) {
        output = sections[t];
      } else {
        output = `Unknown topic: "${topic}". Available: variables, flow, menus, conditions, fields, all`;
      }

      return { content: [{ type: "text", text: output }] };
    }

    if (name === "get_examples") {
      const { pattern } = args || {};
      const p = (pattern || "all").toLowerCase();

      const examples = {
        menu: `# Menu Example

\`\`\`scpl
ChooseFromMenu prompt="What kind of entry?"
Case "Quick Note"
    AskForInput question="Enter note:" -> mv:Note
    Text "\\(mv:Note)" -> mv:Content
Case "Full Entry"
    AskForInput question="How are you feeling?" -> mv:Mood
    AskForInput question="What did you accomplish?" -> mv:Accomplishments
    Text "Mood: \\(mv:Mood)\\nAccomplishments: \\(mv:Accomplishments)" -> mv:Content
Case "Review"
    ShowResult "Reviewing..."
End Menu
\`\`\`
`,

        if: `# If/Else Examples

## Simple Condition
\`\`\`scpl
Text "hello"
If Equals "hello"
    ShowResult "Greeting detected"
Otherwise
    ShowResult "Not a greeting"
End If
\`\`\`

## Number Comparison
\`\`\`scpl
Number 42
If "Is Greater Than" 10
    ShowResult "Big number"
End If
\`\`\`

## Check if File Exists
\`\`\`scpl
GetFile path="~/Documents/notes.txt" errorifnotfound=false
Count
If "Is Greater Than" 0
    ShowResult "File exists"
Otherwise
    ShowResult "File not found"
End If
\`\`\`
`,

        repeat: `# Repeat Examples

## Simple Repeat
\`\`\`scpl
Repeat 3
    ShowNotification title="Reminder" body="Don't forget!"
End Repeat
\`\`\`

## Repeat with Each
\`\`\`scpl
List ["Alice", "Bob", "Charlie"]
RepeatWithEach
    Text "Hello, \\(mv:RepeatItem)!"
    ShowResult
End RepeatWithEach
\`\`\`
`,

        file: `# File Examples

## Read File
\`\`\`scpl
GetFile path="~/Documents/notes.txt"
GetText -> mv:Contents
ShowResult mv:Contents
\`\`\`

## Save File
\`\`\`scpl
Text "Hello, World!"
SaveFile destinationpath="~/Documents/hello.txt" overwrite=true
\`\`\`

## Save with Date in Filename
\`\`\`scpl
Date -> mv:Now
FormatDate formatstring="yyyy-MM-dd" -> mv:DateStr
Text "Journal entry for \\(mv:DateStr)"
SaveFile destinationpath="~/Documents/journal_\\(mv:DateStr).txt"
\`\`\`
`,

        api: `# API/HTTP Examples

## GET Request
\`\`\`scpl
URL "https://api.example.com/data"
GetContentsOfURL -> mv:Response
GetDictionaryValue key="result"
ShowResult
\`\`\`

## POST with JSON
\`\`\`scpl
URL "https://api.example.com/submit"
GetContentsOfURL method="POST" headers={
    "Content-Type": "application/json"
} body={
    "name": "Test"
    "value": 123
}
\`\`\`
`,

        variable: `# Variable Examples

## Named Variables
\`\`\`scpl
Text "Hello" -> v:Greeting
# ... later ...
GetVariable v:Greeting
ShowResult
\`\`\`

## Magic Variables (lightweight)
\`\`\`scpl
Text "Hello" -> mv:Greeting
Text "\\(mv:Greeting), World!"
ShowResult
\`\`\`

## Building Up a Variable
\`\`\`scpl
Text "" -> v:List
Repeat 3
    AskForInput question="Enter item:" -> mv:Item
    Text "\\(v:List)\\n• \\(mv:Item)" -> v:List
End Repeat
ShowResult v:List
\`\`\`
`,

        notification: `# Notification Examples

## Simple Notification
\`\`\`scpl
ShowNotification title="Done!" body="Task completed successfully"
\`\`\`

## Notification with Variable
\`\`\`scpl
AskForInput question="Enter task:" -> mv:Task
ShowNotification title="Task Added" body="\\(mv:Task) has been added to your list"
\`\`\`
`,

        input: `# User Input Examples

## Text Input
\`\`\`scpl
AskForInput question="What's your name?" -> mv:Name
Text "Hello, \\(mv:Name)!"
ShowResult
\`\`\`

## Number Input
\`\`\`scpl
AskForInput question="Enter a number:" inputtype="Number" -> mv:Num
Calculate "×" 2
ShowResult "Double: \\(mv:CalculationResult)"
\`\`\`

## Choose from List
\`\`\`scpl
List ["Red", "Green", "Blue"]
ChooseFromList prompt="Pick a color" -> mv:Color
ShowResult "You chose: \\(mv:Color)"
\`\`\`
`
      };

      let output = "";

      if (p === "all") {
        output = "# ScPL Code Examples\n\n" + Object.values(examples).join("\n---\n\n");
      } else if (examples[p]) {
        output = examples[p];
      } else {
        output = `Unknown pattern: "${pattern}". Available: menu, if, repeat, file, api, variable, notification, input, all`;
      }

      return { content: [{ type: "text", text: output }] };
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
