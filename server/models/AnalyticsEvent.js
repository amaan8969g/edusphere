const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventType: { type: String, required: true },
    payload: { type: Object, default: {} },
  },
  { timestamps: true }
);

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
module.exports = AnalyticsEvent;
