const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scheduledAt: Date,
    metadata: { type: Object, default: {} },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LiveSession = mongoose.model('LiveSession', liveSessionSchema);
module.exports = LiveSession;