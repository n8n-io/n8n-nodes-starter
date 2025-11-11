import type { INodeProperties } from 'n8n-workflow';

export const getOperation: INodeProperties[] = [
	{
		displayName: 'Search By',
		name: 'searchBy',
		type: 'options',
		required: true,
		default: 'email',
		options: [
			{
				name: 'Email',
				value: 'email',
				description: 'Search contact by email address',
			},
			{
				name: 'ID',
				value: 'id',
				description: 'Search contact by ID',
			},
		],
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get'],
			},
		},
		description: 'How to search for the contact',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get'],
				searchBy: ['id'],
			},
		},
		routing: {
			request: {
				url: '=/contacts/{{$parameter.contactId}}',
			},
		},
		description: 'The ID of the contact to retrieve',
	},
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
				operation: ['get'],
				searchBy: ['email'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'emails',
				preSend: [
					async function (this, requestOptions) {
						const email = this.getNodeParameter('email') as string;
						requestOptions.body = requestOptions.body || {};
						(requestOptions.body as Record<string, unknown>).emails = [email];
						return requestOptions;
					},
				],
			},
		},
		description: 'The email address of the contact to search for',
	},
];
