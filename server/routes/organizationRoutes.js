const express = require('express');
const { createOrganization, getUserOrganizations, addUserToOrganization, deleteOrganization } = require('../controllers/organizationController');
const { authMiddleware } = require('../controllers/userController');

const router = express.Router();

// Create a new organization
router.post('/create', authMiddleware, createOrganization);

// Get all organizations for the logged-in user
router.get('/', authMiddleware, getUserOrganizations);

// Add a user to an organization
router.post('/addUser', authMiddleware, addUserToOrganization);

// Delete an organization
router.delete('/:orgId', authMiddleware, deleteOrganization);

module.exports = router;
