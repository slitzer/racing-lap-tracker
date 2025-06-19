const express = require('express');
const db = require('../utils/database');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { gameId, trackLayoutId } = req.query;
  if (!gameId || !trackLayoutId) {
    return res.status(400).json({ message: 'gameId and trackLayoutId are required' });
  }
  try {
    const result = await db.query(
      `SELECT lt.id,
              lt.user_id AS "userId",
              lt.game_id AS "gameId",
              lt.track_layout_id AS "trackLayoutId",
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
       JOIN track_layouts tl ON lt.track_layout_id = tl.id
       JOIN tracks t ON tl.track_id = t.id
       JOIN layouts l ON tl.layout_id = l.id
       JOIN cars c ON lt.car_id = c.id
       LEFT JOIN LATERAL (
            SELECT json_agg(asst.name ORDER BY asst.name) AS assists
            FROM lap_time_assists lta
            JOIN assists asst ON lta.assist_id = asst.id
            WHERE lta.lap_time_id = lt.id
       ) a ON TRUE
       WHERE lt.game_id = $1 AND lt.track_layout_id = $2
       ORDER BY lt.time_ms ASC
       LIMIT 10`,
      [gameId, trackLayoutId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
