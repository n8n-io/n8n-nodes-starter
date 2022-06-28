import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ExampleCredentials implements ICredentialType {
	name = 'exampleCredentials';
	displayName = 'Example Credentials';
	properties: INodeProperties[] = [
		// Credential data to request from the user, saved in encrypted format.
		// Credential properties are defined exactly like node properties.
		{
			displayName: 'Base URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: 'https://example.com',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			default: '',
		},
	];
}
