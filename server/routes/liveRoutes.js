const express = require('express');
const liveController = require('../controllers/liveController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, liveController.listSessions);
router.post('/', protect, restrictTo('instructor', 'admin'), liveController.createSession);
router.get('/:id', protect, liveController.getSession);

module.exports = router;