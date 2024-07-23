const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Dashboard route to get user data
const getUserDashboard = async (req, res) => {
  try {
    const user = req.user; // From authMiddleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export authMiddleware if needed in other parts of the code
module.exports = { authMiddleware, getUserDashboard };
