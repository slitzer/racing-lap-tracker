const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM lap_times ORDER BY date_submitted DESC LIMIT 100'
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
    body('trackId').notEmpty(),
    body('layoutId').notEmpty(),
    body('carId').notEmpty(),
    body('inputType').notEmpty(),
    body('timeMs').isInt({ min: 1 }),
    body('lapDate').notEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { gameId, trackId, layoutId, carId, inputType, timeMs, lapDate, screenshotUrl } = req.body;
    try {
      const result = await db.query(
        `INSERT INTO lap_times (user_id, game_id, track_id, layout_id, car_id, input_type, time_ms, lap_date, screenshot_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING *`,
        [req.user.id, gameId, trackId, layoutId, carId, inputType, timeMs, lapDate, screenshotUrl || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
