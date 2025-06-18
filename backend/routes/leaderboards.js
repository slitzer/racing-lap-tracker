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
      `SELECT lt.*, u.username,
              g.name AS game_name, g.image_url AS game_image_url,
              t.name AS track_name, t.image_url AS track_image_url,
              l.name AS layout_name, l.image_url AS layout_image_url,
              c.name AS car_name, c.image_url AS car_image_url
       FROM lap_times lt
       JOIN users u ON lt.user_id = u.id
       JOIN games g ON lt.game_id = g.id
       JOIN tracks t ON lt.track_id = t.id
       JOIN layouts l ON lt.layout_id = l.id
       JOIN cars c ON lt.car_id = c.id
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
