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
const Ping = require('./models/Ping');
const data = require('./data'); // In-memory fallback if DB is disconnected

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

// 1. Send OTP to Phone Number
app.post('/api/auth/otp/send', async (req, res) => {
  try {
    const { phone, purpose = 'registration' } = req.body || {};
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const cleanPhone = sanitizePhone(phone);
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid phone number (at least 10 digits).' });
    }

    // Rate limiting: 25 seconds cooldown between sends to prevent SMS spamming
    const existing = otpStore.get(cleanPhone);
    if (existing && Date.now() - existing.lastSentAt < 25000) {
      const waitSec = Math.ceil((25000 - (Date.now() - existing.lastSentAt)) / 1000);
      return res.status(429).json({ 
        error: `Please wait ${waitSec} seconds before requesting a new verification code.` 
      });
    }

    // Generate cryptographically secure 6-digit OTP
    const code = crypto.randomInt(100000, 1000000).toString();
    const codeHash = crypto.createHmac('sha256', JWT_SECRET).update(code).digest('hex');

    // Store in backend cache with 5-minute expiry & max 3 attempt tracker
    otpStore.set(cleanPhone, {
      codeHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      lastSentAt: Date.now(),
      purpose,
      verified: false
    });

    // Simulated SMS Gateway Dispatch Log
    console.log(`\n======================================================`);
    console.log(`📱 [SECURE BACKEND SMS GATEWAY]`);
    console.log(`Target: ${cleanPhone}`);
    console.log(`Purpose: ${purpose}`);
    console.log(`Message: Your PingX verification code is: ${code} (Valid for 5 mins)`);
    console.log(`======================================================\n`);

    return res.json({
      success: true,
      message: `Verification code sent to ${cleanPhone}.`,
      expiresIn: 300,
      previewCode: code // Accessible in development environment for streamlined testing
    });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// 2. Verify Phone OTP
app.post('/api/auth/otp/verify', async (req, res) => {
  try {
    const { phone, code } = req.body || {};
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and verification code are required.' });
    }

    const cleanPhone = sanitizePhone(phone);
    const trimmedCode = String(code).trim();
    const record = otpStore.get(cleanPhone);

    if (!record) {
      return res.status(400).json({ 
        error: 'No active OTP request found for this phone number. Please request a new code.' 
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    if (record.attempts >= 3) {
      otpStore.delete(cleanPhone);
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
      { phone: cleanPhone, verified: true, type: 'phone_verification' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    record.verified = true;
    record.verificationToken = verificationToken;

    return res.json({
      success: true,
      verified: true,
      message: 'Phone number successfully verified by backend service.',
      verificationToken
    });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// 3. Direct Phone OTP Sign-in
app.post('/api/auth/otp/login', async (req, res) => {
  try {
    const { phone, code } = req.body || {};
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and OTP code are required.' });
    }

    const cleanPhone = sanitizePhone(phone);
    const trimmedCode = String(code).trim();
    const record = otpStore.get(cleanPhone);

    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'OTP expired or not requested. Please request a new code.' });
    }

    const testHash = crypto.createHmac('sha256', JWT_SECRET).update(trimmedCode).digest('hex');
    if (testHash !== record.codeHash) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    // Look up user by phone number
    let found = null;
    if (isDbConnected()) {
      found = await User.findOne({ phone: cleanPhone }).lean();
    } else {
      found = data.accounts.find((a) => sanitizePhone(a.phone) === cleanPhone);
    }

    if (!found) {
      const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      found = {
        id,
        name: `User ${cleanPhone.slice(-4)}`,
        username: `user_${cleanPhone.slice(-4)}`,
        email: `${cleanPhone.replace(/\D/g, '')}@pingx.sms`,
        phone: cleanPhone,
        phoneVerified: true,
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

    otpStore.delete(cleanPhone);
    const token = jwt.sign({ sub: found.id }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, user: found, message: 'Signed in successfully via Phone OTP.' });
  } catch (err) {
    console.error('Error logging in with OTP:', err);
    res.status(500).json({ error: 'Phone OTP login failed.' });
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
      phone, 
      gender, 
      dob, 
      verificationToken,
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

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const cleanPhone = sanitizePhone(phone);

    // Verify phone OTP token
    let isPhoneVerified = false;
    if (verificationToken) {
      try {
        const decoded = jwt.verify(verificationToken, JWT_SECRET);
        if (decoded.type === 'phone_verification' && decoded.phone === cleanPhone) {
          isPhoneVerified = true;
        }
      } catch (err) {
        console.warn('Invalid verification token passed:', err.message);
      }
    }

    const otpRecord = otpStore.get(cleanPhone);
    if (otpRecord && otpRecord.verified) {
      isPhoneVerified = true;
    }

    if (!isPhoneVerified) {
      return res.status(400).json({ 
        error: 'Phone number has not been verified. Please verify with OTP before registering.' 
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

// AI endpoints
app.post('/api/ai', async (req, res) => {
  const key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const { prompt } = req.body || {};
  if (!key) return res.status(501).json({ error: 'AI provider not configured on server' });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt || '' }] }] })
    });
    const json = await response.json();
    return res.json(json);
  } catch (e) {
    console.warn('AI proxy error', e);
    return res.status(500).json({ error: 'AI proxy failed' });
  }
});

app.post('/api/ai/stream', (req, res) => {
  const { prompt } = req.body || {};
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  const full = prompt && prompt.length > 0 ? `PingX streaming response for: ${prompt}` : 'PingX streaming response.';
  const words = full.split(' ');

  let i = 0;
  const iv = setInterval(() => {
    if (i >= words.length) {
      try {
        res.write('\n');
        res.end();
      } catch {}
      clearInterval(iv);
      return;
    }
    try {
      res.write((i === 0 ? '' : ' ') + words[i]);
    } catch {}
    i += 1;
  }, 35);
});

// ---------------------------------------------------------------------------
// HTTP Server & Socket.IO Real-Time Engine
// ---------------------------------------------------------------------------

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  // Optional token authentication on handshake
  try {
    const token = socket.handshake.auth?.token;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.sub;
    }
  } catch (e) {
    // Non-fatal for public sockets
  }

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

  socket.on('disconnect', () => {});
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
