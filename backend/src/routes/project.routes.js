/**
 * MUSYNC - Project Routes
 */

const express = require('express');
const router = express.Router();

const {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByUser
} = require('../controllers/project.controller');

const {
  createProjectValidator,
  updateProjectValidator,
  deleteProjectValidator
} = require('../validators/project.validator');

const authMiddleware = require('../middleware/auth.middleware');
const { uploadAudio, uploadImage } = require('../middleware/upload.middleware');
const multer = require('multer');

// All routes are protected
router.use(authMiddleware);

// Define field upload for project
// We use a custom multer to handle multiple fields of different storage if needed,
// but since we split storage, we can use a basic memoryStorage or just use uploadAudio and handle images separately.
// Alternatively, let's just use the `uploadAudio` config and accept both, or use a combined diskStorage.
// For simplicity, we can create a combined upload middleware in `upload.middleware.js` or just use `uploadAudio` and accept any files.
// Let's create a combined one here or in middleware.
const combinedUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'audioFile') {
      cb(null, require('path').join(__dirname, '../../public/uploads/audio'));
    } else {
      cb(null, require('path').join(__dirname, '../../public/uploads/images'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + require('path').extname(file.originalname));
  }
});
const projectUpload = multer({ storage: combinedUpload }).fields([
  { name: 'coverImageFile', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 }
]);

// POST /api/projects - Create project
router.post('/', projectUpload, createProjectValidator, createProject);

// GET /api/projects - Get my projects
router.get('/', getMyProjects);

// GET /api/projects/user/:userId - Get projects by user ID
router.get('/user/:userId', getProjectsByUser);

// GET /api/projects/:id - Get project by ID
router.get('/:id', getProjectById);

// PUT /api/projects/:id - Update project
router.put('/:id', projectUpload, updateProjectValidator, updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', deleteProjectValidator, deleteProject);

module.exports = router;
