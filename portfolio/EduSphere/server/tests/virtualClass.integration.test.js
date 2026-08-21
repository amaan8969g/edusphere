const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');

const User = require('../models/User');
const VirtualClass = require('../models/VirtualClass');
const jwt = require('jsonwebtoken');

let mongoServer;
let instructorToken;
let studentToken;
let instructorId;
let studentId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const instructor = await User.create({
    name: 'Prof Oak',
    email: 'oak@test.com',
    password: 'password123',
    role: 'instructor',
    isApprovedInstructor: true,
  });
  instructorId = instructor._id;
  instructorToken = jwt.sign({ id: instructorId, role: 'instructor' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

  const student = await User.create({
    name: 'Ash Ketchum',
    email: 'ash@test.com',
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

describe('VirtualClass API Integration Tests', () => {
  let createdClassCode;
  let createdClassId;

  test('Instructor creates a virtual classroom', async () => {
    const res = await request(app)
      .post('/api/v1/classes')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        title: 'Advanced Computer Science 101',
        subject: 'Computer Science',
        description: 'Virtual lab and interactive lecture environment.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.virtualClass).toHaveProperty('code');
    expect(res.body.data.virtualClass.title).toBe('Advanced Computer Science 101');
    createdClassCode = res.body.data.virtualClass.code;
    createdClassId = res.body.data.virtualClass._id;
  });

  test('Student joins virtual classroom via class code', async () => {
    const res = await request(app)
      .post('/api/v1/classes/join')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ code: createdClassCode });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.virtualClass.enrolledStudents.length).toBeGreaterThan(0);
  });

  test('Instructor posts an announcement to virtual classroom', async () => {
    const res = await request(app)
      .post(`/api/v1/classes/${createdClassId}/announcements`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        title: 'Midterm Quiz Announcement',
        content: 'Please prepare for the upcoming time-bound assessment next Monday.',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.announcements.length).toBe(1);
    expect(res.body.data.announcements[0].title).toBe('Midterm Quiz Announcement');
  });

  test('Student fetches their joined virtual classes', async () => {
    const res = await request(app)
      .get('/api/v1/classes/student')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results).toBe(1);
    expect(res.body.data.classes[0]._id).toBe(createdClassId);
  });
});
