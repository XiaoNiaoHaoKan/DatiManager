const mongoose = require('mongoose');
const Museum = require('../Models/Museum');

// GET /api/museums
async function listMuseums(req, res) {
  const museums = await Museum.find().sort({ name: 1 });
  res.json(museums);
}

// POST /api/museums
async function createMuseum(req, res) {
  const { name, city, description, entry } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Il nome del museo è obbligatorio.' });
  }

  const existing = await Museum.findOne({ name });
  if (existing) {
    return res.status(409).json({ error: 'Esiste già un museo con questo nome.' });
  }

  // "id" == "_id" in formato stringa: è il valore che Jack mette nel QR e che
  // marketplace/staff/navigator useranno come museumId per item e visite.
  const _id = new mongoose.Types.ObjectId();
  const museum = await Museum.create({
    _id,
    id: _id.toString(),
    name,
    city: city || '',
    description: description || '',
    entry: entry || ''
  });
  res.status(201).json(museum);
}

// DELETE /api/museums/:id
async function deleteMuseum(req, res) {
  const deleted = await Museum.findOneAndDelete({ id: req.params.id });
  if (!deleted) {
    return res.status(404).json({ error: 'Museo non trovato.' });
  }
  res.json({ ok: true });
}

module.exports = { listMuseums, createMuseum, deleteMuseum };
