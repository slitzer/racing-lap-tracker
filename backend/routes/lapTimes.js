const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { userId } = req.query;
  const params = [];
  let where = '';
  if (userId) {
    params.push(userId);
    where = 'WHERE lt.user_id = $1';
  }
  try {
    const result = await db.query(
      `SELECT lt.id,
              lt.user_id AS "userId",
              lt.game_id AS "gameId",
              lt.track_layout_id AS "trackLayoutId",
              t.id AS "trackId",
              l.id AS "layoutId",
              lt.car_id AS "carId",
              lt.input_type AS "inputType",
              lt.time_ms AS "timeMs",
              lt.lap_date AS "lapDate",
              lt.screenshot_url AS "screenshotUrl",
              u.username,
              g.name AS "gameName", g.image_url AS "gameImageUrl",
              t.name AS "trackName", t.image_url AS "trackImageUrl",
              l.name AS "layoutName", l.image_url AS "layoutImageUrl",
              c.name AS "carName", c.image_url AS "carImageUrl",
              COALESCE(a.assists, '[]') AS assists
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
       ${where}
       ORDER BY lt.date_submitted DESC
       LIMIT 100`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/records', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT lt.id,
              lt.user_id AS "userId",
              lt.game_id AS "gameId",
              lt.track_layout_id AS "trackLayoutId",
              t.id AS "trackId",
              l.id AS "layoutId",
              lt.car_id AS "carId",
              lt.input_type AS "inputType",
              lt.time_ms AS "timeMs",
              lt.lap_date AS "lapDate",
              lt.screenshot_url AS "screenshotUrl",
              u.username,
              g.name AS "gameName", g.image_url AS "gameImageUrl",
              t.name AS "trackName", t.image_url AS "trackImageUrl",
              l.name AS "layoutName", l.image_url AS "layoutImageUrl",
              c.name AS "carName", c.image_url AS "carImageUrl",
              COALESCE(a.assists, '[]') AS assists
       FROM lap_times lt
       JOIN (
            SELECT game_id, track_layout_id, MIN(time_ms) AS min_time
            FROM lap_times
            GROUP BY game_id, track_layout_id
       ) r ON lt.game_id = r.game_id AND lt.track_layout_id = r.track_layout_id
            AND lt.time_ms = r.min_time
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
       ORDER BY lt.time_ms ASC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  [
    body('gameId').notEmpty(),
    body('trackLayoutId').notEmpty(),
    body('carId').notEmpty(),
    body('inputType').notEmpty(),
    body('timeMs').isInt({ min: 1 }),
    body('lapDate').notEmpty(),
    body('assists').optional().isArray(),
    body('assists.*').optional().isUUID(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { gameId, trackLayoutId, carId, inputType, timeMs, lapDate, screenshotUrl, assists } = req.body;
    try {
      const result = await db.query(
        `INSERT INTO lap_times (user_id, game_id, track_layout_id, car_id, input_type, time_ms, lap_date, screenshot_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [req.user.id, gameId, trackLayoutId, carId, inputType, timeMs, lapDate, screenshotUrl || null]
      );
      const inserted = result.rows[0];
      if (Array.isArray(assists) && assists.length > 0) {
        for (const aid of assists) {
          // eslint-disable-next-line no-await-in-loop
          await db.query(
            'INSERT INTO lap_time_assists (lap_time_id, assist_id) VALUES ($1,$2)',
            [inserted.id, aid]
          );
        }
      }
      res.status(201).json(inserted);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
