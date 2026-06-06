const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    default: 'manit_admin' // Your master username
  },
  passwordHash: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Admin', AdminSchema);