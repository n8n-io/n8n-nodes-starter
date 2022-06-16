import { INodeType, INodeTypeDescription } from "n8n-workflow";
import { httpVerbOperations, httpVerbFields } from "./HttpVerbDescriptions";

export class HttpBin implements INodeType {
	description: INodeTypeDescription = {
		displayName: "HttpBin",
		name: "httpbin",
		icon: "file:httpbin.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "Interact with HttpBin API",
		defaults: {
			name: "HttpBin",
			color: "#3b4151",
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "httpbinApi",
				required: false,
			},
		],
		requestDefaults: {
			baseURL: "https://httpbin.org",
			url: "",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * Resource & Operation
		 *
		 */
		properties: [
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				options: [
					{
						name: "HTTP Verbs",
						value: "httpverbs",
					},
					{
						name: "Auth Methods",
						value: "authmethods",
					},
				],
				default: "httpverbs",
			},
			...httpVerbOperations,
			...httpVerbFields,
		],
	};
}
