const VirtualClass = require('../models/VirtualClass');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Helper to generate 6-character unique class code
const generateClassCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'EDU-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new Virtual Class (Instructor only)
exports.createClass = catchAsync(async (req, res, next) => {
  const { title, subject, description } = req.body;

  if (!title || !subject) {
    return next(new AppError('Please provide both class title and subject category.', 400));
  }

  let code = generateClassCode();
  let existing = await VirtualClass.findOne({ code });
  while (existing) {
    code = generateClassCode();
    existing = await VirtualClass.findOne({ code });
  }

  const newClass = await VirtualClass.create({
    title,
    subject,
    description: description || '',
    code,
    instructor: req.user.id,
    enrolledStudents: [],
  });

  res.status(201).json({
    status: 'success',
    message: 'Virtual Classroom created successfully!',
    data: { virtualClass: newClass },
  });
});

// Get Virtual Classes taught by Instructor
exports.getInstructorClasses = catchAsync(async (req, res, next) => {
  const classes = await VirtualClass.find({ instructor: req.user.id })
    .populate('enrolledStudents', 'name email avatar role')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: { classes },
  });
});

// Join Virtual Class via Code (Student)
exports.joinClass = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new AppError('Please enter a valid class code.', 400));
  }

  const formattedCode = code.trim().toUpperCase();
  const virtualClass = await VirtualClass.findOne({ code: formattedCode });

  if (!virtualClass) {
    return next(new AppError('No virtual class found with code: ' + formattedCode, 404));
  }

  // Check if student already enrolled
  const isEnrolled = virtualClass.enrolledStudents.some(
    (studentId) => studentId.toString() === req.user.id
  );

  if (isEnrolled) {
    return next(new AppError('You are already enrolled in this virtual class.', 400));
  }

  virtualClass.enrolledStudents.push(req.user.id);
  await virtualClass.save();

  await virtualClass.populate('instructor', 'name email avatar');
  await virtualClass.populate('enrolledStudents', 'name email avatar');

  res.status(200).json({
    status: 'success',
    message: `Enrolled successfully in ${virtualClass.title}!`,
    data: { virtualClass },
  });
});

// Get Virtual Classes joined by Student
exports.getStudentClasses = catchAsync(async (req, res, next) => {
  const classes = await VirtualClass.find({ enrolledStudents: req.user.id })
    .populate('instructor', 'name email avatar')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: { classes },
  });
});

// Get Single Virtual Class Details
exports.getClassById = catchAsync(async (req, res, next) => {
  const virtualClass = await VirtualClass.findById(req.params.id)
    .populate('instructor', 'name email avatar')
    .populate('enrolledStudents', 'name email avatar');

  if (!virtualClass) {
    return next(new AppError('Virtual Class not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { virtualClass },
  });
});

// Post Announcement in Virtual Class
exports.addAnnouncement = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { id } = req.params;

  if (!title || !content) {
    return next(new AppError('Announcement title and content are required.', 400));
  }

  const virtualClass = await VirtualClass.findById(id);
  if (!virtualClass) {
    return next(new AppError('Virtual class not found', 404));
  }

  // Verify instructor ownership or admin
  if (virtualClass.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Only class instructor can post announcements.', 403));
  }

  virtualClass.announcements.unshift({
    title,
    content,
    authorName: req.user.name || 'Instructor',
    createdAt: new Date(),
  });

  await virtualClass.save();

  res.status(200).json({
    status: 'success',
    message: 'Announcement published to class stream.',
    data: { announcements: virtualClass.announcements },
  });
});

// Delete Virtual Class
exports.deleteClass = catchAsync(async (req, res, next) => {
  const virtualClass = await VirtualClass.findById(req.params.id);

  if (!virtualClass) {
    return next(new AppError('Virtual class not found', 404));
  }

  if (virtualClass.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this virtual class.', 403));
  }

  await VirtualClass.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Virtual class deleted successfully.',
  });
});
