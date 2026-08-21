const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateUpdatePassword,
} = require('../middleware/validateMiddleware');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, validateUpdateProfile, authController.updateProfile);
router.put('/update-password', protect, validateUpdatePassword, authController.updatePassword);

module.exports = router;
