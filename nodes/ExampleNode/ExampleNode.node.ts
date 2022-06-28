import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class ExampleNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Example Node',
		name: 'exampleNode',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Example Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties that the user can see and change on the node.
			{
				displayName: 'My String',
				name: 'myString',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'This is a description',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// The node iterates over all input items and adds the key "myString" with the
		// value the parameter "myString" resolves to. (This could be a different value
		// for each item in case it contains an expression.)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const myString = this.getNodeParameter('myString', itemIndex, '') as string;
			const item = items[itemIndex];

			item.json['myString'] = myString;
		}

		return this.prepareOutputData(items);
	}
}
