const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    },
    senderId: {
      type: String,
      required: true,
      index: true
    },
    receiverId: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
      index: true
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

// Compound index to prevent duplicate pending requests
friendRequestSchema.index({ senderId: 1, receiverId: 1, status: 1 });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
