# ScPL MCP Server

Model Context Protocol server for creating macOS Shortcuts using ScPL (Shortcuts Programming Language).

## Features

- **Create Shortcuts**: Convert ScPL code to .shortcut files
- **Validate Syntax**: Check ScPL code without creating files
- **Discover Actions**: Browse 294 available actions with descriptions
- **Documentation**: Access action reference and examples

## ⚠️ Shortcut Signing & Installation

Generated .shortcut files need to be signed before macOS will allow you to run them. You have two options:

### Option 1: Shortcut Source Helper (Free - Recommended)

**Setup (one-time):**
1. Install required shortcuts from RoutineHub:
   - [Shortcut Source Helper](https://routinehub.co/shortcut/10060/)
   - [Shortcut Source Tool](https://routinehub.co/shortcut/5256/)
   - [Tinycut Builder](https://routinehub.co/shortcut/5217/)
2. Add **Shortcut Source Helper** to your Dock for easy access

**To install a generated shortcut:**
1. Drag and drop the `.shortcut` file onto Shortcut Source Helper in your Dock
2. Follow the prompts to sign and import
3. The shortcut will be added to your Shortcuts app and ready to use!

### Option 2: Apple Developer Account

If you have an Apple Developer account ($99/year), you can sign shortcuts with your developer certificate for distribution.

**Disclaimer**: We are not associated with Shortcut Source Tool/Helper or their creators. Use third-party tools at your own risk. Always review shortcuts before running them.

## Installation

### Step 1: Install the Package

```bash
npm install -g scpl-updated-mcp-server
```

### Step 2: Register with Your AI Assistant

Choose your platform below:

#### Claude Code

**Option 1: CLI command** (may not always work):

```bash
claude mcp add scpl-shortcuts npx scpl-updated-mcp-server
```

**Option 2: Manual config** (recommended):

Add to `~/.claude.json` for global configuration:

```json
{
  "mcpServers": {
    "scpl-shortcuts": {
      "command": "npx",
      "args": ["scpl-updated-mcp-server"]
    }
  }
}
```

Or for project-specific config, add to `.claude/mcp.json` in your project directory.

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "scpl-shortcuts": {
      "command": "npx",
      "args": ["scpl-updated-mcp-server"]
    }
  }
}
```

#### Codex / Code (and forks)

Add to `~/.code/config.toml` (or `~/.codex/config.toml`):

```toml
[mcp_servers.scpl-shortcuts]
command = "npx"
args = ["scpl-updated-mcp-server"]
startup_timeout_sec = 60.0
tool_timeout_sec = 120
```

**For local development:**

```toml
[mcp_servers.scpl-shortcuts]
command = "node"
args = ["/path/to/scpl-updated/mcp-server/index.js"]
cwd = "/path/to/scpl-updated/mcp-server"
startup_timeout_sec = 60.0
tool_timeout_sec = 120
```

## Tools

### `create_shortcut`

Create a macOS Shortcut from ScPL code.

**Parameters:**
- `scpl_code` (required): The ScPL code to convert
- `output_name` (required): Name for the .shortcut file
- `output_dir` (optional): Output directory (defaults to ~/Documents)

**Example:**
```json
{
  "scpl_code": "Text \"Hello World\"\nShowResult",
  "output_name": "HelloWorld",
  "output_dir": "~/Desktop"
}
```

### `validate_scpl`

Validate ScPL code syntax without creating a file.

**Parameters:**
- `scpl_code` (required): The ScPL code to validate

**Example:**
```json
{
  "scpl_code": "GetClipboard\nShowResult"
}
```

### `list_actions`

List available ScPL actions with descriptions.

**Parameters:**
- `category` (optional): Filter by category (e.g., "Scripting", "Files")
- `search` (optional): Search term to filter actions

**Example:**
```json
{
  "category": "Scripting",
  "search": "shell"
}
```

## Resources

### `scpl://actions/tahoe`

Documentation for 22 new macOS Tahoe actions.

### `scpl://examples`

Example shortcuts demonstrating various ScPL features.

## Usage with Claude Code

Once registered, Claude can create shortcuts for you:

```
Claude, create a shortcut that:
1. Gets text from clipboard
2. Asks ChatGPT to improve it
3. Copies the result back to clipboard
```

Claude will:
1. Write the ScPL code
2. Validate the syntax
3. Create the .shortcut file
4. Provide installation instructions

## Usage with Claude Skill

The included `/create-shortcut` skill provides a guided experience:

```
/create-shortcut
```

Then describe what you want your shortcut to do.

## ScPL Syntax Quick Reference

```scpl
# Comments
# Single-line comments start with #

# Text and Output
Text "Hello World"
ShowResult "My Result"
ShowAlert title="Title" message="Message"

# Variables
SetVariable v:myVar
GetVariable v:myVar

# Clipboard
GetClipboard
SetClipboard

# Apple Intelligence (Apple Silicon only)
AskLLM model="Apple Intelligence" prompt="Your prompt here"

# ChatGPT (requires app installed)
Text "Your question"
AskChatGPT

# Shell Scripts (Intel & Apple Silicon)
RunShellScript shell="/bin/zsh" script="echo 'Hello'"

# Files (Intel & Apple Silicon)
GetFile path="~/Desktop"
SaveFile path="~/Documents/file.txt"

# Conditionals
If condition="Equals" value="test"
    ShowResult "Match!"
Otherwise
    ShowResult "No match"
End If

# Menus
ChooseFromMenu items=["Option 1", "Option 2"]
Case "Option 1"
    Text "You chose 1"
Case "Option 2"
    Text "You chose 2"
End Menu

# Loops
RepeatWithEachItem
    ShowResult
End Repeat
```

## Examples

### Simple Notification

```scpl
Text "Hello from ScPL!"
ShowResult
```

### AI Text Improver

```scpl
GetClipboard
SetVariable v:originalText

AskLLM model="Apple Intelligence" prompt="Improve this text for clarity: \\(v:originalText)"
SetClipboard
ShowAlert title="Done" message="Improved text copied to clipboard"
```

### Shell Script Runner

```scpl
RunShellScript shell="/bin/zsh" script="sw_vers"
ShowResult "macOS Version"
```

### File Counter

```scpl
GetFile path="~/Desktop"
Count
ShowResult "Files on Desktop"
```

## Troubleshooting

### "Command not found: scpl-updated-mcp-server"

Make sure you installed globally:
```bash
npm install -g scpl-updated-mcp-server
```

### "Error: Cannot find module 'scpl-macos-updated'"

The MCP server depends on scpl-macos-updated. Ensure it's installed:
```bash
npm list -g scpl-macos-updated
```

### "Permission denied"

Make the script executable:
```bash
chmod +x index.js
```

### ScPL Validation Errors

Check the error message for line numbers and syntax issues. Common mistakes:
- Forgetting to close `If` with `End If`
- Forgetting to close `Menu` with `End Menu`
- Using wrong parameter names (use `list_actions` to check)
- Missing quotes around text values

## Contributing

Found a bug or want to add features? See [CONTRIBUTING.md](../CONTRIBUTING.md)

## License

MIT - Same as scpl-macos-updated
