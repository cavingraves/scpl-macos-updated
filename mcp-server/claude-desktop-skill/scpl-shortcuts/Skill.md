---
name: "ScPL Shortcuts"
description: "Create macOS Shortcuts using ScPL code. Use tools: create_shortcut, validate_scpl, list_actions. Write shortcuts as text instead of dragging blocks."
---

# ScPL Shortcuts Skill

Create Apple Shortcuts using text-based ScPL code instead of the visual editor.

## Available MCP Tools

- `create_shortcut` - Convert ScPL code to .shortcut file
- `validate_scpl` - Check syntax without creating file
- `list_actions` - Search 493 available actions

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

See REFERENCE.md for complete documentation.
