const mongoose = require('mongoose');

const pingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => `ping_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    },
    userId: {
      type: String,
      index: true
    },
    type: {
      type: String,
      enum: ['price_alert', 'reminder', 'ai_suggestion', 'social', 'system'],
      default: 'system'
    },
    badge: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString()
    },
    read: {
      type: Boolean,
      default: false
    },
    action: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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

const Ping = mongoose.model('Ping', pingSchema);

module.exports = Ping;
