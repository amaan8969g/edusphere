const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    learningObjective: {
      type: String,
      default: 'Assessment of core concepts',
    },
    isAptitude: {
      type: Boolean,
      default: false,
    },
    aptitudeCategory: {
      type: String,
      enum: ['verbal-ability', 'logical-reasoning', 'arithmetic', 'quantitative-aptitude', 'none'],
      default: 'none',
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true },
        explanation: { type: String, default: '' },
      },
    ],
    passingScore: {
      type: Number,
      default: 70, // percentage
    },
    timeLimitMinutes: {
      type: Number,
      default: 15,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;

