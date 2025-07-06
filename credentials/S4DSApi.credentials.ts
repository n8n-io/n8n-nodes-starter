import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class S4DSApi implements ICredentialType {
	name = 's4dsApi';
	displayName = 'S4DS API';
	documentationUrl = 'https://docs.n8n.io/integrations/builtin/credentials/s4ds/';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'options',
			options: [
				{
					name: 'Demo Test',
					value: 'https://demotest.s4ds.com/demoapi-test',
				},
				{
					name: 'Demo UAT',
					value: 'https://demouat.s4ds.com/demoapi-uat',
				},
				{
					name: 'Demo Production',
					value: 'https://demoprod.s4ds.com/demoapi-prod',
				},
				{
					name: 'Cliente 1 Test',
					value: 'https://cliente1test.s4ds.com/cliente1api-test',
				},
				{
					name: 'Cliente 1 UAT',
					value: 'https://cliente1uat.s4ds.com/cliente1api-uat',
				},
				{
					name: 'Cliente 1 Production',
					value: 'https://cliente1prod.s4ds.com/cliente1api-prod',
				},
				{
					name: 'Cliente 2 Test',
					value: 'https://cliente2test.s4ds.com/cliente2api-test',
				},
				{
					name: 'Cliente 2 UAT',
					value: 'https://cliente2uat.s4ds.com/cliente2api-uat',
				},
				{
					name: 'Cliente 2 Production',
					value: 'https://cliente2prod.s4ds.com/cliente2api-prod',
				},
				{
					name: 'Custom URL',
					value: 'custom',
				},
			],
			default: 'https://demotest.s4ds.com/demoapi-test',
			description: 'Select the S4DS environment and client',
		},
		{
			displayName: 'Custom Base URL',
			name: 'customBaseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-custom-domain.s4ds.com/yourapi',
			description: 'Custom base URL for S4DS API',
			displayOptions: {
				show: {
					baseUrl: ['custom'],
				},
			},
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'Username for S4DS authentication',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Password for S4DS authentication',
		},
		{
			displayName: 'Timeout',
			name: 'timeout',
			type: 'number',
			default: 30000,
			description: 'Request timeout in milliseconds',
		},
	];
} 