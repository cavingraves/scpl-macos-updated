---
description: Create macOS Shortcuts using natural language. Converts your request into ScPL code and generates a .shortcut file.
tags: [shortcuts, automation, macos, scpl]
---

# Shortcut Creator

I'll help you create a macOS Shortcut! I'll guide you through the process and generate a .shortcut file you can use.

## Step 1: Understand the Request

Let me understand what you want your shortcut to do. Ask me:
- What should the shortcut do?
- What triggers it (manual run, share sheet, etc.)?
- What input does it need?
- What should it output?

## Step 2: Explore Available Actions

I can check what actions are available using the MCP server. Let me search for relevant actions based on your needs.

For example:
- **Apple Intelligence**: AskLLM, Image Playground
- **AI Assistants**: ChatGPT, Claude
- **File Operations**: GetFile, SaveFile, RenameFile
- **Shell Scripts**: RunShellScript, RunAppleScript
- **System**: GetClipboard, SetClipboard, ShowAlert

Use the `list_actions` tool to find specific actions if needed.

## Step 3: Write ScPL Code

Based on your requirements, I'll write the ScPL code. ScPL syntax is simple:

```scpl
# Comments start with #
ActionName parameter1="value" parameter2="value"

# Variables
SetVariable v:myVar
UseVariable v:myVar

# Conditionals
If condition="Equals" value="test"
    ShowResult "Match!"
End If

# Menus
ChooseFromMenu items=["Option 1", "Option 2"]
Case "Option 1"
    # Do something
Case "Option 2"
    # Do something else
End Menu
```

## Step 4: Validate and Create

I'll:
1. Validate the ScPL code using `validate_scpl`
2. Create the .shortcut file using `create_shortcut`
3. Save it to your Documents folder (or specified location)
4. Provide instructions on how to sign and install it

## Step 5: Installation & Signing

Generated shortcuts need to be signed before macOS will allow you to run them. You have two options:

### Option 1: Shortcut Source Helper (Free - Recommended)

**One-time setup:**
1. Install these free shortcuts from RoutineHub:
   - [Shortcut Source Helper](https://routinehub.co/shortcut/10060/)
   - [Shortcut Source Tool](https://routinehub.co/shortcut/5256/)
   - [Tinycut Builder](https://routinehub.co/shortcut/5217/)
2. Add **Shortcut Source Helper** to your Dock

**For each generated shortcut:**
1. Find the `.shortcut` file in your Documents folder
2. **Drag and drop** it onto Shortcut Source Helper in your Dock
3. Follow the prompts to sign and import
4. The shortcut is now installed and ready to use!

### Option 2: Apple Developer Account

If you have an Apple Developer account ($99/year), you can sign shortcuts with your developer certificate for distribution.

**After installation, you can:**
- ✅ Run it from Shortcuts app
- ✅ AirDrop it to your iPhone/iPad
- ✅ Share the signed version with others

**Disclaimer**: We are not associated with Shortcut Source Tool/Helper or their creators. Use third-party tools at your own risk. Always review shortcuts before running them.

## Examples of What I Can Create

- **AI-powered text improver**: Select text → Claude improves it → copies back
- **Quick screenshot annotator**: Screenshot → add notes → save to folder
- **Daily standup helper**: Ask for updates → format → send to Slack
- **File organizer**: Select files → AI categorizes → moves to folders
- **Voice memo transcriber**: Record → transcribe → save as text
- **URL shortener**: Get clipboard → shorten → copy back

## Getting Started

Just tell me what you want your shortcut to do! For example:

> "Create a shortcut that takes clipboard text, asks ChatGPT to summarize it in 3 bullet points, and shows the result"

> "Make a shortcut that gets all PDFs from my Desktop, renames them with today's date, and moves them to Documents/Archive"

> "I want a shortcut that runs a shell script to check my git status and shows it in a notification"

What would you like your shortcut to do?
