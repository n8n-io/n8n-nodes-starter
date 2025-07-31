import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class ZapSignTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ZapSign Trigger',
		name: 'zapSignTrigger',
		icon: 'file:zapsign.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when ZapSign events occur',
		defaults: {
			name: 'ZapSign Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'zapSignApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Document Created',
						value: 'document.created',
						description: 'Triggered when a document is created',
					},
					{
						name: 'Document Sent',
						value: 'document.sent',
						description: 'Triggered when a document is sent for signature',
					},
					{
						name: 'Document Viewed',
						value: 'document.viewed',
						description: 'Triggered when a document is viewed by a signer',
					},
					{
						name: 'Document Signed',
						value: 'document.signed',
						description: 'Triggered when a document is signed by any signer',
					},
					{
						name: 'Document Completed',
						value: 'document.completed',
						description: 'Triggered when all signers have signed the document',
					},
					{
						name: 'Document Cancelled',
						value: 'document.cancelled',
						description: 'Triggered when a document is cancelled',
					},
					{
						name: 'Document Expired',
						value: 'document.expired',
						description: 'Triggered when a document expires',
					},
					{
						name: 'Signer Added',
						value: 'signer.added',
						description: 'Triggered when a signer is added to a document',
					},
					{
						name: 'Signer Signed',
						value: 'signer.signed',
						description: 'Triggered when a specific signer signs',
					},
					{
						name: 'Signer Declined',
						value: 'signer.declined',
						description: 'Triggered when a signer declines to sign',
					},
				],
				required: true,
				default: ['document.completed'],
				description: 'The events to listen for',
			},
			{
				displayName: 'Document Filter',
				name: 'documentFilter',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Document ID',
						name: 'documentId',
						type: 'string',
						default: '',
						description: 'Only trigger for specific document ID',
					},
					{
						displayName: 'Signer Email',
						name: 'signerEmail',
						type: 'string',
						default: '',
						description: 'Only trigger for specific signer email',
					},
					{
						displayName: 'Brand ID',
						name: 'brandId',
						type: 'string',
						default: '',
						description: 'Only trigger for specific brand ID',
					},
				],
			},
		],
	};

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
					async checkExists(this: IHookFunctions): Promise<boolean> {
			const webhookUrl = this.getNodeWebhookUrl('default');

				const credentials = await this.getCredentials('zapSignApi');
				const baseUrl = credentials.environment === 'sandbox' 
					? 'https://sandbox.api.zapsign.co' 
					: 'https://api.zapsign.co';

				try {
					const response = await this.helpers.request({
						method: 'GET',
						url: `${baseUrl}/v1/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
					});

					// Check if webhook with this URL already exists
					const webhooks = Array.isArray(response) ? response : response.data || [];
					for (const webhook of webhooks) {
						if (webhook.url === webhookUrl) {
							return true;
						}
					}
				} catch (error) {
					return false;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];

				const credentials = await this.getCredentials('zapSignApi');
				const baseUrl = credentials.environment === 'sandbox' 
					? 'https://sandbox.api.zapsign.co' 
					: 'https://api.zapsign.co';

				const body = {
					url: webhookUrl,
					events,
					name: `n8n-webhook-${Date.now()}`,
				};

				try {
					const responseData = await this.helpers.request({
						method: 'POST',
						url: `${baseUrl}/v1/webhooks`,
						body,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
					});

					if (responseData.id === undefined) {
						// We did not get back the ID which we need to delete the webhook
						return false;
					}

					webhookData.webhookId = responseData.id as string;
					return true;
				} catch (error) {
					return false;
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					const credentials = await this.getCredentials('zapSignApi');
					const baseUrl = credentials.environment === 'sandbox' 
						? 'https://sandbox.api.zapsign.co' 
						: 'https://api.zapsign.co';

					try {
						await this.helpers.request({
							method: 'DELETE',
							url: `${baseUrl}/v1/webhooks/${webhookData.webhookId}`,
							headers: {
								'Authorization': `Bearer ${credentials.apiKey}`,
							},
						});
					} catch (error) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const events = this.getNodeParameter('events') as string[];
		const documentFilter = this.getNodeParameter('documentFilter') as IDataObject;

		// Validate that this is a ZapSign webhook
		if (!bodyData.event || !bodyData.data) {
			return {
				webhookResponse: {
					status: 400,
					body: 'Invalid webhook payload',
				},
			};
		}

		const eventType = bodyData.event as string;

		// Check if we should handle this event
		if (!events.includes(eventType)) {
			return {
				webhookResponse: {
					status: 200,
					body: 'Event type not configured',
				},
			};
		}

		// Apply filters if configured
		const data = bodyData.data as IDataObject;
		if (documentFilter.documentId && (data.document as IDataObject)?.id !== documentFilter.documentId) {
			return {
				webhookResponse: {
					status: 200,
					body: 'Document ID filter not matched',
				},
			};
		}

		if (documentFilter.signerEmail && (data.signer as IDataObject)?.email !== documentFilter.signerEmail) {
			return {
				webhookResponse: {
					status: 200,
					body: 'Signer email filter not matched',
				},
			};
		}

		if (documentFilter.brandId && (data.document as IDataObject)?.brand_id !== documentFilter.brandId) {
			return {
				webhookResponse: {
					status: 200,
					body: 'Brand ID filter not matched',
				},
			};
		}

		// Enrich the payload with additional metadata
		const enrichedData = {
			...bodyData,
			metadata: {
				event_type: eventType,
				received_at: new Date().toISOString(),
				webhook_source: 'zapsign',
			},
		};

		return {
			workflowData: [this.helpers.returnJsonArray([enrichedData])],
		};
	}
}