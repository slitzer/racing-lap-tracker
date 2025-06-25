const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.post('/', auth, async (req, res, next) => {
  const { userId } = req.params;
  try {
    await db.query(
      'INSERT INTO follows (follower_id, followee_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [req.user.id, userId]
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.delete('/', auth, async (req, res, next) => {
  const { userId } = req.params;
  try {
    await db.query(
      'DELETE FROM follows WHERE follower_id=$1 AND followee_id=$2',
      [req.user.id, userId]
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get('/', auth, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      `SELECT u.id, u.username
       FROM follows f
       JOIN users u ON f.followee_id = u.id
       WHERE f.follower_id = $1 AND f.followee_id = $2`,
      [req.user.id, userId]
    );
    res.json({ isFollowing: result.rows.length > 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
