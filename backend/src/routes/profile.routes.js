/**
 * MUSYNC - Profile Routes
 */

const express = require('express');
const router = express.Router();

const { createProfile, getMyProfile, updateProfile } = require('../controllers/profile.controller');
const { createProfileValidator, updateProfileValidator } = require('../validators/profile.validator');
const authMiddleware = require('../middleware/auth.middleware');

// All routes are protected
router.use(authMiddleware);

// POST /api/profile - Create profile
router.post('/', createProfileValidator, createProfile);

// GET /api/profile/me - Get my profile
router.get('/me', getMyProfile);

// PUT /api/profile - Update profile
router.put('/', updateProfileValidator, updateProfile);

module.exports = router;
