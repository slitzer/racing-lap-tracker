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
        `SELECT c.id, gc.game_id AS "gameId", c.name, c.image_url AS "imageUrl", c.description
         FROM game_cars gc
         JOIN cars c ON gc.car_id = c.id
         WHERE gc.game_id = $1
         ORDER BY c.name`,
        [gameId]
      );
    } else {
      result = await db.query(
        `SELECT c.id, gc.game_id AS "gameId", c.name, c.image_url AS "imageUrl", c.description
         FROM game_cars gc
         JOIN cars c ON gc.car_id = c.id
         ORDER BY c.name`
      );
    }
    const cars = result.rows.map((c) => ({
      ...c,
      description: readMarkdown(c.description),
    }));
    res.json(cars);
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
      const car = await db.query(
        'INSERT INTO cars (name, image_url) VALUES ($1,$2) RETURNING id, name, image_url AS "imageUrl"',
        [name, imageUrl || null]
      );
      const c = car.rows[0];
      const mdPath = writeMarkdown('cars', c.id, description || '');
      await db.query('UPDATE cars SET description=$1 WHERE id=$2', [mdPath, c.id]);
      await db.query('INSERT INTO game_cars (game_id, car_id) VALUES ($1,$2)', [gameId, c.id]);
      res.status(201).json({ id: c.id, gameId, name: c.name, imageUrl: c.imageUrl, description });
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
    body('description').optional().trim(),
  ],
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { gameId, name, imageUrl, description } = req.body;
    try {
      const mdPath = writeMarkdown('cars', id, description || '');
      const result = await db.query(
        'UPDATE cars SET name=$1, image_url=$2, description=$3 WHERE id=$4 RETURNING id, name, image_url AS "imageUrl", description',
        [name, imageUrl || null, mdPath, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Car not found' });
      }
      await db.query('DELETE FROM game_cars WHERE car_id=$1', [id]);
      await db.query('INSERT INTO game_cars (game_id, car_id) VALUES ($1,$2)', [gameId, id]);
      const car = result.rows[0];
      res.json({ id, gameId, name: car.name, imageUrl: car.imageUrl, description });
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM cars WHERE id=$1 RETURNING id, name, image_url AS "imageUrl", description',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    const mdPath = result.rows[0].description;
    if (mdPath) {
      fs.rmSync(path.join(contentDir, mdPath), { force: true });
    }
    res.json({ ...result.rows[0], description: readMarkdown(mdPath) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
