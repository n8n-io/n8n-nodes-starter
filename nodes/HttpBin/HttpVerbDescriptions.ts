import { INodeProperties } from "n8n-workflow";

/**
 *	This maps the operations to when the Resource option HTTP Verbs is selected
 */
export const httpVerbOperations: Array<INodeProperties> = [
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
				value: "get",
				routing: {
					request: {
						method: "GET",
						url: "/get",
					},
				},
			},
			{
				name: "DELETE",
				value: "delete",
				routing: {
					request: {
						method: "DELETE",
						url: "/delete",
					},
				},
			},
		],
		default: "get",
	},
];

/**
 *
 * Here we define what to show when the GET Operation is selected
 *
 * We do that by adding operation: ["get"], to "displayOptions.show"
 */
const getOperation: Array<INodeProperties> = [
	{
		name: "typeofData",
		default: "queryParameter",
		description: "Select type of data to send [Query Parameters]",
		displayName: "Type of Data",
		displayOptions: {
			show: {
				resource: ["httpverbs"],
				operation: ["get"],
			},
		},
		type: "options",
		options: [
			{
				name: "Query",
				value: "queryParameter",
			},
		],
		required: true,
	},
	{
		name: "arguments",
		default: {},
		description: "The request's query parameters",
		displayName: "Query Parameters",
		displayOptions: {
			show: {
				resource: ["httpverbs"],
				operation: ["get"],
			},
		},
		options: [
			{
				name: "keyvalue",
				displayName: "Key:Value",
				values: [
					{
						displayName: "Key",
						name: "key",
						type: "string",
						default: "",
						required: true,
						description: "Key of query parameter",
					},
					{
						displayName: "Value",
						name: "value",
						type: "string",
						default: "",
						routing: {
							send: {
								property: "={{$parent.key}}",
								type: "query",
							},
						},
						required: true,
						description: "Value of query parameter",
					},
				],
			},
		],
		type: "fixedCollection",
		typeOptions: {
			multipleValues: true,
		},
	},
];

/**
 *
 * Here we define what to show when the DELETE Operation is selected
 *
 * We do that by adding operation: ["delete"], to "displayOptions.show"
 */
const deleteOperation: Array<INodeProperties> = [
	{
		name: "typeofData",
		default: "queryParameter",
		description:
			"Select type of data to send [Query Parameter Arguments, JSON-Body]",
		displayName: "Type of Data",
		displayOptions: {
			show: {
				resource: ["httpverbs"],
				operation: ["delete"],
			},
		},
		options: [
			{
				name: "Query",
				value: "queryParameter",
			},
			{
				name: "JSON",
				value: "jsonData",
			},
		],
		required: true,
		type: "options",
	},
	{
		name: "arguments",
		default: {},
		description: "The request's query parameters",
		displayName: "Query Parameters",
		displayOptions: {
			show: {
				resource: ["httpverbs"],
				operation: ["delete"],
				typeofData: ["queryParameter"],
			},
		},
		options: [
			{
				name: "keyvalue",
				displayName: "Key:Value",
				values: [
					{
						displayName: "Key",
						name: "key",
						type: "string",
						default: "",
						required: true,
						description: "Key of query parameter",
					},
					{
						displayName: "Value",
						name: "value",
						type: "string",
						default: "",
						routing: {
							send: {
								property: "={{$parent.key}}",
								type: "query",
							},
						},
						required: true,
						description: "Value of query parameter",
					},
				],
			},
		],
		type: "fixedCollection",
		typeOptions: {
			multipleValues: true,
		},
	},
	{
		name: "arguments",
		default: {},
		description: "The request's JSON properties",
		displayName: "JSON Object",
		displayOptions: {
			show: {
				resource: ["httpverbs"],
				operation: ["delete"],
				typeofData: ["jsonData"],
			},
		},
		options: [
			{
				name: "keyvalue",
				displayName: "Key:Value",
				values: [
					{
						displayName: "Key",
						name: "key",
						type: "string",
						default: "",
						required: true,
						description: "Key of json property",
					},
					{
						displayName: "Value",
						name: "value",
						type: "string",
						default: "",
						routing: {
							send: {
								property: "={{$parent.key}}",
								type: "body",
							},
						},
						required: true,
						description: "Value of json property",
					},
				],
			},
		],
		type: "fixedCollection",
		typeOptions: {
			multipleValues: true,
		},
	},
];

export const httpVerbFields: Array<INodeProperties> = [
	/* -------------------------------------------------------------------------- */
	/*                                Http Verbs:Get                               */
	/* -------------------------------------------------------------------------- */
	...getOperation,

	/* -------------------------------------------------------------------------- */
	/*                                Http Verbs:Delete                           */
	/* -------------------------------------------------------------------------- */
	...deleteOperation,
];
