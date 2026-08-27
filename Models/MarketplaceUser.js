const mongoose = require('mongoose');

// Stessa collezione "users" usata dal marketplace (ProgettoMuseo/server_marketplace).
const purchaseSchema = new mongoose.Schema(
  {
    itemId: String,
    visitId: String,
    price: Number,
    boughtAt: String
  },
  { _id: false }
);

const marketplaceUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['author', 'visitor', 'admin', 'other'], default: 'other' },
  credit: { type: Number, default: 0 },
  purchases: { type: [purchaseSchema], default: [] },
  // Museo a cui l'account è associato (tipicamente per gli autori/curatori).
  museumId: { type: String, default: null }
});

module.exports = mongoose.model('MarketplaceUser', marketplaceUserSchema, 'users');
