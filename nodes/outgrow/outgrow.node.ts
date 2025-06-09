import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	ITriggerResponse,
	NodeApiError,
	NodeConnectionType,
} from 'n8n-workflow';

export class outgrow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Outgrow Trigger',
		name: 'outgrowTrigger',
		icon: 'file:outgrow.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["calcId"]}}',
		description: 'Fetch leads from Outgrow calculators at regular intervals',
		defaults: {
			name: 'Outgrow Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'outgrowApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Calculator',
				name: 'calcId',
				type: 'options',
				required: true,
				typeOptions: {
					loadOptionsMethod: 'getCalculators',
				},
				default: '',
				description: 'Which Outgrow calculator to fetch leads from',
			},
			{
				displayName: 'Polling Interval (Minutes)',
				name: 'pollingInterval',
				type: 'number',
				required: false,
				default: 5,
				description: 'How often (in minutes) to check for new leads',
			},
		],
	};

	methods = {
		loadOptions: {
			async getCalculators(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('outgrowApi');
				if (!credentials?.apiKey) {
					throw new NodeApiError(this.getNode(), {
						message: 'API Key is missing or invalid',
					});
				}

				const url = `https://api-calc.outgrow.co/api/v1/get_cal/${credentials.apiKey}`;
				try {
					const response = await this.helpers.request({ method: 'GET', url });
					const calculators = JSON.parse(response);

					return calculators.map((calc: { id: string; calculator: string }) => ({
						name: calc.calculator,
						value: calc.id,
					}));
				} catch (error) {
					throw new NodeApiError(this.getNode(), error, {
						message: 'Failed to load calculators',
					});
				}
			},
		},
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials('outgrowApi');
		if (!credentials?.apiKey) {
			throw new NodeApiError(this.getNode(), {
				message: 'API Key is missing or invalid',
			});
		}

		const calcId = this.getNodeParameter('calcId', 0) as string;
		if (!calcId) {
			throw new NodeApiError(this.getNode(), {
				message: 'No calculator selected',
			});
		}

		const pollingInterval = (this.getNodeParameter('pollingInterval', 0) as number) * 60 * 1000;
		const url = `https://api-calc.outgrow.co/api/v1/get_leads/${credentials.apiKey}/${calcId}`;

		const poll = async () => {
			try {
				const responseData = await this.helpers.request({
					method: 'GET',
					url,
					json: true,
				});

				if (responseData?.length > 0) {
					this.emit([this.helpers.returnJsonArray(responseData)]);
				} else {
					// UI-friendly "no leads" response
					this.emit([this.helpers.returnJsonArray([{
						status: 'no_data',
						message: 'No new leads in the last 24 hours',
						calculatorId: calcId,
						timestamp: new Date().toISOString(),
					}])]);
				}
			} catch (error) {
				throw new NodeApiError(this.getNode(), error, {
					message: 'Outgrow API Error',
				});
			}
		};

		const mode = this.getMode();
		if (mode === 'manual') {
			return {
				manualTriggerFunction: async () => await poll(),
			};
		}

		if (mode === 'trigger') {
			const interval = setInterval(poll, pollingInterval);
			await poll(); // Initial call

			return {
				closeFunction: async () => clearInterval(interval),
			};
		}

		return {};
	}
}