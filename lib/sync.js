const request = require('./request');

try {
  const options = JSON.parse(process.argv[2]) || {};

  request(options)
    .then(resp => {
      console.info(
        JSON.stringify({
          statusCode: resp.statusCode,
          statusMessage: resp.statusMessage,
          headers: resp.headers,
          data: resp.data,
        })
      );
    })
    .catch(err => {
      console.error(
        JSON.stringify({
          message: err.message,
          stack: err.stack,
        })
      );
    });
} catch (error) {}
