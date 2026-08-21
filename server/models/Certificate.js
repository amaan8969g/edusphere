const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    verificationHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate certificates per student/course
certificateSchema.index({ student: 1, course: 1 }, { unique: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
