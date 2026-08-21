const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    excerpt: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Tech & Coding', 'Aptitude & Logic', 'Study Skills', 'AI & Future Tech', 'General'],
      default: 'General',
    },
    readTimeMinutes: {
      type: Number,
      default: 5,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'EduSphere Editorial',
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
