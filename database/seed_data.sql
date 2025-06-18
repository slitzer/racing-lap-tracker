-- Seed data for Racing Lap Tracker
-- Created by MiniMax Agent
-- Insert sample games
INSERT INTO games (name, image_url) VALUES 
('Assetto Corsa', '/images/games/assetto_corsa.jpg'),
('Assetto Corsa Competizione', '/images/games/acc.jpg'),
('Forza Motorsport', '/images/games/forza_motorsport.jpg'),
('Gran Turismo 7', '/images/games/gran_turismo_7.jpg'),
('iRacing', '/images/games/iracing.jpg'),
('F1 23', '/images/games/f1_23.jpg'),
('Project CARS 3', '/images/games/project_cars_3.jpg'),
('rFactor 2', '/images/games/rfactor_2.jpg');
-- Get game IDs for reference
-- Assetto Corsa tracks and layouts
INSERT INTO tracks (game_id, name, image_url) 
SELECT id, 'Silverstone', '/images/tracks/silverstone.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Spa-Francorchamps', '/images/tracks/spa.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Monza', '/images/tracks/monza.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Nürburgring', '/images/tracks/nurburgring.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Brands Hatch', '/images/tracks/brands_hatch.jpg' FROM games WHERE name = 'Assetto Corsa';
-- Layouts for Silverstone
INSERT INTO layouts (track_id, name, image_url)
SELECT id, 'GP Circuit', '/images/layouts/silverstone_gp.jpg' FROM tracks WHERE name = 'Silverstone'
UNION ALL
SELECT id, 'National Circuit', '/images/layouts/silverstone_national.jpg' FROM tracks WHERE name = 'Silverstone';
-- Layouts for Spa-Francorchamps
INSERT INTO layouts (track_id, name, image_url)
SELECT id, 'Full Circuit', '/images/layouts/spa_full.jpg' FROM tracks WHERE name = 'Spa-Francorchamps';
-- Layouts for Monza
INSERT INTO layouts (track_id, name, image_url)
SELECT id, 'GP Circuit', '/images/layouts/monza_gp.jpg' FROM tracks WHERE name = 'Monza'
UNION ALL
SELECT id, 'Junior Circuit', '/images/layouts/monza_junior.jpg' FROM tracks WHERE name = 'Monza';
-- Layouts for Nürburgring
INSERT INTO layouts (track_id, name, image_url)
SELECT id, 'GP Circuit', '/images/layouts/nurburgring_gp.jpg' FROM tracks WHERE name = 'Nürburgring'
UNION ALL
SELECT id, 'Nordschleife', '/images/layouts/nurburgring_nord.jpg' FROM tracks WHERE name = 'Nürburgring';
-- Layouts for Brands Hatch
INSERT INTO layouts (track_id, name, image_url)
SELECT id, 'GP Circuit', '/images/layouts/brands_hatch_gp.jpg' FROM tracks WHERE name = 'Brands Hatch'
UNION ALL
SELECT id, 'Indy Circuit', '/images/layouts/brands_hatch_indy.jpg' FROM tracks WHERE name = 'Brands Hatch';
-- Cars for Assetto Corsa
INSERT INTO cars (game_id, name, image_url)
SELECT id, 'Ferrari 488 GT3', '/images/cars/ferrari_488_gt3.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'McLaren MP4-12C GT3', '/images/cars/mclaren_mp4_12c_gt3.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'BMW M3 E30', '/images/cars/bmw_m3_e30.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Porsche 911 GT3 R', '/images/cars/porsche_911_gt3_r.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Mercedes AMG GT3', '/images/cars/mercedes_amg_gt3.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Audi R8 LMS', '/images/cars/audi_r8_lms.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Lamborghini Huracán GT3', '/images/cars/lamborghini_huracan_gt3.jpg' FROM games WHERE name = 'Assetto Corsa'
UNION ALL
SELECT id, 'Formula RSS 2 V6', '/images/cars/formula_rss_2_v6.jpg' FROM games WHERE name = 'Assetto Corsa';
-- ACC tracks and cars
INSERT INTO tracks (game_id, name, image_url) 
SELECT id, 'Monza', '/images/tracks/monza.jpg' FROM games WHERE name = 'Assetto Corsa Competizione'
UNION ALL
SELECT id, 'Spa-Francorchamps', '/images/tracks/spa.jpg' FROM games WHERE name = 'Assetto Corsa Competizione'
UNION ALL
SELECT id, 'Silverstone', '/images/tracks/silverstone.jpg' FROM games WHERE name = 'Assetto Corsa Competizione';
-- Layouts for ACC tracks
INSERT INTO layouts (track_id, name, image_url)
SELECT t.id, 'GP Circuit', '/images/layouts/monza_gp.jpg' FROM tracks t 
JOIN games g ON t.game_id = g.id WHERE t.name = 'Monza' AND g.name = 'Assetto Corsa Competizione'
UNION ALL
SELECT t.id, 'Full Circuit', '/images/layouts/spa_full.jpg' FROM tracks t 
JOIN games g ON t.game_id = g.id WHERE t.name = 'Spa-Francorchamps' AND g.name = 'Assetto Corsa Competizione'
UNION ALL
SELECT t.id, 'GP Circuit', '/images/layouts/silverstone_gp.jpg' FROM tracks t 
JOIN games g ON t.game_id = g.id WHERE t.name = 'Silverstone' AND g.name = 'Assetto Corsa Competizione';
-- Cars for ACC
INSERT INTO cars (game_id, name, image_url)
SELECT id, 'Ferrari 488 GT3 Evo', '/images/cars/ferrari_488_gt3_evo.jpg' FROM games WHERE name = 'Assetto Corsa Competizione'
UNION ALL
SELECT id, 'McLaren 720S GT3', '/images/cars/mclaren_720s_gt3.jpg' FROM games WHERE name = 'Assetto Corsa Competizione'
UNION ALL
SELECT id, 'Porsche 911 GT3 R', '/images/cars/porsche_911_gt3_r.jpg' FROM games WHERE name = 'Assetto Corsa Competizione'
UNION ALL
SELECT id, 'Mercedes AMG GT3', '/images/cars/mercedes_amg_gt3.jpg' FROM games WHERE name = 'Assetto Corsa Competizione';
-- Create admin user (password: admin123)
INSERT INTO users (username, email, password_hash, is_admin) VALUES 
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true);
-- Create sample regular user (password: user123)
INSERT INTO users (username, email, password_hash, is_admin) VALUES 
('racer1', 'racer1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', false);