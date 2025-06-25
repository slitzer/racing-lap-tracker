const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () => jest.fn((req, res, next) => { req.user = { id: 'u1' }; next(); }));

jest.mock('../utils/database', () => ({ query: jest.fn() }));

const db = require('../utils/database');

describe('Comment routes', () => {
  beforeEach(() => { db.query.mockReset(); });

  it('lists comments', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 'c1' }] });
    const res = await request(app).get('/api/lapTimes/lt1/comments');
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalled();
  });

  it('adds comment', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 'c2' }] });
    const res = await request(app)
      .post('/api/lapTimes/lt1/comments')
      .send({ content: 'Nice lap' });
    expect(res.status).toBe(201);
    expect(db.query).toHaveBeenCalled();
  });
});
