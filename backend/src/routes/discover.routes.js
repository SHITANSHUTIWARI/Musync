const express = require('express');
const router = express.Router();

const { getArtists } = require('../controllers/discover.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected route to support connection status for logged in users
router.get('/artists', authMiddleware, getArtists);

module.exports = router;
