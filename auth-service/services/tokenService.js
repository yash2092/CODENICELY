const jwt = require('jsonwebtoken');
const config = require('../utils/config');

/**
 * Generate a short-lived access token.
 * Payload includes user id, email, roles, and a flat list of permissions.
 */
function generateAccessToken(user, permissions) {
  const payload = {
    sub: user._id,
    email: user.email,
    roles: user.roles.map((r) => r.name),
    permissions, // ["orders:read", "orders:write", ...]
  };
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * Generate a long-lived refresh token (random + signed).
 */
function generateRefreshToken(user) {
  const payload = { sub: user._id, type: 'refresh' };
  return jwt.sign(payload, config.jwtRefresh.secret, {
    expiresIn: config.jwtRefresh.expiresIn,
  });
}

/**
 * Verify an access token and return decoded payload.
 */
function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

/**
 * Verify a refresh token and return decoded payload.
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwtRefresh.secret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
