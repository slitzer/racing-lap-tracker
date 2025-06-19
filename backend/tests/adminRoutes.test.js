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
    db.query.mockResolvedValue({ rows: [{ id: '1', username: 'u1' }] });
    const res = await request(app).get('/api/admin/lapTimes/unverified');
    expect(res.status).toBe(200);
    expect(res.body[0].username).toBe('u1');
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
  it('creates a game', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await request(app)
      .post('/api/games')
      .send({ name: 'Test Game' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('1');
  });

  it('updates a track', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '2', name: 'Updated' }] });
    const res = await request(app)
      .put('/api/tracks/2')
      .send({ gameId: '1', name: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
  });

  it('deletes a car', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '3' }] });
    const res = await request(app).delete('/api/cars/3');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('3');
  });

  it('exports the database', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/admin/export');
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalledTimes(6);
  });

  it('imports the database', async () => {
    db.query.mockResolvedValue({});
    const res = await request(app)
      .post('/api/admin/import')
      .send({ users: [], games: [], tracks: [], layouts: [], cars: [], lap_times: [] });
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalled();
  });
});
