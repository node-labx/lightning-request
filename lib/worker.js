const request = require('./request');

module.exports = function () {
  return (options) => {
    return request(options).then((resp) => resp);
  };
};
