import app from '#src/app.js';
import request from 'supertest';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('upTime');
    });
  });

  describe('GET /api', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/api').expect(200);
      expect(response.body).toEqual({
        message: 'Welcome to the Acquistions API',
      });
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(app).get('/nonexistent').expect(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
