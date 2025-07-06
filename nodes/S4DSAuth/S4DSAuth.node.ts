import { INodeType, INodeTypeDescription, NodeConnectionType, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { authOperations, authFields } from './AuthDescription';

export class S4DSAuth implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'S4DS Authentication',
		name: 's4dsAuth',
		icon: { light: 'file:s4ds.svg', dark: 'file:s4ds.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Authenticate with S4DS API and manage tokens',
		defaults: {
			name: 'S4DS Auth',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 's4dsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.s4dsApi.baseUrl === "custom" ? $credentials.s4dsApi.customBaseUrl : $credentials.s4dsApi.baseUrl}}',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Authentication',
						value: 'auth',
					},
				],
				default: 'auth',
			},
			...authOperations,
			...authFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'auth') {
					if (operation === 'generateToken') {
						// Obtener credenciales
						const credentials = await this.getCredentials('s4dsApi');
						
						// Determinar la URL base
						let baseUrl = credentials.baseUrl;
						if (baseUrl === 'custom') {
							baseUrl = credentials.customBaseUrl;
						}
						
						if (!baseUrl) {
							throw new Error('Base URL is required. Please configure the S4DS API credentials.');
						}

						// Ejecutar la petición HTTP para generar token
						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/login/generateToken`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								username: credentials.username,
								password: credentials.password,
							},
						});

						// Almacenar token en contexto
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							storeInContext?: boolean;
							tokenContextKey?: string;
						};

						const contextKey = additionalFields.tokenContextKey || 's4ds_token';
						const tokenData = {
							token: response.token,
							token_type: response.token_type,
							expires_in: response.expires_in,
							expires_at: new Date(Date.now() + response.expires_in * 1000).toISOString(),
							authorization_header: `${response.token_type} ${response.token}`,
						};
						
						// Almacenar en contexto del workflow
						this.getWorkflowStaticData('global')[contextKey] = tokenData;

						// Retornar respuesta sin el token por seguridad
						const secureResponse = {
							success: true,
							token_type: response.token_type,
							expires_in: response.expires_in,
							expires_at: tokenData.expires_at,
							message: 'Token generated successfully and stored in workflow context',
							context_key: contextKey,
						};

						returnData.push({
							json: secureResponse,
						});
					} else if (operation === 'validateToken') {
						const token = this.getNodeParameter('token', i) as string;
						
						// Obtener credenciales
						const credentials = await this.getCredentials('s4dsApi');
						
						// Determinar la URL base
						let baseUrl = credentials.baseUrl;
						if (baseUrl === 'custom') {
							baseUrl = credentials.customBaseUrl;
						}
						
						if (!baseUrl) {
							throw new Error('Base URL is required. Please configure the S4DS API credentials.');
						}

						// Ejecutar validación de token
						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/auth/validate`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${token}`,
							},
						});

						returnData.push({
							json: response,
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 