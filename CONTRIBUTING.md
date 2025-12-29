# Contributing to scpl-macos-updated

Thanks for your interest in contributing! This fork adds macOS Tahoe actions to scpl.

## 🎯 We Need Your Help!

There are **thousands of apps** with App Intents that could be added to scpl. We can't document them all, but **you can help**!

## How to Add Your Favorite App's Actions

### Step 1: Export a Shortcut

1. Create a shortcut in the Shortcuts app that uses your favorite app's actions
2. Right-click the shortcut → **Export...** → Save as `.shortcut` file
3. Convert to JSON (the file is a binary plist):
   ```bash
   plutil -convert json "YourShortcut.shortcut" -o shortcut.json
   ```

### Step 2: Extract Action Identifiers

Look for `WFWorkflowActionIdentifier` in the JSON:

```json
{
  "WFWorkflowActionIdentifier": "com.yourapp.YourActionIntent",
  "WFWorkflowActionParameters": {
    "parameter1": "value1",
    "parameter2": "value2"
  }
}
```

### Step 3: Create Action Definition

Add to `src/Data/OutActions.json`:

```json
"com.yourapp.YourActionIntent": {
  "ActionClass": "WFAppIntentAction",
  "ActionKeywords": ["keyword1", "keyword2"],
  "AppIdentifier": "com.yourapp",
  "Category": "Productivity",
  "Description": {
    "DescriptionSummary": "Brief description of what this action does."
  },
  "Name": "Action Name",
  "Parameters": [
    {
      "Class": "WFTextInputParameter",
      "Key": "parameter1",
      "Label": "Parameter Label",
      "Placeholder": "Example value"
    }
  ],
  "RequiredResources": [
    {
      "WFResourceClass": "WFAppInstalledResource",
      "WFAppIdentifier": "com.yourapp"
    }
  ],
  "Subcategory": "Category Name"
}
```

### Step 4: Submit a Pull Request

1. Fork this repository
2. Add your action definition
3. Update `MACOS_TAHOE_UPDATES.md` with your action
4. Submit a PR with:
   - Clear description of the app and action
   - Example usage
   - Any special requirements (e.g., subscription needed)

## 📋 Parameter Classes Reference

Common parameter types:

- **`WFTextInputParameter`** - Text input field
- **`WFNumberParameter`** - Number input
- **`WFSwitchParameter`** - Boolean toggle
- **`WFEnumerationParameter`** - Dropdown menu (use `Items` array)
- **`WFImageParameter`** - Image picker
- **`WFFileParameter`** - File picker
- **`WFURLParameter`** - URL input

## 🎨 Categories

Use these standard categories:

- **Productivity** - Task management, notes, documents
- **Social Networking** - Communication apps
- **Media** - Photo, video, audio apps
- **Utilities** - System tools, calculators
- **Reference** - Knowledge, research apps
- **Developer Tools** - IDEs, version control
- **Business** - Finance, CRM, analytics
- **Health & Fitness** - Health tracking, workout apps

## ✅ Action Definition Checklist

Before submitting, ensure your action definition includes:

- [ ] Clear, descriptive `Name`
- [ ] Accurate `Description`
- [ ] All required parameters with proper types
- [ ] Relevant keywords for searchability
- [ ] Correct `AppIdentifier` (bundle ID)
- [ ] Required resources (e.g., app must be installed)
- [ ] Professional, safe-for-work examples

## 🚫 What NOT to Include

- Personal information or API keys
- NSFW content in examples
- Copyrighted material
- Actions that violate app terms of service

## 💡 Popular Apps We'd Love to See

Community contributions wanted for:

- **Notion** - Database, page actions
- **Things 3** - Task management
- **Bear** - Note-taking
- **OmniFocus** - GTD workflows
- **Hazel** - File automation
- **PDF Expert** - PDF manipulation
- **Pixelmator Pro** - Image editing
- **Final Cut Pro** - Video editing
- **Logic Pro** - Music production
- **Xcode** - Development actions
- **GitHub Desktop** - Repository actions
- **Slack** - Messaging actions
- **Discord** - Community actions
- **1Password** - Password management
- **DEVONthink** - Research database
- **Keyboard Maestro** - Macro actions

## 📝 Example PR Template

```markdown
## Add [App Name] Actions

### Actions Added
- `com.example.app.ActionIntent` - Action description

### Testing
- ✅ Tested on macOS Tahoe 26.x
- ✅ App version: 1.2.3
- ✅ Action works as expected

### Example Usage
```scpl
askapp "com.example.app.ActionIntent" param1="value"
```

### Requirements
- [App Name] 1.2.3 or later
- macOS Tahoe 26.0+
```

## 🤝 Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License as scpl.

---

**Questions?** Open an issue or start a discussion!
