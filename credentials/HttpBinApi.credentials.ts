import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class HttpBinApi implements ICredentialType {
	name = 'httpbinApi';
	displayName = 'HttpBin API';
	documentationUrl = 'httpbin';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
		},
		// {
		// 	displayName: "API Key",
		// 	name: "apiKey",
		// 	type: "string",
		// 	default: "",
		// },
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: 'https://httpbin.org',
		},
	];

	// authenticate = {
	// 	type: "headerAuth",
	// 	properties: {
	// 		name: "api-key",
	// 		value: "={{$credentials.apiKey}}",
	// 	},
	// } as IAuthenticateHeaderAuth;

	authenticate = async (
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> => {
		const headers = requestOptions.headers || {};
		const authentication = { Authorization: `Bearer ${credentials.token}` };
		Object.assign(requestOptions, {
			headers: { ...authentication, ...headers },
		});
		return requestOptions;
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.domain}}',
			url: '/bearer',
		},
	};
}
