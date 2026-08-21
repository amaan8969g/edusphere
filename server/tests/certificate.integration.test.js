const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

let mongoServer;
let token;
let userId;
let courseId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const user = await User.create({ name: 'Cert Student', email: 'cert@test.com', password: 'password123' });
  userId = user._id;

  token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'edusphere_jwt_secret_key_production_grade_998811', { expiresIn: '1h' });

  const category = await Category.create({ name: 'Web Dev', slug: 'web-dev', description: 'Web Dev' });

  const course = await Course.create({
    title: 'Fullstack JS',
    slug: 'fullstack-js',
    subtitle: 'Learn React & Node',
    description: 'Complete JS course',
    instructor: userId,
    category: category._id,
    level: 'Intermediate',
    price: 0,
    isPublished: true,
    status: 'published',
  });
  courseId = course._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  await Enrollment.deleteMany();
  await Certificate.deleteMany();
});

describe('Certificate API Integration Tests', () => {
  test('Fails to issue certificate if progress < 100%', async () => {
    await Enrollment.create({
      student: userId,
      course: courseId,
      progressPercentage: 50,
    });

    const res = await request(app)
      .get(`/api/v1/certificates/course/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/complete 100%/i);
  });

  test('Issues and returns certificate when course progress is 100%', async () => {
    await Enrollment.create({
      student: userId,
      course: courseId,
      progressPercentage: 100,
      isCompleted: true,
    });

    const res = await request(app)
      .get(`/api/v1/certificates/course/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('certificate');
    expect(res.body.data.certificate).toHaveProperty('certificateCode');
    expect(res.body.data.certificate.certificateCode).toMatch(/^EDU-/);
    expect(res.body.data.certificate).toHaveProperty('verificationHash');
  });

  test('Fetches earned user certificates via /my-certificates', async () => {
    await Enrollment.create({
      student: userId,
      course: courseId,
      progressPercentage: 100,
    });

    // Generate certificate
    await request(app)
      .get(`/api/v1/certificates/course/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .get('/api/v1/certificates/my-certificates')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results).toBe(1);
    expect(res.body.data.certificates[0]).toHaveProperty('certificateCode');
  });
});
