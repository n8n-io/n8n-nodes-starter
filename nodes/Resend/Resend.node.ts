import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Resend implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Resend',
		name: 'resend',
		icon: 'file:Resend.svg',
		group: ['output'],
		version: 1,
		description: 'Sends emails via Resend API',
		defaults: {
			name: 'Resend',
			color: '#000000',
		},
		credentials: [
			{
				name: 'resendApi',
				required: true,
			},
		],
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Send Email',
						value: 'sendEmail',
						action: 'Send an email',
						routing: {
							request: {
								method: 'POST',
								url: 'https://api.resend.com/emails',
							},
						},
					},
				],
				default: 'sendEmail',
			},
			// Properties for "Send Email" operation
			{
				displayName: 'From',
				name: 'fromEmail',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'you@example.com',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
				description: 'Sender email address',
			},
			{
				displayName: 'To',
				name: 'toEmail',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'user@example.com',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
				description: 'Comma-separated list of recipient email addresses',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'Hello from n8n!',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
			},
			{
				displayName: 'HTML',
				name: 'htmlBody',
				type: 'string',
				required: true,
				default: '',
				typeOptions: {
					multiline: true,
				},
				placeholder: '<p>Your HTML content here</p>',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
			},
			{
				displayName: 'Text',
				name: 'textBody',
				type: 'string',
				default: '',
				placeholder: 'Your plain text content here',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
				description: 'Plain text content of the email (optional)',
			},
			{
				displayName: 'CC',
				name: 'ccEmail',
				type: 'string',
				default: '',
				placeholder: 'cc@example.com',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
				description: 'Comma-separated list of CC email addresses',
			},
			{
				displayName: 'BCC',
				name: 'bccEmail',
				type: 'string',
				default: '',
				placeholder: 'bcc@example.com',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
				description: 'Comma-separated list of BCC email addresses',
			},
			{
				displayName: 'Reply To',
				name: 'replyToEmail',
				type: 'string',
				default: '',
				placeholder: 'reply@example.com',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
				description: 'Email address to set as reply-to',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Tag',
				displayOptions: {
					show: {
						operation: ['sendEmail'],
					},
				},
				properties: [
					{
						name: 'tag',
						displayName: 'Tag',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
				description: 'Tags to categorize the email',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		for (let i = 0; i < length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const credentials = await this.getCredentials('resendApi');
				const apiKey = credentials.apiKey as string;

				if (operation === 'sendEmail') {
					const fromEmail = this.getNodeParameter('fromEmail', i) as string;
					const toEmail = this.getNodeParameter('toEmail', i) as string;
					const subject = this.getNodeParameter('subject', i) as string;
					const htmlBody = this.getNodeParameter('htmlBody', i) as string;
					const textBody = this.getNodeParameter('textBody', i, '') as string;
					const ccEmail = this.getNodeParameter('ccEmail', i, '') as string;
					const bccEmail = this.getNodeParameter('bccEmail', i, '') as string;
					const replyToEmail = this.getNodeParameter('replyToEmail', i, '') as string;
					const tagsData = this.getNodeParameter('tags', i, { tag: [] }) as { tag: Array<{ name: string; value: string }> };

					const requestBody: any = {
						from: fromEmail,
						to: toEmail.split(',').map(email => email.trim()).filter(email => email),
						subject: subject,
						html: htmlBody,
					};

					if (textBody) {
						requestBody.text = textBody;
					}
					if (ccEmail) {
						requestBody.cc = ccEmail.split(',').map(email => email.trim()).filter(email => email);
					}
					if (bccEmail) {
						requestBody.bcc = bccEmail.split(',').map(email => email.trim()).filter(email => email);
					}
					if (replyToEmail) {
						requestBody.reply_to = replyToEmail;
					}
					if (tagsData.tag && tagsData.tag.length > 0) {
						requestBody.tags = tagsData.tag.map(t => ({ name: t.name, value: t.value }));
					}

					const response = await this.helpers.httpRequest({
						url: 'https://api.resend.com/emails',
						method: 'POST',
						headers: {
							Authorization: `Bearer ${apiKey}`,
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					});

					returnData.push({ json: response, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error);
			}
		}
		return [returnData];
	}
}
