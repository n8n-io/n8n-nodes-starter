import type { INodeProperties } from 'n8n-workflow';

export const sendBulkOperation: INodeProperties[] = [
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
				operation: ['sendBulk'],
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
				operation: ['sendBulk'],
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
		displayName: 'Recipients',
		name: 'recipients',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Recipient',
		},
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['mail'],
				operation: ['sendBulk'],
			},
		},
		options: [
			{
				name: 'recipientValues',
				displayName: 'Recipient',
				values: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'recipient@example.com',
						description: 'Recipient email address',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Recipient name',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'to',
				preSend: [
					async function (this, requestOptions) {
						const recipients = this.getNodeParameter('recipients') as {
							recipientValues?: Array<{ email: string; name?: string }>;
						};
						if (recipients?.recipientValues && Array.isArray(recipients.recipientValues)) {
							requestOptions.body = requestOptions.body || {};
							(requestOptions.body as Record<string, unknown>).to = recipients.recipientValues;
						}
						return requestOptions;
					},
				],
			},
		},
		description: 'List of recipients (up to 100 per request)',
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
				operation: ['sendBulk'],
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
				operation: ['sendBulk'],
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
				operation: ['sendBulk'],
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
				operation: ['sendBulk'],
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
				operation: ['sendBulk'],
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
				operation: ['sendBulk'],
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
				operation: ['sendBulk'],
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
		],
	},
];
