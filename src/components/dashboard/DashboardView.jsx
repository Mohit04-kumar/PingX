import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { StoryViewerModal } from '../common/StoryViewerModal';
import { CreatePostModal } from '../common/CreatePostModal';
import { CreateStoryModal } from '../common/CreateStoryModal';
import { Avatar } from '../common/Avatar';
import { 
  Plus, 
  Sparkles, 
  Send, 
  ShoppingBag, 
  TrendingDown, 
  MessageSquare, 
  Bookmark, 
  Heart, 
  Share2, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  Flame, 
  Camera, 
  ArrowRight,
  MoreHorizontal,
  Bot,
  Zap,
  Globe,
  Radio,
  SlidersHorizontal,
  Users
} from 'lucide-react';

import { useProfileModal } from '../../context/ProfileModalContext';

export function DashboardView({ setActiveTab }) {
  const { user, accounts = [] } = useAuth();
  const { addToCart, watchlist = [], toggleWatchlist, setIsCartOpen, cart = [] } = useShop();
  const { addToast } = useToast();
  const { openUserProfile } = useProfileModal();

  // Dynamic user posts loaded from storage
  const [feed, setFeed] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pingx_user_posts') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // Dynamic user stories loaded from storage
  const [stories, setStories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pingx_user_stories') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  
  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  // Sync feed and stories to local storage
  const handlePostCreated = (newPost) => {
    const updated = [newPost, ...feed];
    setFeed(updated);
    try {
      localStorage.setItem('pingx_user_posts', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleStoryCreated = (newStory) => {
    const updated = [newStory, ...stories];
    setStories(updated);
    try {
      localStorage.setItem('pingx_user_stories', JSON.stringify(updated));
    } catch (e) {}
  };

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      const isCurrentlyLiked = !!prev[postId];
      return { ...prev, [postId]: !isCurrentlyLiked };
    });
  };

  const toggleSave = (postId) => {
    setSavedPosts((prev) => {
      const isCurrentlySaved = !!prev[postId];
      return { ...prev, [postId]: !isCurrentlySaved };
    });
    addToast('Saved', 'Added to your personal collection & wishlist.', 'info', 2000);
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setFeed((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: (post.commentsCount || 0) + 1,
            comments: [
              ...(post.comments || []),
              { user: user?.username || 'user', text }
            ]
          };
        }
        return post;
      });
      try {
        localStorage.setItem('pingx_user_posts', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    addToast('Comment Posted', text, 'success', 2000);
  };

  // Filter genuine community members (excluding self)
  const genuineCommunityMembers = accounts.filter(
    (acc) => acc.id !== user?.id && acc.email !== user?.email
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 text-slate-900 pb-20 animate-fadeIn">
      
      {/* ── Main Column: Stories & Social Stream (Pillars 1 & 2) ── */}
      <div className="w-full lg:max-w-2xl mx-auto space-y-6">
        
        {/* Top Command Banner: Welcoming genuine user with quick actions */}
        <div className="bg-gradient-to-r from-white via-violet-50/40 to-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#7256c3]">
                PingX Live Command
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight font-heading">
              Welcome back, {user?.name?.split(' ')[0] || user?.username || 'Explorer'} 👋
            </h2>
            <p className="text-xs text-slate-500">
              Your real-time social space, AI assistant, and smart price tracker are active.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#7256c3] hover:bg-[#5f44b0] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-102"
            >
              <Plus className="w-4 h-4" /> New Post
            </button>
            <button
              onClick={() => setIsCreateStoryOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#7256c3]" /> Story
            </button>
          </div>
        </div>

        {/* Dynamic Stories Row (PingX Circles) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-4 sm:gap-6 min-w-max">
            
            {/* Create / Add Story Button */}
            <button
              type="button"
              onClick={() => setIsCreateStoryOpen(true)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#7256c3] group-hover:border-[#5f44b0] bg-violet-50/60 group-hover:bg-violet-100/70 transition-all flex items-center justify-center text-[#7256c3]">
                <Plus className="w-6 h-6 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-[11px] font-bold text-slate-900 truncate max-w-[4.5rem]">
                Add Story
              </span>
            </button>

            {/* Dynamic Stories List */}
            {stories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setSelectedStory(story)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#7256c3] via-indigo-500 to-pink-500 transition-transform group-hover:scale-105">
                  <div className="bg-white p-0.5 rounded-full">
                    <Avatar
                      src={story.storyImage || story.author?.avatar}
                      name={story.author?.name || 'Story'}
                      size="md"
                      className="w-13 h-13 object-cover rounded-full"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-700 truncate max-w-[4.5rem]">
                  {story.author?.name?.split(' ')[0] || 'Story'}
                </span>
              </button>
            ))}

            {stories.length === 0 && (
              <div className="flex items-center gap-2 pl-2 text-xs text-slate-400">
                <span>← Post a 24h photo story with custom link heading</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Social Feed Stream: Dynamic User Posts ── */}
        <div className="space-y-6">
          {feed.length === 0 ? (
            /* Genuine Intentional Empty State (as requested in PART 5) */
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 text-[#7256c3] flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Welcome to PingX 👋
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your PingX space is clean, verified, and ready. There are no fake users or dummy ads here. Share your first post, review, or price drop to get started!
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#5f44b0] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Your First Post
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore Features
                </button>
              </div>
            </div>
          ) : (
            feed.map((post) => {
              const isLiked = !!likedPosts[post.id];
              const isSaved = !!savedPosts[post.id];
              const totalLikes = (post.likesCount || 0) + (isLiked ? 1 : 0);

              return (
                <article 
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-shadow hover:shadow-sm"
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        const authorObj = accounts.find(
                          (a) => a.id === post.author?.id || a.username === post.author?.username || a.name === post.author?.name
                        ) || post.author || { name: post.author?.name || 'User', username: post.author?.username || 'user', avatar: post.author?.avatar };
                        openUserProfile(authorObj);
                      }}
                      className="flex items-center gap-3 text-left group cursor-pointer"
                      title="Click to view profile"
                    >
                      <Avatar 
                        src={post.author?.avatar || user?.avatar} 
                        name={post.author?.name || user?.name || 'User'} 
                        size="sm" 
                        className="border border-slate-200 group-hover:border-[#7256c3] transition-colors"
                      />
                      <div className="leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 font-heading group-hover:text-[#7256c3] transition-colors">
                            {post.author?.username || user?.username}
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full bg-[#7256c3] text-white text-[9px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-400 text-xs">{post.timeAgo || 'Recent'}</span>
                        </div>
                        {post.location && (
                          <span className="text-[11px] text-slate-400 block pt-0.5">
                            {post.location}
                          </span>
                        )}
                      </div>
                    </button>

                    <button 
                      onClick={() => addToast('Post Options', post.title, 'info', 1500)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Media */}
                  {post.image && (
                    <div 
                      onDoubleClick={() => toggleLike(post.id)}
                      className="relative bg-slate-100 aspect-square sm:aspect-4/3 max-h-[500px] w-full overflow-hidden select-none"
                    >
                      <img 
                        src={post.image} 
                        alt={post.title || 'Post'} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Smart Commerce Price Badge if tagged */}
                      {post.currentPrice && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            ₹{post.currentPrice.toLocaleString('en-IN')}
                          </span>
                          {post.lowestMerchant && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-100 text-[#7256c3]">
                              {post.lowestMerchant}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Actions & Interactions */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-slate-700">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                            isLiked ? 'text-rose-500 scale-105' : 'hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{totalLikes}</span>
                        </button>

                        <button 
                          onClick={() => addToast('Comments', 'Add your thought below', 'info', 1500)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>{post.commentsCount || 0}</span>
                        </button>

                        {post.lowestUrl && (
                          <a
                            href={post.lowestUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-bold text-[#7256c3] hover:text-[#5d42a6] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Visit Store</span>
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => toggleSave(post.id)}
                        className={`transition-colors cursor-pointer ${
                          isSaved ? 'text-[#7256c3]' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#7256c3]' : ''}`} />
                      </button>
                    </div>

                    {/* Caption & Content */}
                    <div className="text-xs text-slate-800 space-y-1 leading-relaxed">
                      {post.title && (
                        <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                          {post.title}
                        </h4>
                      )}
                      <p className="text-slate-600 whitespace-pre-line">
                        {post.caption}
                      </p>
                    </div>

                    {/* Comments List */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                        {post.comments.slice(-3).map((c, idx) => (
                          <div key={idx} className="flex items-baseline gap-1.5">
                            <span className="font-bold text-slate-900">@{c.user}:</span>
                            <span className="text-slate-600">{c.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Input */}
                    <form onSubmit={(e) => handleAddComment(post.id, e)} className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        placeholder="Write a comment or price verification..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#7256c3] focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={!commentInputs[post.id]?.trim()}
                        className="px-3 py-2 rounded-xl bg-[#7256c3] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                </article>
              );
            })
          )}
        </div>

      </div>

      {/* ── Right Column: Original PingX Hub (Account, Tools & Real Community) ── */}
      <aside className="w-full lg:w-80 shrink-0 space-y-6">
        
        {/* User Account Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={user?.avatar}
                name={user?.name || 'User'}
                size="md"
                className="border border-slate-200"
              />
              <div className="leading-tight">
                <p className="font-bold text-slate-900 text-sm font-heading">{user?.name || 'Explorer'}</p>
                <p className="text-slate-500 text-xs font-medium">
                  @{(user?.username || user?.email?.split('@')[0] || 'user').replace(/@.*$/, '')}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-violet-100 text-[#7256c3] text-[10px] font-bold">
                  {user?.role || 'PingX Member'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-bold text-[#7256c3] hover:text-[#5d42a6] cursor-pointer"
            >
              Profile
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 block">{feed.length}</span>
              <span className="text-[10px] text-slate-500">My Posts</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-[#7256c3] block">{watchlist.length}</span>
              <span className="text-[10px] text-slate-500">Tracked Deals</span>
            </div>
          </div>
        </div>

        {/* Quick Hub Actions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="p-3 rounded-2xl border border-slate-200 hover:border-[#7256c3] bg-slate-50/50 hover:bg-violet-50/40 text-left transition-all cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-[#7256c3] mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900">Post Deal</p>
              <p className="text-[10px] text-slate-500">Share photo / price</p>
            </button>

            <button
              onClick={() => setIsCreateStoryOpen(true)}
              className="p-3 rounded-2xl border border-slate-200 hover:border-[#7256c3] bg-slate-50/50 hover:bg-violet-50/40 text-left transition-all cursor-pointer group"
            >
              <Camera className="w-4 h-4 text-[#7256c3] mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900">Add Story</p>
              <p className="text-[10px] text-slate-500">Custom link heading</p>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-[#7256c3] bg-slate-50/50 hover:bg-violet-50/40 text-left transition-all cursor-pointer group"
            >
              <Bot className="w-4 h-4 text-[#7256c3] mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900">AI Assistant</p>
              <p className="text-[10px] text-slate-500">Recaps & search</p>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-[#7256c3] bg-slate-50/50 hover:bg-violet-50/40 text-left transition-all cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4 text-[#7256c3] mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900">Smart Shop</p>
              <p className="text-[10px] text-slate-500">Price comparison</p>
            </button>
          </div>
        </div>

        {/* Real Ecosystem Status Indicator */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            PingX Platform Status
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">Real-Time Messaging</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">Live</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7256c3]" />
                <span className="font-semibold text-slate-800">AI Assistant Engine</span>
              </div>
              <span className="text-[10px] font-bold text-[#7256c3] bg-violet-100 px-2 py-0.5 rounded-md">Active</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-slate-800">Smart Shop Sync</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">8 Stores</span>
            </div>
          </div>
        </div>

        {/* Genuine Community Section (Only shows real registered accounts, zero fake accounts) */}
        {genuineCommunityMembers.length > 0 ? (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Registered Members</span>
              <span className="text-[10px] font-bold text-slate-400">{genuineCommunityMembers.length} active</span>
            </div>
            <div className="space-y-3">
              {genuineCommunityMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-2 p-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <button
                    type="button"
                    onClick={() => openUserProfile(member)}
                    className="flex items-center gap-2.5 truncate text-left group cursor-pointer flex-1"
                    title="Click to view full profile"
                  >
                    <Avatar src={member.avatar} name={member.name} size="sm" className="border group-hover:border-[#7256c3] transition-colors" />
                    <div className="truncate leading-tight">
                      <p className="font-bold text-slate-900 text-xs truncate group-hover:text-[#7256c3] transition-colors">{member.name}</p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">@{member.username}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => openUserProfile(member)}
                    className="text-[11px] font-bold text-[#7256c3] hover:text-[#5d42a6] px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2 text-center text-xs">
            <Users className="w-6 h-6 text-[#7256c3] mx-auto opacity-70" />
            <p className="font-bold text-slate-900">Your Private Community</p>
            <p className="text-slate-500 text-[11px]">
              No other accounts have registered on this machine yet. When real users join, they will appear here.
            </p>
          </div>
        )}

        {/* Clean Footer Notice */}
        <div className="text-[11px] text-slate-400 text-center font-mono">
          PingX Core v1.0 • Social Commerce & AI
        </div>

      </aside>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Create Story Modal with Custom Link Heading */}
      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onStoryCreated={handleStoryCreated}
      />

      {/* Story Viewer Modal */}
      <StoryViewerModal
        isOpen={!!selectedStory}
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

    </div>
  );
}
