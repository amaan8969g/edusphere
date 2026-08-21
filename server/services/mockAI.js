// Simple mock AI provider for development
// Exports generateAnswer and generateQuiz functions used as a lightweight replacement for OpenAI.

function generateAnswer(question, lessonTitle = '', courseTitle = '', lessonContext = '') {
  const q = (question || '').toLowerCase();

  if (q.includes('jwt') || q.includes('token') || q.includes('auth')) {
    return `**Mock AI:** JWTs (JSON Web Tokens) are signed tokens commonly used for stateless auth. Server signs with a secret; clients include in Authorization header. Verify signature server-side.`;
  }

  if (q.includes('express') || q.includes('middleware') || q.includes('route')) {
    return `**Mock AI:** Express middleware runs between request and route handlers; use it for auth, validation, and error handling. Call next() to pass control.`;
  }

  if (q.includes('mongodb') || q.includes('mongoose') || q.includes('schema')) {
    return `**Mock AI:** Mongoose provides schemas, validation, and model helpers over MongoDB. Define models then use them to query documents.`;
  }

  if (q.includes('react') || q.includes('hooks') || q.includes('state')) {
    return `**Mock AI:** React hooks like useState and useEffect let you manage state and side-effects in functional components.`;
  }

  // Generic contextual reply
  return `**Mock AI Tutor:** For **${lessonTitle || 'this lesson'}** in ${courseTitle || 'the course'}, start by reviewing key concepts, then ask for a concise example or clarification on any step.`;
}

function generateQuiz(notesText = '', numQuestions = 3) {
  const base = notesText.slice(0, 60).replace(/\s+/g, ' ').trim() || 'the provided notes';
  const questions = [];
  for (let i = 0; i < numQuestions; i++) {
    questions.push({
      questionText: `Mock Q${i + 1}: Based on ${base} what is a key idea?`,
      options: [
        'It emphasizes architecture and patterns',
        'It focuses on build tooling',
        'It is about styling only',
        'It deprecates useful patterns',
      ],
      correctOptionIndex: 0,
      explanation: 'Mock explanation: the notes focus on architectural best-practices.'
    });
  }
  return { questions };
}

module.exports = { generateAnswer, generateQuiz };