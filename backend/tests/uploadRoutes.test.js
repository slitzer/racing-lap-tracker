const request = require('supertest');
const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('../middleware/auth', () =>
  jest.fn((req, res, next) => {
    req.user = { id: 'user1' };
    next();
  })
);

let app;
let tmpDir;

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uploads-'));
  process.env.UPLOAD_DIR = tmpDir;
  process.env.NODE_ENV = 'test';
  app = require('../server');
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

beforeEach(() => {
  for (const file of fs.readdirSync(tmpDir)) {
    fs.rmSync(path.join(tmpDir, file));
  }
});

describe('Upload routes', () => {
  it('uploads a valid image', async () => {
    const pngBuffer = Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000002000100057ff2d80000000049454e44ae426082',
      'hex'
    );

    const res = await request(app)
      .post('/api/uploads')
      .attach('file', pngBuffer, 'test.png');

    expect(res.status).toBe(200);
    expect(res.body.url).toMatch(/^\/uploads\/.*\.png$/);

    const storedPath = path.join(tmpDir, path.basename(res.body.url));
    expect(fs.existsSync(storedPath)).toBe(true);
  });

  it('rejects invalid file type', async () => {
    const beforeFiles = fs.readdirSync(tmpDir).length;

    const res = await request(app)
      .post('/api/uploads')
      .attach('file', Buffer.from('hello'), 'test.txt');

    expect(res.status).toBe(400);

    const afterFiles = fs.readdirSync(tmpDir).length;
    expect(afterFiles).toBe(beforeFiles);
  });
});
