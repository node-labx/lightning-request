const net = require('net');
const Debug = require('debug');

const debug = Debug('conn:');
var CRLF = '\r\n';

class Connection {
  get defaultOptions() {
    return {
      keepAlive: true,
      timeout: 3000,
    };
  }

  constructor(options = {}) {
    this.options = Object.assign(this.defaultOptions, options);
    this.socket = null;
    this.bufferData = Buffer.alloc(0);
    this.cacheData = null;
    this.successCall = null;
    this.failCall = null;
    this.connect();
  }

  connect() {
    this.socket = new net.Socket();
    this.socket.setKeepAlive(this.options.keepAlive);
    this.socket.setTimeout(this.options.timeout);
    this.socket.connect(this.options.port, this.options.host);

    this.socket
      .on('lookup', () => {
        // Emitted after resolving the hostname but before connecting. Not applicable to Unix sockets.
        debug('socket event -> lookup');
      })
      .on('connect', () => {
        // Emitted when a socket connection is successfully established.
        debug('socket event -> connect');
      })
      .on('ready', () => {
        // Emitted when a socket is ready to be used.
        debug('socket event -> ready');
        if (this.cacheData) {
          this.socket.write(this.cacheData);
          this.cacheData = null;
        }
      })
      .on('data', chunk => {
        // Emitted when data is received.
        debug('socket event -> data');
        this.bufferData = Buffer.concat([this.bufferData, chunk], this.bufferData.length + chunk.length);

        const idx = this.bufferData.indexOf('0\r\n\r\n');
        if (idx > -1) {
          this.successCall(this.bufferData);
          // console.log(this.bufferData.toString().split('\r\n'));
        }
      })
      .on('timeout', () => {
        // Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle.
        // The user must manually close the connection.
        debug('socket event -> timeout');
      })
      .on('drain', () => {
        // Emitted when the write buffer becomes empty. Can be used to throttle uploads.
        debug('socket event -> drain');
      })
      .on('end', () => {
        // Emitted when the other end of the socket sends a FIN packet, thus ending the readable side of the socket.
        debug('socket event -> end');
      })
      .on('error', err => {
        // Emitted when an error occurs. The 'close' event will be called directly following this event.
        debug('socket event -> error');
        if (!this.socket.destroyed) {
          this.socket.destroy();
        }
      })
      .on('close', () => {
        // Emitted once the socket is fully closed.
        // The argument hadError is a boolean which says if the socket was closed due to a transmission error.
        debug('socket event -> close');
        if (!this.socket.destroyed) {
          this.socket.destroy();
        }
        setTimeout(() => {
          this.socket.connect(this.options.port, this.options.host);
        }, 3000);
      });
  }

  destroy() {}

  write(data, successCall, failCall) {
    this.successCall = successCall;
    this.failCall = failCall;
    debug('socket ready status check');
    if (this.ready) {
      debug('socket start send');
      this.socket.write(data);
    } else {
      debug('data temporary cache.');
      this.cacheData = data;
    }
  }
}

module.exports = Connection;
