
## Run Shell Script / RunShellScript (internally `is.workflow.actions.runshellscript`)


## description

### summary

Runs a shell script using the specified shell.


### input

The input passed to the shell script (stdin)


### output

The output from the shell script (stdout)

### usage
```
RunShellScript shell=("/bin/zsh" | "/bin/bash" | "/bin/sh" | "/usr/bin/python3" | "/usr/bin/perl" | "/usr/bin/ruby") script="string" passInput=(true | false | variable)
```

### arguments

---

### shell: Enumeration [(Docs)](../gettingstarted#enum-select-field)
**Default Value**: `"/bin/zsh"`
**Allows Variables**: true



Accepts a string 
or variable
containing one of the options:

- `/bin/zsh`
- `/bin/bash`
- `/bin/sh`
- `/usr/bin/python3`
- `/usr/bin/perl`
- `/usr/bin/ruby`

---

### script: Text [(Docs)](../gettingstarted#text-field)
**Placeholder**: `"Script"`
**Allows Variables**: true



Accepts a string 
or text
with the text. Allows newlines.

---

### passInput: Switch [(Docs)](../gettingstarted#switch-or-expanding-or-boolean-fields)
**Default Value**: ```
		true
		```
**Allows Variables**: true



Accepts a boolean
or a variable.

---

### source json (for developers)

```json
{
	"ActionClass": "WFRunShellScriptAction",
	"ActionKeywords": [
		"shell",
		"bash",
		"zsh",
		"script",
		"terminal",
		"command",
		"unix",
		"linux"
	],
	"AppIdentifier": "is.workflow.actions",
	"Category": "Scripting",
	"Description": {
		"DescriptionInput": "The input passed to the shell script (stdin)",
		"DescriptionResult": "The output from the shell script (stdout)",
		"DescriptionSummary": "Runs a shell script using the specified shell."
	},
	"Input": {
		"Multiple": false,
		"Required": false,
		"Types": [
			"WFStringContentItem"
		]
	},
	"Name": "Run Shell Script",
	"Output": {
		"Multiple": false,
		"OutputName": "Shell Script Result",
		"Types": [
			"WFStringContentItem"
		]
	},
	"Parameters": [
		{
			"Class": "WFEnumerationParameter",
			"DefaultValue": "/bin/zsh",
			"Items": [
				"/bin/zsh",
				"/bin/bash",
				"/bin/sh",
				"/usr/bin/python3",
				"/usr/bin/perl",
				"/usr/bin/ruby"
			],
			"Key": "Shell",
			"Label": "Shell"
		},
		{
			"Class": "WFTextInputParameter",
			"Key": "Script",
			"Label": "Script",
			"Multiline": true,
			"Placeholder": "Script"
		},
		{
			"Class": "WFSwitchParameter",
			"DefaultValue": true,
			"Key": "WFInputPassthrough",
			"Label": "Pass Input"
		}
	],
	"Subcategory": "Shell"
}
```
