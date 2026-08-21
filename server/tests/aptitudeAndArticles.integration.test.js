const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');

const User = require('../models/User');
const jwt = require('jsonwebtoken');

let mongoServer;
let studentToken;
let studentId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const student = await User.create({
    name: 'Learner One',
    email: 'learner@test.com',
    password: 'password123',
    role: 'student',
  });
  studentId = student._id;
  studentToken = jwt.sign({ id: studentId, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe('Aptitude Quizzes & Informative Articles API Integration Tests', () => {
  test('Fetches auto-seeded aptitude quizzes list', async () => {
    const res = await request(app)
      .get('/api/v1/quizzes/aptitude')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results).toBe(4); // Verbal, Logical, Arithmetic, Quant
  });

  test('Fetches specific aptitude category quiz (Verbal Ability)', async () => {
    const res = await request(app)
      .get('/api/v1/quizzes/aptitude/verbal-ability')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.quiz.aptitudeCategory).toBe('verbal-ability');
    expect(res.body.data.quiz.questions.length).toBeGreaterThan(0);
  });

  test('Submits aptitude quiz attempt with security metrics', async () => {
    const quizRes = await request(app)
      .get('/api/v1/quizzes/aptitude/verbal-ability')
      .set('Authorization', `Bearer ${studentToken}`);

    const quizId = quizRes.body.data.quiz._id;

    const submitRes = await request(app)
      .post(`/api/v1/quizzes/${quizId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        answers: [
          { questionIndex: 0, selectedOption: 1 },
          { questionIndex: 1, selectedOption: 1 },
        ],
        tabSwitchesCount: 1,
        timeSpentSeconds: 145,
        autoSubmitted: false,
      });

    expect(submitRes.statusCode).toBe(200);
    expect(submitRes.body.data.attempt.tabSwitchesCount).toBe(1);
    expect(submitRes.body.data.attempt.timeSpentSeconds).toBe(145);
  });

  test('Fetches informative articles list', async () => {
    const res = await request(app).get('/api/v1/articles');

    expect(res.statusCode).toBe(200);
    expect(res.body.results).toBeGreaterThan(0);
  });

  test('Fetches single article details by slug', async () => {
    const listRes = await request(app).get('/api/v1/articles');
    const firstSlug = listRes.body.data.articles[0].slug;

    const res = await request(app).get(`/api/v1/articles/${firstSlug}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.article.slug).toBe(firstSlug);
    expect(res.body.data.article.views).toBeGreaterThan(0);
  });
});
