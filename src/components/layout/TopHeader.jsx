import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, CheckCheck, X, UserPlus, Sparkles } from 'lucide-react';
import { usePings } from '../../context/PingsContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../common/Avatar';
import { UserAccountAvatar } from '../smoothui/user-account-avatar/UserAccountAvatar';

export function TopHeader({ 
  activeTab, 
  setActiveTab, 
  onOpenCommandPalette, 
  onToggleSidebar, 
  isSidebarExpanded, 
  onToggleSidebarExpand, 
  onNavigateToLanding
}) {
  const { unreadCount, pings, markAsRead, markAllAsRead } = usePings();
  const { user, isGuest, guestSecondsLeft, openAuthModal, updateProfile, accounts = [], friendRequests = [], respondToFriendRequest } = useAuth();
  const { addToast } = useToast();

  const incomingRequests = (friendRequests || []).filter(
    (req) => req.receiverId === user?.id && req.status === 'pending'
  );
  const totalNotifications = (unreadCount || 0) + incomingRequests.length;

  const [showPingsDropdown, setShowPingsDropdown] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState('requests');
  const [processingId, setProcessingId] = useState(null);
  const pingsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (pingsRef.current && !pingsRef.current.contains(e.target)) setShowPingsDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between border-b shadow-xs bg-white border-[#e6e2f8]"
    >
      {/* Left Mobile Menu Toggle Only (Desktop breadcrumbs and hamburger removed as requested) */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl cursor-pointer text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          title="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center search */}
      <div className="hidden md:flex">
        <button
          onClick={onOpenCommandPalette}
          className="rounded-xl border px-4 py-2 flex items-center gap-3 text-xs w-72 lg:w-96 cursor-pointer transition-all"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <Search className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="flex-1 text-left">Search chats, products, people…</span>
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Ctrl K</kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Guest Mode Indicator */}
        {isGuest && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold shadow-xs animate-pulse" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--accent)' }}>
            <span style={{ color: 'var(--accent)' }}>⏳ Guest: {formatTime(guestSecondsLeft)}</span>
            <button
              onClick={() => openAuthModal && openAuthModal('register')}
              className="px-2 py-0.5 rounded-full text-[10px] font-black text-white cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Sign in
            </button>
          </div>
        )}

        <button onClick={onOpenCommandPalette} className="md:hidden p-2 rounded-xl cursor-pointer" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)' }}>
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Trigger & Inline Popover Box */}
        <div className="relative" ref={pingsRef}>
          <button
            onClick={() => setShowPingsDropdown(!showPingsDropdown)}
            className={`p-2.5 rounded-2xl cursor-pointer relative border transition-all ${
              showPingsDropdown 
                ? 'bg-violet-100/80 border-[#7256c3] text-[#7256c3]' 
                : 'hover:bg-slate-100 hover:border-violet-200'
            }`}
            style={{ backgroundColor: showPingsDropdown ? undefined : 'var(--bg-elevated)', borderColor: showPingsDropdown ? undefined : 'var(--border)' }}
            title="Notifications & Friend Requests"
          >
            <Bell className="w-5 h-5 text-[#7256c3]" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full flex items-center justify-center bg-rose-500 text-white shadow-xs border-2 border-white animate-pulse">
                {totalNotifications > 99 ? '99+' : totalNotifications}
              </span>
            )}
          </button>

          {/* Small Dropdown Popover Box (in the presence of background dashboard) */}
          {showPingsDropdown && (
            <div 
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#e6e2f8] shadow-2xl z-50 overflow-hidden flex flex-col animate-fadeIn"
              style={{ maxHeight: '460px' }}
            >
              {/* Box Header */}
              <div className="p-3 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 text-[#7256c3] flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-black tracking-tight text-slate-900">Notifications</h4>
                  {totalNotifications > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-violet-100 text-[#7256c3]">
                      {totalNotifications}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {activeNotifTab === 'activity' && pings.some((p) => !p.read) && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-[#7256c3] hover:underline cursor-pointer px-1"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowPingsDropdown(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
                    title="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-white p-1 gap-1">
                <button
                  onClick={() => setActiveNotifTab('requests')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeNotifTab === 'requests'
                      ? 'bg-[#7256c3] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Requests</span>
                  {incomingRequests.length > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      activeNotifTab === 'requests' ? 'bg-white text-[#7256c3]' : 'bg-violet-100 text-[#7256c3]'
                    }`}>
                      {incomingRequests.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveNotifTab('activity')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeNotifTab === 'activity'
                      ? 'bg-[#7256c3] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Activity</span>
                  {unreadCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      activeNotifTab === 'activity' ? 'bg-white text-[#7256c3]' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Contents */}
              <div className="overflow-y-auto max-h-72 p-2 divide-y divide-slate-50">
                {activeNotifTab === 'requests' ? (
                  incomingRequests.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <UserPlus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">No Pending Requests</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">When someone sends you a friend request, it will appear here.</p>
                    </div>
                  ) : (
                    incomingRequests.map((req) => {
                      const sender = accounts.find((a) => a.id === req.senderId) || { name: req.senderId, username: req.senderId };
                      return (
                        <div key={req.id} className="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar src={sender.avatar} name={sender.name} size="sm" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{sender.name}</p>
                              <p className="text-[10px] text-slate-500 truncate">@{sender.username}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              disabled={processingId === req.id}
                              onClick={async () => {
                                setProcessingId(req.id);
                                try {
                                  const res = await respondToFriendRequest(req.id, 'accepted');
                                  if (res && res.success) {
                                    addToast('Friend Request Accepted', `Connected with ${sender.name || 'User'}`, 'success', 3000);
                                    if (res.chat) {
                                      window.dispatchEvent(new CustomEvent('pingx:openServerChat', { detail: res.chat }));
                                    }
                                  } else {
                                    addToast('Action Failed', res?.error || 'Failed to accept', 'warning', 3000);
                                  }
                                } catch {
                                  addToast('Error', 'Network error', 'error', 3000);
                                } finally {
                                  setProcessingId(null);
                                }
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#7256c3] text-white hover:bg-violet-700 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              disabled={processingId === req.id}
                              onClick={async () => {
                                setProcessingId(req.id);
                                try {
                                  await respondToFriendRequest(req.id, 'rejected');
                                  addToast('Request Declined', 'Friend request declined', 'info', 2500);
                                } catch {
                                  addToast('Error', 'Failed to decline', 'error', 3000);
                                } finally {
                                  setProcessingId(null);
                                }
                              }}
                              className="px-2 py-1 text-[11px] font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  pings.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">All caught up!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">No notifications or price drop alerts right now.</p>
                    </div>
                  ) : (
                    pings.map((ping) => (
                      <div 
                        key={ping.id} 
                        className={`p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                          ping.read ? 'opacity-70 hover:opacity-100 hover:bg-slate-50' : 'bg-violet-50/40 hover:bg-violet-50/70'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#7256c3]" style={{ opacity: ping.read ? 0 : 1 }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7256c3]">
                              {ping.badge || 'Notification'}
                            </span>
                            <span className="text-[9px] text-slate-400 shrink-0">{ping.timestamp}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 mt-0.5">{ping.title}</h5>
                          {ping.content && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{ping.content}</p>}
                        </div>
                        {!ping.read && (
                          <button
                            onClick={() => markAsRead(ping.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Mark read"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Avatar (SmoothUI) */}
        <UserAccountAvatar
          user={{
            name: user?.name || 'PingX User',
            username: user?.username || user?.name || 'user',
            email: user?.email || 'user@pingx.app',
            avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          }}
          onProfileSave={(updated) => {
            if (updateProfile) updateProfile(updated);
          }}
          onOrderView={() => {
            setActiveTab('shop');
          }}
        />
      </div>
    </header>
  );
}
