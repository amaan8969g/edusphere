const express = require('express');
const assignmentController = require('../controllers/assignmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/lessons/:lessonId', assignmentController.getAssignmentByLesson);
router.post(
  '/:assignmentId/submit',
  upload.single('submission'),
  assignmentController.submitAssignment
);

router.put(
  '/submissions/:submissionId/grade',
  restrictTo('instructor', 'admin'),
  assignmentController.gradeSubmission
);

module.exports = router;
