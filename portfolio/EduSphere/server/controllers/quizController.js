const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Seed Question Banks for Aptitude Categories
const SEEDED_APTITUDE_QUIZZES = [
  {
    title: 'Verbal Ability & Reading Comprehension Test',
    aptitudeCategory: 'verbal-ability',
    isAptitude: true,
    timeLimitMinutes: 10,
    passingScore: 70,
    learningObjective: 'Master vocabulary, sentence correction, synonyms, and verbal analysis.',
    questions: [
      {
        questionText: 'Choose the word that is most nearly SYNONYMOUS with "METICULOUS":',
        options: ['Careless', 'Painstaking / Precise', 'Rapid', 'Ambiguous'],
        correctOptionIndex: 1,
        explanation: 'Meticulous means showing great attention to detail; very careful and precise.',
      },
      {
        questionText: 'Identify the sentence with correct grammatical structure:',
        options: [
          'Neither of the students were ready for the quiz.',
          'Neither of the students was ready for the quiz.',
          'Neither of the students are ready for the quiz.',
          'Neither of the student were ready for the quiz.',
        ],
        correctOptionIndex: 1,
        explanation: '"Neither" takes a singular verb ("was").',
      },
      {
        questionText: 'Complete the analogy: EPILOGUE : BOOK :: _______ : PLAY',
        options: ['Prologue', 'Overture', 'Peroration', 'Conclusion / Postscript'],
        correctOptionIndex: 3,
        explanation: 'An epilogue comes at the end of a book, just as a postscript/conclusion concludes a dramatic work.',
      },
      {
        questionText: 'Choose the antonym for "CANDID":',
        options: ['Frank', 'Secretive / Deceptive', 'Sincere', 'Direct'],
        correctOptionIndex: 1,
        explanation: 'Candid means truthful and straightforward. Secretive/deceptive is its opposite.',
      },
    ],
  },
  {
    title: 'Logical Reasoning & Analytical Thinking Test',
    aptitudeCategory: 'logical-reasoning',
    isAptitude: true,
    timeLimitMinutes: 12,
    passingScore: 70,
    learningObjective: 'Develop pattern detection, deductive logic, and sequence identification skills.',
    questions: [
      {
        questionText: 'Which number continues the logical pattern: 2, 6, 12, 20, 30, ?',
        options: ['36', '40', '42', '48'],
        correctOptionIndex: 2,
        explanation: 'The pattern adds successive even numbers (+4, +6, +8, +10, +12). 30 + 12 = 42.',
      },
      {
        questionText: 'Statement: All programmers write code. Some managers are programmers. Conclusion:',
        options: [
          'All managers write code',
          'Some managers write code',
          'No managers write code',
          'None of the above',
        ],
        correctOptionIndex: 1,
        explanation: 'Since some managers are programmers and all programmers write code, those specific managers write code.',
      },
      {
        questionText: 'If CAT is coded as 3120, how is DOG coded in the same system?',
        options: ['4157', '41515', '415715', '4157'],
        correctOptionIndex: 0,
        explanation: 'C=3, A=1, T=20 (Alphabet positions). D=4, O=15, G=7 -> 4157.',
      },
      {
        questionText: 'Pointing to a photograph, Alex says: "She is the daughter of my father’s only son." Who is in the photo?',
        options: ['Alex’s sister', 'Alex’s daughter', 'Alex’s mother', 'Alex’s niece'],
        correctOptionIndex: 1,
        explanation: '"My father\'s only son" is Alex himself. The daughter of Alex is his daughter.',
      },
    ],
  },
  {
    title: 'Arithmetic & Speed Calculation Test',
    aptitudeCategory: 'arithmetic',
    isAptitude: true,
    timeLimitMinutes: 10,
    passingScore: 70,
    learningObjective: 'Master percentage calculations, ratios, simple interest, and work-time rates.',
    questions: [
      {
        questionText: 'If 12 men can complete a project in 15 days, how many days will 10 men take working at the same rate?',
        options: ['12 days', '15 days', '18 days', '20 days'],
        correctOptionIndex: 2,
        explanation: 'Total man-days = 12 * 15 = 180. Days for 10 men = 180 / 10 = 18 days.',
      },
      {
        questionText: 'A item bought for $80 is sold for $100. What is the profit percentage?',
        options: ['20%', '25%', '30%', '15%'],
        correctOptionIndex: 1,
        explanation: 'Profit = $20. Profit % = (20 / 80) * 100 = 25%.',
      },
      {
        questionText: 'What is 15% of 40% of 500?',
        options: ['20', '30', '40', '50'],
        correctOptionIndex: 1,
        explanation: '40% of 500 = 200. 15% of 200 = 30.',
      },
      {
        questionText: 'Find the simple interest on $1,200 at 5% per annum for 3 years.',
        options: ['$150', '$180', '$200', '$220'],
        correctOptionIndex: 1,
        explanation: 'SI = (P * R * T) / 100 = (1200 * 5 * 3) / 100 = $180.',
      },
    ],
  },
  {
    title: 'Quantitative Aptitude & Algebra Master Quiz',
    aptitudeCategory: 'quantitative-aptitude',
    isAptitude: true,
    timeLimitMinutes: 15,
    passingScore: 70,
    learningObjective: 'Solve quadratic equations, coordinate geometry, probability, and word problems.',
    questions: [
      {
        questionText: 'If x^2 - 7x + 12 = 0, what are the roots of x?',
        options: ['x = 2, 5', 'x = 3, 4', 'x = -3, -4', 'x = 1, 12'],
        correctOptionIndex: 1,
        explanation: '(x - 3)(x - 4) = 0. Therefore x = 3 or x = 4.',
      },
      {
        questionText: 'Two dice are rolled simultaneously. What is the probability of getting a sum of 7?',
        options: ['1/6', '1/12', '5/36', '1/4'],
        correctOptionIndex: 0,
        explanation: 'Outcomes making 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 total. Probability = 6/36 = 1/6.',
      },
      {
        questionText: 'The average of 5 consecutive numbers is 24. What is the largest number?',
        options: ['24', '25', '26', '27'],
        correctOptionIndex: 2,
        explanation: 'In consecutive numbers, average equals the middle number (3rd). So numbers are 22, 23, 24, 25, 26. Largest is 26.',
      },
      {
        questionText: 'A train 150m long is running at 54 km/h. How long will it take to cross a pole?',
        options: ['8 seconds', '10 seconds', '12 seconds', '15 seconds'],
        correctOptionIndex: 1,
        explanation: 'Speed in m/s = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.',
      },
    ],
  },
];

// Helper to seed aptitude quizzes if missing
const ensureSeedAptitudeQuizzes = async () => {
  for (const item of SEEDED_APTITUDE_QUIZZES) {
    const exists = await Quiz.findOne({ aptitudeCategory: item.aptitudeCategory });
    if (!exists) {
      await Quiz.create(item);
    }
  }
};

// Get Quiz by Lesson ID (or auto-seed mock quiz for demo if none exists)
exports.getQuizByLesson = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;

  let quiz = await Quiz.findOne({ lesson: lessonId });

  if (!quiz) {
    quiz = await Quiz.create({
      lesson: lessonId,
      title: 'Lesson Concept Review Quiz',
      passingScore: 70,
      timeLimitMinutes: 10,
      learningObjective: 'Verify lesson mastery and key technical concepts.',
      questions: [
        {
          questionText: 'What is the primary role of JWT tokens in web applications?',
          options: [
            'Storing database passwords safely',
            'Stateless user authentication & authorization',
            'Encrypting server hard drives',
            'Compressing video streaming files',
          ],
          correctOptionIndex: 1,
          explanation: 'JWT tokens carry cryptographically signed payloads allowing servers to verify user identities statelessly.',
        },
        {
          questionText: 'Which HTTP method should be used for updating existing resource fields?',
          options: ['GET', 'POST', 'PUT / PATCH', 'DELETE'],
          correctOptionIndex: 2,
          explanation: 'PUT replaces an entire entity or resource, while PATCH updates partial fields of an existing entity.',
        },
        {
          questionText: 'What purpose does Mongoose serve in a Node.js + Express backend?',
          options: [
            'Object Data Modeling (ODM) layer for MongoDB',
            'CSS UI styling framework',
            'Client-side state manager',
            'Video processing daemon',
          ],
          correctOptionIndex: 0,
          explanation: 'Mongoose provides a schema-based solution to model application data with validation, middleware, and query building.',
        },
      ],
    });
  }

  res.status(200).json({
    status: 'success',
    data: { quiz },
  });
});

// Get Single Quiz by ID
exports.getQuizById = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { quiz },
  });
});

// Get Aptitude Quizzes List
exports.getAptitudeQuizzes = catchAsync(async (req, res, next) => {
  await ensureSeedAptitudeQuizzes();

  const quizzes = await Quiz.find({ isAptitude: true }).sort('aptitudeCategory');

  res.status(200).json({
    status: 'success',
    results: quizzes.length,
    data: { quizzes },
  });
});

// Get Aptitude Quiz by Category
exports.getAptitudeQuizByCategory = catchAsync(async (req, res, next) => {
  await ensureSeedAptitudeQuizzes();

  const { category } = req.params;
  let quiz = await Quiz.findOne({ isAptitude: true, aptitudeCategory: category });

  if (!quiz) {
    return next(new AppError(`No aptitude quiz found for category: ${category}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: { quiz },
  });
});

// Create Custom Quiz (Instructor/Admin)
exports.createQuiz = catchAsync(async (req, res, next) => {
  const { title, questions, passingScore, timeLimitMinutes, learningObjective, isAptitude, aptitudeCategory } = req.body;

  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return next(new AppError('Title and at least 1 question are required to create a quiz.', 400));
  }

  const quiz = await Quiz.create({
    creator: req.user.id,
    title,
    learningObjective: learningObjective || 'Assessment of core learning objectives',
    questions,
    passingScore: passingScore || 70,
    timeLimitMinutes: timeLimitMinutes || 10,
    isAptitude: isAptitude || false,
    aptitudeCategory: aptitudeCategory || 'none',
  });

  res.status(201).json({
    status: 'success',
    message: 'Custom quiz created successfully!',
    data: { quiz },
  });
});

// Get Instructor Created Quizzes
exports.getInstructorQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ creator: req.user.id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: quizzes.length,
    data: { quizzes },
  });
});

// Submit Quiz Attempt (with proctoring & security tracking)
exports.submitQuizAttempt = catchAsync(async (req, res, next) => {
  const { quizId } = req.params;
  const { answers, tabSwitchesCount, timeSpentSeconds, autoSubmitted } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  let correctCount = 0;
  const detailedResults = [];

  quiz.questions.forEach((q, idx) => {
    const studentAns = (answers || []).find((ans) => ans.questionIndex === idx);
    const selectedOption = studentAns ? studentAns.selectedOption : -1;
    const isCorrect = selectedOption === q.correctOptionIndex;

    if (isCorrect) correctCount++;

    detailedResults.push({
      questionIndex: idx,
      questionText: q.questionText,
      options: q.options,
      selectedOption,
      correctOptionIndex: q.correctOptionIndex,
      isCorrect,
      explanation: q.explanation,
    });
  });

  const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = scorePercentage >= quiz.passingScore;

  const attempt = await QuizAttempt.create({
    student: req.user.id,
    quiz: quizId,
    score: scorePercentage,
    passed,
    answers: answers || [],
    tabSwitchesCount: tabSwitchesCount || 0,
    timeSpentSeconds: timeSpentSeconds || 0,
    autoSubmitted: !!autoSubmitted,
  });

  res.status(200).json({
    status: 'success',
    message: passed
      ? 'Congratulations! You passed the assessment.'
      : 'Passing score not reached. Review explanations and retry!',
    data: {
      attempt,
      correctCount,
      totalQuestions: quiz.questions.length,
      detailedResults,
    },
  });
});
