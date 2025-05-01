import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BaseApi implements ICredentialType {
	name = 'baseApi';
	displayName = 'Base API';
	documentationUrl = 'https://docs.base.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The private key of your Base wallet',
		},
		{
			displayName: 'RPC URL',
			name: 'rpcUrl',
			type: 'string',
			default: 'https://api.mainnet-beta.base.com',
			required: true,
			description: 'The URL of the Base RPC node',
		},
		{
			displayName: 'OpenAI API Key',
			name: 'openAiApiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key for OpenAI services',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.rpcUrl}}',
			url: '/',
			method: 'POST',
			body: {
				jsonrpc: '2.0',
				id: 1,
				method: 'getHealth',
			},
		},
	};
} 