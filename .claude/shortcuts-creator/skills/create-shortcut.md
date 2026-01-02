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

I can check what actions are available using the MCP server. With **495 actions** available, I can help you automate almost anything!

**Popular categories:**
- **Apple Intelligence**: AskLLM, Image Playground (Apple Silicon)
- **AI Assistants**: ChatGPT, Claude
- **Shortcuts Management**: Create/delete/organize shortcuts programmatically
- **Clock & Timers**: Start/stop stopwatch, create alarms, world clocks
- **Voice Memos**: Record, playback, organize recordings
- **File Operations**: GetFile, SaveFile, RenameFile, MoveFile, RevealFile
- **Shell Scripts**: RunShellScript, RunAppleScript, RunJavaScriptForAutomation
- **System Control**: Dark mode, screenshots, window management, lock screen
- **Photos**: Filter library, search, create albums
- **Books & Audiobooks**: Open books, play audiobooks
- **Weather**: Get weather, manage locations
- **Accessibility**: All 24 accessibility features
- **And much more!**

**IMPORTANT**: Use the `list_actions` MCP tool to discover available actions!

```
# Search for specific actions
list_actions search="notification"
list_actions search="file"
list_actions search="clipboard"

# Browse by category
list_actions category="Scripting"
list_actions category="Files"
list_actions category="Sharing"
```

Always check available actions before writing ScPL code to ensure the action exists and to see its correct parameter names.

## Step 3: Write ScPL Code

Based on your requirements, I'll write the ScPL code. ScPL syntax reference:

```scpl
// Comments use // or --
actionname parameter1="value" parameter2="value"

// Variables - use v: prefix for named variables, mv: for magic variables
text "Hello"
setVariable v:myVar
getVariable v:myVar

// Arrow assignment (alternative to setVariable)
text "Hello" -> v:greeting

// Conditionals
if Equals "test"
    showResult "Match!"
otherwise
    showResult "No match"
end

// Menus - use | for menu items, case for handlers
choosefrommenu "Pick an option"
| First Choice
| Second Choice
| Third Choice
case first
    text "You picked first"
case second
    text "You picked second"
case third
    text "You picked third"
end

// Dictionaries
Dictionary {
    key1: "value1"
    key2: v:someVariable
}

// Multi-line text with |
text
| Line 1
| Line 2
| With variable: \(v:myVar)

// Repeat loops
repeatWithEach ^(v:myList)
    getVariable v:'Repeat Item'
end repeat

// Input/output
askForInput "What's your name?" -> v:name
showResult "Hello \(v:name)!"
```

**Key syntax rules:**
- Action names are case-insensitive
- Use `^()` for inline action results
- Use `\()` for string interpolation
- `end` closes if/menu/repeat blocks
- `otherwise` is the else clause in if blocks

### Advanced Syntax

```scpl
// Lists
List []                              // Empty list
List ["item1", "item2", "item3"]     // List with items
getitemfromlist ^(v:myList) "Item At Index" 1
getitemfromlist ^(v:myList) get="Items in Range" 1 5
addToVariable v:myList               // Append to list variable

// Dictionary operations
Dictionary { key1: "value", key2: v:var }
setDictionaryValue key="name" value="test"
getDictionaryValue Value keyname -> v:result
getVariable v:myDict:keyname         // Access nested key

// Alternative parameter syntax with a{ }
savefile a{
  service="iCloud Drive",
  askwheretosave=false,
  destinationpath="/path/to/file.txt",
  overwriteiffileexists=true
}

// Math calculations
Calculate ^(v:number) "+" 1
Calculate ^(v:number) "-" 1
Calculate ^(v:number) "*" 2
count Items                          // Count items in list
count Characters                     // Count characters in text

// Text operations
replacetext "old" "new"
splittext separator="Custom" custom="/"
combinetext separator="New Lines"

// Control flow
nothing                              // Do nothing (useful in if blocks)
exitShortcut                         // Exit shortcut
exitShortcut ^(v:result)             // Exit with result

// Special variables
s:askwhenrun                         // Prompt user at runtime
v:'Repeat Item'                      // Current item in repeat loop
v:'Repeat Index'                     // Current index in repeat loop
sv:ShortcutInput                     // Shortcut input

// Inline conditionals (single line)
if Equals "value"; doSomething; otherwise; doElse; end
```

## Step 4: Validate and Create

**Always validate before creating!** Use these MCP tools:

```
# First, validate syntax
validate_scpl scpl_code="your code here"

# Then create the shortcut (auto-signs by default!)
create_shortcut scpl_code="your code here" output_name="MyShortcut"
```

I'll:
1. Validate the ScPL code using `validate_scpl` - fix any errors before proceeding
2. Create the .shortcut file using `create_shortcut`
3. **Auto-sign the shortcut** using the built-in macOS `shortcuts sign` CLI
4. Save it to your Documents folder (or specified location)
5. You can double-click to install or run `open ~/Documents/MyShortcut.shortcut`

## Step 5: Installation & Signing

**Good news: Shortcuts are auto-signed by default!** The MCP server signs them using the built-in macOS CLI.

After creation, just:
- Double-click the file to import to Shortcuts app, or
- Run: `open ~/Documents/YourShortcut.shortcut`

### Manual Signing (if needed)

If auto-signing fails, you have two options:

**Option 1: CLI (Built into macOS 12+)**
```bash
shortcuts sign --mode anyone --input MyShortcut.shortcut --output MyShortcut_signed.shortcut
open MyShortcut_signed.shortcut
```

**Option 2: Shortcut Source Helper (GUI)**
1. Install [Shortcut Source Helper](https://routinehub.co/shortcut/10060/) from RoutineHub
2. Drag and drop the `.shortcut` file onto it in your Dock

**After signing, you can:**
- ✅ Run it from Shortcuts app
- ✅ AirDrop it to your iPhone/iPad
- ✅ Share the signed version with others

**Disclaimer**: We are not associated with Shortcut Source Tool/Helper. Use third-party tools at your own risk.

## Examples of What I Can Create

**AI & Productivity:**
- **AI-powered text improver**: Select text → Claude improves it → copies back
- **Daily standup helper**: Ask for updates → format → send to Slack
- **Voice memo transcriber**: Record → transcribe → save as text

**Automation & Organization:**
- **Shortcut organizer**: Create folders and organize your shortcuts programmatically
- **File organizer**: Select files → AI categorizes → moves to folders
- **Auto dark mode**: Check time → switch appearance based on schedule

**Time & Recording:**
- **Pomodoro timer**: Start 25-min timer → alert → log work session
- **Quick voice note**: Start recording → save to dated folder → notify

**System Control:**
- **Quick screenshot workflow**: Take screenshot → annotate → save to folder
- **Window manager**: Arrange windows in specific layouts
- **Focus mode**: Set VPN, night shift, do not disturb all at once

## Common Errors & Fixes

### ❌ Menu Syntax Errors

**Wrong:**
```scpl
Menu "Pick one"
case "Option 1"
    Text "Selected 1"
end
```

**Correct:**
```scpl
ChooseFromMenu prompt="Pick one"
Case "Option 1"
    Text "Selected 1"
End Menu
```

**Key points:**
- Use `ChooseFromMenu` not `Menu`
- Use `Case` (capital C) not `case`
- Close with `End Menu` (two words) not `end`

---

### ❌ Variable Assignment Errors

**Wrong:**
```scpl
Text "Hello"
SetVariable v:greeting
Text "Value is ${v:greeting}"
```

**Correct:**
```scpl
Text "Hello" -> mv:Greeting
Text "Value is \(mv:Greeting)"
```

**Key points:**
- Use arrow syntax `-> mv:Name` for assignment
- Use `mv:` prefix (magic variable) not `v:`
- Interpolate with `\(mv:Name)` not `${v:name}`

---

### ❌ Date Formatting Errors

**Wrong:**
```scpl
GetCurrentDate
FormatDate "EEEE, MMMM d"
```

**Correct:**
```scpl
Date
FormatDate dateformat="Custom" formatstring="EEEE, MMMM d" -> mv:FormattedDate
```

**Key points:**
- Use `Date` action to get current date (not `GetCurrentDate`)
- Specify `dateformat="Custom"` when using custom format strings
- Use `formatstring=` parameter for the format pattern

---

### ❌ Action Not Found Errors

If you get "This action could not be found":

1. **Check exact action name** - Use `list_actions search="keyword"` to find correct name
2. **Check parameter names** - Use `get_action_details action_name="actionname"` for correct params
3. **macOS version** - Some actions require macOS 15+ (Sequoia) or Apple Silicon

---

### ❌ Parsing Errors

Common causes:
- **Unclosed blocks** - Every `If`, `ChooseFromMenu`, `Repeat` needs matching `End`/`End Menu`/`End Repeat`
- **Missing quotes** - String values need quotes: `prompt="text"` not `prompt=text`
- **Wrong parameter separator** - Use spaces, not commas: `param1="a" param2="b"`

---

### ❌ HTTP API Request Errors

**Wrong (headers directly):**
```scpl
GetContentsOfURL method="POST" headers={"Authorization": "Bearer key"}
```

**Correct (use headers2):**
```scpl
GetContentsOfURL method="POST" headers=true headers2={Authorization: "Bearer key"}
```

**Complex JSON bodies fail** - use shell scripts instead:
```scpl
Text "curl -s 'https://api.example.com' -H 'Authorization: Bearer KEY' -H 'Content-Type: application/json' -d '{\"key\":\"value\"}'"
RunShellScript shell="/bin/zsh" -> mv:Response
```

**Parse JSON responses with Python:**
```scpl
Text "curl ... | python3 -c \"import sys,json; print(json.load(sys.stdin)['key'])\""
RunShellScript shell="/bin/zsh" -> mv:Value
```

---

### 🔍 Debugging Tips

1. **Validate first**: Always use `validate_scpl` before `create_shortcut`
2. **Check action exists**: `list_actions search="actionname"`
3. **Check parameters**: `get_action_details action_name="actionname"`
4. **Start simple**: Build incrementally, testing each part
5. **Use shell scripts for complex APIs**: curl + python parsing is more reliable than native HTTP actions with nested JSON

---

### ❌ Shell Script Path Errors

**Wrong (will fail):**
```scpl
RunShellScript shell="/bin/zsh" script="mkdir ~/Documents/MyFolder"
RunShellScript shell="/bin/zsh" script="echo test > $HOME/file.txt"
RunShellScript shell="/bin/zsh" script="cat /Documents/file.txt"
```

**Correct (absolute paths):**
```scpl
RunShellScript shell="/bin/zsh" script="mkdir -p /Users/username/Documents/MyFolder"
```

**Key point:** Shortcuts cannot expand `~` or `$HOME`. Always use complete absolute paths like `/Users/username/Documents/`.

---

### ❌ If/Count Syntax Errors

**Wrong:**
```scpl
Count
If Equals 0
```

**Correct:**
```scpl
Count count="Characters"
If input="Equals" number=0
    ShowAlert title="Empty" message="No content"
    ExitShortcut
Otherwise
    # Success path here - don't forget Otherwise!
End If
```

**Key points:**
- `Count` requires `count="Characters"` or `count="Items"`
- `If` with numbers requires `number=0` parameter (not just `0`)
- Always include `Otherwise` block or the shortcut exits after the If

---

### ✅ Passing Binary Data to Shell Scripts

Use Base64 + stdin for audio, images, or other binary data:

```scpl
RecordAudio audioquality="Very High" -> mv:Recording

Date
FormatDate dateformat="Custom" formatstring="yyyyMMdd_HHmmss" -> mv:TS

mv:Recording
Base64Encode
RunShellScript shell="/bin/zsh" script="mkdir -p /Users/username/Documents/Recordings && base64 -d > /Users/username/Documents/Recordings/rec_\(mv:TS).wav" passinput=true -> mv:FilePath
```

---

### ✅ Python for Complex API Calls

When text contains quotes or special characters that break shell escaping, use Python with stdin:

```scpl
mv:TextToProcess
RunShellScript shell="/usr/bin/python3" script="import sys,json,urllib.request; t=sys.stdin.read(); req=urllib.request.Request('https://api.example.com/v1/chat',headers={'Authorization':'Bearer KEY','Content-Type':'application/json'},data=json.dumps({'model':'gpt-4','messages':[{'role':'user','content':t}]}).encode()); print(json.load(urllib.request.urlopen(req))['choices'][0]['message']['content'])" passinput=true -> mv:Response
```

---

### ❌ iCloud Drive Errors

**Problem:** `SaveFile service="iCloud Drive"` fails if not connected to iCloud

**Solution:** Use shell scripts with absolute local paths instead:
```scpl
mv:FileData
Base64Encode
RunShellScript shell="/bin/zsh" script="base64 -d > /Users/username/Documents/myfile.txt" passinput=true
```

---

## Getting Started

Just tell me what you want your shortcut to do! For example:

> "Create a shortcut that takes clipboard text, asks ChatGPT to summarize it in 3 bullet points, and shows the result"

> "Make a shortcut that gets all PDFs from my Desktop, renames them with today's date, and moves them to Documents/Archive"

> "I want a shortcut that runs a shell script to check my git status and shows it in a notification"

What would you like your shortcut to do?
