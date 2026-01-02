# ScPL Skill Test Prompt

Use this prompt in a fresh Claude Code session to verify the skill works correctly.

---

## Test Prompt (copy this to a new session):

```
Create a shortcut called "Daily Journal" that does the following:

1. Shows a menu asking "What kind of entry?" with options:
   - Quick Note
   - Full Entry
   - Review Day

2. For "Quick Note":
   - Ask for a single line of text
   - Save it to a file with today's date

3. For "Full Entry":
   - Ask "How was your mood?" with options: Great, Good, Okay, Bad
   - Ask "What did you accomplish today?" (text input)
   - Ask "What's on your mind?" (text input)
   - Combine all into a formatted entry
   - Save to iCloud Drive

4. For "Review Day":
   - Get the journal file for today
   - If it exists, show its contents
   - If not, show "No entry for today"

5. At the end, show a notification with "Journal updated!" or the review content

Make sure to use variables to track the mood and entries, and use proper date formatting.
```

---

## What This Tests:

- [ ] **Menus**: `choosefrommenu` with `|` syntax and `case` blocks
- [ ] **Nested menus/logic**: Multiple branches with different flows
- [ ] **Variables**: `setVariable`, `getVariable`, arrow assignment
- [ ] **Conditionals**: `if`/`otherwise`/`end` blocks
- [ ] **Text input**: `askForInput`
- [ ] **Multi-line text**: Using `|` for formatted content
- [ ] **String interpolation**: `\(v:variable)` syntax
- [ ] **File operations**: `getFile`, `saveFile` with `a{}` syntax
- [ ] **Date handling**: Date formatting
- [ ] **Notifications**: `showNotification` or `showResult`
- [ ] **Inline actions**: `^()` syntax

---

## Expected Outcome:

The shortcut should compile without errors and the generated `.shortcut` file should be importable via Shortcut Source Helper.

## Validation Commands:

After the shortcut is created, you can verify it:

```bash
# Check if file was created
ls -la ~/Documents/DailyJournal.shortcut

# The file should be a valid binary plist
file ~/Documents/DailyJournal.shortcut
```

---

## Simpler Fallback Test:

If the complex test fails, try this simpler one:

```
Create a shortcut that:
1. Shows a menu with "Option A" and "Option B"
2. If A, asks for your name and says hello
3. If B, shows the current date
4. Shows a result at the end
```

This tests the core menu + conditional + variable flow without file operations.
