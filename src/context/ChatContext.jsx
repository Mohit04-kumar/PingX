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

export function ChatProvider({ children, onAddPing }) {
  const { user, accounts, searchUsers, sendFriendRequest, respondToFriendRequest, getIncomingRequests, getOutgoingRequests } = useAuth();

  const [chats, setChats] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear mock chats if present
        const hasOnlyMock = Array.isArray(parsed) && parsed.every((c) => ['chat_1', 'chat_2', 'chat_3'].includes(c.id));
        if (hasOnlyMock) {
          window.localStorage.removeItem(storageKey);
          return [];
        }
        return parsed;
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
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

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
        if (prev.find((c) => c.id === serverChat.id)) return prev;
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
        return [newChat, ...prev];
      });
      setActiveChatIdState(serverChat.id);
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
    const contactId = generateId('user');
    const newChatId = generateId('chat');
    const avatarUrl = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

    const newChat = {
      id: newChatId,
      type: 'direct',
      user: {
        id: contactId,
        name: String(name || 'New Contact').trim(),
        username: username || String(name || 'newcontact').trim().toLowerCase().replace(/\s+/g, ''),
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
          senderName: String(name || 'New Contact').trim(),
          content: `Hey! I'm ${String(name || 'New Contact').trim()}. Glad to connect on PingX! 😊`,
          timestamp: formatTimestamp(),
          status: 'read'
        }
      ]
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatIdState(newChatId);
    return newChat;
  };

  const sendMessage = (content, attachments = [], options = {}) => {
    if (!activeChatId) return;
    if (!content?.trim() && attachments.length === 0) return;

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

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return {
          ...chat,
          messages: [...(chat.messages || []), newMessage],
          lastMessage: {
            content: trimmedContent || (attachments.length ? '📎 Attachment' : 'New message'),
            timestamp: formatTimestamp(),
            senderId: user?.id || 'user_me'
          }
        };
      })
    );

    // Message saved locally and emitted live via Socket.IO
    // also emit message over socket for real-time delivery
    try {
      const socket = socketRef.current;
      if (socket && activeChatId) {
        const payload = { room: activeChatId, message: { ...newMessage, roomId: activeChatId } };
        socket.emit('send_message', payload);
        // persist to server
        const t = tokenFromStorage();
        fetch(`${API_BASE}/api/chats/${encodeURIComponent(activeChatId)}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
          body: JSON.stringify({ message: { ...newMessage, roomId: activeChatId } })
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

    // Check if chat already exists
    const existing = chats.find(
      (c) =>
        (c.type === 'direct' && c.user?.id === targetUser.id) ||
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

    setChats((prev) => [newChat, ...prev.filter((c) => c.id !== newChatId)]);
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
