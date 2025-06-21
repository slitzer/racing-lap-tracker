const fs = require('fs');
const path = require('path');

const contentDir = path.resolve(
  process.env.CONTENT_DIR ||
    path.join(__dirname, '..', '..', 'frontend', 'public', 'content')
);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function sanitize(name) {
  return name
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function writeMarkdown(sub, filename, data) {
  if (!filename) throw new Error('filename required');
  const dir = path.join(contentDir, sub);
  ensureDir(dir);
  const file = path.join(dir, `${sanitize(filename)}.md`);
  fs.writeFileSync(file, data || '', 'utf8');
  return path.relative(contentDir, file).replace(/\\/g, '/');
}

function readMarkdown(relPath) {
  if (!relPath) return null;
  const file = path.join(contentDir, relPath);
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

module.exports = { contentDir, writeMarkdown, readMarkdown };
