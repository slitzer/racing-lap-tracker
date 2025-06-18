const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { trackId } = req.query;
  try {
    let result;
    if (trackId) {
      result = await db.query('SELECT * FROM layouts WHERE track_id = $1 ORDER BY name', [trackId]);
    } else {
      result = await db.query('SELECT * FROM layouts ORDER BY name');
    }
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, admin, async (req, res, next) => {
  const { trackId, name, imageUrl } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO layouts (track_id, name, image_url) VALUES ($1,$2,$3) RETURNING *',
      [trackId, name, imageUrl || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  const { trackId, name, imageUrl } = req.body;
  try {
    const result = await db.query(
      'UPDATE layouts SET track_id=$1, name=$2, image_url=$3 WHERE id=$4 RETURNING *',
      [trackId, name, imageUrl || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Layout not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM layouts WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Layout not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
