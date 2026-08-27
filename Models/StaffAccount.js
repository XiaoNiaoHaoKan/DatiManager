const mongoose = require('mongoose');

// Account dello staff editor di Jack: stessa collezione "users" letta da Jack/Server per il login.
const staffAccountSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    museumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Museum', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StaffAccount', staffAccountSchema, 'users');
