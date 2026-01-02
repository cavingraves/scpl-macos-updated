
## Ask LLM / AskLLM (internally `is.workflow.actions.askllm`)


## description

### summary

Sends a prompt to an AI model (Apple Intelligence or ChatGPT) and returns the response.


### usage
```
AskLLM model=("Apple Intelligence" | "Apple Intelligence on Device" | "ChatGPT") prompt="string" followUp=(true | false | variable) resultType=("Text" | "Boolean" | "Number")
```

### arguments

---

### model: Enumeration [(Docs)](../gettingstarted#enum-select-field)
**Default Value**: `"Apple Intelligence"`
**Allows Variables**: true



Accepts a string 
or variable
containing one of the options:

- `Apple Intelligence`
- `Apple Intelligence on Device`
- `ChatGPT`

---

### prompt: Text [(Docs)](../gettingstarted#text-field)
**Placeholder**: `"Enter your prompt..."`
**Allows Variables**: true



Accepts a string 
or text
with the text. Allows newlines.

---

### followUp: Switch [(Docs)](../gettingstarted#switch-or-expanding-or-boolean-fields)
**Allows Variables**: true



Accepts a boolean
or a variable.

---

### resultType: Enumeration [(Docs)](../gettingstarted#enum-select-field)
**Default Value**: `"Text"`
**Allows Variables**: true



Accepts a string 
or variable
containing one of the options:

- `Text`
- `Boolean`
- `Number`

---

### source json (for developers)

```json
{
	"ActionClass": "WFAskLLMAction",
	"ActionKeywords": [
		"ai",
		"llm",
		"model",
		"apple intelligence",
		"chatgpt",
		"prompt",
		"generate",
		"ask"
	],
	"AppIdentifier": "is.workflow.actions",
	"Category": "Scripting",
	"Description": {
		"DescriptionSummary": "Sends a prompt to an AI model (Apple Intelligence or ChatGPT) and returns the response."
	},
	"IconName": "Scripting.png",
	"Name": "Ask LLM",
	"Output": {
		"Multiple": false,
		"OutputName": "LLM Response",
		"Types": [
			"NSString",
			"NSNumber",
			"WFBooleanContentItem"
		]
	},
	"Parameters": [
		{
			"Class": "WFEnumerationParameter",
			"DefaultValue": "Apple Intelligence",
			"Items": [
				"Apple Intelligence",
				"Apple Intelligence on Device",
				"ChatGPT"
			],
			"Key": "WFLLMModel",
			"Label": "Model"
		},
		{
			"Class": "WFTextInputParameter",
			"Key": "WFLLMPrompt",
			"Label": "Prompt",
			"Multiline": true,
			"Placeholder": "Enter your prompt..."
		},
		{
			"Class": "WFSwitchParameter",
			"DefaultValue": false,
			"Key": "WFLLMFollowUp",
			"Label": "Follow-Up"
		},
		{
			"Class": "WFEnumerationParameter",
			"DefaultValue": "Text",
			"Items": [
				"Text",
				"Boolean",
				"Number"
			],
			"Key": "WFLLMResultType",
			"Label": "Result Type"
		}
	],
	"Subcategory": "AI"
}
```
