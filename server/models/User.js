const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: 'Member'
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'away', 'busy'],
      default: 'online'
    },
    location: {
      type: String,
      default: ''
    },
    dob: {
      type: String,
      default: ''
    },
    gallery: {
      type: Array,
      default: []
    },
    profileSetupCompleted: {
      type: Boolean,
      default: false
    },
    joinedDate: {
      type: String,
      default: () => new Date().getFullYear().toString()
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

const User = mongoose.model('User', userSchema);

module.exports = User;
