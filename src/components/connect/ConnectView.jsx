import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  Check, 
  Clock, 
  MessageSquare, 
  MapPin, 
  Award, 
  X, 
  Image as ImageIcon,
  Heart,
  Send
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useProfileModal } from '../../context/ProfileModalContext';

export function ConnectView({ setActiveTab }) {
  const { 
    user, 
    accounts, 
    friendRequests, 
    sendFriendRequest, 
    searchUsers,
    refreshUsers
  } = useAuth();
  const { startDirectChat } = useChat();
  const { openUserProfile } = useProfileModal();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  React.useEffect(() => {
    if (refreshUsers) refreshUsers();
  }, [refreshUsers]);

  const filteredUsers = (searchUsers ? searchUsers(searchQuery) : []).filter(u => u && u.id !== user?.id);

  const getRequestStatus = (targetId) => {
    if (!targetId || !Array.isArray(friendRequests)) return null;
    const req = friendRequests.find(
      r => (r && r.senderId === user?.id && r.receiverId === targetId) ||
           (r && r.receiverId === user?.id && r.senderId === targetId)
    );
    return req ? req.status : null;
  };

  const handleSendRequest = (targetUser) => {
    const res = sendFriendRequest(targetUser.id);
    setActionNotice(`Friend request sent to ${targetUser.name}!`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleOpenChat = (targetUser) => {
    if (startDirectChat) {
      startDirectChat(targetUser);
    }
    if (typeof setActiveTab === 'function') {
      setActiveTab('chats');
    }
    window.dispatchEvent(new CustomEvent('pingx:switchTab', { detail: 'chats' }));
    window.dispatchEvent(new CustomEvent('pingx:startDirectChat', { detail: targetUser }));
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-10">
      
      {/* Header Banner */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border space-y-4 shadow-sm relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold font-heading flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--accent)' }} /> Connect People
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              Discover registered members, send friend requests, view profiles, and start direct conversations.
            </p>
          </div>

          <span className="text-xs font-bold px-4 py-2 rounded-full border self-start font-mono" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
            {filteredUsers.length} Members Available
          </span>
        </div>

        {/* Live Search Bar */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 absolute left-4 top-5.5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username (@raman), or role..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs font-medium border outline-none transition-all"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        {actionNotice && (
          <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" /> {actionNotice}
          </div>
        )}
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-3xl border space-y-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <Users className="w-10 h-10 mx-auto opacity-40" style={{ color: 'var(--accent)' }} />
            <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>No members found</h4>
            <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
              When new members register on PingX, they will automatically appear here.
            </p>
          </div>
        ) : (
          filteredUsers.map((member) => {
            const status = getRequestStatus(member.id);
            return (
              <div
                key={member.id}
                className="p-6 rounded-3xl border space-y-5 hover-lift shadow-xs flex flex-col justify-between transition-all"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="space-y-4">
                  {/* Top info */}
                  <div 
                    onClick={() => openUserProfile(member)}
                    className="flex items-center gap-4 cursor-pointer group"
                    title="Click to view member profile"
                  >
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="lg"
                      className="border-2 shadow-sm group-hover:scale-105 transition-transform"
                      style={{ borderColor: 'var(--accent)' }}
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-base font-bold font-heading truncate group-hover:text-[#7256c3] transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {member.name}
                      </h4>
                      <p className="text-xs font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                        @{member.username}
                      </p>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {member.location || 'Member'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {member.bio || 'No bio provided yet.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenChat(member)}
                      className="flex-1 btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-transform hover:scale-[1.02] active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>

                    {status === 'pending' ? (
                      <button
                        type="button"
                        disabled
                        className="px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 border opacity-75"
                        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                        title="Friend request pending"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending
                      </button>
                    ) : status === 'accepted' ? (
                      <span 
                        className="px-2.5 py-2 rounded-xl text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                        title="Connected Friends"
                      >
                        <Check className="w-3 h-3" /> Friends
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendRequest(member)}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        title="Send friend request"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#7256c3]" /> Connect
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => openUserProfile(member)}
                      className="px-3.5 py-2.5 rounded-xl text-xs font-bold border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      title="View Member Profile & Gallery"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
