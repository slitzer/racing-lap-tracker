const fs = require('fs');
const path = require('path');
const db = require('./database');

const gamePackDir = path.resolve(
  process.env.GAMEPACK_DIR ||
    path.join(__dirname, '..', '..', 'frontend', 'public', 'GamePack')
);

async function upsertGame(data) {
  const res = await db.query(
    'INSERT INTO games (name, image_url) VALUES ($1,$2) ON CONFLICT (name) DO UPDATE SET image_url=EXCLUDED.image_url RETURNING id',
    [data.name, data.imageUrl || null]
  );
  return res.rows[0].id;
}

async function upsertTrack(gameId, data) {
  const res = await db.query(
    'INSERT INTO tracks (game_id, name, image_url) VALUES ($1,$2,$3) ON CONFLICT (game_id, name) DO UPDATE SET image_url=EXCLUDED.image_url RETURNING id',
    [gameId, data.name, data.imageUrl || null]
  );
  return res.rows[0].id;
}

async function upsertLayout(trackId, data) {
  const res = await db.query(
    'INSERT INTO layouts (track_id, name, image_url) VALUES ($1,$2,$3) ON CONFLICT (track_id, name) DO UPDATE SET image_url=EXCLUDED.image_url RETURNING id',
    [trackId, data.name, data.imageUrl || null]
  );
  const layoutId = res.rows[0].id;
  const tl = await db.query(
    'INSERT INTO track_layouts (track_id, layout_id) VALUES ($1,$2) ON CONFLICT (track_id, layout_id) DO UPDATE SET track_id=EXCLUDED.track_id RETURNING id',
    [trackId, layoutId]
  );
  return tl.rows[0].id;
}

async function upsertCar(gameId, data) {
  const res = await db.query(
    'INSERT INTO cars (name, image_url) VALUES ($1,$2) ON CONFLICT (name) DO UPDATE SET image_url=EXCLUDED.image_url RETURNING id',
    [data.name, data.imageUrl || null]
  );
  const carId = res.rows[0].id;
  await db.query(
    'INSERT INTO game_cars (game_id, car_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [gameId, carId]
  );
  return carId;
}

function safeReadJSON(file) {
  try {
    const txt = fs.readFileSync(file, 'utf8');
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

async function scanGamePack() {
  const summary = { games: 0, tracks: 0, layouts: 0, cars: 0 };
  if (!fs.existsSync(gamePackDir)) return summary;
  const games = fs
    .readdirSync(gamePackDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());
  for (const g of games) {
    const gameDir = path.join(gamePackDir, g.name);
    const gameJson = safeReadJSON(path.join(gameDir, 'game.json'));
    if (!gameJson) continue;
    const gameId = await upsertGame(gameJson);
    summary.games += 1;
    const tracksDir = path.join(gameDir, 'tracks');
    if (fs.existsSync(tracksDir)) {
      const tFolders = fs
        .readdirSync(tracksDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const t of tFolders) {
        const tJson = safeReadJSON(path.join(tracksDir, t.name, 'track.json'));
        if (!tJson) continue;
        const trackId = await upsertTrack(gameId, tJson);
        summary.tracks += 1;
        const layoutsDir = path.join(tracksDir, t.name, 'layouts');
        if (fs.existsSync(layoutsDir)) {
          const lFolders = fs
            .readdirSync(layoutsDir, { withFileTypes: true })
            .filter((d) => d.isDirectory());
          for (const l of lFolders) {
            const lJson = safeReadJSON(
              path.join(layoutsDir, l.name, 'layout.json')
            );
            if (!lJson) continue;
            const tlId = await upsertLayout(trackId, lJson);
            await db.query(
              'INSERT INTO game_tracks (game_id, track_layout_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
              [gameId, tlId]
            );
            summary.layouts += 1;
          }
        }
      }
    }
    const carsDir = path.join(gameDir, 'cars');
    if (fs.existsSync(carsDir)) {
      const cFolders = fs
        .readdirSync(carsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const c of cFolders) {
        const cJson = safeReadJSON(path.join(carsDir, c.name, 'car.json'));
        if (!cJson) continue;
        await upsertCar(gameId, cJson);
        summary.cars += 1;
      }
    }
  }
  return summary;
}

module.exports = { scanGamePack };
