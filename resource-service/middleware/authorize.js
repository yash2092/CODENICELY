
function authorize(permissionName) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.sub) {
        return res.status(401).json({ message: 'Unauthorized: missing user ID in token' });
      }

      // Fetch real-time permissions from Auth Service
      // In production, this URL should be read from an environment variable!
      const authServiceUrl = `http://localhost:3000/auth/users/${req.user.sub}/permissions`;
      const response = await fetch(authServiceUrl);

      if (!response.ok) {
        return res.status(response.status).json({ message: 'Failed to fetch user permissions from Auth Service' });
      }

      const data = await response.json();
      const userPermissions = data.permissions || [];

      if (!userPermissions.includes(permissionName)) {

        return res.status(403).json({
          message: `Forbidden: you do not have '${permissionName}' permission`,
        });
      }

      next();
    } catch (err) {
      console.error('Authorization fetch error:', err);
      res.status(500).json({ message: 'Internal server error during authorization' });
    }
  };
}

module.exports = authorize;
