import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { MOCK_CHATS } from '../data/mockChats';
import { generateId, formatTimestamp } from '../utils/formatters';

const ChatContext = createContext();
import { API_BASE, SOCKET_URL } from '../config/api';
import { io as socketIOClient } from 'socket.io-client';

function tokenFromStorage() {
  try {
    if (typeof window === 'undefined') return null;
    let t = window.localStorage.getItem('pingx_token');
    if (!t || t === 'null' || t === 'undefined') return null;
    try {
      t = JSON.parse(t);
    } catch {}
    if (typeof t === 'string') {
      return t.replace(/^["']|["']$/g, '').trim();
    }
    return t;
  } catch {
    return null;
  }
}

const storageKey = 'pingx_chats';

function dedupeAndMergeChats(rawChats, currentUserId) {
  if (!Array.isArray(rawChats)) return [];
  const mergedMap = new Map();

  for (const chat of rawChats) {
    if (!chat) continue;
    let partnerKey = null;
    if (chat.type === 'group' || chat.isGroup) {
      partnerKey = `group_${chat.id}`;
    } else {
      const partnerId = chat.user?.id || (chat.participants || []).find((p) => p !== currentUserId);
      const partnerUsername = chat.user?.username ? chat.user.username.toLowerCase().trim() : null;
      const partnerName = chat.user?.name ? chat.user.name.toLowerCase().trim() : null;
      partnerKey = partnerUsername || partnerName || partnerId || chat.id;
    }

    // Deduplicate messages within the current chat object itself
    const cleanChatMsgs = [];
    const localIds = new Set();
    const localSigs = new Set();
    for (const msg of (chat.messages || [])) {
      if (!msg) continue;
      const mId = msg.id ? String(msg.id) : null;
      const sig = `${msg.senderId || ''}_${msg.content || ''}_${msg.timestamp || ''}`;
      if (mId && localIds.has(mId)) continue;
      if (localSigs.has(sig)) continue;
      if (mId) localIds.add(mId);
      localSigs.add(sig);
      cleanChatMsgs.push(msg);
    }
    const cleanChat = { ...chat, messages: cleanChatMsgs };

    if (!mergedMap.has(partnerKey)) {
      mergedMap.set(partnerKey, cleanChat);
    } else {
      const existing = mergedMap.get(partnerKey);
      const existingMsgIds = new Set((existing.messages || []).map((m) => m.id).filter(Boolean));
      const existingContents = new Set((existing.messages || []).map((m) => `${m.senderId || ''}_${m.content || ''}_${m.timestamp || ''}`));
      const combinedMsgs = [...(existing.messages || [])];

      for (const msg of cleanChatMsgs) {
        const signature = `${msg.senderId || ''}_${msg.content || ''}_${msg.timestamp || ''}`;
        const msgId = msg.id ? String(msg.id) : null;
        if ((!msgId || !existingMsgIds.has(msgId)) && !existingContents.has(signature)) {
          combinedMsgs.push(msg);
          if (msgId) existingMsgIds.add(msgId);
          existingContents.add(signature);
        }
      }

      const bestUser = (existing.user?.username && existing.user?.avatar) ? existing.user : (cleanChat.user || existing.user);
      const bestLastMessage = combinedMsgs.length > 0 ? combinedMsgs[combinedMsgs.length - 1] : (existing.lastMessage || cleanChat.lastMessage);

      mergedMap.set(partnerKey, {
        ...existing,
        id: existing.id || cleanChat.id,
        user: bestUser,
        messages: combinedMsgs,
        lastMessage: bestLastMessage
      });
    }
  }
  return Array.from(mergedMap.values());
}

export function ChatProvider({ children, onAddPing }) {
  const { user, accounts, searchUsers, sendFriendRequest, respondToFriendRequest, getIncomingRequests, getOutgoingRequests } = useAuth();

  const [chats, setChats] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasOnlyMock = Array.isArray(parsed) && parsed.every((c) => ['chat_1', 'chat_2', 'chat_3'].includes(c.id));
        if (hasOnlyMock) {
          window.localStorage.removeItem(storageKey);
          return [];
        }
        return dedupeAndMergeChats(parsed, user?.id);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatIdState] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return null;
    }
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !['chat_1', 'chat_2'].includes(parsed[0].id)) {
          return parsed[0].id;
        }
      } catch {}
    }
    return null;
  });
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [activeSummary, setActiveSummary] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(chats));
    }
  }, [chats]);

  // Load chats from server when available
  useEffect(() => {
    const t = tokenFromStorage();
    if (!t) return;
    fetch(`${API_BASE}/api/chats`, { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((remoteChats) => {
        if (Array.isArray(remoteChats) && remoteChats.length > 0) {
          setChats((prev) => {
            const map = new Map(prev.map((c) => [c.id, c]));
            remoteChats.forEach((rc) => map.set(rc.id, { ...map.get(rc.id), ...rc }));
            return dedupeAndMergeChats(Array.from(map.values()), user?.id);
          });
        }
      })
      .catch(() => {});
  }, [user]);

  // Ensure activeChatId points to a valid conversation on desktop; allow null on mobile for WhatsApp-style list
  useEffect(() => {
    if (chats.length > 0) {
      const exists = chats.some((c) => c.id === activeChatId);
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        if (!exists || !activeChatId) {
          setActiveChatIdState(chats[0].id);
        }
      } else {
        if (activeChatId && !exists) {
          setActiveChatIdState(null);
        }
      }
    }
  }, [chats, activeChatId]);

  // When active chat changes, fetch full message history from server
  useEffect(() => {
    const t = tokenFromStorage() || user?.token || user?.id;
    if (!t || !activeChatId) return;
    fetch(`${API_BASE}/api/chats/${encodeURIComponent(activeChatId)}/messages`, { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((msgs) => {
        if (Array.isArray(msgs)) {
          const visible = msgs.filter((m) => !Array.isArray(m.deletedFor) || !m.deletedFor.includes(user?.id));
          setChats((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, messages: visible } : c)));
        }
      })
      .catch(() => {});
  }, [activeChatId, user?.id]);

  const notifyIncomingMessage = (message, partnerUser) => {
    if (!message || message.senderId === user?.id) return;
    const name = partnerUser?.name || message.senderName || 'A friend';
    if (onAddPing) {
      onAddPing({
        id: generateId('ping_msg'),
        type: 'social',
        badge: '💬 New Message',
        title: `Message from ${name}`,
        content: message.content || 'Sent an attachment',
        timestamp: message.timestamp || formatTimestamp(),
        read: false,
        action: {
          label: 'Open Chat',
          type: 'open_chat',
          chatId: message.roomId || activeChatId
        }
      });
    }
  };

  // Live fast polling for active conversation messages every 1s (ensures immediate cross-device message arrival)
  useEffect(() => {
    const t = tokenFromStorage() || user?.token || user?.id;
    if (!t || !activeChatId) return;

    const pollActiveMessages = () => {
      fetch(`${API_BASE}/api/chats/${encodeURIComponent(activeChatId)}/messages`, {
        headers: { Authorization: `Bearer ${t}` }
      })
        .then((r) => r.json())
        .then((msgs) => {
          if (Array.isArray(msgs)) {
            const visibleMsgs = msgs.filter((m) => !Array.isArray(m.deletedFor) || !m.deletedFor.includes(user?.id));
            
            // Deduplicate incoming polled messages by ID and signature
            const cleanMsgs = [];
            const seenIds = new Set();
            const seenSigs = new Set();
            for (const m of visibleMsgs) {
              if (!m) continue;
              const idKey = m.id ? String(m.id) : null;
              const sigKey = `${m.senderId || ''}_${m.content || ''}_${m.timestamp || ''}`;
              if (idKey && seenIds.has(idKey)) continue;
              if (seenSigs.has(sigKey)) continue;
              if (idKey) seenIds.add(idKey);
              seenSigs.add(sigKey);
              cleanMsgs.push(m);
            }

            setChats((prev) => {
              const currentChat = prev.find((c) => c.id === activeChatId);
              if (!currentChat) return prev;

              const currentMessages = currentChat.messages || [];
              const currentIds = new Set(currentMessages.map((m) => m.id).filter(Boolean));
              const currentSigs = new Set(currentMessages.map((m) => `${m.senderId || ''}_${m.content || ''}_${m.timestamp || ''}`));

              const hasNew = cleanMsgs.some((m) => !currentIds.has(m.id) && !currentSigs.has(`${m.senderId || ''}_${m.content || ''}_${m.timestamp || ''}`));
              if (!hasNew && currentMessages.length === cleanMsgs.length) {
                return prev; // Nothing changed, skip update to prevent re-renders and scroll fighting
              }

              const latest = cleanMsgs[cleanMsgs.length - 1];
              if (latest && latest.senderId !== user?.id && !currentIds.has(latest.id) && !currentSigs.has(`${latest.senderId || ''}_${latest.content || ''}_${latest.timestamp || ''}`)) {
                notifyIncomingMessage(latest, currentChat?.user);
              }
              return prev.map((c) =>
                c.id === activeChatId
                  ? {
                      ...c,
                      messages: cleanMsgs,
                      lastMessage: latest || c.lastMessage
                    }
                  : c
              );
            });
          }
        })
        .catch(() => {});
    };

    pollActiveMessages();
    const interval = setInterval(pollActiveMessages, 1000);
    return () => clearInterval(interval);
  }, [activeChatId, user?.id]);

  const seenMessageIdsRef = useRef(new Set());

  // Live polling for user's conversations every 2s
  useEffect(() => {
    const t = tokenFromStorage() || user?.token || user?.id;
    if (!t || !user?.id) return;

    const pollChats = () => {
      fetch(`${API_BASE}/api/chats`, {
        headers: { Authorization: `Bearer ${t}` }
      })
        .then((r) => r.json())
        .then((remoteChats) => {
          if (Array.isArray(remoteChats) && remoteChats.length > 0) {
            remoteChats.forEach((rc) => {
              if (rc.lastMessage && rc.lastMessage.id && !seenMessageIdsRef.current.has(rc.lastMessage.id)) {
                seenMessageIdsRef.current.add(rc.lastMessage.id);
                if (rc.lastMessage.senderId !== user?.id && rc.id !== activeChatId) {
                  notifyIncomingMessage(rc.lastMessage, rc.user);
                }
              }
            });
            setChats((prev) => {
              return dedupeAndMergeChats([...remoteChats, ...prev], user?.id);
            });
          }
        })
        .catch(() => {});
    };

    pollChats();
    const interval = setInterval(pollChats, 2000);
    return () => clearInterval(interval);
  }, [user?.id, activeChatId]);

  // Automatically enrich partner profile info (name, avatar, username) from registered accounts
  useEffect(() => {
    if (!accounts || accounts.length === 0) return;
    setChats((prev) => {
      let changed = false;
      const updated = prev.map((c) => {
        if (c.type === 'direct' || !c.type) {
          const partnerId = c.user?.id || (c.participants || []).find((p) => p !== user?.id);
          const acc = accounts.find((a) => a.id === partnerId || (a.username && a.username === c.user?.username));
          if (acc && (!c.user?.name || c.user.name === 'PingX Member' || c.user.name === 'Contact' || !c.user.avatar)) {
            changed = true;
            return {
              ...c,
              user: {
                ...c.user,
                ...acc,
                name: acc.name || c.user?.name,
                username: acc.username || c.user?.username,
                avatar: acc.avatar || c.user?.avatar
              }
            };
          }
        }
        return c;
      });
      return changed ? updated : prev;
    });
  }, [accounts, user?.id]);

  // Socket.IO connection
  const socketRef = useRef(null);
  const joinedRoomRef = useRef(null);

  useEffect(() => {
    const token = user?.token || tokenFromStorage();
    if (!socketIOClient) return undefined;
    const socket = socketIOClient(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (user?.id) {
        socket.emit('register_user', user.id);
      }
    });

    socket.on('friend_request_responded', (payload) => {
      if (payload?.chat) {
        window.dispatchEvent(new CustomEvent('pingx:openServerChat', { detail: payload.chat }));
      }
    });

    socket.on('online_users', (usersList) => {
      if (Array.isArray(usersList)) {
        setOnlineUsers(usersList);
      }
    });

    socket.on('user_typing', ({ userId, username, isTyping: typingState }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: typingState ? (username || 'Someone') : null
      }));
    });

    socket.on('message', (message) => {
      if (!message || !message.roomId) return;
      const msgSig = `${message.senderId || ''}_${message.content || ''}_${message.timestamp || ''}`;

      setChats((prev) => {
        const found = prev.find((c) => c.id === message.roomId);
        return prev.map((chat) => {
          if (chat.id !== message.roomId) return chat;
          
          // Strict deduplication by ID or by sender+content+timestamp signature
          const alreadyExists = (chat.messages || []).some(
            (m) => (message.id && m.id === message.id) ||
                   (`${m.senderId || ''}_${m.content || ''}_${m.timestamp || ''}` === msgSig)
          );
          if (alreadyExists) return chat;

          if (message.senderId !== user?.id) {
            notifyIncomingMessage(message, found?.user);
          }

          const isCurrentActive = activeChatId === message.roomId;
          const isIncoming = message.senderId !== user?.id;
          return {
            ...chat,
            messages: [...(chat.messages || []), message],
            unreadCount: isCurrentActive ? 0 : ((chat.unreadCount || 0) + (isIncoming ? 1 : 0)),
            lastMessage: { content: message.content, timestamp: message.timestamp, senderId: message.senderId }
          };
        });
      });
    });

    socket.on('message_read', ({ messageId }) => {
      setChats((prev) =>
        prev.map((c) => ({
          ...c,
          messages: (c.messages || []).map((m) =>
            m.id === messageId ? { ...m, status: 'read' } : m
          )
        }))
      );
    });

    socket.on('reaction_updated', ({ messageId, emoji }) => {
      setChats((prev) =>
        prev.map((c) => ({
          ...c,
          messages: (c.messages || []).map((m) => {
            if (m.id !== messageId) return m;
            const reactions = { ...(m.reactions || {}) };
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            return { ...m, reactions };
          })
        }))
      );
    });

    socket.on('message_deleted_for_everyone', ({ roomId, messageId }) => {
      setChats((prev) =>
        prev.map((c) => {
          if (roomId && c.id !== roomId) return c;
          return {
            ...c,
            messages: (c.messages || []).map((m) =>
              m.id === messageId
                ? { ...m, content: '🚫 This message was deleted', deletedForEveryone: true, attachments: [] }
                : m
            ),
            lastMessage:
              c.lastMessage?.id === messageId
                ? { ...c.lastMessage, content: '🚫 This message was deleted', deletedForEveryone: true }
                : c.lastMessage
          };
        })
      );
    });

    socket.on('message_deleted_for_me', ({ roomId, messageId }) => {
      setChats((prev) =>
        prev.map((c) => {
          if (roomId && c.id !== roomId) return c;
          return {
            ...c,
            messages: (c.messages || []).filter((m) => m.id !== messageId)
          };
        })
      );
    });

    socket.on('message_deleted', ({ messageId, roomId }) => {
      setChats((prev) =>
        prev.map((c) => {
          if (roomId && c.id !== roomId) return c;
          return {
            ...c,
            messages: (c.messages || []).map((m) =>
              m.id === messageId
                ? { ...m, content: '🚫 This message was deleted', deletedForEveryone: true, attachments: [] }
                : m
            )
          };
        })
      );
    });

    // Real-time Call Signaling Listeners
    socket.on('incoming_call', (payload) => {
      if (payload && payload.callerInfo) {
        setIncomingCall(payload);
      }
    });

    socket.on('call_accepted', (payload) => {
      setActiveCall((prev) => (prev ? { ...prev, isConnected: true, partner: payload?.partnerInfo || prev.partner } : prev));
    });

    socket.on('call_rejected', () => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    socket.on('call_ended', () => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    return () => {
      try {
        socket.disconnect();
      } catch {}
    };
  }, [user]);

  const sendTyping = (typingState) => {
    try {
      const socket = socketRef.current;
      if (socket && activeChatId) {
        socket.emit(typingState ? 'typing' : 'stop_typing', {
          room: activeChatId,
          userId: user?.id,
          username: user?.name || user?.username
        });
      }
    } catch {}
  };

  // Listen for external requests to open a server-created chat
  useEffect(() => {
    const handler = (e) => {
      const serverChat = e?.detail;
      if (!serverChat || !serverChat.id) return;
      setChats((prev) => {
        const users = (serverChat.participants || []).map((pid) => {
          const acc = accounts.find((a) => a.id === pid);
          return acc || { id: pid, name: pid, username: pid, avatar: '' };
        });
        const newChat = {
          id: serverChat.id,
          type: serverChat.type || 'direct',
          user: users.find((u) => u.id !== (user?.id)) || users[0],
          participants: serverChat.participants,
          messages: serverChat.messages || [],
          unreadCount: 0,
          pinned: false,
          lastMessage: serverChat.messages && serverChat.messages.length > 0 ? serverChat.messages[serverChat.messages.length - 1] : null
        };
        const merged = dedupeAndMergeChats([newChat, ...prev], user?.id);
        const resolvedChat = merged.find((c) => c.id === serverChat.id || (newChat.user?.username && c.user?.username === newChat.user?.username));
        if (resolvedChat) {
          setActiveChatIdState(resolvedChat.id);
        }
        return merged;
      });
    };
    window.addEventListener('pingx:openServerChat', handler);
    return () => window.removeEventListener('pingx:openServerChat', handler);
  }, [accounts, user]);

  const setActiveChatId = (id) => {
    // leave previous
    try {
      const socket = socketRef.current;
      if (socket && joinedRoomRef.current) socket.emit('leave', joinedRoomRef.current);
    } catch {}

    setActiveChatIdState(id);
    // join new room
    try {
      const socket = socketRef.current;
      if (socket && id) {
        socket.emit('join', id);
        joinedRoomRef.current = id;
      }
    } catch {}
    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === id) {
          return { ...c, unreadCount: 0, messages: (c.messages || []).map((m) => ({ ...m, status: 'read' })) };
        }
        return c;
      })
    );
  };

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const activeChat = chats.find((c) => c.id === activeChatId) || (isDesktop ? chats[0] : null);

  const deleteChat = (chatId) => {
    setChats((prev) => {
      const updated = prev.filter((c) => c.id !== chatId);
      if (activeChatId === chatId && updated.length > 0) {
        setActiveChatIdState(updated[0].id);
      }
      return updated;
    });
  };

  const addContact = ({ name, phone, email, avatar, username, bio }) => {
    const cleanName = String(name || 'New Contact').trim();
    const cleanUsername = username ? String(username).trim().toLowerCase() : cleanName.toLowerCase().replace(/\s+/g, '');

    // Check if chat already exists for this person (by username, name, phone, or email)
    const existingChat = chats.find((c) => {
      if (!c) return false;
      const partner = c.user;
      if (!partner) return false;
      if (partner.username && partner.username.toLowerCase() === cleanUsername) return true;
      if (partner.name && partner.name.toLowerCase() === cleanName.toLowerCase()) return true;
      if (email && partner.email && partner.email.toLowerCase() === email.toLowerCase()) return true;
      if (phone && partner.phone && partner.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')) return true;
      return false;
    });

    if (existingChat) {
      setActiveChatIdState(existingChat.id);
      return existingChat;
    }

    const contactId = generateId('user');
    const newChatId = generateId('chat');
    const avatarUrl = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

    const newChat = {
      id: newChatId,
      type: 'direct',
      user: {
        id: contactId,
        name: cleanName,
        username: cleanUsername,
        avatar: avatarUrl,
        status: 'online',
        phone: phone || '',
        email: email || '',
        bio: bio || 'Hey there! I am using PingX.'
      },
      unreadCount: 0,
      pinned: false,
      lastMessage: {
        content: 'Contact verified. Connected on PingX! 👋',
        timestamp: formatTimestamp(),
        senderId: contactId
      },
      messages: [
        {
          id: generateId('m_init'),
          senderId: contactId,
          senderName: cleanName,
          content: `Hey! I'm ${cleanName}. Glad to connect on PingX! 😊`,
          timestamp: formatTimestamp(),
          status: 'read'
        }
      ]
    };

    setChats((prev) => dedupeAndMergeChats([newChat, ...prev], user?.id));
    setActiveChatIdState(newChatId);
    return newChat;
  };

  const sendMessage = (content, attachments = [], options = {}) => {
    const currentChatId = activeChatId || activeChat?.id || (chats.length > 0 ? chats[0]?.id : null);
    if (!currentChatId) return;
    if (!content?.trim() && attachments.length === 0) return;

    if (!activeChatId) {
      setActiveChatIdState(currentChatId);
    }

    const trimmedContent = String(content || '').trim();
    const newMessage = {
      id: generateId('msg'),
      senderId: user?.id || 'user_me',
      senderName: user?.name || 'You',
      content: trimmedContent,
      timestamp: formatTimestamp(),
      attachments,
      status: 'sent',
      replyTo: options.replyTo || null,
      reactions: {}
    };

    setChats((prevChats) => {
      const updated = prevChats.map((chat) => {
        if (chat.id !== currentChatId) return chat;
        // Prevent duplicate append
        const exists = (chat.messages || []).some(
          (m) => (newMessage.id && m.id === newMessage.id) ||
                 (m.senderId === newMessage.senderId && m.content === newMessage.content && m.timestamp === newMessage.timestamp)
        );
        if (exists) return chat;

        return {
          ...chat,
          messages: [...(chat.messages || []), newMessage],
          lastMessage: {
            content: trimmedContent || (attachments.length ? '📎 Attachment' : 'New message'),
            timestamp: formatTimestamp(),
            senderId: user?.id || 'user_me'
          }
        };
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 1. Emit live via Socket.IO if connected
    try {
      const socket = socketRef.current;
      if (socket && socket.connected) {
        socket.emit('send_message', { room: currentChatId, message: { ...newMessage, roomId: currentChatId } });
      }
    } catch {}

    // 2. ALWAYS persist to server via HTTP (guarantees cross-device delivery on Vercel)
    const t = tokenFromStorage() || user?.token || user?.id;
    const currentChat = chats.find((c) => c.id === currentChatId);
    const participants = currentChat?.participants || [user?.id, currentChat?.user?.id].filter(Boolean);
    fetch(`${API_BASE}/api/chats/${encodeURIComponent(currentChatId)}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${t}`
      },
      body: JSON.stringify({ 
        message: { ...newMessage, roomId: currentChatId },
        participants
      })
    }).catch((err) => {
      console.warn('Failed to save message to server:', err);
    });
  };

  const addReaction = (messageId, emoji) => {
    if (!activeChatId) return;
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return {
          ...chat,
          messages: (chat.messages || []).map((message) => {
            if (message.id !== messageId) return message;
            const reactions = { ...(message.reactions || {}) };
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            return { ...message, reactions };
          })
        };
      })
    );
  };

  const deleteMessage = (messageId, deleteType = 'forEveryone') => {
    const currentChatId = activeChatId || activeChat?.id;
    if (!currentChatId || !messageId) return;

    // Optimistic UI update
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat;
        if (deleteType === 'forEveryone') {
          return {
            ...chat,
            messages: (chat.messages || []).map((m) =>
              m.id === messageId
                ? { ...m, content: '🚫 This message was deleted', deletedForEveryone: true, attachments: [] }
                : m
            ),
            lastMessage:
              chat.lastMessage?.id === messageId
                ? { ...chat.lastMessage, content: '🚫 This message was deleted', deletedForEveryone: true }
                : chat.lastMessage
          };
        } else {
          // Delete for me only
          return {
            ...chat,
            messages: (chat.messages || []).filter((m) => m.id !== messageId)
          };
        }
      })
    );

    // Broadcast delete request via socket
    try {
      const socket = socketRef.current;
      if (socket) {
        socket.emit('delete_message_request', {
          room: currentChatId,
          messageId,
          deleteType,
          userId: user?.id
        });
      }
    } catch {}

    // Persist deletion to server
    const t = tokenFromStorage() || user?.token || user?.id;
    fetch(`${API_BASE}/api/chats/${encodeURIComponent(currentChatId)}/messages/${encodeURIComponent(messageId)}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${t}`
      },
      body: JSON.stringify({ deleteType })
    }).catch((err) => {
      console.warn('Failed to delete message on server:', err);
    });
  };

  // Real-time Voice & Video Calling Handlers
  const startCall = (partner, callType = 'voice') => {
    const currentChat = activeChat || chats.find((c) => c.user?.id === partner?.id);
    const roomId = currentChat?.id || activeChatId || `call_${Date.now()}`;
    const partnerId = partner?.id || partner?.username;

    setActiveCall({
      partner: partner || currentChat?.user,
      callType,
      roomId,
      isInitiator: true,
      startedAt: Date.now()
    });

    try {
      const socket = socketRef.current;
      if (socket && partnerId) {
        socket.emit('call_user', {
          targetUserId: partnerId,
          callerInfo: {
            id: user?.id,
            name: user?.name || user?.username,
            username: user?.username,
            avatar: user?.avatar
          },
          callType,
          roomId
        });
      }
    } catch {}
  };

  const answerCall = () => {
    if (!incomingCall) return;
    const callData = {
      partner: incomingCall.callerInfo,
      callType: incomingCall.callType || 'voice',
      roomId: incomingCall.roomId,
      isInitiator: false,
      startedAt: Date.now()
    };
    setActiveCall(callData);

    try {
      const socket = socketRef.current;
      if (socket) {
        socket.emit('call_accepted', {
          callerUserId: incomingCall.callerInfo?.id,
          partnerInfo: {
            id: user?.id,
            name: user?.name,
            username: user?.username,
            avatar: user?.avatar
          },
          roomId: incomingCall.roomId
        });
      }
    } catch {}
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    try {
      const socket = socketRef.current;
      if (socket) {
        socket.emit('call_rejected', {
          callerUserId: incomingCall.callerInfo?.id,
          roomId: incomingCall.roomId
        });
      }
    } catch {}
    setIncomingCall(null);
  };

  const endCall = (summary = null) => {
    const call = activeCall;
    if (call) {
      try {
        const socket = socketRef.current;
        if (socket) {
          socket.emit('call_ended', {
            targetUserId: call.partner?.id,
            roomId: call.roomId
          });
        }
      } catch {}

      if (summary) {
        const durSec = summary.duration || 0;
        const durStr = durSec > 0 ? `${Math.floor(durSec / 60)}m ${durSec % 60}s` : 'Call ended';
        const label = summary.type === 'video' ? `📹 Video call • ${durStr}` : `📞 Voice call • ${durStr}`;
        sendMessage(label, [], { callLog: { ...summary, durationStr: durStr } });
      }
    }
    setActiveCall(null);
    setIncomingCall(null);
  };

  const editMessage = (messageId, newContent) => {
    if (!activeChatId || !newContent?.trim()) return;
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return {
          ...chat,
          messages: (chat.messages || []).map((message) =>
            message.id === messageId ? { ...message, content: newContent.trim(), edited: true } : message
          )
        };
      })
    );
  };

  const triggerGroupSummary = () => {
    if (activeChat && activeChat.type === 'group' && activeChat.summary) {
      setActiveSummary(activeChat.summary);
      setSummaryModalOpen(true);
    }
  };

  const convertActionableToPing = (actionable) => {
    if (!actionable) return;
    const newPing = {
      id: generateId('ping'),
      type: 'reminder',
      badge: '⏰ Reminder Added',
      title: actionable.title || 'Scheduled Reminder',
      content: `${actionable.date || ''} - ${actionable.location || ''}`,
      timestamp: 'Just now',
      read: false,
      action: {
        label: 'View in Chat',
        type: 'open_chat',
        chatId: activeChatId
      }
    };
    if (onAddPing) onAddPing(newPing);
  };

  const startDirectChat = (targetUser) => {
    if (!targetUser) return null;
    const currentUserId = user?.id || 'me';
    const targetUsername = (targetUser.username || targetUser.name || '').toLowerCase().trim();

    // Check if chat already exists
    const existing = chats.find(
      (c) =>
        (c.type === 'direct' && c.user?.id === targetUser.id) ||
        (c.type === 'direct' && targetUsername && (c.user?.username?.toLowerCase() === targetUsername || c.user?.name?.toLowerCase() === targetUsername)) ||
        (Array.isArray(c.participants) &&
          c.participants.includes(currentUserId) &&
          c.participants.includes(targetUser.id))
    );

    if (existing) {
      setActiveChatId(existing.id);
      return existing.id;
    }

    // Otherwise create a new direct chat
    const newChatId = `chat_${[currentUserId, targetUser.id].sort().join('--')}`;
    const newChat = {
      id: newChatId,
      type: 'direct',
      user: targetUser,
      participants: [currentUserId, targetUser.id],
      messages: [],
      unreadCount: 0,
      pinned: false,
      lastMessage: null
    };

    setChats((prev) => dedupeAndMergeChats([newChat, ...prev.filter((c) => c.id !== newChatId)], currentUserId));
    setActiveChatId(newChatId);

    // Sync with backend API
    const token = tokenFromStorage() || user?.token || user?.id;
    if (token) {
      fetch(`${API_BASE}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: newChatId,
          type: 'direct',
          participants: [currentUserId, targetUser.id]
        })
      }).catch(() => {});
    }

    return newChatId;
  };

  const requestActions = {
    searchUsers,
    sendFriendRequest,
    respondToFriendRequest,
    getIncomingRequests,
    getOutgoingRequests,
    accounts
  };

  const totalUnreadCount = (chats || []).reduce((total, chat) => {
    if (typeof chat.unreadCount === 'number' && chat.unreadCount > 0) {
      return total + chat.unreadCount;
    }
    const unreadMsgs = (chat.messages || []).filter(
      (m) => m.senderId !== user?.id && m.status !== 'read'
    ).length;
    return total + unreadMsgs;
  }, 0);

  return (
    <ChatContext.Provider value={{
      chats,
      totalUnreadCount,
      activeChat,
      activeChatId,
      setActiveChatId,
      startDirectChat,
      deleteChat,
      addContact,
      sendMessage,
      isTyping,
      onlineUsers,
      typingUsers,
      sendTyping,
      addReaction,
      deleteMessage,
      editMessage,
      incomingCall,
      setIncomingCall,
      activeCall,
      setActiveCall,
      startCall,
      answerCall,
      rejectCall,
      endCall,
      triggerGroupSummary,
      summaryModalOpen,
      setSummaryModalOpen,
      activeSummary,
      convertActionableToPing,
      requestActions
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
