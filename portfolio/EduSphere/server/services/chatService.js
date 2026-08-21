const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');

let io;

function init(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  });

  io.use(async (socket, next) => {
    try {
      // Accept token via handshake.auth.token for Socket.io v4
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return next(); // allow anonymous for dev

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'edusphere_jwt_secret_key_production_grade_998811');
      const user = await User.findById(decoded.id).select('-password');
      if (user) socket.user = user;
      return next();
    } catch (err) {
      return next();
    }
  });

  io.on('connection', (socket) => {
    console.log('[Socket.IO] Client connected:', socket.id, socket.user ? socket.user.email : 'anonymous');

    socket.on('joinRoom', async (room) => {
      socket.join(room);
      socket.currentRoom = room;
      socket.emit('joined', room);
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      delete socket.currentRoom;
    });

    socket.on('chat.message', async (payload) => {
      // payload: { room, text }
      const room = payload.room || socket.currentRoom;
      const text = payload.text || '';
      if (!room || !text.trim()) return;

      // Save message when user known
      let saved = null;
      try {
        if (socket.user) {
          saved = await ChatMessage.create({ room, sender: socket.user._id, text, meta: {} });
        }
      } catch (err) {
        console.warn('Failed to save chat message:', err && err.message);
      }

      const out = {
        room,
        text,
        sender: socket.user ? { id: socket.user._id, name: socket.user.name } : { id: null, name: 'Anonymous' },
        createdAt: saved ? saved.createdAt : new Date().toISOString(),
      };

      io.to(room).emit('chat.message', out);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Client disconnected:', socket.id, reason);
    });
  });
}

function getIO() {
  return io;
}

module.exports = { init, getIO };