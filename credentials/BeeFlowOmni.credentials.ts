import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BeeFlowOmniKey implements ICredentialType {
	name = 'BeeFlowOmniKey';
	displayName = 'BeeFlow Omni API Key';
	documentationUrl = 'BeeFlowOmni';
	properties: INodeProperties[] = [
		{
			displayName: 'Authorization',
			name: 'apiKey Authorization',
			type: 'string',
			default: '',
		},
	];
}
