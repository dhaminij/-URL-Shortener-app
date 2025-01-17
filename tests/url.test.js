const request = require('supertest');
const app = require('../src/app');

describe('Advanced URL Shortener API', () => {
  let token;

  beforeAll(async () => {
    // Mock user authentication
    const res = await request(app)
      .get('/auth/google/callback')
      .set('Authorization', 'Bearer mock-token');
    token = res.body.token || 'mock-token';
  });

  it('should create a short URL', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({
        longUrl: 'https://example.com',
        customAlias: 'testalias',
        topic: 'testing',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.shortUrl).toBeDefined();
  });

  it('should redirect to the original URL', async () => {
    const res = await request(app).get('/api/shorten/testalias');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://example.com');
  });

  it('should get analytics for a specific short URL', async () => {
    const res = await request(app)
      .get('/api/analytics/testalias')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalClicks).toBeDefined();
  });

  it('should get topic-based analytics', async () => {
    const res = await request(app)
      .get('/api/analytics/topic/testing')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalClicks).toBeDefined();
  });

  it('should get overall analytics', async () => {
    const res = await request(app)
      .get('/api/analytics/overall')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalUrls).toBeDefined();
  });
});
