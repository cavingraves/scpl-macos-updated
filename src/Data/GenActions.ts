import * as builtin from "./Shortcuts 2.2.json";
import getTypes from "./GetTypes";
import { isCoercionTypeClass } from "../WFTypes/Types";
import * as fs from "fs";

import {
	ShortcutsActionSpec,
	ShortcutsContentItemPropertiesActionSpec,
	ShortcutsContentItemFilterActionSpec
} from "./ActionDataTypes/ShortcutsActionSpec";

const actions = <{ [key: string]: ShortcutsActionSpec }>builtin[0];

actions["is.workflow.actions.documentpicker.open"].Parameters![4].Hidden = true;
actions["is.workflow.actions.conditional"].BlockInfo = {
	Example: "\n  ...\notherwise\n  ...\nend",
	Completion: "\n\t$0\notherwise\nend"
};
actions["is.workflow.actions.choosefrommenu"].BlockInfo = {
	Example: "\ncase\n  ...\ncase\n  ...\nend",
	Completion: "\ncase\n\t$0\nend"
};
actions["is.workflow.actions.repeat.count"].BlockInfo = {
	Example: "\n  ...\nend",
	Completion: "\n\t$0\nend"
};
actions["is.workflow.actions.repeat.each"].BlockInfo = {
	Example: "\n  ...\nend",
	Completion: "\n\t$0\nend"
};

// append to note -> append to evernote note
actions["is.workflow.actions.evernote.append"].AppInfo = "Evernote";

// Add missing name for Facebook action
actions["is.workflow.actions.postonfacebook"].Name = "Post on Facebook";

// Add Run Shell Script action (macOS Tahoe)
(actions as any)["is.workflow.actions.runshellscript"] = {
	ActionClass: "WFRunShellScriptAction",
	ActionKeywords: ["shell", "bash", "zsh", "script", "terminal", "command", "unix", "linux"],
	AppIdentifier: "is.workflow.actions",
	Category: "Scripting",
	Description: {
		DescriptionInput: "The input passed to the shell script (stdin)",
		DescriptionResult: "The output from the shell script (stdout)",
		DescriptionSummary: "Runs a shell script using the specified shell."
	},
	Input: {
		Multiple: false,
		Required: false,
		Types: ["WFStringContentItem"]
	},
	Name: "Run Shell Script",
	Output: {
		Multiple: false,
		OutputName: "Shell Script Result",
		Types: ["WFStringContentItem"]
	},
	Parameters: [
		{
			Class: "WFEnumerationParameter",
			DefaultValue: "/bin/zsh",
			Items: ["/bin/zsh", "/bin/bash", "/bin/sh", "/usr/bin/python3", "/usr/bin/perl", "/usr/bin/ruby"],
			Key: "Shell",
			Label: "Shell"
		},
		{
			Class: "WFTextInputParameter",
			Key: "Script",
			Label: "Script",
			Multiline: true,
			Placeholder: "Script"
		},
		{
			Class: "WFSwitchParameter",
			DefaultValue: true,
			Key: "WFInputPassthrough",
			Label: "Pass Input"
		}
	],
	Subcategory: "Shell"
};

// Add Ask LLM action (Apple Intelligence - macOS Tahoe)
(actions as any)["is.workflow.actions.askllm"] = {
	ActionClass: "WFAskLLMAction",
	ActionKeywords: ["ai", "llm", "model", "apple intelligence", "chatgpt", "prompt", "generate", "ask"],
	AppIdentifier: "is.workflow.actions",
	Category: "Scripting",
	Description: {
		DescriptionSummary: "Sends a prompt to an AI model (Apple Intelligence or ChatGPT) and returns the response."
	},
	IconName: "Scripting.png",
	Name: "Ask LLM",
	Output: {
		Multiple: false,
		OutputName: "LLM Response",
		Types: ["NSString", "NSNumber", "WFBooleanContentItem"]
	},
	Parameters: [
		{
			Class: "WFEnumerationParameter",
			DefaultValue: "Apple Intelligence",
			Items: ["Apple Intelligence", "Apple Intelligence on Device", "ChatGPT"],
			Key: "WFLLMModel",
			Label: "Model"
		},
		{
			Class: "WFTextInputParameter",
			Key: "WFLLMPrompt",
			Label: "Prompt",
			Multiline: true,
			Placeholder: "Enter your prompt..."
		},
		{
			Class: "WFSwitchParameter",
			DefaultValue: false,
			Key: "WFLLMFollowUp",
			Label: "Follow-Up"
		},
		{
			Class: "WFEnumerationParameter",
			DefaultValue: "Text",
			Items: ["Text", "Boolean", "Number"],
			Key: "WFLLMResultType",
			Label: "Result Type"
		}
	],
	Subcategory: "AI"
};

function isContentItemPropertiesAction(
	action: ShortcutsActionSpec
): action is ShortcutsContentItemPropertiesActionSpec {
	return action.ActionClass === "WFContentItemPropertiesAction";
}

function isContentItemFilterAction(
	action: ShortcutsActionSpec
): action is ShortcutsContentItemFilterActionSpec {
	return action.ActionClass === "WFContentItemFilterAction";
}

Object.values(actions).forEach((action: ShortcutsActionSpec) => {
	if (isContentItemPropertiesAction(action)) {
		if (!action.Parameters) {
			action.Parameters = [];
		}
		const getTypeItemClass = action.WFContentItemClass;
		if (!isCoercionTypeClass(getTypeItemClass)) {
			action.Parameters.push({
				Class: "_UndefinedCoercionClass",
				Key: "_UndefinedCoercion"
			});
		} else {
			action.Parameters.push({
				Class: "WFEnumerationParameter",
				Key: "WFContentItemPropertyName",
				Label: "Get",
				Items: Object.values(getTypes[getTypeItemClass].properties).map(
					t => (<{ name: string }>t).name
				)
			});
		}
	} else if (isContentItemFilterAction(action)) {
		if (!action.Parameters) {
			action.Parameters = [];
		}
		const getTypeItemClass = action.WFContentItemClass;
		if (!isCoercionTypeClass(getTypeItemClass)) {
			// action.Parameters.push({ Class: "_UndefinedCoercionClass" });
		} else {
			action.Parameters.push({
				Class: "WFFilterParameter",
				Key: "WFContentItemFilter",
				Label: "Filter",
				ContentItemClass: getTypeItemClass
			});
			action.Parameters.push({
				Class: "WFEnumerationParameter",
				Key: "WFContentItemSortProperty",
				Label: "Sort by",
				Items: [
					...Object.values(getTypes[getTypeItemClass].properties).map(
						t => (<{ name: string }>t).name
					),
					"Random"
				]
			});
			action.Parameters.push({
				Class: "WFEnumerationParameter",
				Key: "WFContentItemSortOrder",
				Label: "Order",
				Items: [
					"Oldest First",
					"Newest First",
					"Latest First",
					"Smallest First",
					"Biggest First",
					"Ascending",
					"Descending",
					"Shortest First",
					"Longest First",
					"A to Z",
					"Z to A"
				],
				RequiredResources: [
					{
						WFParameterKey: "WFContentItemSortProperty",
						WFParameterValues: ["Random"],
						WFResourceClass: "WFParameterRelationResource",
						WFParameterRelation: "!="
					}
				]
			});
			action.Parameters.push({
				Class: "WFSwitchParameter",
				Key: "WFContentItemLimitEnabled",
				Label: "Limit"
			});
			action.Parameters.push({
				Class: "WFStepperParameter",
				Key: "WFContentItemLimitNumber",
				Label: "Get Items",
				RequiredResources: [
					{
						WFParameterKey: "WFSwitchParameter",
						WFParameterValues: [true],
						WFResourceClass: "WFParameterRelationResource"
					}
				]
			});
		}
	} else {
		// good, do nothing
	}
});

fs.writeFileSync(
	"./src/Data/OutActions.json",
	JSON.stringify(actions, null, "\t")
);
