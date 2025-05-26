import {
	ICredentialType,
	INodeProperties,
	IAuthData,
} from 'n8n-workflow';

export class ResendApi implements ICredentialType {
	name = 'resendApi';
	displayName = 'Resend API';
	documentationUrl = 'https://resend.com/docs/api-reference/introduction';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
		},
	];
	// Use IAuthData for authentication
	authenticate: IAuthData = {
		type: 'apiToken',
		properties: {
			token: '={{$credentials.apiKey}}'
		}
	};
}
