/**
 * MUSYNC - Socket.IO Service
 */

const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config');

let io;
const onlineUsers = new Map(); // userId -> socketId

// Initialize Socket.IO
const init = (server) => {
  io = socketIO(server, {
    cors: {
      origin: config.cors.origin || '*',
      methods: ['GET', 'POST']
    }
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify token
      // Remove 'Bearer ' if present
      const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      const decoded = jwt.verify(tokenString, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    
    // Add to online users
    onlineUsers.set(socket.user.id, socket.id);
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
      onlineUsers.delete(socket.user.id);
    });
  });

  return io;
};

// Get IO instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

// Emit event to specific user
const emitToUser = (userId, event, data) => {
  const socketId = onlineUsers.get(userId.toString());
  if (socketId && io) {
    io.to(socketId).emit(event, data);
    return true;
  }
  return false;
};

module.exports = {
  init,
  getIO,
  emitToUser
};
