const express = require('express');
const articleController = require('../controllers/articleController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Publicly readable articles
router.get('/', articleController.getAllArticles);
router.get('/:slug', articleController.getArticleBySlug);

// Protected routes for article creation & management
router.use(protect);
router.post('/', restrictTo('instructor', 'admin'), articleController.createArticle);
router.delete('/:id', restrictTo('instructor', 'admin'), articleController.deleteArticle);

module.exports = router;
