const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure destination directories exist
const uploadDirs = ['uploads/thumbnails', 'uploads/videos', 'uploads/docs', 'uploads/submissions'];
uploadDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/docs';
    if (file.fieldname === 'thumbnail') {
      folder = 'uploads/thumbnails';
    } else if (file.fieldname === 'video') {
      folder = 'uploads/videos';
    } else if (file.fieldname === 'submission') {
      folder = 'uploads/submissions';
    }
    cb(null, path.join(__dirname, '..', folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images, mp4/webm videos, pdfs, zip
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/zip',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Allowed: JPG, PNG, WEBP, MP4, WEBM, PDF, ZIP'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max limit
});

module.exports = upload;
