# ScPL Language Reference

ScPL (Shortcut Programming Language) lets you write Apple Shortcuts as text code instead of dragging blocks.

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `create_shortcut` | Convert ScPL code to .shortcut file |
| `validate_scpl` | Check syntax without creating file |
| `list_actions` | Search 495 actions by category/keyword |
| `get_action_details` | Get full parameter docs for any action |
| `get_syntax_reference` | Get syntax docs (variables, flow, fields) |
| `get_examples` | Get code examples for common patterns |

**Pro tip:** Use `get_action_details` before writing any action to see exact parameter names, types, and valid options.

---

## Basic Syntax

```scpl
ActionName "argument1" "argument2"
ActionName argument=value anotherArg=value
```

## Variables

Three types with `type:name` syntax:

| Type | Syntax | Description |
|------|--------|-------------|
| Named | `v:MyVar` | Set with SetVariable |
| Magic | `mv:MyVar` | Auto-created with `->` arrow |
| Special | `s:Name` | Built-in system variables |

### Special Variables
- `s:ShortcutInput` - Input to the shortcut
- `s:Clipboard` - Current clipboard contents
- `s:CurrentDate` - Current date/time
- `s:AskWhenRun` - Prompt user at runtime
- `s:ActionInput` - Input to current action

### Setting Variables

```scpl
# Named variable (creates SetVariable action)
Text "Hello" -> v:MyText
# or
SetVariable v:MyText

# Magic variable (no action created, just reference)
Text "Hello" -> mv:MyMagic

# Pre-assignment style
mv:Result = Text "Hello"
```

### Using Variables in Text

```scpl
Text "The value is \(v:MyVariable)"
Text "Clipboard: \(s:Clipboard)"
```

## Flow Control

### If/Otherwise/End If

**IMPORTANT:** The If action tests the **output of the previous action**. You don't specify what to test—it's implicit.

```scpl
# The If tests the Text output (which is "test")
Text "test"
If Equals "test"
    ShowResult "Match!"
Otherwise
    ShowResult "No match"
End If
```

### Available Conditions

| Condition | Use Case |
|-----------|----------|
| `Equals` | Exact string/number match |
| `Contains` | Substring search |
| `Begins With` | Prefix check |
| `Ends With` | Suffix check |
| `Is Greater Than` | Number comparison |
| `Is Less Than` | Number comparison |
| `Has Any Value` | Not empty/null |

### File Existence Check Pattern

```scpl
GetFile path="~/file.txt" errorifnotfound=false
Count
If "Is Greater Than" 0
    # File exists
Otherwise
    # File doesn't exist
End If
```

### Repeat

```scpl
Repeat 5
    ShowResult "Loop iteration"
End Repeat
```

### Repeat with Each

**IMPORTANT:** You must name the loop variable using `->` syntax. `mv:RepeatItem` is NOT a predefined variable.

```scpl
# Correct: Name the loop variable with arrow
List ["item1", "item2", "item3"]
RepeatWithEach -> mv:Item
    ShowResult "Processing: \(mv:Item)"
End RepeatWithEach

# Also works: Use bare RepeatItem as direct reference (not in interpolation)
List ["a", "b", "c"]
RepeatWithEach
    ShowResult RepeatItem
End RepeatWithEach
```

### Choose from Menu

```scpl
ChooseFromMenu "Pick one" ["Option A", "Option B"]
Case "Option A"
    ShowResult "You picked A"
Case "Option B"
    ShowResult "You picked B"
End Menu
```

## Field Types

### Text Fields
```scpl
Text "Single line"
Text
| Multiline text
| Second line
| With variable: \(v:Name)
```

### Numbers
```scpl
Number 42
Number 3.14
Number -100
```

### Booleans
```scpl
SetWifi true
SetBluetooth false
```

### Lists
```scpl
List ["item1", "item2", "item3"]
# or
List
| Item 1
| Item 2
```

### Dictionaries
```scpl
Dictionary {
    key: "value"
    number: 42
    nested: {inner: "data"}
}
# Quotes and commas optional
```

## Variable Aggrandizements

Access properties of variables:

```scpl
# Get dictionary key
v:MyDict{as:Dictionary,key:myKey}
# Shorthand
v:MyDict:myKey

# Get property
v:Contact{as:Contact,get:Email}
```

## Actions Inside Actions

Inline actions in parentheses:

```scpl
Text "Number is \(Number 42)"
If Equals (Text "compare value")
    ShowResult "Match"
End If
```

## Comments

```scpl
# This is a comment
// Also a comment
-- Also works
```

---

# Common Actions

## Text & Display

```scpl
Text "Your text here"
ShowResult "Display this"
ShowAlert title="Title" message="Body text"
ShowNotification title="Hey" body="Message"
```

## Clipboard

```scpl
GetClipboard
SetClipboard "New content"
# or with variable
Text "Copy this" -> mv:Content
SetClipboard mv:Content
```

## Variables

```scpl
SetVariable v:Name
GetVariable v:Name
AddToVariable v:List
```

## Lists & Dictionaries

```scpl
List ["a", "b", "c"]
GetItemFromList "First Item"
GetItemFromList "Last Item"
GetItemFromList "Random Item"
Count "Items"

Dictionary {key: "value"}
GetDictionaryValue key="mykey"
SetDictionaryValue key="mykey" value="newvalue"
```

## Math

```scpl
Number 10
Calculate "+" 5
Calculate "*" 2
Calculate "/" 4
RoundNumber "Normal"
RandomNumber min=1 max=100
```

## Dates

```scpl
Date "tomorrow at 9am"
FormatDate "short"
AdjustDate "1 week"
GetTimeBetweenDates unit="Days"
```

## Files

```scpl
GetFile service="iCloud Drive" filepath="/path/to/file"
SaveFile destinationpath="/save/here"
GetFolderContents
DeleteFiles immediately=true
```

## Web & APIs

```scpl
URL "https://example.com"
GetContentsOfURL
ExpandURL
GetComponentOfURL component="Host"
```

### GET Request (Basic)
```scpl
URL "https://api.example.com/data"
GetContentsOfURL -> mv:Response
GetDictionaryValue key="result"
ShowResult
```

### POST Request with JSON Body
```scpl
URL "https://api.example.com/submit"
GetContentsOfURL method="POST" headers={
    "Content-Type": "application/json"
    "Authorization": "Bearer YOUR_API_KEY"
} body={
    "name": "value"
    "data": "content"
}
```

### Parse Nested JSON
```scpl
URL "https://api.example.com/user"
GetContentsOfURL -> mv:Response
# Access nested: response.data.user.name
mv:Response:data:user:name -> mv:UserName
Text "Hello \(mv:UserName)"
```

### API with Error Handling
```scpl
URL "https://api.example.com/data"
GetContentsOfURL -> mv:Response
Count
If Equals 0
    ShowAlert title="Error" message="No data returned"
    ExitShortcut
End If
GetDictionaryValue key="status" -> mv:Status
If Equals "error"
    GetDictionaryValue key="message"
    ShowAlert title="API Error" message=mv:Message
    ExitShortcut
End If
# Continue processing...
```

### Loop Through API Results
```scpl
URL "https://api.example.com/items"
GetContentsOfURL -> mv:Response
GetDictionaryValue key="items"
RepeatWithEach -> mv:Item
    GetVariable mv:Item
    GetDictionaryValue key="name" -> mv:ItemName
    Text "\(mv:ItemName)" -> mv:Output
    AddToVariable v:AllItems
End RepeatWithEach
ShowResult v:AllItems
```

---

# macOS Tahoe Actions (New)

## Apple Intelligence (Apple Silicon only)

```scpl
# Ask AI model
AskLLM model="Apple Intelligence" prompt="Summarize this text"
AskLLM model="ChatGPT" prompt="Explain quantum computing"

# Image generation
GenerateImage prompt="A sunset over mountains" style="Illustration"
```

## AI Assistants

```scpl
# ChatGPT (requires app)
AskChatGPT prompt="Help me write an email"
OpenChatGPTVoiceMode

# Claude (requires app)
AskClaude message="Analyze this code"
```

## Shell Scripts

```scpl
# Bash script
RunShellScript shell="/bin/bash" script="echo Hello World"

# Zsh with input
GetClipboard
RunShellScript shell="/bin/zsh" script="cat | wc -w"

# AppleScript
RunAppleScript script="display dialog \"Hello!\""

# JavaScript for Automation
RunJavaScriptForAutomation script="Application('Finder').selection()"
```

## File Operations

```scpl
# Get file by path
File path="~/Documents/myfile.txt"

# Rename
RenameFile name="newname.txt"

# Move
MoveFile destination="~/Desktop/"

# Reveal in Finder
RevealInFinder

# Select file (prompt)
SelectFile

# Get folder contents
GetFolderContents path="~/Documents"

# Get Finder selection
GetSelectedFiles
```

## System

```scpl
# Dark/Light mode
SetAppearance "Dark"
SetAppearance "Light"

# Screenshots
TakeScreenshot

# Lock screen
LockScreen

# On-screen OCR
GetOnScreenContent
```

## Clock & Timers

```scpl
StartStopwatch
StopStopwatch
CreateAlarm time="7:00 AM" label="Wake up"
StartTimer minutes=25
```

## Voice Memos

```scpl
CreateRecording
PlayRecording
```

---

# Complete Workflow Examples

## Morning Routine

```scpl
# Turn off dark mode
SetAppearance "Light"

# Check weather
GetCurrentWeather -> mv:Weather
Text "Good morning! Today's weather: \(mv:Weather)"
ShowNotification title="Morning" body=mv:Text

# Open calendar
OpenApp "Calendar"
```

## Clipboard AI Enhancement

```scpl
GetClipboard -> mv:Original
AskLLM model="Apple Intelligence" prompt="Improve this text for clarity: \(mv:Original)"
SetClipboard
ShowAlert title="Done" message="Improved text copied!"
```

## Pomodoro Timer with Logging

```scpl
# Start work session
ShowNotification title="Pomodoro" body="25 minute focus session started"
StartTimer minutes=25

# Log session
Date -> mv:StartTime
Text "Work session started at \(mv:StartTime)" -> mv:Log
AppendToFile path="~/Documents/pomodoro-log.txt" text=mv:Log
```

## Screenshot with AI Description

```scpl
TakeScreenshot -> mv:Screenshot
AskLLM model="Apple Intelligence" prompt="Describe what's in this image"
SetVariable v:Description

# Save with description
Text "Screenshot: \(v:Description)"
ShowResult
```

## DevOps Status Check

```scpl
RunShellScript shell="/bin/zsh" script="git status --short" -> mv:GitStatus
RunShellScript shell="/bin/zsh" script="docker ps --format 'table {{.Names}}\t{{.Status}}'" -> mv:Docker

Text
| Git Status:
| \(mv:GitStatus)
|
| Docker Containers:
| \(mv:Docker)

ShowResult
```

## File Organizer

```scpl
GetSelectedFiles -> mv:Files
GetVariable mv:Files
RepeatWithEach -> mv:CurrentFile
    GetVariable mv:CurrentFile
    GetDetailsOfFiles detail="File Extension" -> mv:Ext

    GetVariable mv:Ext
    If Equals "pdf"
        GetVariable mv:CurrentFile
        MoveFile destination="~/Documents/PDFs/"
    Otherwise
        GetVariable mv:Ext
        If Equals "jpg"
            GetVariable mv:CurrentFile
            MoveFile destination="~/Pictures/"
        End If
    End If
End RepeatWithEach

ShowNotification title="Done" body="Files organized!"
```

## Quick Note from Voice

```scpl
DictateText -> mv:Spoken
AskLLM model="Apple Intelligence" prompt="Clean up and format: \(mv:Spoken)"
SetVariable v:CleanedNote

CreateNote title="Voice Note" body=v:CleanedNote
ShowNotification title="Saved" body="Voice note created"
```

## Voice Journal with AI (Complete Example)

Records voice, transcribes via local Whisper, processes with AI, sends to Drafts:

```scpl
# Check if Whisper server is running, start if not
RunShellScript shell="/bin/zsh" script="if ! lsof -i :2023 > /dev/null 2>&1; then fish -c 'start-mcp-deepgram' & sleep 3; fi"

# Record audio
RecordAudio audioquality="Very High" startrecording="Immediately" finishrecording="On Tap" -> mv:Recording

# Generate timestamp
Date
FormatDate dateformat="Custom" formatstring="yyyyMMdd_HHmmss" -> mv:TS

# Save via stdin (base64 -> decode -> file)
mv:Recording
Base64Encode
RunShellScript shell="/bin/zsh" script="mkdir -p /Users/username/Documents/VoiceJournals && base64 -d > /Users/username/Documents/VoiceJournals/VJ_\(mv:TS).wav && echo saved" passinput=true

# Transcribe via local Whisper API
RunShellScript shell="/bin/zsh" script="curl -s 'http://127.0.0.1:2023/v1/audio/transcriptions' -F 'file=@/Users/username/Documents/VoiceJournals/VJ_\(mv:TS).wav' -F 'model=whisper-1'" -> mv:WhisperJSON

# Parse JSON response
mv:WhisperJSON
GetDictionaryValue key="text" -> mv:Transcript

# Check if transcript is empty
mv:Transcript
Count count="Characters"
If input="Equals" number=0
    ShowAlert title="Transcription Failed" message="Check Whisper server"
    ExitShortcut
Otherwise
    # Process with AI (Python handles escaping)
    mv:Transcript
    RunShellScript shell="/usr/bin/python3" script="import sys,json,urllib.request; t=sys.stdin.read(); req=urllib.request.Request('https://api.venice.ai/api/v1/chat/completions',headers={'Authorization':'Bearer YOUR_KEY','Content-Type':'application/json'},data=json.dumps({'model':'llama-3.3-70b','messages':[{'role':'user','content':'KEEP THE ORIGINAL WORDS. Fix transcription errors. Format paragraphs. Bold **spiritual** phrases. Add ## Summary. Text:\\n\\n'+t}]}).encode()); print(json.load(urllib.request.urlopen(req))['choices'][0]['message']['content'])" passinput=true -> mv:Formatted

    # Build final output
    Date
    FormatDate dateformat="Custom" formatstring="EEEE, MMMM d yyyy h:mm a" -> mv:DateStr
    Text "# Voice Journal\n\(mv:DateStr)\n\n\(mv:Formatted)" -> mv:Final

    # Send to Drafts app
    mv:Final
    URLEncode -> mv:Enc
    URL "drafts://x-callback-url/create?text=\(mv:Enc)&tag=journal"
    OpenURLs

    ShowNotification title="Done" body="Sent to Drafts"
End If
```

---

# Tips & Common Patterns

## Error Handling Pattern
```scpl
GetFile path="~/file.txt" errorIfNotFound=false -> mv:File
Count
If Equals 0
    ShowAlert title="Error" message="File not found"
    ExitShortcut
End If
# Continue with file...
```

## User Input Validation
```scpl
AskForInput prompt="Enter a number" -> mv:Input
If "is not" "Number"
    ShowAlert title="Error" message="Please enter a valid number"
    ExitShortcut
End If
```

## Chaining API Calls
```scpl
URL "https://api.example.com/data"
GetContentsOfURL -> mv:Response
GetDictionaryValue key="items"
RepeatWithEach -> mv:Item
    # Process each item using mv:Item
    GetVariable mv:Item
    GetDictionaryValue key="name" -> mv:Name
    ShowResult mv:Name
End RepeatWithEach
```

---

# Quick Reference

| Task | ScPL Code |
|------|-----------|
| Show text | `ShowResult "Hello"` |
| Get clipboard | `GetClipboard` |
| Set clipboard | `SetClipboard "text"` |
| User input | `AskForInput prompt="Question"` |
| Run shell | `RunShellScript shell="/bin/zsh" script="cmd"` |
| AI prompt | `AskLLM model="Apple Intelligence" prompt="..."` |
| Variable | `Text "x" -> v:Name` then `\(v:Name)` |
| Magic var | `Text "x" -> mv:Name` then `mv:Name` |
| Condition | `If Equals "value"` ... `End If` |
| Loop | `Repeat 5` ... `End Repeat` |
| Menu | `ChooseFromMenu "title" [options]` ... `End Menu` |

---

# Common Errors & Fixes

## Menu Syntax
**Wrong:** `Menu`, `case`, `end`
**Correct:** `ChooseFromMenu prompt="..."`, `Case "..."`, `End Menu`

## Variable Assignment
**Wrong:** `SetVariable v:name` then `${v:name}`
**Correct:** `-> mv:Name` then `\(mv:Name)`

## Date Formatting
**Wrong:** `GetCurrentDate` then `FormatDate "pattern"`
**Correct:** `Date` then `FormatDate dateformat="Custom" formatstring="pattern"`

## Action Not Found
1. Use `list_actions search="keyword"` to find correct name
2. Use `get_action_details action_name="name"` for parameters
3. Check macOS version requirements

## Parsing Errors
- Close blocks: `If`→`End If`, `ChooseFromMenu`→`End Menu`, `Repeat`→`End Repeat`
- Quote strings: `param="value"` not `param=value`
- Space-separate params: `a="1" b="2"` not `a="1", b="2"`

## HTTP API Requests
**Headers**: Use `headers=true headers2={Key: "value"}` (not `headers={...}`)
**Complex JSON**: Use shell scripts with curl instead of jsonvalues with nested arrays
```scpl
Text "curl -s URL -H 'Auth: Bearer KEY' -d '{...}' | python3 -c 'import sys,json; print(json.load(sys.stdin)[\"key\"])'"
RunShellScript shell="/bin/zsh" -> mv:Result
```

## Shell Script Paths (CRITICAL)
**Wrong:** `~`, `$HOME`, `/Documents`
**Correct:** `/Users/username/Documents/` (full absolute path)

Shortcuts cannot expand `~` or `$HOME` in shell scripts. Always use the complete path.

```scpl
# WRONG - these will fail
RunShellScript shell="/bin/zsh" script="mkdir ~/Documents/MyFolder"
RunShellScript shell="/bin/zsh" script="echo test > $HOME/file.txt"
RunShellScript shell="/bin/zsh" script="cat /Documents/file.txt"

# CORRECT - absolute path
RunShellScript shell="/bin/zsh" script="mkdir -p /Users/username/Documents/MyFolder"
```

## Passing Binary Data to Shell Scripts
Use Base64 encoding and `passinput=true` to pipe data through stdin:

```scpl
# Record audio and save via shell
RecordAudio audioquality="Very High" -> mv:Recording

Date
FormatDate dateformat="Custom" formatstring="yyyyMMdd_HHmmss" -> mv:TS

# Encode as base64, pipe to shell, decode and save
mv:Recording
Base64Encode
RunShellScript shell="/bin/zsh" script="mkdir -p /Users/username/Documents/Recordings && base64 -d > /Users/username/Documents/Recordings/rec_\(mv:TS).wav" passinput=true
```

## If/Count Syntax
The `Count` action requires explicit type, and `If` with numbers needs the `number=` parameter:

```scpl
# WRONG
Count
If Equals 0

# CORRECT
Count count="Characters"
If input="Equals" number=0
    ShowAlert title="Empty" message="No content"
    ExitShortcut
Otherwise
    # Process content here
End If
```

## Python for Complex API Calls
When shell escaping gets complex, use Python with stdin:

```scpl
mv:TextContent
RunShellScript shell="/usr/bin/python3" script="import sys,json,urllib.request; t=sys.stdin.read(); req=urllib.request.Request('https://api.example.com/v1/chat',headers={'Authorization':'Bearer KEY','Content-Type':'application/json'},data=json.dumps({'model':'gpt-4','messages':[{'role':'user','content':t}]}).encode()); print(json.load(urllib.request.urlopen(req))['choices'][0]['message']['content'])" passinput=true -> mv:Response
```

## iCloud Drive Limitations
- `SaveFile service="iCloud Drive"` only works if connected to iCloud
- If not connected, use shell scripts with absolute local paths instead
- iCloud paths: `/Users/name/Library/Mobile Documents/com~apple~CloudDocs/...`

---

# Signing & Installation

**Shortcuts are auto-signed by default!** The MCP server uses the built-in macOS `shortcuts sign` CLI.

After creation:
```bash
# Double-click the file, or:
open ~/Documents/MyShortcut.shortcut
```

## Manual Signing (if auto-sign fails)

**CLI (Built into macOS 12+):**
```bash
shortcuts sign --mode anyone --input MyShortcut.shortcut --output MyShortcut_signed.shortcut
open MyShortcut_signed.shortcut
```

**GUI Alternative:** Install [Shortcut Source Helper](https://routinehub.co/shortcut/10060/) from RoutineHub and drag-drop your file onto it.

---

# Known Limitations & Workarounds

## Multi-line Text Cannot Use Arrow Assignment

Multi-line text blocks (using `|` syntax) cannot use `->` directly. Use `SetVariable` on the next line instead.

```scpl
# WRONG - will fail to parse
Text
| Line 1
| Line 2
-> v:MyVar

# CORRECT - use SetVariable
Text
| Line 1
| Line 2

SetVariable v:MyVar
```

## Calculate Operand Cannot Use String Interpolation

The `operand` parameter in Calculate must use direct variable reference, not string interpolation.

```scpl
Number 10 -> v:Base
Number 5 -> v:Addend

# WRONG - string interpolation fails
GetVariable v:Base
Calculate operation="+" operand="\(v:Addend)"

# CORRECT - direct variable reference
GetVariable v:Base
Calculate operation="+" operand=v:Addend
```

## RepeatWithEach Loop Variable

`mv:RepeatItem` is NOT a predefined magic variable. You must name your loop variable explicitly using the `->` syntax.

```scpl
# WRONG - mv:RepeatItem doesn't exist
List ["a", "b", "c"]
RepeatWithEach
    Text "\(mv:RepeatItem)"  # ERROR: not defined
End RepeatWithEach

# CORRECT - name the variable
List ["a", "b", "c"]
RepeatWithEach -> mv:Item
    Text "\(mv:Item)"
End RepeatWithEach

# ALSO WORKS - bare RepeatItem (not in interpolation)
List ["a", "b", "c"]
RepeatWithEach
    ShowResult RepeatItem  # Works as direct reference
End RepeatWithEach
```

## Wait/Stepper Fields Require Integers

Stepper fields (like `Wait`) only accept positive integers, not decimals.

```scpl
# WRONG - decimal fails
Wait 0.5

# CORRECT - integer only
Wait 1
```

---

**495 total actions available.** Use `list_actions` tool to search by category or keyword.
