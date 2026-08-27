const crypto = require('crypto');

// Stesso schema di hashing usato in JackTecnoWebRefactory/Server/auth.js: "salt:scryptHash".
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

module.exports = { hashPassword };
