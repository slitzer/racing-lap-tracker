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
        trackId: 't1',
        layoutId: 'l1',
        carId: 'c1',
        inputType: 'Wheel',
        timeMs: 1234,
        lapDate: '2024-01-01',
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('1');
    expect(db.query).toHaveBeenCalled();
  });
});
