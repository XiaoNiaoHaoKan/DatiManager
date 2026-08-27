const express = require('express');
const { listMuseums, createMuseum, deleteMuseum } = require('../Controllers/museumController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(listMuseums));
router.post('/', asyncHandler(createMuseum));
router.delete('/:id', asyncHandler(deleteMuseum));

module.exports = router;
