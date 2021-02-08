const test = require('ava');
const fs = require('fs');
const path = require('path');
const request = require('../index');
const httpServer = require('./server/index');

let port;
let server;

test.before('run server', async () => {
  try {
    const result = await httpServer();
    port = result.port;
    server = result.server;
  } catch (err) {
    console.log('test before hook error: ', err);
  }
});

test.after('close server', function() {
  server && server.close();
});

test('put request with stream', async (t) => {
  const tmp = path.join(process.cwd(), 'test/file/tmp.txt');
  const stream = fs.createReadStream(tmp);

  try {
    const result = await request({
      url: 'http://localhost:' + port + '/stream',
      data: stream,
      method: 'PUT',
    });

    t.is(result.data, fs.readFileSync(tmp, { encoding: 'utf-8'}));
  } catch (err) {
    console.log(err);
    t.fail(err);
  }
});

test.cb('get request with stream responseType', (t) => {
  t.plan(1);

  request({
    url: 'http://localhost:' + port + '/stream',
    responseType: 'stream',
  }).then((result) => {
    const chunks  = [];

    result.data.on('data', (buf) => chunks.push(buf));
    result.data.on('end', () => {
      const datas = Buffer.concat(chunks).toString();
      const tmp = path.join(process.cwd(), 'test/file/tmp.txt');

      t.is(datas, fs.readFileSync(tmp, { encoding: 'utf-8'}));
      t.end();
    })
  }).catch((err) => {
    console.log(err);
    t.fail(err);
    t.end();
  });
})
