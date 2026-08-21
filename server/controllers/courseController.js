const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Category = require('../models/Category');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all courses (Public catalog with search, filter, pagination)
exports.getCourses = catchAsync(async (req, res, next) => {
  const { search, category, level, price, sort } = req.query;

  let query = { isPublished: true };

  // Search filter
  if (search) {
    query.$text = { $search: search };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Level filter
  if (level) {
    query.level = level;
  }

  // Price filter
  if (price === 'free') {
    query.price = 0;
  } else if (price === 'paid') {
    query.price = { $gt: 0 };
  }

  let courseQuery = Course.find(query).populate('instructor', 'name avatar bio').populate('category', 'name icon');

  // Sorting
  if (sort === 'price-low') {
    courseQuery = courseQuery.sort('price');
  } else if (sort === 'price-high') {
    courseQuery = courseQuery.sort('-price');
  } else {
    courseQuery = courseQuery.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const total = await Course.countDocuments(query);
  courseQuery = courseQuery.skip(skip).limit(limit);

  const courses = await courseQuery;

  res.status(200).json({
    status: 'success',
    results: courses.length,
    totalResults: total,
    page,
    totalPages: Math.ceil(total / limit),
    data: { courses },
  });
});

// Get Course by ID or Slug (with Syllabus structure)
exports.getCourse = catchAsync(async (req, res, next) => {
  const { idOrSlug } = req.params;
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

  const course = await Course.findOne(filter)
    .populate('instructor', 'name avatar bio email')
    .populate('category', 'name slug icon')
    .populate({
      path: 'modules',
      options: { sort: { order: 1 } },
      populate: {
        path: 'lessons',
        options: { sort: { order: 1 } },
      },
    });

  if (!course) {
    return next(new AppError('No course found with that ID or Slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { course },
  });
});

// Create Course (Instructor)
exports.createCourse = catchAsync(async (req, res, next) => {
  const { title, subtitle, description, category, level, price, tags } = req.body;

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

  let thumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  if (req.file) {
    thumbnail = `/uploads/thumbnails/${req.file.filename}`;
  }

  const course = await Course.create({
    title,
    slug,
    subtitle,
    description,
    instructor: req.user.id,
    category,
    thumbnail,
    level: level || 'Beginner',
    price: price || 0,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
  });

  res.status(201).json({
    status: 'success',
    data: { course },
  });
});

// Update Course (Instructor)
exports.updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check ownership or admin
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to edit this course', 403));
  }

  const fieldsToUpdate = { ...req.body };
  if (req.file) {
    fieldsToUpdate.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
  }

  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { course: updatedCourse },
  });
});

// Toggle Publish Status
exports.togglePublishCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to publish this course', 403));
  }

  course.isPublished = !course.isPublished;
  course.status = course.isPublished ? 'published' : 'draft';
  await course.save();

  res.status(200).json({
    status: 'success',
    message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully!`,
    data: { course },
  });
});

// Get Instructor Courses
exports.getInstructorCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({ instructor: req.user.id })
    .populate('category', 'name')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: { courses },
  });
});

// Delete Course
exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this course', 403));
  }

  await Course.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Get Instructor Dashboard Stats & Overview
exports.getInstructorStats = catchAsync(async (req, res, next) => {
  const instructorId = req.user.id;

  // 1. Get instructor's courses
  const courses = await Course.find({ instructor: instructorId })
    .populate('category', 'name icon')
    .sort('-createdAt');

  const courseIds = courses.map((c) => c._id);

  // 2. Count total students enrolled across instructor's courses
  const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });

  // 3. Count total modules and lessons
  const modules = await Module.find({ course: { $in: courseIds } });
  const moduleIds = modules.map((m) => m._id);
  const totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds } });

  // 4. Count pending submissions for instructor's courses
  const lessonIds = await Lesson.find({ module: { $in: moduleIds } }).distinct('_id');
  const assignments = await Assignment.find({ lesson: { $in: lessonIds } });
  const assignmentIds = assignments.map((a) => a._id);
  
  const pendingSubmissions = await Submission.find({
    assignment: { $in: assignmentIds },
    status: 'submitted',
  })
    .populate('student', 'name email avatar')
    .populate({
      path: 'assignment',
      select: 'title totalPoints lesson',
    })
    .sort('-createdAt');

  // 5. Build enriched courses array with enrollment counts and lesson counts
  const enrichedCourses = await Promise.all(
    courses.map(async (course) => {
      const studentCount = await Enrollment.countDocuments({ course: course._id });
      const courseModules = await Module.find({ course: course._id });
      const courseModuleIds = courseModules.map((m) => m._id);
      const lessonCount = await Lesson.countDocuments({ module: { $in: courseModuleIds } });
      return {
        ...course.toObject(),
        studentCount,
        moduleCount: courseModules.length,
        lessonCount,
      };
    })
  );

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalCourses: courses.length,
        publishedCoursesCount: courses.filter((c) => c.isPublished).length,
        draftCoursesCount: courses.filter((c) => !c.isPublished).length,
        totalStudents,
        totalModules: modules.length,
        totalLessons,
        pendingSubmissionsCount: pendingSubmissions.length,
      },
      courses: enrichedCourses,
      pendingSubmissions,
    },
  });
});

