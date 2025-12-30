<p align="center">
  <img height=200px src="https://i.imgur.com/vIVZPVg.png" alt="ScPL Logo">
</p>

<h1 align="center">scpl-macos-updated</h1>

<p align="center">
  <b>Code Your Apple Shortcuts • Vibe-Based Automation • AI-Powered Creation</b>
</p>

<p align="center">
  Write macOS Shortcuts in text instead of clicking • Natural language programming for Apple automation
</p>

<div align="center">

[![Actions](https://img.shields.io/badge/actions-493-blue.svg)](./MACOS_TAHOE_UPDATES.md)
[![macOS](https://img.shields.io/badge/macOS-Tahoe%2026.x%20%7C%20Intel%20%26%20Apple%20Silicon-purple.svg)](https://www.apple.com/macos/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

</div>

> **💻 Intel Mac Compatible!** ScPL-macOS-updated and most actions work on both Intel and Apple Silicon Macs.
> Only Apple Intelligence actions (Use Model, Image Playground) require Apple Silicon.

**🔍 Find what you need:** Apple Shortcuts automation • Shortcuts scripting language • Program shortcuts with code • Text-based shortcut builder • AI shortcut generator • Automate macOS with Claude • Vibe code your workflows • Natural language automation • Voice memo automation • Dark mode scheduling • Window manager shortcuts • Pomodoro timer automation • Accessibility automation • HomeKit scripting

---

## 🎉 macOS Tahoe Updates

This fork adds **222 new actions** including comprehensive coverage of Apple apps (Clock, Photos, Voice Memos, Books, Weather, Stocks, Freeform, Shortcuts management, Accessibility, and more), plus **AI-powered shortcut creation** with the MCP server!

### New Features:

### 🤖 Apple Intelligence *(Apple Silicon only)*
- **Use Model** (`askllm`) - AI integration with Apple Intelligence, on-device models, and ChatGPT
- **Image Playground** - Generate images with AI (`GenerateImageIntent`)

### 🤖 AI Assistants *(Intel & Apple Silicon)*
- **ChatGPT & Claude** - Direct integration with AI assistants (requires apps installed)

### 📝 Apple Notes Actions *(Intel & Apple Silicon)*
Complete integration with Apple Notes app:
- **Note Management** - Create, close, pin, and delete notes
- **Folder Operations** - Create, rename, delete, and navigate folders
- **Tag Management** - Create, add, remove, and delete tags
- **Advanced Features** - Append checklist items, add files, move notes, show Quick Note

### ⚙️ System & Scripting *(Intel & Apple Silicon)*
- Shell script execution (`runshellscript`, `runapplescript`, `runjavascriptforautomation`)
- File operations (`file.rename`, `file.move`, `file.reveal`, and more)
- System utilities (`getonscreencontent`, `connecttoservers`)

**→** See [MACOS_TAHOE_UPDATES.md](./MACOS_TAHOE_UPDATES.md) for the complete list

**→** Total: **493 actions** (original scpl: 271, **+222 new actions**)

---

## 📊 What is ScPL-macOS-updated? (Code Your Shortcuts!)

**Tired of clicking through the Shortcuts app?** ScPL-macOS-updated is a **text-based programming language for Apple Shortcuts** that lets you **vibe code your automation** instead of dragging blocks around.

Think of it as: **Markdown for Shortcuts** • **Code instead of clicks** • **AI-powered shortcut generation**

Perfect for:

- ✨ **Large shortcuts** - Copy/paste actions, work without scrolling like a pro
- 🔧 **Version control** - Track your automation in Git like real code
- ⚡ **Speed** - Type workflows 10x faster than GUI clicking
- 🔍 **Debugging** - See your entire shortcut logic at once
- 🤖 **AI creation** - Describe shortcuts in plain English, get working code
- 🎯 **Power users** - Build complex automations without RSI from clicking

### Example

```scpl
# Simple notification shortcut
ShowResult "Hello from ScPL on macOS Tahoe!"

# Use Apple Intelligence
AskLLM model="Apple Intelligence" prompt="Explain what ScPL is in one sentence"
ShowResult

# Run a shell script
RunShellScript shell="/bin/zsh" script="echo 'ScPL makes Shortcuts programming easy!'"
ShowResult
```

### Why Choose Text-Based Shortcuts?

**Real automation workflow scenarios:**

🎯 **"I want to automate my morning routine"**
→ Dark mode off, VPN on, start timer, open calendar, create voice memo for daily notes

⏱️ **"I need a Pomodoro timer with logging"**
→ 25-min timer, log work sessions, auto dark mode during breaks

📸 **"Batch process screenshots with AI"**
→ Take screenshot, AI extract text, save to organized folders, share via clipboard

🎤 **"Voice memo workflow"**
→ Record, auto-transcribe, tag with location/time, save to dated folders

🪟 **"Window management layouts"**
→ Arrange apps in specific positions, resize windows, switch between workspace configs

🤖 **"AI-powered content creation"**
→ Get clipboard, Claude/ChatGPT improve text, format output, copy back

💻 **"DevOps automation on Mac"**
→ Git status check, run tests, open terminal, notify on completion

All of this **in text you can copy/paste/share/version-control** instead of clicking through menus!

---

## 🛠️ Tools for Working with Shortcuts

### Extract Action Identifiers with Shortcut Source Tool

To contribute new actions or explore shortcuts, use these powerful tools:

#### [**Shortcut Source Tool**](https://routinehub.co/shortcut/5256/) 🔍
The ultimate shortcut developer tool for viewing, editing, and analyzing shortcuts.

**Features:**
- 📝 **View Source** - Export shortcuts as JSON or plist
- 🔧 **Edit & Import** - Modify shortcuts and import back to Shortcuts app
- 🌐 **Web Review** - Analyze shortcuts in your browser
- 🩹 **Auto-Repair** - Detects and fixes corrupted shortcuts
- 📋 **Copy/Paste Actions** - Transfer actions between shortcuts

**Required Dependencies:**
- [**Shortcut Source Helper**](https://routinehub.co/shortcut/10060/) - Helper for reading/writing shortcut plists
- [**Tinycut Builder**](https://routinehub.co/shortcut/5217/) - Compiler that converts text to shortcuts

### How to Extract Action Identifiers

1. **Install the tools:**
   - Download [Shortcut Source Tool](https://routinehub.co/shortcut/5256/)
   - Download [Shortcut Source Helper](https://routinehub.co/shortcut/10060/)
   - Download [Tinycut Builder](https://routinehub.co/shortcut/5217/)

2. **Run Shortcut Source Tool:**
   - Select your shortcut
   - Choose **"View Source"**
   - Select **"JSON"** format

3. **Find action identifiers:**
   - Look for `"WFWorkflowActionIdentifier"` keys
   - Copy the identifier (e.g., `"is.workflow.actions.askllm"`)
   - Note the parameters under `"WFWorkflowActionParameters"`

4. **Submit to ScPL-macOS-updated:**
   - See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add actions
   - Submit a PR with your action definition

**Example JSON output:**
```json
{
  "WFWorkflowActionIdentifier": "is.workflow.actions.askllm",
  "WFWorkflowActionParameters": {
    "WFLLMModel": "Apple Intelligence",
    "WFLLMPrompt": "Summarize this article"
  }
}
```

---

## 🚀 Quick Start

### Installation

```bash
npm install -g scpl
```

### Usage

```bash
# Install
npm install -g scpl-macos-updated

# Convert ScPL to .shortcut file
scpl-macos-updated input.scpl output.shortcut

# Or if you alias it:
scpl input.scpl output.shortcut
```

### AI-Powered Shortcut Creation 🤖

Create shortcuts using natural language! One command installs everything:

**For Claude Code (CLI):**
```bash
npx scpl-updated-mcp-server --setup
```

**For Claude Desktop (GUI app):**
```bash
npx scpl-updated-mcp-server --setup-desktop
```

**For OpenAI Codex:**
```bash
npx scpl-updated-mcp-server --setup-codex
```

**For Codex forks (just-every/code, etc.):**
```bash
npx scpl-updated-mcp-server --setup-codex=$CODE_HOME
```

**Multiple tools at once:**
```bash
npx scpl-updated-mcp-server --setup --setup-desktop --setup-codex
```

That's it! **Restart your AI tool**, then just ask:

> "Create a shortcut that gets clipboard text, asks ChatGPT to summarize it, and shows the result"

> "Make a shortcut that starts a 25-minute timer and creates a voice memo"

> "Build a shortcut that takes a screenshot and saves it to a dated folder"

Claude will write the ScPL code, validate it, and generate the `.shortcut` file for you!

**→** See [mcp-server/README.md](./mcp-server/README.md) for manual installation options

### Documentation

- 📖 [macOS Tahoe Actions Reference](./MACOS_TAHOE_UPDATES.md) - All 22 new actions
- 🤖 [MCP Server Guide](./mcp-server/README.md) - AI-powered shortcut creation
- 🤝 [Contributing Guide](./CONTRIBUTING.md) - Add your favorite app's actions
- 📚 [Original ScPL Documentation](https://docs.scpl.dev/) - Core language reference (by pfgithub)

---

## 🤝 Contributing

**Want to add your favorite app's actions?** We need your help!

Thousands of apps have App Intents that could be added to ScPL-macOS-updated. See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- 📝 How to extract action identifiers with Shortcut Source Tool
- 🔧 How to create action definitions
- 🚀 How to submit a PR

### Popular Apps We'd Love to See

<details>
<summary><b>Click to expand list</b></summary>

**Productivity:**
- Notion, Things 3, Bear, OmniFocus, Todoist
- DEVONthink, Obsidian, Craft

**Creative:**
- PDF Expert, Pixelmator Pro, Final Cut Pro
- Logic Pro, Adobe Creative Cloud

**Development:**
- Xcode, GitHub Desktop, Tower
- CodeRunner, Kaleidoscope

**Communication:**
- Slack, Discord, Microsoft Teams
- Telegram, Signal

**Utilities:**
- 1Password, Bitwarden
- Keyboard Maestro, Hazel, BetterTouchTool

</details>

---

## 📦 What's New in This Fork?

### 🍎 Apple Intelligence Actions (Apple Silicon M1+ required)
- `is.workflow.actions.askllm` - Use Model (AI prompts)
- `com.apple.GenerativePlaygroundApp.GenerateImageIntent` - Image Playground

### 🤖 AI Assistant Integrations (Intel & Apple Silicon)
- `com.openai.chat.OpenVoiceModeIntent` - ChatGPT Voice Mode
- `com.anthropic.claude.ClaudeAppIntentsExtension` - Ask Claude

### 🔧 Shell & Scripting (3 actions - Intel & Apple Silicon)
- `runshellscript`, `runapplescript`, `runjavascriptforautomation`

### 📁 File Operations (10 actions - Intel & Apple Silicon)
- `file`, `file.rename`, `file.move`, `file.reveal`, `file.select`
- `file.label`, `file.getfoldercontents`, `finder.getselectedfiles`, `savefile`

### 🌐 System & Network (5 actions - Intel & Apple Silicon)
- `connecttoservers`, `getonscreencontent`, `makespokenaudiofromtext`
- `converttimezone`, `text.trimwhitespace`, `output`, `setname`

**→** See [MACOS_TAHOE_UPDATES.md](./MACOS_TAHOE_UPDATES.md) for detailed documentation

---

## 🔗 Useful Links

| Resource | Description |
|----------|-------------|
| [npm Package](https://www.npmjs.com/package/scpl-macos-updated) | Install scpl-macos-updated |
| [RoutineHub](https://routinehub.co/) | Shortcut sharing community |
| [Shortcut Source Tool](https://routinehub.co/shortcut/5256/) | Developer tools for shortcuts |
| [r/shortcuts](https://reddit.com/r/shortcuts) | Reddit community |
| [Original ScPL](https://github.com/pfgithub/scpl) | Original scpl project by pfgithub |

---

## 💻 Development

### Setup

```bash
git clone https://github.com/cavingraves/scpl-macos-updated.git
cd scpl-macos-updated
yarn install
```

### Running Tests

```bash
yarn test
```

### Before Submitting PR

```bash
yarn prepublishOnly
```

This will format code with Prettier and run tests.

---

## 📄 License

MIT License - Same as [original scpl](https://github.com/pfgithub/scpl)

---

## 🙏 Credits

- **Original scpl:** [pfgithub/scpl](https://github.com/pfgithub/scpl)
- **macOS Tahoe Updates:** Extracted from real shortcuts and community resources
- **Shortcut Source Tool:** [gluebyte](https://routinehub.co/user/gluebyte) on RoutineHub
- **Action Discovery:** [xAlien95](https://github.com/xalien95/) for WFActions.plist analysis
- **Shortcuts JS:** [Josh Farrant](https://github.com/joshfarrant/shortcuts-js) for glyph/color lists

---

**Note:** The original ScPL repository has not been updated since July 2021. This fork extends it with macOS-specific actions from Tahoe (macOS 26.x).

<p align="center">
  Made with ❤️ for the Shortcuts community
</p>
