const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// 1. Protect routes: Verifies JWT token and attaches current user to req.user
const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // Verify Token
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || 'edusphere_jwt_secret_key_production_grade_998811'
  );

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // Grant Access to Protected Route
  req.user = currentUser;
  next();
});

// 2. Restrict to specific roles (e.g. restrictTo('admin', 'instructor'))
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// 3. Ensure instructor is approved by admin before creating courses
const isInstructorApproved = (req, res, next) => {
  if (req.user.role === 'instructor' && !req.user.isApprovedInstructor) {
    return next(
      new AppError(
        'Your instructor account is currently pending admin approval. You will be able to manage courses once approved.',
        403
      )
    );
  }
  next();
};

module.exports = {
  protect,
  restrictTo,
  isInstructorApproved,
};
