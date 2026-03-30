const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const ordersController = require('../controllers/ordersController');

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// GET /orders  → requires readOrder
router.get('/', authorize('readOrder'), ordersController.getOrders);

// POST /orders → requires writeOrder
router.post('/', authorize('writeOrder'), ordersController.createOrder);

// DELETE /orders/:id → requires deleteOrder
router.delete('/:id', authorize('deleteOrder'), ordersController.deleteOrder);

module.exports = router;
