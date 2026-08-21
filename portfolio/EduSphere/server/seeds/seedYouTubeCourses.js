/**
 * Seed script to replace demo courses with curated YouTube-based educational courses.
 *
 * Usage: NODE_ENV=development node server/seeds/seedYouTubeCourses.js
 * It will create instructors, categories, courses, modules and lessons.
 * The selection uses public, well-known courses from reputable channels.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Category = require('../models/Category');
const User = require('../models/User');

dotenv.config({ path: '../../server/.env' });

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edusphere';

async function connect() {
  await mongoose.connect(MONGO, { maxPoolSize: 10 });
}

async function clearCollections() {
  await Promise.all([
    Course.deleteMany({}),
    Module.deleteMany({}),
    Lesson.deleteMany({}),
  ]);
}

async function seed() {
  await connect();
  console.log('Connected to DB');

  await clearCollections();
  console.log('Cleared Course/Module/Lesson collections');

  // Ensure categories exist
  const categories = {};
  const catNames = ['Web Development', 'Programming', 'Data Science', 'DevOps', 'Mobile'];
  for (const name of catNames) {
    let c = await Category.findOne({ name: name });
    if (!c) c = await Category.create({ name: name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g,'-'), description: `${name} courses` });
    categories[name] = c;
  }

  // Ensure or create instructors (simple fake accounts but set role instructor)
  const instructorsData = [
    { name: 'freeCodeCamp Instructor', email: 'freecodecamp.instructor@example.com', password: 'password', role: 'instructor', isApprovedInstructor: true },
    { name: 'Traversy Media Instructor', email: 'traversy.instructor@example.com', password: 'password', role: 'instructor', isApprovedInstructor: true },
    { name: 'The Net Ninja Instructor', email: 'netninja.instructor@example.com', password: 'password', role: 'instructor', isApprovedInstructor: true },
    { name: 'Programming With Mosh', email: 'mosh.instructor@example.com', password: 'password', role: 'instructor', isApprovedInstructor: true },
    { name: 'CodeWithHarry', email: 'harry.instructor@example.com', password: 'password', role: 'instructor', isApprovedInstructor: true },
    { name: 'Apna College', email: 'apna.instructor@example.com', password: 'password', role: 'instructor', isApprovedInstructor: true },
  ];

  const instructors = {};
  for (const i of instructorsData) {
    let u = await User.findOne({ email: i.email });
    if (!u) u = await User.create(i);
    instructors[i.name] = u;
  }

  // Curated list of courses with one representative YouTube video (videoId) and a few lessons
  const curated = [
    {
      title: 'JavaScript Algorithms and Data Structures (freeCodeCamp)',
      description: 'Comprehensive JavaScript algorithms and data structures course from freeCodeCamp.',
      instructor: instructors['freeCodeCamp Instructor']._id,
      category: categories['Programming']._id,
      level: 'All Levels',
      duration: 450, // minutes approx
      thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
      youtubeVideoId: 'PkZNo7MFNFg',
      tags: ['javascript', 'algorithms', 'data-structures', 'freecodecamp'],
      lessons: [
        { title: 'JS Algorithms - Intro', videoId: 'PkZNo7MFNFg', duration: 60 },
      ],
    },
    {
      title: 'Modern JavaScript From The Beginning (Traversy Media)',
      description: 'Brad Traversy covers modern JavaScript concepts and practical projects.',
      instructor: instructors['Traversy Media Instructor']._id,
      category: categories['Web Development']._id,
      level: 'Intermediate',
      duration: 600,
      thumbnail: 'https://i.ytimg.com/vi/hdI2bqOjy3c/maxresdefault.jpg',
      youtubeVideoId: 'hdI2bqOjy3c',
      tags: ['javascript', 'es6', 'traversy'],
      lessons: [
        { title: 'Modern JS - Crash Course', videoId: 'hdI2bqOjy3c', duration: 120 },
      ],
    },
    {
      title: 'React Tutorial For Beginners (The Net Ninja)',
      description: 'A beginner-friendly React tutorial series from The Net Ninja.',
      instructor: instructors['The Net Ninja Instructor']._id,
      category: categories['Web Development']._id,
      level: 'Beginner',
      duration: 300,
      thumbnail: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/maxresdefault.jpg',
      youtubeVideoId: 'w7ejDZ8SWv8',
      tags: ['react', 'frontend', 'netninja'],
      lessons: [
        { title: 'React - Getting Started', videoId: 'w7ejDZ8SWv8', duration: 45 },
      ],
    },
    {
      title: 'Node.js Tutorial - Full Course (Programming with Mosh)',
      description: 'Complete Node.js course covering core concepts and building APIs.',
      instructor: instructors['Programming With Mosh']._id,
      category: categories['Programming']._id,
      level: 'Intermediate',
      duration: 240,
      thumbnail: 'https://i.ytimg.com/vi/TlB_eWDSMt4/maxresdefault.jpg',
      youtubeVideoId: 'TlB_eWDSMt4',
      tags: ['nodejs', 'backend', 'mosh'],
      lessons: [
        { title: 'Node.js - Full Course', videoId: 'TlB_eWDSMt4', duration: 180 },
      ],
    },
    {
      title: 'Python Full Course (CodeWithHarry)',
      description: 'Comprehensive Python tutorial series in Hindi from CodeWithHarry.',
      instructor: instructors['CodeWithHarry']._id,
      category: categories['Programming']._id,
      level: 'Beginner',
      duration: 500,
      thumbnail: 'https://i.ytimg.com/vi/H1elmMBnykA/maxresdefault.jpg',
      youtubeVideoId: 'H1elmMBnykA',
      tags: ['python', 'codewithharry'],
      lessons: [
        { title: 'Python - Full Course', videoId: 'H1elmMBnykA', duration: 300 },
      ],
    },
    {
      title: 'Java Full Course (Apna College)',
      description: 'Complete Java programming tutorial from Apna College.',
      instructor: instructors['Apna College']._id,
      category: categories['Programming']._id,
      level: 'Beginner',
      duration: 800,
      thumbnail: 'https://i.ytimg.com/vi/k6U-i4gXkLM/maxresdefault.jpg',
      youtubeVideoId: 'k6U-i4gXkLM',
      tags: ['java', 'apnacollege'],
      lessons: [
        { title: 'Java - Full Course', videoId: 'k6U-i4gXkLM', duration: 420 },
      ],
    },
  ];

  for (const c of curated) {
    const course = await Course.create({
      title: c.title,
      slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle: c.description.split('.').slice(0,1).join(''),
      description: c.description,
      instructor: c.instructor,
      category: c.category,
      thumbnail: c.thumbnail,
      level: c.level,
      price: 0,
      isPublished: true,
      status: 'published',
      tags: c.tags,
      youtubeVideoId: c.youtubeVideoId,
      duration: c.duration,
      lessons: c.lessons,
    });

    // Create one module "Main" and lessons as Lesson docs
    const mod = await Module.create({ course: course._id, title: 'Main' });
    for (const l of c.lessons) {
      await Lesson.create({ module: mod._id, title: l.title, type: 'video', videoUrl: `https://www.youtube.com/watch?v=${l.videoId}`, duration: l.duration });
    }

    console.log('Seeded course:', course.title);
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });