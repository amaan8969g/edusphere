const express = require('express');
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected: fetch messages for a room
router.get('/rooms/:room/messages', protect, chatController.getRoomMessages);
// Protected: post message
router.post('/rooms/:room/messages', protect, chatController.postMessage);

module.exports = router;
