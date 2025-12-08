import { config } from '@n8n/node-cli/eslint';

export default [
	...config,
	{
		files: ['**/*.ts'],
		rules: {
			'@n8n/community-nodes/no-restricted-imports': 'off',
			'@n8n/community-nodes/no-restricted-globals': 'off',
		},
	},
];
