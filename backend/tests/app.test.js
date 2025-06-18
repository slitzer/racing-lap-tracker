const request = require('supertest');
const app = require('../server');

describe('App', () => {
  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});
