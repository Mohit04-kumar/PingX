import React, { useState } from 'react';
import { X, UserPlus, User, Search, Check, ShieldCheck, MessageCircle, Send, AtSign, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useProfileModal } from '../../context/ProfileModalContext';

export function AddContactModal({ isOpen, onClose, onSave }) {
  const { user, searchUsers, sendFriendRequest, friendRequests, respondToFriendRequest, accounts } = useAuth();
  const { addToast } = useToast();
  const { openUserProfile } = useProfileModal();
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'requests'
  const [searchHandle, setSearchHandle] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [loadingIds, setLoadingIds] = useState({});
  const [errorNotice, setErrorNotice] = useState('');

  if (!isOpen) return null;

  const searchResults = searchUsers(searchHandle);
  const incomingRequests = (friendRequests || []).filter(
    (req) => req.receiverId === user?.id && req.status === 'pending'
  );

  const handleSendRequest = (targetUser) => {
    if (!targetUser) return;
    setErrorNotice('');
    setLoadingIds((s) => ({ ...s, [targetUser.id]: true }));
    sendFriendRequest(targetUser.id)
      .then((res) => {
        setLoadingIds((s) => ({ ...s, [targetUser.id]: false }));
        if (res.success) {
          setActionSuccess(`Friend request sent to @${targetUser.username}!`);
          addToast('Request Sent', `Friend request sent to @${targetUser.username}`, 'success', 3000);
          setTimeout(() => setActionSuccess(''), 2500);
        } else {
          setErrorNotice(res.error || 'Failed to send friend request.');
          addToast('Request Failed', res.error || 'Failed to send friend request.', 'warning', 4500);
          setTimeout(() => setErrorNotice(''), 3000);
        }
      })
      .catch((err) => {
        setLoadingIds((s) => ({ ...s, [targetUser.id]: false }));
        setErrorNotice(err?.message || 'Network error');
        setTimeout(() => setErrorNotice(''), 3000);
      });
  };

  const handleAcceptRequest = (req) => {
    const sender = accounts.find((a) => a.id === req.senderId);
    setLoadingIds((s) => ({ ...s, [req.id]: true }));
    respondToFriendRequest(req.id, 'accepted')
      .then((res) => {
        setLoadingIds((s) => ({ ...s, [req.id]: false }));
        if (res && res.success) {
          setActionSuccess(`Accepted request from ${sender?.name || 'User'}! Chat unlocked.`);
          addToast('Request Accepted', `You are now friends with ${sender?.name || 'User'}`, 'success', 3500);
          if (res.chat && typeof onSave === 'function') {
            onSave({
              name: sender.name,
              username: sender.username,
              email: sender.email,
              phone: sender.phone,
              avatar: sender.avatar,
              bio: sender.bio
            });
            window.dispatchEvent(new CustomEvent('pingx:openServerChat', { detail: res.chat }));
          } else {
            if (sender && onSave) {
              onSave({
                name: sender.name,
                username: sender.username,
                email: sender.email,
                phone: sender.phone,
                avatar: sender.avatar,
                bio: sender.bio
              });
              addToast('Chat Ready', `Chat with ${sender?.name || 'User'} opened`, 'success', 3000);
            }
          }
        } else {
          setErrorNotice(res.error || 'Failed to accept request');
          addToast('Accept Failed', res.error || 'Failed to accept request', 'warning', 4000);
          setTimeout(() => setErrorNotice(''), 3000);
        }
        setTimeout(() => setActionSuccess(''), 2500);
      })
      .catch(() => {
        setLoadingIds((s) => ({ ...s, [req.id]: false }));
        setErrorNotice('Network error');
        setTimeout(() => setErrorNotice(''), 3000);
      });
  };

  const handleRejectRequest = (reqId) => {
    respondToFriendRequest(reqId, 'rejected');
    setActionSuccess('Request declined.');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-[#e6e2f8] shadow-2xl relative space-y-5 text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 border border-[#e6e2f8] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#e6e2f8] pb-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-100 text-[#7256c3] flex items-center justify-center font-black shadow-xs">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold font-heading text-slate-900">User Search & Requests</h3>
            <p className="text-xs text-slate-500 font-medium">Search registered users & manage friend requests</p>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex bg-[#f8f7ff] p-1 rounded-xl text-xs font-bold border border-[#e6e2f8]">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'search' ? 'bg-[#7256c3] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔍 Search Users
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer relative ${
              activeTab === 'requests' ? 'bg-[#7256c3] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔔 Requests ({incomingRequests.length})
          </button>
        </div>

        {/* Action Status Notice */}
        {actionSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" /> {actionSuccess}
          </div>
        )}

        {activeTab === 'search' ? (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#7256c3] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Search by name or @username..."
                className="w-full bg-[#f8f7ff] rounded-2xl border border-[#e6e2f8] pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none font-bold focus:border-[#7256c3]"
                autoFocus
              />
            </div>

            {/* Registered Users Search Results */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {searchResults.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No registered users match "{searchHandle}".
                </div>
              ) : (
                searchResults.map((u) => {
                  const existingReq = (friendRequests || []).find(
                    (r) =>
                      (r.senderId === user?.id && r.receiverId === u.id) ||
                      (r.receiverId === user?.id && r.senderId === u.id)
                  );
                  const isAccepted = existingReq?.status === 'accepted';
                  const isPending = existingReq?.status === 'pending';

                  return (
                    <div
                      key={u.id}
                      className="bg-white p-3 rounded-2xl border border-[#e6e2f8] hover:border-violet-200 transition-colors flex items-center justify-between shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openUserProfile(u);
                        }}
                        className="flex items-center gap-3 text-left group cursor-pointer"
                        title="Click to view full profile"
                      >
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-[#e6e2f8] group-hover:border-[#7256c3] transition-colors" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#7256c3] transition-colors">{u.name}</p>
                          <p className="text-[10px] text-[#7256c3] font-mono">@{u.username}</p>
                        </div>
                      </button>

                      {isAccepted ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                          Friends ✓
                        </span>
                      ) : isPending ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendRequest(u)}
                          disabled={loadingIds[u.id]}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs ${
                            loadingIds[u.id] ? 'opacity-60 cursor-wait bg-slate-200 text-slate-500' : 'bg-[#7256c3] text-white hover:bg-[#6245b5]'
                          }`}
                        >
                          {loadingIds[u.id] ? 'Sending...' : 'Send Request'}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600">Incoming Friend Requests</h4>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {incomingRequests.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No pending friend requests.
                </div>
              ) : (
                incomingRequests.map((req) => {
                  const sender = accounts.find((a) => a.id === req.senderId);
                  if (!sender) return null;
                  return (
                    <div
                      key={req.id}
                      className="bg-white p-3 rounded-2xl border border-[#e6e2f8] flex items-center justify-between shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openUserProfile(sender);
                        }}
                        className="flex items-center gap-3 text-left group cursor-pointer"
                        title="Click to view full profile"
                      >
                        <img src={sender.avatar} alt={sender.name} className="w-9 h-9 rounded-full object-cover border border-[#e6e2f8] group-hover:border-[#7256c3] transition-colors" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-[#7256c3] transition-colors">{sender.name}</p>
                          <p className="text-[10px] text-[#7256c3] font-mono">@{sender.username}</p>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="bg-emerald-600 text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-1.5 rounded-xl text-[10px] font-bold hover:bg-rose-100 transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorNotice && (
          <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center text-rose-600 font-medium text-xs">{errorNotice}</div>
        )}

      </div>
    </div>
  );
}
