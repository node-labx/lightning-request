const http = require('http');
const https = require('https');
const { URL } = require('url');
const qs = require('querystring');
const Response = require('./response');

/**
 * @param {String} options.url `url` is the server URL that will be used for the request
 * @param {String} options.method `method` is the request method to be used when making the request
 * @param {Object} options.headers `headers` are custom headers to be sent
 * @param {Any} options.data `data` is the data to be sent as the request body
 * @param {String} options.contentType `contentType` is the data to be sent, default: application/json
 * @param {Number} options.timeout`timeout` specifies the number of milliseconds before the request times out. If the request takes longer than `timeout`, the request will be aborted.
 * @param {String} options.responseType `responseType` indicates the type of data that the server will respond with, default: json
 * @param {Object} options.agentConfig `agentConfig` http.Agent or https.Agent config.
 * @param {Object} options.httpAgent `httpAgent` define a custom agent to be used when performing http requests, respectively, in node.js. This allows options to be added like `keepAlive` that are not enabled by default.
 * @param {Object} options.httpsAgent `httpsAgent` define a custom agent to be used when performing https requests, respectively, in node.js. This allows options to be added like `keepAlive` that are not enabled by default.
 */
async function request(options) {
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
  if (['http:', 'https:'].indexOf(protocol) === -1) {
    throw new Error(`protocol '${protocol}' is not supported.`);
  }

  const timeout = options.timeout || 15000;
  const contentType = options.contentType || 'application/json';
  if (contentType === 'application/json') {
    data = JSON.stringify(data);
  } else if (contentType === 'application/x-www-form-urlencoded') {
    data = qs.stringify(data);
  }
  const headers = Object.assign(
    {
      'Content-Type': contentType,
      'User-Agent': 'Lightweight Node.js HTTP client',
    },
    options.headers || {}
  );

  const responseType = options.responseType || 'json';
  const agentConfig = options.agentConfig || {
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
  };
  let agent;
  if (protocol === 'http:') {
    if (options.httpAgent) {
      agent = options.httpAgent;
    } else {
      agent = new http.Agent(agentConfig);
    }
  } else if (protocol === 'https:') {
    if (options.httpsAgent) {
      agent = options.httpsAgent;
    } else {
      agent = new https.Agent(agentConfig);
    }
  }

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

    let req;
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
          response.body = response.json();
        } else {
          response.body = response.text();
        }

        resolve(response);
      });
      res.on('error', err => {
        reject(err);
      });
    };

    if (protocol === 'http:') {
      req = http.request(requestOptions, resHandler);
    } else {
      req = https.request(requestOptions, resHandler);
    }

    if (timeout) {
      req.setTimeout(timeout, () => {
        req.abort();
        reject(new Error('request timeout.'));
      });
    }

    req.on('error', err => {
      reject(err);
    });
    if (data && ['GET', 'HEAD'].indexOf(method) === -1) {
      req.write(data);
    }
    req.end();
  });
}

module.exports = request;
