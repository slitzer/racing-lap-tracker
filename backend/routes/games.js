const express = require('express');
const db = require('../utils/database');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM games ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
