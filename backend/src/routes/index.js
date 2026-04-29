/**
 * MUSYNC Backend - Main Router
 * Central route aggregator
 */

const express = require('express');
const router = express.Router();

// ===================
// Health Check
// ===================
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===================
// API Info
// ===================
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to MUSYNC API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      profile: '/api/profile',
      projects: '/api/projects',
      discover: '/api/discover',
      connections: '/api/connections',
      chat: '/api/chat',
      // users: '/api/users',
      // music: '/api/music',
      // playlists: '/api/playlists',
    },
  });
});

// ===================
// Route Imports
// ===================
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const projectRoutes = require('./project.routes');
const discoverRoutes = require('./discover.routes');
const connectionRoutes = require('./connection.routes');
const chatRoutes = require('./chat.routes');
const notificationRoutes = require('./notification.routes');
// const userRoutes = require('./user.routes');
// const musicRoutes = require('./music.routes');
// const playlistRoutes = require('./playlist.routes');

// ===================
// Mount Routes
// ===================
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/discover', discoverRoutes);
router.use('/connections', connectionRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);
// router.use('/users', userRoutes);
// router.use('/music', musicRoutes);
// router.use('/playlists', playlistRoutes);

module.exports = router;
