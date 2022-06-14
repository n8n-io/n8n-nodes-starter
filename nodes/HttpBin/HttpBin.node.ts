import { INodeType, INodeTypeDescription } from "n8n-workflow";

// Description of our Node
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
			baseURL: "={{$credentials.domain}}",
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
						name: "Http Verbs",
						value: "httpverbs",
					},
					{
						name: "Auth Methods",
						value: "authmethods",
					},
				],
				default: "httpverbs",
			},
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["httpverbs"],
					},
				},
				options: [
					{
						name: "GET",
						value: "getMethod",
					},
				],
				default: "getMethod",
			},
		],
	};
}
