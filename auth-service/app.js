const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./utils/config');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Global middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ── Routes ─────────────────────────────────────────────────────────
app.use('/auth', authRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// ── Error handler ──────────────────────────────────────────────────
app.use(errorHandler);

// ── Server initialization ──────────────────────────────────────────
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('✅ Auth Service: Connected to MongoDB');
    if (require.main === module) {
      app.listen(config.port, () => {
        console.log(`🚀 Auth Service running on http://localhost:${config.port}`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
