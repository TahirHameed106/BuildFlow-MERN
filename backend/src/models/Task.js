const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    // Add the new status required for the workflow
    enum: ['Pending', 'In Progress', 'Completed', 'Pending Manager Approval'],
    default: 'Pending',
  },
  // New fields for deletion request tracking
  deletionRequested: { 
    type: Boolean, 
    default: false 
  },
  deletionReason: String,
  deletionRequestedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Task', TaskSchema);