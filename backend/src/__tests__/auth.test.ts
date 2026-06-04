import request from 'supertest';
import { app } from '../app';

describe('Auth API', () => {
  it('logs in demo admin', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'Admin@123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });
});
