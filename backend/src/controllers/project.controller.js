/**
 * MUSYNC - Project Controller
 */

const Project = require('../models/Project');

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const projectData = {
      owner: req.user.id,
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      genres: req.body.genres,
      collaborators: req.body.collaborators,
      coverImage: req.body.coverImage,
      audioLink: req.body.audioLink,
      status: req.body.status
    };
    
    // Handle file uploads if present
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    if (req.files) {
      if (req.files.coverImageFile && req.files.coverImageFile.length > 0) {
        projectData.coverImage = `${baseUrl}/uploads/images/${req.files.coverImageFile[0].filename}`;
      }
      if (req.files.audioFile && req.files.audioFile.length > 0) {
        projectData.audioLink = `${baseUrl}/uploads/audio/${req.files.audioFile[0].filename}`;
      }
    }
    
    const project = await Project.create(projectData);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects for authenticated user
 * @route   GET /api/projects
 * @access  Private
 */
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Owner only)
 */
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Project not found'
        }
      });
    }
    
    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Forbidden: You do not own this project'
        }
      });
    }
    
    // Fields that can be updated
    const allowedUpdates = [
      'title',
      'description',
      'type',
      'genres',
      'collaborators',
      'coverImage',
      'audioLink',
      'status'
    ];
    
    // Update only provided fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });
    
    // Set updatedAt
    project.updatedAt = new Date();
    
    // Handle file uploads if present
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    if (req.files) {
      if (req.files.coverImageFile && req.files.coverImageFile.length > 0) {
        project.coverImage = `${baseUrl}/uploads/images/${req.files.coverImageFile[0].filename}`;
      }
      if (req.files.audioFile && req.files.audioFile.length > 0) {
        project.audioLink = `${baseUrl}/uploads/audio/${req.files.audioFile[0].filename}`;
      }
    }
    
    await project.save();
    
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Owner only)
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Project not found'
        }
      });
    }
    
    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Forbidden: You do not own this project'
        }
      });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getProjectsByUser = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'displayName username avatar');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      });
    }
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByUser
};
