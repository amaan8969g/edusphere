const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for Lessons
moduleSchema.virtual('lessons', {
  ref: 'Lesson',
  foreignField: 'module',
  localField: '_id',
});

const Module = mongoose.model('Module', moduleSchema);
module.exports = Module;
