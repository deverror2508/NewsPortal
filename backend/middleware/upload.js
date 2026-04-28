const multer = require('multer');
const path = require('path');

// Shared disk storage — files are saved to backend/uploads/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Allowed MIME types per field
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime', // .mov
];

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverImage') {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Cover image must be JPEG, PNG, or WebP'), false);
    }
  } else if (file.fieldname === 'videoFile') {
    if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Video must be MP4, WebM, OGG, or MOV'), false);
    }
  } else {
    cb(new Error('Unexpected file field'), false);
  }
};

// Single multer instance — routes use .fields() to accept both files
const upload = multer({
  storage,
  fileFilter,
  limits: {
    // Per-file limit: 100 MB covers both images and videos.
    // (Images are small enough that this is not a concern.)
    fileSize: 100 * 1024 * 1024,
  },
});

module.exports = upload;
