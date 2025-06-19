const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/lapTimes/unverified', auth, admin, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT lt.id,
              lt.user_id AS "userId",
              lt.game_id AS "gameId",
              lt.track_id AS "trackId",
              lt.layout_id AS "layoutId",
              lt.car_id AS "carId",
              lt.time_ms AS "timeMs",
              lt.screenshot_url AS "screenshotUrl",
              u.username,
              g.name AS "gameName",
              t.name AS "trackName",
              l.name AS "layoutName",
              c.name AS "carName"
       FROM lap_times lt
       JOIN users u ON lt.user_id = u.id
       JOIN games g ON lt.game_id = g.id
       JOIN tracks t ON lt.track_id = t.id
       JOIN layouts l ON lt.layout_id = l.id
       JOIN cars c ON lt.car_id = c.id
       WHERE lt.verified = FALSE
       ORDER BY lt.date_submitted DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.put('/lapTimes/:id/verify', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE lap_times SET verified = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lap time not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/lapTimes/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM lap_times WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lap time not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
