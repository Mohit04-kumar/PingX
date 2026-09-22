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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu
} from 'lucide-react';
import { usePings } from '../../context/PingsContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen, 
  isExpanded, 
  setIsExpanded, 
  onNavigateToLanding 
}) {
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

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col transition-all duration-300 border-r shadow-xs bg-white border-[#e6e2f8] ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      {/* Brand Header */}
      <div className={`p-4 border-b border-[#e6e2f8] flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        {isExpanded ? (
          <>
            <button
              onClick={() => {
                if (onNavigateToLanding) onNavigateToLanding();
                else setActiveTab('home');
              }}
              className="text-xl font-extrabold font-heading tracking-wide cursor-pointer transition-transform hover:scale-105 text-slate-900"
              title="Return to Landing Page"
            >
              PING<span className="text-[#7256c3]">X</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="hidden lg:flex p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-5 h-5 text-slate-600" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="lg:hidden p-1.5 rounded-lg cursor-pointer text-slate-500 hover:bg-slate-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => {
                if (onNavigateToLanding) onNavigateToLanding();
                else setActiveTab('home');
              }}
              className="w-10 h-10 rounded-2xl bg-violet-100 text-[#7256c3] flex items-center justify-center font-black text-base shadow-xs hover:scale-105 transition-transform cursor-pointer"
              title="Return to Landing Page"
            >
              P
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="hidden lg:flex p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4 scrollbar-none">
        
        {/* Main Nav Section */}
        <div className="space-y-1">
          {isExpanded && (
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Navigation
            </p>
          )}
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`w-full flex items-center rounded-2xl transition-all cursor-pointer relative group ${
                  isExpanded ? 'px-3.5 py-2.5 justify-between' : 'h-11 justify-center'
                } ${
                  isActive
                    ? 'bg-[#7256c3] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
                title={!isExpanded ? item.label : undefined}
              >
                <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`} />
                  {isExpanded && <span className="text-xs truncate">{item.label}</span>}
                </div>

                {/* Floating Tooltip when collapsed */}
                {!isExpanded && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Account Section */}
        <div className="space-y-1 pt-3 border-t border-[#e6e2f8]">
          {isExpanded && (
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Account
            </p>
          )}
          {bottomNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`w-full flex items-center rounded-2xl transition-all cursor-pointer relative group ${
                  isExpanded ? 'px-3.5 py-2.5 justify-between' : 'h-11 justify-center'
                } ${
                  isActive
                    ? 'bg-[#7256c3] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
                title={!isExpanded ? item.label : undefined}
              >
                <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`} />
                  {isExpanded && <span className="text-xs truncate">{item.label}</span>}
                </div>

                {!isExpanded && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Guest Mode Banner if active */}
      {isGuest && (
        <div className={`mx-2 mb-2 p-2 rounded-xl border border-violet-200 bg-violet-50 text-center ${isExpanded ? 'block' : 'hidden'}`}>
          <span className="text-[10px] font-bold text-[#7256c3] block">⏳ Guest ({formatTime(guestSecondsLeft)})</span>
          <button
            onClick={() => openAuthModal && openAuthModal('register')}
            className="w-full mt-1 py-1 rounded-lg text-[10px] font-bold text-white bg-[#7256c3] cursor-pointer"
          >
            Save Account
          </button>
        </div>
      )}

      {/* User Footer Card */}
      <div className={`p-3 border-t border-[#e6e2f8] bg-[#f8f7ff] ${isExpanded ? 'flex items-center justify-between' : 'flex flex-col items-center gap-2'}`}>
        <div 
          onClick={() => setActiveTab('profile')} 
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden group"
          title={!isExpanded ? `${user?.name || 'Raman Raj'} (@${user?.username || 'ramanraj'})` : undefined}
        >
          <Avatar 
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'} 
            name={user?.name || 'Raman Raj'} 
            size={isExpanded ? "md" : "sm"}
            showOnline={true}
            online={true}
            className="border-2 border-violet-200 group-hover:scale-105 transition-transform" 
          />
          {isExpanded && (
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Raman Raj'}</p>
              <p className="text-[10px] font-medium text-slate-500 truncate">@{user?.username || 'ramanraj'}</p>
            </div>
          )}
        </div>

        <button 
          onClick={logout} 
          title="Sign out" 
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
}
