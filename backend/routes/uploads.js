const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const sub = req.query.folder
      ? path.join(uploadDir, req.query.folder)
      : uploadDir;
    fs.mkdirSync(sub, { recursive: true });
    cb(null, sub);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  const folder = req.query.folder ? `${req.query.folder}/` : '';
  res.json({ url: `/uploads/${folder}${req.file.filename}` });
});

module.exports = {
  router,
  uploadDir,
};
