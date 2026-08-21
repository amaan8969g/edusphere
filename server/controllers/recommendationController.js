const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const catchAsync = require('../utils/catchAsync');

// Simple recommendations: return latest courses excluding enrolled ones
exports.getRecommendations = catchAsync(async (req, res, next) => {
  const userId = req.user ? req.user._id : null;

  const enrolledCourseIds = userId
    ? (await Enrollment.find({ student: userId }).select('course')).map((e) => String(e.course))
    : [];

  const recommendations = await Course.find({ _id: { $nin: enrolledCourseIds } })
    .sort('-createdAt')
    .limit(8)
    .select('title description thumbnail instructor');

  res.status(200).json({ status: 'success', results: recommendations.length, data: { recommendations } });
});
