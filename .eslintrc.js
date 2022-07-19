module.exports = {
	root: true,

	env: {
		browser: true,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},
	ignorePatterns: [
		'.eslintrc.js',
		'**/*.js',
		'**/node_modules/**',
		'**/dist/**',
	],

	overrides: [
		{
			files: ['package.json'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/community'],
		},
		{
			files: ['./credentials/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/credentials'],
			rules: {
				'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
				'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',

				'n8n-nodes-base/cred-filename-against-convention': 'off',
				'n8n-nodes-base/cred-class-field-name-uppercase-first-char': 'off',
			},
		},
		{
			files: ['./nodes/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/nodes'],
			rules: {
				'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
				'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
				'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
				'n8n-nodes-base/node-execute-block-operation-missing-singular-pairing': 'off',
				'n8n-nodes-base/node-execute-block-operation-missing-plural-pairing': 'off',

				'n8n-nodes-base/node-dirname-against-convention': 'off',
				'n8n-nodes-base/node-filename-against-convention': 'off',
				'n8n-nodes-base/node-param-operation-option-action-miscased': 'off',
				'n8n-nodes-base/node-param-display-name-miscased': 'off',
			},
		},
	],
};
