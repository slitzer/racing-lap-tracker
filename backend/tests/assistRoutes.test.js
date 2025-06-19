const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () => jest.fn((req, res, next) => { req.user = { id: 'admin' }; next(); }));
jest.mock('../middleware/admin', () => jest.fn((req, res, next) => next()));

jest.mock('../utils/database', () => ({
  query: jest.fn(),
}));

const db = require('../utils/database');

describe('Assist routes', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('lists assists', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 'a1', name: 'TC' }] });
    const res = await request(app).get('/api/assists');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('TC');
  });
});
