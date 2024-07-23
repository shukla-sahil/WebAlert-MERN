const express = require('express');
const { getUserDashboard } = require('../controllers/userController');
const { authMiddleware } = require('../controllers/userController');

const router = express.Router();

// Protected route to get user dashboard
router.get('/dashboard', authMiddleware, getUserDashboard);

module.exports = router;
