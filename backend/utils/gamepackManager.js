const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function ensureLayouts(trackDir, log) {
  const layoutDirs = [];
  const layoutsRoot = path.join(trackDir, 'layouts');
  if (fs.existsSync(layoutsRoot)) {
    for (const d of fs.readdirSync(layoutsRoot, { withFileTypes: true })) {
      if (d.isDirectory()) layoutDirs.push(path.join(layoutsRoot, d.name));
    }
  }
  for (const d of fs.readdirSync(trackDir, { withFileTypes: true })) {
    if (d.isDirectory() && d.name !== 'layouts') {
      const legacy = path.join(trackDir, d.name, 'layout.json');
      if (fs.existsSync(legacy)) {
        if (!fs.existsSync(layoutsRoot)) fs.mkdirSync(layoutsRoot);
        const dest = path.join(layoutsRoot, d.name);
        fs.renameSync(path.join(trackDir, d.name), dest);
        log.moves.push(`${path.join(trackDir, d.name)} -> ${dest}`);
        layoutDirs.push(dest);
      }
    }
  }
  return layoutDirs;
}

function scanFolder(rootDir) {
  const log = { games: [], moves: [], warnings: [] };
  if (!fs.existsSync(rootDir)) {
    log.warnings.push(`Input directory not found: ${rootDir}`);
    return log;
  }
  const games = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());
  for (const g of games) {
    const gameDir = path.join(rootDir, g.name);
    const gameFile = path.join(gameDir, 'game.json');
    const game = readJSON(gameFile);
    if (!game) {
      log.warnings.push(`Missing game.json for ${g.name}`);
      continue;
    }
    writeJSON(gameFile, game);
    const entry = { name: game.name || g.name, tracks: 0, layouts: 0, cars: 0 };
    const tracksDir = path.join(gameDir, 'tracks');
    if (fs.existsSync(tracksDir)) {
      const tracks = fs
        .readdirSync(tracksDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const t of tracks) {
        const trackDir = path.join(tracksDir, t.name);
        const trackFile = path.join(trackDir, 'track.json');
        const track = readJSON(trackFile);
        if (!track) {
          log.warnings.push(`Missing track.json for ${t.name}`);
          continue;
        }
        writeJSON(trackFile, track);
        entry.tracks += 1;
        const layoutDirs = ensureLayouts(trackDir, log);
        for (const ld of layoutDirs) {
          const layoutFile = path.join(ld, 'layout.json');
          const layout = readJSON(layoutFile);
          if (!layout) {
            log.warnings.push(`Missing layout.json for ${ld}`);
            continue;
          }
          writeJSON(layoutFile, layout);
          entry.layouts += 1;
        }
      }
    }
    const carsDir = path.join(gameDir, 'cars');
    if (fs.existsSync(carsDir)) {
      const cars = fs
        .readdirSync(carsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const c of cars) {
        const carDir = path.join(carsDir, c.name);
        const carFile = path.join(carDir, 'car.json');
        const car = readJSON(carFile);
        if (!car) {
          log.warnings.push(`Missing car.json for ${c.name}`);
          continue;
        }
        writeJSON(carFile, car);
        entry.cars += 1;
      }
    }
    log.games.push(entry);
  }
  return log;
}

function createZip(src, out) {
  const zip = new AdmZip();
  zip.addLocalFolder(src);
  zip.writeZip(out);
}

function main() {
  const input = process.argv[2] || path.join(__dirname, '..', '..', 'frontend', 'public', 'GamePack');
  const output = process.argv[3] || path.join(process.cwd(), 'GamePack.zip');
  const report = scanFolder(input);
  const logFile = path.join(process.cwd(), 'gamepack.log');
  fs.writeFileSync(logFile, JSON.stringify(report, null, 2));
  console.log('Scan summary:');
  for (const g of report.games) {
    console.log(`- ${g.name}: ${g.tracks} tracks, ${g.layouts} layouts, ${g.cars} cars`);
  }
  if (report.moves.length) {
    console.log('\nMoved legacy layout folders:');
    report.moves.forEach((m) => console.log(`  ${m}`));
  }
  if (report.warnings.length) {
    console.log('\nWarnings:');
    report.warnings.forEach((w) => console.log(`  ${w}`));
  }
  createZip(input, output);
  console.log(`\nCreated GamePack archive at ${output}`);
  console.log(`Log written to ${logFile}`);
}

if (require.main === module) {
  main();
}
