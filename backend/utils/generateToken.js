const jwt = require("jsonwebtoken");

/**
 * Signs and returns a JWT for the given user.
 *
 * @param {object} payload   Data to embed in the token (id, role)
 * @returns {string}         Signed JWT string
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
