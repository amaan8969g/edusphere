const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/courses/:courseId/enroll', enrollmentController.enrollCourse);
router.get('/my-enrollments', enrollmentController.getMyEnrollments);
router.post('/courses/:courseId/lessons/:lessonId/complete', enrollmentController.completeLesson);

module.exports = router;
