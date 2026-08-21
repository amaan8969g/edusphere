const Article = require('../models/Article');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Sample default informative articles for self-paced learning
const DEFAULT_ARTICLES = [
  {
    title: 'Mastering Modern MERN Stack Architecture in 2026',
    slug: 'mastering-modern-mern-stack-architecture-2026',
    excerpt: 'Explore scalable clean architecture patterns, JWT authentication, Mongoose ORM optimizations, and React 18 state management.',
    content: `Building high-throughput, secure web applications requires a clear separation of concerns. In modern MERN stack development, Node.js and Express form a robust RESTful or GraphQL server layer, while MongoDB provides flexible JSON-like document storage.

### Key Pillars of Secure MERN Architecture:
1. **Stateless JWT Security**: Use HTTP-only cookies or Bearer tokens with short life cycles and refresh mechanisms.
2. **Database Indexing**: Always define compound indexes on frequently queried MongoDB fields like course categories and user IDs.
3. **Component-Driven React Design**: Modularize application UI with reusable React components, modern hooks, and state context.
4. **Automated End-to-End Testing**: Integrate continuous integration checks using Jest, Vitest, and Cypress.`,
    category: 'Tech & Coding',
    readTimeMinutes: 6,
    authorName: 'Dr. Aris Vance',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Web Security'],
  },
  {
    title: 'Top Strategies for Cracking Quantitative & Logical Aptitude Tests',
    slug: 'top-strategies-for-cracking-quantitative-logical-aptitude-tests',
    excerpt: 'Key mental shortcuts, speed calculation techniques, and logical deduction rules to dramatically boost your competitive exam scores.',
    content: `Aptitude assessments evaluate critical thinking, numerical proficiency, and problem-solving velocity under strict time constraints.

### 1. Speed Mathematics & Mental Calculations
- **Vedic Multiplications**: Learn visual grid multiplication techniques for double and triple-digit arithmetic.
- **Fraction to Percentage Conversions**: Memorize core fraction equivalents (e.g., 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%).

### 2. Logical Reasoning Frameworks
- Draw quick Venn Diagrams for Syllogisms.
- Use tabular elimination matrixes for Seating Arrangement problems.
- Track direction paths using standard Cartesian coordinate axes.`,
    category: 'Aptitude & Logic',
    readTimeMinutes: 7,
    authorName: 'Prof. Elena Rostova',
    tags: ['Aptitude', 'Arithmetic', 'Logical Reasoning', 'Exam Prep'],
  },
  {
    title: 'Self-Paced Learning: How to Stay Disciplined & Retention Hacks',
    slug: 'self-paced-learning-discipline-and-retention-hacks',
    excerpt: 'Scientific methods to optimize active recall, spaced repetition, and deep focus sessions for maximum long-term memory retention.',
    content: `Online education empowers learners with flexible scheduling, but requires strong self-direction and cognitive strategies to maximize retention.

### Spaced Repetition Technique (SRT)
Reviewing new concept notes after 24 hours, 3 days, 1 week, and 1 month counters the Ebbinghaus forgetting curve.

### Active Recall over Passive Reading
Instead of re-reading lecture slides, test your memory by taking time-bound practice quizzes immediately after studying. Writing summaries in your own words forces your neural pathways to consolidate information.`,
    category: 'Study Skills',
    readTimeMinutes: 5,
    authorName: 'EduSphere Learning Team',
    tags: ['Study Habits', 'Self-Paced', 'Productivity', 'Retention'],
  },
  {
    title: 'The Evolution of AI in Modern E-Learning Platforms',
    slug: 'evolution-of-ai-in-modern-e-learning-platforms',
    excerpt: 'How generative AI, intelligent tutoring agents, and adaptive analytics personalize the student educational journey.',
    content: `Artificial Intelligence is transforming online learning from static digital textbooks into dynamic, adaptive learning tutors.

### Adaptive Learning Pathways
Machine learning models analyze student quiz attempt metrics and time-on-page analytics to suggest customized remedial reading materials and targeted skill drills.

### Automated Proctoring & Assessment Security
AI algorithms help verify assessment integrity through real-time anomaly detection, browser focus tracking, and automated plagiarism analysis.`,
    category: 'AI & Future Tech',
    readTimeMinutes: 8,
    authorName: 'AI Research Group',
    tags: ['Artificial Intelligence', 'E-Learning', 'EdTech', 'Future Tech'],
  },
];

// Seed default articles if empty
const ensureSeedArticles = async () => {
  const count = await Article.countDocuments();
  if (count === 0) {
    await Article.insertMany(DEFAULT_ARTICLES);
  }
};

// Get all articles (with filter & search query)
exports.getAllArticles = catchAsync(async (req, res, next) => {
  await ensureSeedArticles();

  const { category, search } = req.query;
  const filter = {};

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const articles = await Article.find(filter).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: articles.length,
    data: { articles },
  });
});

// Get single article by slug
exports.getArticleBySlug = catchAsync(async (req, res, next) => {
  await ensureSeedArticles();

  const article = await Article.findOne({ slug: req.params.slug });

  if (!article) {
    return next(new AppError('Article not found', 404));
  }

  // Increment view count
  article.views += 1;
  await article.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: { article },
  });
});

// Create new informative article (Instructor or Admin)
exports.createArticle = catchAsync(async (req, res, next) => {
  const { title, content, excerpt, category, tags, readTimeMinutes } = req.body;

  if (!title || !content) {
    return next(new AppError('Title and content are required to publish an article.', 400));
  }

  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now();

  const article = await Article.create({
    title,
    slug,
    content,
    excerpt: excerpt || content.substring(0, 150) + '...',
    category: category || 'General',
    tags: tags || [],
    readTimeMinutes: readTimeMinutes || 5,
    author: req.user.id,
    authorName: req.user.name || 'Instructor',
  });

  res.status(201).json({
    status: 'success',
    message: 'Article published successfully!',
    data: { article },
  });
});

// Delete article
exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new AppError('Article not found', 404));
  }

  if (article.author && article.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this article.', 403));
  }

  await Article.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Article deleted successfully.',
  });
});
