import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { nodeUpdateCheckerMethods } from './methods/methods';

export class WorkflowNodeChecker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Workflow Node Checker',
		name: 'workflowNodeChecker',
		icon: 'fa:search',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Check updates for community and base nodes in workflow',
		defaults: {
			name: 'Workflow Node Checker',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'firecrawlApi',
				required: false,
				displayOptions: {
					show: {
						'options.extractPatchNotes': [true],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Check All Nodes',
						value: 'checkAll',
						description: 'Check updates for all nodes in the workflow',
						action: 'Check all nodes for updates',
					},
					{
						name: 'Check Community Nodes Only',
						value: 'checkCommunity',
						description: 'Check only community nodes from npm',
						action: 'Check community nodes only',
					},
					{
						name: 'Check Base Nodes Only',
						value: 'checkBase',
						description: 'Check only n8n base nodes from GitHub',
						action: 'Check base nodes only',
					},
				],
				default: 'checkAll',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{
						name: 'JSON',
						value: 'json',
						description: 'Return as JSON objects',
					},
					{
						name: 'Email Text',
						value: 'emailText',
						description: 'Return formatted text for email',
					},
					{
						name: 'Both',
						value: 'both',
						description: 'Return both JSON and formatted text',
					},
				],
				default: 'both',
			},
			{
				displayName: 'Previous Versions (JSON)',
				name: 'previousVersions',
				type: 'json',
				default: '{}',
				description: 'Previous versions to compare against (format: {"packageName": "1.0.0"})',
				placeholder: '{"@username/n8n-nodes-custom": "1.0.0"}',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Use Static Data Storage',
						name: 'useStaticData',
						type: 'boolean',
						default: true,
						description: 'Whether to automatically store and load versions from workflow static data (no external DB needed)',
					},
					{
						displayName: 'Check Delay (ms)',
						name: 'checkDelay',
						type: 'number',
						default: 1500,
						description: 'Delay between checks to avoid rate limiting',
					},
					{
						displayName: 'Fetch GitHub Repository',
						name: 'fetchGithubRepo',
						type: 'boolean',
						default: true,
						description: 'Whether to fetch GitHub repository links for community nodes from npm registry',
					},
					{
						displayName: 'Extract Patch Notes',
						name: 'extractPatchNotes',
						type: 'boolean',
						default: false,
						description: 'Whether to extract patch notes for base nodes (requires Firecrawl API)',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await nodeUpdateCheckerMethods.execute.call(this);
	}
}