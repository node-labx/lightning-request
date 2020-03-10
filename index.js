const http = require('http');
const https = require('https');
const { URL } = require('url');
const qs = require('querystring');
const Response = require('./lib/response');
const createError = require('./lib/createError');
const enhanceError = require('./lib/enhanceError');
const pkg = require('./package.json');

/**
 * @param {String} options.url `url` is the server URL that will be used for the request
 * @param {String} options.method `method` is the request method to be used when making the request
 * @param {Object} options.headers `headers` are custom headers to be sent
 * @param {Any} options.data `data` is the data to be sent as the request body
 * @param {Number} options.timeout`timeout` specifies the number of milliseconds before the request times out. If the request takes longer than `timeout`, the request will be aborted.
 * @param {String} options.responseType `responseType` indicates the type of data that the server will respond with, default: json
 * @param {Object} options.agent `agent` define a custom agent to be used when performing http/https requests, respectively, in node.js. This allows options to be added like `keepAlive` that are not enabled by default.
 */
async function request(options = {}) {
  if (!options.url) {
    throw new Error('request param url is required.');
  }
  const method = (options.method || 'GET').toUpperCase();
  const parsedUrl = new URL(options.url);
  let data = options.data;

  if (['GET', 'HEAD'].indexOf(method) > -1) {
    data &&
      Object.keys(data).forEach(key => {
        parsedUrl.searchParams.append(key, data[key]);
      });
  }

  const protocol = parsedUrl.protocol;
  const timeout = options.timeout || 15000;
  const headers = Object.assign(
    {
      'Content-Type': 'application/json',
      'User-Agent': `lr/${pkg.version}`,
    },
    options.headers || {}
  );
  const contentType = headers['Content-Type'];
  if (
    Object.prototype.toString.call(data) === '[object Object]' &&
    contentType.startsWith('application/x-www-form-urlencoded')
  ) {
    data = qs.stringify(data);
  } else if (Object.prototype.toString.call(data) !== '[object String]') {
    data = JSON.stringify(data);
  }

  const responseType = options.responseType || 'json';
  const agent = options.agent || (protocol === 'http:' ? http.globalAgent : https.globalAgent);

  return new Promise((resolve, reject) => {
    const requestOptions = {
      protocol: protocol,
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: headers,
      timeout: timeout,
      agent: agent,
    };

    const resHandler = res => {
      const statusCode = res.statusCode;
      let response = new Response({
        headers: res.headers,
        statusCode,
        statusMessage: res.statusMessage,
      });

      res.on('data', chunk => {
        response.addChunk(chunk);
      });
      res.on('end', () => {
        if (responseType === 'json' && statusCode === 200) {
          response.data = response.json();
        } else if (responseType === 'buffer' && statusCode === 200) {
          response.data = response.buffer();
        } else {
          response.data = response.text();
        }
        resolve(response);
      });
      res.on('error', err => {
        reject(enhanceError(err, options, null, req));
      });
    };

    let req;
    if (protocol === 'http:') {
      req = http.request(requestOptions, resHandler);
    } else if (protocol === 'https:') {
      req = https.request(requestOptions, resHandler);
    } else {
      throw new Error(`Protocol "${protocol}" not supported. Expected "http:" or "https:"`);
    }

    // Handle errors
    req.on('error', err => {
      if (req.aborted) {
        return;
      }
      reject(enhanceError(err, options, null, req));
    });

    // Handle request timeout
    if (timeout) {
      req.setTimeout(timeout, () => {
        req.abort();
        reject(createError('timeout of ' + timeout + 'ms exceeded', options, 'ECONNABORTED', req));
      });
    }

    if (data && ['GET', 'HEAD'].indexOf(method) === -1) {
      req.write(data);
    }
    req.end();
  });
}

function syncRequest(options = {}) {}

module.exports = request;
module.exports.syncRequest = syncRequest;
