#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { convert } from "scpl-macos-updated";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

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
              description: "Optional output directory (defaults to ~/Downloads)",
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
        description: "List available ScPL actions with descriptions. Filter by category or search term.",
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
      // Note: parse() returns a Buffer directly when makeShortcut: true
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
            text: `✅ Shortcut created successfully!\n\nPath: ${outputPath}\n\n📝 To install and sign it:\n\n1. Install Shortcut Source Helper from RoutineHub (if you haven't already)\n   - Also install: Shortcut Source Tool, Tinycut Builder\n2. Add Shortcut Source Helper to your Dock\n3. Drag and drop ${output_name}.shortcut onto it\n4. Follow the prompts to sign and import\n\nThe shortcut will be added to your Shortcuts app and ready to use!`,
          },
        ],
      };
    }

    if (name === "validate_scpl") {
      const { scpl_code } = args;

      try {
        // Just parse to validate, don't generate output
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

      // Read the actions data
      const actionsPath = join(
        process.cwd(),
        "..",
        "src",
        "Data",
        "OutActions.json"
      );
      const actions = JSON.parse(readFileSync(actionsPath, "utf-8"));

      let filtered = Object.entries(actions);

      // Filter by category
      if (category) {
        filtered = filtered.filter(
          ([_, action]) =>
            action.Category?.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          ([id, action]) =>
            id.toLowerCase().includes(searchLower) ||
            action.Name?.toLowerCase().includes(searchLower) ||
            action.Description?.DescriptionSummary?.toLowerCase().includes(
              searchLower
            )
        );
      }

      // Format the results
      const results = filtered
        .slice(0, 50) // Limit to 50 results
        .map(([id, action]) => {
          return `• **${action.Name || id}**\n  ID: \`${id}\`\n  ${
            action.Description?.DescriptionSummary || "No description"
          }\n  Category: ${action.Category || "Unknown"}`;
        })
        .join("\n\n");

      const total = filtered.length;
      const showing = Math.min(50, total);

      return {
        content: [
          {
            type: "text",
            text: `Found ${total} action${
              total !== 1 ? "s" : ""
            } (showing ${showing}):\n\n${results}`,
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

// Resource handlers (for documentation)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "scpl://actions/all",
        name: "All Available Actions",
        description: "Complete list of all 294 ScPL actions",
        mimeType: "text/markdown",
      },
      {
        uri: "scpl://actions/tahoe",
        name: "macOS Tahoe New Actions",
        description: "22 new actions added for macOS Tahoe",
        mimeType: "text/markdown",
      },
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

  if (uri === "scpl://actions/tahoe") {
    const content = readFileSync(
      join(process.cwd(), "..", "MACOS_TAHOE_UPDATES.md"),
      "utf-8"
    );
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  }

  if (uri === "scpl://examples") {
    const examples = `# ScPL Examples

## Apple Intelligence Example
\`\`\`scpl
# Ask Apple Intelligence to summarize text
Text "The quick brown fox jumps over the lazy dog. This is a sample text."
AskLLM model="Apple Intelligence" prompt="Summarize this in 5 words"
ShowResult
\`\`\`

## Shell Script Example
\`\`\`scpl
# Run a shell script and show the result
RunShellScript shell="/bin/zsh" script="sw_vers"
ShowResult "macOS Version"
\`\`\`

## File Operations Example
\`\`\`scpl
# Get files from Desktop and show count
GetFile path="~/Desktop" errorIfNotFound=false
Count
ShowResult "Files on Desktop"
\`\`\`

## ChatGPT Integration Example
\`\`\`scpl
# Ask ChatGPT a question
Text "What is the meaning of life?"
AskChatGPT
ShowResult
\`\`\`

## Combined Workflow Example
\`\`\`scpl
# Get clipboard, ask AI to improve it, copy back
GetClipboard
SetVariable v:originalText

AskLLM model="Apple Intelligence" prompt="Improve this text for clarity and grammar: \\(v:originalText)"
SetClipboard
ShowAlert title="Text Improved" message="The improved text has been copied to your clipboard"
\`\`\`
`;

    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: examples,
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ScPL Updated MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
