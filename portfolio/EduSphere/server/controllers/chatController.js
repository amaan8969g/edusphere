const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ChatMessage = require('../models/ChatMessage');

// Get recent messages for a room
exports.getRoomMessages = catchAsync(async (req, res, next) => {
  const { room } = req.params;
  if (!room) return next(new AppError('Room id required', 400));

  const messages = await ChatMessage.find({ room }).sort('createdAt').limit(200).populate('sender', 'name');
  res.status(200).json({ status: 'success', results: messages.length, data: { messages } });
});

// Post a message via REST as fallback
exports.postMessage = catchAsync(async (req, res, next) => {
  const { room } = req.params;
  const { text } = req.body;
  if (!room || !text) return next(new AppError('room and text required', 400));

  const msg = await ChatMessage.create({ room, sender: req.user._id, text });
  res.status(201).json({ status: 'success', data: { message: msg } });
});
