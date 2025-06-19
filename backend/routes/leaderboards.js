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
      `SELECT lt.id,
              lt.user_id AS "userId",
              lt.game_id AS "gameId",
              lt.track_id AS "trackId",
              lt.layout_id AS "layoutId",
              lt.car_id AS "carId",
              lt.input_type AS "inputType",
              COALESCE(a.assists, '[]') AS assists,
              lt.time_ms AS "timeMs",
              lt.screenshot_url AS "screenshotUrl",
              lt.verified AS "verified",
              lt.date_submitted AS "dateSubmitted",
              lt.lap_date AS "lapDate",
              lt.created_at AS "createdAt",
              lt.updated_at AS "updatedAt",
              u.username,
              g.name AS "gameName", g.image_url AS "gameImageUrl",
              t.name AS "trackName", t.image_url AS "trackImageUrl",
              l.name AS "layoutName", l.image_url AS "layoutImageUrl",
              c.name AS "carName", c.image_url AS "carImageUrl"
       FROM lap_times lt
       JOIN users u ON lt.user_id = u.id
       JOIN games g ON lt.game_id = g.id
       JOIN tracks t ON lt.track_id = t.id
       JOIN layouts l ON lt.layout_id = l.id
       JOIN cars c ON lt.car_id = c.id
       LEFT JOIN LATERAL (
            SELECT json_agg(asst.name ORDER BY asst.name) AS assists
            FROM lap_time_assists lta
            JOIN assists asst ON lta.assist_id = asst.id
            WHERE lta.lap_time_id = lt.id
       ) a ON TRUE
       WHERE lt.game_id = $1 AND lt.track_id = $2 AND lt.layout_id = $3
       ORDER BY lt.time_ms ASC
       LIMIT 10`,
      [gameId, trackId, layoutId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
