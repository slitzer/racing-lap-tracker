const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { trackId } = req.query;
  try {
    let result;
    if (trackId) {
      result = await db.query(
        `SELECT l.id, l.track_id AS "trackId", l.name, l.image_url AS "imageUrl", tl.id AS "trackLayoutId",
                tl.pit_speed_limit_high_kph AS "pitSpeedLimitHighKPH",
                tl.max_ai_participants AS "maxAIParticipants",
                tl.race_date_year AS "raceDateYear",
                tl.race_date_month AS "raceDateMonth",
                tl.race_date_day AS "raceDateDay",
                tl.track_surface AS "trackSurface",
                tl.track_type AS "trackType",
                tl.track_grade_filter AS "trackGradeFilter",
                tl.number_of_turns AS "numberOfTurns",
                tl.track_time_zone AS "trackTimeZone",
                tl.track_altitude AS "trackAltitude",
                tl.length AS "length",
                tl.dlc_id AS "dlcId",
                tl.location AS "location"
         FROM layouts l JOIN track_layouts tl ON tl.layout_id = l.id
         WHERE l.track_id = $1 ORDER BY l.name`,
        [trackId]
      );
    } else {
      result = await db.query(
        `SELECT l.id, l.track_id AS "trackId", l.name, l.image_url AS "imageUrl", tl.id AS "trackLayoutId",
                tl.pit_speed_limit_high_kph AS "pitSpeedLimitHighKPH",
                tl.max_ai_participants AS "maxAIParticipants",
                tl.race_date_year AS "raceDateYear",
                tl.race_date_month AS "raceDateMonth",
                tl.race_date_day AS "raceDateDay",
                tl.track_surface AS "trackSurface",
                tl.track_type AS "trackType",
                tl.track_grade_filter AS "trackGradeFilter",
                tl.number_of_turns AS "numberOfTurns",
                tl.track_time_zone AS "trackTimeZone",
                tl.track_altitude AS "trackAltitude",
                tl.length AS "length",
                tl.dlc_id AS "dlcId",
                tl.location AS "location"
         FROM layouts l JOIN track_layouts tl ON tl.layout_id = l.id
         ORDER BY l.name`
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
    body('trackId').notEmpty(),
    body('name').trim().escape().notEmpty(),
    body('imageUrl').optional().trim(),
    body('pitSpeedLimitHighKPH').optional(),
    body('maxAIParticipants').optional(),
    body('raceDateYear').optional(),
    body('raceDateMonth').optional(),
    body('raceDateDay').optional(),
    body('trackSurface').optional(),
    body('trackType').optional(),
    body('trackGradeFilter').optional(),
    body('numberOfTurns').optional(),
    body('trackTimeZone').optional(),
    body('trackAltitude').optional(),
    body('length').optional(),
    body('dlcId').optional(),
    body('location').optional(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      trackId,
      name,
      imageUrl,
      pitSpeedLimitHighKPH,
      maxAIParticipants,
      raceDateYear,
      raceDateMonth,
      raceDateDay,
      trackSurface,
      trackType,
      trackGradeFilter,
      numberOfTurns,
      trackTimeZone,
      trackAltitude,
      length,
      dlcId,
      location,
    } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO layouts (track_id, name, image_url) VALUES ($1,$2,$3) RETURNING id, track_id AS "trackId", name, image_url AS "imageUrl"',
        [trackId, name, imageUrl || null]
      );
      const layout = result.rows[0];
      const tl = await db.query(
        `INSERT INTO track_layouts (
          track_id,
          layout_id,
          pit_speed_limit_high_kph,
          max_ai_participants,
          race_date_year,
          race_date_month,
          race_date_day,
          track_surface,
          track_type,
          track_grade_filter,
          number_of_turns,
          track_time_zone,
          track_altitude,
          length,
          dlc_id,
          location
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
        ) RETURNING id`,
        [
          trackId,
          layout.id,
          pitSpeedLimitHighKPH || null,
          maxAIParticipants || null,
          raceDateYear || null,
          raceDateMonth || null,
          raceDateDay || null,
          trackSurface || null,
          trackType || null,
          trackGradeFilter || null,
          numberOfTurns || null,
          trackTimeZone || null,
          trackAltitude || null,
          length || null,
          dlcId || null,
          location || null,
        ]
      );
      res.status(201).json({ ...layout, trackLayoutId: tl.rows[0].id });
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
    body('trackId').notEmpty(),
    body('name').trim().escape().notEmpty(),
    body('imageUrl').optional().trim(),
    body('pitSpeedLimitHighKPH').optional(),
    body('maxAIParticipants').optional(),
    body('raceDateYear').optional(),
    body('raceDateMonth').optional(),
    body('raceDateDay').optional(),
    body('trackSurface').optional(),
    body('trackType').optional(),
    body('trackGradeFilter').optional(),
    body('numberOfTurns').optional(),
    body('trackTimeZone').optional(),
    body('trackAltitude').optional(),
    body('length').optional(),
    body('dlcId').optional(),
    body('location').optional(),
  ],
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      trackId,
      name,
      imageUrl,
      pitSpeedLimitHighKPH,
      maxAIParticipants,
      raceDateYear,
      raceDateMonth,
      raceDateDay,
      trackSurface,
      trackType,
      trackGradeFilter,
      numberOfTurns,
      trackTimeZone,
      trackAltitude,
      length,
      dlcId,
      location,
    } = req.body;
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
        `UPDATE track_layouts SET
          track_id=$1,
          pit_speed_limit_high_kph=$2,
          max_ai_participants=$3,
          race_date_year=$4,
          race_date_month=$5,
          race_date_day=$6,
          track_surface=$7,
          track_type=$8,
          track_grade_filter=$9,
          number_of_turns=$10,
          track_time_zone=$11,
          track_altitude=$12,
          length=$13,
          dlc_id=$14,
          location=$15
        WHERE layout_id=$16 RETURNING id`,
        [
          trackId,
          pitSpeedLimitHighKPH || null,
          maxAIParticipants || null,
          raceDateYear || null,
          raceDateMonth || null,
          raceDateDay || null,
          trackSurface || null,
          trackType || null,
          trackGradeFilter || null,
          numberOfTurns || null,
          trackTimeZone || null,
          trackAltitude || null,
          length || null,
          dlcId || null,
          location || null,
          id,
        ]
      );
      res.json({ ...layout, trackLayoutId: tl.rows[0].id });
    } catch (err) {
      next(err);
    }
  }
);

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
