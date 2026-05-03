/**
 * MUSYNC Backend - Configuration Index
 * Centralized configuration management
 */

require('dotenv').config();

const config = {
  // Server Configuration
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: false,
    }
  },
  
  // JWT Configuration (for future auth)
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://musync-omega.vercel.app"] 
      : ["http://localhost:3000", "https://musync-omega.vercel.app"],
    credentials: true,
  },
  
  // Rate Limiting (for future implementation)
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
};

// Validate required configuration in production
if (config.env === 'production') {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = config;
