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

// Define the checkUrlStatus function
const checkUrlStatus = async () => {
  try {
    const organizations = await Organization.find({}).populate('users');

    for (const org of organizations) {
      try {
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
  const failureCount = await getFailureCount(org.url);

  if (failureCount < 2) {
    await incrementFailureCount(org.url);
    sendEmail(org.owner.email, 'URL Down Alert', `Your URL ${org.url} is down!`);
  } else {
    const usersEmails = org.users.map(user => user.email);
    for (const email of usersEmails) {
      sendEmail(email, 'URL Down Alert', `Your URL ${org.url} is still down! If you are deciding to no longer operate this URL, we suggest you remove it from your account.`);
    }
    await resetFailureCount(org.url);
  }
};

const getFailureCount = async (url) => {
  const failureCount = await FailureCount.findOne({ url });
  return failureCount ? failureCount.count : 0;
};

const incrementFailureCount = async (url) => {
  const result = await FailureCount.findOneAndUpdate(
    { url },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
  return result.count;
};

const resetFailureCount = async (url) => {
  await FailureCount.findOneAndUpdate({ url }, { count: 0 });
};

// Set an interval to check URLs every 5 minutes
setInterval(checkUrlStatus, 60000); // 5 minutes in milliseconds

// Start the Express server
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port', process.env.PORT || 5000);
});
