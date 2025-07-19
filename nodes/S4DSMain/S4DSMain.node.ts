import { INodeType, INodeTypeDescription, NodeConnectionType, IExecuteFunctions, INodeExecutionData, IHttpRequestMethods } from 'n8n-workflow';
import { ApiHelper } from './ApiHelper';

export class S4DSMain implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'S4DS\'s APIs',
		name: 's4ds',
		icon: { light: 'file:logo_generic.png', dark: 'file:logo_generic.png' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
		description: 'S4DS API operations including authentication and product management',
		defaults: {
			name: 'S4DS\'s APIs',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
			...ApiHelper.getResources(),
			...ApiHelper.getOperations(),
			...ApiHelper.getFields(),
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				
				// Obtener definición de la API
				const apiDefinition = ApiHelper.getApiDefinition(resource, operation);
				if (!apiDefinition) {
					throw new Error(`API definition not found for resource: ${resource}, operation: ${operation}`);
				}

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

				// Preparar headers
				let headers: Record<string, string> = {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				};

				// Agregar autenticación si es requerida
				if (apiDefinition.requiresAuth) {
					// Siempre usar la key por defecto 's4ds_token'
					const contextKey = 's4ds_token';
					const contextData = this.getWorkflowStaticData('global');
					const tokenData = contextData[contextKey] as any;
					if (!tokenData || !tokenData.authorization_header) {
						throw new Error(`Token not found in context with key 's4ds_token'. Please run an authentication operation first.`);
					}
					headers.Authorization = tokenData.authorization_header;
				}

				// Preparar parámetros de query
				const queryParams: Record<string, any> = {};
				if (apiDefinition.parameters) {
					const queryParameters = this.getNodeParameter('queryParameters', i, {}) as Record<string, any>;
					apiDefinition.parameters
						.filter(p => p.in === 'query')
						.forEach(param => {
							if (queryParameters[param.name] !== undefined && queryParameters[param.name] !== '') {
								queryParams[param.name] = queryParameters[param.name];
							}
						});
				}

				// Preparar body si es necesario
				let body: any = undefined;
				if (apiDefinition.method === 'POST' && resource === 'authentication') {
					body = {
						username: credentials.username,
						password: credentials.password,
					};
				} else if (apiDefinition.requestBody && apiDefinition.requestBody.schema) {
					// Usar DTO para request body (POST, PATCH, PUT, etc.)
					let requestBodyData = this.getNodeParameter('requestBody', i, {});
					if (typeof requestBodyData === 'string') {
						try {
							requestBodyData = JSON.parse(requestBodyData);
						} catch (e) {
							throw new Error('El JSON del body no es válido: ' + e.message);
						}
					}
					body = requestBodyData;
				} else if (apiDefinition.parameters) {
					const bodyParameters = this.getNodeParameter('bodyParameters', i, {}) as Record<string, any>;
					const bodyParams = apiDefinition.parameters.filter(p => p.in === 'body');
					if (bodyParams.length > 0) {
						body = {};
						bodyParams.forEach(param => {
							if (bodyParameters[param.name] !== undefined && bodyParameters[param.name] !== '') {
								body[param.name] = bodyParameters[param.name];
							}
						});
					}
				}

				// Construir URL con parámetros de query
				let url = `${baseUrl}${apiDefinition.endpoint}`;
				if (Object.keys(queryParams).length > 0) {
					const queryString = Object.keys(queryParams)
						.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
						.join('&');
					url += `?${queryString}`;
				}

				// Ejecutar la petición HTTP
				const response = await this.helpers.httpRequest({
					method: apiDefinition.method as IHttpRequestMethods,
					url,
					headers,
					body,
				});

				// Procesar respuesta según el tipo de operación
				if (resource === 'authentication' && operation === 'generateToken') {
					// Almacenar token en contexto
					const contextKey = 's4ds_token';
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
				} else {
					// Retornar respuesta normal
					returnData.push({
						json: response,
					});
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