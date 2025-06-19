const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { gameId } = req.query;
  try {
    let result;
    if (gameId) {
      result = await db.query(
        'SELECT id, game_id AS "gameId", name, image_url AS "imageUrl" FROM tracks WHERE game_id = $1 ORDER BY name',
        [gameId]
      );
    } else {
      result = await db.query(
        'SELECT id, game_id AS "gameId", name, image_url AS "imageUrl" FROM tracks ORDER BY name'
      );
    }
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  admin,
  [
    body('gameId').notEmpty(),
    body('name').trim().escape().notEmpty(),
    body('imageUrl').optional().trim(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { gameId, name, imageUrl } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO tracks (game_id, name, image_url) VALUES ($1,$2,$3) RETURNING id, game_id AS "gameId", name, image_url AS "imageUrl"',
        [gameId, name, imageUrl || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:id',
  auth,
  admin,
  [
    body('gameId').notEmpty(),
    body('name').trim().escape().notEmpty(),
    body('imageUrl').optional().trim(),
  ],
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { gameId, name, imageUrl } = req.body;
    try {
      const result = await db.query(
        'UPDATE tracks SET game_id=$1, name=$2, image_url=$3 WHERE id=$4 RETURNING id, game_id AS "gameId", name, image_url AS "imageUrl"',
        [gameId, name, imageUrl || null, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Track not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM tracks WHERE id=$1 RETURNING id, game_id AS "gameId", name, image_url AS "imageUrl"',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
