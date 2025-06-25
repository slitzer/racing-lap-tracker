const fs = require('fs');
const path = require('path');
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

  const file = path.join(__dirname, '..', '..', 'database', 'sample_lap_times.json');
  const samples = JSON.parse(fs.readFileSync(file, 'utf8'));

  const games = await db.query('SELECT id, name FROM games');
  const trackLayouts = await db.query(`SELECT tl.id, t.name AS track, l.name AS layout
                                       FROM track_layouts tl
                                       JOIN tracks t ON tl.track_id = t.id
                                       JOIN layouts l ON tl.layout_id = l.id`);
  const cars = await db.query('SELECT id, name FROM cars');
  const assists = await db.query('SELECT id, name FROM assists');

  const gameMap = Object.fromEntries(games.rows.map((g) => [g.name, g.id]));
  const tlMap = Object.fromEntries(trackLayouts.rows.map((r) => [`${r.track}|${r.layout}`, r.id]));
  const carMap = Object.fromEntries(cars.rows.map((c) => [c.name, c.id]));
  const assistMap = Object.fromEntries(assists.rows.map((a) => [a.name, a.id]));

  let userIdx = 0;
  for (const lap of samples) {
    const userName = sampleUsers[userIdx % sampleUsers.length].toLowerCase();
    userIdx += 1;
    const userId = userMap[userName];
    const gameId = gameMap[lap.game];
    const tlId = tlMap[`${lap.track}|${lap.layout}`];
    const carId = carMap[lap.car];
    if (!userId || !gameId || !tlId || !carId) continue; // skip if data missing

    const res = await db.query(
      `INSERT INTO lap_times (user_id, game_id, track_layout_id, car_id, input_type, assists_json, time_ms, lap_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [userId, gameId, tlId, carId, lap.inputType, JSON.stringify(lap.assists), lap.timeMs, lap.lapDate]
    );
    const lapId = res.rows[0].id;
    for (const a of lap.assists) {
      const aid = assistMap[a];
      if (aid) {
        // eslint-disable-next-line no-await-in-loop
        await db.query('INSERT INTO lap_time_assists (lap_time_id, assist_id) VALUES ($1,$2)', [lapId, aid]);
      }
    }
  }

  console.log('Generated sample users and lap times');
}

module.exports = { generateSampleData };
