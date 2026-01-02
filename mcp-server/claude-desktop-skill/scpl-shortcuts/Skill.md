---
name: "scpl-shortcuts"
description: "Create macOS Shortcuts using ScPL code. Shortcuts are auto-signed and ready to use. Tools: create_shortcut, validate_scpl, list_actions."
---

# ScPL Shortcuts Skill

Create Apple Shortcuts using text-based ScPL code instead of the visual editor. **Shortcuts are auto-signed by default!**

## Available MCP Tools

- `create_shortcut` - Convert ScPL code to signed .shortcut file (auto-signs by default)
- `validate_scpl` - Check syntax without creating file
- `list_actions` - Search 495 available actions

## Quick Reference

### Basic Syntax
```scpl
ActionName "argument"
ActionName param=value
```

### Variables
- `v:Name` - Named variable (use SetVariable)
- `mv:Name` - Magic variable (use `->` arrow)
- `s:Name` - Special: ShortcutInput, Clipboard, CurrentDate, AskWhenRun

### Setting Variables
```scpl
Text "Hello" -> v:MyVar      # Named
Text "Hello" -> mv:Magic     # Magic
```

### Using Variables
```scpl
Text "Value is \(v:MyVar)"
```

### Flow Control
```scpl
If Equals "value"
    ShowResult "Match"
Otherwise
    ShowResult "No match"
End If

Repeat 5
    ShowResult "Loop"
End Repeat
```

### Common Actions
```scpl
Text "Hello"
ShowResult "Display this"
GetClipboard
SetClipboard "content"
AskForInput prompt="Question"
RunShellScript shell="/bin/zsh" script="echo hi"
AskLLM model="Apple Intelligence" prompt="Help me"
```

### RepeatWithEach - IMPORTANT
**You MUST name the loop variable with `->`:**
```scpl
List ["a", "b", "c"]
RepeatWithEach -> mv:Item       # Name it!
    ShowResult "\(mv:Item)"
End RepeatWithEach
```
`mv:RepeatItem` is NOT predefined.

### Critical Gotchas
- **Multi-line text can't use `->` directly** - use `SetVariable` on next line
- **Calculate operand** - use `operand=v:Var` not `operand="\(v:Var)"`
- **Wait/Stepper fields** - integers only (`Wait 1` not `Wait 0.5`)

### After Creating
Shortcuts are auto-signed. To install:
- Double-click the file, or
- Run: `open ~/Documents/YourShortcut.shortcut`

See REFERENCE.md for complete documentation and more examples.
