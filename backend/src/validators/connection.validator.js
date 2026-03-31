/**
 * MUSYNC - Connection Validators
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

// Send request validation
const sendRequestValidator = [
  body('recipient')
    .notEmpty().withMessage('Recipient ID is required')
    .isMongoId().withMessage('Recipient must be a valid user ID'),
  
  validate
];

// Respond request validation
const respondRequestValidator = [
  param('id')
    .isMongoId().withMessage('Invalid connection ID'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected'),
  
  validate
];

module.exports = {
  sendRequestValidator,
  respondRequestValidator
};
