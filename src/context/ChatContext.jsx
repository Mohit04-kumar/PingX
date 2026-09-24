import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { MOCK_CHATS } from '../data/mockChats';
import { generateId, formatTimestamp } from '../utils/formatters';

const ChatContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4001';

function tokenFromStorage() {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('pingx_token');
  } catch {
    return null;
  }
}

import { io as socketIOClient } from 'socket.io-client';

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

    if (!mergedMap.has(partnerKey)) {
      mergedMap.set(partnerKey, { ...chat });
    } else {
      const existing = mergedMap.get(partnerKey);
      const existingMsgIds = new Set((existing.messages || []).map((m) => m.id));
      const existingContents = new Set((existing.messages || []).map((m) => `${m.content}_${m.timestamp}`));
      const combinedMsgs = [...(existing.messages || [])];

      for (const msg of (chat.messages || [])) {
        const signature = `${msg.content}_${msg.timestamp}`;
        if (!existingMsgIds.has(msg.id) && !existingContents.has(signature)) {
          combinedMsgs.push(msg);
          existingMsgIds.add(msg.id);
          existingContents.add(signature);
        }
      }

      const bestUser = (existing.user?.username && existing.user?.avatar) ? existing.user : (chat.user || existing.user);
      const bestLastMessage = combinedMsgs.length > 0 ? combinedMsgs[combinedMsgs.length - 1] : (existing.lastMessage || chat.lastMessage);

      mergedMap.set(partnerKey, {
        ...existing,
        id: existing.id || chat.id,
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

  // Ensure activeChatId always points to a valid conversation if chats exist
  useEffect(() => {
    if (chats.length > 0) {
      const exists = chats.some((c) => c.id === activeChatId);
      if (!exists || !activeChatId) {
        setActiveChatIdState(chats[0].id);
      }
    }
  }, [chats, activeChatId]);

  // When active chat changes, fetch full message history from server
  useEffect(() => {
    const t = tokenFromStorage();
    if (!t || !activeChatId) return;
    fetch(`${API_BASE}/api/chats/${encodeURIComponent(activeChatId)}/messages`, { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((msgs) => {
        if (Array.isArray(msgs)) {
          setChats((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, messages: msgs } : c)));
        }
      })
      .catch(() => {});
  }, [activeChatId]);

  // Socket.IO connection
  const socketRef = useRef(null);
  const joinedRoomRef = useRef(null);

  useEffect(() => {
    const token = user?.token || tokenFromStorage();
    if (!socketIOClient) return undefined;
    const socket = socketIOClient(API_BASE, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (user?.id) {
        socket.emit('register_user', user.id);
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
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== message.roomId) return chat;
          if (chat.messages?.some((m) => m.id === message.id)) return chat;
          const isCurrentActive = activeChatId === message.roomId;
          const isIncoming = message.senderId !== user?.id;
          return {
            ...chat,
            messages: [...(chat.messages || []), message],
            unreadCount: isCurrentActive ? 0 : ((chat.unreadCount || 0) + (isIncoming ? 1 : 0)),
            lastMessage: { content: message.content, timestamp: message.timestamp, senderId: message.senderId }
          };
        })
      );
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

    socket.on('message_deleted', ({ messageId }) => {
      setChats((prev) =>
        prev.map((c) => ({
          ...c,
          messages: (c.messages || []).filter((m) => m.id !== messageId)
        }))
      );
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

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

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

    // Message saved locally and emitted live via Socket.IO
    try {
      const socket = socketRef.current;
      if (socket && currentChatId) {
        const payload = { room: currentChatId, message: { ...newMessage, roomId: currentChatId } };
        socket.emit('send_message', payload);
        // persist to server
        const t = tokenFromStorage();
        fetch(`${API_BASE}/api/chats/${encodeURIComponent(currentChatId)}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
          body: JSON.stringify({ message: { ...newMessage, roomId: currentChatId } })
        }).catch(() => {});
      }
    } catch {}
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

  const deleteMessage = (messageId) => {
    if (!activeChatId) return;
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return { ...chat, messages: (chat.messages || []).filter((message) => message.id !== messageId) };
      })
    );
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
    const newChatId = `chat_${[currentUserId, targetUser.id].sort().join('_')}`;
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
    const token = tokenFromStorage();
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
