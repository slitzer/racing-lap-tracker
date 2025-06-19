const express = require('express');
const db = require('../utils/database');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/lapTimes/unverified', auth, admin, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT lt.id,
              lt.user_id AS "userId",
              lt.game_id AS "gameId",
              lt.track_layout_id AS "trackLayoutId",
              t.id AS "trackId",
              l.id AS "layoutId",
              lt.car_id AS "carId",
              lt.time_ms AS "timeMs",
              lt.screenshot_url AS "screenshotUrl",
              u.username,
              g.name AS "gameName",
              t.name AS "trackName",
              l.name AS "layoutName",
              c.name AS "carName"
       FROM lap_times lt
       JOIN users u ON lt.user_id = u.id
       JOIN games g ON lt.game_id = g.id
       JOIN track_layouts tl ON lt.track_layout_id = tl.id
       JOIN tracks t ON tl.track_id = t.id
       JOIN layouts l ON tl.layout_id = l.id
       JOIN cars c ON lt.car_id = c.id
       WHERE lt.verified = FALSE
       ORDER BY lt.date_submitted DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.put('/lapTimes/:id/verify', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE lap_times SET verified = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lap time not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/lapTimes/:id', auth, admin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM lap_times WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lap time not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/export', auth, admin, async (req, res, next) => {
  try {
    const tables = [
      'users',
      'games',
      'tracks',
      'layouts',
      'cars',
      'assists',
      'lap_times',
      'lap_time_assists',
    ];
    const data = {};
    for (const t of tables) {
      // eslint-disable-next-line no-await-in-loop
      const result = await db.query(`SELECT * FROM ${t}`);
      data[t] = result.rows;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/import', auth, admin, async (req, res, next) => {
  const {
    users,
    games,
    tracks,
    layouts,
    cars,
    assists,
    lap_times,
    lap_time_assists,
  } = req.body;
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'TRUNCATE lap_time_assists, lap_times, assists, cars, layouts, tracks, games, users RESTART IDENTITY CASCADE'
    );

    if (users) {
      for (const u of users) {
        // eslint-disable-next-line no-await-in-loop
        await client.query(
          'INSERT INTO users (id, username, email, password_hash, is_admin, avatar_url, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
          [
            u.id,
            u.username,
            u.email,
            u.password_hash,
            u.is_admin,
            u.avatar_url,
            u.created_at,
            u.updated_at,
          ]
        );
      }
    }
    if (games) {
      for (const g of games) {
        // eslint-disable-next-line no-await-in-loop
        await client.query(
          'INSERT INTO games (id, name, image_url, created_at, updated_at) VALUES ($1,$2,$3,$4,$5)',
          [g.id, g.name, g.image_url, g.created_at, g.updated_at]
        );
      }
    }
    if (tracks) {
      for (const t of tracks) {
        // eslint-disable-next-line no-await-in-loop
        await client.query(
          'INSERT INTO tracks (id, game_id, name, image_url, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6)',
          [t.id, t.game_id, t.name, t.image_url, t.created_at, t.updated_at]
        );
      }
    }
    if (layouts) {
      for (const l of layouts) {
        // eslint-disable-next-line no-await-in-loop
        await client.query(
          'INSERT INTO layouts (id, track_id, name, image_url, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6)',
          [l.id, l.track_id, l.name, l.image_url, l.created_at, l.updated_at]
        );
      }
    }
    if (cars) {
      for (const c of cars) {
        // eslint-disable-next-line no-await-in-loop
        await client.query(
          'INSERT INTO cars (id, game_id, name, image_url, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6)',
          [c.id, c.game_id, c.name, c.image_url, c.created_at, c.updated_at]
        );
      }
    }
    if (assists) {
      for (const a of assists) {
        // eslint-disable-next-line no-await-in-loop
        await client.query('INSERT INTO assists (id, name) VALUES ($1,$2)', [
          a.id,
          a.name,
        ]);
      }
    }
    if (lap_times) {
      for (const lt of lap_times) {
        // eslint-disable-next-line no-await-in-loop
        await client.query(
          'INSERT INTO lap_times (id, user_id, game_id, track_layout_id, car_id, input_type, assists_json, time_ms, screenshot_url, verified, date_submitted, lap_date, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
          [
            lt.id,
            lt.user_id,
            lt.game_id,
            lt.track_layout_id,
            lt.car_id,
            lt.input_type,
            lt.assists_json,
            lt.time_ms,
            lt.screenshot_url,
            lt.verified,
            lt.date_submitted,
            lt.lap_date,
            lt.created_at,
            lt.updated_at,
          ]
        );
      }
    }
    if (lap_time_assists) {
      for (const lta of lap_time_assists) {
        // eslint-disable-next-line no-await-in-loop
        await client.query(
          'INSERT INTO lap_time_assists (lap_time_id, assist_id) VALUES ($1,$2)',
          [lta.lap_time_id, lta.assist_id]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Import completed' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
