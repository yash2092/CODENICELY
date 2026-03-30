const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /auth/login
router.post('/login', authController.login);

// POST /auth/refresh
router.post('/refresh', authController.refresh);

// POST /auth/logout
router.post('/logout', authController.logout);

// GET /auth/users/:id/permissions
router.get('/users/:id/permissions', authController.getUserPermissions);

module.exports = router;
