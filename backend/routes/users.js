const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, username, email, is_admin, avatar_url FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, username FROM users');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
