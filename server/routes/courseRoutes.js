const express = require('express');
const courseController = require('../controllers/courseController');
const moduleController = require('../controllers/moduleController');
const { protect, restrictTo, isInstructorApproved } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', courseController.getCourses);
router.get('/instructor-courses', protect, restrictTo('instructor', 'admin'), courseController.getInstructorCourses);
router.get('/instructor-stats', protect, restrictTo('instructor', 'admin'), courseController.getInstructorStats);
router.get('/:idOrSlug', courseController.getCourse);

// Protected Instructor/Admin routes
router.post(
  '/',
  protect,
  restrictTo('instructor', 'admin'),
  isInstructorApproved,
  upload.single('thumbnail'),
  courseController.createCourse
);

router.put(
  '/:id',
  protect,
  restrictTo('instructor', 'admin'),
  upload.single('thumbnail'),
  courseController.updateCourse
);

router.patch(
  '/:id/toggle-publish',
  protect,
  restrictTo('instructor', 'admin'),
  courseController.togglePublishCourse
);

router.delete(
  '/:id',
  protect,
  restrictTo('instructor', 'admin'),
  courseController.deleteCourse
);

// Module & Lesson Routes
router.post(
  '/:courseId/modules',
  protect,
  restrictTo('instructor', 'admin'),
  moduleController.addModule
);

router.post(
  '/modules/:moduleId/lessons',
  protect,
  restrictTo('instructor', 'admin'),
  upload.single('video'),
  moduleController.addLesson
);

router.delete(
  '/modules/:id',
  protect,
  restrictTo('instructor', 'admin'),
  moduleController.deleteModule
);

router.delete(
  '/lessons/:id',
  protect,
  restrictTo('instructor', 'admin'),
  moduleController.deleteLesson
);

module.exports = router;
