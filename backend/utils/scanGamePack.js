const fs = require('fs');
const path = require('path');
const db = require('./database');

const gamePackDir = path.resolve(
  process.env.GAMEPACK_DIR ||
    path.join(__dirname, '..', '..', 'frontend', 'public', 'GamePack')
);

// Convert loose boolean values to strict true/false or null
function parseBoolean(val) {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase();
    if (['true', '1', 'yes', 'on', 'sant'].includes(v)) return true;
    if (['false', '0', 'no', 'off', 'falskt'].includes(v)) return false;
  }
  return null;
}

async function upsertGame(data) {
  const res = await db.query(
    'INSERT INTO games (name, image_url) VALUES ($1,$2) ON CONFLICT (name) DO UPDATE SET image_url=EXCLUDED.image_url RETURNING id',
    [data.name, data.imageUrl || null]
  );
  return res.rows[0].id;
}

async function upsertTrack(gameId, data) {
  const tags = data.tags ? JSON.stringify(data.tags) : null;
  const additionalImages = data.media?.additionalImages
    ? JSON.stringify(data.media.additionalImages)
    : null;
  const res = await db.query(
    `INSERT INTO tracks (
      game_id,
      name,
      image_url,
      description,
      official_name,
      country,
      city,
      game_pack,
      dlc,
      tags,
      latitude,
      longitude,
      video_url,
      length_m,
      width_m,
      turns,
      pit_boxes,
      pit_speed_limit_kph,
      is_clockwise,
      altitude_m,
      timezone_offset,
      default_month,
      default_day,
      grade,
      track_type,
      surface_type,
      climate_zone,
      lighting,
      has_rain_support,
      ai_max,
      logo_url,
      additional_images
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32
    ) ON CONFLICT (game_id, name) DO UPDATE SET
      image_url=EXCLUDED.image_url,
      description=EXCLUDED.description,
      official_name=EXCLUDED.official_name,
      country=EXCLUDED.country,
      city=EXCLUDED.city,
      game_pack=EXCLUDED.game_pack,
      dlc=EXCLUDED.dlc,
      tags=EXCLUDED.tags,
      latitude=EXCLUDED.latitude,
      longitude=EXCLUDED.longitude,
      video_url=EXCLUDED.video_url,
      length_m=EXCLUDED.length_m,
      width_m=EXCLUDED.width_m,
      turns=EXCLUDED.turns,
      pit_boxes=EXCLUDED.pit_boxes,
      pit_speed_limit_kph=EXCLUDED.pit_speed_limit_kph,
      is_clockwise=EXCLUDED.is_clockwise,
      altitude_m=EXCLUDED.altitude_m,
      timezone_offset=EXCLUDED.timezone_offset,
      default_month=EXCLUDED.default_month,
      default_day=EXCLUDED.default_day,
      grade=EXCLUDED.grade,
      track_type=EXCLUDED.track_type,
      surface_type=EXCLUDED.surface_type,
      climate_zone=EXCLUDED.climate_zone,
      lighting=EXCLUDED.lighting,
      has_rain_support=EXCLUDED.has_rain_support,
      ai_max=EXCLUDED.ai_max,
      logo_url=EXCLUDED.logo_url,
      additional_images=EXCLUDED.additional_images
      RETURNING id`,
    [
      gameId,
      data.name,
      data.media?.imageUrl || data.imageUrl || null,
      data.description || null,
      data.officialName || null,
      data.country || null,
      data.city || null,
      data.gamePack || null,
      data.dlc || null,
      tags,
      data.geotags?.latitude || null,
      data.geotags?.longitude || null,
      data.videoUrl || null,
      data.specs?.lengthM || null,
      data.specs?.widthM || null,
      data.specs?.turns || null,
      data.specs?.pitBoxes || null,
      data.specs?.pitSpeedLimitKPH || null,
      parseBoolean(data.specs?.isClockwise),
      data.specs?.altitudeM || null,
      data.specs?.timezoneOffset || null,
      data.specs?.defaultMonth || null,
      data.specs?.defaultDay || null,
      data.specs?.grade || null,
      data.specs?.trackType || null,
      data.specs?.surfaceType || null,
      data.specs?.climateZone || null,
      parseBoolean(data.specs?.lighting),
      parseBoolean(data.specs?.hasRainSupport),
      data.specs?.aiMax || null,
      data.media?.logoUrl || null,
      additionalImages,
    ]
  );
  return res.rows[0].id;
}

async function upsertLayout(trackId, data) {
  const res = await db.query(
    'INSERT INTO layouts (track_id, name, image_url) VALUES ($1,$2,$3) ON CONFLICT (track_id, name) DO UPDATE SET image_url=EXCLUDED.image_url RETURNING id',
    [trackId, data.name, data.layoutImageUrl || data.imageUrl || null]
  );
  const layoutId = res.rows[0].id;
  const tl = await db.query(
    `INSERT INTO track_layouts (
      track_id,
      layout_id,
      pit_speed_limit_high_kph,
      max_ai_participants,
      race_date_year,
      race_date_month,
      race_date_day,
      track_surface,
      track_type,
      track_grade_filter,
      number_of_turns,
      track_time_zone,
      track_altitude,
      length,
      dlc_id,
      location,
      length_m,
      is_clockwise
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
    ) ON CONFLICT (track_id, layout_id)
      DO UPDATE SET track_id=EXCLUDED.track_id RETURNING id`,
    [
      trackId,
      layoutId,
      data.pitSpeedLimitHighKPH || null,
      data.maxAIParticipants || null,
      data.raceDateYear || null,
      data.raceDateMonth || null,
      data.raceDateDay || null,
      data.trackSurface || null,
      data.trackType || null,
      data.trackGradeFilter || null,
      data.numberOfTurns || null,
      data.trackTimeZone || null,
      data.trackAltitude || null,
      data.length || null,
      data.dlcId || null,
      data.location || null,
      data.lengthM || null,
      parseBoolean(data.isClockwise),
    ]
  );
  return tl.rows[0].id;
}

async function upsertCar(gameId, data) {
  const imageUrl = data.media?.imageUrl || data.imageUrl || null;
  const additionalImages = data.media?.additionalImages
    ? JSON.stringify(data.media.additionalImages)
    : null;
  const res = await db.query(
    `INSERT INTO cars (
      name,
      image_url,
      manufacturer,
      model,
      year,
      class,
      series,
      game_pack,
      dlc,
      power_hp,
      torque_nm,
      weight_kg,
      top_speed_kph,
      acceleration_0_100,
      braking_distance_100_0,
      mass_distribution,
      engine,
      fuel_type,
      drivetrain,
      gearbox,
      input_type_car,
      is_electric,
      headlights,
      ers,
      abs,
      tc,
      additional_images
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
    ) ON CONFLICT (name) DO UPDATE SET
      image_url=EXCLUDED.image_url,
      manufacturer=EXCLUDED.manufacturer,
      model=EXCLUDED.model,
      year=EXCLUDED.year,
      class=EXCLUDED.class,
      series=EXCLUDED.series,
      game_pack=EXCLUDED.game_pack,
      dlc=EXCLUDED.dlc,
      power_hp=EXCLUDED.power_hp,
      torque_nm=EXCLUDED.torque_nm,
      weight_kg=EXCLUDED.weight_kg,
      top_speed_kph=EXCLUDED.top_speed_kph,
      acceleration_0_100=EXCLUDED.acceleration_0_100,
      braking_distance_100_0=EXCLUDED.braking_distance_100_0,
      mass_distribution=EXCLUDED.mass_distribution,
      engine=EXCLUDED.engine,
      fuel_type=EXCLUDED.fuel_type,
      drivetrain=EXCLUDED.drivetrain,
      gearbox=EXCLUDED.gearbox,
      input_type_car=EXCLUDED.input_type_car,
      is_electric=EXCLUDED.is_electric,
      headlights=EXCLUDED.headlights,
      ers=EXCLUDED.ers,
      abs=EXCLUDED.abs,
      tc=EXCLUDED.tc,
      additional_images=EXCLUDED.additional_images
      RETURNING id`,
    [
      data.name,
      imageUrl,
      data.manufacturer || null,
      data.model || null,
      data.year || null,
      data.class || null,
      data.series || null,
      data.gamePack || null,
      data.dlc || null,
      data.specs?.powerHP || null,
      data.specs?.torqueNM || null,
      data.specs?.weightKG || null,
      data.specs?.topSpeedKPH || null,
      data.specs?.acceleration0to100 || null,
      data.specs?.brakingDistance100to0 || null,
      data.specs?.massDistribution || null,
      data.specs?.engine || null,
      data.specs?.fuelType || null,
      data.specs?.drivetrain || null,
      data.specs?.gearbox || null,
      data.specs?.inputType || null,
      parseBoolean(data.specs?.isElectric),
      parseBoolean(data.specs?.headlights),
      parseBoolean(data.specs?.ers),
      parseBoolean(data.specs?.abs),
      parseBoolean(data.specs?.tc),
      additionalImages,
    ]
  );
  const carId = res.rows[0].id;
  await db.query(
    'INSERT INTO game_cars (game_id, car_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [gameId, carId]
  );
  return carId;
}

function safeReadJSON(file) {
  try {
    const txt = fs.readFileSync(file, 'utf8');
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

async function scanGamePack() {
  const summary = { games: 0, tracks: 0, layouts: 0, cars: 0 };
  if (!fs.existsSync(gamePackDir)) return summary;
  const games = fs
    .readdirSync(gamePackDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());
  for (const g of games) {
    const gameDir = path.join(gamePackDir, g.name);
    const gameJson = safeReadJSON(path.join(gameDir, 'game.json'));
    if (!gameJson) continue;
    const gameId = await upsertGame(gameJson);
    summary.games += 1;
    const tracksDir = path.join(gameDir, 'tracks');
    if (fs.existsSync(tracksDir)) {
      const tFolders = fs
        .readdirSync(tracksDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const t of tFolders) {
        const tJson = safeReadJSON(path.join(tracksDir, t.name, 'track.json'));
        if (!tJson) continue;
        const trackId = await upsertTrack(gameId, tJson);
        summary.tracks += 1;
        const trackDir = path.join(tracksDir, t.name);
        const layoutsDir = path.join(trackDir, 'layouts');

        const layoutFolders = new Set();
        if (fs.existsSync(layoutsDir)) {
          fs
            .readdirSync(layoutsDir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .forEach((d) => layoutFolders.add(path.join(layoutsDir, d.name)));
        }

        fs
          .readdirSync(trackDir, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .forEach((d) => {
            const lp = path.join(trackDir, d.name, 'layout.json');
            if (fs.existsSync(lp)) layoutFolders.add(path.join(trackDir, d.name));
          });

        for (const lPath of layoutFolders) {
          const lJson = safeReadJSON(path.join(lPath, 'layout.json'));
          if (!lJson) continue;
          const tlId = await upsertLayout(trackId, lJson);
          await db.query(
            'INSERT INTO game_tracks (game_id, track_layout_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
            [gameId, tlId]
          );
          summary.layouts += 1;
        }
      }
    }
    const carsDir = path.join(gameDir, 'cars');
    if (fs.existsSync(carsDir)) {
      const cFolders = fs
        .readdirSync(carsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const c of cFolders) {
        const cJson = safeReadJSON(path.join(carsDir, c.name, 'car.json'));
        if (!cJson) continue;
        await upsertCar(gameId, cJson);
        summary.cars += 1;
      }
    }
  }
  return summary;
}

module.exports = { scanGamePack };
