const { S4DSMain } = require('./dist/nodes/S4DSMain/S4DSMain.node.js');

const { S4DSApi } = require('./dist/credentials/S4DSApi.credentials.js');

module.exports = {
	nodes: [S4DSMain],
	credentials: [S4DSApi],
};
