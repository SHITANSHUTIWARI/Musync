/**
 * MUSYNC - Chat Routes
 */

const express = require('express');
const router = express.Router();

const { sendMessage, getMessages } = require('../controllers/chat.controller');
const { sendMessageValidator, getMessagesValidator } = require('../validators/chat.validator');
const authMiddleware = require('../middleware/auth.middleware');

// All routes are protected
router.use(authMiddleware);

// POST /api/chat/send - Send message
router.post('/send', sendMessageValidator, sendMessage);

// GET /api/chat/:userId - Get chat history
router.get('/:userId', getMessagesValidator, getMessages);

module.exports = router;
