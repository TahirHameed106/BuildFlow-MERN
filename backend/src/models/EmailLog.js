const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema({
  to: String,
  subject: String,
  body: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailLog', EmailLogSchema);
