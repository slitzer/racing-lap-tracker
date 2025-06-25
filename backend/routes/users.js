const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, username, email, is_admin, avatar_url,
              wheel, frame, brakes, equipment,
              favorite_sim, favorite_track, favorite_car,
              default_assists, league
         FROM users WHERE id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put(
  '/me',
  auth,
  [
    body('username').optional().notEmpty(),
    body('avatarUrl').optional().isString(),
    body('wheel').optional().isString(),
    body('frame').optional().isString(),
    body('brakes').optional().isString(),
    body('equipment').optional().isString(),
    body('favoriteSim').optional().isString(),
    body('favoriteTrack').optional().isString(),
    body('favoriteCar').optional().isString(),
    body('defaultAssists').optional().isArray(),
    body('league').optional().isString(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      username,
      avatarUrl,
      wheel,
      frame,
      brakes,
      equipment,
      favoriteSim,
      favoriteTrack,
      favoriteCar,
      defaultAssists,
      league,
    } = req.body;
    const fields = [];
    const params = [];
    if (username) {
      params.push(username);
      fields.push(`username = $${params.length}`);
    }
    if (avatarUrl !== undefined) {
      params.push(avatarUrl);
      fields.push(`avatar_url = $${params.length}`);
    }
    if (wheel !== undefined) {
      params.push(wheel);
      fields.push(`wheel = $${params.length}`);
    }
    if (frame !== undefined) {
      params.push(frame);
      fields.push(`frame = $${params.length}`);
    }
    if (brakes !== undefined) {
      params.push(brakes);
      fields.push(`brakes = $${params.length}`);
    }
    if (equipment !== undefined) {
      params.push(equipment);
      fields.push(`equipment = $${params.length}`);
    }
    if (favoriteSim !== undefined) {
      params.push(favoriteSim);
      fields.push(`favorite_sim = $${params.length}`);
    }
    if (favoriteTrack !== undefined) {
      params.push(favoriteTrack);
      fields.push(`favorite_track = $${params.length}`);
    }
    if (favoriteCar !== undefined) {
      params.push(favoriteCar);
      fields.push(`favorite_car = $${params.length}`);
    }
    if (defaultAssists !== undefined) {
      params.push(JSON.stringify(defaultAssists));
      fields.push(`default_assists = $${params.length}::jsonb`);
    }
    if (league !== undefined) {
      params.push(league);
      fields.push(`league = $${params.length}`);
    }
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided' });
    }
    params.push(req.user.id);
    try {
      const result = await db.query(
        `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${
          params.length
        } RETURNING id, username, email, is_admin, avatar_url,
          wheel, frame, brakes, equipment,
          favorite_sim, favorite_track, favorite_car,
          default_assists, league`,
        params
      );
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/me/stats', auth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT COUNT(*) AS lap_count, MIN(time_ms) AS best_lap_ms, AVG(time_ms)::INT AS avg_lap_ms FROM lap_times WHERE user_id = $1`,
      [req.user.id]
    );
    const carRes = await db.query(
      `SELECT car_id, c.name, COUNT(*) AS cnt
       FROM lap_times lt
       JOIN cars c ON lt.car_id = c.id
       WHERE lt.user_id = $1
       GROUP BY car_id, c.name
       ORDER BY cnt DESC
       LIMIT 1`,
      [req.user.id]
    );
    const row = result.rows[0];
    const fav = carRes.rows[0];
    res.json({
      lapCount: parseInt(row.lap_count, 10),
      bestLapMs: row.best_lap_ms ? parseInt(row.best_lap_ms, 10) : null,
      avgLapMs: row.avg_lap_ms ? parseInt(row.avg_lap_ms, 10) : null,
      favoriteCarId: fav ? fav.car_id : null,
      favoriteCarName: fav ? fav.name : null,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, username FROM users');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
