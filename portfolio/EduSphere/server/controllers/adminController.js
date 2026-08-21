const User = require('../models/User');
const Course = require('../models/Course');
const Category = require('../models/Category');
const Enrollment = require('../models/Enrollment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get Overall System Platform Metrics
exports.getSystemStats = catchAsync(async (req, res, next) => {
  const [
    totalUsers,
    totalStudents,
    totalInstructors,
    pendingInstructors,
    totalCourses,
    publishedCourses,
    totalCategories,
    totalEnrollments,
    completedEnrollments,
    enrollmentsWithCourses,
    approvedInstructors,
    recentActiveStudents,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    User.countDocuments({ role: 'instructor', isApprovedInstructor: false }),
    Course.countDocuments(),
    Course.countDocuments({ isPublished: true }),
    Category.countDocuments(),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ isCompleted: true }),
    Enrollment.find().populate('course', 'price').lean(),
    User.countDocuments({ role: 'instructor', isApprovedInstructor: true }),
    Enrollment.distinct('student'),
  ]);

  const totalRevenue = enrollmentsWithCourses.reduce((sum, enrollment) => {
    const price = Number(enrollment.course?.price || 0);
    return sum + price;
  }, 0);

  const activeStudents = recentActiveStudents.length;
  const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        activeStudents,
        activeInstructors: approvedInstructors,
        pendingInstructors,
        totalCourses,
        publishedCourses,
        totalCategories,
        totalEnrollments,
        completedEnrollments,
        completionRate,
        totalRevenue,
      },
    },
  });
});

// Get User Accounts (Searchable)
exports.getUsers = catchAsync(async (req, res, next) => {
  const { search, role } = req.query;

  let query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// Update User Role
exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role, isApprovedInstructor } = req.body;

  const updateData = {};
  if (role) updateData.role = role;
  if (isApprovedInstructor !== undefined) updateData.isApprovedInstructor = isApprovedInstructor;

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully!',
    data: { user },
  });
});

// Get Pending Instructors Queue
exports.getPendingInstructors = catchAsync(async (req, res, next) => {
  const pendingInstructors = await User.find({
    role: 'instructor',
    isApprovedInstructor: false,
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: pendingInstructors.length,
    data: { pendingInstructors },
  });
});

// Approve Instructor
exports.approveInstructor = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isApprovedInstructor: true },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `${user.name} has been approved as an official Instructor!`,
    data: { user },
  });
});

// Reject / Revoke Instructor
exports.rejectInstructor = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isApprovedInstructor: false },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Instructor status revoked for ${user.name}.`,
    data: { user },
  });
});

// Bulk import YouTube lessons via CSV upload (columns: courseId, moduleTitle (optional), lessonTitle, youtubeUrl)
exports.importYouTubeCSV = catchAsync(async (req, res, next) => {
  const multerFile = req.file;
  if (!multerFile) return next(new AppError('CSV file is required', 400));

  const text = multerFile.buffer.toString('utf8');
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  // Expect header optionally
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const hasHeader = header.includes('courseid') && header.includes('lessontitle') && header.includes('youtubeurl');
  const rows = hasHeader ? lines.slice(1) : lines;

  const Module = require('../models/Module');
  const Lesson = require('../models/Lesson');
  const Course = require('../models/Course');

  const results = [];

  for (const line of rows) {
    const cols = line.split(',').map(c => c.trim());
    // Support both with and without moduleTitle
    let courseId, moduleTitle, lessonTitle, youtubeUrl;
    if (cols.length >= 4) {
      courseId = cols[0];
      moduleTitle = cols[1];
      lessonTitle = cols[2];
      youtubeUrl = cols[3];
    } else if (cols.length === 3) {
      courseId = cols[0];
      lessonTitle = cols[1];
      youtubeUrl = cols[2];
    } else {
      results.push({ line, status: 'skipped', reason: 'invalid columns' });
      continue;
    }

    // Find course by id or slug
    let course = null;
    try { course = await Course.findById(courseId); } catch (e) { course = null; }
    if (!course) course = await Course.findOne({ slug: courseId.toLowerCase() });
    if (!course) { results.push({ line, status: 'skipped', reason: 'course not found' }); continue; }

    // Find or create module
    let module = null;
    if (moduleTitle) {
      module = await Module.findOne({ course: course._id, title: moduleTitle });
      if (!module) module = await Module.create({ course: course._id, title: moduleTitle });
    } else {
      // find or create "Imported" module
      module = await Module.findOne({ course: course._id, title: 'Imported Videos' });
      if (!module) module = await Module.create({ course: course._id, title: 'Imported Videos' });
    }

    // Create lesson
    const lesson = await Lesson.create({ module: module._id, title: lessonTitle, type: 'video', videoUrl: youtubeUrl, duration: 10 });
    results.push({ line, status: 'created', course: course._id, module: module._id, lesson: lesson._id });
  }

  res.status(200).json({ status: 'success', message: 'Import completed', data: { results } });
});
