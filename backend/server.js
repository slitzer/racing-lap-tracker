const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
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
const uploadRoutes = require('./routes/uploads');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
app.use('/api/lapTimes', lapTimeRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/uploads', uploadRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
