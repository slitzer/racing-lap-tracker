const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    appVersion: process.env.APP_VERSION || 'v1.1',
    dbVersion: process.env.DB_VERSION || 'v1',
    sampleDataEnabled: process.env.ENABLE_SAMPLE_DATA === 'true',
  });
});

module.exports = router;
