const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../utils/database');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  const { lapTimeId } = req.params;
  try {
    const result = await db.query(
      `SELECT c.id, c.lap_time_id AS "lapTimeId", c.user_id AS "userId", c.content, c.created_at AS "createdAt", u.username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.lap_time_id = $1
       ORDER BY c.created_at ASC`,
      [lapTimeId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  [body('content').trim().notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { content } = req.body;
    const { lapTimeId } = req.params;
    try {
      const result = await db.query(
        `INSERT INTO comments (lap_time_id, user_id, content)
         VALUES ($1,$2,$3)
         RETURNING id, lap_time_id AS "lapTimeId", user_id AS "userId", content, created_at AS "createdAt"`,
        [lapTimeId, req.user.id, content]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
