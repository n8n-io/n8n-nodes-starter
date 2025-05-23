import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	// Assuming INodeProperties is needed for properties definition
	INodeProperties,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

// TODO: Import functions from sunoApi.ts when they are implemented
// import * as sunoApi from '../../utils/sunoApi';

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
				name: 'sunoApi', // Matches the name in SunoApi.credentials.ts
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
			// Properties for 'generateSongFromPrompt'
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				placeholder: 'e.g., Epic orchestral score for a space battle',
				description: 'The text prompt to generate music from',
				displayOptions: {
					show: {
						operation: ['generateSongFromPrompt'],
					},
				},
			},
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
		] as INodeProperties[], // Cast to INodeProperties[]
	};

	/**
	 * Placeholder method for generating a song from a prompt.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async generateSongFromPrompt(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const prompt = this.getNodeParameter('prompt', 0, '') as string;
		// TODO: Call the appropriate sunoApi.ts function (sunoApi.submitPrompt) and handle response
		console.log('Executing generateSongFromPrompt with prompt:', prompt);
		// For now, return empty data
		return [this.prepareOutputData([])];
	}

	/**
	 * Placeholder method for uploading a track reference.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async uploadTrackReference(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const filePath = this.getNodeParameter('filePath', 0, '') as string;
		// TODO: Call the appropriate sunoApi.ts function (sunoApi.uploadReferenceTrack) and handle response
		console.log('Executing uploadTrackReference with filePath:', filePath);
		return [this.prepareOutputData([])];
	}

	/**
	 * Placeholder method for getting track status.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async getTrackStatus(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const trackId = this.getNodeParameter('trackId', 0, '') as string;
		// TODO: Call the appropriate sunoApi.ts function (sunoApi.pollJobStatus or similar) and handle response
		console.log('Executing getTrackStatus with trackId:', trackId);
		return [this.prepareOutputData([])];
	}

	/**
	 * Placeholder method for downloading a track.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async downloadTrack(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const trackId = this.getNodeParameter('trackId', 0, '') as string;
		// TODO: Call the appropriate sunoApi.ts function (sunoApi.downloadTrack) and handle response
		// TODO: Consider how to handle binary data output in n8n
		console.log('Executing downloadTrack with trackId:', trackId);
		return [this.prepareOutputData([])];
	}

	/**
	 * Placeholder method for listing previous songs.
	 * @param {IExecuteFunctions} this - The execution context.
	 * @returns {Promise<INodeExecutionData[][]>}
	 */
	async listPreviousSongs(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// TODO: Call the appropriate sunoApi.ts function (sunoApi.listPreviousSongs) and handle response
		console.log('Executing listPreviousSongs');
		return [this.prepareOutputData([])];
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('operation', 0, '') as string;

		try {
			switch (operation) {
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
			// This node should use NodeOperationError when an error occurs directly within this node's execution logic
			if (this.continueOnFail()) {
				// Return error data as per n8n's guidelines for allowing the workflow to continue
				const item = this.getInputData(0)[0]; // Get the first item if available, otherwise undefined
				return [this.prepareOutputData([{ json: {}, error: error, pairedItem: item ? { item: 0 } : undefined }])];
			} else {
				// If not continuing on fail, rethrow the error to halt the workflow
				throw error; // NodeOperationError should already be structured correctly
			}
		}
	}
}
