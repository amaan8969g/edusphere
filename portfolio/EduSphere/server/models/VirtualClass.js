const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorName: { type: String, default: 'Instructor' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const virtualClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Virtual Class title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject category is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    announcements: [announcementSchema],
  },
  { timestamps: true }
);

const VirtualClass = mongoose.model('VirtualClass', virtualClassSchema);
module.exports = VirtualClass;
