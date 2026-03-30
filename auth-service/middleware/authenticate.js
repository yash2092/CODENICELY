const tokenService = require('../services/tokenService');

/**
 * Middleware: authenticate
 * Extracts and verifies the JWT from the Authorization header.
 * Attaches decoded user info to req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = tokenService.verifyAccessToken(token);
    req.user = decoded; // { sub, email, roles, permissions }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}

module.exports = authenticate;
