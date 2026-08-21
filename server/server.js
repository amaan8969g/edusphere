const path = require('path');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorMiddleware');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Initialize Express App
const app = express();

// Trust reverse proxy (for tunnels, Cloudflare, load balancers)
app.set('trust proxy', 1);

// Connect Database (skip during tests)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Security HTTP headers (relaxed CSP for static client & tunnel serving)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.CLIENT_URL) {
        const allowed = process.env.CLIENT_URL.split(',').map((u) => u.trim());
        if (allowed.includes(origin) || allowed.includes('*')) {
          return callback(null, true);
        }
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  max: 200,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!',
});
app.use('/api', limiter);

// Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const debugRoutes = require('./routes/debugRoutes');
const chatRoutes = require('./routes/chatRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const liveRoutes = require('./routes/liveRoutes');
const virtualClassRoutes = require('./routes/virtualClassRoutes');
const articleRoutes = require('./routes/articleRoutes');

// Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EduSphere API Server is running smoothly!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API v1 Mount Points
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/live', liveRoutes);
app.use('/api/v1/classes', virtualClassRoutes);
app.use('/api/v1/articles', articleRoutes);

// Debug / Dev-only routes
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/v1/debug', debugRoutes);
}




// Serve static client production build if available
const clientBuildPath = path.join(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production' || fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Handle Unhandled Routes (e.g. invalid /api/* routes)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

let server;
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EduSphere API] Server listening on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  // Initialize real-time chat (Socket.IO)
  try {
    const chatService = require('./services/chatService');
    chatService.init(server);
    console.log('[Chat] Socket.IO initialized');
  } catch (err) {
    console.warn('[Chat] Failed to initialize Socket.IO:', err && err.message);
  }

  // Handle Unhandled Rejections
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}

module.exports = app;
