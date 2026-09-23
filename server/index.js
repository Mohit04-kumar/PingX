const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Database configuration & models
const connectDB = require('./config/db');
const seedDatabase = require('./seed');
const User = require('./models/User');
const Chat = require('./models/Chat');
const FriendRequest = require('./models/FriendRequest');
const Product = require('./models/Product');
const data = require('./data'); // In-memory fallback if DB is disconnected
const smsService = require('./services/smsService');
const aiService = require('./services/aiService');
const emailService = require('./services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_pingx_secret';
const PORT = process.env.PORT || 4001;

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Secure In-Memory Cache for Phone OTP Generation & Verification
// Key: cleanPhone -> Value: { codeHash, expiresAt, attempts, lastSentAt, purpose, verified, verificationToken }
const otpStore = new Map();

// Periodic cleanup of expired OTPs every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [phone, rec] of otpStore.entries()) {
    if (now > rec.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 2 * 60 * 1000);

// Helper to check if Mongoose is connected
const isDbConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// ---------------------------------------------------------------------------
// REST API Endpoints
// ---------------------------------------------------------------------------

// Health check & DB status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected() ? 'connected (MongoDB)' : 'in-memory fallback',
    timestamp: new Date().toISOString()
  });
});

// Search / list users
app.get('/api/users', async (req, res) => {
  try {
    const q = String(req.query.query || '').trim();
    if (isDbConnected()) {
      let queryObj = {};
      if (q) {
        const regex = new RegExp(q, 'i');
        queryObj = {
          $or: [{ name: regex }, { username: regex }, { email: regex }]
        };
      }
      const users = await User.find(queryObj).limit(50).lean();
      return res.json(users);
    }

    // Fallback
    if (!q) return res.json(data.accounts);
    const matches = data.accounts.filter(
      (a) =>
        (a.name || '').toLowerCase().includes(q.toLowerCase()) ||
        (a.username || '').toLowerCase().includes(q.toLowerCase()) ||
        (a.email || '').toLowerCase().includes(q.toLowerCase())
    );
    res.json(matches);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Helper to clean phone format
const sanitizePhone = (rawPhone) => {
  return String(rawPhone || '').replace(/[\s()-]/g, '');
};

// ---------------------------------------------------------------------------
// Secure Phone OTP Endpoints (Backend Generation & Cryptographic Verification)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Secure Email & Identity OTP Endpoints (Gmail SMTP / Nodemailer)
// ---------------------------------------------------------------------------

// Helper to extract clean email or phone identity
const extractIdentity = (body = {}) => {
  const raw = String(body.email || body.identity || body.phone || '').trim();
  if (raw.includes('@')) {
    return { type: 'email', key: raw.toLowerCase() };
  }
  const cleanPhone = sanitizePhone(raw);
  return { type: 'phone', key: cleanPhone };
};

// 1. Send 6-Digit OTP to Email (or Phone)
app.post('/api/auth/otp/send', async (req, res) => {
  try {
    const { email, phone, identity, purpose = 'registration' } = req.body || {};
    const idObj = extractIdentity({ email, phone, identity });

    if (!idObj.key) {
      return res.status(400).json({ error: 'Email address is required to receive verification code.' });
    }

    if (idObj.type === 'email') {
      if (!idObj.key.includes('@') || !idObj.key.includes('.')) {
        return res.status(400).json({ error: 'Please enter a valid email address (e.g. name@gmail.com).' });
      }
    } else if (idObj.key.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number or email.' });
    }

    // Rate limiting: 10 seconds cooldown between requests
    const existing = otpStore.get(idObj.key);
    if (existing && Date.now() - existing.lastSentAt < 10000) {
      const waitSec = Math.ceil((10000 - (Date.now() - existing.lastSentAt)) / 1000);
      return res.status(429).json({ 
        error: `Please wait ${waitSec} seconds before requesting a new verification code.` 
      });
    }

    // Generate cryptographically secure 6-digit OTP
    const code = crypto.randomInt(100000, 1000000).toString();
    const codeHash = crypto.createHmac('sha256', JWT_SECRET).update(code).digest('hex');

    // Store in backend cache with 5-minute expiry & max 3 attempt tracker
    otpStore.set(idObj.key, {
      codeHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      lastSentAt: Date.now(),
      purpose,
      verified: false
    });

    if (idObj.type === 'email') {
      // Dispatch OTP via free Gmail SMTP or terminal audit
      const emailRes = await emailService.sendOtpEmail(idObj.key, code, purpose);
      return res.json({
        success: true,
        message: emailRes.provider === 'gmail'
          ? `Verification code dispatched to ${idObj.key} via Gmail SMTP. Please check your inbox!`
          : `Verification code generated for ${idObj.key}. Check server terminal or dev code.`,
        target: idObj.key,
        type: 'email',
        expiresIn: 300,
        provider: emailRes.provider,
        devOtp: code
      });
    } else {
      // Fallback SMS dispatch
      await smsService.sendOtp(idObj.key, code, purpose);
      return res.json({
        success: true,
        message: `Verification code dispatched to ${idObj.key}.`,
        target: idObj.key,
        type: 'phone',
        expiresIn: 300
      });
    }
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP code. Please try again.' });
  }
});

// 2. Verify Email (or Phone) OTP
app.post('/api/auth/otp/verify', async (req, res) => {
  try {
    const { email, phone, identity, code } = req.body || {};
    const idObj = extractIdentity({ email, phone, identity });
    const trimmedCode = String(code || '').trim();

    if (!idObj.key || !trimmedCode) {
      return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
    }

    const record = otpStore.get(idObj.key);

    if (!record) {
      return res.status(400).json({ 
        error: `No active verification request found for ${idObj.key}. Please click "Send Code" first.` 
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(idObj.key);
      return res.status(400).json({ error: 'Verification code has expired (valid 5 mins). Please request a new one.' });
    }

    if (record.attempts >= 3) {
      otpStore.delete(idObj.key);
      return res.status(429).json({ 
        error: 'Too many incorrect attempts. Code invalidated for security. Please request a new code.' 
      });
    }

    const testHash = crypto.createHmac('sha256', JWT_SECRET).update(trimmedCode).digest('hex');
    if (testHash !== record.codeHash) {
      record.attempts += 1;
      const remaining = 3 - record.attempts;
      return res.status(400).json({
        error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
      });
    }

    // Mark as verified and issue a cryptographically signed verification token (valid 15m)
    const verificationToken = jwt.sign(
      { identity: idObj.key, email: idObj.type === 'email' ? idObj.key : undefined, verified: true, type: 'email_verification' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    record.verified = true;
    record.verificationToken = verificationToken;

    return res.json({
      success: true,
      verified: true,
      message: `${idObj.type === 'email' ? 'Email' : 'Phone'} successfully verified!`,
      verificationToken
    });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// 3. Direct Email (or Phone) OTP Sign-In
app.post('/api/auth/otp/login', async (req, res) => {
  try {
    const { email, phone, identity, code } = req.body || {};
    const idObj = extractIdentity({ email, phone, identity });
    const trimmedCode = String(code || '').trim();

    if (!idObj.key || !trimmedCode) {
      return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
    }

    const record = otpStore.get(idObj.key);

    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'OTP expired or not requested. Please request a new code.' });
    }

    const testHash = crypto.createHmac('sha256', JWT_SECRET).update(trimmedCode).digest('hex');
    if (testHash !== record.codeHash) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    // Look up user by email or phone
    let found = null;
    if (isDbConnected()) {
      found = await User.findOne(
        idObj.type === 'email' 
          ? { email: idObj.key } 
          : { phone: idObj.key }
      ).lean();
    } else {
      found = data.accounts.find((a) => 
        idObj.type === 'email' 
          ? (a.email || '').toLowerCase() === idObj.key.toLowerCase()
          : sanitizePhone(a.phone) === idObj.key
      );
    }

    if (!found) {
      const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const cleanName = idObj.type === 'email' ? idObj.key.split('@')[0] : `User ${idObj.key.slice(-4)}`;
      found = {
        id,
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        username: cleanName.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email: idObj.type === 'email' ? idObj.key : `${idObj.key.replace(/\D/g, '')}@pingx.sms`,
        phone: idObj.type === 'phone' ? idObj.key : '',
        phoneVerified: idObj.type === 'phone',
        emailVerified: true,
        gender: '',
        dob: '',
        role: 'Member',
        status: 'online',
        joinedDate: new Date().getFullYear().toString()
      };
      if (isDbConnected()) {
        const doc = await User.create(found);
        found = doc.toJSON();
      } else {
        data.accounts.unshift(found);
      }
    }

    otpStore.delete(idObj.key);
    const token = jwt.sign({ sub: found.id }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, user: found, message: 'Signed in successfully via Email OTP.' });
  } catch (err) {
    console.error('Error logging in with OTP:', err);
    res.status(500).json({ error: 'OTP login failed.' });
  }
});

// 4. Firebase Phone Authentication Sign-In / User Provisioning
app.post('/api/auth/firebase/login', async (req, res) => {
  try {
    const { phoneNumber, idToken, uid, name, email } = req.body || {};
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Verified phone number is required.' });
    }

    const cleanPh = sanitizePhone(phoneNumber);
    let found = null;

    if (isDbConnected()) {
      found = await User.findOne({
        $or: [
          { phone: cleanPh },
          { phone: phoneNumber }
        ]
      }).lean();
    } else {
      found = data.accounts.find(
        (a) => a.phone && (sanitizePhone(a.phone) === cleanPh || a.phone === phoneNumber)
      );
    }

    if (!found) {
      // Auto-provision user account for first-time phone sign in
      const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const cleanDigits = cleanPh.replace(/\D/g, '');
      const fallbackName = name || `User ${cleanDigits.slice(-4) || 'PingX'}`;
      const fallbackUsername = `user_${cleanDigits.slice(-6) || Math.random().toString(36).substring(2, 7)}`;
      const fallbackEmail = email || `${cleanDigits || id}@pingx.internal`;

      found = {
        id,
        name: fallbackName,
        username: fallbackUsername,
        email: fallbackEmail,
        phone: cleanPh || phoneNumber,
        phoneVerified: true,
        firebaseUid: uid || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanPh || id}`,
        bio: 'PingX Member',
        status: 'online',
        joinedDate: new Date().getFullYear().toString()
      };

      if (isDbConnected()) {
        await User.create(found);
      } else {
        data.accounts.unshift(found);
      }
    }

    const token = jwt.sign({ sub: found.id }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, user: found, message: 'Signed in successfully via Firebase Phone Auth.' });
  } catch (err) {
    console.error('Firebase phone login error:', err);
    res.status(500).json({ error: 'Firebase authentication failed.' });
  }
});

// ---------------------------------------------------------------------------
// Standard Auth Endpoints (Register & Login)
// ---------------------------------------------------------------------------

app.post('/api/auth/login', async (req, res) => {
  try {
    const { identity, password } = req.body || {};
    if (!identity) return res.status(400).json({ error: 'Missing identity' });

    const trimmed = String(identity).trim();
    const cleanPh = sanitizePhone(trimmed);
    let found = null;

    if (isDbConnected()) {
      found = await User.findOne({
        $or: [
          { email: new RegExp(`^${trimmed}$`, 'i') },
          { username: new RegExp(`^${trimmed}$`, 'i') },
          { phone: cleanPh },
          { id: trimmed }
        ]
      }).lean();
    } else {
      found = data.accounts.find(
        (a) =>
          a.email?.toLowerCase() === trimmed.toLowerCase() ||
          a.username?.toLowerCase() === trimmed.toLowerCase() ||
          (a.phone && sanitizePhone(a.phone) === cleanPh) ||
          a.id === trimmed
      );
    }

    // If password provided and user has a password set, verify matching
    if (found && found.password && password && found.password !== password) {
      return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
    }

    if (!found) {
      return res.status(404).json({ error: 'Account not found. Please register first.' });
    }

    const token = jwt.sign({ sub: found.id }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, user: found });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      name, 
      username, 
      email, 
      password, 
      phone = '', 
      phoneVerified = false,
      gender, 
      dob, 
      verificationToken,
      firebaseToken,
      firebaseUid,
      avatar, 
      bio, 
      location 
    } = req.body || {};

    if (!name || !username || !email) {
      return res.status(400).json({ error: 'Name, username, and email are required fields.' });
    }

    if (!gender) {
      return res.status(400).json({ error: 'Please specify your gender.' });
    }

    if (!dob) {
      return res.status(400).json({ error: 'Please provide your date of birth.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? sanitizePhone(phone) : '';

    // Verify contact (Firebase Phone Auth or OTP Token)
    let isContactVerified = Boolean(phoneVerified || firebaseToken);

    if (verificationToken) {
      try {
        const decoded = jwt.verify(verificationToken, JWT_SECRET);
        if (
          decoded.verified && 
          (decoded.email === cleanEmail || decoded.identity === cleanEmail || decoded.identity === cleanPhone)
        ) {
          isContactVerified = true;
        }
      } catch (err) {
        console.warn('Invalid verification token passed:', err.message);
      }
    }

    if (cleanPhone) {
      const phoneRecord = otpStore.get(cleanPhone);
      if (phoneRecord && phoneRecord.verified) {
        isContactVerified = true;
      }
    }

    const emailRecord = otpStore.get(cleanEmail);
    if (emailRecord && emailRecord.verified) {
      isContactVerified = true;
    }

    if (!isContactVerified) {
      return res.status(400).json({ 
        error: 'Phone number or email has not been verified yet. Please complete OTP verification.' 
      });
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newUserData = {
      id,
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: password || '',
      phone: cleanPhone,
      phoneVerified: true,
      gender: gender.trim(),
      dob: dob.trim(),
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username.trim())}`,
      bio: bio || 'PingX Member',
      location: location || 'India',
      profileSetupCompleted: true,
      gallery: [],
      status: 'online',
      joinedDate: new Date().getFullYear().toString()
    };

    let createdUser = null;
    if (isDbConnected()) {
      // Check if username, email or phone already exists
      const existing = await User.findOne({
        $or: [
          { email: newUserData.email }, 
          { username: newUserData.username },
          { phone: newUserData.phone }
        ]
      });
      if (existing) {
        return res.status(409).json({ error: 'Email, username, or phone number already registered.' });
      } else {
        const doc = await User.create(newUserData);
        createdUser = doc.toJSON();
      }
    } else {
      data.accounts.unshift(newUserData);
      createdUser = newUserData;
    }

    // Clean up OTP session upon successful registration
    otpStore.delete(cleanPhone);

    const token = jwt.sign({ sub: createdUser.id }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ 
      success: true, 
      token, 
      user: createdUser,
      message: 'Account successfully registered and verified.' 
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Registration failed: ' + (err.message || 'Server error') });
  }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData._id;

    if (isDbConnected()) {
      const updated = await User.findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      ).lean();
      if (!updated) return res.status(404).json({ error: 'User not found' });
      return res.json({ success: true, user: updated });
    }

    const idx = data.accounts.findIndex((a) => a.id === id);
    if (idx !== -1) {
      data.accounts[idx] = { ...data.accounts[idx], ...updateData };
      return res.json({ success: true, user: data.accounts[idx] });
    }
    return res.status(404).json({ error: 'User not found' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Authentication middleware
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid authorization' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Friend Requests
app.post('/api/friend-request', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body || {};
    if (!senderId || !receiverId || senderId === receiverId) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters' });
    }

    if (isDbConnected()) {
      const exists = await FriendRequest.findOne({
        senderId,
        receiverId,
        status: { $in: ['pending', 'accepted'] }
      });
      if (exists) return res.json({ success: false, error: 'Already requested' });

      const newReq = await FriendRequest.create({
        id: `req_${Date.now()}`,
        senderId,
        receiverId,
        status: 'pending'
      });
      return res.json({ success: true, request: newReq.toJSON() });
    }

    // Fallback
    const exists = data.friendRequests.find(
      (r) => r.senderId === senderId && r.receiverId === receiverId && ['pending', 'accepted'].includes(r.status)
    );
    if (exists) return res.json({ success: false, error: 'Already requested' });

    const newReq = { id: `req_${Date.now()}`, senderId, receiverId, status: 'pending', createdAt: new Date().toISOString() };
    data.friendRequests.unshift(newReq);
    res.json({ success: true, request: newReq });
  } catch (err) {
    console.error('Error in friend-request:', err);
    res.status(500).json({ success: false, error: 'Friend request failed' });
  }
});

app.post('/api/respond-request', async (req, res) => {
  try {
    const { requestId, status } = req.body || {};
    if (!requestId || !['accepted', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' });
    }

    let createdChat = null;

    if (isDbConnected()) {
      const reqObj = await FriendRequest.findOneAndUpdate({ id: requestId }, { status }, { new: true });
      if (reqObj && status === 'accepted') {
        const participants = [reqObj.senderId, reqObj.receiverId];
        const existingChat = await Chat.findOne({
          participants: { $all: participants, $size: 2 },
          type: 'direct'
        });

        if (existingChat) {
          createdChat = existingChat.toJSON();
        } else {
          const newChatDoc = await Chat.create({
            id: `chat_${Date.now()}`,
            participants,
            type: 'direct',
            messages: []
          });
          createdChat = newChatDoc.toJSON();
        }
      }
      return res.json({ success: true, chat: createdChat });
    }

    // Fallback
    data.friendRequests.forEach((r) => {
      if (r.id === requestId) r.status = status;
    });

    if (status === 'accepted') {
      const reqObj = data.friendRequests.find((r) => r.id === requestId);
      if (reqObj) {
        const participants = [reqObj.senderId, reqObj.receiverId];
        createdChat = data.createChat({ participants, type: 'direct', messages: [] });
      }
    }
    return res.json({ success: true, chat: createdChat });
  } catch (err) {
    console.error('Error responding to request:', err);
    res.status(500).json({ success: false, error: 'Failed to respond to request' });
  }
});

// Chats endpoints
app.get('/api/chats', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    if (isDbConnected()) {
      const userChats = await Chat.find({ participants: userId }).sort({ updatedAt: -1 }).lean();
      return res.json(userChats);
    }
    const chats = data.getChatsForUser(userId);
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

app.get('/api/chats/:id/messages', authenticate, async (req, res) => {
  try {
    const chatId = req.params.id;
    if (isDbConnected()) {
      const chat = await Chat.findOne({ id: chatId }).lean();
      return res.json(chat ? chat.messages || [] : []);
    }
    const msgs = data.getMessages(chatId);
    res.json(msgs || []);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/chats/:id/messages', authenticate, async (req, res) => {
  try {
    const chatId = req.params.id;
    const message = req.body?.message;
    if (!message) return res.status(400).json({ success: false, error: 'Missing message' });

    if (isDbConnected()) {
      await Chat.findOneAndUpdate(
        { id: chatId },
        {
          $push: { messages: message },
          $set: { lastMessage: message }
        },
        { upsert: true, new: true }
      );
    } else {
      data.addMessageToChat(chatId, message);
    }

    try {
      io.to(chatId).emit('message', message);
    } catch {}

    res.json({ success: true });
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ success: false, error: 'Failed to save message' });
  }
});

app.post('/api/chats', authenticate, async (req, res) => {
  try {
    const { participants, type, title } = req.body || {};
    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: 'Missing participants' });
    }

    if (isDbConnected()) {
      const newChat = await Chat.create({
        id: `chat_${Date.now()}`,
        participants,
        type: type || 'direct',
        title: title || '',
        messages: []
      });
      return res.json({ success: true, chat: newChat.toJSON() });
    }

    const chat = data.createChat({ participants, type: type || 'direct', messages: [] });
    res.json({ success: true, chat });
  } catch (err) {
    console.error('Error creating chat:', err);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Products & Smart Shop endpoints
app.get('/api/products', async (req, res) => {
  try {
    const q = String(req.query.query || '').trim();
    if (isDbConnected()) {
      let queryObj = {};
      if (q) {
        const regex = new RegExp(q, 'i');
        queryObj = {
          $or: [{ name: regex }, { title: regex }, { category: regex }, { subCategory: regex }]
        };
      }
      const products = await Product.find(queryObj).limit(50).lean();
      return res.json(products);
    }

    const results = data.searchProducts(q);
    res.json(results);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Product comparison endpoint
app.post('/api/compare', async (req, res) => {
  try {
    const { products = [], query = '' } = req.body || {};
    const q = String(query || '').toLowerCase();
    let matches = [];

    if (isDbConnected()) {
      if (q) {
        matches = await Product.find({
          $or: [{ name: new RegExp(q, 'i') }, { title: new RegExp(q, 'i') }]
        }).limit(6).lean();
      }
    } else if (q) {
      data.PRODUCT_DATABASE.forEach((p) => {
        const title = String(p.title || p.name || '').toLowerCase();
        if (title.includes(q)) matches.push(p);
      });
    }

    const combined = [...products, ...matches].slice(0, 6);
    const result = combined.map((p, idx) => ({
      id: p.id || `p_${idx}`,
      title: p.title || p.name || `Product ${idx + 1}`,
      bestPrice: p.price || Math.floor(1000 + Math.random() * 90000),
      stores: p.merchants && p.merchants.length > 0 ? p.merchants : [
        { store: 'Amazon', price: p.price || Math.floor(1000 + Math.random() * 90000), url: p.url || 'https://amazon.in' },
        { store: 'Flipkart', price: p.price ? p.price + 500 : Math.floor(1000 + Math.random() * 90000), url: p.url || 'https://flipkart.com' }
      ]
    }));

    res.json({ success: true, query, results: result });
  } catch (err) {
    console.error('Error in compare endpoint:', err);
    res.status(500).json({ success: false, error: 'Comparison failed' });
  }
});

// ---------------------------------------------------------------------------
// AI Assistant Backend Proxy & Tool-Grounding Endpoints
// ---------------------------------------------------------------------------

// 1. Primary AI Chat Proxy with Tool-Grounding & Image Multimodal Support
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { 
      prompt = '', 
      imageBase64 = null, 
      mode = 'chatgpt', 
      contextType = 'general', 
      contextItem = null,
      history = []
    } = req.body || {};

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required.' });
    }

    const result = await aiService.generateChatResponse({
      prompt,
      imageBase64,
      mode,
      contextType,
      contextItem,
      history
    });

    return res.json({
      success: true,
      reply: result.reply,
      model: result.model,
      products: result.products || [],
      suggestions: result.suggestions || []
    });
  } catch (err) {
    console.error('Error in /api/ai/chat:', err);
    return res.status(500).json({
      success: false,
      error: 'AI assistant service encountered an error.',
      reply: 'PingX AI is temporarily unavailable. Please try your query again.',
      model: 'fallback'
    });
  }
});

// 2. Chat Summarizer & Action Item Extraction Tool
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { messages = [], conversationTitle = 'Chat' } = req.body || {};
    const result = await aiService.summarizeConversation({ messages, conversationTitle });
    return res.json({
      success: true,
      summary: result.summary,
      keyDecisions: result.keyDecisions || [],
      actionItems: result.actionItems || []
    });
  } catch (err) {
    console.error('Error in /api/ai/summarize:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to summarize conversation'
    });
  }
});

// 3. Smart Shop Products Query for AI Assistant Tool Grounding
app.post('/api/ai/products', (req, res) => {
  const { query = '' } = req.body || {};
  const results = aiService.searchProductsTool(query);
  return res.json({ success: true, products: results });
});

// 4. Backward Compatibility Proxy
app.post('/api/ai', async (req, res) => {
  try {
    const { prompt = '' } = req.body || {};
    const result = await aiService.generateChatResponse({ prompt });
    return res.json({ candidates: [{ content: { parts: [{ text: result.reply }] } }] });
  } catch (e) {
    return res.status(500).json({ error: 'AI proxy failed' });
  }
});

// ---------------------------------------------------------------------------
// HTTP Server & Socket.IO Real-Time Engine
// ---------------------------------------------------------------------------

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const activeUsers = new Map();

io.on('connection', (socket) => {
  let currentUserId = null;

  try {
    const token = socket.handshake.auth?.token;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      currentUserId = decoded.sub || decoded.id;
      if (currentUserId) {
        socket.userId = currentUserId;
        activeUsers.set(currentUserId, socket.id);
        io.emit('online_users', Array.from(activeUsers.keys()));
      }
    }
  } catch (e) {}

  socket.on('register_user', (userId) => {
    if (userId) {
      currentUserId = userId;
      activeUsers.set(userId, socket.id);
      io.emit('online_users', Array.from(activeUsers.keys()));
    }
  });

  socket.on('join', (room) => {
    socket.join(room);
  });

  socket.on('leave', (room) => {
    socket.leave(room);
  });

  socket.on('send_message', async (payload) => {
    const { room, message } = payload || {};
    if (!room || !message) return;

    if (isDbConnected()) {
      try {
        await Chat.findOneAndUpdate(
          { id: room },
          {
            $push: { messages: message },
            $set: { lastMessage: message }
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('Socket message persist error:', err);
      }
    } else {
      data.addMessageToChat(room, message);
    }

    io.to(room).emit('message', message);
  });

  socket.on('typing', ({ room, userId, username }) => {
    if (room) {
      socket.to(room).emit('user_typing', { userId, username, isTyping: true });
    }
  });

  socket.on('stop_typing', ({ room, userId, username }) => {
    if (room) {
      socket.to(room).emit('user_typing', { userId, username, isTyping: false });
    }
  });

  socket.on('read_receipt', async ({ room, messageId, userId }) => {
    if (room && messageId) {
      if (isDbConnected()) {
        try {
          await Chat.updateOne(
            { id: room, 'messages.id': messageId },
            { $set: { 'messages.$.status': 'read' } }
          );
        } catch (e) {}
      }
      io.to(room).emit('message_read', { messageId, userId, readAt: new Date().toISOString() });
    }
  });

  socket.on('react_message', ({ room, messageId, emoji, userId }) => {
    if (room && messageId && emoji) {
      io.to(room).emit('reaction_updated', { messageId, emoji, userId });
    }
  });

  socket.on('delete_message', ({ room, messageId }) => {
    if (room && messageId) {
      io.to(room).emit('message_deleted', { messageId });
    }
  });

  socket.on('disconnect', () => {
    if (currentUserId && activeUsers.get(currentUserId) === socket.id) {
      activeUsers.delete(currentUserId);
      io.emit('online_users', Array.from(activeUsers.keys()));
    }
  });
});

// ---------------------------------------------------------------------------
// Server Bootstrap
// ---------------------------------------------------------------------------

const startServer = async () => {
  // Connect to MongoDB
  const conn = await connectDB();
  if (conn) {
    await seedDatabase();
  }

  server.listen(PORT, () => {
    console.log(`🚀 PingX Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO initialized for real-time chat`);
    console.log(`💾 Storage Engine: ${conn ? 'MongoDB (Mongoose)' : 'In-Memory State'}`);
  });
};

startServer();
