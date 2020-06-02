const init = require('sync-rpc');
const remote = init(require.resolve('./worker'));

function syncRequest(options = {}) {
  return remote(options);
}

module.exports = syncRequest;
