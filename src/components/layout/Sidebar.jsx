import React from 'react';
import { 
  Home, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon,
  User, 
  Settings, 
  Info, 
  LogOut, 
  ChevronLeft 
} from 'lucide-react';
import { usePings } from '../../context/PingsContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, onNavigateToLanding }) {
  const { unreadCount } = usePings();
  const { user, logout, isGuest, guestSecondsLeft, openAuthModal } = useAuth();

  const mainNavItems = [
    { id: 'home',    label: 'Home',            icon: Home },
    { id: 'chats',   label: 'Direct Messages', icon: MessageSquare },
    { id: 'shop',    label: 'Smart Shop',      icon: ShoppingBag },
    { id: 'connect', label: 'Connect',         icon: Users },
    { id: 'gallery', label: 'Gallery',         icon: ImageIcon },
  ];

  const bottomNavItems = [
    { id: 'profile',  label: 'Profile',   icon: User },
    { id: 'settings', label: 'Settings',  icon: Settings },
    { id: 'about',    label: 'About',     icon: Info },
  ];

  const navBtn = (item, isActive) => (
    <button
      key={item.id}
      onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
      className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer"
      style={{
        backgroundColor: isActive ? 'var(--accent)' : 'transparent',
        color: isActive ? '#fff' : 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <div className="flex items-center gap-3">
        <item.icon className="w-4 h-4" />
        <span className="font-medium">{item.label}</span>
      </div>
      {item.badgeCount > 0 && (
        <span
          className="text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          {item.badgeCount}
        </span>
      )}
    </button>
  );

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 w-64 flex flex-col transition-transform duration-300 border-r shadow-sm ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Brand Header */}
      <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => {
            if (onNavigateToLanding) onNavigateToLanding();
            else setActiveTab('home');
          }}
          className="text-xl font-black font-heading tracking-wide cursor-pointer transition-transform hover:scale-105"
          style={{ color: 'var(--text-primary)' }}
          title="Return to Landing Page"
        >
          PING<span style={{ color: 'var(--accent)' }}>X</span>
        </button>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-5">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Navigation</p>
          {mainNavItems.map((item) => navBtn(item, activeTab === item.id))}
        </div>

        <div className="space-y-1 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="px-3 text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Account</p>
          {bottomNavItems.map((item) => navBtn(item, activeTab === item.id))}
        </div>
      </div>

      {/* Guest Mode Banner in Sidebar */}
      {isGuest && (
        <div className="px-3.5 py-2.5 mx-3 mb-2 rounded-xl border space-y-1.5" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--accent)' }}>
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span style={{ color: 'var(--accent)' }}>⏳ Guest Preview</span>
            <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatTime(guestSecondsLeft)}</span>
          </div>
          <button
            onClick={() => openAuthModal && openAuthModal('register')}
            className="w-full py-1 rounded-lg text-[10px] font-extrabold text-white cursor-pointer transition-all"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Save Account / Sign In
          </button>
        </div>
      )}

      {/* User Footer Card */}
      <div className="p-3.5 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="flex items-center justify-between">
          <div onClick={() => setActiveTab('profile')} className="flex items-center gap-3 cursor-pointer overflow-hidden group">
            <Avatar 
              src={user?.avatar} 
              name={user?.name || 'Member'} 
              size="md"
              showOnline={true}
              online={true}
              className="border-2 group-hover:scale-105 transition-transform" 
              style={{ borderColor: 'var(--accent)' }} 
            />
            <div className="truncate">
              <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Member'}</p>
              <p className="text-[10px] font-semibold truncate" style={{ color: 'var(--text-muted)' }}>@{user?.username || 'user'}</p>
            </div>
          </div>
          <button onClick={logout} title="Sign out" className="p-2 rounded-xl cursor-pointer transition-colors hover:text-red-500" style={{ color: 'var(--text-muted)' }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
