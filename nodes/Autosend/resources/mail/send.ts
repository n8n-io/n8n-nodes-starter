import type { INodeProperties } from 'n8n-workflow';

export const sendOperation: INodeProperties[] = [
	{
		displayName: 'From Email',
		name: 'fromEmail',
		type: 'string',
		required: true,
		placeholder: 'noreply@example.com',
		default: '',
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'from.email',
			},
		},
		description: 'The email address to send from',
	},
	{
		displayName: 'From Name',
		name: 'fromName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'from.name',
			},
		},
		description: 'The name to display as the sender',
	},
	{
		displayName: 'To Email',
		name: 'toEmail',
		type: 'string',
		required: true,
		placeholder: 'recipient@example.com',
		default: '',
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'to.email',
			},
		},
		description: 'The email address to send to',
	},
	{
		displayName: 'To Name',
		name: 'toName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'to.name',
			},
		},
		description: 'The name of the recipient',
	},
	{
		displayName: 'Email Content Type',
		name: 'contentType',
		type: 'options',
		required: true,
		default: 'template',
		options: [
			{
				name: 'Template',
				value: 'template',
				description: 'Use a pre-defined email template',
			},
			{
				name: 'Custom',
				value: 'custom',
				description: 'Provide custom HTML and text content',
			},
		],
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
			},
		},
		description: 'Whether to use a template or custom content',
	},
	// Template-based fields
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
				contentType: ['template'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'templateId',
			},
		},
		description: 'The ID of the email template to use',
	},
	{
		displayName: 'Template Variables',
		name: 'templateVariables',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
				contentType: ['template'],
			},
		},
		options: [
			{
				name: 'variables',
				displayName: 'Variable',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Variable name',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Variable value',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'variables',
				preSend: [
					// Transform the fixed collection into a simple object
					async function (this, requestOptions) {
						const variables = this.getNodeParameter('templateVariables') as {
							variables?: Array<{ key: string; value: string }>;
						};
						if (variables?.variables && Array.isArray(variables.variables)) {
							const variablesObj: Record<string, string> = {};
							for (const variable of variables.variables) {
								if (variable.key) {
									variablesObj[variable.key] = variable.value;
								}
							}
							requestOptions.body = requestOptions.body || {};
							(requestOptions.body as Record<string, unknown>).variables = variablesObj;
						}
						return requestOptions;
					},
				],
			},
		},
		description: 'Variables to use in the email template',
	},
	// Custom content fields
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
				contentType: ['custom'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'subject',
			},
		},
		description: 'The email subject line',
	},
	{
		displayName: 'HTML Content',
		name: 'html',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
				contentType: ['custom'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'html',
			},
		},
		description: 'The HTML content of the email',
	},
	{
		displayName: 'Text Content',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
				contentType: ['custom'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'text',
			},
		},
		description: 'The plain text content of the email (fallback for non-HTML clients)',
	},
	// Additional options
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Reply To',
				name: 'replyTo',
				type: 'string',
				default: '',
				placeholder: 'reply@example.com',
				routing: {
					send: {
						type: 'body',
						property: 'replyTo',
					},
				},
				description: 'Email address for replies',
			},
			{
				displayName: 'CC',
				name: 'cc',
				type: 'string',
				default: '',
				placeholder: 'cc@example.com',
				routing: {
					send: {
						type: 'body',
						property: 'cc',
					},
				},
				description: 'Carbon copy recipients (comma-separated)',
			},
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'string',
				default: '',
				placeholder: 'bcc@example.com',
				routing: {
					send: {
						type: 'body',
						property: 'bcc',
					},
				},
				description: 'Blind carbon copy recipients (comma-separated)',
			},
		],
	},
];
