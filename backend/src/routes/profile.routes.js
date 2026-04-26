/**
 * MUSYNC - Profile Routes
 */

const express = require('express');
const router = express.Router();

const { createProfile, getMyProfile, updateProfile } = require('../controllers/profile.controller');
const { createProfileValidator, updateProfileValidator } = require('../validators/profile.validator');
const authMiddleware = require('../middleware/auth.middleware');

const { uploadImage } = require('../middleware/upload.middleware');

// Middleware to parse JSON fields from form-data
const parseJsonFields = (req, res, next) => {
  if (req.body.genres && typeof req.body.genres === 'string') {
    try { req.body.genres = JSON.parse(req.body.genres); } catch (e) {}
  }
  if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
    try { req.body.socialLinks = JSON.parse(req.body.socialLinks); } catch (e) {}
  }
  next();
};

// All routes are protected
router.use(authMiddleware);

// POST /api/profile - Create profile
router.post('/', uploadImage.single('avatarFile'), parseJsonFields, createProfileValidator, createProfile);

// GET /api/profile/me - Get my profile
router.get('/me', getMyProfile);

// PUT /api/profile - Update profile
router.put('/', uploadImage.single('avatarFile'), parseJsonFields, updateProfileValidator, updateProfile);

module.exports = router;
