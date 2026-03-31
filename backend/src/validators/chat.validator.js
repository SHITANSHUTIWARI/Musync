/**
 * MUSYNC - Chat Validators
 */

const { body, param, validationResult } = require('express-validator');

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Send message validation
const sendMessageValidator = [
  body('receiver')
    .notEmpty().withMessage('Receiver ID is required')
    .isMongoId().withMessage('Receiver must be a valid user ID'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required'),
  
  validate
];

// Get messages validation
const getMessagesValidator = [
  param('userId')
    .isMongoId().withMessage('Invalid user ID'),
  
  validate
];

module.exports = {
  sendMessageValidator,
  getMessagesValidator
};
