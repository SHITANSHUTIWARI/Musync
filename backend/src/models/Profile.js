/**
 * MUSYNC - Profile Model
 */

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  bio: {
    type: String,
    maxlength: [300, 'Bio cannot exceed 300 characters'],
    trim: true
  },
  genres: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  socialLinks: {
    instagram: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    },
    spotify: {
      type: String,
      trim: true
    },
    soundcloud: {
      type: String,
      trim: true
    }
  },
  avatar: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Update updatedAt before saving
profileSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
