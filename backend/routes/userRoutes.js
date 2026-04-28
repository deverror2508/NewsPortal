const express = require('express');
const router = express.Router();
const {
  getMe,
  updateMe,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');

// Current user routes
router.get('/me', protect, getMe);
router.patch('/me', protect, upload.single('avatar'), updateMe);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
