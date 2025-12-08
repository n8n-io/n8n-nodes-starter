import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ICredentialTestFunctions,
	INodeCredentialTestResult,
	ICredentialsDecrypted,
} from 'n8n-workflow';

import * as net from 'net';

export class Wyoming implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wyoming',
		name: 'wyoming',
		icon: 'file:wyoming.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Speech-to-text using Wyoming protocol (Home Assistant Whisper)',
		defaults: {
			name: 'Wyoming',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'wyomingApi',
				required: true,
				testedBy: 'wyomingApiTest',
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
						name: 'Transcribe',
						value: 'transcribe',
						description: 'Transcribe audio to text',
						action: 'Transcribe audio to text',
					},
				],
				default: 'transcribe',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				description: 'Name of the binary property containing audio data',
				displayOptions: {
					show: {
						operation: ['transcribe'],
					},
				},
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				default: 'en',
				description: 'Language of the audio',
				options: [
					{ name: 'Arabic', value: 'ar' },
					{ name: 'Auto Detect', value: 'auto' },
					{ name: 'Chinese', value: 'zh' },
					{ name: 'Dutch', value: 'nl' },
					{ name: 'English', value: 'en' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Hindi', value: 'hi' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Japanese', value: 'ja' },
					{ name: 'Korean', value: 'ko' },
					{ name: 'Polish', value: 'pl' },
					{ name: 'Portuguese', value: 'pt' },
					{ name: 'Russian', value: 'ru' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'Turkish', value: 'tr' },
					{ name: 'Ukrainian', value: 'uk' },
					{ name: 'Vietnamese', value: 'vi' },
				],
				displayOptions: {
					show: {
						operation: ['transcribe'],
					},
				},
			},
		],
	};

	methods = {
		credentialTest: {
			async wyomingApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const credentials = credential.data as { host: string; port: number };

				return new Promise((resolve) => {
					const client = new net.Socket();
					const timeoutId = setTimeout(() => {
						client.destroy();
						resolve({
							status: 'Error',
							message: 'Connection timeout',
						});
					}, 5000);

					client.connect(credentials.port, credentials.host, () => {
						const describeEvent = JSON.stringify({ type: 'describe' }) + '\n';
						client.write(describeEvent);
					});

					client.on('data', (data: Buffer) => {
						clearTimeout(timeoutId);
						client.destroy();
						const response = data.toString();
						if (response.includes('asr') || response.includes('whisper')) {
							resolve({
								status: 'OK',
								message: 'Connection successful',
							});
						} else {
							resolve({
								status: 'Error',
								message: 'Invalid response from server',
							});
						}
					});

					client.on('error', (err: Error) => {
						clearTimeout(timeoutId);
						client.destroy();
						resolve({
							status: 'Error',
							message: `Connection failed: ${err.message}`,
						});
					});
				});
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'transcribe') {
					// Placeholder - will be implemented in transport layer PR
					returnData.push({
						json: {
							text: 'Transcription not yet implemented',
							language: this.getNodeParameter('language', i) as string,
						},
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
