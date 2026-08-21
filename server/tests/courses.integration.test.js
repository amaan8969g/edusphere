const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

let mongoServer;
let userId;
let categoryA;
let categoryB;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create test user
  const user = await User.create({ name: 'Course Owner', email: 'owner@test.com', password: 'password123' });
  userId = user._id;

  // Create categories
  categoryA = await Category.create({ name: 'Web', slug: 'web', description: 'Web Dev' });
  categoryB = await Category.create({ name: 'Data', slug: 'data', description: 'Data Science' });

  // Create courses
  const coursesData = [
    { title: 'JS Basics', slug: 'js-basics', description: 'Learn JS', instructor: userId, category: categoryA._id, level: 'Beginner', price: 0, isPublished: true, status: 'published' },
    { title: 'Advanced JS', slug: 'advanced-js', description: 'Deep JS', instructor: userId, category: categoryA._id, level: 'Advanced', price: 50, isPublished: true, status: 'published' },
    { title: 'Intro to Python', slug: 'python-intro', description: 'Python basics', instructor: userId, category: categoryB._id, level: 'Beginner', price: 0, isPublished: true, status: 'published' },
    { title: 'Data Science Pro', slug: 'ds-pro', description: 'DS', instructor: userId, category: categoryB._id, level: 'Intermediate', price: 100, isPublished: false, status: 'draft' },
    { title: 'React for Beginners', slug: 'react-beg', description: 'React course', instructor: userId, category: categoryA._id, level: 'Beginner', price: 0, isPublished: true, status: 'published' },
  ];

  await Course.insertMany(coursesData);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe('Courses GET /api/v1/courses', () => {
  test('returns only published courses by default', async () => {
    const res = await request(app).get('/api/v1/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('results');
    // one course is not published, so total published should be 4
    expect(res.body.totalResults).toBe(4);
    expect(res.body.results).toBe(4);
  });

  test('search by text', async () => {
    const res = await request(app).get('/api/v1/courses').query({ search: 'Python' });
    expect(res.statusCode).toBe(200);
    expect(res.body.totalResults).toBe(1);
    expect(res.body.data.courses[0].title).toMatch(/Python/i);
  });

  test('filter by category', async () => {
    const res = await request(app).get('/api/v1/courses').query({ category: String(categoryB._id) });
    expect(res.statusCode).toBe(200);
    // categoryB has 1 published course (python-intro), ds-pro is unpublished
    expect(res.body.totalResults).toBe(1);
    expect(res.body.data.courses[0].category._id).toBe(String(categoryB._id));
  });

  test('filter by level', async () => {
    const res = await request(app).get('/api/v1/courses').query({ level: 'Beginner' });
    expect(res.statusCode).toBe(200);
    // JS Basics, Intro to Python, React for Beginners => 3
    expect(res.body.totalResults).toBe(3);
  });

  test('filter by price free/paid', async () => {
    const freeRes = await request(app).get('/api/v1/courses').query({ price: 'free' });
    expect(freeRes.statusCode).toBe(200);
    expect(freeRes.body.totalResults).toBe(3);

    const paidRes = await request(app).get('/api/v1/courses').query({ price: 'paid' });
    expect(paidRes.statusCode).toBe(200);
    // Advanced JS is paid (50) => 1
    expect(paidRes.body.totalResults).toBe(1);
  });

  test('pagination works', async () => {
    // page 1 limit 2
    const p1 = await request(app).get('/api/v1/courses').query({ page: 1, limit: 2 });
    expect(p1.statusCode).toBe(200);
    expect(p1.body.page).toBe(1);
    expect(p1.body.results).toBe(2);
    expect(p1.body.totalPages).toBe(Math.ceil(4 / 2));

    // page 2
    const p2 = await request(app).get('/api/v1/courses').query({ page: 2, limit: 2 });
    expect(p2.statusCode).toBe(200);
    expect(p2.body.page).toBe(2);
    expect(p2.body.results).toBe(2);
  });
});
