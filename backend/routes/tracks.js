const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { body, validationResult } = require('express-validator');
const { writeMarkdown, readMarkdown, contentDir } = require('../utils/markdown');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { gameId } = req.query;
  try {
    let result;
    if (gameId) {
      result = await db.query(
        'SELECT id, game_id AS "gameId", name, image_url AS "imageUrl", description FROM tracks WHERE game_id = $1 ORDER BY name',
        [gameId]
      );
    } else {
      result = await db.query(
        'SELECT id, game_id AS "gameId", name, image_url AS "imageUrl", description FROM tracks ORDER BY name'
      );
    }
    const tracks = result.rows.map((t) => ({
      ...t,
      description: readMarkdown(t.description),
    }));
    res.json(tracks);
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
    body('description').optional().trim(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { gameId, name, imageUrl, description } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO tracks (game_id, name, image_url) VALUES ($1,$2,$3) RETURNING id, game_id AS "gameId", name, image_url AS "imageUrl"',
        [gameId, name, imageUrl || null]
      );
      const t = result.rows[0];
      const mdPath = writeMarkdown('tracks', t.id, description || '');
      await db.query('UPDATE tracks SET description=$1 WHERE id=$2', [mdPath, t.id]);
      res.status(201).json({ ...t, description });
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
    const { gameId, name, imageUrl, description } = req.body;
    try {
      const mdPath = writeMarkdown('tracks', id, description || '');
      const result = await db.query(
        'UPDATE tracks SET game_id=$1, name=$2, image_url=$3, description=$4 WHERE id=$5 RETURNING id, game_id AS "gameId", name, image_url AS "imageUrl", description',
        [gameId, name, imageUrl || null, mdPath, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Track not found' });
      }
      res.json({ ...result.rows[0], description });
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM tracks WHERE id=$1 RETURNING id, game_id AS "gameId", name, image_url AS "imageUrl", description',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Track not found' });
    }
    const mdPath = result.rows[0].description;
    if (mdPath) fs.rmSync(path.join(contentDir, mdPath), { force: true });
    res.json({ ...result.rows[0], description: readMarkdown(mdPath) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
