import { INodeProperties } from 'n8n-workflow';

// When the resource `httpVerb` is selected, this `operation` parameter will be shown.
export const httpVerbOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: {
				resource: ['httpVerb'],
			},
		},
		options: [
			{
				name: 'GET',
				value: 'get',
				// action: 'Perform a GET request', // TODO: Uncomment once #3610 merged to master
				routing: {
					request: {
						method: 'GET',
						url: '/get',
					},
				},
			},
			{
				name: 'DELETE',
				value: 'delete',
				// action: 'Perform a DELETE request', // TODO: Uncomment once #3610 merged to master
				routing: {
					request: {
						method: 'DELETE',
						url: '/delete',
					},
				},
			},
		],
		default: 'get',
	},
];

// Here we define what to show when the `get` operation is selected.
// We do that by adding `operation: ["get"]` to `displayOptions.show`
const getOperation: INodeProperties[] = [
	{
		name: 'typeofData',
		default: 'queryParameter',
		description: 'Select type of data to send [Query Parameters]',
		displayName: 'Type of Data',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['get'],
			},
		},
		type: 'options',
		options: [
			{
				name: 'Query',
				value: 'queryParameter',
			},
		],
		required: true,
	},
	{
		name: 'arguments',
		default: {},
		description: "The request's query parameters",
		displayName: 'Query Parameters',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['get'],
			},
		},
		options: [
			{
				name: 'keyvalue',
				displayName: 'Key:Value',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						required: true,
						description: 'Key of query parameter',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '={{$parent.key}}',
								type: 'query',
							},
						},
						required: true,
						description: 'Value of query parameter',
					},
				],
			},
		],
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
	},
];

// Here we define what to show when the DELETE Operation is selected.
// We do that by adding `operation: ["delete"]` to `displayOptions.show`
const deleteOperation: INodeProperties[] = [
	{
		name: 'typeofData',
		default: 'queryParameter',
		description: 'Select type of data to send [Query Parameter Arguments, JSON-Body]',
		displayName: 'Type of Data',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['delete'],
			},
		},
		options: [
			{
				name: 'Query',
				value: 'queryParameter',
			},
			{
				name: 'JSON',
				value: 'jsonData',
			},
		],
		required: true,
		type: 'options',
	},
	{
		name: 'arguments',
		default: {},
		description: "The request's query parameters",
		displayName: 'Query Parameters',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['delete'],
				typeofData: ['queryParameter'],
			},
		},
		options: [
			{
				name: 'keyvalue',
				displayName: 'Key:Value',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						required: true,
						description: 'Key of query parameter',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '={{$parent.key}}',
								type: 'query',
							},
						},
						required: true,
						description: 'Value of query parameter',
					},
				],
			},
		],
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
	},
	{
		name: 'arguments',
		default: {},
		description: "The request's JSON properties",
		displayName: 'JSON Object',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['delete'],
				typeofData: ['jsonData'],
			},
		},
		options: [
			{
				name: 'keyvalue',
				displayName: 'Key:Value',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						required: true,
						description: 'Key of JSON property',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '={{$parent.key}}',
								type: 'body',
							},
						},
						required: true,
						description: 'Value of JSON property',
					},
				],
			},
		],
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
	},
];

export const httpVerbFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                httpVerb:get                                */
	/* -------------------------------------------------------------------------- */
	...getOperation,

	/* -------------------------------------------------------------------------- */
	/*                              httpVerb:delete                               */
	/* -------------------------------------------------------------------------- */
	...deleteOperation,
];
