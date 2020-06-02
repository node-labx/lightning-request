const test = require('ava');
const syncRequest = require('../lib/syncRequest');

test('参数 url 校验', (t) => {
  try {
    syncRequest();
  } catch (error) {
    t.is(error.message, 'request param url is required.');
  }
});

test('请求协议校验', (t) => {
  try {
    syncRequest({
      url: 'ftp://api.github.com/repos/node-labx/lightning-request',
    });
  } catch (error) {
    t.is(error.message, 'Protocol "ftp:" not supported. Expected "http:" or "https:"');
  }
});

test('HTTP to HTTPS', (t) => {
  const resp = syncRequest({
    url: 'http://api.github.com/repos/node-labx/lightning-request',
  });
  t.is(resp.statusCode, 301);
});

test('简单 HTTP GET 请求 ', (t) => {
  const resp = syncRequest({
    url: 'https://api.github.com/repos/node-labx/lightning-request',
  });

  t.true([200, 403].indexOf(resp.statusCode) > -1);
});

test('HTTP GET 请求带 Query 参数', (t) => {
  try {
    const resp = syncRequest({
      url: 'https://api.github.com/search/repositories',
      data: {
        q: 'lightning-request',
      },
    });
    t.is(resp.statusCode, 200);
  } catch (error) {
    console.log(error);
  }
});
