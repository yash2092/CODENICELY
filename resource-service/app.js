require('dotenv').config();

const express = require('express');
const cors = require('cors');
const ordersRoutes = require('./routes/ordersRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3002;

// ── Global middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────
app.use('/orders', ordersRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'resource-service' });
});

// ── Error handler ──────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Resource Service running on http://localhost:${PORT}`);
  });
}

module.exports = app;
