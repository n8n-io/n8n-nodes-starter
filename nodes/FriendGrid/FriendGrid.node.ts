import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	contactFields,
	contactOperations,
} from './ContactDescription';

import {
	friendGridApiRequest,
} from './GenericFunctions';

export class FriendGrid implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FriendGrid',
		name: 'friendGrid',
		icon: 'file:friendGrid.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume FriendGrid API',
		defaults: {
				name: 'FriendGrid',
				color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'friendGridApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'contact',
				required: true,
				description: 'Resource to consume',
			},
			...contactOperations,
			...contactFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData;
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'contact') {
					if (operation === 'create') {

						const email = this.getNodeParameter('email', i) as string;

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const data: IDataObject = {
							email,
						};

						Object.assign(data, additionalFields);

						const body: IDataObject = {
							contacts: [
								data,
							],
						};

						responseData = await friendGridApiRequest.call(this, 'POST', '/contact', body);
					}
				}
				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}