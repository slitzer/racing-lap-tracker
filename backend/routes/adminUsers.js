const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', auth, admin, async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, username, email, is_admin FROM users ORDER BY username');
    res.json(result.rows.map((u) => ({ id: u.id, username: u.username, email: u.email, isAdmin: u.is_admin })));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  admin,
  [body('username').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), body('isAdmin').optional().isBoolean()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, isAdmin } = req.body;
    try {
      const hashed = await bcrypt.hash(password, 10);
      const result = await db.query(
        'INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1,$2,$3,$4) RETURNING id, username, email, is_admin',
        [username, email, hashed, isAdmin || false]
      );
      const u = result.rows[0];
      res.status(201).json({ id: u.id, username: u.username, email: u.email, isAdmin: u.is_admin });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:id',
  auth,
  admin,
  [body('username').optional().notEmpty(), body('email').optional().isEmail(), body('password').optional().isLength({ min: 6 }), body('isAdmin').optional().isBoolean()],
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, isAdmin } = req.body;
    const fields = [];
    const params = [];
    if (username !== undefined) {
      params.push(username);
      fields.push(`username = $${params.length}`);
    }
    if (email !== undefined) {
      params.push(email);
      fields.push(`email = $${params.length}`);
    }
    if (typeof isAdmin === 'boolean') {
      params.push(isAdmin);
      fields.push(`is_admin = $${params.length}`);
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      params.push(hashed);
      fields.push(`password_hash = $${params.length}`);
    }
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided' });
    }
    params.push(id);
    try {
      const result = await db.query(
        `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length} RETURNING id, username, email, is_admin`,
        params
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const u = result.rows[0];
      res.json({ id: u.id, username: u.username, email: u.email, isAdmin: u.is_admin });
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  const keepTimes = req.query.keepTimes === 'true' || req.query.keepTimes === '1';
  try {
    if (keepTimes) {
      await db.query(
        'UPDATE users SET username=$1, email=$2, password_hash=$3, avatar_url=NULL, is_admin=FALSE WHERE id=$4',
        [`deleted-${Date.now()}`, '', '', id]
      );
      return res.json({ id });
    }
    const result = await db.query('DELETE FROM users WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
