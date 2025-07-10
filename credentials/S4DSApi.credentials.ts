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
					name: 'Demo TEST',
					value: 'https://demotest.s4ds.com/demoapi-test',
				},
				{
					name: 'Demo UAT',
					value: 'https://demouat.s4ds.com/demoapi-uat',
				},
				{
					name: 'Demo CORE',
					value: 'https://demo.s4ds.com/demoapi-core',
				},
				{
					name: 'Aquasource TEST',
					value: 'https://aquasourcetest.s4ds.com/aquasourceapi-test',
				},
				{
					name: 'Aquasource UAT',
					value: 'https://aquasourceuat.s4ds.com/aquasourceapi-uat',
				},
				{
					name: 'Aquasource CORE',
					value: 'https://aquasource.s4ds.com/aquasourceapi-core',
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