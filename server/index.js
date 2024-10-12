require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const statusRoutes = require('./routes/statusRoutes');
const sendEmail = require('./controllers/mailer');
const FailureCount = require('./models/FailureCount');
const Organization = require('./models/Organization');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route Handling
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/status', statusRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
// Helper function to check if the current time is within any maintenance window
const isWithinMaintenanceWindow = (maintenanceWindows) => {
  if (!maintenanceWindows || !Array.isArray(maintenanceWindows)) {
    return false; // Return false if maintenanceWindows is undefined or not an array
  }

  const currentTime = new Date();
  return maintenanceWindows.some(window =>
    currentTime >= new Date(window.start) && currentTime <= new Date(window.end)
  );
};

// Define the checkUrlStatus function
const checkUrlStatus = async () => {
  try {
    const organizations = await Organization.find({}).populate('users');

    for (const org of organizations) {
      // Check if the current time is within a maintenance window
      if (isWithinMaintenanceWindow(org.maintenanceWindows)) {
        console.log(`Skipping monitoring for ${org.url} due to scheduled maintenance.`);
        continue; // Skip this iteration and continue with the next organization
      }

      try {
        //Perform URL check
        const response = await axios.get(org.url);
        if (response.status !== 200) {
          await handleUrlDown(org);
        }
      } catch (error) {
        await handleUrlDown(org);
      }
    }
  } catch (error) {
    console.error('Error checking URL status:', error);
  }
};

const handleUrlDown = async (org) => {
  const usersEmails = org.users.map(user => user.email);
  for (const email of usersEmails) {
    sendEmail(email, 'URL Down Alert', `Your URL ${org.url} is down! Please check the status of your URL.`);
  }
};


// Set an interval to check URLs every 4 minutes
setInterval(checkUrlStatus, 240000); // 4 minutes in milliseconds

// Start the Express server
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port', process.env.PORT || 5000);
});
