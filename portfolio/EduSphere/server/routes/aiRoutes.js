const express = require('express');
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/ask', aiController.askAITutor);
router.post('/generate-quiz', aiController.generateQuizFromNotes);

// Conversation persistence
router.post('/conversations', aiController.saveConversation);
router.get('/conversations', aiController.getConversations);
router.delete('/conversations', aiController.clearConversations);

module.exports = router;
