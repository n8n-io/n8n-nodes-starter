import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class ZapSign implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ZapSign',
		name: 'zapSign',
		icon: 'file:zapsign.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with ZapSign API for digital signatures',
		defaults: {
			name: 'ZapSign',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'zapSignApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Signer',
						value: 'signer',
					},
					{
						name: 'Template',
						value: 'template',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'document',
			},
			// Document operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new document',
						action: 'Create a document',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a document',
						action: 'Get a document',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many documents',
						action: 'Get many documents',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send document for signature',
						action: 'Send a document for signature',
					},
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel a document',
						action: 'Cancel a document',
					},
					{
						name: 'Download',
						value: 'download',
						description: 'Download a signed document',
						action: 'Download a document',
					},
				],
				default: 'create',
			},
			// Signer operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['signer'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add a signer to a document',
						action: 'Add a signer',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many signers of a document',
						action: 'Get many signers',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove a signer from a document',
						action: 'Remove a signer',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a signer',
						action: 'Update a signer',
					},
				],
				default: 'add',
			},
			// Template operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['template'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many templates',
						action: 'Get many templates',
					},
					{
						name: 'Create Document From Template',
						value: 'createDocument',
						action: 'Create document from template',
					},
				],
				default: 'getAll',
			},
			// Webhook operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a webhook',
						action: 'Create a webhook',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many webhooks',
						action: 'Get many webhooks',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a webhook',
						action: 'Delete a webhook',
					},
				],
				default: 'create',
			},
			// Document fields
			{
				displayName: 'Document Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['create'],
					},
				},
				description: 'Name of the document',
			},
			{
				displayName: 'File',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['create'],
					},
				},
				description: 'Name of the binary property containing the file data',
			},
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'send', 'cancel', 'download'],
					},
				},
				description: 'ID of the document',
			},
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['signer'],
						operation: ['add', 'getAll', 'remove', 'update'],
					},
				},
				description: 'ID of the document',
			},
			// Signer fields
			{
				displayName: 'Signer Email',
				name: 'signerEmail',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['signer'],
						operation: ['add', 'remove', 'update'],
					},
				},
				description: 'Email of the signer',
			},
			{
				displayName: 'Signer Name',
				name: 'signerName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['signer'],
						operation: ['add', 'update'],
					},
				},
				description: 'Name of the signer',
			},
			{
				displayName: 'Authentication Method',
				name: 'authMethod',
				type: 'options',
				options: [
					{
						name: 'Email',
						value: 'email',
					},
					{
						name: 'SMS',
						value: 'sms',
					},
					{
						name: 'WhatsApp',
						value: 'whatsapp',
					},
				],
				default: 'email',
				displayOptions: {
					show: {
						resource: ['signer'],
						operation: ['add', 'update'],
					},
				},
				description: 'Authentication method for the signer',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['signer'],
						operation: ['add', 'update'],
						authMethod: ['sms', 'whatsapp'],
					},
				},
				description: 'Phone number for SMS or WhatsApp authentication',
			},
			{
				displayName: 'Require Document Authentication',
				name: 'requireDocAuth',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['signer'],
						operation: ['add', 'update'],
					},
				},
				description: 'Whether to require document authentication (ID upload)',
			},
			{
				displayName: 'Require Facial Recognition',
				name: 'requireFacialRecognition',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['signer'],
						operation: ['add', 'update'],
					},
				},
				description: 'Whether to require facial recognition',
			},
			// Template fields
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['createDocument'],
					},
				},
				description: 'ID of the template',
			},
			// Webhook fields
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['create'],
					},
				},
				description: 'URL to receive webhook notifications',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Document Created',
						value: 'document.created',
					},
					{
						name: 'Document Sent',
						value: 'document.sent',
					},
					{
						name: 'Document Signed',
						value: 'document.signed',
					},
					{
						name: 'Document Completed',
						value: 'document.completed',
					},
					{
						name: 'Document Cancelled',
						value: 'document.cancelled',
					},
					{
						name: 'Signer Signed',
						value: 'signer.signed',
					},
				],
				default: ['document.completed'],
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['create'],
					},
				},
				description: 'Events to listen for',
			},
			{
				displayName: 'Webhook ID',
				name: 'webhookId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['delete'],
					},
				},
				description: 'ID of the webhook to delete',
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
						resource: ['document'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Brand ID',
						name: 'brandId',
						type: 'string',
						default: '',
						description: 'Brand ID for custom branding',
					},
					{
						displayName: 'Locale',
						name: 'locale',
						type: 'options',
						options: [
							{
								name: 'English',
								value: 'en',
							},
							{
								name: 'Portuguese (Brazil)',
								value: 'pt-BR',
							},
							{
								name: 'Spanish',
								value: 'es',
							},
						],
						default: 'en',
						description: 'Language for the document interface',
					},
				],
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['document', 'template', 'webhook'],
						operation: ['getAll'],
					},
				},
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'document') {
					if (operation === 'create') {
						// Create document
						const name = this.getNodeParameter('name', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);

						// For file upload, we need to use form-data
						const options: IRequestOptions = {
							method: 'POST',
							url: '/v1/documents',
							formData: {
								name,
								file: {
									value: Buffer.from(binaryData.data, 'base64'),
									options: {
										filename: binaryData.fileName || 'document.pdf',
										contentType: binaryData.mimeType || 'application/pdf',
									},
								},
								...additionalFields,
							},
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);

					} else if (operation === 'get') {
						// Get document
						const documentId = this.getNodeParameter('documentId', i) as string;

						const options: IRequestOptions = {
							method: 'GET',
							url: `/v1/documents/${documentId}`,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);

					} else if (operation === 'getAll') {
						// Get all documents
						const limit = this.getNodeParameter('limit', i) as number;

						const options: IRequestOptions = {
							method: 'GET',
							url: '/v1/documents',
							qs: {
								limit,
							},
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						
						// Handle pagination if API returns array or paginated response
						if (Array.isArray(responseData)) {
							returnData.push(...responseData);
						} else {
							returnData.push(responseData);
						}

					} else if (operation === 'send') {
						// Send document for signature
						const documentId = this.getNodeParameter('documentId', i) as string;

						const options: IRequestOptions = {
							method: 'POST',
							url: `/v1/documents/${documentId}/send`,
							body: {},
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);

					} else if (operation === 'cancel') {
						// Cancel document
						const documentId = this.getNodeParameter('documentId', i) as string;

						const options: IRequestOptions = {
							method: 'POST',
							url: `/v1/documents/${documentId}/cancel`,
							body: {},
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);

					} else if (operation === 'download') {
						// Download signed document
						const documentId = this.getNodeParameter('documentId', i) as string;

						const options: IRequestOptions = {
							method: 'GET',
							url: `/v1/documents/${documentId}/download`,
							encoding: null, // Get binary data
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);

						// Convert to binary data
						const binaryData = await this.helpers.prepareBinaryData(
							responseData as Buffer,
							`document-${documentId}.pdf`,
							'application/pdf',
						);

						returnData.push({
							json: { documentId, downloaded: true },
							binary: {
								data: binaryData,
							},
						});
					}

				} else if (resource === 'signer') {
					const documentId = this.getNodeParameter('documentId', i) as string;

					if (operation === 'add') {
						// Add signer
						const signerEmail = this.getNodeParameter('signerEmail', i) as string;
						const signerName = this.getNodeParameter('signerName', i) as string;
						const authMethod = this.getNodeParameter('authMethod', i) as string;
						const phoneNumber = this.getNodeParameter('phoneNumber', i, '') as string;
						const requireDocAuth = this.getNodeParameter('requireDocAuth', i) as boolean;
						const requireFacialRecognition = this.getNodeParameter('requireFacialRecognition', i) as boolean;

						const body: IDataObject = {
							email: signerEmail,
							name: signerName,
							auth_method: authMethod,
							require_doc_auth: requireDocAuth,
							require_facial_recognition: requireFacialRecognition,
						};

						if (phoneNumber) {
							body.phone_number = phoneNumber;
						}

						const options: IRequestOptions = {
							method: 'POST',
							url: `/v1/documents/${documentId}/signers`,
							body,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);

					} else if (operation === 'getAll') {
						// Get all signers
						const options: IRequestOptions = {
							method: 'GET',
							url: `/v1/documents/${documentId}/signers`,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);

						if (Array.isArray(responseData)) {
							returnData.push(...responseData);
						} else {
							returnData.push(responseData);
						}

					} else if (operation === 'remove') {
						// Remove signer
						const signerEmail = this.getNodeParameter('signerEmail', i) as string;

						const options: IRequestOptions = {
							method: 'DELETE',
							url: `/v1/documents/${documentId}/signers/${encodeURIComponent(signerEmail)}`,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);

					} else if (operation === 'update') {
						// Update signer
						const signerEmail = this.getNodeParameter('signerEmail', i) as string;
						const signerName = this.getNodeParameter('signerName', i) as string;
						const authMethod = this.getNodeParameter('authMethod', i) as string;
						const phoneNumber = this.getNodeParameter('phoneNumber', i, '') as string;
						const requireDocAuth = this.getNodeParameter('requireDocAuth', i) as boolean;
						const requireFacialRecognition = this.getNodeParameter('requireFacialRecognition', i) as boolean;

						const body: IDataObject = {
							name: signerName,
							auth_method: authMethod,
							require_doc_auth: requireDocAuth,
							require_facial_recognition: requireFacialRecognition,
						};

						if (phoneNumber) {
							body.phone_number = phoneNumber;
						}

						const options: IRequestOptions = {
							method: 'PUT',
							url: `/v1/documents/${documentId}/signers/${encodeURIComponent(signerEmail)}`,
							body,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);
					}

				} else if (resource === 'template') {
					if (operation === 'getAll') {
						// Get all templates
						const limit = this.getNodeParameter('limit', i) as number;

						const options: IRequestOptions = {
							method: 'GET',
							url: '/v1/templates',
							qs: {
								limit,
							},
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);

						if (Array.isArray(responseData)) {
							returnData.push(...responseData);
						} else {
							returnData.push(responseData);
						}

					} else if (operation === 'createDocument') {
						// Create document from template
						const templateId = this.getNodeParameter('templateId', i) as string;
						const name = this.getNodeParameter('name', i) as string;

						const body: IDataObject = {
							name,
							template_id: templateId,
						};

						const options: IRequestOptions = {
							method: 'POST',
							url: '/v1/documents/from-template',
							body,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);
					}

				} else if (resource === 'webhook') {
					if (operation === 'create') {
						// Create webhook
						const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
						const events = this.getNodeParameter('events', i) as string[];

						const body: IDataObject = {
							url: webhookUrl,
							events,
						};

						const options: IRequestOptions = {
							method: 'POST',
							url: '/v1/webhooks',
							body,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);

					} else if (operation === 'getAll') {
						// Get all webhooks
						const limit = this.getNodeParameter('limit', i) as number;

						const options: IRequestOptions = {
							method: 'GET',
							url: '/v1/webhooks',
							qs: {
								limit,
							},
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);

						if (Array.isArray(responseData)) {
							returnData.push(...responseData);
						} else {
							returnData.push(responseData);
						}

					} else if (operation === 'delete') {
						// Delete webhook
						const webhookId = this.getNodeParameter('webhookId', i) as string;

						const options: IRequestOptions = {
							method: 'DELETE',
							url: `/v1/webhooks/${webhookId}`,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'zapSignApi',
							options,
						);
						returnData.push(responseData);
					}
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						error: error.message,
						json: {},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}