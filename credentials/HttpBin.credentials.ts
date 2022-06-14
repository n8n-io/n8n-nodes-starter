import {
	IAuthenticateHeaderAuth,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

export class HttpBinApi implements ICredentialType {
	name = "httpbinApi";
	displayName = "HttpBin API";
	documentationUrl = "httpbin";
	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			default: "",
		},
		{
			displayName: "Domain",
			name: "domain",
			type: "string",
			default: "https://httpbin.org",
		},
	];
	authenticate = {
		type: "headerAuth",
		properties: {
			name: "api-key",
			value: "={{$credentials.apiKey}}",
		},
	} as IAuthenticateHeaderAuth;
	test: ICredentialTestRequest = {
		request: {
			baseURL: "={{$credentials?.domain}}/v3",
			url: "/account",
		},
	};
}
