require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/auth_db',
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
  jwtRefresh: {
    secret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};
