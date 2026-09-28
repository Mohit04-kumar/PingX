import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { GroupSummaryModal } from './GroupSummaryModal';
import { AddContactModal } from './AddContactModal';
import { EmojiPicker } from './EmojiPicker';
import { Avatar } from '../common/Avatar';
import { useProfileModal } from '../../context/ProfileModalContext';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { DeleteMessageModal } from './DeleteMessageModal';
import { CallModal } from './CallModal';
import { IncomingCallModal } from './IncomingCallModal';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  Square,
  Bot, 
  Search, 
  MoreVertical,
  Pin,
  Trash2,
  Calendar,
  UserPlus,
  Volume2,
  X,
  Eye,
  Download,
  MessageSquare,
  CheckCheck,
  Check,
  Phone,
  PhoneCall,
  Video,
  MessageCircle,
  Sparkles,
  SquarePen,
  ChevronDown,
  ArrowLeft,
  Ban,
  PhoneForwarded,
  RotateCcw
} from 'lucide-react';

export function ChatView() {
  const { 
    chats, 
    activeChat, 
    activeChatId, 
    setActiveChatId,
    startDirectChat,
    deleteChat,
    addContact, 
    sendMessage, 
    isTyping, 
    onlineUsers = [],
    typingUsers = {},
    sendTyping,
    addReaction, 
    deleteMessage,
    incomingCall,
    activeCall,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    triggerGroupSummary,
    summaryModalOpen,
    setSummaryModalOpen,
    activeSummary,
    convertActionableToPing
  } = useChat();
  const { user, accounts = [], refreshUsers } = useAuth();
  const { openUserProfile } = useProfileModal();

  useEffect(() => {
    if (refreshUsers) refreshUsers();
  }, [refreshUsers]);

  const availableMembers = accounts.filter((a) => a && a.id && a.id !== user?.id);

  const [inputContent, setInputContent] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [inChatSearchQuery, setInChatSearchQuery] = useState('');
  const [showInChatSearch, setShowInChatSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  // WhatsApp-style message deletion modal state
  const [deletingMessage, setDeletingMessage] = useState(null);

  // Typing debounce timer
  const typingTimerRef = useRef(null);
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputContent(val);
    if (sendTyping) {
      sendTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        sendTyping(false);
      }, 1500);
    }
  };

  // Emoji Picker & Lightbox states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimeRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const fileInputRef = useRef(null);

  // Scroll Container & Auto-scroll down logic
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    } else if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // WhatsApp / Instagram-style registered accounts matching for phone number, email, or name
  const matchedAccounts = chatSearch.trim()
    ? accounts.filter((acc) => {
        if (!acc || acc.id === user?.id) return false;
        const q = chatSearch.trim().toLowerCase();
        const phone = (acc.phone || '').replace(/\s+/g, '');
        const qClean = q.replace(/\s+/g, '');
        const matchesPhone = phone && (phone.includes(qClean) || qClean.includes(phone));
        const nameMatches = (acc.name || '').toLowerCase().includes(q);
        const usernameMatches = (acc.username || '').toLowerCase().includes(q);
        const emailMatches = (acc.email || '').toLowerCase().includes(q);
        return matchesPhone || nameMatches || usernameMatches || emailMatches;
      })
    : [];

  // Helper to resolve partner profile
  const getChatPartner = (chat) => {
    if (!chat) return null;
    if (chat.user?.name && chat.user.name !== 'Contact' && chat.user.name !== 'PingX Member') {
      return chat.user;
    }
    const partnerId = chat.user?.id || (chat.participants || []).find((p) => p !== user?.id);
    if (partnerId) {
      const acc = accounts.find((a) => a.id === partnerId || a.username === partnerId);
      if (acc) return { ...chat.user, ...acc };
    }
    return chat.user || null;
  };

  const getChatDisplayName = (chat) => {
    if (!chat) return 'Friend';
    if (chat.type === 'group' || chat.isGroup) return chat.group?.name || 'Group Chat';
    const partner = getChatPartner(chat);
    return partner?.name || partner?.username || 'Friend';
  };

  const activePartner = getChatPartner(activeChat);
  const activeDisplayName = getChatDisplayName(activeChat);

  const filteredChats = chats.filter((c) => {
    const name = getChatDisplayName(c);
    const matchesSearch = name.toLowerCase().includes(chatSearch.toLowerCase());
    const matchesType = activeTab === 'all' || (activeTab === 'direct' && c.type === 'direct') || (activeTab === 'group' && c.type === 'group');
    return matchesSearch && matchesType;
  });

  // Filter messages in active conversation if in-chat search query exists
  const activeMessages = (activeChat?.messages || []).filter((msg) => {
    if (!inChatSearchQuery.trim()) return true;
    return (msg.content || '').toLowerCase().includes(inChatSearchQuery.toLowerCase());
  });

  // Scroll down instantly when switching chat
  useEffect(() => {
    if (activeChatId) {
      const timer = setTimeout(() => {
        scrollToBottom('auto');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeChatId]);

  // Scroll down automatically when new message comes or messages list updates
  useEffect(() => {
    if (activeMessages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom('smooth');
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [activeMessages.length]);

  const handleMessagesScroll = (e) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottomBtn(distanceToBottom > 120);
  };

  // Listen for direct chat requests (e.g. from UserProfileModal)
  useEffect(() => {
    const handler = (e) => {
      const targetUser = e?.detail;
      if (targetUser && startDirectChat) {
        startDirectChat(targetUser);
      }
    };
    window.addEventListener('pingx:startDirectChat', handler);
    return () => window.removeEventListener('pingx:startDirectChat', handler);
  }, [startDirectChat]);

  const handleSend = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputContent.trim()) return;
    sendMessage(inputContent);
    setInputContent('');
    setShowEmojiPicker(false);
  };

  const handleSelectSuggestedReply = (replyText) => {
    sendMessage(replyText);
  };

  // Image File Attachment Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          sendMessage("📷 Image Attachment", [
            { type: 'image', url: event.target.result }
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Web Audio Voice Recording (Converts to Base64 Data URL for universal cross-device playback)
  const startRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
              const base64Audio = reader.result;
              sendMessage("🎤 Voice Message", [
                { 
                  type: 'audio', 
                  url: base64Audio, 
                  duration: recordingTimeRef.current || 1 
                }
              ]);
            };
          }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setRecordingTime(0);
        recordingTimeRef.current = 0;

        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            const updated = prev + 1;
            recordingTimeRef.current = updated;
            return updated;
          });
        }, 1000);
      }
    } catch (err) {
      console.warn("Microphone access unavailable or denied:", err);
      alert("Microphone permission is required to record voice notes. Please allow microphone access in your browser.");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const cancelRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null; // Prevent sending
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    audioChunksRef.current = [];
  };

  return (
    <div 
      className="flex flex-col lg:flex-row h-[calc(100vh-6.5rem)] rounded-3xl overflow-hidden border shadow-sm relative transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*,video/*" className="hidden" />

      {/* Left Conversations Sidebar */}
      <div 
        className={`${activeChatId ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r flex-col transition-colors duration-200 bg-white dark:bg-slate-900 h-full`}
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="p-4 border-b space-y-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAddContactOpen(true)}
              className="flex items-center gap-1.5 text-base font-extrabold text-slate-900 dark:text-white font-heading cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span>{user?.name || user?.username || 'Messages'}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => setIsAddContactOpen(true)}
              className="p-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-2xs"
              title="New Message"
            >
              <SquarePen className="w-5 h-5" />
            </button>
          </div>

          {/* Primary / General / Requests Tabs */}
          <div className="flex items-center border-b border-slate-100 dark:border-slate-800 text-xs font-bold pt-1">
            {['Primary', 'General', 'Requests'].map((tab) => {
              const id = tab.toLowerCase();
              const isSelected = activeTab === id || (activeTab === 'all' && id === 'primary');
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 pb-2 text-center transition-colors cursor-pointer relative ${
                    isSelected ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'
                  }`}
                >
                  {tab}
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative pt-1">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search conversations, phone or email..."
              className="w-full rounded-2xl pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#7256c3] focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
          </div>

          {/* Member Lookup Preview */}
          {matchedAccounts.length > 0 && (
            <div className="p-2.5 rounded-2xl border border-violet-200 dark:border-violet-900/50 bg-violet-50/70 dark:bg-violet-950/30 shadow-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 text-[#7256c3]">
                  <PhoneCall className="w-3.5 h-3.5" /> WhatsApp & Member Lookup
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{matchedAccounts.length} found</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {matchedAccounts.map((account) => (
                  <div 
                    key={account.id}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#7256c3] transition-all flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Avatar src={account.avatar} name={account.name} size="sm" showOnline={account.status === 'online'} />
                      <div className="truncate">
                        <h6 className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                          {account.name}
                          {account.verified && <Check className="w-3 h-3 text-[#7256c3]" />}
                        </h6>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate">
                          {account.phone && <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{account.phone}</span>}
                          {account.phone && account.email && <span>•</span>}
                          {account.email && <span className="truncate">{account.email}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        startDirectChat(account);
                        setChatSearch('');
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-white text-[11px] font-bold bg-[#7256c3] hover:bg-[#6044b3] shadow-xs cursor-pointer whitespace-nowrap flex items-center gap-1 transition-transform hover:scale-105"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
          {filteredChats.length === 0 ? (
            <div className="text-center py-6 px-3 text-xs space-y-4" style={{ color: 'var(--text-muted)' }}>
              <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>No active chats yet</p>
                <p className="text-[11px] leading-relaxed">Connect with registered members or send a new direct message.</p>
              </div>
              <button
                onClick={() => setIsAddContactOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                + Find Members to Chat
              </button>

              {availableMembers.length > 0 && (
                <div className="pt-3 border-t text-left space-y-2" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                      Available Members ({availableMembers.length})
                    </span>
                    <button
                      onClick={() => setIsAddContactOpen(true)}
                      className="text-[10px] font-bold text-[#7256c3] hover:underline cursor-pointer"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {availableMembers.slice(0, 6).map((member) => (
                      <div
                        key={member.id}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#7256c3] flex items-center justify-between gap-2 shadow-2xs transition-all"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Avatar src={member.avatar} name={member.name} size="sm" showOnline={member.status === 'online'} />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">{member.name}</p>
                            <p className="text-[10px] text-[#7256c3] font-mono leading-tight">@{member.username}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => startDirectChat(member)}
                          className="px-2.5 py-1 rounded-lg text-white text-[11px] font-bold bg-[#7256c3] hover:bg-[#6044b3] shadow-xs cursor-pointer whitespace-nowrap transition-transform hover:scale-102"
                        >
                          Message
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const itemDisplayName = getChatDisplayName(chat);
              const itemPartner = getChatPartner(chat);
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className="p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all border group/item"
                  style={
                    isActive
                      ? { backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent)' }
                      : { borderColor: 'transparent' }
                  }
                >
                  <div className="flex items-center gap-3 truncate">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (itemPartner) openUserProfile(itemPartner);
                      }}
                      className="relative shrink-0 cursor-pointer hover:scale-105 transition-transform"
                      title={itemPartner ? `View ${itemDisplayName}'s Profile` : undefined}
                    >
                      <Avatar 
                        src={itemPartner?.avatar || chat.group?.avatar} 
                        name={itemDisplayName} 
                        size="md"
                        showOnline={itemPartner?.status === 'online'}
                        online={itemPartner?.status === 'online'}
                        className="border"
                        style={{ borderColor: 'var(--border)' }}
                      />
                    </button>

                    <div className="truncate">
                      <h5 className="text-xs font-bold flex items-center gap-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
                        {itemDisplayName}
                        {chat.pinned && <Pin className="w-3 h-3" style={{ color: 'var(--accent)' }} />}
                      </h5>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                        {chat.lastMessage?.content || 'Started conversation'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {chat.lastMessage?.timestamp}
                    </span>
                    <div className="flex items-center gap-1">
                      {chat.unreadCount > 0 && (
                        <span 
                          className="text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          {chat.unreadCount}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete conversation with ${chat.user?.name || chat.group?.name}?`)) {
                            deleteChat(chat.id);
                          }
                        }}
                        className="p-1 opacity-0 group-hover/item:opacity-100 transition-opacity hover:text-red-500"
                        style={{ color: 'var(--text-muted)' }}
                        title="Delete Conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Chat Window */}
      <div 
        className={`${activeChatId ? 'flex' : 'hidden lg:flex'} flex-1 flex-col relative h-full min-h-0 overflow-hidden`} 
        style={{ backgroundColor: 'var(--bg-subtle)' }}
      >
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-24 h-24 rounded-full border-2 border-slate-900 dark:border-white flex items-center justify-center mb-1 shadow-xs">
              <Send className="w-11 h-11 text-slate-900 dark:text-white -rotate-12 translate-x-0.5" />
            </div>
            <h3 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
              Your messages
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Send a message to start a chat.
            </p>
            <button
              onClick={() => setIsAddContactOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105"
            >
              Send message
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-3.5 sm:p-4 border-b flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Back button on smartphone screens */}
                <button
                  type="button"
                  onClick={() => setActiveChatId(null)}
                  className="lg:hidden p-2 -ml-1 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  title="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div 
                  className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group hover:opacity-95 transition-opacity"
                  onClick={() => {
                    if (activePartner) {
                      openUserProfile(activePartner);
                    }
                  }}
                  title={activePartner ? `View ${activeDisplayName}'s Profile` : undefined}
                >
                  <div className="relative">
                    <Avatar
                      src={activePartner?.avatar || activeChat?.group?.avatar}
                      name={activeDisplayName}
                      size="md"
                      className="border transition-transform group-hover:scale-105"
                      style={{ borderColor: 'var(--accent)' }}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold flex items-center gap-2 group-hover:text-[#7256c3] transition-colors" style={{ color: 'var(--text-primary)' }}>
                      <span>{activeDisplayName}</span>
                      {activePartner && (
                        <span className="text-[10px] font-semibold text-[#7256c3] bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full">
                          View Profile ›
                        </span>
                      )}
                      {activeChat?.type === 'group' && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                          {activeChat?.group?.membersCount} members
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      {typingUsers[activeChat?.user?.id] ? (
                        <span className="text-[#7256c3] font-bold animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] animate-ping" />
                          typing...
                        </span>
                      ) : onlineUsers.includes(activeChat?.user?.id) ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Online
                        </span>
                      ) : (
                        <span className="text-slate-400">Active on PingX</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Call & Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Voice Call Button */}
                <button 
                  onClick={() => startCall(activePartner, 'voice')}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950 text-slate-600 dark:text-slate-300 hover:text-[#7256c3] cursor-pointer transition-colors shadow-2xs"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>

                {/* Video Call Button */}
                <button 
                  onClick={() => startCall(activePartner, 'video')}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950 text-slate-600 dark:text-slate-300 hover:text-[#7256c3] cursor-pointer transition-colors shadow-2xs"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>

                {showInChatSearch ? (
                  <input
                    type="text"
                    value={inChatSearchQuery}
                    onChange={(e) => setInChatSearchQuery(e.target.value)}
                    placeholder="Find in chat..."
                    className="rounded-xl px-3 py-1 text-xs border outline-none w-36"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    autoFocus
                  />
                ) : (
                  <button onClick={() => setShowInChatSearch(true)} className="p-2 rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }} title="Search in chat">
                    <Search className="w-4 h-4" />
                  </button>
                )}

                {activeChat?.type === 'group' && (
                  <button onClick={triggerGroupSummary} className="btn-primary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
                    <Bot className="w-3.5 h-3.5" /> Summarize
                  </button>
                )}

                {activeChat && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete conversation thread?`)) {
                        deleteChat(activeChat.id);
                      }
                    }}
                    className="p-2 rounded-xl border text-gray-400 hover:text-red-500 cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                    title="Delete Chat Thread"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Message Feed (Scrollable with Auto-scroll down) */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 space-y-4 select-text" 
              style={{ backgroundColor: 'var(--bg-subtle)' }}
            >
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-12" style={{ color: 'var(--text-muted)' }}>
                  <Smile className="w-10 h-10 opacity-30" style={{ color: 'var(--accent)' }} />
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>No messages yet</p>
                  <p className="text-[11px] max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                    Say hello and start chatting with {activeDisplayName}!
                  </p>
                </div>
              ) : (
                activeMessages.map((msg, idx) => {
                  const isMe = msg.senderId === user?.id || msg.senderId === 'user_me';
                  const isDeleted = msg.deletedForEveryone;

                  return (
                    <div key={`${msg.id || 'msg'}_${idx}`} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 group max-w-full`}>
                      <div className={`flex items-center gap-1.5 text-[10px] ${isMe ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-muted)' }}>
                        <span className="font-semibold">{isMe ? 'You' : (msg.senderName || activeDisplayName)}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {isMe && !isDeleted && <CheckCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" title="Read" />}
                      </div>

                      <div 
                        className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed relative break-words shadow-sm transition-all ${
                          isMe 
                            ? 'rounded-tr-xs' 
                            : 'rounded-tl-xs border'
                        }`}
                        style={
                          isDeleted
                            ? {
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border)',
                                color: 'var(--text-muted)',
                                fontStyle: 'italic'
                              }
                            : isMe
                            ? { 
                                backgroundColor: 'var(--accent)', 
                                color: '#ffffff',
                                border: '1px solid var(--accent)'
                              }
                            : { 
                                backgroundColor: 'var(--bg-card)', 
                                borderColor: 'var(--border)', 
                                color: 'var(--text-primary)' 
                              }
                        }
                      >
                        {/* WhatsApp-style Deleted Message Notice */}
                        {isDeleted ? (
                          <div className="flex items-center gap-2 py-0.5 text-slate-400 select-none">
                            <Ban className="w-3.5 h-3.5 shrink-0" />
                            <span>This message was deleted</span>
                          </div>
                        ) : (
                          <>
                            {/* Call Summary Card if it was a call */}
                            {msg.callLog ? (
                              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/10 dark:bg-white/10 my-0.5">
                                {msg.callLog.type === 'video' ? (
                                  <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                                <div className="flex-1 text-[11px] leading-tight">
                                  <p className="font-bold">{msg.callLog.type === 'video' ? 'Video call' : 'Voice call'}</p>
                                  <p className="text-[10px] opacity-80">{msg.callLog.durationStr || 'Completed'}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => startCall(activePartner, msg.callLog.type || 'voice')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold cursor-pointer transition-colors"
                                >
                                  Call back
                                </button>
                              </div>
                            ) : (
                              <p className={isMe ? 'text-white font-medium break-words' : 'break-words'}>{msg.content}</p>
                            )}

                            {/* Attachments (Voice Note Player & Images) */}
                            {msg.attachments?.map((att, aIdx) => (
                              <React.Fragment key={aIdx}>
                                {att.type === 'audio' && (
                                  <div className="mt-2">
                                    <VoiceNotePlayer 
                                      audioUrl={att.url} 
                                      duration={att.duration} 
                                      isMe={isMe} 
                                    />
                                  </div>
                                )}
                                {att.type === 'image' && (
                                  <div
                                    onClick={() => setPreviewImage(att.url)}
                                    className="mt-2 rounded-xl overflow-hidden border max-w-xs cursor-pointer group/img relative"
                                    style={{ borderColor: isMe ? 'rgba(255,255,255,0.2)' : 'var(--border)' }}
                                  >
                                    <img src={att.url} alt="Attachment" className="w-full h-auto max-h-56 object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white font-bold text-xs transition-opacity">
                                      <Eye className="w-5 h-5 mr-1" /> View Full
                                    </div>
                                  </div>
                                )}
                              </React.Fragment>
                            ))}

                            {/* Actionable Chips */}
                            {msg.actionable && (
                              <div 
                                className="mt-3 pt-2 border-t p-2 rounded-xl flex items-center justify-between text-[11px]"
                                style={{ 
                                  borderColor: isMe ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                                  backgroundColor: isMe ? 'rgba(0,0,0,0.15)' : 'var(--bg-elevated)',
                                  color: isMe ? '#ffffff' : 'var(--text-primary)'
                                }}
                              >
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" style={{ color: isMe ? '#ffffff' : 'var(--accent)' }} />
                                  {msg.actionable.title}
                                </span>
                                <button 
                                  onClick={() => convertActionableToPing(msg.actionable)} 
                                  className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                                  style={{ 
                                    backgroundColor: isMe ? 'rgba(255,255,255,0.25)' : 'var(--accent-soft)',
                                    color: isMe ? '#ffffff' : 'var(--accent)'
                                  }}
                                >
                                  + Add Reminder
                                </button>
                              </div>
                            )}

                            {/* Reactions Display */}
                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                              <div 
                                className="flex gap-1 mt-2 text-[10px] px-2 py-0.5 rounded-full inline-flex border"
                                style={{ 
                                  backgroundColor: isMe ? 'rgba(0,0,0,0.2)' : 'var(--bg-elevated)',
                                  borderColor: isMe ? 'rgba(255,255,255,0.2)' : 'var(--border)'
                                }}
                              >
                                {Object.entries(msg.reactions).map(([emoji, count]) => (
                                  <span key={emoji}>{emoji} {count}</span>
                                ))}
                              </div>
                            )}
                          </>
                        )}

                        <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                          <span>{msg.timestamp}</span>
                          {isMe && !isDeleted && <CheckCheck className="w-3 h-3 text-sky-200 shrink-0" />}
                        </div>
                      </div>

                      {/* Message Hover Toolbar (Reactions + WhatsApp Delete) */}
                      {!isDeleted && (
                        <div 
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] p-1 rounded-lg border shadow-sm"
                          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                        >
                          {['❤️', '👍', '😂', '😮', '🔥'].map((e) => (
                            <button key={e} onClick={() => addReaction(msg.id, e)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded cursor-pointer">{e}</button>
                          ))}
                          <button 
                            onClick={() => setDeletingMessage(msg)} 
                            className="p-1 text-red-500 hover:bg-black/5 dark:hover:bg-white/10 rounded cursor-pointer" 
                            title="Delete Message"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isTyping && (
                <div 
                  className="flex items-center gap-2 text-xs p-2.5 rounded-xl max-w-xs border"
                  style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}
                >
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent)' }} />
                  <span>{activeChat?.user?.name} is typing...</span>
                </div>
              )}

              {/* Scroll Anchor */}
              <div ref={messagesEndRef} className="h-1 shrink-0" />
            </div>

            {/* WhatsApp-Style Scroll To Bottom Floating Button */}
            {showScrollBottomBtn && (
              <button
                type="button"
                onClick={() => scrollToBottom('smooth')}
                className="absolute bottom-20 right-6 z-20 p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-[#7256c3] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center animate-bounce"
                title="Scroll to bottom"
              >
                <ChevronDown className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Suggested Replies Bar */}
            {activeChat?.messages[activeChat.messages.length - 1]?.suggestedReplies && (
              <div 
                className="px-4 py-2 border-t flex items-center gap-2 text-xs overflow-x-auto shrink-0"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <span className="font-semibold text-[11px] flex items-center gap-1 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                  <Bot className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> AI Suggestions:
                </span>
                {activeChat.messages[activeChat.messages.length - 1].suggestedReplies.map((replyText, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSelectSuggestedReply(replyText)} 
                    className="px-3 py-1 rounded-full border text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
                    style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    {replyText}
                  </button>
                ))}
              </div>
            )}

            {/* Voice Recording Active Bar (WhatsApp style) */}
            {isRecording && (
              <div className="px-4 py-3 bg-red-500/10 dark:bg-red-500/20 border-t border-red-500/30 flex items-center justify-between text-xs text-red-600 dark:text-red-400 shrink-0">
                <div className="flex items-center gap-3 font-mono">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold">Recording Voice Note ({recordingTime}s)</span>
                  <div className="flex items-center gap-0.5 h-4">
                    {[10, 25, 40, 20, 35, 15, 30].map((h, i) => (
                      <span key={i} className="w-1 bg-red-500 rounded-full animate-pulse" style={{ height: `${h * 0.4}px`, animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={cancelRecording} 
                    className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={stopRecording} 
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                  >
                    <Square className="w-3 h-3 fill-current" /> Stop & Send
                  </button>
                </div>
              </div>
            )}

            {/* Emoji Picker Modal */}
            {showEmojiPicker && (
              <EmojiPicker
                onSelectEmoji={(emoji) => {
                  setInputContent((prev) => prev + emoji);
                }}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}

            {/* Message Input Form */}
            <form 
              onSubmit={handleSend} 
              className="p-4 border-t flex items-center gap-3 transition-colors duration-200 shrink-0"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div 
                className="flex-1 rounded-2xl px-4 py-2.5 flex items-center gap-2 border transition-colors"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
              >
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="cursor-pointer transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  title="Select Emoji"
                >
                  <Smile className="w-4 h-4 hover:text-amber-500" />
                </button>
                
                <input
                  type="text"
                  value={inputContent}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={`Message ${activeDisplayName}...`}
                  className="w-full bg-transparent text-xs outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
                
                {/* Image File Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  title="Attach Image / Video"
                >
                  <Paperclip className="w-4 h-4 hover:text-indigo-500" />
                </button>
                
                {/* Voice Note Mic Button */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isRecording ? 'text-red-500 bg-red-500/20 animate-pulse' : 'hover:text-purple-500'
                  }`}
                  style={{ color: isRecording ? undefined : 'var(--text-muted)' }}
                  title={isRecording ? 'Stop Voice Note' : 'Record Voice Note'}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <button 
                type="submit" 
                disabled={!inputContent.trim()} 
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all relative z-20 shrink-0"
                style={{ backgroundColor: 'var(--accent)' }}
                title={inputContent.trim() ? 'Send' : 'Type a message'}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>

      {/* Image Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Fullscreen Attachment Preview" className="w-full h-auto max-h-[85vh] object-contain" />
            <div className="p-3 bg-black/70 flex justify-end">
              <a
                href={previewImage}
                download="pingx_attachment.png"
                className="btn-discord-blurple px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Original
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Message Delete Confirmation Modal */}
      <DeleteMessageModal
        isOpen={Boolean(deletingMessage)}
        onClose={() => setDeletingMessage(null)}
        message={deletingMessage}
        isMe={deletingMessage?.senderId === user?.id || deletingMessage?.senderId === 'user_me'}
        onConfirmDelete={(deleteType) => {
          if (deletingMessage) {
            deleteMessage(deletingMessage.id, deleteType);
            setDeletingMessage(null);
          }
        }}
      />

      {/* WhatsApp / FaceTime Voice & Video Call Modal */}
      <CallModal
        isOpen={Boolean(activeCall)}
        onClose={() => endCall()}
        callType={activeCall?.callType || 'voice'}
        partner={activeCall?.partner || activePartner}
        currentUser={user}
        onEndCall={(summary) => endCall(summary)}
      />

      {/* Incoming Call Overlay */}
      <IncomingCallModal
        incomingCall={incomingCall}
        onAnswer={answerCall}
        onReject={rejectCall}
      />

      <GroupSummaryModal isOpen={summaryModalOpen} onClose={() => setSummaryModalOpen(false)} summary={activeSummary} />
      <AddContactModal isOpen={isAddContactOpen} onClose={() => setIsAddContactOpen(false)} onSave={addContact} />
    </div>
  );
}
