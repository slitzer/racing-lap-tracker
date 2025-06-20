const request = require('supertest');
const app = require('../server');

describe('Version route', () => {
  it('returns app and db versions', async () => {
    const res = await request(app).get('/api/version');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('appVersion');
    expect(res.body).toHaveProperty('dbVersion');
  });
});
