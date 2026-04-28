const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  submitArticle,
  approveArticle,
  rejectArticle,
  getPendingArticles,
  getMyArticles,
  getAllArticlesAdmin,
} = require('../controllers/articleController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getArticles);
router.get('/slug/:slug', getArticleBySlug);

// Protected routes (must come before /:id to avoid conflicts)
router.get('/pending', protect, authorize('admin'), getPendingArticles);
router.get('/my-articles', protect, authorize('author', 'admin'), getMyArticles);
router.get('/admin/all', protect, authorize('admin'), getAllArticlesAdmin);

const uploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'videoFile', maxCount: 1 },
]);

router.post(
  '/',
  protect,
  authorize('author', 'admin'),
  uploadFields,
  createArticle
);

router.get('/:id', protect, getArticleById);

router.patch(
  '/:id',
  protect,
  authorize('author', 'admin'),
  uploadFields,
  updateArticle
);

router.delete(
  '/:id',
  protect,
  authorize('author', 'admin'),
  deleteArticle
);

router.patch(
  '/:id/submit',
  protect,
  authorize('author', 'admin'),
  submitArticle
);

router.patch(
  '/:id/approve',
  protect,
  authorize('admin'),
  approveArticle
);

router.patch(
  '/:id/reject',
  protect,
  authorize('admin'),
  rejectArticle
);

module.exports = router;
