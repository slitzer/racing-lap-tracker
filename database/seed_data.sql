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
INSERT INTO cars (name, image_url) VALUES
('Ferrari 488 GT3', '/images/cars/ferrari_488_gt3.jpg'),
('McLaren MP4-12C GT3', '/images/cars/mclaren_mp4_12c_gt3.jpg'),
('BMW M3 E30', '/images/cars/bmw_m3_e30.jpg'),
('Porsche 911 GT3 R', '/images/cars/porsche_911_gt3_r.jpg'),
('Mercedes AMG GT3', '/images/cars/mercedes_amg_gt3.jpg'),
('Audi R8 LMS', '/images/cars/audi_r8_lms.jpg'),
('Lamborghini Huracán GT3', '/images/cars/lamborghini_huracan_gt3.jpg'),
('Formula RSS 2 V6', '/images/cars/formula_rss_2_v6.jpg');
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

INSERT INTO cars (name, image_url) VALUES
('Ferrari 488 GT3 Evo', '/images/cars/ferrari_488_gt3_evo.jpg'),
('McLaren 720S GT3', '/images/cars/mclaren_720s_gt3.jpg');

-- Forza Motorsport tracks
INSERT INTO tracks (game_id, name, image_url)
SELECT id, 'Laguna Seca', '/images/tracks/laguna_seca.jpg' FROM games WHERE name = 'Forza Motorsport'
UNION ALL
SELECT id, 'Suzuka Circuit', '/images/tracks/suzuka.jpg' FROM games WHERE name = 'Forza Motorsport';

-- Layouts for Forza Motorsport
INSERT INTO layouts (track_id, name, image_url)
SELECT t.id, 'Full Circuit', '/images/layouts/laguna_full.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Laguna Seca' AND g.name = 'Forza Motorsport'
UNION ALL
SELECT t.id, 'GP Circuit', '/images/layouts/suzuka_gp.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Suzuka Circuit' AND g.name = 'Forza Motorsport'
UNION ALL
SELECT t.id, 'East Circuit', '/images/layouts/suzuka_east.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Suzuka Circuit' AND g.name = 'Forza Motorsport';

-- Cars for Forza Motorsport
INSERT INTO cars (name, image_url) VALUES
('Ford Mustang GT', '/images/cars/ford_mustang_gt.jpg'),
('Chevrolet Corvette C7.R', '/images/cars/corvette_c7r.jpg'),
('Porsche 911 GT3 Cup', '/images/cars/porsche_911_gt3_cup.jpg');

-- Gran Turismo 7 tracks
INSERT INTO tracks (game_id, name, image_url)
SELECT id, 'Tokyo Expressway', '/images/tracks/tokyo_expressway.jpg' FROM games WHERE name = 'Gran Turismo 7'
UNION ALL
SELECT id, 'Mount Panorama', '/images/tracks/mount_panorama.jpg' FROM games WHERE name = 'Gran Turismo 7';

-- Layouts for Gran Turismo 7
INSERT INTO layouts (track_id, name, image_url)
SELECT t.id, 'Central Outer Loop', '/images/layouts/tokyo_outer.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Tokyo Expressway' AND g.name = 'Gran Turismo 7'
UNION ALL
SELECT t.id, 'Full Circuit', '/images/layouts/mount_panorama_full.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Mount Panorama' AND g.name = 'Gran Turismo 7';

-- Cars for Gran Turismo 7
INSERT INTO cars (name, image_url) VALUES
('Nissan GT-R Nismo GT3', '/images/cars/nissan_gtr_nismo_gt3.jpg'),
('Toyota Supra GT500', '/images/cars/toyota_supra_gt500.jpg'),
('Mazda RX-Vision GT3 Concept', '/images/cars/mazda_rx_vision_gt3.jpg');

-- iRacing tracks
INSERT INTO tracks (game_id, name, image_url)
SELECT id, 'Daytona', '/images/tracks/daytona.jpg' FROM games WHERE name = 'iRacing'
UNION ALL
SELECT id, 'Road America', '/images/tracks/road_america.jpg' FROM games WHERE name = 'iRacing';

-- Layouts for iRacing
INSERT INTO layouts (track_id, name, image_url)
SELECT t.id, 'Road Course', '/images/layouts/daytona_road.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Daytona' AND g.name = 'iRacing'
UNION ALL
SELECT t.id, 'Full Circuit', '/images/layouts/road_america_full.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Road America' AND g.name = 'iRacing';

-- Cars for iRacing
INSERT INTO cars (name, image_url) VALUES
('Dallara P217', '/images/cars/dallara_p217.jpg'),
('Ford GT GT3', '/images/cars/ford_gt_gt3.jpg'),
('BMW M4 GT3', '/images/cars/bmw_m4_gt3.jpg');

-- F1 23 tracks
INSERT INTO tracks (game_id, name, image_url)
SELECT id, 'Monaco', '/images/tracks/monaco.jpg' FROM games WHERE name = 'F1 23'
UNION ALL
SELECT id, 'Bahrain', '/images/tracks/bahrain.jpg' FROM games WHERE name = 'F1 23';

-- Layouts for F1 23
INSERT INTO layouts (track_id, name, image_url)
SELECT t.id, 'Grand Prix', '/images/layouts/monaco_gp.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Monaco' AND g.name = 'F1 23'
UNION ALL
SELECT t.id, 'Grand Prix', '/images/layouts/bahrain_gp.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Bahrain' AND g.name = 'F1 23';

-- Cars for F1 23
INSERT INTO cars (name, image_url) VALUES
('Mercedes W14', '/images/cars/mercedes_w14.jpg'),
('Red Bull RB19', '/images/cars/red_bull_rb19.jpg'),
('Ferrari SF-23', '/images/cars/ferrari_sf23.jpg');

-- Project CARS 3 tracks
INSERT INTO tracks (game_id, name, image_url)
SELECT id, 'Hockenheimring', '/images/tracks/hockenheimring.jpg' FROM games WHERE name = 'Project CARS 3'
UNION ALL
SELECT id, 'Imola', '/images/tracks/imola.jpg' FROM games WHERE name = 'Project CARS 3';

-- Layouts for Project CARS 3
INSERT INTO layouts (track_id, name, image_url)
SELECT t.id, 'GP Circuit', '/images/layouts/hockenheim_gp.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Hockenheimring' AND g.name = 'Project CARS 3'
UNION ALL
SELECT t.id, 'GP Circuit', '/images/layouts/imola_gp.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Imola' AND g.name = 'Project CARS 3';

-- Cars for Project CARS 3
INSERT INTO cars (name, image_url) VALUES
('Acura NSX GT3', '/images/cars/acura_nsx_gt3.jpg'),
('Audi R8 LMS GT3', '/images/cars/audi_r8_lms_gt3.jpg'),
('Ferrari 488 Challenge Evo', '/images/cars/ferrari_488_challenge_evo.jpg');

-- rFactor 2 tracks
INSERT INTO tracks (game_id, name, image_url)
SELECT id, 'Sebring', '/images/tracks/sebring.jpg' FROM games WHERE name = 'rFactor 2'
UNION ALL
SELECT id, 'Indianapolis', '/images/tracks/indianapolis.jpg' FROM games WHERE name = 'rFactor 2';

-- Layouts for rFactor 2
INSERT INTO layouts (track_id, name, image_url)
SELECT t.id, 'Full Circuit', '/images/layouts/sebring_full.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Sebring' AND g.name = 'rFactor 2'
UNION ALL
SELECT t.id, 'Road Course', '/images/layouts/indy_road.jpg' FROM tracks t
JOIN games g ON t.game_id = g.id WHERE t.name = 'Indianapolis' AND g.name = 'rFactor 2';

-- Cars for rFactor 2
INSERT INTO cars (name, image_url) VALUES
('Corvette C8.R', '/images/cars/corvette_c8r.jpg'),
('BMW M8 GTE', '/images/cars/bmw_m8_gte.jpg'),
('Oreca 07', '/images/cars/oreca_07.jpg');

-- Track layout mapping
INSERT INTO track_layouts (track_id, layout_id)
SELECT track_id, id FROM layouts;

INSERT INTO game_tracks (game_id, track_layout_id)
SELECT t.game_id, tl.id FROM track_layouts tl JOIN tracks t ON tl.track_id = t.id;

-- Map cars to games
INSERT INTO game_cars (game_id, car_id)
SELECT g.id, c.id FROM games g, cars c
WHERE g.name = 'Assetto Corsa' AND c.name IN ('Ferrari 488 GT3','McLaren MP4-12C GT3','BMW M3 E30','Porsche 911 GT3 R','Mercedes AMG GT3','Audi R8 LMS','Lamborghini Huracán GT3','Formula RSS 2 V6')
UNION ALL
SELECT g.id, c.id FROM games g, cars c
WHERE g.name = 'Assetto Corsa Competizione' AND c.name IN ('Ferrari 488 GT3 Evo','McLaren 720S GT3','Porsche 911 GT3 R','Mercedes AMG GT3')
UNION ALL
SELECT g.id, c.id FROM games g, cars c
WHERE g.name = 'Forza Motorsport' AND c.name IN ('Ford Mustang GT','Chevrolet Corvette C7.R','Porsche 911 GT3 Cup')
UNION ALL
SELECT g.id, c.id FROM games g, cars c
WHERE g.name = 'Gran Turismo 7' AND c.name IN ('Nissan GT-R Nismo GT3','Toyota Supra GT500','Mazda RX-Vision GT3 Concept')
UNION ALL
SELECT g.id, c.id FROM games g, cars c
WHERE g.name = 'iRacing' AND c.name IN ('Dallara P217','Ford GT GT3','BMW M4 GT3')
UNION ALL
SELECT g.id, c.id FROM games g, cars c
WHERE g.name = 'F1 23' AND c.name IN ('Mercedes W14','Red Bull RB19','Ferrari SF-23')
UNION ALL
SELECT g.id, c.id FROM games g, cars c
WHERE g.name = 'Project CARS 3' AND c.name IN ('Acura NSX GT3','Audi R8 LMS GT3','Ferrari 488 Challenge Evo')
UNION ALL
SELECT g.id, c.id FROM games g, cars c
WHERE g.name = 'rFactor 2' AND c.name IN ('Corvette C8.R','BMW M8 GTE','Oreca 07');
-- Create admin user (password: admin123)
INSERT INTO users (username, email, password_hash, is_admin) VALUES
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true);
-- Create sample regular user (password: user123)
INSERT INTO users (username, email, password_hash, is_admin) VALUES
('racer1', 'racer1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', false);

-- Default assists
INSERT INTO assists (name) VALUES
('Traction Control'),
('ABS'),
('Stability Control'),
('Auto Clutch'),
('Automatic Transmission'),
('Launch Control'),
('Brake Assist'),
('Throttle Assist'),
('Steering Assist'),
('Racing Line'),
('Suggested Gear Indicator'),
('Braking Indicator'),
('Cornering Guide'),
('Ghosting / Collision Off'),
('Tire Wear Off'),
('Fuel Usage Off'),
('Mechanical Failures Off'),
('Damage Off');
