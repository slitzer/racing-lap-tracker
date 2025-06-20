const db = require('./database');

async function waitForDb({ retries = 10, delay = 3000 } = {}) {
  for (let i = 0; i < retries; i += 1) {
    try {
      await db.query('SELECT 1');
      return true;
    } catch (err) {
      console.log(`Database not ready (${err.code}); retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Database never became ready');
}

module.exports = waitForDb;
