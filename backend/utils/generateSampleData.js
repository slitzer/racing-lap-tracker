const db = require('./database');
const { seedDefaultAssists } = require('./seedDefaultAssists');

const sampleUsers = [
  'SpeedySam',
  'TurboTom',
  'RapidRita',
  'QuickQuinn',
  'LightningLeo',
  'BlazeBella',
  'NitroNina',
  'DriftDerek',
  'RallyRae',
  'TrackTony',
];

async function generateSampleData() {
  await seedDefaultAssists();

  const passwordHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

  for (const name of sampleUsers) {
    // eslint-disable-next-line no-await-in-loop
    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3) ON CONFLICT (username) DO NOTHING',
      [name.toLowerCase(), `${name.toLowerCase()}@example.com`, passwordHash]
    );
  }

  const { rows: userRows } = await db.query('SELECT id, username FROM users');
  const userMap = Object.fromEntries(userRows.map((u) => [u.username, u.id]));

  let games = await db.query('SELECT id, name FROM games');
  if (games.rows.length === 0) {
    // If no games exist yet, attempt to scan the bundled GamePack directory
    const { scanGamePack } = require('./scanGamePack');
    try {
      const summary = await scanGamePack();
      if (summary.games > 0) {
        games = await db.query('SELECT id, name FROM games');
      }
    } catch (err) {
      console.error('Failed to scan GamePack for sample data', err);
    }
    if (games.rows.length === 0) {
      console.log('No games found. Skipping sample lap generation');
      return;
    }
  }

  const gameTracks = await db.query('SELECT game_id, track_layout_id FROM game_tracks');
  const gameCars = await db.query('SELECT game_id, car_id FROM game_cars');
  const assists = await db.query('SELECT id, name FROM assists');

  const gameMap = {};
  for (const g of games.rows) {
    gameMap[g.id] = { layouts: [], cars: [] };
  }
  for (const row of gameTracks.rows) {
    if (gameMap[row.game_id]) gameMap[row.game_id].layouts.push(row.track_layout_id);
  }
  for (const row of gameCars.rows) {
    if (gameMap[row.game_id]) gameMap[row.game_id].cars.push(row.car_id);
  }

  const validGameIds = Object.keys(gameMap).filter(
    (id) => gameMap[id].layouts.length > 0 && gameMap[id].cars.length > 0
  );
  if (validGameIds.length === 0) {
    console.log('No tracks or cars available to generate sample data');
    return;
  }

  const assistOptions = assists.rows;
  const inputTypes = ['Wheel', 'Controller', 'Keyboard'];
  const userIds = Object.values(userMap);

  let inserted = 0;
  const sampleCount = Math.min(50, validGameIds.length * 10);
  for (let i = 0; i < sampleCount; i += 1) {
    const userId = userIds[i % userIds.length];
    const gameId = validGameIds[Math.floor(Math.random() * validGameIds.length)];
    const { layouts, cars } = gameMap[gameId];
    const tlId = layouts[Math.floor(Math.random() * layouts.length)];
    const carId = cars[Math.floor(Math.random() * cars.length)];

    const inputType = inputTypes[Math.floor(Math.random() * inputTypes.length)];
    const timeMs = Math.floor(60000 + Math.random() * 120000);
    const lapDate = new Date(
      Date.now() - Math.floor(Math.random() * 365) * 86400000
    )
      .toISOString()
      .slice(0, 10);

    const assistSample = [];
    const assistIds = [];
    const assistCount = Math.floor(Math.random() * 3);
    for (let j = 0; j < assistCount; j += 1) {
      const a = assistOptions[Math.floor(Math.random() * assistOptions.length)];
      if (!assistIds.includes(a.id)) {
        assistIds.push(a.id);
        assistSample.push(a.name);
      }
    }

    const res = await db.query(
      `INSERT INTO lap_times (user_id, game_id, track_layout_id, car_id, input_type, assists_json, time_ms, lap_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [userId, gameId, tlId, carId, inputType, JSON.stringify(assistSample), timeMs, lapDate]
    );
    const lapId = res.rows[0].id;
    for (const aid of assistIds) {
      // eslint-disable-next-line no-await-in-loop
      await db.query('INSERT INTO lap_time_assists (lap_time_id, assist_id) VALUES ($1,$2)', [
        lapId,
        aid,
      ]);
    }
    inserted += 1;
  }

  console.log(`Generated sample users and ${inserted} lap times`);
}

module.exports = { generateSampleData };
