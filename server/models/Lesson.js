const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,



    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['video', 'pdf', 'text', 'quiz', 'assignment'],
      default: 'video',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 10, // minutes
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
