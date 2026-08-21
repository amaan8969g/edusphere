const express = require('express');
const virtualClassController = require('../controllers/virtualClassController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Student routes
router.post('/join', virtualClassController.joinClass);
router.get('/student', virtualClassController.getStudentClasses);

// Instructor routes
router.post('/', restrictTo('instructor', 'admin'), virtualClassController.createClass);
router.get('/instructor', restrictTo('instructor', 'admin'), virtualClassController.getInstructorClasses);

// Shared / Class specific
router.get('/:id', virtualClassController.getClassById);
router.post('/:id/announcements', virtualClassController.addAnnouncement);
router.delete('/:id', restrictTo('instructor', 'admin'), virtualClassController.deleteClass);

module.exports = router;
