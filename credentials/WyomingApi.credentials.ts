import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WyomingApi implements ICredentialType {
	name = 'wyomingApi';

	displayName = 'Wyoming API';

	documentationUrl = 'https://github.com/rhasspy/wyoming';

	icon = { light: 'file:wyoming.svg', dark: 'file:wyoming.svg' } as const;

	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'localhost',
			placeholder: 'e.g., localhost or 192.168.1.100',
			description: 'Wyoming server hostname or IP address',
			required: true,
		},
		{
			displayName: 'Port',
			name: 'port',
			type: 'number',
			default: 10300,
			description: 'Wyoming server port (default: 10300 for Whisper)',
			required: true,
		},
	];
}
