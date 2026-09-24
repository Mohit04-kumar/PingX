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
  let room = chats.find((c) => c.id === roomId);
  if (!room) {
    room = { id: roomId, messages: [], participants: [] };
    chats.push(room);
  }
  room.messages.push(message);
  saveState();
}

function getChatsForUser(userId) {
  return chats.filter((c) => Array.isArray(c.participants) && c.participants.includes(userId));
}

function getMessages(chatId) {
  const room = chats.find((c) => c.id === chatId);
  return room ? room.messages : [];
}

function createChat({ id, participants = [], type = 'direct', messages = [] }) {
  const chatId = id || `chat_${Date.now()}`;
  const chat = { id: chatId, participants, type, messages };
  chats.unshift(chat);
  saveState();
  return chat;
}

module.exports = { accounts, friendRequests, chats, PRODUCT_DATABASE, searchProducts, addMessageToChat, getChatsForUser, getMessages, createChat, saveState };

