import type {
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IExecuteFunctions,
} from 'n8n-workflow';
import { mailFields, mailOperations } from './resources/mail';
import { contactFields, contactOperations } from './resources/contact';

export class Autosend implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Autosend',
		name: 'autosend',
		icon: 'file:autosend.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Autosend API to send emails and manage contacts',
		defaults: {
			name: 'Autosend',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'autosendApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.autosend.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Mail',
						value: 'mail',
						description: 'Send emails using Autosend',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Manage contacts in Autosend',
					},
				],
				default: 'mail',
			},
			...mailOperations,
			...mailFields,
			...contactOperations,
			...contactFields,
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// This method is required but the declarative routing handles everything
		// This is only called if routing doesn't handle the request
		const items = this.getInputData();
		return [items];
	}
}
