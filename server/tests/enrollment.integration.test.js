const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

let mongoServer;
let token;
let userId;
let courseId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create test user
  const user = await User.create({ name: 'Test Student', email: 'student@test.com', password: 'password123' });
  userId = user._id;

  // Sign JWT
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'edusphere_jwt_secret_key_production_grade_998811', { expiresIn: '1h' });

  // Create category
  const category = await Category.create({ name: 'Test', slug: 'test', description: 'Test category' });

  // Create published course
  const course = await Course.create({
    title: 'Demo Course',
    slug: 'demo-course',
    subtitle: 'Demo',
    description: 'Demo description',
    instructor: userId,
    category: category._id,
    level: 'Beginner',
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
});

describe('Enrollment Integration', () => {
  test('Enroll in a published course', async () => {
    const res = await request(app)
      .post(`/api/v1/enrollments/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data.enrollment).toHaveProperty('student');
    expect(res.body.data.enrollment.course).toEqual(String(courseId));

    // Ensure enrollment exists in DB
    const dbEnroll = await Enrollment.findOne({ student: userId, course: courseId });
    expect(dbEnroll).not.toBeNull();
  });

  test('Re-enrolling returns already enrolled message', async () => {
    // First enroll
    await Enrollment.create({ student: userId, course: courseId });

    const res = await request(app)
      .post(`/api/v1/enrollments/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/Already enrolled/i);
  });
});
