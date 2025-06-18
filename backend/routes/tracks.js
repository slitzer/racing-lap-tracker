const express = require('express');
const db = require('../utils/database');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { gameId } = req.query;
  try {
    let result;
    if (gameId) {
      result = await db.query('SELECT * FROM tracks WHERE game_id = $1 ORDER BY name', [gameId]);
    } else {
      result = await db.query('SELECT * FROM tracks ORDER BY name');
    }
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
