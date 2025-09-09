import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

import { textFields, textOperations } from './TextDescription';

const baseURL = 'https://inference.do-ai.run/v1';

export class ServerlessInference implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DigitalOcean Gradient™ AI Serverless Inference',
		documentationUrl: 'https://gradientai-sdk.digitalocean.com/api/resources/chat/subresources/completions/methods/create',
		name: 'digitalOceanGradientServerlessInference',
		icon: { light: 'file:DO-Gradient-AI-Agentic-Cloud-logo.svg', dark: 'file:DO-gradient-ai-logo-white.svg' },
		group: ['transform'],
		version: [1, 1.0],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume DigitalOcean Gradient™ AI Serverless Inference',
		defaults: {
			name: 'DigitalOcean Gradient™ AI Serverless Inference',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'digitalOceanServerlessInference',
				required: true,
			},
		],
		requestDefaults: {
			ignoreHttpStatusErrors: true,
			baseURL,
            headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': 'Gradient/n8n/1.0.0',
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
						name: 'Text',
						value: 'text',
					},
				],
				default: 'text',
			},
			...textOperations,
			...textFields,
		],
	};
}
