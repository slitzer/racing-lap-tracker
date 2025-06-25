const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () => jest.fn((req, res, next) => { req.user = { id: 'u1' }; next(); }));

jest.mock('../utils/database', () => ({ query: jest.fn() }));

const db = require('../utils/database');

describe('Follow routes', () => {
  beforeEach(() => { db.query.mockReset(); });

  it('follow a user', async () => {
    db.query.mockResolvedValue({});
    const res = await request(app).post('/api/users/u2/follow');
    expect(res.status).toBe(204);
    expect(db.query).toHaveBeenCalled();
  });

  it('unfollow a user', async () => {
    db.query.mockResolvedValue({});
    const res = await request(app).delete('/api/users/u2/follow');
    expect(res.status).toBe(204);
    expect(db.query).toHaveBeenCalled();
  });

  it('check following', async () => {
    db.query.mockResolvedValue({ rows: [] });
    const res = await request(app).get('/api/users/u2/follow');
    expect(res.status).toBe(200);
    expect(res.body.isFollowing).toBe(false);
  });
});
