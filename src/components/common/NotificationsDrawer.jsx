import React, { useState } from 'react';
import { X, Heart, MessageCircle, UserPlus, ShieldAlert, Check } from 'lucide-react';
import { Avatar } from './Avatar';

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    user: {
      name: 'PingX System',
      username: 'pingx.security',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=pingx_system',
    },
    type: 'security',
    text: 'Welcome to PingX! Your secure communications and commerce space is ready.',
    time: 'Just now',
    section: 'today'
  },
  {
    id: 'notif_encryption',
    user: {
      name: 'Realtime Guard',
      username: 'pingx.guard',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=pingx_guard',
    },
    type: 'security',
    text: 'Your connection has been verified with WebSocket realtime telemetry.',
    time: '1h',
    section: 'today'
  }
];

export function NotificationsDrawer({ isOpen, onClose }) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'following' | 'comments' | 'follows'
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  if (!isOpen) return null;

  const toggleFollow = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFollowing: !n.isFollowing } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filterTab === 'comments') return n.type === 'comment';
    if (filterTab === 'follows') return n.type === 'follow';
    return true;
  });

  const todayItems = filtered.filter((n) => n.section === 'today');
  const earlierItems = filtered.filter((n) => n.section === 'earlier');

  return (
    <div 
      className="fixed inset-0 z-50 flex pointer-events-none animate-fadeIn"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />

      {/* Slide-out drawer on left (next to collapsed sidebar) */}
      <div 
        className="relative pointer-events-auto w-96 bg-white h-full shadow-2xl border-r border-[#e6e2f8] flex flex-col z-50 text-slate-900 animate-slideRight"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-extrabold font-heading text-slate-900 tracking-tight">
            Notifications
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'following', label: 'People you follow' },
            { id: 'comments', label: 'Comments' },
            { id: 'follows', label: 'Follows' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterTab(pill.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold text-xs transition-colors cursor-pointer ${
                filterTab === pill.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
          
          {/* Today Group */}
          {todayItems.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Today</h4>
              <div className="space-y-3">
                {todayItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-1">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={item.user.avatar} 
                        name={item.user.name} 
                        size="md" 
                      />
                      <div className="leading-snug">
                        <span className="font-bold text-slate-900">{item.user.username}</span>{' '}
                        <span className="text-slate-600">{item.text}</span>{' '}
                        <span className="text-[10px] text-slate-400 block sm:inline">{item.time}</span>
                      </div>
                    </div>

                    {item.type === 'follow' && (
                      <button
                        onClick={() => toggleFollow(item.id)}
                        className={`px-4 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                          item.isFollowing
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-[#7256c3] text-white hover:bg-[#6044b3]'
                        }`}
                      >
                        {item.isFollowing ? 'Following' : 'Follow Back'}
                      </button>
                    )}

                    {item.thumbnail && (
                      <img src={item.thumbnail} alt="post" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earlier Group */}
          {earlierItems.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Earlier</h4>
              <div className="space-y-3">
                {earlierItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-1">
                    <div className="flex items-center gap-3">
                      {item.type === 'security' ? (
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                      ) : (
                        <Avatar 
                          src={item.user.avatar} 
                          name={item.user.name} 
                          size="md" 
                        />
                      )}
                      <div className="leading-snug">
                        {item.type !== 'security' && (
                          <span className="font-bold text-slate-900">{item.user.username} </span>
                        )}
                        <span className="text-slate-600">{item.text}</span>{' '}
                        <span className="text-[10px] text-slate-400 block sm:inline">{item.time}</span>
                      </div>
                    </div>

                    {item.type === 'follow' && (
                      <button
                        onClick={() => toggleFollow(item.id)}
                        className={`px-4 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                          item.isFollowing
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-[#7256c3] text-white hover:bg-[#6044b3]'
                        }`}
                      >
                        {item.isFollowing ? 'Following' : 'Follow Back'}
                      </button>
                    )}

                    {item.thumbnail && (
                      <img src={item.thumbnail} alt="post" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
