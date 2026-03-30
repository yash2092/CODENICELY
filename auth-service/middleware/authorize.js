/**
 * Middleware factory: authorize(resource, action)
 * Checks that the authenticated user has the required permission.
 * Must be used AFTER the authenticate middleware.
 *
 * Permissions are stored in the JWT payload as ["resource:action", ...].
 */
function authorize(resource, action) {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return res.status(403).json({ message: 'Forbidden: no permissions found' });
    }

    const required = `${resource}:${action}`;
    const hasPermission = req.user.permissions.includes(required);

    if (!hasPermission) {
      return res.status(403).json({
        message: `Forbidden: you do not have '${required}' permission`,
      });
    }

    next();
  };
}

module.exports = authorize;
