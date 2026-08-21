const AnalyticsEvent = require('../models/AnalyticsEvent');
const catchAsync = require('../utils/catchAsync');

exports.collectEvent = catchAsync(async (req, res, next) => {
  const { eventType, payload } = req.body;
  if (!eventType) return res.status(400).json({ status: 'fail', message: 'eventType required' });

  const ev = await AnalyticsEvent.create({ user: req.user ? req.user._id : null, eventType, payload });
  res.status(201).json({ status: 'success', data: { event: ev } });
});

exports.summary = catchAsync(async (req, res, next) => {
  // Simple aggregation: count events by type in last 30 days
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const agg = await AnalyticsEvent.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$eventType', count: { $sum: 1 } } },
  ]);

  res.status(200).json({ status: 'success', data: { summary: agg } });
});
