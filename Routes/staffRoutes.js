const express = require('express');
const {
  listStaffAccounts,
  createStaffAccount,
  deleteStaffAccount
} = require('../Controllers/staffController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/accounts', asyncHandler(listStaffAccounts));
router.post('/accounts', asyncHandler(createStaffAccount));
router.delete('/accounts/:id', asyncHandler(deleteStaffAccount));

module.exports = router;
