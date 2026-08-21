const express = require('express');
const certificateController = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


// Protected user certificate generation & collection
router.get('/my-certificates', protect, certificateController.getMyCertificates);
router.get('/course/:courseId', protect, certificateController.getCourseCertificate);
// Protected: get QR code for owned certificate
router.get('/course/:courseId/qr', protect, certificateController.getCertificateQR);

module.exports = router;
