/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.toJSON = function toJSON() {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
      config: this.config,
      code: this.code,
    };
  };
  return error;
};
