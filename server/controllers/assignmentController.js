const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get Assignment by Lesson ID (with auto-seed fallback for demo)
exports.getAssignmentByLesson = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;

  let assignment = await Assignment.findOne({ lesson: lessonId });

  if (!assignment) {
    assignment = await Assignment.create({
      lesson: lessonId,
      title: 'Module Capstone Implementation Assignment',
      instructions: 'Build a sample REST API module following clean controller-service architecture. Submit a ZIP archive or PDF documentation.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      totalPoints: 100,
    });
  }

  // Get logged in student's submission if exists
  const submission = await Submission.findOne({
    assignment: assignment._id,
    student: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: { assignment, submission },
  });
});

// Submit Assignment Solution (File upload / Notes)
exports.submitAssignment = catchAsync(async (req, res, next) => {
  const { assignmentId } = req.params;
  const { notes } = req.body;

  let fileUrl = '';
  if (req.file) {
    fileUrl = `/uploads/submissions/${req.file.filename}`;
  }

  const existing = await Submission.findOne({
    assignment: assignmentId,
    student: req.user.id,
  });

  let submission;
  if (existing) {
    existing.notes = notes || existing.notes;
    if (fileUrl) existing.fileUrl = fileUrl;
    existing.status = 'submitted';
    submission = await existing.save();
  } else {
    submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      fileUrl,
      notes: notes || '',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Assignment submitted successfully!',
    data: { submission },
  });
});

// Grade Submission (Instructor)
exports.gradeSubmission = catchAsync(async (req, res, next) => {
  const { submissionId } = req.params;
  const { grade, feedback } = req.body;

  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    {
      grade,
      feedback,
      status: 'graded',
    },
    { new: true }
  );

  if (!submission) {
    return next(new AppError('Submission not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Submission graded successfully!',
    data: { submission },
  });
});
