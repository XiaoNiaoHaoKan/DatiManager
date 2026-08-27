const mongoose = require('mongoose');

// Stessa MongoDB "artaround" condivisa da Jack, Luigi e ProgettoMuseo.
async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artaround';
  await mongoose.connect(uri);

  const users = mongoose.connection.collection('users');
  const emailIndex = (await users.indexes()).find((index) => index.name === 'email_1');
  if (emailIndex && !emailIndex.sparse) {
    await users.dropIndex('email_1');
    await users.createIndex({ email: 1 }, { name: 'email_1', unique: true, sparse: true });
  }

  console.log(`MongoDB connected (${uri})`);
}

module.exports = { connectDB };
