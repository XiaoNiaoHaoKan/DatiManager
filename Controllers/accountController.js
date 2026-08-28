const MarketplaceUser = require('../Models/MarketplaceUser');

const marketplaceAccountFilter = {
  username: { $exists: true },
  password: { $exists: true },
  passwordHash: { $exists: false }
};

// GET /api/accounts
async function listAccounts(req, res) {
  const accounts = await MarketplaceUser.find(marketplaceAccountFilter).select('-password').sort({ username: 1 });
  res.json(accounts);
}

// POST /api/accounts
async function createAccount(req, res) {
  const { username, password, role, credit, museumId } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username e password sono obbligatori.' });
  }

  const existing = await MarketplaceUser.findOne({ ...marketplaceAccountFilter, username });
  if (existing) {
    return res.status(409).json({ error: 'Esiste già un account con questo username.' });
  }

  const account = await MarketplaceUser.create({
    username,
    password,
    role: role || 'other',
    credit: Number(credit) || 0,
    museumId: museumId || null
  });

  const { password: _omit, ...safe } = account.toObject();
  res.status(201).json(safe);
}

// DELETE /api/accounts/:username
async function deleteAccount(req, res) {
  const deleted = await MarketplaceUser.findOneAndDelete({ ...marketplaceAccountFilter, username: req.params.username });
  if (!deleted) {
    return res.status(404).json({ error: 'Account non trovato.' });
  }
  res.json({ ok: true });
}

// PATCH /api/accounts/:username/credit  { delta: number }
async function adjustCredit(req, res) {
  const delta = Number(req.body.delta);
  if (!Number.isFinite(delta)) {
    return res.status(400).json({ error: 'delta deve essere un numero.' });
  }

  const account = await MarketplaceUser.findOne({ ...marketplaceAccountFilter, username: req.params.username });
  if (!account) {
    return res.status(404).json({ error: 'Account non trovato.' });
  }

  account.credit = Number((account.credit + delta).toFixed(2));
  await account.save();

  const { password, ...safe } = account.toObject();
  res.json(safe);
}

// PATCH /api/accounts/:username/museum  { museumId: string|null }
async function associateMuseum(req, res) {
  const account = await MarketplaceUser.findOneAndUpdate(
    { ...marketplaceAccountFilter, username: req.params.username },
    { $set: { museumId: req.body.museumId || null } },
    { new: true }
  ).select('-password');

  if (!account) {
    return res.status(404).json({ error: 'Account non trovato.' });
  }
  res.json(account);
}

module.exports = { listAccounts, createAccount, deleteAccount, adjustCredit, associateMuseum };
