import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  UserPlus, 
  Check, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Grid, 
  Image as ImageIcon,
  Share2,
  ExternalLink
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

export function UserProfileModal({ 
  user: profileUser, 
  isOpen, 
  onClose, 
  onStartChat 
}) {
  const { user: currentUser, friendRequests, sendFriendRequest, respondToFriendRequest } = useAuth();
  const { createDirectChat, setActiveChatId } = useChat();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'about'
  const [requestSent, setRequestSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !profileUser) return null;

  const isSelf = currentUser && (currentUser.id === profileUser.id || currentUser.email === profileUser.email);

  // Check relationship status
  const existingRequest = friendRequests?.find(
    (r) =>
      (r.senderId === currentUser?.id && r.receiverId === profileUser.id) ||
      (r.receiverId === currentUser?.id && r.senderId === profileUser.id)
  );

  const isFriend = existingRequest?.status === 'accepted';
  const isPendingSent = existingRequest?.senderId === currentUser?.id && existingRequest?.status === 'pending';
  const isPendingReceived = existingRequest?.receiverId === currentUser?.id && existingRequest?.status === 'pending';

  const handleMessageClick = () => {
    onClose();
    if (onStartChat) {
      onStartChat(profileUser);
    } else if (createDirectChat) {
      const chat = createDirectChat(profileUser.id);
      if (chat && setActiveChatId) {
        setActiveChatId(chat.id);
      }
    }
  };

  const handleConnectClick = async () => {
    if (isPendingReceived) {
      await respondToFriendRequest(existingRequest.id, 'accepted');
    } else {
      setRequestSent(true);
      await sendFriendRequest(profileUser.id);
    }
  };

  const handleCopyProfile = () => {
    navigator.clipboard?.writeText(window.location.origin + `?profile=${profileUser.username || profileUser.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Mock public gallery items for profile (if none provided)
  const userGallery = profileUser.gallery && profileUser.gallery.length > 0 
    ? profileUser.gallery 
    : [
        {
          id: 'g1',
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
          title: 'Hi-Fi Audio Gear'
        },
        {
          id: 'g2',
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          title: 'Daily Smartwatch Setup'
        },
        {
          id: 'g3',
          url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
          title: 'Tech Accessories'
        }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 flex flex-col max-h-[92vh] animate-scaleUp text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Banner with Gradient */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-[#7256c3] via-indigo-600 to-violet-500 relative shrink-0">
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs z-20"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Share Profile button */}
          <button
            onClick={handleCopyProfile}
            className="absolute top-3.5 right-13 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs z-20"
            title="Share Profile Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 pb-4 relative shrink-0 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-3">
            <div className="relative">
              <Avatar
                src={profileUser.avatar}
                name={profileUser.name}
                size="xl"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg bg-white object-cover"
              />
              <span 
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" 
                title="Active on PingX"
              />
            </div>

            {/* Action Buttons */}
            {!isSelf && (
              <div className="flex items-center gap-2.5">
                {/* Connect / Friend Status button */}
                {isFriend ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Friends</span>
                  </span>
                ) : isPendingSent || requestSent ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Request Sent</span>
                  </span>
                ) : isPendingReceived ? (
                  <button
                    onClick={handleConnectClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Request</span>
                  </button>
                ) : (
                  <button
                    onClick={handleConnectClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}

                {/* Direct Message button */}
                <button
                  onClick={handleMessageClick}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white text-xs font-bold transition-all shadow-md shadow-[#7256c3]/20 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              </div>
            )}
          </div>

          {/* Name & Handles */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black font-heading text-slate-900 tracking-tight">
                {profileUser.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-[#7256c3] border border-violet-200">
                <ShieldCheck className="w-3 h-3 text-[#7256c3]" />
                <span>{profileUser.role || 'Member'}</span>
              </span>
            </div>
            
            <p className="text-xs font-semibold text-slate-500">
              @{profileUser.username || (profileUser.name || 'user').toLowerCase().replace(/\s+/g, '')}
            </p>
          </div>

          {/* Bio */}
          <p className="text-xs text-slate-700 leading-relaxed mt-2.5 font-normal">
            {profileUser.bio || 'PingX Community Member • Exploring conversations and deals.'}
          </p>

          {/* Public Metadata (Safe, Privacy-Preserved) */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium mt-3 pt-3 border-t border-slate-100">
            {profileUser.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{profileUser.location}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Joined {profileUser.joinedDate || '2026'}</span>
            </div>

            {profileUser.gender && profileUser.gender !== 'Prefer not to say' && (
              <span className="text-slate-400">
                • {profileUser.gender}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-100 px-6 shrink-0 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'posts' 
                ? 'border-[#7256c3] text-[#7256c3]' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Highlights & Posts</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'about' 
                ? 'border-[#7256c3] text-[#7256c3]' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Profile</span>
          </button>
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                {userGallery.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs"
                  >
                    <img 
                      src={item.url || item} 
                      alt={item.title || 'User Post'} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white">
                      <p className="text-[10px] font-bold line-clamp-2">{item.title || 'View Post'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 space-y-1">
                <p className="font-bold text-[11px] text-slate-700">PingX Verified Community Postings</p>
                <p className="text-[10px]">All media and product recommendations shared by {profileUser.name.split(' ')[0]} are end-to-end encrypted.</p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#7256c3]" />
                  <span>Platform Verification</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {profileUser.name} is an active, verified member on PingX. Real-time encryption is enabled for all direct communications with this user.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account ID</span>
                  <p className="font-mono text-xs font-bold text-slate-800 truncate">{profileUser.id}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online & Active
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UserProfileModal;
