// If you see type errors for 'fs' or 'path', install @types/node as a dev dependency.
// npm install --save-dev @types/node
import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';
import * as dtoDefinitions from './dto-definitions.json';
// Remove fs and path imports
// Import all service JSON files directly
import generateToken from './actions/authentication/generateToken.json';
import getProductCount from './actions/products/getProductCount.json';
import getCustomerByDocument from './actions/customers/getCustomerByDocument.json';
import createCustomer from './actions/customers/createCustomer.json';
import updateCustomer from './actions/customers/updateCustomer.json';

export interface ApiDefinition {
	method: string;
	endpoint: string;
	description: string;
	parameters: ApiParameter[];
	requiresAuth: boolean;
	requestBody?: {
		schema: string;
		required: boolean;
	};
	response: {
		type: string;
		properties: Record<string, string>;
	};
}

export interface ApiParameter {
	name: string;
	type: string;
	required: boolean;
	description: string;
	in: 'query' | 'body' | 'path';
}

export interface DtoProperty {
	type: string;
	description: string;
	required: boolean;
	schema?: string;
	items?: {
		type: string;
		schema?: string;
	};
}

export interface DtoDefinition {
	type: string;
	properties: Record<string, DtoProperty>;
}

// Build static API definitions object
const staticApiDefinitions: Record<string, Record<string, ApiDefinition>> = {
  authentication: {
    generateToken: generateToken as ApiDefinition,
  },
  products: {
    getProductCount: getProductCount as ApiDefinition,
  },
  customers: {
    getCustomerByDocument: getCustomerByDocument as ApiDefinition,
    createCustomer: createCustomer as ApiDefinition,
    updateCustomer: updateCustomer as ApiDefinition,
  },
};

export class ApiHelper {
  // Return the static API definitions
  static getApiDefinitions(): Record<string, Record<string, ApiDefinition>> {
    return staticApiDefinitions;
  }
  // Return a single API definition
  static getApiDefinition(group: string, service: string): ApiDefinition | null {
    return staticApiDefinitions[group]?.[service] || null;
  }

	static getResources(): INodeProperties[] {
		const definitions = this.getApiDefinitions();
		const resources = Object.keys(definitions).map(resource => ({
			name: this.capitalizeFirst(resource),
			value: resource,
			description: `${resource} operations`,
		}));

		return [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: resources,
				default: resources[0]?.value || 'authentication',
			},
		];
	}

	static getOperations(): INodeProperties[] {
		const definitions = this.getApiDefinitions();
		const operations: INodeProperties[] = [];

		// Crear operaciones para cada recurso
		Object.keys(definitions).forEach(resource => {
			const resourceOperations = Object.keys(definitions[resource]).map(operation => ({
				name: this.formatOperationName(operation),
				value: operation,
				description: definitions[resource][operation].description,
				action: this.formatOperationName(operation),
			}));

			operations.push({
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [resource],
					},
				},
				options: resourceOperations,
				default: resourceOperations[0]?.value || '',
			});
		});

		return operations;
	}

	static getFields(): INodeProperties[] {
		const definitions = this.getApiDefinitions();
		const fields: INodeProperties[] = [];

		// Ya no agregamos campos de autenticación

		Object.keys(definitions).forEach(resource => {
			Object.keys(definitions[resource]).forEach(operation => {
				const apiDef = definitions[resource][operation];

				// Campos específicos de la operación
				if (apiDef.parameters && apiDef.parameters.length > 0) {
					fields.push(...this.getOperationFields(resource, operation, apiDef.parameters));
				}

				// Campos para request body con DTOs
				if (apiDef.requestBody && apiDef.requestBody.schema) {
					fields.push(...this.getRequestBodyFields(resource, operation, apiDef.requestBody.schema));
				}
			});
		});

		return fields;
	}

	private static getOperationFields(resource: string, operation: string, parameters: ApiParameter[]): INodeProperties[] {
		const fields: INodeProperties[] = [];

		// Agrupar parámetros por tipo
		const queryParams = parameters.filter(p => p.in === 'query');
		const bodyParams = parameters.filter(p => p.in === 'body');

		// Campos para parámetros de query
		if (queryParams.length > 0) {
			fields.push({
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'collection',
				placeholder: 'Add Query Parameter',
				default: {},
				displayOptions: {
					show: {
						resource: [resource],
						operation: [operation],
					},
				},
				options: queryParams.map(param => ({
					displayName: this.capitalizeFirst(param.name),
					name: param.name,
					type: this.mapParameterType(param.type),
					default: '',
					required: param.required,
					description: param.description,
				})),
			});
		}

		// Campos para parámetros de body
		if (bodyParams.length > 0) {
			fields.push({
				displayName: 'Body Parameters',
				name: 'bodyParameters',
				type: 'collection',
				placeholder: 'Add Body Parameter',
				default: {},
				displayOptions: {
					show: {
						resource: [resource],
						operation: [operation],
					},
				},
				options: bodyParams.map(param => ({
					displayName: this.capitalizeFirst(param.name),
					name: param.name,
					type: this.mapParameterType(param.type),
					default: '',
					required: param.required,
					description: param.description,
				})),
			});
		}

		return fields;
	}

	private static getRequestBodyFields(resource: string, operation: string, dtoSchema: string): INodeProperties[] {
		const example = this.generateDtoExample(dtoSchema);
		return [
			{
				displayName: 'Request Body (JSON)',
				name: 'requestBody',
				type: 'json',
				default: JSON.stringify(example, null, 2),
				required: false,
				description: 'Pega aquí el JSON completo según el esquema del DTO.',
				displayOptions: {
					show: {
						resource: [resource],
						operation: [operation],
					},
				},
			},
		];
	}

	// Helper para generar un ejemplo de JSON para un DTO
	private static generateDtoExample(dtoName: string): any {
		const dtoDef = this.getDtoDefinition(dtoName);
		if (!dtoDef) return {};
		const result: any = {};
		Object.keys(dtoDef.properties).forEach(propName => {
			const prop = dtoDef.properties[propName];
			if (prop.type === 'object' && prop.schema) {
				result[propName] = this.generateDtoExample(prop.schema);
			} else if (prop.type === 'object') {
				result[propName] = {};
			} else if (prop.type === 'array' && prop.items?.schema) {
				result[propName] = [this.generateDtoExample(prop.items.schema)];
			} else if (prop.type === 'array') {
				result[propName] = [];
			} else if (prop.type === 'boolean') {
				result[propName] = false;
			} else if (prop.type === 'number' || prop.type === 'integer') {
				result[propName] = 0;
			} else {
				result[propName] = '';
			}
		});
		return result;
	}

	private static mapParameterType(apiType: string): NodePropertyTypes {
		switch (apiType.toLowerCase()) {
			case 'string':
				return 'string';
			case 'number':
			case 'integer':
				return 'number';
			case 'boolean':
				return 'boolean';
			case 'array':
				return 'fixedCollection';
			case 'object':
				return 'json';
			default:
				return 'string';
		}
	}

	private static capitalizeFirst(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	private static formatOperationName(operation: string): string {
		// Convertir camelCase a palabras separadas
		return operation
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, str => str.toUpperCase())
			.trim();
	}

	static getDtoDefinitions(): Record<string, DtoDefinition> {
		return dtoDefinitions as any;
	}

	static getDtoDefinition(dtoName: string): DtoDefinition | null {
		const definitions = this.getDtoDefinitions();
		return definitions[dtoName] || null;
	}

	static generateDtoFields(dtoName: string, prefix: string = ''): INodeProperties[] {
		const dtoDef = this.getDtoDefinition(dtoName);
		if (!dtoDef) return [];

		const fields: INodeProperties[] = [];
		
		Object.keys(dtoDef.properties).forEach(propName => {
			const prop = dtoDef.properties[propName];
			const fieldName = prefix ? `${prefix}.${propName}` : propName;
			const displayName = this.capitalizeFirst(propName);

			if (prop.type === 'object' && prop.schema) {
				// Campo de objeto anidado
				fields.push({
					displayName: `${displayName} (${prop.schema})`,
					name: fieldName,
					type: 'collection',
					placeholder: `Add ${displayName}`,
					default: {},
					required: prop.required,
					description: prop.description,
					options: this.generateDtoFields(prop.schema, fieldName),
				});
			} else if (prop.type === 'array' && prop.items?.schema) {
				// Campo de array de objetos
				fields.push({
					displayName: `${displayName} (Array of ${prop.items.schema})`,
					name: fieldName,
					type: 'fixedCollection',
					typeOptions: {
						multipleValues: true,
					},
					placeholder: `Add ${displayName} Item`,
					default: {},
					required: prop.required,
					description: prop.description,
					options: [
						{
							displayName: prop.items.schema,
							name: 'item',
							values: this.generateDtoFields(prop.items.schema, `${fieldName}.item`),
						},
					],
				});
			} else {
				// Campo simple
				fields.push({
					displayName,
					name: fieldName,
					type: this.mapParameterType(prop.type),
					default: '',
					required: prop.required,
					description: prop.description,
				});
			}
		});

		return fields;
	}

	static buildDtoObject(data: Record<string, any>, dtoSchema: string): any {
		const dtoDef = this.getDtoDefinition(dtoSchema);
		if (!dtoDef) return data;

		const result: any = {};

		Object.keys(dtoDef.properties).forEach(propName => {
			const prop = dtoDef.properties[propName];
			const value = data[propName];

			if (value !== undefined && value !== '') {
				if (prop.type === 'object' && prop.schema) {
					// Objeto anidado
					result[propName] = this.buildDtoObject(value, prop.schema);
				} else if (prop.type === 'array' && prop.items?.schema) {
					// Array de objetos
					if (Array.isArray(value)) {
						result[propName] = value.map(item => this.buildDtoObject(item, prop.items!.schema!));
					} else if (value && typeof value === 'object') {
						// Para fixedCollection de n8n
						result[propName] = Object.values(value).map((item: any) => 
							this.buildDtoObject(item, prop.items!.schema!)
						);
					}
				} else {
					// Campo simple
					result[propName] = value;
				}
			}
		});

		return result;
	}
} 