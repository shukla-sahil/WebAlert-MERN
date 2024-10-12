const express = require('express');
const { createOrganization, getUserOrganizations, addUserToOrganization, deleteOrganization, addMaintenanceWindow, getMaintenanceWindows } = require('../controllers/organizationController');
const { authMiddleware } = require('../controllers/userController');

const router = express.Router();

// Create a new organization
router.post('/create', authMiddleware, createOrganization);

// Get all organizations for the logged-in user
router.get('/', authMiddleware, getUserOrganizations);

// Add a user to an organization
router.post('/addUser', authMiddleware, addUserToOrganization);

// Add a maintenance window to an organization
router.post('/:orgId/set-maintenance', authMiddleware, addMaintenanceWindow); // New Route

// Get maintenance windows for an organization
router.get('/:orgId/get-maintenance', authMiddleware, getMaintenanceWindows); // New Route

// Delete an organization
router.delete('/:orgId', authMiddleware, deleteOrganization);

module.exports = router;
