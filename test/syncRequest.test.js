const test = require('ava');
const { syncRequest } = require('../index');

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
      url: 'ftp://127.0.0.1:3000/',
    });
  } catch (error) {
    t.is(error.message, 'Protocol "ftp:" not supported. Expected "http:" or "https:"');
  }
});

test('简单 HTTP GET 请求 200 响应', (t) => {
  const resp = syncRequest({
    url: 'http://127.0.0.1:3000/200',
  });
  t.is(resp.statusCode, 200);
});

test('简单 HTTP GET 请求 301 响应', (t) => {
  const resp = syncRequest({
    url: 'http://127.0.0.1:3000/301',
  });
  t.is(resp.statusCode, 301);
});

test('HTTP GET 请求带 Query 参数', (t) => {
  try {
    const resp = syncRequest({
      url: 'http://127.0.0.1:3000/200',
      data: {
        q: 'lightning-request',
      },
    });
    t.is(resp.statusCode, 200);
  } catch (error) {
    console.log(error);
  }
});
