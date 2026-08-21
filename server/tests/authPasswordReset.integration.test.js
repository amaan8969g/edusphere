const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoServer) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany();
});

describe('Forgot & Reset Password Integration Tests', () => {
  test('Generates reset token for valid registered user email', async () => {
    await User.create({
      name: 'Reset Test User',
      email: 'reset.user@example.com',
      password: 'password123',
      role: 'student',
    });

    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'reset.user@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body).toHaveProperty('resetToken');
    expect(typeof res.body.resetToken).toBe('string');
  });

  test('Fails to generate reset token for unregistered email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'nonexistent@example.com' });

    expect(res.statusCode).toBe(404);
  });

  test('Resets password with valid token and allows login with new password', async () => {
    await User.create({
      name: 'Reset Flow User',
      email: 'reset.flow@example.com',
      password: 'oldpassword123',
      role: 'student',
    });

    // Request forgot password
    const forgotRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'reset.flow@example.com' });

    const token = forgotRes.body.resetToken;

    // Reset password with token
    const resetRes = await request(app)
      .patch(`/api/v1/auth/reset-password/${token}`)
      .send({ password: 'newpassword456' });

    expect(resetRes.statusCode).toBe(200);
    expect(resetRes.body.status).toBe('success');
    expect(resetRes.body).toHaveProperty('token');

    // Verify login works with new password
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'reset.flow@example.com', password: 'newpassword456' });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.status).toBe('success');
  });
});
