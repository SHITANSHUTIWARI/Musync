/**
 * MUSYNC - Auth Routes
 */

const express = require('express');
const router = express.Router();

const { signup, login, getMe } = require('../controllers/auth.controller');
const { signupValidator, loginValidator } = require('../validators/auth.validator');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);

// Protected routes
router.get('/me', authMiddleware, getMe);

module.exports = router;
