const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

const uploadDir =
  process.env.UPLOAD_DIR ||
  path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
function sanitizeFilename(name) {
  return name
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = req.query.folder
      ? path
          .normalize(req.query.folder)
          .replace(/^([.]{2}[\/])+/g, '')
      : '';
    const sub = path.join(uploadDir, folder);
    fs.mkdirSync(sub, { recursive: true });
    cb(null, sub);
  },
  filename(req, file, cb) {
    const custom = req.query.filename
      ? sanitizeFilename(req.query.filename)
      : null;
    const ext = path.extname(custom || file.originalname) || '.bin';
    const name =
      custom && path.extname(custom)
        ? custom
        : custom
        ? `${custom}${ext}`
        : `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/x-png',
  'image/gif',
  'image/webp',
];
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
      err.message = 'Invalid file type';
      cb(err);
    }
  },
});

const adminFolders = [
  'images/games',
  'images/tracks',
  'images/layouts',
  'images/cars',
];

router.post('/', auth, (req, res, next) => {
  const folder = req.query.folder
    ? path.normalize(req.query.folder).replace(/^([.]{2}[\/])+/g, '')
    : '';

  const proceed = () =>
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        }
        return next(err);
      }
      const prefix = folder ? `${folder}/` : '';
      res.json({ url: `/images/${prefix}${req.file.filename}` });
    });

  if (adminFolders.some((f) => folder.startsWith(f))) {
    return admin(req, res, (err) => {
      if (err) return next(err);
      proceed();
    });
  }
  proceed();
});

module.exports = {
  router,
  uploadDir,
};
