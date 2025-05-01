import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

class BaseAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Base Agent',
		name: 'baseAgent',
		icon: 'file:base.svg',
		group: ['blockchain'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Base onchain AI agents',
		defaults: {
			name: 'Base Agent',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'baseApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Create Token',
						value: 'createToken',
						description: 'Create a new token',
						action: 'Create a new token',
					},
					{
						name: 'Transfer Token',
						value: 'transferToken',
						description: 'Transfer tokens',
						action: 'Transfer tokens',
					},
					{
						name: 'Get Token Balances',
						value: 'getTokenBalances',
						description: 'Get all token balances for a wallet',
						action: 'Get token balances',
					},
					{
						name: 'Get Single Token Balance',
						value: 'getSingleBalance',
						description: 'Get balance for a specific token',
						action: 'Get single token balance',
					},
					{
						name: 'Get Other Wallet Balance',
						value: 'getOtherBalance',
						description: 'Get token balance for another wallet',
						action: 'Get other wallet balance',
					},
					{
						name: 'Close Empty Token Accounts',
						value: 'closeEmptyTokenAccounts',
						action: 'Close empty token accounts',
					},
					{
						name: 'Request Faucet Funds',
						value: 'requestFaucet',
						description: 'Request SOL from faucet (devnet/testnet)',
						action: 'Request faucet funds',
					},
					{
						name: 'Get Network TPS',
						value: 'getTPS',
						description: 'Get current network TPS',
						action: 'Get network TPS',
					},
					{
						name: 'Get Wallet Address',
						value: 'getWalletAddress',
						description: 'Get current wallet address',
						action: 'Get wallet address',
					},
				],
				default: 'createToken',
			},
			// Token Creation Parameters
			{
				displayName: 'Token Name',
				name: 'tokenName',
				type: 'string',
				typeOptions: { password: true },
				required: true,
				displayOptions: {
					show: {
						operation: ['createToken'],
					},
				},
				default: '',
				description: 'Name of the token to create',
			},
			{
				displayName: 'Token Symbol',
				name: 'tokenSymbol',
				type: 'string',
				typeOptions: { password: true },
				required: true,
				displayOptions: {
					show: {
						operation: ['createToken'],
					},
				},
				default: '',
				description: 'Symbol of the token to create',
			},
			{
				displayName: 'Decimals',
				name: 'decimals',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createToken'],
					},
				},
				default: 9,
				description: 'Number of decimal places for the token',
			},
			{
				displayName: 'Initial Supply',
				name: 'initialSupply',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createToken'],
					},
				},
				default: 0,
				description: 'Initial supply of tokens to mint',
			},
			// Transfer Parameters
			{
				displayName: 'Recipient Address',
				name: 'recipientAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['transferToken'],
					},
				},
				default: '',
				description: 'Recipient wallet address',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['transferToken'],
					},
				},
				default: 0,
				description: 'Amount to transfer',
			},
			{
				displayName: 'Token Address',
				name: 'tokenAddress',
				type: 'string',
				typeOptions: { password: true },
				displayOptions: {
					show: {
						operation: ['transferToken', 'getSingleBalance'],
					},
				},
				default: '',
				description: 'SPL token address (leave empty for SOL)',
			},
			// Balance Parameters
			{
				displayName: 'Wallet Address',
				name: 'walletAddress',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getTokenBalances', 'getOtherBalance'],
					},
				},
				default: '',
				description: 'Wallet address to check balances for (leave empty for own wallet)',
			},
			{
				displayName: 'Token Address for Other Wallet',
				name: 'otherTokenAddress',
				type: 'string',
				typeOptions: { password: true },
				displayOptions: {
					show: {
						operation: ['getOtherBalance'],
					},
				},
				default: '',
				description: 'Token address to check balance for (leave empty for SOL)',
			},
		],
	};

	

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		
		// Get credentials
		const credentials = await this.getCredentials('baseApi');
		const rpcUrl = credentials.rpcUrl;
		rpcUrl
		// Initialize Wallet
		
		// Initialize Base Agent Kit
		

		for (let i = 0; i < items.length; i++) {
			try {
				let result;
				
				switch (operation) {

					//TODO: define base on chain actions
					case 'transferToken':
						// const recipientAddress = new PublicKey(this.getNodeParameter('recipientAddress', i) as string);
						// const amount = this.getNodeParameter('amount', i) as number;
						// const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
						// const mintAddress = tokenAddress ? new PublicKey(tokenAddress) : undefined;
						// result = await agent.methods.transfer(agent, recipientAddress, amount, mintAddress);
						break;

					
					default:
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
				}

				returnData.push({
					json: {result},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw error;
			}
		}
		
		return [returnData];
	}
}

// Export the class
export { BaseAgent }; 