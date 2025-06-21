const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () => jest.fn((req, res, next) => {
  req.user = { id: 'user1' };
  next();
}));

jest.mock('../utils/database', () => ({
  query: jest.fn(),
}));

const db = require('../utils/database');

describe('Lap time routes', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('submits a lap time', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await request(app)
      .post('/api/lapTimes')
      .send({
        gameId: 'g1',
        trackLayoutId: 'tl1',
        carId: 'c1',
        inputType: 'Wheel',
        timeMs: 1234,
        lapDate: '2024-01-01',
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('1');
    expect(db.query).toHaveBeenCalled();
  });

  it('lists world records', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 'r1', notes: null }] });
    const res = await request(app).get('/api/lapTimes/records');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'r1', notes: null }]);
    expect(db.query).toHaveBeenCalled();
  });

  it('lists lap times with track and layout ids', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1', trackId: 't1', layoutId: 'l1' }] });
    const res = await request(app).get('/api/lapTimes');
    expect(res.status).toBe(200);
    expect(res.body[0].trackId).toBe('t1');
    expect(res.body[0].layoutId).toBe('l1');
    expect(db.query).toHaveBeenCalled();
  });
});
