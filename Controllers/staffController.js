const StaffAccount = require('../Models/StaffAccount');
const Museum = require('../Models/Museum');
const { hashPassword } = require('../utils/passwordHash');

// GET /api/staff/accounts
async function listStaffAccounts(req, res) {
  const accounts = await StaffAccount.find().select('-passwordHash').populate('museumId', 'name city').sort({ email: 1 });
  res.json(accounts);
}

// POST /api/staff/accounts  { email, password, museumId }
async function createStaffAccount(req, res) {
  const { email, password, museumId } = req.body;
  if (!email || !password || !museumId) {
    return res.status(400).json({ error: 'email, password e museumId sono obbligatori.' });
  }

  const museum = await Museum.findById(museumId);
  if (!museum) {
    return res.status(404).json({ error: 'Museo non trovato.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await StaffAccount.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ error: 'Esiste già un account staff con questa email.' });
  }

  const account = await StaffAccount.create({
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    museumId
  });

  const { passwordHash, ...safe } = account.toObject();
  res.status(201).json(safe);
}

// DELETE /api/staff-accounts/:id
async function deleteStaffAccount(req, res) {
  const deleted = await StaffAccount.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Account staff non trovato.' });
  }
  res.json({ ok: true });
}

module.exports = {
  listStaffAccounts,
  createStaffAccount,
  deleteStaffAccount
};
