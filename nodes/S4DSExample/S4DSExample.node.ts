import { INodeType, INodeTypeDescription, NodeConnectionType, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { S4DSHelper } from '../S4DSAuth/S4DSHelper';

export class S4DSExample implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'S4DS Example',
		name: 's4dsExample',
		icon: { light: 'file:s4ds.svg', dark: 'file:s4ds.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Example node that uses S4DS authentication token',
		defaults: {
			name: 'S4DS Example',
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
			baseURL: '={{$credentials.s4dsApi.baseUrl}}',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Product Count',
						value: 'getProductCount',
						description: 'Get the total count of products',
						action: 'Get product count',
						routing: {
							request: {
								method: 'GET',
								url: '/product/count',
							},
						},
					},
				],
				default: 'getProductCount',
			},
			{
				displayName: 'Token Source',
				name: 'tokenSource',
				type: 'options',
				required: true,
				default: 'context',
				options: [
					{
						name: 'From Context',
						value: 'context',
						description: 'Use token stored in workflow context',
					},
					{
						name: 'Custom Token',
						value: 'custom',
						description: 'Provide custom token',
					},
				],
			},
			{
				displayName: 'Context Token Key',
				name: 'contextTokenKey',
				type: 'string',
				default: 's4ds_token',
				required: true,
				displayOptions: {
					show: {
						tokenSource: ['context'],
					},
				},
				description: 'Key used to store token in workflow context',
			},
			{
				displayName: 'Custom Token',
				name: 'customToken',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						tokenSource: ['custom'],
					},
				},
				description: 'Custom authentication token',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const tokenSource = this.getNodeParameter('tokenSource', i) as string;

				// Obtener headers según la fuente
				let headers: Record<string, string>;
				
				if (tokenSource === 'context') {
					const contextKey = this.getNodeParameter('contextTokenKey', i) as string;
					
					// Debug: Verificar qué hay en el contexto
					const contextData = this.getWorkflowStaticData('global');
					const availableKeys = Object.keys(contextData);
					
					// Usar el helper para obtener headers con autorización
					try {
						headers = S4DSHelper.getHeadersWithAuth.call(this, contextKey);
					} catch (error) {
						// Si falla, retornar información de debug
						returnData.push({
							json: {
								error: error.message,
								debug_info: {
									context_key_requested: contextKey,
									available_context_keys: availableKeys,
									context_data: contextData,
									message: 'Please ensure S4DS Auth node runs before this node and generates a token successfully.'
								}
							},
						});
						continue;
					}
				} else {
					const customToken = this.getNodeParameter('customToken', i) as string;
					headers = {
						Authorization: customToken,
						Accept: 'application/json',
						'Content-Type': 'application/json',
					};
				}

				// Ejecutar la operación
				let response;
				if (operation === 'getProductCount') {
					// Obtener credenciales para construir la URL base
					const credentials = await this.getCredentials('s4dsApi');
					
					// Determinar la URL base
					let baseUrl = credentials.baseUrl;
					if (baseUrl === 'custom') {
						baseUrl = credentials.customBaseUrl;
					}
					
					if (!baseUrl) {
						throw new Error('Base URL is required. Please configure the S4DS API credentials.');
					}

					response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/product/count`,
						headers,
					});
				}

				returnData.push({
					json: {
						...response,
						_token_info: {
							source: tokenSource,
						},
					},
				});
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