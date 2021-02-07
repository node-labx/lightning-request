const init = require('sync-rpc');

let remote;
function syncRequest(options = {}) {
  if (!remote) {
    remote = init(require.resolve('./worker'));
  }
  return remote(options);
}

module.exports = syncRequest;
