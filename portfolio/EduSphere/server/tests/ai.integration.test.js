const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

const User = require('../models/User');
const AIConversation = require('../models/AIConversation');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const user = await User.create({ name: 'AI Learner', email: 'ai@test.com', password: 'password123' });
  userId = user._id;

  token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'edusphere_jwt_secret_key_production_grade_998811', { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  await AIConversation.deleteMany();
});

describe('AI API Integration Tests', () => {
  test('Ask AI tutor endpoint returns contextual response', async () => {
    const res = await request(app)
      .post('/api/v1/ai/ask')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question: 'Explain JWT authentication in Node.js',
        lessonTitle: 'Stateless Auth',
        courseTitle: 'Node.js Masterclass',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('answer');
    expect(res.body.data.answer).toMatch(/JWT/i);
    expect(res.body.data).toHaveProperty('suggestedFollowUps');
  });

  test('Saves and retrieves AI conversation logs', async () => {
    const saveRes = await request(app)
      .post('/api/v1/ai/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        lessonTitle: 'React State',
        courseTitle: 'React 18 Basics',
        messages: [
          { sender: 'user', text: 'How does useState work?' },
          { sender: 'ai', text: 'useState allows adding reactive state.' },
        ],
      });

    expect(saveRes.statusCode).toBe(201);
    expect(saveRes.body.data.conversation).toHaveProperty('_id');

    const getRes = await request(app)
      .get('/api/v1/ai/conversations')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.results).toBe(1);
    expect(getRes.body.data.conversations[0].lessonTitle).toBe('React State');
  });

  test('Generates practice quiz questions from uploaded notes', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate-quiz')
      .set('Authorization', `Bearer ${token}`)
      .send({
        notesText: 'React components process state and props to render user interfaces efficiently using virtual DOM reconciliation.',
        numQuestions: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('questions');
    expect(res.body.data.questions.length).toBe(2);
    expect(res.body.data.questions[0]).toHaveProperty('options');
  });

  test('Clears AI conversation logs', async () => {
    await AIConversation.create({
      user: userId,
      lessonTitle: 'Test Lesson',
      messages: [{ sender: 'user', text: 'Hi' }],
    });

    const deleteRes = await request(app)
      .delete('/api/v1/ai/conversations')
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);

    const getRes = await request(app)
      .get('/api/v1/ai/conversations')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.body.results).toBe(0);
  });
});
