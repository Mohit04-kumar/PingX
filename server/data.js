// Minimal in-memory data used by the development server
const fs = require('fs');
const path = require('path');
const STATE_FILE = path.join(__dirname, 'state.json');

const accounts = [];
const friendRequests = [];
const chats = [];

const PRODUCT_DATABASE = [];

function saveState() {
  try {
    const payload = {
      accounts,
      friendRequests,
      chats
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed to save server state:', e.message);
  }
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.accounts)) {
        parsed.accounts.forEach((a) => {
          if (!accounts.find((x) => x.id === a.id || (x.email && x.email.toLowerCase() === a.email?.toLowerCase()))) {
            accounts.push(a);
          }
        });
      }
      if (Array.isArray(parsed.friendRequests)) {
        parsed.friendRequests.forEach((r) => {
          if (!friendRequests.find((x) => x.id === r.id)) friendRequests.push(r);
        });
      }
      if (Array.isArray(parsed.chats)) {
        parsed.chats.forEach((c) => {
          if (!chats.find((x) => x.id === c.id)) chats.push(c);
        });
      }
    }
  } catch (e) {
    console.warn('Failed to load server state', e);
  }
}

loadState();

function searchProducts(query = '') {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return PRODUCT_DATABASE;
  return PRODUCT_DATABASE.filter((p) => (`${p.title || p.name || ''}`.toLowerCase().includes(q)));
}

function addMessageToChat(roomId, message) {
  if (!roomId || !message) return;
  let room = chats.find((c) => c.id === roomId);
  if (!room) {
    room = { id: roomId, messages: [], participants: [] };
    chats.push(room);
  }
  if (!Array.isArray(room.messages)) room.messages = [];
  
  // Deduplicate: avoid adding identical message ID or same sender+content+timestamp
  const exists = room.messages.some((m) =>
    (message.id && m.id === message.id) ||
    (m.senderId === message.senderId && m.content === message.content && m.timestamp === message.timestamp)
  );
  if (!exists) {
    room.messages.push(message);
    saveState();
  }
}

function getChatsForUser(userId) {
  return chats.filter((c) => Array.isArray(c.participants) && c.participants.includes(userId));
}

function getMessages(chatId) {
  const room = chats.find((c) => c.id === chatId);
  if (!room || !Array.isArray(room.messages)) return [];

  // Deduplicate before returning
  const seenIds = new Set();
  const seenSigs = new Set();
  const clean = [];
  for (const m of room.messages) {
    if (!m) continue;
    const idKey = m.id ? String(m.id) : null;
    const sigKey = `${m.senderId || ''}_${m.content || ''}_${m.timestamp || ''}`;
    if (idKey && seenIds.has(idKey)) continue;
    if (seenSigs.has(sigKey)) continue;
    if (idKey) seenIds.add(idKey);
    seenSigs.add(sigKey);
    clean.push(m);
  }
  return clean;
}

function deleteMessageFromChat(roomId, messageId, deleteType = 'forMe', userId = null) {
  const room = chats.find((c) => c.id === roomId);
  if (!room || !Array.isArray(room.messages)) return false;
  if (deleteType === 'forEveryone') {
    const msg = room.messages.find((m) => m.id === messageId);
    if (msg) {
      msg.content = '🚫 This message was deleted';
      msg.deletedForEveryone = true;
      msg.attachments = [];
      saveState();
      return true;
    }
  } else {
    const msg = room.messages.find((m) => m.id === messageId);
    if (msg && userId) {
      if (!Array.isArray(msg.deletedFor)) msg.deletedFor = [];
      if (!msg.deletedFor.includes(userId)) msg.deletedFor.push(userId);
      saveState();
      return true;
    }
  }
  return false;
}

function createChat({ id, participants = [], type = 'direct', messages = [] }) {
  const chatId = id || `chat_${Date.now()}`;
  const chat = { id: chatId, participants, type, messages };
  chats.unshift(chat);
  saveState();
  return chat;
}

module.exports = { accounts, friendRequests, chats, PRODUCT_DATABASE, searchProducts, addMessageToChat, deleteMessageFromChat, getChatsForUser, getMessages, createChat, saveState };

