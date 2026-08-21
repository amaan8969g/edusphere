const express = require('express');
const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getCategories)
  .post(protect, restrictTo('admin'), categoryController.createCategory);

router
  .route('/:id')
  .put(protect, restrictTo('admin'), categoryController.updateCategory)
  .delete(protect, restrictTo('admin'), categoryController.deleteCategory);

module.exports = router;
