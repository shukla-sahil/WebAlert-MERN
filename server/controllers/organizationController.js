const Organization = require('../models/Organization');
const User = require('../models/user');

// Create organization
exports.createOrganization = async (req, res) => {
  const { name, url } = req.body;
  const ownerId = req.user.id; // Assuming req.user is set by authMiddleware

  try {
    // Check if the URL is already used in any organization
    const existingOrg = await Organization.findOne({ url, owner: ownerId });
    if (existingOrg) {
      return res.status(400).json({ message: 'URL is already being monitored in your organization' });
    }

    // Create the organization
    const newOrganization = new Organization({
      name,
      url,
      owner: ownerId,
      users: [ownerId]
    });

    await newOrganization.save();

    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Add user to organization
exports.addUserToOrganization = async (req, res) => {
  const { username, orgId } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the organization exists
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if the user is already part of the organization
    if (organization.users.includes(user._id)) {
      return res.status(400).json({ message: 'User already in the organization' });
    }

    // Add the user to the organization
    organization.users.push(user._id);
    await organization.save();

    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all organizations for the logged-in user
exports.getUserOrganizations = async (req, res) => {
  const userId = req.user.id; // Assuming req.user is set by authMiddleware

  try {
    const organizations = await Organization.find({ users: userId });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete organization
exports.deleteOrganization = async (req, res) => {
  const { orgId } = req.params;

  try {
    // Check if the organization exists
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Delete the organization
    await Organization.findByIdAndDelete(orgId);

    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.addMaintenanceWindow = async (req, res) => {
  const { start, end } = req.body;
  const { orgId } = req.params;

  try {
    // Find the organization
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Add the maintenance window
    organization.maintenanceWindows.push({ start, end });
    await organization.save();

    res.status(200).json({ message: 'Maintenance window added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaintenanceWindows = async (req, res) => {
  const { orgId } = req.params;

  try {
    // Find the organization
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Return the maintenance windows
    res.status(200).json(organization.maintenanceWindows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};