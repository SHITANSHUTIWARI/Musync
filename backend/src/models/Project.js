/**
 * MUSYNC - Project Model
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['song', 'beat', 'album', 'collab'],
      message: 'Type must be song, beat, album, or collab'
    },
    required: [true, 'Project type is required']
  },
  genres: [{
    type: String,
    trim: true
  }],
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  coverImage: {
    type: String,
    trim: true
  },
  audioLink: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
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
projectSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Index for faster queries by owner
projectSchema.index({ owner: 1 });

module.exports = mongoose.model('Project', projectSchema);
