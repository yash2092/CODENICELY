const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const tokenService = require('./tokenService');
const ms = require('../utils/ms');
const config = require('../utils/config');

/**
 * Resolve flat permission strings from a populated user.
 * e.g. ["orders:read", "orders:write"]
 */
function resolvePermissions(user) {
  const perms = new Set();
  for (const role of user.roles) {
    for (const perm of role.permissions) {
      perms.add(`${perm.resource}:${perm.action}`);
    }
  }
  return [...perms];
}

/**
 * Login: validate credentials, issue tokens.
 */
async function login(email, password) {
  // +password so the hashed password is included (select: false by default)
  const user = await User.findOne({ email })
    .select('+password')
    .populate({
      path: 'roles',
      populate: { path: 'permissions' },
    });

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is disabled. Contact an administrator.');
    err.statusCode = 403;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const permissions = resolvePermissions(user);
  const accessToken = tokenService.generateAccessToken(user, permissions);
  const refreshTokenRaw = tokenService.generateRefreshToken(user);

  // Store hashed refresh token in DB
  const hashedToken = RefreshToken.hashToken(refreshTokenRaw);
  await RefreshToken.create({
    token: hashedToken,
    user: user._id,
    expiresAt: new Date(Date.now() + ms(config.jwtRefresh.expiresIn)),
  });

  return { accessToken, refreshToken: refreshTokenRaw };
}

/**
 * Refresh: validate refresh token, issue new pair.
 */
async function refresh(rawRefreshToken) {
  // Verify JWT signature
  let decoded;
  try {
    decoded = tokenService.verifyRefreshToken(rawRefreshToken);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  // Check DB
  const hashedToken = RefreshToken.hashToken(rawRefreshToken);
  const storedToken = await RefreshToken.findOne({ token: hashedToken });
  if (!storedToken) {
    const err = new Error('Refresh token not found or already revoked');
    err.statusCode = 401;
    throw err;
  }

  // Remove old token (rotate)
  await storedToken.deleteOne();

  // Fetch user with roles+permissions
  const user = await User.findById(decoded.sub).populate({
    path: 'roles',
    populate: { path: 'permissions' },
  });

  if (!user || !user.isActive) {
    const err = new Error('User not found or disabled');
    err.statusCode = 401;
    throw err;
  }

  const permissions = resolvePermissions(user);
  const newAccessToken = tokenService.generateAccessToken(user, permissions);
  const newRefreshTokenRaw = tokenService.generateRefreshToken(user);

  const newHashedToken = RefreshToken.hashToken(newRefreshTokenRaw);
  await RefreshToken.create({
    token: newHashedToken,
    user: user._id,
    expiresAt: new Date(Date.now() + ms(config.jwtRefresh.expiresIn)),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshTokenRaw };
}

/**
 * Logout: revoke refresh token.
 */
async function logout(rawRefreshToken) {
  if (!rawRefreshToken) return;
  const hashedToken = RefreshToken.hashToken(rawRefreshToken);
  await RefreshToken.findOneAndDelete({ token: hashedToken });
}

module.exports = { login, refresh, logout };
