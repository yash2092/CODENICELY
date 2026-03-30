const authService = require('../services/authService');

/**
 * POST /auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const tokens = await authService.login(email, password);
    res.json({
      message: 'Login successful',
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const tokens = await authService.refresh(refreshToken);
    res.json({
      message: 'Token refreshed',
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/logout
 */
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

// Retain models for population logic inside getUserPermissions
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');

/**
 * GET /auth/users/:id/permissions
 */
async function getUserPermissions(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: 'roles',
      populate: { path: 'permissions' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const permissions = new Set();
    user.roles.forEach(role => {
      role.permissions.forEach(perm => {
        permissions.add(perm.name);
      });
    });

    res.json({ permissions: Array.from(permissions) });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, refresh, logout, getUserPermissions };
