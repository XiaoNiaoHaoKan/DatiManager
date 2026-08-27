require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./Config/db');
const accountRoutes = require('./Routes/accountRoutes');
const museumRoutes = require('./Routes/museumRoutes');
const staffRoutes = require('./Routes/staffRoutes');

const PORT = process.env.PORT || 8003;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/accounts', accountRoutes);
app.use('/api/museums', museumRoutes);
app.use('/api/staff', staffRoutes);

app.use(express.static(path.join(__dirname, 'public')));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Errore interno del server.' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`CreazioneDatiPerIlMuseo server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Errore durante la connessione a MongoDB:', error);
    process.exit(1);
  });
