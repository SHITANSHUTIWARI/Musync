/**
 * MUSYNC Backend - Express Application
 * Main application setup with middleware
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import routes
const routes = require('./routes');

// Initialize Express app
const app = express();

// ===================
// Security Middleware
// ===================
app.use(helmet());
app.use(cors(config.cors));

// ===================
// Request Parsing
// ===================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===================
// Logging
// ===================
if (config.env !== 'test') {
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
}

// ===================
// API Routes
// ===================
app.use('/api', routes);

// ===================
// Error Handling
// ===================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
