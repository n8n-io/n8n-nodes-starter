import type { INodeProperties } from 'n8n-workflow';
import { upsertOperation } from './upsert';
import { getOperation } from './get';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create or Update',
				value: 'upsert',
				description: 'Create a new record, or update the current one if it already exists (upsert)',
				action: 'Create or update a contact',
				routing: {
					request: {
						method: 'POST' as const,
						url: '/contacts/email',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact by ID or email',
				action: 'Get a contact',
				routing: {
					request: {
						method: 'GET' as const,
						url: '/contacts/{{$parameter.contactId}}',
					},
				},
			},
		],
		default: 'upsert',
	},
];

export const contactFields: INodeProperties[] = [
	...upsertOperation,
	...getOperation.map((field) => {
		// Override routing for email search to use the search endpoint
		if (field.name === 'email' && field.routing) {
			return {
				...field,
				routing: {
					...field.routing,
					request: {
						method: 'POST' as const,
						url: '/contacts/search/emails',
					},
				},
			} as INodeProperties;
		}
		return field;
	}),
];
