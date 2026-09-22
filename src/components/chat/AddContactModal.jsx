import React, { useState } from 'react';
import { X, UserPlus, User, Search, Check, ShieldCheck, MessageCircle, Send, AtSign, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AddContactModal({ isOpen, onClose, onSave }) {
  const { user, searchUsers, sendFriendRequest, friendRequests, respondToFriendRequest, accounts } = useAuth();
  const { addToast } = useToast();
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
          // If server returned a chat, open it
          if (res.chat && typeof onSave === 'function') {
            // open or create local chat for server chat
            // `onSave` is expected to open a chat when passed a user-like object; call it first
            onSave({
              name: sender.name,
              username: sender.username,
              email: sender.email,
              phone: sender.phone,
              avatar: sender.avatar,
              bio: sender.bio
            });
            // then dispatch a custom event so ChatContext can pick up and set active chat
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1e2353] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-[#5865f2]/40 shadow-2xl relative space-y-5 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#0a0d3a] border border-[#5865f2]/30 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#5865f2]/20 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#5865f2] text-white flex items-center justify-center font-black shadow-lg">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black font-heading uppercase text-white">User Search & Requests</h3>
            <p className="text-xs text-gray-300 font-medium">Search registered users & manage friend requests</p>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex bg-[#0a0d3a] p-1 rounded-xl text-xs font-bold border border-[#5865f2]/30">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'search' ? 'bg-[#5865f2] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            🔍 Search Registered Users
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer relative ${
              activeTab === 'requests' ? 'bg-[#5865f2] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            🔔 Requests ({incomingRequests.length})
          </button>
        </div>

        {/* Action Status Notice */}
        {actionSuccess && (
          <div className="bg-[#35ed7e]/20 border border-[#35ed7e]/40 p-2.5 rounded-xl text-center text-[#35ed7e] font-black text-xs flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" /> {actionSuccess}
          </div>
        )}

        {activeTab === 'search' ? (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#5865f2] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Search by name or @username..."
                className="w-full bg-[#0a0d3a] rounded-2xl border border-[#5865f2]/30 pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none font-bold focus:border-[#5865f2]"
                autoFocus
              />
            </div>

            {/* Registered Users Search Results */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {searchResults.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">
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
                      className="bg-[#0a0d3a] p-3 rounded-2xl border border-[#5865f2]/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-[#5865f2]" />
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{u.name}</p>
                          <p className="text-[10px] text-[#35ed7e] font-mono">@{u.username}</p>
                        </div>
                      </div>

                      {isAccepted ? (
                        <span className="text-[10px] font-black text-[#35ed7e] bg-[#35ed7e]/20 px-2.5 py-1 rounded-xl">
                          Friends ✓
                        </span>
                      ) : isPending ? (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                            <button
                              onClick={() => handleSendRequest(u)}
                              disabled={loadingIds[u.id]}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer shadow-md ${loadingIds[u.id] ? 'opacity-60 cursor-wait' : 'btn-discord-green'}`}
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
            <h4 className="text-xs font-bold text-gray-300">Incoming Friend Requests</h4>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {incomingRequests.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  No pending friend requests.
                </div>
              ) : (
                incomingRequests.map((req) => {
                  const sender = accounts.find((a) => a.id === req.senderId);
                  if (!sender) return null;
                  return (
                    <div
                      key={req.id}
                      className="bg-[#0a0d3a] p-3 rounded-2xl border border-[#5865f2]/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={sender.avatar} alt={sender.name} className="w-9 h-9 rounded-full object-cover border border-[#5865f2]" />
                        <div>
                          <p className="text-xs font-bold text-white">{sender.name}</p>
                          <p className="text-[10px] text-[#35ed7e]">@{sender.username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="bg-[#35ed7e] text-black px-2.5 py-1.5 rounded-xl text-[10px] font-black hover:bg-[#4df48f] transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="bg-red-500/20 text-red-300 border border-red-500/40 px-2.5 py-1.5 rounded-xl text-[10px] font-bold hover:bg-red-500/30 transition-all cursor-pointer"
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
              <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-center text-red-300 font-medium text-xs">{errorNotice}</div>
            )}

      </div>
    </div>
  );
}
