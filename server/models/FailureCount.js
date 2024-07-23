const mongoose = require('mongoose');

const FailureCountSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('FailureCount', FailureCountSchema);
