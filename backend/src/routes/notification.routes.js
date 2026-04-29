/**
 * MUSYNC - Notification Routes
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead 
} = require('../controllers/notification.controller');

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
