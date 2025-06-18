const request = require('supertest');
const app = require('../server');

jest.mock('../utils/database', () => ({
  query: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('hashed')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'jwt'),
}));

const db = require('../utils/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Auth routes', () => {
  beforeEach(() => {
    db.query.mockReset();
    bcrypt.hash.mockClear();
    bcrypt.compare.mockClear();
    jwt.sign.mockClear();
  });

  it('registers a user', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1', username: 'test', email: 'a@b.co' }] });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test', email: 'a@b.co', password: 'secret' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBe('jwt');
    expect(db.query).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
  });

  it('logs in a user', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1', password_hash: 'hashed' }] });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@b.co', password: 'secret' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBe('jwt');
    expect(bcrypt.compare).toHaveBeenCalled();
  });

  it('rejects invalid login', async () => {
    db.query.mockResolvedValue({ rows: [] });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'x@y.co', password: 'bad' });
    expect(res.status).toBe(401);
  });
});
