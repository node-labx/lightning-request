const test = require('ava');
const { syncRequest } = require('../index');

test('syncRequest#参数 url 校验', t => {
  try {
    syncRequest();
  } catch (error) {
    t.is(error.message, 'request param url is required.');
  }
});

test('syncRequest#HTTP to HTTPS', t => {
  const resp = syncRequest({
    url: 'http://api.github.com/repos/node-labx/lightning-request',
  });
  t.is(resp.statusCode, 301);
});

test('syncRequest#简单 HTTP GET 请求 ', t => {
  const resp = syncRequest({
    url: 'https://api.github.com/repos/node-labx/lightning-request',
  });

  t.true([200, 403].indexOf(resp.statusCode) > -1);
});
