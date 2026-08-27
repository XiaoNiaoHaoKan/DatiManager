const mongoose = require('mongoose');

// Stessa MongoDB "artaround" condivisa da Jack, Luigi e ProgettoMuseo.
async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artaround';
  await mongoose.connect(uri);
  console.log(`MongoDB connected (${uri})`);
}

module.exports = { connectDB };
