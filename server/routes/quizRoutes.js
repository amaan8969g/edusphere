const express = require('express');
const quizController = require('../controllers/quizController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Aptitude Quizzes
router.get('/aptitude', quizController.getAptitudeQuizzes);
router.get('/aptitude/:category', quizController.getAptitudeQuizByCategory);

// Instructor Custom Quizzes
router.post('/', restrictTo('instructor', 'admin'), quizController.createQuiz);
router.get('/instructor', restrictTo('instructor', 'admin'), quizController.getInstructorQuizzes);

// Lesson / Single Quiz taking & submission
router.get('/lessons/:lessonId', quizController.getQuizByLesson);
router.get('/:id', quizController.getQuizById);
router.post('/:quizId/submit', quizController.submitQuizAttempt);

module.exports = router;
