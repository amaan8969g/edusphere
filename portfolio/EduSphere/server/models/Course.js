const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      default: '',
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'archived'],
      default: 'draft',
    },
    tags: [{ type: String, trim: true }],
    // Primary YouTube video id for the course (embed/thumbnail)
    youtubeVideoId: { type: String, default: '' },
    // Total course duration in minutes
    duration: { type: Number, default: 0 },
    // Optional denormalized lessons list for lightweight frontend queries
    lessons: [
      {
        title: String,
        videoId: String,
        duration: Number,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for Modules
courseSchema.virtual('modules', {
  ref: 'Module',
  foreignField: 'course',
  localField: '_id',
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
