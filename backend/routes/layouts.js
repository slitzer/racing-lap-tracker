const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { trackId } = req.query;
  try {
    let result;
    if (trackId) {
      result = await db.query(
        `SELECT l.id, l.track_id AS "trackId", l.name, l.image_url AS "imageUrl", tl.id AS "trackLayoutId"
         FROM layouts l JOIN track_layouts tl ON tl.layout_id = l.id
         WHERE l.track_id = $1 ORDER BY l.name`,
        [trackId]
      );
    } else {
      result = await db.query(
        `SELECT l.id, l.track_id AS "trackId", l.name, l.image_url AS "imageUrl", tl.id AS "trackLayoutId"
         FROM layouts l JOIN track_layouts tl ON tl.layout_id = l.id
         ORDER BY l.name`
      );
    }
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, admin, async (req, res, next) => {
  const { trackId, name, imageUrl } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO layouts (track_id, name, image_url) VALUES ($1,$2,$3) RETURNING id, track_id AS "trackId", name, image_url AS "imageUrl"',
      [trackId, name, imageUrl || null]
    );
    const layout = result.rows[0];
    const tl = await db.query(
      'INSERT INTO track_layouts (track_id, layout_id) VALUES ($1,$2) RETURNING id',
      [trackId, layout.id]
    );
    res.status(201).json({ ...layout, trackLayoutId: tl.rows[0].id });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  const { trackId, name, imageUrl } = req.body;
  try {
    const result = await db.query(
      'UPDATE layouts SET track_id=$1, name=$2, image_url=$3 WHERE id=$4 RETURNING id, track_id AS "trackId", name, image_url AS "imageUrl"',
      [trackId, name, imageUrl || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Layout not found' });
    }
    const layout = result.rows[0];
    const tl = await db.query(
      'UPDATE track_layouts SET track_id=$1 WHERE layout_id=$2 RETURNING id',
      [trackId, id]
    );
    res.json({ ...layout, trackLayoutId: tl.rows[0].id });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM layouts WHERE id=$1 RETURNING id, track_id AS "trackId", name, image_url AS "imageUrl"',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Layout not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
