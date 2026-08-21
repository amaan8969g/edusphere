const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    grade: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'resubmission_requested'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
