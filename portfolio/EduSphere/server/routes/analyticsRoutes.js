const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/events', protect, analyticsController.collectEvent);
router.get('/summary', protect, analyticsController.summary);

module.exports = router;
