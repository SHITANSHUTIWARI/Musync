/**
 * MUSYNC Backend - Server Entry Point
 * Starts the HTTP server with database connection
 */

require('dotenv').config();

const app = require('./src/app');
const config = require('./src/config');
const { connectDB, closeDB } = require('./src/config/db');

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    const server = app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎵  MUSYNC Backend Server                                ║
║                                                            ║
║   Environment: ${config.env.padEnd(40)}║
║   Port: ${String(config.port).padEnd(47)}║
║   API Base: /api (Port: ${config.port})${' '.repeat(26)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Initialize Socket.IO
    const socketService = require('./src/socket');
    socketService.init(server);
    console.log('🔌 Socket.IO Initialized');
    
    // ===================
    // Graceful Shutdown
    // ===================
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('🔒 HTTP server closed');
        await closeDB();
        console.log('👋 Process terminated gracefully');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
