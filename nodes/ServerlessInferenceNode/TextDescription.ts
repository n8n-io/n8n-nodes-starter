import type { INodeProperties } from 'n8n-workflow';

import { sendErrorPostReceive } from './GenericFunctions';

export const textOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['text'],
			},
		},
		options: [
			{
				name: 'Complete',
				value: 'complete',
				action: 'Create a Text Completion',
				description: 'Create one or more completions for a given text',
				routing: {
					request: {
						method: 'POST',
						url: '/chat/completions',
					},
					output: { postReceive: [sendErrorPostReceive] },
				},
			},
		],
		default: 'complete',
	},
];

const completeOperations: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		description:
			'The model which will generate the completion. <a href="https://docs.digitalocean.com/products/gradient-ai-platform/details/models/">Learn more</a>',
		displayOptions: {
			show: {
				operation: ['complete'],
				resource: ['text'],
			},
		},
		typeOptions: {
			loadOptions: {
				routing: {
					request: {
						method: 'GET',
						url: '/models',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
							{
								type: 'setKeyValue',
								properties: {
									name: '={{$responseItem.id}}',
									value: '={{$responseItem.id}}',
								},
							},
							{
								type: 'sort',
								properties: {
									key: 'name',
								},
							},
						],
					},
				},
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'model',
			},
		},
		default: 'openai-gpt-oss-120b',
	},
	{
		displayName: 'Input Type',
		name: 'inputType',
		type: 'options',
		description: 'Choose how to provide the conversation input',
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['complete'],
			},
		},
		options: [
			{
				name: 'Simple Prompt',
				value: 'prompt',
				description: 'Provide a simple text prompt',
			},
			{
				name: 'Chat Messages',
				value: 'messages',
				description: 'Provide a full conversation with roles',
			},
		],
		default: 'prompt',
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		description: 'The prompt to generate completion(s) for',
		placeholder: 'e.g. Say this is a test',
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['complete'],
				inputType: ['prompt'],
			},
		},
		default: '',
		typeOptions: {
			rows: 2,
		},
		routing: {
			send: {
				type: 'body',
				property: 'messages',
				value: '={{[{"role": "user", "content": $parameter.prompt}]}}',
			},
		},
	},
	{
		displayName: 'Messages',
		name: 'messages',
		type: 'fixedCollection',
		description: 'The messages in the conversation',
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['complete'],
				inputType: ['messages'],
			},
		},
		default: {
			messagesList: [
				{
					role: 'user',
					content: '',
				},
			],
		},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'messagesList',
				displayName: 'Message',
				values: [
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						description: 'The role of the message author',
						options: [
							{
								name: 'System',
								value: 'system',
								description: 'A system message that sets the behavior of the assistant',
							},
							{
								name: 'User',
								value: 'user',
								description: 'A message from the user',
							},
							{
								name: 'Assistant',
								value: 'assistant',
								description: 'A message from the assistant',
							},
						],
						default: 'user',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						description: 'The content of the message',
						default: '',
						typeOptions: {
							rows: 2,
						},
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'messages',
				value: '={{$parameter.messages.messagesList}}',
			},
		},
	},
];


const sharedOperations: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		placeholder: 'Add option',
		description: 'Additional options to add',
		type: 'collection',
		default: {
			maxTokens: 2048,
			temperature: 0.7,
		},
		displayOptions: {
			show: {
				operation: ['complete'],
				resource: ['text'],
			},
		},
		options: [
			{
				displayName: 'Maximum Number of Tokens',
				name: 'maxTokens',
				default: 2048,
				description:
					'The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768).',
				type: 'number',
				displayOptions: {
					show: {
						'/operation': ['complete'],
					},
				},
				typeOptions: {
					maxValue: 131072,
					minValue: 1,
				},
				routing: {
					send: {
						type: 'body',
						property: 'max_tokens',
					},
				},
			},
			{
				displayName: 'Max Completion Tokens',
				name: 'maxCompletionTokens',
				description:
					'The maximum number of tokens that can be generated in the chat completion. This value can be used to control costs for text generated via API.',
				type: 'number',
				default: undefined,
				typeOptions: {
					minValue: 1,
				},
				routing: {
					send: {
						type: 'body',
						property: 'max_completion_tokens',
					},
				},
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				default: 0.7,
				typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 2 },
				description:
					'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
				type: 'number',
				routing: {
					send: {
						type: 'body',
						property: 'temperature',
					},
				},
			},
			{
				displayName: 'Top P',
				name: 'topP',
				description:
					'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.',
				type: 'number',
				default: undefined,
				typeOptions: {
					maxValue: 1,
					minValue: 0,
					numberPrecision: 3,
				},
				routing: {
					send: {
						type: 'body',
						property: 'top_p',
					},
				},
			},
			{
				displayName: 'Number of Completions',
				name: 'n',
				description: 'How many chat completion choices to generate for each input message',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 128,
				},
				default: 1,
				routing: {
					send: {
						type: 'body',
						property: 'n',
					},
				},
			},
			{
				displayName: 'Stream',
				name: 'stream',
				description: 'If set, partial message deltas will be sent, like in ChatGPT',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'stream',
					},
				},
			},
			{
				displayName: 'Stream Options',
				name: 'streamOptions',
				description: 'Options for streaming response',
				type: 'collection',
				displayOptions: {
					show: {
						stream: [true],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Include Usage',
						name: 'includeUsage',
						description: 'If set, an additional chunk will be streamed before the data: [DONE] message',
						type: 'boolean',
						default: false,
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'stream_options',
						value: '={{$parameter.streamOptions.includeUsage ? {"include_usage": $parameter.streamOptions.includeUsage} : undefined}}',
					},
				},
			},
			{
				displayName: 'Stop Sequences',
				name: 'stop',
				description: 'Up to 4 sequences where the API will stop generating further tokens',
				type: 'string',
				default: '',
				placeholder: 'e.g. \\n, Human:, AI:',
				routing: {
					send: {
						type: 'body',
						property: 'stop',
						value: '={{$parameter.stop ? $parameter.stop.split(",").map(s => s.trim()) : undefined}}',
					},
				},
			},
			{
				displayName: 'Presence Penalty',
				name: 'presencePenalty',
				description:
					'Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far',
				type: 'number',
				default: undefined,
				typeOptions: {
					maxValue: 2,
					minValue: -2,
					numberPrecision: 2,
				},
				routing: {
					send: {
						type: 'body',
						property: 'presence_penalty',
					},
				},
			},
			{
				displayName: 'Frequency Penalty',
				name: 'frequencyPenalty',
				description:
					'Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far',
				type: 'number',
				default: undefined,
				typeOptions: {
					maxValue: 2,
					minValue: -2,
					numberPrecision: 2,
				},
				routing: {
					send: {
						type: 'body',
						property: 'frequency_penalty',
					},
				},
			},
			{
				displayName: 'Logprobs',
				name: 'logprobs',
				description: 'Whether to return log probabilities of the output tokens',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'logprobs',
					},
				},
			},
			{
				displayName: 'Top Logprobs',
				name: 'topLogprobs',
				description: 'An integer between 0 and 20 specifying the number of most likely tokens to return at each token position',
				type: 'number',
				default: undefined,
				displayOptions: {
					show: {
						logprobs: [true],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 20,
				},
				routing: {
					send: {
						type: 'body',
						property: 'top_logprobs',
					},
				},
			},
			{
				displayName: 'User Identifier',
				name: 'user',
				description: 'A unique identifier representing your end-user, which can help monitor and detect abuse',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'user',
					},
				},
			},
			{
				displayName: 'Logit Bias',
				name: 'logitBias',
				description: 'Modify the likelihood of specified tokens appearing in the completion (JSON object mapping token IDs to bias values)',
				type: 'string',
				default: '',
				placeholder: '{"50256": -100}',
				routing: {
					send: {
						type: 'body',
						property: 'logit_bias',
						value: '={{$parameter.logitBias ? JSON.parse($parameter.logitBias) : undefined}}',
					},
				},
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				description: 'Developer-defined metadata to attach to the completion (JSON object)',
				type: 'string',
				default: '',
				placeholder: '{"purpose": "testing"}',
				routing: {
					send: {
						type: 'body',
						property: 'metadata',
						value: '={{$parameter.metadata ? JSON.parse($parameter.metadata) : undefined}}',
					},
				},
			},
			{
				displayName: 'Tools',
				name: 'tools',
				description: 'A list of tools the model may call',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'toolsList',
						displayName: 'Tool',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'Function',
										value: 'function',
									},
								],
								default: 'function',
							},
							{
								displayName: 'Function Name',
								name: 'functionName',
								type: 'string',
								default: '',
								description: 'The name of the function to be called',
							},
							{
								displayName: 'Function Description',
								name: 'functionDescription',
								type: 'string',
								default: '',
								description: 'A description of what the function does',
							},
							{
								displayName: 'Function Parameters',
								name: 'functionParameters',
								type: 'string',
								description: 'The parameters the function accepts, described as a JSON Schema object',
								placeholder: '{"type": "object", "properties": {"location": {"type": "string"}}}',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'tools',
						value: '={{$parameter.tools && $parameter.tools.toolsList && $parameter.tools.toolsList.length > 0 ? $parameter.tools.toolsList.map(tool => ({"type": tool.type, "function": {"name": tool.functionName, "description": tool.functionDescription, "parameters": tool.functionParameters ? JSON.parse(tool.functionParameters) : {}}})) : undefined}}',
					},
				},
			},
			{
				displayName: 'Tool Choice',
				name: 'toolChoice',
				description: 'Controls which (if any) tool is called by the model',
				type: 'options',
				options: [
					{
						name: 'Auto',
						value: 'auto',
						description: 'The model can pick between generating a message or calling one or more tools',
					},
					{
						name: 'None',
						value: 'none',
						description: 'The model will not call any tool and instead generates a message',
					},
					{
						name: 'Required',
						value: 'required',
						description: 'The model must call one or more tools',
					},
					{
						name: 'Function',
						value: 'function',
						description: 'Specifies a particular tool via {"type": "function", "function": {"name": "my_function"}}',
					},
				],
				default: 'auto',
				routing: {
					send: {
						type: 'body',
						property: 'tool_choice',
					},
				},
			},
			{
				displayName: 'Tool Choice Function Name',
				name: 'toolChoiceFunctionName',
				description: 'The name of the function to call when tool choice is set to function',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						toolChoice: ['function'],
					},
				},
				routing: {
					send: {
						type: 'body',
						property: 'tool_choice',
						value: '={{"type": "function", "function": {"name": $parameter.toolChoiceFunctionName}}}',
					},
				},
			},
		],
	},
];

export const textFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                               text:complete                        */
	/* -------------------------------------------------------------------------- */
	...completeOperations,

	/* -------------------------------------------------------------------------- */
	/*                                text:ALL                                    */
	/* -------------------------------------------------------------------------- */
	...sharedOperations,
];