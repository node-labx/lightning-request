var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code) {
  var error = new Error(message);
  return enhanceError(error, config, code);
};
