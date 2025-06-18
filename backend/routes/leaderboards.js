const express = require('express');
const db = require('../utils/database');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { gameId, trackId, layoutId } = req.query;
  if (!gameId || !trackId || !layoutId) {
    return res.status(400).json({ message: 'gameId, trackId and layoutId are required' });
  }
  try {
    const result = await db.query(
      `SELECT lt.*, u.username
       FROM lap_times lt
       JOIN users u ON lt.user_id = u.id
       WHERE lt.game_id = $1 AND lt.track_id = $2 AND lt.layout_id = $3
       ORDER BY time_ms ASC
       LIMIT 10`,
      [gameId, trackId, layoutId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
