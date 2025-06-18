const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () => jest.fn((req, res, next) => { req.user = { id: 'admin' }; next(); }));
jest.mock('../middleware/admin', () => jest.fn((req, res, next) => next()));

jest.mock('../utils/database', () => ({
  query: jest.fn(),
}));

const db = require('../utils/database');

describe('Admin routes', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('lists unverified lap times', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await request(app).get('/api/admin/lapTimes/unverified');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1' }]);
    expect(db.query).toHaveBeenCalled();
  });

  it('verifies a lap time', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1', verified: true }] });
    const res = await request(app).put('/api/admin/lapTimes/1/verify');
    expect(res.status).toBe(200);
    expect(res.body.verified).toBe(true);
  });

  it('deletes a lap time', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await request(app).delete('/api/admin/lapTimes/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('1');
  });
});
