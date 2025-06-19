const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, username, email, is_admin, avatar_url FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put(
  '/me',
  auth,
  [body('username').optional().notEmpty(), body('avatarUrl').optional().isString()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, avatarUrl } = req.body;
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
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided' });
    }
    params.push(req.user.id);
    try {
      const result = await db.query(
        `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${
          params.length
        } RETURNING id, username, email, is_admin, avatar_url`,
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
    const row = result.rows[0];
    res.json({
      lapCount: parseInt(row.lap_count, 10),
      bestLapMs: row.best_lap_ms ? parseInt(row.best_lap_ms, 10) : null,
      avgLapMs: row.avg_lap_ms ? parseInt(row.avg_lap_ms, 10) : null,
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
