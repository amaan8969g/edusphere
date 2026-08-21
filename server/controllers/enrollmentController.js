const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Enroll in a course
exports.enrollCourse = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course || !course.isPublished) {
    return next(new AppError('Course not found or not published', 404));
  }

  const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
  if (existing) {
    return res.status(200).json({
      status: 'success',
      message: 'Already enrolled in this course',
      data: { enrollment: existing },
    });
  }

  const enrollment = await Enrollment.create({
    student: req.user.id,
    course: courseId,
    completedLessons: [],
    progressPercentage: 0,
  });

  res.status(201).json({
    status: 'success',
    message: 'Enrolled successfully!',
    data: { enrollment },
  });
});

// Get logged-in student's enrollments
exports.getMyEnrollments = catchAsync(async (req, res, next) => {
  const enrollments = await Enrollment.find({ student: req.user.id })
    .populate({
      path: 'course',
      select: 'title slug thumbnail level price instructor category',
      populate: [
        { path: 'instructor', select: 'name avatar' },
        { path: 'category', select: 'name' },
      ],
    })
    .sort('-updatedAt');

  res.status(200).json({
    status: 'success',
    results: enrollments.length,
    data: { enrollments },
  });
});

// Mark / Toggle Lesson Completion
exports.completeLesson = catchAsync(async (req, res, next) => {
  const { courseId, lessonId } = req.params;

  // Resolve course by ID or slug
  const isObjectId = courseId.match(/^[0-9a-fA-F]{24}$/);
  const course = await Course.findOne(isObjectId ? { _id: courseId } : { slug: courseId });
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  const realCourseId = course._id;

  // Find or auto-create enrollment
  let enrollment = await Enrollment.findOne({ student: req.user.id, course: realCourseId });
  if (!enrollment) {
    enrollment = await Enrollment.create({
      student: req.user.id,
      course: realCourseId,
      completedLessons: [],
      progressPercentage: 0,
    });
  }

  // Calculate total lessons in course
  const modules = await Module.find({ course: realCourseId });
  const moduleIds = modules.map((m) => m._id);
  let totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds } });

  if (totalLessons === 0) {
    if (course.lessons && course.lessons.length > 0) {
      totalLessons = course.lessons.length;
    } else if (course.modules && course.modules.length > 0) {
      totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 0), 0);
    }
  }

  if (totalLessons === 0) totalLessons = 1;

  // Check if lesson is currently completed using string comparison
  const isCompleted = enrollment.completedLessons.some(
    (id) => String(id) === String(lessonId)
  );

  if (isCompleted) {
    // Unmark
    enrollment.completedLessons = enrollment.completedLessons.filter(
      (id) => String(id) !== String(lessonId)
    );
  } else {
    // Mark completed
    enrollment.completedLessons.push(lessonId);
  }

  const completedCount = enrollment.completedLessons.length;
  const percentage = Math.round((completedCount / totalLessons) * 100);

  enrollment.progressPercentage = Math.min(percentage, 100);
  if (enrollment.progressPercentage >= 100) {
    enrollment.isCompleted = true;
    if (!enrollment.completedAt) enrollment.completedAt = new Date();
  } else {
    enrollment.isCompleted = false;
  }

  await enrollment.save();

  res.status(200).json({
    status: 'success',
    message: isCompleted ? 'Lesson unmarked' : 'Lesson completed!',
    data: { enrollment },
  });
});
