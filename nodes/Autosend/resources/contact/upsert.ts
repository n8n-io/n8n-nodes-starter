import type { INodeProperties } from 'n8n-workflow';

export const upsertOperation: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		placeholder: 'contact@example.com',
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['upsert'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'email',
			},
		},
		description: 'The email address of the contact',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['upsert'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'userId',
			},
		},
		description: 'External user ID from your system',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['upsert'],
			},
		},
		options: [
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'company',
					},
				},
				description: 'Company name',
			},
			{
				displayName: 'Custom Fields (JSON)',
				name: 'customFields',
				type: 'json',
				default: '{}',
				routing: {
					send: {
						type: 'body',
						property: 'customFields',
						preSend: [
							async function (this, requestOptions) {
								const customFieldsStr = this.getNodeParameter(
									'additionalFields.customFields',
									'',
								) as string;
								if (customFieldsStr) {
									try {
										const customFields = JSON.parse(customFieldsStr);
										requestOptions.body = requestOptions.body || {};
										(requestOptions.body as Record<string, unknown>).customFields = customFields;
									} catch {
										throw new Error('Custom Fields must be valid JSON');
									}
								}
								return requestOptions;
							},
						],
					},
				},
				description: 'Additional custom fields as a JSON object',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'firstName',
					},
				},
				description: 'First name of the contact',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'lastName',
					},
				},
				description: 'Last name of the contact',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'phone',
					},
				},
				description: 'Phone number of the contact',
			},
		],
	},
];
