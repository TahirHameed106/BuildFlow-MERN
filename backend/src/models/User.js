const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    // Define the required roles from your project document
    enum: ['Manager', 'Engineer', 'HR'],
    default: 'Engineer', // Set default role
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);