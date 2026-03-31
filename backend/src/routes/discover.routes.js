/**
 * MUSYNC - Discover Routes
 */

const express = require('express');
const router = express.Router();

const { getArtists } = require('../controllers/discover.controller');

// Public routes (No auth middleware)
// GET /api/discover/artists
router.get('/artists', getArtists);

module.exports = router;
