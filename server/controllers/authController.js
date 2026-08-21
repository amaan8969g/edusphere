const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { createSendToken } = require('../utils/generateTokens');

// Register User
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered. Please sign in instead.', 400));
  }

  const assignedRole = role === 'instructor' ? 'instructor' : 'student';

  const newUser = await User.create({
    name,
    email,
    password,
    role: assignedRole,
    isApprovedInstructor: true,
  });

  createSendToken(newUser, 201, res, 'Registration successful!');
});

// Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Fetch user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (user.role === 'instructor' && !user.isApprovedInstructor) {
    user.isApprovedInstructor = true;
    await user.save({ validateBeforeSave: false });
  }

  createSendToken(user, 200, res, 'Login successful!');
});

// Get Current User Profile
exports.getMe = catchAsync(async (req, res, next) => {
  if (req.user.role === 'instructor' && !req.user.isApprovedInstructor) {
    req.user.isApprovedInstructor = true;
    await User.findByIdAndUpdate(req.user.id, { isApprovedInstructor: true });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

// Update Profile (Name, Bio, Avatar)
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, bio, avatar } = req.body;

  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (bio !== undefined) fieldsToUpdate.bio = bio;
  if (avatar) fieldsToUpdate.avatar = avatar;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully!',
    data: {
      user: updatedUser,
    },
  });
});

// Update Password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  createSendToken(user, 200, res, 'Password updated successfully!');
});

// Forgot Password - Generates Password Reset Token
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide your email address.', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No user registered with that email address.', 404));
  }

  // Generate the unhashed reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Password reset token generated successfully.',
    resetToken,
  });
});

// Reset Password - Verifies Token & Sets New Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const crypto = require('crypto');
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long.', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired.', 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res, 'Password reset successful! You are now logged in.');
});
