const db = require('../utils/database');

module.exports = async function (req, res, next) {
  try {
    const result = await db.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (result.rows[0] && result.rows[0].is_admin) {
      return next();
    }
    return res.status(403).json({ message: 'Admin access required' });
  } catch (err) {
    next(err);
  }
};
