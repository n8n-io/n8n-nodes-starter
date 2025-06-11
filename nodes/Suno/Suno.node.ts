import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import * as sunoApi from '../../utils/sunoApi';
import type { SunoPromptOptions } from '../../interfaces/SunoTypes';

export class SunoNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Suno',
		name: 'suno',
		icon: 'file:suno.svg',
		group: ['ai'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Integrates with Suno AI for music generation',
		defaults: {
			name: 'Suno',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'sunoApi',
				required: true,
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
						name: 'Login',
						value: 'login',
						description: 'Perform login to Suno API (for testing)',
						action: 'Login',
					},
					{
						name: 'Generate Song from Prompt',
						value: 'generateSongFromPrompt',
						description: 'Create a new song based on a text prompt',
						action: 'Generate song from prompt',
					},
					{
						name: 'Upload Track Reference',
						value: 'uploadTrackReference',
						description: 'Upload a reference track for generation',
						action: 'Upload track reference',
					},
					{
						name: 'Get Track Status',
						value: 'getTrackStatus',
						description: 'Get the status of a generated track',
						action: 'Get track status',
					},
					{
						name: 'Download Track',
						value: 'downloadTrack',
						description: 'Download a generated track',
						action: 'Download track',
					},
					{
						name: 'List Previous Songs',
						value: 'listPreviousSongs',
						description: 'List previously generated songs',
						action: 'List previous songs',
					},
				],
				default: 'generateSongFromPrompt',
			},
			// Properties for 'login' (if not using credentials directly for this action)
			{
				displayName: 'Email (for Login Operation)',
				name: 'email',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['login'],
					},
				},
			},
			{
				displayName: 'Password (for Login Operation)',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: {
					show: {
						operation: ['login'],
					},
				},
			},
			// Properties for 'generateSongFromPrompt'
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'e.g., Epic orchestral score for a space battle',
				description: 'The text prompt to generate music from',
				displayOptions: {
					show: {
						operation: ['generateSongFromPrompt'],
					},
				},
			},
			// TODO: Add more options for prompt generation if desired
			// e.g., style, instrumental, mood
			// Properties for 'getTrackStatus' and 'downloadTrack'
			{
				displayName: 'Track ID',
				name: 'trackId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'Enter Track ID',
				description: 'The ID of the track',
				displayOptions: {
					show: {
						operation: ['getTrackStatus', 'downloadTrack'],
					},
				},
			},
			// Properties for 'uploadTrackReference'
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				default: '',
				required: true,
				placeholder: '/path/to/your/audio.mp3',
				description: 'Path to the audio file to upload as reference',
				displayOptions: {
					show: {
						operation: ['uploadTrackReference'],
					},
				},
			},
			{
				displayName: 'Binary Property Name (for Download)',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'sunoTrackAudio',
				description: 'Name of the binary property where audio data will be stored for download operation.',
				displayOptions: {
					show: {
						operation: ['downloadTrack'],
					},
				},
			},
		] as INodeProperties[],
	};

	/**
	 * Performs login to the Suno API.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async login(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const email = this.getNodeParameter('email', 0, '') as string;
		const password = this.getNodeParameter('password', 0, '') as string;
		try {
			const response = await sunoApi.loginWithCredentials(email, password);
			return [this.helpers.returnJsonArray([response])];
		} catch (error) {
			if (error instanceof Error) {
				throw new NodeOperationError(this.getNode(), error, { itemIndex: 0 });
			}
			throw new NodeOperationError(this.getNode(), new Error(String(error)), { itemIndex: 0 });
		}
	}

	/**
	 * Generates a song from a prompt using the Suno API.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async generateSongFromPrompt(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const promptText = this.getNodeParameter('prompt', 0, '') as string;
		// const options: SunoPromptOptions = {}; // TODO: Get from node parameters if added
		try {
			const job = await sunoApi.submitPrompt(promptText /*, options */);
			return [this.helpers.returnJsonArray([job])];
		} catch (error) {
			if (error instanceof Error) {
				throw new NodeOperationError(this.getNode(), error, { itemIndex: 0 });
			}
			throw new NodeOperationError(this.getNode(), new Error(String(error)), { itemIndex: 0 });
		}
	}

	/**
	 * Uploads a track reference to the Suno API.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async uploadTrackReference(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const filePath = this.getNodeParameter('filePath', 0, '') as string;
		try {
			// TODO: Add options if necessary
			const result = await sunoApi.uploadReferenceTrack(filePath);
			return [this.helpers.returnJsonArray([result])];
		} catch (error) {
			if (error instanceof Error) {
				throw new NodeOperationError(this.getNode(), error, { itemIndex: 0 });
			}
			throw new NodeOperationError(this.getNode(), new Error(String(error)), { itemIndex: 0 });
		}
	}

	/**
	 * Gets the status of a track from the Suno API.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async getTrackStatus(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const trackId = this.getNodeParameter('trackId', 0, '') as string;
		try {
			const status = await sunoApi.pollJobStatus(trackId);
			return [this.helpers.returnJsonArray([status])];
		} catch (error) {
			if (error instanceof Error) {
				throw new NodeOperationError(this.getNode(), error, { itemIndex: 0 });
			}
			throw new NodeOperationError(this.getNode(), new Error(String(error)), { itemIndex: 0 });
		}
	}

	/**
	 * Downloads a track from the Suno API.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async downloadTrack(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const trackId = this.getNodeParameter('trackId', 0, '') as string;
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0, 'sunoTrackAudio') as string;
		try {
			const audioBuffer = await sunoApi.downloadTrack(trackId);
			const executionData = this.helpers.returnJsonArray([{ trackId, message: 'Audio data attached in binary property.' }])[0];
			if (executionData.json) { // Ensure json property exists
				executionData.binary = { [binaryPropertyName]: await this.helpers.prepareBinaryData(audioBuffer, binaryPropertyName + '.mp3') };
			}
			return [[executionData]];
		} catch (error) {
			if (error instanceof Error) {
				throw new NodeOperationError(this.getNode(), error, { itemIndex: 0 });
			}
			throw new NodeOperationError(this.getNode(), new Error(String(error)), { itemIndex: 0 });
		}
	}

	/**
	 * Lists previous songs from the Suno API.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async listPreviousSongs(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		try {
			const songs = await sunoApi.listPreviousSongs();
			return [this.helpers.returnJsonArray(songs)];
		} catch (error) {
			if (error instanceof Error) {
				throw new NodeOperationError(this.getNode(), error, { itemIndex: 0 });
			}
			throw new NodeOperationError(this.getNode(), new Error(String(error)), { itemIndex: 0 });
		}
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('operation', 0, '') as string;

		try {
			switch (operation) {
				case 'login':
					return this.login(this);
				case 'generateSongFromPrompt':
					return this.generateSongFromPrompt(this);
				case 'uploadTrackReference':
					return this.uploadTrackReference(this);
				case 'getTrackStatus':
					return this.getTrackStatus(this);
				case 'downloadTrack':
					return this.downloadTrack(this);
				case 'listPreviousSongs':
					return this.listPreviousSongs(this);
				default:
					throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported.`);
			}
		} catch (error) {
			if (this.continueOnFail()) {
				const item = this.getInputData(0)?.[0];
				return [this.prepareOutputData([{ json: {}, error: error, pairedItem: item ? { item: 0 } : undefined }])];
			} else {
				throw error;
			}
		}
	}
}
