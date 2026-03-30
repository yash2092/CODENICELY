const crypto = require('crypto');

// ── In-memory orders store ─────────────────────────────────────────
let orders = [
  { id: '1', item: 'Laptop', quantity: 2, status: 'pending', createdBy: 'seed' },
  { id: '2', item: 'Keyboard', quantity: 5, status: 'shipped', createdBy: 'seed' },
];

/**
 * GET /orders
 */
function getOrders(req, res) {
  res.json({
    message: 'Orders retrieved successfully',
    count: orders.length,
    data: orders,
  });
}

/**
 * POST /orders
 */
function createOrder(req, res) {
  const { item, quantity } = req.body;
  console.log(item, quantity)
  if (!item || quantity == null) {
    return res.status(400).json({ message: 'item and quantity are required' });
  }

  const newOrder = {
    id: crypto.randomUUID(),
    item,
    quantity,
    status: 'pending',
    createdBy: req.user.email,
  };

  orders.push(newOrder);

  res.status(201).json({
    message: 'Order created successfully',
    data: newOrder,
  });
}

/**
 * DELETE /orders/:id
 */
function deleteOrder(req, res) {
  const { id } = req.params;
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Order with id '${id}' not found` });
  }

  const [removed] = orders.splice(index, 1);
  res.json({
    message: 'Order deleted successfully',
    data: removed,
  });
}

module.exports = { getOrders, createOrder, deleteOrder };
