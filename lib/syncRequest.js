const spawnSync = require('child_process').spawnSync;

function syncRequest(options = {}) {
  var args = [__dirname + '/sync.js', JSON.stringify(options)];
  var proc = spawnSync(process.argv[0], args, { encoding: 'utf8' });

  if (proc.stdout) {
    return JSON.parse(proc.stdout);
  } else if (proc.stderr) {
    const resp = JSON.parse(proc.stderr);
    const err = new Error(resp.message);
    err.stack = resp.stack;

    throw err;
  }
}

module.exports = syncRequest;
