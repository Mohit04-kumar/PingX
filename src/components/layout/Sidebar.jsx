import React, { useState } from 'react';
import { 
  Home, 
  Search,
  Compass,
  Send, 
  Heart,
  PlusSquare,
  ShoppingBag, 
  User, 
  Settings, 
  Menu,
  LogOut, 
  ChevronLeft,
  Bookmark,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
  onOpenNotifications,
  onOpenSearch
}) {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // The sidebar is visually expanded if either user locked it expanded OR is currently hovering over it
  const effectiveExpanded = isExpanded || isHovered;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => setActiveTab('home') },
    { id: 'search', label: 'Search', icon: Search, action: onOpenSearch },
    { id: 'explore', label: 'Explore', icon: Compass, action: () => setActiveTab('explore') },
    { id: 'chats', label: 'Messages', icon: Send, badge: 1, action: () => setActiveTab('chats') },
    { id: 'notifications', label: 'Notifications', icon: Heart, badge: 2, action: onOpenNotifications },
    { id: 'create', label: 'Create', icon: PlusSquare, action: onOpenCreate },
    { id: 'shop', label: 'Smart Shop', icon: ShoppingBag, action: () => setActiveTab('shop') },
    { id: 'profile', label: 'Profile', isAvatar: true, action: () => setActiveTab('profile') }
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
        <div className={`h-16 px-5 border-b border-[#e6e2f8] flex items-center ${effectiveExpanded ? 'justify-between' : 'justify-center'}`}>
          {effectiveExpanded ? (
            <button
              onClick={() => {
                if (onNavigateToLanding) onNavigateToLanding();
                else setActiveTab('home');
              }}
              className="text-xl font-extrabold font-heading tracking-wide cursor-pointer transition-transform hover:scale-105 text-slate-900 flex items-center gap-1.5"
              title="Return to Landing Page"
            >
              <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7256c3] to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                P
              </span>
              <span>PING<span className="text-[#7256c3]">X</span></span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onNavigateToLanding) onNavigateToLanding();
                else setActiveTab('home');
              }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7256c3] to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs hover:scale-105 transition-transform cursor-pointer"
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

        {/* Navigation Links (Instagram Style) */}
        <div className="px-3 py-5 space-y-1.5">
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
                    ? 'bg-[#7256c3] text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-medium'
                }`}
                title={!effectiveExpanded ? item.label : undefined}
              >
                {/* Icon or Avatar */}
                <div className="relative shrink-0 flex items-center justify-center">
                  {item.isAvatar ? (
                    <Avatar 
                      src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'} 
                      name={user?.name || 'Raman Raj'} 
                      size="xs"
                      className={`border-2 ${isActive ? 'border-white' : 'border-slate-300'}`}
                    />
                  ) : (
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-700'}`} />
                  )}

                  {/* Red Notification Badge */}
                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Text Label (when expanded or hovered) */}
                {effectiveExpanded && (
                  <span className="text-xs truncate tracking-wide animate-fadeIn">
                    {item.label}
                  </span>
                )}

                {/* Floating Tooltip when collapsed & not hovered */}
                {!effectiveExpanded && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: "More" Menu & Profile Trigger */}
      <div className="p-3 border-t border-[#e6e2f8] relative">
        
        {/* More Menu Dropdown Popover */}
        {isMoreMenuOpen && (
          <div className="absolute bottom-16 left-3 w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 space-y-1 text-xs animate-scaleUp text-slate-800">
            <button
              onClick={() => { setActiveTab('settings'); setIsMoreMenuOpen(false); }}
              className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left font-medium cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" /> Settings
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setIsMoreMenuOpen(false); }}
              className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left font-medium cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-slate-500" /> Saved Deals
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
          {effectiveExpanded && <span className="text-xs font-semibold truncate">More</span>}
        </button>

      </div>
    </aside>
  );
}
