import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	contactFields,
	contactOperations,
} from './descriptions';

import {
	friendGridApiRequest,
} from './GenericFunctions';

import {
	OptionsWithUri
} from 'request';

import { version } from '../version';

export class FriendGrid implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FriendGrid',
		name: 'friendGrid',
		icon: 'file:friendGrid.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: `Consume FriendGrid API (v.${version})`,
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
				required: true,
				type: 'options',
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'contact',
				description: 'Resource to consume',
			},
			...contactOperations,
			...contactFields,
			{
				displayName: 'Simplify Output',
				name: 'simplifyOutput',
				type: 'boolean',
				default: false,
				description: 'Whether to simplify the output data',
			},
		],
	};

	methods = {
		credentialTest: {
			async testFriendGridApiAuth(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult> {

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
				// tslint:disable-next-line:no-any
				} catch (err: any) {
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

		let method: string;
		let endpoint: string;
		const body: IDataObject = {};
		const qs: IDataObject = {}; // query string

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		let additionalFields;

		for (let i = 0; i < items.length; i++) {
			try {
				switch (resource) {
					case 'contact':
						switch (operation) {
							case 'create':
								// ----------------------------------
								//        contact:create
								// ----------------------------------

								// https://docs.sendgrid.com/api-reference/contacts/add-or-update-a-contact
								endpoint = '';
								method = 'POST';
								const email = this.getNodeParameter('email', i) as string;
								additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								const data: IDataObject = { email };
								Object.assign(data, additionalFields);
								body.contacts = [ data ];
								break;

							case 'directContractInsert':
								// ----------------------------------
								//        contract:directContractInsert
								// ----------------------------------

								// .........
								break;

							default: {
								throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for resource "${resource}"!`);
							}
						}
						break;

					case 'contractProducts':
						switch (operation) {
							case 'createDirectInvoice':
								// ----------------------------------
								//        contractProducts:createDirectInvoice
								// ----------------------------------

								// .........
								break;
							case 'getDirectInvoice':
								// ----------------------------------
								//        contractProducts:getDirectInvoice
								// ----------------------------------

								// .........
								break;

							default: {
								throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for resource "${resource}"!`);
							}
						}
						break;

					default: {
						throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported!`);
					}
				}

				responseData = await friendGridApiRequest.call(this, method, endpoint, body, qs);

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
				}
			// tslint:disable-next-line:no-any
			} catch (error: any) {
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
