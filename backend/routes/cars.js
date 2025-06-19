const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { gameId } = req.query;
  try {
    let result;
    if (gameId) {
      result = await db.query(
        `SELECT c.id, gc.game_id AS "gameId", c.name, c.image_url AS "imageUrl"
         FROM game_cars gc
         JOIN cars c ON gc.car_id = c.id
         WHERE gc.game_id = $1
         ORDER BY c.name`,
        [gameId]
      );
    } else {
      result = await db.query(
        `SELECT c.id, gc.game_id AS "gameId", c.name, c.image_url AS "imageUrl"
         FROM game_cars gc
         JOIN cars c ON gc.car_id = c.id
         ORDER BY c.name`
      );
    }
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, admin, async (req, res, next) => {
  const { gameId, name, imageUrl } = req.body;
  try {
    const car = await db.query(
      'INSERT INTO cars (name, image_url) VALUES ($1,$2) RETURNING id, name, image_url AS "imageUrl"',
      [name, imageUrl || null]
    );
    const c = car.rows[0];
    await db.query('INSERT INTO game_cars (game_id, car_id) VALUES ($1,$2)', [gameId, c.id]);
    res.status(201).json({ id: c.id, gameId, name: c.name, imageUrl: c.imageUrl });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  const { gameId, name, imageUrl } = req.body;
  try {
    const result = await db.query(
      'UPDATE cars SET name=$1, image_url=$2 WHERE id=$3 RETURNING id, name, image_url AS "imageUrl"',
      [name, imageUrl || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    await db.query('DELETE FROM game_cars WHERE car_id=$1', [id]);
    await db.query('INSERT INTO game_cars (game_id, car_id) VALUES ($1,$2)', [gameId, id]);
    const car = result.rows[0];
    res.json({ id, gameId, name: car.name, imageUrl: car.imageUrl });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM cars WHERE id=$1 RETURNING id, name, image_url AS "imageUrl"',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
