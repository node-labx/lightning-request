class Response {
  constructor(options = {}) {
    this.body = Buffer.alloc(0); // raw data
    this.headers = options.headers;
    this.statusCode = options.statusCode;
    this.statusMessage = options.statusMessage;
    this.data = this.body;
  }

  addChunk(chunk) {
    this.body = Buffer.concat([this.body, chunk]);
  }

  json() {
    try {
      return JSON.parse(this.text());
    } catch (error) {
      return this.text();
    }
  }

  text() {
    return this.body.toString('utf8');
  }

  buffer() {
    return this.body;
  }
}

module.exports = Response;
