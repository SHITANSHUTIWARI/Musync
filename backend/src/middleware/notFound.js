/**
 * MUSYNC Backend - Not Found Middleware
 * Handles 404 errors for unmatched routes
 */

const createError = require('http-errors');

/**
 * 404 handler for unmatched routes
 */
const notFound = (req, res, next) => {
  next(createError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
