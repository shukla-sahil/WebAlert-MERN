const mongoose = require('mongoose');

const maintenanceWindowSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  }
});

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'unknown'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maintenanceWindows: [maintenanceWindowSchema]
});

module.exports = mongoose.model('Organization', OrganizationSchema);
