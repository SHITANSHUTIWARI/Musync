/**
 * MUSYNC - Profile Controller
 */

const Profile = require('../models/Profile');

/**
 * @desc    Create user profile
 * @route   POST /api/profile
 * @access  Private
 */
const createProfile = async (req, res, next) => {
  try {
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: req.user.id });
    
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Profile already exists'
        }
      });
    }
    
    // Create profile
    const profileData = {
      user: req.user.id,
      displayName: req.body.displayName,
      bio: req.body.bio,
      genres: req.body.genres,
      location: req.body.location,
      socialLinks: req.body.socialLinks,
      avatar: req.body.avatar
    };
    
    const profile = await Profile.create(profileData);
    
    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's profile
 * @route   GET /api/profile/me
 * @access  Private
 */
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Profile not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Profile not found'
        }
      });
    }
    
    // Fields that can be updated
    const allowedUpdates = [
      'displayName',
      'bio',
      'genres',
      'location',
      'socialLinks',
      'avatar'
    ];
    
    // Update only provided fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });
    
    // Set updatedAt
    profile.updatedAt = new Date();
    
    await profile.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile
};
