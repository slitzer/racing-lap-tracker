const fs = require('fs');
const path = require('path');
const db = require('./database');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', '..', 'database', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found');
    return;
  }
  const files = fs.readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      // eslint-disable-next-line no-await-in-loop
      await db.query(sql);
      console.log(`Ran migration ${file}`);
    } catch (err) {
      console.error(`Failed to run migration ${file}`);
      throw err;
    }
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed', err);
      process.exit(1);
    });
}

module.exports = runMigrations;
