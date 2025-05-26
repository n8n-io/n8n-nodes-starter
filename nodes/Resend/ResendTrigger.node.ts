import {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	INodeExecutionData,
} from 'n8n-workflow';
import { Webhook } from 'svix';

export class ResendTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Resend Trigger',
		name: 'resendTrigger',
		icon: 'file:Resend.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handles Resend webhooks for various email events',
		defaults: {
			name: 'Resend Trigger',
			color: '#000000',
		},
		inputs: [],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Webhook Signing Secret',
				name: 'webhookSigningSecret',
				type: 'string',
				required: true,
				default: '',
				description: 'Found in your Resend webhook configuration page (svix_... value).',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: ['email.sent'],
				options: [
					{ name: 'Email Sent', value: 'email.sent' },
					{ name: 'Email Delivered', value: 'email.delivered' },
					{ name: 'Email Delivery Delayed', value: 'email.delivery_delayed' },
					{ name: 'Email Complained', value: 'email.complained' },
					{ name: 'Email Bounced', value: 'email.bounced' },
					{ name: 'Email Opened', value: 'email.opened' },
					{ name: 'Email Clicked', value: 'email.clicked' },
					{ name: 'Contact Created', value: 'contact.created' },
					{ name: 'Contact Updated', value: 'contact.updated' },
					{ name: 'Contact Deleted', value: 'contact.deleted' },
					{ name: 'Domain Created', value: 'domain.created' },
					{ name: 'Domain Updated', value: 'domain.updated' },
					{ name: 'Domain Deleted', value: 'domain.deleted' },
				],
				description: 'Select the Resend event types to listen for.',
			},
		],
		webhookDescription: {
			webhookPath: 'webhook',
			webhookVerificationMethod: 'resendSignature',
			type: 'webhook',
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const bodyData = this.getBodyData();
		const subscribedEvents = this.getNodeParameter('events') as string[];

		if (!bodyData || typeof bodyData !== 'object' || !('type' in bodyData)) {
			// Resend should always send a JSON object with a 'type' field
			console.warn('Received webhook data that was not in the expected format.');
			return {
				workflowData: [],
			};
		}

		const eventType = (bodyData as { type: string }).type;

		if (subscribedEvents.includes(eventType)) {
			return {
				workflowData: [this.helpers.returnJsonArray([bodyData]) as INodeExecutionData[]],
			};
		} else {
			// Event type not subscribed to, log and ignore
			console.log(`Received event type "${eventType}" but not subscribed, ignoring.`);
			return {
				workflowData: [],
			};
		}
	}

	webhookMethods = {
		default: {
			async resendSignature(this: IHookFunctions): Promise<boolean> {
				const req = this.getRequestObject();
				const secret = this.getNodeParameter('webhookSigningSecret') as string;

				if (!secret.startsWith('whsec_')) {
					// Basic check for Resend's Svix signing secret format
					throw new NodeApiError(
						this.getNode(),
						{ message: 'Invalid Webhook Signing Secret format. It should start with "whsec_".' },
						{ statusCode: 400 },
					);
				}

				const svixId = req.headers['svix-id'] as string;
				const svixTimestamp = req.headers['svix-timestamp'] as string;
				const svixSignature = req.headers['svix-signature'] as string;

				if (!svixId || !svixTimestamp || !svixSignature) {
					throw new NodeApiError(
						this.getNode(),
						{ message: 'Request missing Svix headers' },
						{ statusCode: 400 },
					);
				}

				const payload = this.getRequestBody(); // Raw body

				try {
					const wh = new Webhook(secret);
					wh.verify(payload, {
						'svix-id': svixId,
						'svix-timestamp': svixTimestamp,
						'svix-signature': svixSignature,
					});
					return true;
				} catch (err: any) {
					const errorMessage = err instanceof Error ? err.message : 'Signature verification failed.';
					throw new NodeApiError(this.getNode(), { message: `Webhook signature verification failed: ${errorMessage}` }, { statusCode: 401 });
				}
			},
		},
	};
}
