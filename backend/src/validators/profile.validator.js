/**
 * MUSYNC - Profile Validators
 */

const { body, validationResult } = require('express-validator');

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

// Create profile validation rules
const createProfileValidator = [
  body('displayName')
    .trim()
    .notEmpty().withMessage('Display name is required'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
  
  body('genres')
    .optional()
    .isArray().withMessage('Genres must be an array'),
  
  body('genres.*')
    .optional()
    .isString().withMessage('Each genre must be a string'),
  
  body('location')
    .optional()
    .trim(),
  
  body('socialLinks.instagram')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Instagram must be a valid URL'),
  
  body('socialLinks.youtube')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('YouTube must be a valid URL'),
  
  body('socialLinks.spotify')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Spotify must be a valid URL'),
  
  body('socialLinks.soundcloud')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('SoundCloud must be a valid URL'),
  
  body('avatar')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Avatar must be a valid URL'),
  
  validate
];

// Update profile validation rules
const updateProfileValidator = [
  body('displayName')
    .optional()
    .trim()
    .notEmpty().withMessage('Display name cannot be empty'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
  
  body('genres')
    .optional()
    .isArray().withMessage('Genres must be an array'),
  
  body('genres.*')
    .optional()
    .isString().withMessage('Each genre must be a string'),
  
  body('location')
    .optional()
    .trim(),
  
  body('socialLinks.instagram')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Instagram must be a valid URL'),
  
  body('socialLinks.youtube')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('YouTube must be a valid URL'),
  
  body('socialLinks.spotify')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Spotify must be a valid URL'),
  
  body('socialLinks.soundcloud')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('SoundCloud must be a valid URL'),
  
  body('avatar')
    .optional()
    .trim()
    .custom(isValidUrl).withMessage('Avatar must be a valid URL'),
  
  body('user')
    .not().exists().withMessage('User field cannot be modified'),
  
  validate
];

module.exports = {
  createProfileValidator,
  updateProfileValidator
};
