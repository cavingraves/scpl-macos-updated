# macOS Tahoe Updates for scpl

This fork adds **22 new actions** that are present in macOS Tahoe Shortcuts but were missing from the original scpl repository (last updated July 2021).

## 🤖 Apple Intelligence Actions

**New in macOS Tahoe 26.0+** - Requires Apple Silicon Mac:

- **`is.workflow.actions.askllm`** - Use Model action for Apple Intelligence and ChatGPT integration
- **`com.apple.GenerativePlaygroundApp.GenerateImageIntent`** - Image Playground (generate images with AI)

## 🎯 AI Assistant App Intents

**Requires respective apps installed:**

- **`com.openai.chat.OpenVoiceModeIntent`** - ChatGPT Voice Mode
- **`com.anthropic.claude.ClaudeAppIntentsExtension`** - Ask Claude

## What's New

### Shell & Scripting Actions (3)
- **`is.workflow.actions.runshellscript`** - Execute bash/zsh/python scripts
- **`is.workflow.actions.runapplescript`** - Execute AppleScript
- **`is.workflow.actions.runjavascriptforautomation`** - Execute JavaScript for Automation (JXA)

### File Operations (10)
- **`is.workflow.actions.file`** - Get a file reference by path
- **`is.workflow.actions.file.rename`** - Rename a file
- **`is.workflow.actions.file.move`** - Move a file to a new location
- **`is.workflow.actions.file.reveal`** - Reveal file in Finder
- **`is.workflow.actions.file.select`** - Prompt user to select a file
- **`is.workflow.actions.file.label`** - Set Finder label/tag on file
- **`is.workflow.actions.file.getfoldercontents`** - List contents of a folder
- **`is.workflow.actions.finder.getselectedfiles`** - Get files selected in Finder
- **`is.workflow.actions.savefile`** - Save file to specified path

### System & Network (2)
- **`is.workflow.actions.connecttoservers`** - Connect to network servers (SMB, AFP, etc.)
- **`is.workflow.actions.getonscreencontent`** - Capture on-screen content/text (OCR)

### Media & Audio (1)
- **`is.workflow.actions.makespokenaudiofromtext`** - Text-to-speech audio generation

### Utilities (3)
- **`is.workflow.actions.output`** - Set shortcut output
- **`is.workflow.actions.converttimezone`** - Convert date between time zones
- **`is.workflow.actions.text.trimwhitespace`** - Trim whitespace from text
- **`is.workflow.actions.setname`** - Set name of an item

## Apple Intelligence Integration

### Use Model Action (`is.workflow.actions.askllm`)

Send prompts to Apple Intelligence or ChatGPT:

**Parameters:**
- **Model**: `"Apple Intelligence"`, `"Apple Intelligence on Device"`, or `"ChatGPT"`
- **Prompt**: Text prompt to send
- **Follow-Up**: Boolean - treat as follow-up to previous response
- **Result Type**: `"Text"`, `"Boolean"`, or `"Number"`

**Requirements:**
- macOS Tahoe 26.0+
- Apple Silicon Mac (M1 or later)
- Apple Intelligence enabled in System Settings

**Example Usage:**
```
askllm model="Apple Intelligence" prompt="Summarize this article"
```

**JSON Structure:**
```json
{
  "WFWorkflowActionIdentifier": "is.workflow.actions.askllm",
  "WFWorkflowActionParameters": {
    "WFLLMModel": "Apple Intelligence",
    "WFLLMPrompt": {
      "Value": {
        "string": "What is the weather like today?",
        "attachmentsByRange": {}
      },
      "WFSerializationType": "WFTextTokenString"
    }
  }
}
```

---

## Image Playground Action

### Generate Image (`com.apple.GenerativePlaygroundApp.GenerateImageIntent`)

Create images with Apple Intelligence Image Playground:

**Parameters:**
- **Prompt**: Description of image to generate
- **Style**: `"Animation"`, `"Illustration"`, or `"Sketch"`
- **Reference Image**: Optional image to use as reference

**Requirements:**
- macOS Tahoe 26.0+
- Apple Silicon Mac (M1 or later)
- Apple Intelligence enabled

**Example:**
```json
{
  "WFWorkflowActionIdentifier": "com.apple.GenerativePlaygroundApp.GenerateImageIntent",
  "WFWorkflowActionParameters": {
    "prompt": "A cat wearing sunglasses on the beach",
    "style": {
      "identifier": "illustration"
    }
  }
}
```

## ChatGPT & Claude Integration

### ChatGPT Voice Mode
```json
{
  "WFWorkflowActionIdentifier": "com.openai.chat.OpenVoiceModeIntent",
  "WFWorkflowActionParameters": {
    "AppIntentDescriptor": {
      "BundleIdentifier": "com.openai.chat",
      "Name": "ChatGPT",
      "AppIntentIdentifier": "OpenVoiceModeIntent"
    }
  }
}
```

### Ask Claude
```json
{
  "WFWorkflowActionIdentifier": "com.anthropic.claude.ClaudeAppIntentsExtension",
  "WFWorkflowActionParameters": {
    "message": "Hello Claude!",
    "ShowWhenRun": false
  }
}
```

---

## Total Actions

- **Original scpl**: 272 actions
- **After update**: **294 actions** (+22)

## How These Were Discovered

These actions were extracted from real macOS Tahoe shortcuts by:

1. Exporting `.shortcut` files from macOS Shortcuts app
2. Converting binary plists to JSON
3. Extracting `WFWorkflowActionIdentifier` values
4. Analyzing parameter structures from actual usage
5. Cross-referencing with scpl's existing action format

## Installation & Usage

Use this fork exactly like the original scpl:

```bash
npm install -g scpl
scpl input.scpl output.shortcut
```

Or use the online editor at: https://scpl.dev

## Compatibility

- **macOS**: Tahoe (16.x) and later
- **iOS/iPadOS**: iOS 18+ / iPadOS 18+ (most actions are macOS-only)

**Note**: Shell script execution actions (`runshellscript`, `runapplescript`, `runjavascriptforautomation`) are **macOS-exclusive** and will not work on iOS/iPadOS.

## Example: Run Shell Script

```
runshellscript shell="/bin/bash" script="
#!/bin/bash
echo \"System uptime: $(uptime)\"
"
```

Compiles to:

```json
{
  "WFWorkflowActionIdentifier": "is.workflow.actions.runshellscript",
  "WFWorkflowActionParameters": {
    "Shell": "/bin/bash",
    "Script": "#!/bin/bash\necho \"System uptime: $(uptime)\""
  }
}
```

## Example: File Operations

```
# Get selected files from Finder
getselectedfiles

# Rename the first file
getfromlist "First Item" from=(getselectedfiles)
renamefile name="NewName.txt"

# Reveal in Finder
revealinfinder
```

## Contributing

Found more missing actions? Please open an issue or PR!

To add a new action:
1. Add definition to `src/Data/OutActions.json`
2. Follow the existing format (see examples above)
3. Test with `npm run build`

## Credits

- **Original scpl**: [pfgithub/scpl](https://github.com/pfgithub/scpl)
- **macOS Tahoe Updates**: Extracted from real shortcuts and community resources
- **Action Discovery**: Analysis of macOS Shortcuts app binary and user-created shortcuts

## License

Same as original scpl (MIT License)
