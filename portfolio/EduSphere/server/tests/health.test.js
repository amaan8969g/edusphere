const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
  test('GET /api/v1/health returns 200 and expected body', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('timestamp');
  });
});
