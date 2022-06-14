import { INodeType, INodeTypeDescription } from "n8n-workflow";

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
			name: "Sendinblue",
			color: "#044a75",
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "sendinblueApi",
				required: true,
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
		properties: [],
	};
}
