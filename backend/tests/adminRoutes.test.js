const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () =>
  jest.fn((req, res, next) => {
    req.user = { id: 'admin' };
    next();
  })
);
jest.mock('../middleware/admin', () => jest.fn((req, res, next) => next()));

jest.mock('../utils/database', () => ({
  query: jest.fn(),
  pool: { connect: jest.fn() },
}));

const db = require('../utils/database');

describe('Admin routes', () => {
  const mockClient = { query: jest.fn(), release: jest.fn() };

  beforeEach(() => {
    db.query.mockReset();
    db.pool.connect.mockResolvedValue(mockClient);
    mockClient.query.mockReset();
    mockClient.release.mockReset();
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
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/admin/export');
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalledTimes(11);
  });

  it('imports the database', async () => {
    mockClient.query.mockResolvedValue({});

    const res = await request(app)
      .post('/api/admin/import')
      .send({
        users: [],
        games: [],
        tracks: [],
        layouts: [],
        track_layouts: [
          { id: 'tl1', track_id: 't1', layout_id: 'l1' },
        ],
        game_tracks: [
          { game_id: 'g1', track_layout_id: 'tl1' },
        ],
        cars: [
          {
            id: 'c1',
            name: 'Car 1',
            image_url: '/img.png',
            created_at: '2024-01-01',
            updated_at: '2024-01-02',
          },
        ],
        game_cars: [
          { game_id: 'g1', car_id: 'c1' },
        ],
        lap_times: [],
      });

    expect(res.status).toBe(200);
    expect(db.pool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO track_layouts (id, track_id, layout_id) VALUES ($1,$2,$3)',
      ['tl1', 't1', 'l1']
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO game_tracks (game_id, track_layout_id) VALUES ($1,$2)',
      ['g1', 'tl1']
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO cars (id, name, image_url, created_at, updated_at) VALUES ($1,$2,$3,$4,$5)',
      ['c1', 'Car 1', '/img.png', '2024-01-01', '2024-01-02']
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO game_cars (game_id, car_id) VALUES ($1,$2)',
      ['g1', 'c1']
    );
    expect(mockClient.query).toHaveBeenLastCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('export followed by import preserves mappings', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 'u1' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'g1' }] })
      .mockResolvedValueOnce({ rows: [{ id: 't1', game_id: 'g1' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'l1', track_id: 't1' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'tl1', track_id: 't1', layout_id: 'l1' }] })
      .mockResolvedValueOnce({ rows: [{ game_id: 'g1', track_layout_id: 'tl1' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'c1' }] })
      .mockResolvedValueOnce({ rows: [{ game_id: 'g1', car_id: 'c1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const exportRes = await request(app).get('/api/admin/export');
    expect(exportRes.status).toBe(200);

    db.pool.connect.mockResolvedValue(mockClient);
    mockClient.query.mockReset();
    mockClient.query.mockResolvedValue({});

    const res = await request(app).post('/api/admin/import').send(exportRes.body);

    expect(res.status).toBe(200);
    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO track_layouts (id, track_id, layout_id) VALUES ($1,$2,$3)',
      ['tl1', 't1', 'l1']
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO game_tracks (game_id, track_layout_id) VALUES ($1,$2)',
      ['g1', 'tl1']
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO game_cars (game_id, car_id) VALUES ($1,$2)',
      ['g1', 'c1']
    );
  });
});
