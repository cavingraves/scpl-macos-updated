# ScPL MCP Server

Model Context Protocol server for creating macOS Shortcuts using ScPL (Shortcuts Programming Language).

## Features

- **Create Shortcuts**: Convert ScPL code to .shortcut files
- **Auto-Sign**: Shortcuts are automatically signed and ready to use (macOS 12+)
- **Validate Syntax**: Check ScPL code without creating files
- **Discover Actions**: Browse 495 available actions with descriptions
- **Documentation**: Access action reference and examples

## ✅ Automatic Signing (New!)

**Shortcuts are now auto-signed by default!** The MCP server uses the built-in macOS `shortcuts sign` CLI to sign shortcuts automatically. No setup required on macOS Monterey (12.0) or later.

```
create_shortcut scpl_code="Text 'Hello'" output_name="MyShortcut"
# → Creates a signed shortcut at ~/Documents/MyShortcut.shortcut
# → Double-click to install, or: open ~/Documents/MyShortcut.shortcut
```

To create an unsigned shortcut (for manual signing later):
```
create_shortcut scpl_code="..." output_name="MyShortcut" sign=false
```

### Manual Signing (if auto-sign fails)

**Option 1: CLI (Built into macOS 12+)**
```bash
shortcuts sign --mode anyone --input MyShortcut.shortcut --output MyShortcut_signed.shortcut
```

**Option 2: Shortcut Source Helper (GUI)**
1. Install [Shortcut Source Helper](https://routinehub.co/shortcut/10060/) from RoutineHub
2. Drag and drop the `.shortcut` file onto it in your Dock

**Disclaimer**: We are not associated with Shortcut Source Tool/Helper.

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

Add this to the `mcpServers` section in `~/.claude.json`:

```json
"scpl-shortcuts": {
  "type": "stdio",
  "command": "npx",
  "args": [
    "-y",
    "scpl-updated-mcp-server"
  ]
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
