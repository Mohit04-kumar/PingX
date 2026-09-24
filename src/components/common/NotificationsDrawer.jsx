import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldAlert, 
  Check, 
  CheckCheck, 
  Bell, 
  MessageSquare, 
  Clock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Avatar } from './Avatar';
import { useAuth } from '../../context/AuthContext';
import { usePings } from '../../context/PingsContext';
import { useProfileModal } from '../../context/ProfileModalContext';
import { useToast } from '../../context/ToastContext';

export function NotificationsDrawer({ isOpen, onClose }) {
  const { user, accounts = [], friendRequests = [], respondToFriendRequest } = useAuth();
  const { pings = [], markAsRead, markAllAsRead } = usePings();
  const { openUserProfile } = useProfileModal();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'activity' | 'all'
  const [processingId, setProcessingId] = useState(null);

  if (!isOpen) return null;

  // Pending incoming requests
  const incomingRequests = (friendRequests || []).filter(
    (req) => req.receiverId === user?.id && req.status === 'pending'
  );

  const handleAccept = async (req) => {
    setProcessingId(req.id);
    const sender = accounts.find((a) => a.id === req.senderId);
    try {
      const res = await respondToFriendRequest(req.id, 'accepted');
      if (res && res.success) {
        addToast(
          'Friend Request Accepted',
          `You and ${sender?.name || 'User'} are now connected on PingX!`,
          'success',
          3500
        );
        if (res.chat) {
          window.dispatchEvent(new CustomEvent('pingx:openServerChat', { detail: res.chat }));
        }
      } else {
        addToast('Action Failed', res?.error || 'Could not accept request', 'warning', 3000);
      }
    } catch (err) {
      addToast('Error', 'Network error responding to request', 'error', 3000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (req) => {
    setProcessingId(req.id);
    try {
      await respondToFriendRequest(req.id, 'rejected');
      addToast('Request Declined', 'Friend request declined', 'info', 2500);
    } catch (err) {
      addToast('Error', 'Failed to decline request', 'error', 3000);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out drawer on the right */}
      <div 
        className="relative pointer-events-auto w-full max-w-md bg-white h-full shadow-2xl border-l border-[#e6e2f8] flex flex-col z-50 text-slate-900 animate-slideLeft overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-[#7256c3] flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-heading text-slate-900 tracking-tight">
                Notifications Hub
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Friend requests, messages & updates</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-white text-xs">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer relative flex items-center justify-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-[#7256c3] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Requests</span>
            {incomingRequests.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'requests' ? 'bg-white text-[#7256c3]' : 'bg-rose-500 text-white'
              }`}>
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'activity'
                ? 'bg-[#7256c3] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Activity</span>
            {pings.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'activity' ? 'bg-white text-[#7256c3]' : 'bg-slate-200 text-slate-700'
              }`}>
                {pings.length}
              </span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
          
          {/* TAB 1: Incoming Friend Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                <span>Pending Friend Requests</span>
                <span>{incomingRequests.length} incoming</span>
              </div>

              {incomingRequests.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-6">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-[#7256c3] flex items-center justify-center mx-auto">
                    <UserPlus className="w-6 h-6 opacity-60" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No Pending Requests</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    When someone sends you a friend request on PingX, you will see it right here with accept and decline options.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incomingRequests.map((req) => {
                    const sender = accounts.find((a) => a.id === req.senderId) || {
                      id: req.senderId,
                      name: 'PingX User',
                      username: 'user',
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
                    };

                    const isBusy = processingId === req.id;

                    return (
                      <div 
                        key={req.id}
                        className="p-4 rounded-2xl bg-white border border-[#e6e2f8] shadow-sm hover:border-violet-300 transition-all space-y-3"
                      >
                        {/* Sender info */}
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              openUserProfile(sender);
                            }}
                            className="flex items-center gap-3 text-left group cursor-pointer truncate"
                            title="Click to view full profile"
                          >
                            <Avatar 
                              src={sender.avatar} 
                              name={sender.name} 
                              size="md" 
                              className="border-2 border-violet-200 group-hover:border-[#7256c3] transition-colors"
                            />
                            <div className="truncate">
                              <p className="font-bold text-slate-900 group-hover:text-[#7256c3] transition-colors truncate">
                                {sender.name}
                              </p>
                              <p className="text-[11px] font-mono text-slate-400 truncate">
                                @{sender.username}
                              </p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              openUserProfile(sender);
                            }}
                            className="text-[11px] font-bold text-[#7256c3] hover:underline shrink-0 cursor-pointer"
                          >
                            View DP
                          </button>
                        </div>

                        {sender.bio && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 italic bg-slate-50 p-2 rounded-xl">
                            "{sender.bio}"
                          </p>
                        )}

                        {/* Actions: Accept & Decline */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <button
                            onClick={() => handleAccept(req)}
                            disabled={isBusy}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {isBusy ? 'Processing...' : 'Accept'}
                          </button>

                          <button
                            onClick={() => handleDecline(req)}
                            disabled={isBusy}
                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer border border-slate-200 disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: System Activity & Pings */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                <span>Recent Platform Activity</span>
                {pings.length > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[#7256c3] hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              {pings.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto opacity-40 text-violet-400" />
                  <p className="font-semibold">All caught up!</p>
                  <p className="text-[11px] text-slate-400">No recent activity notifications.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pings.map((ping) => (
                    <div
                      key={ping.id}
                      onClick={() => {
                        markAsRead(ping.id);
                        if (ping.action?.type === 'open_chat') {
                          onClose();
                        }
                      }}
                      className="p-3.5 rounded-2xl bg-white border border-[#e6e2f8] shadow-2xs space-y-1.5 cursor-pointer hover:border-violet-300 transition-colors"
                      style={{ opacity: ping.read ? 0.75 : 1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-violet-50 text-[#7256c3]">
                          {ping.badge || 'Alert'}
                        </span>
                        {!ping.read && (
                          <span className="w-2 h-2 rounded-full bg-[#7256c3] animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{ping.title}</h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{ping.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center text-[10px] font-mono text-slate-400">
          PingX Real-Time Notification Center
        </div>

      </div>
    </div>
  );
}
