const express = require('express');
const {
  listAccounts,
  createAccount,
  deleteAccount,
  adjustCredit,
  associateMuseum
} = require('../Controllers/accountController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(listAccounts));
router.post('/', asyncHandler(createAccount));
router.delete('/:username', asyncHandler(deleteAccount));
router.patch('/:username/credit', asyncHandler(adjustCredit));
router.patch('/:username/museum', asyncHandler(associateMuseum));

module.exports = router;
