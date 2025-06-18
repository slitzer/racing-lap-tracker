const express = require('express');
const db = require('../utils/database');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { trackId } = req.query;
  try {
    let result;
    if (trackId) {
      result = await db.query('SELECT * FROM layouts WHERE track_id = $1 ORDER BY name', [trackId]);
    } else {
      result = await db.query('SELECT * FROM layouts ORDER BY name');
    }
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
