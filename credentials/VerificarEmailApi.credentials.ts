import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VerificarEmailApi implements ICredentialType {
	name = 'verificarEmailApi';
	displayName = 'Verificar Email API';
    icon: Icon = 'file:mail-mail-email.svg';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Keyy',
			name: 'apiKey',
            typeOptions: {
                password: true,
            },
            type: 'string',
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				'api_key': '={{$credentials.apiKey}}'
			}
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: 'https://api.emailable.com/v1/verify', // Replace with actual endpoint
            qs: {
                email: 'dylan.bohorquez@agrosoft.com.ec', // Example email for testing
                api_key: '={{$credentials.apiKey}}'
            }
		},
	};
}