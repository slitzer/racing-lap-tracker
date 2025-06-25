const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const db = require('./utils/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');
const trackRoutes = require('./routes/tracks');
const layoutRoutes = require('./routes/layouts');
const carRoutes = require('./routes/cars');
const lapTimeRoutes = require('./routes/lapTimes');
const leaderboardRoutes = require('./routes/leaderboards');
const assistRoutes = require('./routes/assists');
const adminRoutes = require('./routes/admin');
const adminUserRoutes = require('./routes/adminUsers');
const versionRoutes = require('./routes/version');
const commentRoutes = require('./routes/comments');
const followRoutes = require('./routes/follows');
const { router: uploadRoutes, uploadDir } = require('./routes/uploads');
const { contentDir } = require('./utils/markdown');
const { seedSampleLapTimes } = require('./utils/seedSampleLapTimes');
const { seedDefaultAssists } = require('./utils/seedDefaultAssists');
const runMigrations = require('./utils/runMigrations');
const waitForDb = require('./utils/waitForDb');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust the first proxy (e.g., docker compose or nginx)
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));

// Ensure uploads directory exists and serve static files
fs.mkdirSync(uploadDir, { recursive: true });
console.log(`Uploads directory: ${uploadDir}`);
app.use('/uploads', express.static(uploadDir));

// Ensure markdown content directory exists and serve static files
fs.mkdirSync(contentDir, { recursive: true });
console.log(`Content directory: ${contentDir}`);
app.use('/content', express.static(contentDir));

// Basic rate limiting
const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/layouts', layoutRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/assists', assistRoutes);
app.use('/api/lapTimes', lapTimeRoutes);
app.use('/api/lapTimes/:lapTimeId/comments', commentRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/users/:userId/follow', followRoutes);
app.use('/api/version', versionRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const seedSamples = process.env.SEED_SAMPLE_LAPTIMES !== 'false';

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await waitForDb();
      await runMigrations();
      await seedDefaultAssists();
      if (seedSamples) {
        await seedSampleLapTimes();
      }
    } catch (err) {
      console.error('Failed to seed sample lap times', err);
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })();
}

module.exports = app;
