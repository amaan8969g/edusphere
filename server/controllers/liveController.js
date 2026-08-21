const LiveSession = require('../models/LiveSession');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createSession = catchAsync(async (req, res, next) => {
  const { title, course, scheduledAt } = req.body;
  if (!title) return next(new AppError('title required', 400));

  const session = await LiveSession.create({ title, course, instructor: req.user._id, scheduledAt });
  res.status(201).json({ status: 'success', data: { session } });
});

exports.listSessions = catchAsync(async (req, res, next) => {
  const sessions = await LiveSession.find().sort('scheduledAt');
  res.status(200).json({ status: 'success', results: sessions.length, data: { sessions } });
});

exports.getSession = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const session = await LiveSession.findById(id).populate('instructor', 'name');
  if (!session) return next(new AppError('session not found', 404));
  res.status(200).json({ status: 'success', data: { session } });
});