-- Racing Lap Tracker Database Schema
-- Created by MiniMax Agent
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    wheel TEXT,
    frame TEXT,
    brakes TEXT,
    equipment TEXT,
    favorite_sim TEXT,
    favorite_track TEXT,
    favorite_car TEXT,
    default_assists JSONB,
    league TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tracks table
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, name)
);
-- Layouts table
CREATE TABLE layouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(track_id, name)
);

-- Track layouts table
CREATE TABLE track_layouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    layout_id UUID NOT NULL REFERENCES layouts(id) ON DELETE CASCADE,
    UNIQUE(track_id, layout_id)
);

-- Game tracks table
CREATE TABLE game_tracks (
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    track_layout_id UUID NOT NULL REFERENCES track_layouts(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, track_layout_id)
);
-- Cars table
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name)
);

-- Game cars table
CREATE TABLE game_cars (
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, car_id)
);
-- Input types enum
CREATE TYPE input_type AS ENUM ('Wheel', 'Controller', 'Keyboard');
-- Assists table
CREATE TABLE assists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL
);
-- Lap times table
CREATE TABLE lap_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    track_layout_id UUID NOT NULL REFERENCES track_layouts(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    input_type input_type NOT NULL,
    assists_json JSONB DEFAULT '{}',
    time_ms INTEGER NOT NULL,
    screenshot_url TEXT,
    notes TEXT,
    verified BOOLEAN DEFAULT FALSE,
    date_submitted TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lap_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Junction table for lap times and assists
CREATE TABLE lap_time_assists (
    lap_time_id UUID NOT NULL REFERENCES lap_times(id) ON DELETE CASCADE,
    assist_id UUID NOT NULL REFERENCES assists(id) ON DELETE CASCADE,
    PRIMARY KEY (lap_time_id, assist_id)
);
-- Indexes for performance
CREATE INDEX idx_lap_times_user_id ON lap_times(user_id);
CREATE INDEX idx_lap_times_game_id ON lap_times(game_id);
CREATE INDEX idx_lap_times_track_layout_id ON lap_times(track_layout_id);
CREATE INDEX idx_lap_times_car_id ON lap_times(car_id);
CREATE INDEX idx_lap_times_time_ms ON lap_times(time_ms);
CREATE INDEX idx_lap_times_verified ON lap_times(verified);
CREATE INDEX idx_lap_times_date_submitted ON lap_times(date_submitted);
CREATE INDEX idx_lap_times_lap_date ON lap_times(lap_date);
CREATE INDEX idx_lta_lap_time_id ON lap_time_assists(lap_time_id);
CREATE INDEX idx_lta_assist_id ON lap_time_assists(assist_id);
-- Composite indexes for common queries
CREATE INDEX idx_lap_times_leaderboard ON lap_times(game_id, track_layout_id, time_ms);
CREATE INDEX idx_lap_times_user_stats ON lap_times(user_id, date_submitted);
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_layouts_updated_at BEFORE UPDATE ON layouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lap_times_updated_at BEFORE UPDATE ON lap_times
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
