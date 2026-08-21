const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, recommendationController.getRecommendations);

module.exports = router;
