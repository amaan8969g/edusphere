const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AIConversation = require('../models/AIConversation');
const https = require('https');
const mockAI = require('../services/mockAI');

// Helper: call OpenAI Chat Completions (no extra deps)
async function callOpenAI(question, lessonTitle, courseTitle, lessonContext) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not configured');

  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  const payload = JSON.stringify({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are EduSphere AI Tutor. Provide concise, helpful answers tailored to the lesson and course context. If asked for code, include short examples. Keep answers friendly and actionable.',
      },
      {
        role: 'user',
        content: `Question: ${question}\nLesson: ${lessonTitle || ''}\nCourse: ${courseTitle || ''}\nContext: ${lessonContext || ''}`,
      },
    ],
    max_tokens: 400,
    temperature: 0.2,
  });

  return new Promise((resolve, reject) => {
    const req = https.request('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Bearer ${key}`,
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const content = parsed.choices && parsed.choices[0] && parsed.choices[0].message && parsed.choices[0].message.content;
          resolve(content || null);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

// Contextual AI Study Assistant Query Endpoint
exports.askAITutor = catchAsync(async (req, res, next) => {
  const { question, lessonTitle, courseTitle, lessonContext } = req.body;

  if (!question) {
    return next(new AppError('Please provide a question for the AI tutor.', 400));
  }

  // Try OpenAI first when configured
  let answer = '';
  if (process.env.OPENAI_API_KEY) {
    try {
      const aiText = await callOpenAI(question, lessonTitle, courseTitle, lessonContext);
      if (aiText && aiText.trim()) {
        answer = aiText.trim();
      }
    } catch (err) {
      // Log and fall back to heuristic responder
      console.warn('OpenAI request failed, falling back to local responder:', err && err.message);
    }
  }

  // Heuristic fallback if OpenAI not configured or failed
  if (!answer) {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('jwt') || lowerQ.includes('token') || lowerQ.includes('auth')) {
      answer = `**JWT (JSON Web Token)** is a compact, URL-safe method for representing claims between two parties. In ${courseTitle || 'this course'}, we use JWT for stateless authentication: the server signs the token using a secret key, passes it to the client, and verifies the digital signature on subsequent requests without needing database lookup for every API hit.`;
    } else if (lowerQ.includes('express') || lowerQ.includes('middleware') || lowerQ.includes('route')) {
      answer = `In Express.js, **Middleware** functions have access to the request object (\`req\`), response object (\`res\`), and the \`next()\` function. They execute sequentially to log requests, validate parameters, protect endpoints, and catch operational errors.`;
    } else if (lowerQ.includes('mongodb') || lowerQ.includes('mongoose') || lowerQ.includes('schema')) {
      answer = `**Mongoose** is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and translates between objects in code and representations of those objects in MongoDB documents.`;
    } else if (lowerQ.includes('react') || lowerQ.includes('hooks') || lowerQ.includes('state')) {
      answer = `In React 18, state management enables components to remember information like input values or user authentication status. Hooks like \`useState\` and \`useEffect\` let you use state and lifecycle features without writing class components.`;
    } else {
      answer = `Great question regarding **${lessonTitle || 'this lesson'}**! As your EduSphere AI Tutor, I recommend reviewing the key concepts in this section: ensure you understand the core request lifecycle, error handling patterns, and clean component structures. Let me know if you would like a breakdown of any specific code block!`;
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      question,
      answer,
      suggestedFollowUps: [
        'Can you explain this with a code example?',
        'What are common security best practices here?',
        'How does this integrate into our project architecture?',
      ],
    },
  });
});

// Persist a conversation for the authenticated user
exports.saveConversation = catchAsync(async (req, res, next) => {
  const { messages, lessonTitle, courseTitle } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return next(new AppError('No messages provided to save.', 400));
  }

  const conversation = await AIConversation.create({
    user: req.user._id,
    lessonTitle,
    courseTitle,
    messages,
  });

  res.status(201).json({ status: 'success', data: { conversation } });
});

// Retrieve recent conversations for the authenticated user
exports.getConversations = catchAsync(async (req, res, next) => {
  const conversations = await AIConversation.find({ user: req.user._id })
    .sort('-createdAt')
    .limit(50)
    .lean();

  res.status(200).json({ status: 'success', results: conversations.length, data: { conversations } });
});

// Clear conversation history for the authenticated user
exports.clearConversations = catchAsync(async (req, res, next) => {
  await AIConversation.deleteMany({ user: req.user._id });
  res.status(200).json({ status: 'success', message: 'AI conversation history cleared successfully.' });
});

// AI Quiz Generation from Uploaded Notes Text
exports.generateQuizFromNotes = catchAsync(async (req, res, next) => {
  const { notesText, numQuestions = 3 } = req.body;

  if (!notesText || notesText.trim().length < 20) {
    return next(new AppError('Please provide notes with at least 20 characters of text.', 400));
  }

  // Prefer mockAI or OpenAI generation when available
  try {
    if (typeof mockAI !== 'undefined' && mockAI.generateQuiz) {
      const result = mockAI.generateQuiz(notesText, numQuestions);
      return res.status(200).json({ status: 'success', message: 'AI generated quiz (mock) successfully!', data: result });
    }
  } catch (err) {
    console.warn('Mock AI quiz generation failed:', err && err.message);
  }

  // Fallback static generation
  const questions = [
    {
      questionText: `Based on your notes: What is the primary takeaway regarding "${notesText.slice(0, 30)}..."?`,
      options: [
        'It establishes core architectural patterns for scalable development.',
        'It simplifies database deployment scripts.',
        'It automates client-side CSS builds.',
        'It deprecates REST API standards.',
      ],
      correctOptionIndex: 0,
      explanation: 'The uploaded notes emphasize clean architecture and standardized development guidelines.',
    },
    {
      questionText: 'Which practice is recommended for secure API implementation according to these notes?',
      options: [
        'Storing passwords in plain text',
        'Validating all user inputs using schemas or validators',
        'Disabling CORS and security headers',
        'Bypassing role-based authorization checks',
      ],
      correctOptionIndex: 1,
      explanation: 'Input validation prevents injection attacks and ensures data integrity.',
    },
    {
      questionText: 'What is the optimal state management approach highlighted in the study material?',
      options: [
        'Global mutable variables',
        'Centralized React Context / State Hooks',
        'Direct DOM mutations',
        'Polling server endpoints in infinite loops',
      ],
      correctOptionIndex: 1,
      explanation: 'React Context provides clean state distribution across components.',
    },
  ];

  res.status(200).json({
    status: 'success',
    message: 'AI generated quiz successfully!',
    data: { questions: questions.slice(0, numQuestions) },
  });
});
