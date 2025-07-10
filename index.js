const { S4DSAuth } = require('./dist/nodes/S4DSAuth/S4DSAuth.node.js');
const { S4DSExample } = require('./dist/nodes/S4DSExample/S4DSExample.node.js');

const { S4DSApi } = require('./dist/credentials/S4DSApi.credentials.js');

module.exports = {
	nodes: [S4DSAuth, S4DSExample],
	credentials: [S4DSApi],
};
