const db = require('./database');

const defaultAssists = [
  'Traction Control',
  'ABS',
  'Stability Control',
  'Auto Clutch',
  'Automatic Transmission',
  'Launch Control',
  'Brake Assist',
  'Throttle Assist',
  'Steering Assist',
  'Racing Line',
  'Suggested Gear Indicator',
  'Braking Indicator',
  'Cornering Guide',
  'Ghosting / Collision Off',
  'Tire Wear Off',
  'Fuel Usage Off',
  'Mechanical Failures Off',
  'Damage Off',
];

async function seedDefaultAssists() {
  const { rows } = await db.query('SELECT COUNT(*) FROM assists');
  if (parseInt(rows[0].count, 10) > 0) return;

  for (const name of defaultAssists) {
    // eslint-disable-next-line no-await-in-loop
    await db.query('INSERT INTO assists (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
  }
  console.log('Inserted default assists');
}

module.exports = { seedDefaultAssists };
