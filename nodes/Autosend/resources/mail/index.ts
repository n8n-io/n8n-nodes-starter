import type { INodeProperties } from 'n8n-workflow';
import { sendOperation } from './send';
import { sendBulkOperation } from './sendBulk';

export const mailOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['mail'],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				description: 'Send a single email',
				action: 'Send an email',
				routing: {
					request: {
						method: 'POST',
						url: '/mails/send',
					},
				},
			},
			{
				name: 'Send Bulk',
				value: 'sendBulk',
				description: 'Send emails to multiple recipients',
				action: 'Send bulk emails',
				routing: {
					request: {
						method: 'POST',
						url: '/mails/bulk',
					},
				},
			},
		],
		default: 'send',
	},
];

export const mailFields: INodeProperties[] = [...sendOperation, ...sendBulkOperation];
