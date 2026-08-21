const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect, restrictTo('admin'));

router.get('/stats', adminController.getSystemStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.get('/instructors/pending', adminController.getPendingInstructors);
router.patch('/instructors/:id/approve', adminController.approveInstructor);
router.patch('/instructors/:id/reject', adminController.rejectInstructor);

// Bulk import YouTube CSV: multipart form 'file' field
router.post('/import-youtube', upload.single('file'), adminController.importYouTubeCSV);

module.exports = router;
