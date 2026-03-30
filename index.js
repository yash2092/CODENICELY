require('dotenv').config();
const express = require('express');

// Import both microservice apps
const authApp = require('./auth-service/app');
const resourceApp = require('./resource-service/app');

const app = express();
const PORT = process.env.PORT || 3000;

// Mount the services underneath the primary Unified Orchestrator root
// Since the microservices maintain their base routes inside internally (auth: /auth, resource: /orders) 
// they can be cleanly mounted sequentially.
app.use(authApp);
app.use(resourceApp);

// Gateway Health / Status check
app.get('/', (req, res) => {
  res.json({ message: 'Unified API Gateway Operational', unified_services: ['auth-service', 'resource-service'] });
});

// Since auth-service/app.js handles MongoDB connections, the DB is already actively connecting across events.
app.listen(PORT, () => {
  console.log(`🌟 Unified Orchestrator running on http://localhost:${PORT}`);
});
