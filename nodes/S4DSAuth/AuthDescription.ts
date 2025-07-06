import { INodeProperties } from 'n8n-workflow';

// Operaciones disponibles para el recurso de autenticación
export const authOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['auth'],
			},
		},
		options: [
			{
				name: 'Generate Token',
				value: 'generateToken',
				description: 'Generate authentication token using credentials',
				action: 'Generate authentication token',
				routing: {
					request: {
						method: 'POST',
						url: '/login/generateToken',
						body: {
							username: '={{$credentials.s4dsApi.username}}',
							password: '={{$credentials.s4dsApi.password}}',
						},
					},
				},
			},
			{
				name: 'Validate Token',
				value: 'validateToken',
				description: 'Validate existing token',
				action: 'Validate existing token',
				routing: {
					request: {
						method: 'GET',
						url: '/auth/validate',
					},
				},
			},
		],
		default: 'generateToken',
	},
];

// Campos para la operación de generación de token
const generateTokenOperation: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['auth'],
				operation: ['generateToken'],
			},
		},
		options: [
			{
				displayName: 'Store Token in Context',
				name: 'storeInContext',
				type: 'boolean',
				default: true,
				description: 'Whether to store the token in the workflow context for other nodes to use',
			},
			{
				displayName: 'Token Context Key',
				name: 'tokenContextKey',
				type: 'string',
				default: 's4ds_token',
				description: 'Key to store the token in the workflow context',
				displayOptions: {
					show: {
						storeInContext: [true],
					},
				},
			},
		],
	},
];

// Campos para la operación de validación de token
const validateTokenOperation: INodeProperties[] = [
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['auth'],
				operation: ['validateToken'],
			},
		},
		description: 'Token to validate',
	},
];

// Exportar todos los campos
export const authFields: INodeProperties[] = [
	...generateTokenOperation,
	...validateTokenOperation,
]; 