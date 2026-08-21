const Category = require('../models/Category');
const Course = require('../models/Course');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// Seed a demo instructor and a published course for E2E/dev usage
exports.seedDemoCourse = catchAsync(async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ status: 'error', message: 'Not allowed in production' });
  }

  // Ensure a category
  let category = await Category.findOne({ slug: 'dev-demo' });
  if (!category) {
    category = await Category.create({ name: 'Dev Demo', slug: 'dev-demo', description: 'Demo category', icon: 'Code' });
  }

  // Ensure a demo instructor
  let instructor = await User.findOne({ email: 'instructor.demo@example.com' });
  if (!instructor) {
    instructor = await User.create({
      name: 'Demo Instructor',
      email: 'instructor.demo@example.com',
      password: 'password123',
      role: 'instructor',
      isApprovedInstructor: true,
    });
  }

  // Create a published course
  const slugBase = 'demo-course-' + Date.now().toString().slice(-4);
  const course = await Course.create({
    title: 'Demo Course for E2E',
    slug: slugBase,
    subtitle: 'Automated E2E Demo Course',
    description: 'This course is auto-created for E2E tests',
    instructor: instructor._id,
    category: category._id,
    level: 'Beginner',
    price: 0,
    isPublished: true,
    status: 'published',
  });

  res.status(201).json({ status: 'success', data: { course } });
});
