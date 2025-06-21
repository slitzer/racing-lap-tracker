const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () => jest.fn((req, res, next) => { req.user = { id: 'u1' }; next(); }));

jest.mock('../utils/database', () => ({ query: jest.fn() }));

const db = require('../utils/database');

describe('User routes', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('updates profile', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 'u1', username: 'test', email: 'a@b.c', is_admin: false, avatar_url: '/uploads/a.jpg' }] });
    const res = await request(app).put('/api/users/me').send({ avatarUrl: '/uploads/a.jpg' });
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalled();
    expect(res.body.avatar_url).toBe('/uploads/a.jpg');
  });

  it('returns user stats', async () => {
    db.query.mockResolvedValue({ rows: [{ lap_count: '3', best_lap_ms: 1000, avg_lap_ms: 1500 }] });
    const res = await request(app).get('/api/users/me/stats');
    expect(res.status).toBe(200);
    expect(res.body.lapCount).toBe(3);
    expect(db.query).toHaveBeenCalled();
  });
});
