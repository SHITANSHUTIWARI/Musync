/**
 * MUSYNC Backend - Database Configuration
 * MongoDB connection with Mongoose
 */

const mongoose = require('mongoose');
const config = require('./index');

/**
 * Connect to MongoDB with retry logic
 * @param {number} retries - Number of connection retries
 */
const connectDB = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(config.mongodb.uri, config.mongodb.options);
      
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      
      // Connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
      
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed:`, error.message);
      
      if (attempt === retries) {
        console.error('💀 Max retries reached. Exiting...');
        process.exit(1);
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Gracefully close MongoDB connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, closeDB };
