const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () => jest.fn((req, res, next) => { req.user = { id: 'admin' }; next(); }));
jest.mock('../middleware/admin', () => jest.fn((req, res, next) => next()));

jest.mock('../scrapers/scrapeInfo', () => ({
  fetchWikipediaInfo: jest.fn(),
}));

const { fetchWikipediaInfo } = require('../scrapers/scrapeInfo');

describe('Admin search route', () => {
  beforeEach(() => {
    fetchWikipediaInfo.mockReset();
  });

  it('returns info for a title', async () => {
    fetchWikipediaInfo.mockResolvedValue({ title: 'Monza', description: 'd', imageUrl: 'img' });
    const res = await request(app).get('/api/admin/search?title=Monza');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Monza');
    expect(fetchWikipediaInfo).toHaveBeenCalledWith('Monza');
  });

  it('requires title query', async () => {
    const res = await request(app).get('/api/admin/search');
    expect(res.status).toBe(400);
  });
});
