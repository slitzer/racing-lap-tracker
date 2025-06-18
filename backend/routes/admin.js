const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/lapTimes/unverified', auth, admin, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM lap_times WHERE verified = FALSE ORDER BY date_submitted DESC'
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
