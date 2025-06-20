const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    appVersion: process.env.APP_VERSION || 'v0.1',
    dbVersion: process.env.DB_VERSION || 'v1',
  });
});

module.exports = router;
