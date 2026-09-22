const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  },
  senderId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    default: 'User'
  },
  content: {
    type: String,
    default: ''
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  timestamp: {
    type: String,
    default: () => new Date().toISOString()
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  reactions: [
    {
      emoji: String,
      count: Number,
      users: [String]
    }
  ]
});

const chatSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    },
    type: {
      type: String,
      enum: ['direct', 'group'],
      default: 'direct'
    },
    title: {
      type: String,
      default: ''
    },
    groupAvatar: {
      type: String,
      default: ''
    },
    participants: {
      type: [String],
      required: true,
      index: true
    },
    messages: [messageSchema],
    lastMessage: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
