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
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// AUTO-SETUP: Run with --setup to install everything automatically
// ============================================================================
if (process.argv.includes("--setup")) {
  console.log("🚀 Setting up ScPL Shortcuts for Claude Code...\n");

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

    claudeConfig.mcpServers["scpl-shortcuts"] = {
      type: "stdio",
      command: "npx",
      args: ["-y", "scpl-updated-mcp-server"]
    };

    writeFileSync(claudeJsonPath, JSON.stringify(claudeConfig, null, 2));
    console.log("   ✅ MCP server added!\n");
  } catch (error) {
    console.error("   ❌ Failed to update ~/.claude.json:", error.message);
    console.log("   You can manually add this to ~/.claude.json under mcpServers:");
    console.log(`   "scpl-shortcuts": { "type": "stdio", "command": "npx", "args": ["-y", "scpl-updated-mcp-server"] }\n`);
  }

  // Step 2: Create plugin directory and files
  console.log("📁 Step 2: Installing plugin files...");
  try {
    mkdirSync(join(pluginsDir, "skills"), { recursive: true });

    // Write plugin.json
    const pluginJson = {
      name: "scpl-shortcuts",
      version: "1.0.0",
      description: "Create macOS Shortcuts using natural language and ScPL",
      skills: [
        {
          name: "create-shortcut",
          description: "Create a macOS Shortcut using natural language. Guides you through the process and generates a .shortcut file.",
          path: "skills/create-shortcut.md"
        }
      ]
    };
    writeFileSync(join(pluginsDir, "plugin.json"), JSON.stringify(pluginJson, null, 2));

    // Write skill file
    const skillContent = `---
description: Create macOS Shortcuts using natural language. Converts your request into ScPL code and generates a .shortcut file.
tags: [shortcuts, automation, macos, scpl]
---

# Create Shortcut Skill

You have access to the ScPL MCP server with 493 actions for creating macOS Shortcuts.

## Available Tools

1. **create_shortcut** - Generate a .shortcut file from ScPL code
2. **validate_scpl** - Check if ScPL code is valid before creating
3. **list_actions** - Search available actions by category or keyword

## Popular Action Categories

- **AI**: AskLLM (Apple Intelligence), AskChatGPT, AskClaude
- **Clock**: StartStopwatch, CreateAlarm, GetCurrentTime
- **Voice Memos**: CreateRecording, PlayRecording
- **System**: SetDarkMode, TakeScreenshot, LockScreen
- **Files**: GetFile, SaveFile, RenameFile, RevealInFinder
- **Scripting**: RunShellScript, RunAppleScript

## ScPL Syntax Examples

\`\`\`scpl
# Simple notification
ShowResult "Hello World!"

# Use Apple Intelligence
Text "Summarize this for me"
AskLLM model="Apple Intelligence" prompt="Make it shorter"
ShowResult

# Shell script
RunShellScript shell="/bin/zsh" script="echo Hello"
ShowResult

# Variables
Text "Hello"
SetVariable v:greeting
ShowResult v:greeting
\`\`\`

## Workflow

1. User describes what they want
2. Use \`list_actions\` if you need to find specific actions
3. Write ScPL code for the shortcut
4. Use \`validate_scpl\` to check syntax
5. Use \`create_shortcut\` to generate the .shortcut file
6. Tell user to drag the file onto Shortcut Source Helper to install
`;
    writeFileSync(join(pluginsDir, "skills", "create-shortcut.md"), skillContent);
    console.log("   ✅ Plugin files created!\n");
  } catch (error) {
    console.error("   ❌ Failed to create plugin files:", error.message, "\n");
  }

  // Step 3: Register plugin in installed_plugins.json
  console.log("📋 Step 3: Registering plugin...");
  try {
    let installedPlugins = { version: 2, plugins: {} };
    if (existsSync(installedPluginsPath)) {
      installedPlugins = JSON.parse(readFileSync(installedPluginsPath, "utf-8"));
    }

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
  } catch (error) {
    console.error("   ❌ Failed to register plugin:", error.message, "\n");
  }

  console.log("🎉 Setup complete! Restart Claude Code to use the shortcuts tools.\n");
  console.log("Usage: Just ask Claude to create a shortcut!");
  console.log('  Example: "Create a shortcut that starts a timer and plays a sound"\n');
  process.exit(0);
}

// ============================================================================
// MCP SERVER
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

      // Convert ScPL to shortcut
      const shortcutBuffer = convert(scpl_code, {
        makePlist: true,
        makeShortcut: true,
      });

      // Determine output path (default to ~/Documents)
      const dir = output_dir || join(homedir(), "Documents");
      const outputPath = join(dir, `${output_name}.shortcut`);

      // Write the file
      writeFileSync(outputPath, shortcutBuffer);

      return {
        content: [
          {
            type: "text",
            text: `✅ Shortcut created successfully!\n\nPath: ${outputPath}\n\n📝 To install:\n1. Download "Shortcut Source Helper" from RoutineHub\n2. Drag ${output_name}.shortcut onto it\n3. Follow the prompts to sign and import\n\nThe shortcut will be added to your Shortcuts app!`,
          },
        ],
      };
    }

    if (name === "validate_scpl") {
      const { scpl_code } = args;

      try {
        convert(scpl_code, {
          makePlist: false,
          makeShortcut: false,
        });

        return {
          content: [
            {
              type: "text",
              text: "✅ ScPL code is valid!",
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ ScPL validation failed:\n\n${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === "list_actions") {
      const { category, search } = args || {};

      // Embedded action list (top actions for quick reference)
      const topActions = {
        // AI
        "is.workflow.actions.askllm": { Name: "Ask LLM", Category: "AI" },
        "is.workflow.actions.askchatgpt": { Name: "Ask ChatGPT", Category: "AI" },
        "com.anthropic.claudeforipad.AskClaudeIntentExtension": { Name: "Ask Claude", Category: "AI" },
        // Clock
        "com.apple.clock.StartStopwatchIntent": { Name: "Start Stopwatch", Category: "Clock" },
        "com.apple.clock.StopStopwatchIntent": { Name: "Stop Stopwatch", Category: "Clock" },
        "com.apple.clock.CreateAlarmIntent": { Name: "Create Alarm", Category: "Clock" },
        // Voice Memos
        "com.apple.VoiceMemos.CreateRecordingIntent": { Name: "Create Recording", Category: "Voice Memos" },
        "com.apple.VoiceMemos.PlayRecordingIntent": { Name: "Play Recording", Category: "Voice Memos" },
        // System
        "is.workflow.actions.appearance": { Name: "Set Dark/Light Mode", Category: "System" },
        "is.workflow.actions.takescreenshot": { Name: "Take Screenshot", Category: "System" },
        "is.workflow.actions.lockscreen": { Name: "Lock Screen", Category: "System" },
        // Scripting
        "is.workflow.actions.runshellscript": { Name: "Run Shell Script", Category: "Scripting" },
        "is.workflow.actions.runapplescript": { Name: "Run AppleScript", Category: "Scripting" },
        "is.workflow.actions.runjavascriptforautomation": { Name: "Run JavaScript", Category: "Scripting" },
        // Files
        "is.workflow.actions.file.getfile": { Name: "Get File", Category: "Files" },
        "is.workflow.actions.file.savefile": { Name: "Save File", Category: "Files" },
        "is.workflow.actions.file.renamefile": { Name: "Rename File", Category: "Files" },
        "is.workflow.actions.file.revealfile": { Name: "Reveal in Finder", Category: "Files" },
        // Text
        "is.workflow.actions.gettext": { Name: "Get Text", Category: "Text" },
        "is.workflow.actions.showresult": { Name: "Show Result", Category: "Text" },
        "is.workflow.actions.alert": { Name: "Show Alert", Category: "Text" },
        // Variables
        "is.workflow.actions.setvariable": { Name: "Set Variable", Category: "Variables" },
        "is.workflow.actions.getvariable": { Name: "Get Variable", Category: "Variables" },
        // Clipboard
        "is.workflow.actions.getclipboard": { Name: "Get Clipboard", Category: "Clipboard" },
        "is.workflow.actions.setclipboard": { Name: "Set Clipboard", Category: "Clipboard" },
      };

      let filtered = Object.entries(topActions);

      if (category) {
        filtered = filtered.filter(
          ([_, action]) => action.Category?.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          ([id, action]) =>
            id.toLowerCase().includes(searchLower) ||
            action.Name?.toLowerCase().includes(searchLower) ||
            action.Category?.toLowerCase().includes(searchLower)
        );
      }

      const results = filtered
        .map(([id, action]) => `• **${action.Name}** - \`${id}\` (${action.Category})`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Found ${filtered.length} actions:\n\n${results}\n\n💡 This is a subset of 493 total actions. For the full list, see: https://github.com/cavingraves/scpl-macos-updated`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "scpl://examples",
        name: "ScPL Examples",
        description: "Example shortcuts written in ScPL",
        mimeType: "text/markdown",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "scpl://examples") {
    const examples = `# ScPL Examples

## Apple Intelligence
\`\`\`scpl
Text "Summarize this document"
AskLLM model="Apple Intelligence" prompt="Make it concise"
ShowResult
\`\`\`

## Timer with Sound
\`\`\`scpl
# Start a 5-minute timer
StartTimer minutes=5
ShowAlert title="Timer Started" message="5 minutes"
\`\`\`

## Shell Script
\`\`\`scpl
RunShellScript shell="/bin/zsh" script="echo Hello World"
ShowResult
\`\`\`

## Clipboard Workflow
\`\`\`scpl
GetClipboard
SetVariable v:text
AskChatGPT prompt="Improve this: \\(v:text)"
SetClipboard
ShowAlert title="Done" message="Improved text copied!"
\`\`\`
`;

    return {
      contents: [{ uri, mimeType: "text/markdown", text: examples }],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ScPL Updated MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
