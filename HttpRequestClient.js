const { URL } = require('url');
const genericPool = require('generic-pool');
const Connection = require('./Connection');

class HttpRequestClient {
  constructor(options) {
    this.options = options;

    const factory = {
      create: () => {
        return new Connection(this.options);
      },
      destroy: conn => conn.destroy(),
      validate: conn => conn.ready,
    };
    this.pool = genericPool.createPool(factory, {
      max: 5,
      min: 1,
    });
  }

  get defaultHeaders() {
    return {
      Host: `${this.options.host}:${this.options.port}`,
      'Content-Type': 'application/json',
      'User-Agent': 'LightningHttpClient/0.0.1',
      Connection: 'keep-alive',
    };
  }

  async post(options) {
    options.headers = Object.assign(this.defaultHeaders, options.headers || {});
    const urlParsed = new URL(options.url);
    const postData = `POST ${urlParsed.pathname} HTTP/1.1
${Object.entries(options.headers)
  .map(([k, v]) => `${k}: ${v}`)
  .join('\r\n')}

${JSON.stringify(options.data)}`;

    console.log(postData);

    const conn = await this.pool.acquire();

    return new Promise((resolve, reject) => {
      conn.write(
        postData,
        function(resp) {
          resolve(resp);
        },
        function(error) {
          reject(error);
        }
      );
    });
  }
}

module.exports = HttpRequestClient;
