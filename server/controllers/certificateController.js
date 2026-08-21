const crypto = require('crypto');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const QRCode = require('qrcode');

// Helper to generate unique certificate code & cryptographic hash
const generateCertData = (studentId, courseId) => {
  const code = `EDU-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const rawString = `${studentId}:${courseId}:${code}:EDUSPHERE_SECRET_2026`;
  const hash = crypto.createHash('sha256').update(rawString).digest('hex');
  return { code, hash };
};

// Issue or Fetch Certificate for a Course
exports.getCourseCertificate = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;

  // Verify course exists
  const course = await Course.findById(courseId).populate('instructor', 'name');
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check enrollment & progress
  const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
  if (!enrollment || enrollment.progressPercentage < 100) {
    return next(
      new AppError('You must complete 100% of course lessons before receiving your certificate.', 400)
    );
  }

  // Check existing certificate
  let certificate = await Certificate.findOne({ student: req.user.id, course: courseId })
    .populate('student', 'name email')
    .populate('course', 'title');

  if (!certificate) {
    const { code, hash } = generateCertData(req.user.id, courseId);
    certificate = await Certificate.create({
      certificateCode: code,
      student: req.user.id,
      course: courseId,
      verificationHash: hash,
    });
    certificate = await certificate.populate([
      { path: 'student', select: 'name email' },
      { path: 'course', select: 'title' },
    ]);
  }

  const certObj = certificate.toObject ? certificate.toObject() : certificate;
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-certificate/${certificate.certificateCode}`;
  let qr = '';
  try {
    qr = await QRCode.toDataURL(verifyUrl);
  } catch (e) {}

  res.status(200).json({
    status: 'success',
    data: { certificate: { ...certObj, verifyUrl, qr } },
  });
});

// Get all certificates earned by current student
exports.getMyCertificates = catchAsync(async (req, res, next) => {
  const certificates = await Certificate.find({ student: req.user.id })
    .populate('student', 'name email avatar')
    .populate('course', 'title instructor thumbnail slug')
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name' },
    })
    .sort('-issueDate')
    .lean();

  const enrichedCertificates = await Promise.all(
    certificates.map(async (cert) => {
      const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-certificate/${cert.certificateCode}`;
      let qr = '';
      try {
        qr = await QRCode.toDataURL(verifyUrl);
      } catch (e) {
        // Fallback gracefully
      }
      return { ...cert, verifyUrl, qr };
    })
  );

  res.status(200).json({
    status: 'success',
    results: enrichedCertificates.length,
    data: { certificates: enrichedCertificates },
  });
});

// Get QR code for a certificate (protected: only owner's certificate)
exports.getCertificateQR = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const certificate = await Certificate.findOne({ student: req.user.id, course: courseId });
  if (!certificate) return next(new AppError('Certificate not found', 404));

  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-certificate/${certificate.certificateCode}`;
  const dataUrl = await QRCode.toDataURL(verifyUrl);

  res.status(200).json({ status: 'success', data: { qr: dataUrl, verifyUrl } });
});


