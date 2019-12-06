class Response {
  constructor(options = {}) {
    this.data = Buffer.alloc(0); // raw data
    this.headers = options.headers;
    this.statusCode = options.statusCode;
    this.statusMessage = options.statusMessage;
    this.body = this.data;
  }

  addChunk(chunk) {
    this.data = Buffer.concat([this.data, chunk]);
  }

  json() {
    return JSON.parse(this.text());
  }

  text() {
    return this.data.toString('utf8');
  }

  buffer() {
    return this.data;
  }
}

module.exports = Response;
