const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['user', 'ai'], required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const aiConversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseTitle: { type: String },
    lessonTitle: { type: String },
    messages: { type: [messageSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

const AIConversation = mongoose.model('AIConversation', aiConversationSchema);
module.exports = AIConversation;
