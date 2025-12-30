# Apple Notes Actions Reference

Complete guide to all 20 Apple Notes actions available in scpl-macos-updated.

## 📝 Note Management Actions

### Append Checklist Item
**Action ID:** `com.apple.Notes.CreateChecklistItemLinkAction`
Add a new checklist item to a note.

### Close Note
**Action ID:** `com.apple.Notes.CloseNoteLinkAction`
Close the currently open note.

### Pin Notes
**Action ID:** `com.apple.Notes.PinNotesLinkAction`
Pin notes to the top of the notes list.

### Delete Notes
**Action ID:** `com.apple.Notes.DeleteNotesLinkAction`
Permanently delete notes.

### Show Quick Note
**Action ID:** `com.apple.Notes.ShowQuickNoteIntent`
Display the Quick Note interface.

### Add File
**Action ID:** `com.apple.Notes.AddFileAttachmentLinkAction`
Attach a file to a note.

## 📁 Folder Management Actions

### Create Folder
**Action ID:** `com.apple.Notes.CreateFolderLinkAction`
Create a new folder in Notes.

### Rename Folder
**Action ID:** `com.apple.Notes.RenameFolderLinkAction`
Rename an existing folder.

### Delete Folders
**Action ID:** `com.apple.Notes.DeleteFoldersLinkAction`
Delete folders from Notes.

### Show Notes Folder
**Action ID:** `com.apple.Notes.ICNotesFolderIntent`
Display a specific Notes folder.

### Move Notes to Folder
**Action ID:** `com.apple.Notes.MoveNotesToFolderLinkAction`
Move selected notes to a different folder.

## 🏷️ Tag Management Actions

### Create Tag
**Action ID:** `com.apple.Notes.CreateTagLinkAction`
Create a new tag for organizing notes.

### Open Tag
**Action ID:** `com.apple.Notes.OpenTagLinkAction`
View all notes with a specific tag.

### Add Tags to Notes
**Action ID:** `com.apple.Notes.AddTagsToNotesLinkAction`
Add tags to selected notes.

### Remove Tags from Notes
**Action ID:** `com.apple.Notes.RemoveTagsFromNotesLinkAction`
Remove tags from selected notes.

### Delete Tags
**Action ID:** `com.apple.Notes.DeleteTagsLinkAction`
Delete tags from your Notes library.

## 🖥️ View & Navigation Actions

### Open Notes View
**Action ID:** `com.apple.Notes.OpenAppLocationLinkAction`
Open a specific view in the Notes app.

### Close Notes View
**Action ID:** `com.apple.Notes.CloseAppLocationLinkAction`
Close the current Notes view.

### Open Account
**Action ID:** `com.apple.Notes.OpenAccountLinkAction`
Switch to a specific Notes account (iCloud, On My Mac, etc.).

## ⚙️ Settings Actions

### Change Notes Setting
**Action ID:** `com.apple.Notes.ChangeSettingLinkAction`
Modify Notes app settings.

---

## Usage Examples

### Create and Organize a Note

```scpl
# Create a new note
Text "My important note content"
CreateNote

# Add tags to organize
# (Use Add Tags to Notes action with the created note)

# Pin the note for quick access
# (Use Pin Notes action)
```

### Manage Folders

```scpl
# Create a new folder for projects
# (Use Create Folder action)

# Move notes to the new folder
# (Use Move Notes to Folder action)

# Rename the folder
# (Use Rename Folder action)
```

### Work with Tags

```scpl
# Create tags for different categories
# (Use Create Tag action for "Work", "Personal", "Important")

# Add tags to a note
# (Use Add Tags to Notes action)

# View all notes with a specific tag
# (Use Open Tag action)
```

### Quick Note Workflow

```scpl
# Capture a quick thought
ShowQuickNote

# Add a file attachment
# (Use Add File action)

# Add a checklist item
# (Use Append Checklist Item action)
```

---

## Compatibility

- ✅ **macOS Tahoe (26.x) and later**
- ✅ **Intel and Apple Silicon Macs**
- ✅ **Works with iCloud Notes and local Notes**

## Notes

All Apple Notes actions use the modern **App Intents** framework (`WFAppIntentExecutionAction`), providing tight integration with the Notes app and supporting all Notes features including:

- 📝 Rich text formatting
- 🖼️ Image and file attachments
- ✅ Checklists
- 🏷️ Tags (iOS 15+ / macOS 12+)
- 📁 Nested folders
- 🔐 Locked notes
- ☁️ iCloud sync

These actions complement the existing Notes actions:
- `com.apple.mobilenotes.SharingExtension` (Create Note - legacy action)

For more information about ScPL syntax and usage, see the main [README.md](./README.md).
