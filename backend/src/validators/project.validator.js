/**
 * MUSYNC - Project Validators
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

// URL validation helper
const isValidUrl = (value) => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Valid project types
const validTypes = ['song', 'beat', 'album', 'collab'];

// Create project validation rules
const createProjectValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  
  body('type')
    .trim()
    .notEmpty().withMessage('Project type is required')
    .isIn(validTypes).withMessage('Type must be song, beat, album, or collab'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('genres')
    .optional()
    .isArray().withMessage('Genres must be an array'),
  
  body('genres.*')
    .optional()
    .isString().withMessage('Each genre must be a string'),
  
  body('collaborators')
    .optional()
    .isArray().withMessage('Collaborators must be an array'),
  
  body('collaborators.*')
    .optional()
    .isMongoId().withMessage('Each collaborator must be a valid user ID'),
  
  body('coverImage')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Cover image must be a valid URL'),
  
  body('audioLink')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Audio link must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  
  validate
];

// Update project validation rules
const updateProjectValidator = [
  param('id')
    .isMongoId().withMessage('Invalid project ID'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty'),
  
  body('type')
    .optional()
    .trim()
    .isIn(validTypes).withMessage('Type must be song, beat, album, or collab'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('genres')
    .optional()
    .isArray().withMessage('Genres must be an array'),
  
  body('genres.*')
    .optional()
    .isString().withMessage('Each genre must be a string'),
  
  body('collaborators')
    .optional()
    .isArray().withMessage('Collaborators must be an array'),
  
  body('collaborators.*')
    .optional()
    .isMongoId().withMessage('Each collaborator must be a valid user ID'),
  
  body('coverImage')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Cover image must be a valid URL'),
  
  body('audioLink')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Audio link must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  
  body('owner')
    .not().exists().withMessage('Owner cannot be modified'),
  
  validate
];

// Delete project validation
const deleteProjectValidator = [
  param('id')
    .isMongoId().withMessage('Invalid project ID'),
  
  validate
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  deleteProjectValidator
};
