<p align="center">
  <img height=200px src="https://i.imgur.com/vIVZPVg.png" alt="ScPL Logo">
</p>

<h1 align="center">scpl-macos-updated</h1>

<p align="center">
  <b>Shortcuts Programming Language • Updated for macOS Tahoe 26.x</b>
</p>

<div align="center">

[![Actions](https://img.shields.io/badge/actions-294-blue.svg)](./MACOS_TAHOE_UPDATES.md)
[![macOS Tahoe](https://img.shields.io/badge/macOS-Tahoe%2026.x-purple.svg)](https://www.apple.com/macos/)
[![Apple Silicon](https://img.shields.io/badge/Apple%20Silicon-M1%2B-orange.svg)](https://support.apple.com/en-us/116943)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

</div>

---

## 🎉 macOS Tahoe Updates

This fork adds **22 new actions** for macOS Tahoe, including:

### 🤖 Apple Intelligence
- **Use Model** (`askllm`) - AI integration with Apple Intelligence, on-device models, and ChatGPT
- **Image Playground** - Generate images with AI (`GenerateImageIntent`)
- **ChatGPT & Claude** - Direct integration with AI assistants

### ⚙️ System & Scripting
- Shell script execution (`runshellscript`, `runapplescript`, `runjavascriptforautomation`)
- File operations (`file.rename`, `file.move`, `file.reveal`, and more)
- System utilities (`getonscreencontent`, `connecttoservers`)

**→** See [MACOS_TAHOE_UPDATES.md](./MACOS_TAHOE_UPDATES.md) for the complete list

**→** Total: **294 actions** (original: 272, **+22 new**)

---

## 📊 What is ScPL?

ScPL is a **programming language for iOS/macOS Shortcuts** that lets you write shortcuts in text instead of dragging and dropping blocks. Perfect for:

- ✨ **Large shortcuts** - Copy/paste actions, work without scrolling
- 🔧 **Version control** - Track changes with Git
- ⚡ **Speed** - Type actions faster than dragging
- 🔍 **Debugging** - See your entire shortcut at once

### Example

```scpl
ShowResult "Hello ScPL"
ChooseFromMenu prompt="ScPL" items=["Getting Started", "View Documentation"]
Case "Getting Started"
    URL "https://docs.scpl.dev/gettingstarted"
Case "View Documentation"
    URL "https://docs.scpl.dev/"
End Menu
OpenURLs
```

**→** Try the [ScPL Editor](https://editor.scpl.dev/) to convert your shortcuts to ScPL!

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

4. **Submit to scpl:**
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
# Convert ScPL to .shortcut file
scpl input.scpl output.shortcut

# Use the online editor
# Visit: https://editor.scpl.dev
```

### Documentation

- 📚 [ScPL Documentation](https://docs.scpl.dev/)
- 🎓 [Getting Started Guide](https://docs.scpl.dev/gettingstarted)
- 📖 [Action Reference](https://docs.scpl.dev/actions)

---

## 🤝 Contributing

**Want to add your favorite app's actions?** We need your help!

Thousands of apps have App Intents that could be added to scpl. See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
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

### Apple Intelligence Actions (macOS 26.0+)
- `is.workflow.actions.askllm` - Use Model (AI prompts)
- `com.apple.GenerativePlaygroundApp.GenerateImageIntent` - Image Playground

### AI Assistant Integrations
- `com.openai.chat.OpenVoiceModeIntent` - ChatGPT Voice Mode
- `com.anthropic.claude.ClaudeAppIntentsExtension` - Ask Claude

### Shell & Scripting (3 actions)
- `runshellscript`, `runapplescript`, `runjavascriptforautomation`

### File Operations (10 actions)
- `file`, `file.rename`, `file.move`, `file.reveal`, `file.select`
- `file.label`, `file.getfoldercontents`, `finder.getselectedfiles`, `savefile`

### System & Network (5 actions)
- `connecttoservers`, `getonscreencontent`, `makespokenaudiofromtext`
- `converttimezone`, `text.trimwhitespace`, `output`, `setname`

**→** See [MACOS_TAHOE_UPDATES.md](./MACOS_TAHOE_UPDATES.md) for detailed documentation

---

## 🔗 Useful Links

| Resource | Description |
|----------|-------------|
| [ScPL Editor](https://editor.scpl.dev/) | Convert shortcuts to ScPL online |
| [ScPL CLI](https://github.com/pfgithub/scpl-cli) | Command-line converter |
| [RoutineHub](https://routinehub.co/) | Shortcut sharing community |
| [Shortcut Source Tool](https://routinehub.co/shortcut/5256/) | Developer tools for shortcuts |
| [r/shortcuts](https://reddit.com/r/shortcuts) | Reddit community |

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
