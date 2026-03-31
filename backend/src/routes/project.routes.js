/**
 * MUSYNC - Project Routes
 */

const express = require('express');
const router = express.Router();

const {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject
} = require('../controllers/project.controller');

const {
  createProjectValidator,
  updateProjectValidator,
  deleteProjectValidator
} = require('../validators/project.validator');

const authMiddleware = require('../middleware/auth.middleware');

// All routes are protected
router.use(authMiddleware);

// POST /api/projects - Create project
router.post('/', createProjectValidator, createProject);

// GET /api/projects - Get my projects
router.get('/', getMyProjects);

// PUT /api/projects/:id - Update project
router.put('/:id', updateProjectValidator, updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', deleteProjectValidator, deleteProject);

module.exports = router;
