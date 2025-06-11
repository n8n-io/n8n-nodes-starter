import {
	// IAuthenticateGeneric, // Removed as 'authenticate' block is removed
	// ICredentialTestRequest, // Removed as 'test' block is removed
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// import * as sunoApi from '../../utils/sunoApi'; // Would be used for a real test

export class SunoApi implements ICredentialType { // Renamed class
	name = 'sunoApi'; // Renamed
	displayName = 'Suno API'; // Renamed
	documentationUrl = 'https://suno.ai/'; // Updated URL

	properties: INodeProperties[] = [
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	// The 'authenticate' object is removed for this phase.
	// Authentication will be handled by functions in utils/sunoApi.ts.
	// authenticate: IAuthenticateGeneric = { ... };

	// The 'test' object is removed for this phase.
	// It will be added back when actual API endpoints for testing are known
	// or if a more suitable mock test can be devised without calling sunoApi.ts directly.
	// test: ICredentialTestRequest = { ... };
}
