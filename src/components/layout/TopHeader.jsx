import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, CheckCheck } from 'lucide-react';
import { usePings } from '../../context/PingsContext';
import { useAuth } from '../../context/AuthContext';
import { UserAccountAvatar } from '../smoothui/user-account-avatar/UserAccountAvatar';

export function TopHeader({ 
  activeTab, 
  setActiveTab, 
  onOpenCommandPalette, 
  onToggleSidebar, 
  isSidebarExpanded, 
  onToggleSidebarExpand, 
  onNavigateToLanding,
  onOpenNotifications
}) {
  const { unreadCount, pings, markAsRead, markAllAsRead } = usePings();
  const { user, isGuest, guestSecondsLeft, openAuthModal, updateProfile, friendRequests = [] } = useAuth();

  const incomingRequests = (friendRequests || []).filter(
    (req) => req.receiverId === user?.id && req.status === 'pending'
  );
  const totalNotifications = (unreadCount || 0) + incomingRequests.length;

  const [showPingsDropdown, setShowPingsDropdown] = useState(false);
  const pingsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (pingsRef.current && !pingsRef.current.contains(e.target)) setShowPingsDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const TITLES = {
    home: 'Command Center', 
    chats: 'Direct Messages', 
    shop: 'Smart Shop',
    connect: 'Connect People',
    gallery: 'Personal Gallery',
    profile: 'Profile', 
    settings: 'Settings', 
    about: 'About PingX',
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between border-b shadow-xs bg-white border-[#e6e2f8]"
    >
      {/* Left Breadcrumb & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl cursor-pointer text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          title="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleSidebarExpand}
          className="hidden lg:flex p-2 rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-[#e6e2f8] transition-colors"
          title={isSidebarExpanded ? "Collapse Sidebar to Icons" : "Expand Sidebar"}
        >
          <Menu className="w-4 h-4 text-slate-600" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToLanding}
            className="text-xs font-semibold text-slate-500 hover:text-[#7256c3] transition-colors cursor-pointer hidden sm:inline"
            title="Return to Landing Page"
          >
            PingX
          </button>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-xs font-semibold text-slate-500 hidden md:inline">
            Realtime Hub
          </span>
          <span className="text-slate-300 hidden md:inline">/</span>
          <button
            onClick={onNavigateToLanding}
            className="text-sm sm:text-base font-extrabold font-heading tracking-tight text-slate-900 cursor-pointer hover:opacity-80 transition-opacity"
            title="Return to Landing Page"
          >
            {TITLES[activeTab] || 'Command Center'}
          </button>

          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            8 Stores Synced
          </span>
        </div>
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

        {/* Notifications Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              } else {
                setShowPingsDropdown(!showPingsDropdown);
              }
            }}
            className="p-2.5 rounded-2xl cursor-pointer relative border transition-all hover:bg-slate-100 hover:border-violet-200"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            title="Notifications & Friend Requests"
          >
            <Bell className="w-5 h-5 text-[#7256c3]" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full flex items-center justify-center bg-rose-500 text-white shadow-xs border-2 border-white animate-pulse">
                {totalNotifications > 99 ? '99+' : totalNotifications}
              </span>
            )}
          </button>
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
