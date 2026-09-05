/**
 * Standardised API response helpers.
 *
 * Every controller should use these helpers so that the response
 * shape is always:
 *
 *   Success:  { success: true,  data:    <payload> }
 *   Error:    { success: false, message: <string>  }
 */

/**
 * Send a successful response.
 * @param {import("express").Response} res
 * @param {number} statusCode  HTTP status code (default 200)
 * @param {*}      data        Payload to include in `data`
 * @param {string} [message]   Optional message
 */
const sendSuccess = (res, statusCode = 200, data = {}, message = "") => {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
};

/**
 * Send an error response.
 * @param {import("express").Response} res
 * @param {number} statusCode  HTTP status code (default 500)
 * @param {string} message     Human-readable error message
 */
const sendError = (res, statusCode = 500, message = "Something went wrong", errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };
