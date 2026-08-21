const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all categories
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find().sort('name');

  // Seed default categories if empty
  if (categories.length === 0) {
    const defaultCategories = [
      { name: 'Web Development', slug: 'web-development', description: 'Full-stack web applications, React, Node.js', icon: 'Code' },
      { name: 'Data Science & AI', slug: 'data-science-ai', description: 'Python, Machine Learning, AI prompt engineering', icon: 'Brain' },
      { name: 'Mobile App Development', slug: 'mobile-development', description: 'iOS, Android, React Native, Flutter', icon: 'Smartphone' },
      { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Network defense, ethical hacking, security standards', icon: 'Shield' },
      { name: 'Design & UI/UX', slug: 'design-ui-ux', description: 'Figma, prototyping, user-centered product design', icon: 'Palette' },
    ];
    const seeded = await Category.insertMany(defaultCategories);
    return res.status(200).json({
      status: 'success',
      results: seeded.length,
      data: { categories: seeded },
    });
  }

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

// Create Category (Admin)
exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, description, icon } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = await Category.create({ name, slug, description, icon });

  res.status(201).json({
    status: 'success',
    data: { category },
  });
});

// Update Category (Admin)
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name, description, icon } = req.body;
  const updateData = {};
  if (name) {
    updateData.name = name;
    updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (description) updateData.description = description;
  if (icon) updateData.icon = icon;

  const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

// Delete Category (Admin)
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
