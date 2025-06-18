const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM games ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, admin, async (req, res, next) => {
  const { name, imageUrl } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO games (name, image_url) VALUES ($1,$2) RETURNING *',
      [name, imageUrl || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;
  try {
    const result = await db.query(
      'UPDATE games SET name=$1, image_url=$2 WHERE id=$3 RETURNING *',
      [name, imageUrl || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM games WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
