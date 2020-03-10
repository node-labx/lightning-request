const test = require('ava');
const request = require('../index');

test('参数 url 校验', async t => {
  try {
    await request();
  } catch (error) {
    t.is(error.message, 'request param url is required.');
  }
});

test('请求协议校验', async t => {
  try {
    await request({
      url: 'ftp://api.github.com/repos/node-labx/lightning-request',
    });
  } catch (error) {
    t.is(error.message, 'Protocol "ftp:" not supported. Expected "http:" or "https:"');
  }
});

test('HTTP to HTTPS', async t => {
  const resp = await request({
    url: 'http://api.github.com/repos/node-labx/lightning-request',
  });
  t.is(resp.statusCode, 301);
});

test('简单 HTTP GET 请求 ', async t => {
  const resp = await request({
    url: 'https://api.github.com/repos/node-labx/lightning-request',
  });

  t.is(resp.statusCode, 200);
  t.is(resp.data.html_url, 'https://github.com/node-labx/lightning-request');
});

test('HTTP GET 请求带 Query 参数', async t => {
  try {
    const resp = await request({
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
