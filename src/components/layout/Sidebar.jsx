import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Search,
  Flame,
  MessageSquare,
  Users,
  PlusCircle,
  ShoppingBag, 
  Settings, 
  Menu,
  LogOut, 
  ChevronLeft,
  Bookmark,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../common/Avatar';

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen, 
  isExpanded, 
  setIsExpanded, 
  onNavigateToLanding,
  onOpenCreate,
  onOpenSearch
}) {
  const { user, logout } = useAuth();
  const { totalUnreadCount = 0 } = useChat();
  const [isHovered, setIsHovered] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Expanded either when pinned open or hovered on desktop
  const effectiveExpanded = isExpanded || isHovered;

  const navItems = [
    { id: 'home', label: 'Command Center', icon: LayoutDashboard, action: () => setActiveTab('home') },
    { 
      id: 'chats', 
      label: 'Direct Messages', 
      icon: MessageSquare, 
      badge: totalUnreadCount > 0 ? (totalUnreadCount > 99 ? '99+' : totalUnreadCount) : null, 
      action: () => setActiveTab('chats') 
    },
    { id: 'connect', label: 'Network & Friends', icon: Users, action: () => setActiveTab('connect') },
    { id: 'explore', label: 'Explore & Feed', icon: Flame, action: () => setActiveTab('explore') },
    { id: 'shop', label: 'Smart Shop', icon: ShoppingBag, action: () => setActiveTab('shop') },
    { id: 'create', label: 'Create Post', icon: PlusCircle, isAction: true, action: onOpenCreate },
    { id: 'profile', label: 'My Profile', isAvatar: true, action: () => setActiveTab('profile') }
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsMoreMenuOpen(false);
      }}
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out border-r shadow-xs bg-white border-[#e6e2f8] ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${effectiveExpanded ? 'w-60 shadow-xl' : 'w-20'}`}
    >
      {/* Top Brand Header */}
      <div>
        <div className={`h-16 px-4 border-b border-[#e6e2f8] flex items-center ${effectiveExpanded ? 'justify-between' : 'justify-center'}`}>
          {effectiveExpanded ? (
            <button
              onClick={() => {
                if (onNavigateToLanding) onNavigateToLanding();
                else setActiveTab('home');
              }}
              className="text-lg font-black font-heading tracking-tight cursor-pointer transition-transform hover:scale-102 text-slate-900 flex items-center gap-2"
              title="Return to Landing Page"
            >
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7256c3] via-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-violet-200">
                P
              </span>
              <span className="font-extrabold tracking-wide">PING<span className="text-[#7256c3]">X</span></span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onNavigateToLanding) onNavigateToLanding();
                else setActiveTab('home');
              }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7256c3] via-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-violet-200 hover:scale-105 transition-transform cursor-pointer"
              title="Return to Landing Page"
            >
              P
            </button>
          )}

          {/* Close drawer on mobile */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-1.5 rounded-lg cursor-pointer text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Shortcut Bar (when expanded) */}
        {effectiveExpanded && (
          <div className="px-3 pt-3">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-500 text-xs transition-colors cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7256c3] transition-colors" />
              <span className="font-medium truncate">Search anything...</span>
              <kbd className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-400">⌘K</kbd>
            </button>
          </div>
        )}

        {/* Executive Navigation Links */}
        <div className="px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.action) item.action();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center rounded-2xl transition-all duration-200 cursor-pointer relative group ${
                  effectiveExpanded ? 'px-3.5 py-3 justify-start gap-3.5' : 'h-11 justify-center'
                } ${
                  isActive
                    ? 'bg-[#7256c3] text-white font-bold shadow-md shadow-violet-200'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-semibold'
                }`}
                title={!effectiveExpanded ? item.label : undefined}
              >
                {/* Icon or Avatar */}
                <div className="relative shrink-0 flex items-center justify-center">
                  {item.isAvatar ? (
                    <Avatar 
                      src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'} 
                      name={user?.name || 'PingX User'} 
                      size="xs"
                      className={`border-2 transition-transform group-hover:scale-105 ${isActive ? 'border-white' : 'border-violet-300'}`}
                    />
                  ) : (
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  )}

                  {/* Dynamic Unread Badge */}
                  {item.badge && !isActive && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Text Label */}
                {effectiveExpanded && (
                  <span className="text-xs truncate tracking-tight animate-fadeIn font-heading">
                    {item.label}
                  </span>
                )}

                {/* Floating Tooltip when collapsed */}
                {!effectiveExpanded && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: "More" Menu & Profile */}
      <div className="p-3 border-t border-[#e6e2f8] relative">
        
        {/* More Menu Dropdown Popover */}
        {isMoreMenuOpen && (
          <div className="absolute bottom-16 left-3 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 space-y-1 text-xs animate-scaleUp text-slate-800">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="font-bold text-slate-900 truncate">{user?.name || 'PingX User'}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">@{user?.username || 'user'}</p>
            </div>
            <button
              onClick={() => { setActiveTab('settings'); setIsMoreMenuOpen(false); }}
              className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left font-medium cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" /> Settings
            </button>
            <button
              onClick={() => { setActiveTab('shop'); setIsMoreMenuOpen(false); }}
              className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left font-medium cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-slate-500" /> Saved Products
            </button>
            <button
              onClick={() => { onNavigateToLanding?.(); setIsMoreMenuOpen(false); }}
              className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left font-medium cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-500" /> About PingX
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button
              onClick={() => { logout(); setIsMoreMenuOpen(false); }}
              className="w-full px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 text-left font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        )}

        {/* More Button */}
        <button
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          className={`w-full flex items-center rounded-2xl transition-colors cursor-pointer text-slate-700 hover:bg-slate-100 ${
            effectiveExpanded ? 'px-3.5 py-3 justify-start gap-3.5' : 'h-11 justify-center'
          }`}
          title="More options"
        >
          <Menu className="w-5 h-5 shrink-0" />
          {effectiveExpanded && <span className="text-xs font-semibold truncate">More Options</span>}
        </button>

      </div>
    </aside>
  );
}
