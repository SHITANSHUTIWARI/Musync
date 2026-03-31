/**
 * MUSYNC - Connection Routes
 */

const express = require('express');
const router = express.Router();

const {
  sendRequest,
  respondRequest,
  getMyConnections,
  getPendingConnections
} = require('../controllers/connection.controller');

const {
  sendRequestValidator,
  respondRequestValidator
} = require('../validators/connection.validator');

const authMiddleware = require('../middleware/auth.middleware');

// All routes are protected
router.use(authMiddleware);

// POST /api/connections/request - Send connection request
router.post('/request', sendRequestValidator, sendRequest);

// PUT /api/connections/respond/:id - Accept/Reject request
router.put('/respond/:id', respondRequestValidator, respondRequest);

// GET /api/connections - List accepted connections
router.get('/', getMyConnections);

// GET /api/connections/pending - List pending requests (received + sent)
router.get('/pending', getPendingConnections);

module.exports = router;
