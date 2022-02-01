import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeCredentialTestResult,
} from 'n8n-workflow';

import {
	contactFields,
	contactOperations,
} from './ContactDescription';

import {
	friendGridApiRequest,
} from './GenericFunctions';

import {
	OptionsWithUri
} from 'request';

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
				testedBy: 'testFriendGridApiAuth',
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

	methods = {
		credentialTest: {
			async testFriendGridApiAuth(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<NodeCredentialTestResult> {

				// https://docs.sendgrid.com/api-reference/users-api/retrieve-your-username
				const options: OptionsWithUri = {
					method: 'GET',
					headers: {
						'Accept': ' application/json',
						'Authorization': `Bearer ${credential!.data!.apiKey}`,
					},
					uri: 'https://api.sendgrid.com/v3/marketing/user/username',
					json: true,
				};

				try {
					const response = await this.helpers.request(options);

					if (response.error) {
						return {
							status: 'Error',
							message: `${response.error}`,
						};
					}
				} catch (err) {
					return {
						status: 'Error',
						message: `${err.message}`,
					};
				}

				return {
					status: 'OK',
					message: 'Connection successful!',
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData;
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		let body: IDataObject = {};
		const qs: IDataObject = {};

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'contact') {
					if (operation === 'create') {
						// https://docs.sendgrid.com/api-reference/contacts/add-or-update-a-contact

						const email = this.getNodeParameter('email', i) as string;

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const data: IDataObject = {
							email,
						};

						Object.assign(data, additionalFields);

						body = {
							contacts: [
								data,
							],
						};

						responseData = await friendGridApiRequest.call(this, 'POST', '/marketing/contact', body);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
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