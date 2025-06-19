const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
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
const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  const folder = req.query.folder
    ? path.normalize(req.query.folder).replace(/^([.]{2}[\/])+/g, '')
    : '';
  const base = `${req.protocol}://${req.get('host')}`;
  const prefix = folder ? `${folder}/` : '';
  res.json({ url: `${base}/uploads/${prefix}${req.file.filename}` });
});

module.exports = {
  router,
  uploadDir,
};
