const mongoose = require('mongoose');

// Museo unico e condiviso da marketplace, staff editor (Jack) e navigator (Luigi).
// "id" è la stringa dell'ObjectId: è lo stesso valore che Jack mette nel QR e che
// marketplace/staff/navigator usano come "museumId" sugli item e sulle visite,
// cosi' un solo museo risulta identico su tutti e tre i prodotti.
const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' }
  },
  { _id: false }
);

const museumSchema = new mongoose.Schema({
  id: { type: String, unique: true, trim: true },
  name: { type: String, required: true, unique: true, trim: true },
  city: { type: String, default: '' },
  description: { type: String, default: '' },
  entry: { type: String, default: '' },
  rooms: { type: [roomSchema], default: [] },
  visits: { type: [mongoose.Schema.Types.ObjectId], ref: 'Visit', default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Museum', museumSchema, 'museums');
