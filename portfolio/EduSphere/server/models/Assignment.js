const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    attachmentUrl: {
      type: String,
      default: '',
    },
    dueDate: Date,
    totalPoints: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
