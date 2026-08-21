const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Add Module to Course
exports.addModule = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const { title, order } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Unauthorized', 403));
  }

  const module = await Module.create({
    course: courseId,
    title,
    order: order || 0,
  });

  res.status(201).json({
    status: 'success',
    data: { module },
  });
});

// Add Lesson to Module
exports.addLesson = catchAsync(async (req, res, next) => {
  const { moduleId } = req.params;
  const { title, type, content, duration, isFreePreview, order } = req.body;

  const module = await Module.findById(moduleId).populate('course');
  if (!module) {
    return next(new AppError('Module not found', 404));
  }

  let videoUrl = '';
  let pdfUrl = '';

  if (req.file) {
    if (req.file.fieldname === 'video') {
      videoUrl = `/uploads/videos/${req.file.filename}`;
    } else if (req.file.fieldname === 'doc') {
      pdfUrl = `/uploads/docs/${req.file.filename}`;
    }
  }

  const lesson = await Lesson.create({
    module: moduleId,
    title,
    type: type || 'video',
    content: content || '',
    duration: duration || 10,
    isFreePreview: isFreePreview === 'true' || isFreePreview === true,
    videoUrl,
    pdfUrl,
    order: order || 0,
  });

  res.status(201).json({
    status: 'success',
    data: { lesson },
  });
});

// Delete Module
exports.deleteModule = catchAsync(async (req, res, next) => {
  const module = await Module.findById(req.params.id);
  if (!module) {
    return next(new AppError('Module not found', 404));
  }

  await Lesson.deleteMany({ module: module._id });
  await Module.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Delete Lesson
exports.deleteLesson = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) {
    return next(new AppError('Lesson not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
