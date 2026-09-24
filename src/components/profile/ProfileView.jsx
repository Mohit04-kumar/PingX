import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useShop } from '../../context/ShopContext';
import { PRODUCT_DATABASE } from '../../services/productComparisonService';
import { Avatar } from '../common/Avatar';
import { CreateHighlightModal } from '../common/CreateHighlightModal';
import { CreatePostModal } from '../common/CreatePostModal';
import { 
  Grid, 
  Bookmark, 
  ShoppingBag, 
  Tag, 
  Settings, 
  Share2, 
  Check, 
  ExternalLink, 
  Heart, 
  MessageCircle, 
  Plus, 
  Camera, 
  Upload, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Globe, 
  Sparkles, 
  X, 
  CheckCheck,
  Flame,
  Award
} from 'lucide-react';

export function ProfileView() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const { chats } = useChat();
  const { watchlist = [], cart = [], removeFromWatchlist, clearWatchlist, addToCart } = useShop();

  // Resolve watchlist string IDs or objects to full products with fallback
  const resolvedWatchlist = (watchlist || [])
    .map((item) => {
      if (typeof item === 'object' && item !== null && (item.title || item.name)) {
        return item;
      }
      const id = typeof item === 'string' ? item : item?.id || item?.productId;
      const found = PRODUCT_DATABASE.find((p) => p.id === id);
      if (found) return found;
      if (typeof item === 'object' && item !== null && item.id) return item;
      return null;
    })
    .filter(Boolean);

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved' | 'cart' | 'tagged'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateHighlightOpen, setIsCreateHighlightOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [shareNotice, setShareNotice] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  // Dynamic user highlights
  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pingx_user_highlights') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // Dynamic user posts
  const [posts, setPosts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pingx_user_posts') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // Edit form state
  const [name, setName] = useState(user?.name || 'Explorer');
  const [username, setUsername] = useState(user?.username || 'user');
  const [email, setEmail] = useState(user?.email || 'user@pingx.app');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [linkHeading, setLinkHeading] = useState(user?.linkHeading || 'Official Link');
  const [bio, setBio] = useState(user?.bio || 'PingX Member • Exploring social commerce and AI');
  const [role, setRole] = useState(user?.role || 'PingX Member');
  const [location, setLocation] = useState(user?.location || 'India');
  const [gender, setGender] = useState(user?.gender || 'Prefer not to say');

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || 'Explorer');
      setUsername(user.username || 'user');
      setEmail(user.email || 'user@pingx.app');
      setPhone(user.phone || '');
      setDob(user.dob || '');
      setWebsite(user.website || '');
      setLinkHeading(user.linkHeading || 'Official Link');
      setBio(user.bio || 'PingX Member • Exploring social commerce and AI');
      setRole(user.role || 'PingX Member');
      setLocation(user.location || 'India');
      setGender(user.gender || 'Prefer not to say');
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleHighlightCreated = (newHl) => {
    const updated = [...highlights, newHl];
    setHighlights(updated);
  };

  const handlePostCreated = (newPost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    try {
      localStorage.setItem('pingx_user_posts', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    updateProfile({
      name,
      username,
      email,
      phone,
      dob,
      website,
      linkHeading,
      bio,
      role,
      location,
      gender
    });
    setIsEditModalOpen(false);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3500);
  };

  const handleShareProfile = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result;
          setAvatarPreview(dataUrl);
          updateAvatar(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* Hidden File Input for Avatar */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png,image/jpeg,image/webp,image/jpg" 
        className="hidden" 
      />

      {/* Notifications */}
      {saveNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Profile and custom links saved successfully!</span>
          </div>
          <button onClick={() => setSaveNotice(false)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {shareNotice && (
        <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200 text-[#7256c3] text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7256c3]" />
            <span>Profile URL copied to clipboard!</span>
          </div>
          <button onClick={() => setShareNotice(false)} className="text-violet-700 hover:text-violet-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          
          {/* Avatar Section */}
          <div className="relative group shrink-0">
            <div className="p-1 rounded-full bg-gradient-to-tr from-[#7256c3] via-indigo-500 to-pink-500">
              <Avatar
                src={avatarPreview || user?.avatar}
                name={name}
                size="xl"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 p-2 rounded-full bg-[#7256c3] text-white hover:bg-[#5f44b0] shadow-md transition-all cursor-pointer hover:scale-110"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Details & Action Buttons */}
          <div className="space-y-4 flex-1 text-center sm:text-left">
            
            {/* Row 1: Username & Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading flex items-center gap-1.5">
                @{username}
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7256c3] text-white text-[11px]" title="Verified PingX Member">
                  ✓
                </span>
              </h2>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Edit profile
              </button>

              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-[#7256c3] hover:bg-[#5f44b0] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> New Post
              </button>

              <button
                onClick={handleShareProfile}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Row 2: Stats Row */}
            <div className="flex items-center justify-center sm:justify-start gap-6 text-sm text-slate-800">
              <div>
                <span className="font-extrabold text-slate-900">{posts.length}</span>{' '}
                <span className="text-slate-500 text-xs sm:text-sm">posts</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900">{highlights.length}</span>{' '}
                <span className="text-slate-500 text-xs sm:text-sm">highlights</span>
              </div>
              <div>
                <span className="font-extrabold text-[#7256c3]">{resolvedWatchlist.length}</span>{' '}
                <span className="text-slate-500 text-xs sm:text-sm">tracked deals</span>
              </div>
            </div>

            {/* Row 3: Name, Role & Multiline Bio */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-bold text-sm text-slate-900">{name}</span>
                <span className="px-2 py-0.5 rounded-md bg-violet-100 text-[#7256c3] text-[10px] font-bold">
                  {role}
                </span>
              </div>

              <p className="leading-relaxed max-w-lg whitespace-pre-line text-slate-600">
                {bio}
              </p>

              {/* Custom Link Heading & Website URL */}
              {website && (
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-1.5 font-bold text-xs text-[#7256c3]">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-slate-800 font-semibold">{linkHeading || 'Official Link'}:</span>
                  <a 
                    href={website.startsWith('http') ? website : `https://${website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline flex items-center gap-1 truncate"
                  >
                    <span>{website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {/* Row 4: Contact & Identity Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px]">
              {phone && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" /> {phone}
                </span>
              )}
              {email && (
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" /> {email}
                </span>
              )}
              {dob && (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-600" /> Born {dob}
                </span>
              )}
              {location && (
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> {location}
                </span>
              )}
            </div>

          </div>

        </div>

        {/* Dynamic Highlights Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-5 overflow-x-auto pb-2 scrollbar-none">
          {/* Add New Highlight Button */}
          <button
            type="button"
            onClick={() => setIsCreateHighlightOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#7256c3]/60 group-hover:border-[#7256c3] flex items-center justify-center bg-violet-50/50 group-hover:bg-violet-100/70 transition-all text-[#7256c3]">
              <Plus className="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-[#7256c3] transition-colors">
              + New
            </span>
          </button>

          {/* Dynamic User Highlights */}
          {highlights.map((hl) => (
            <div key={hl.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 group-hover:from-[#7256c3] group-hover:to-pink-500 transition-all">
                <div className="w-15 h-15 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                  {hl.isImageCover ? (
                    <img src={hl.icon} alt={hl.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>{hl.icon}</span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-[#7256c3] transition-colors truncate max-w-[4.5rem]">
                {hl.title}
              </span>
            </div>
          ))}

          {highlights.length === 0 && (
            <span className="text-xs text-slate-400 pl-2">
              ← Feature favorite deals or stories in your highlights
            </span>
          )}
        </div>

      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-t border-slate-200 flex items-center justify-center gap-8 text-xs font-bold tracking-wider">
        <button
          onClick={() => setActiveTab('posts')}
          className={`py-3 flex items-center gap-2 border-t-2 transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Grid className="w-3.5 h-3.5" /> POSTS ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`py-3 flex items-center gap-2 border-t-2 transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" /> SAVED DEALS ({resolvedWatchlist.length})
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          className={`py-3 flex items-center gap-2 border-t-2 transition-all cursor-pointer ${
            activeTab === 'cart'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> SMART CART ({cart.reduce((a, b) => a + b.quantity, 0)})
        </button>
      </div>

      {/* Tab Content 1: Dynamic Posts Grid */}
      {activeTab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-[#7256c3] flex items-center justify-center mx-auto">
                <Camera className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="font-bold text-slate-900 text-base">No posts published yet</h4>
                <p className="text-xs text-slate-500">
                  Share product photos, verified price drops, or reviews to build your PingX portfolio.
                </p>
              </div>
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#5f44b0] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                + Create First Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 animate-fadeIn">
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 shadow-2xs border border-slate-200"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Price Tag Pill if tagged */}
                  {post.currentPrice && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-[#7256c3] border border-white/60 shadow-xs flex items-center gap-1 font-mono">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> ₹{post.currentPrice.toLocaleString('en-IN')}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{post.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{post.commentsCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: SAVED DEALS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {resolvedWatchlist.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">No saved deals yet</h4>
              <p className="text-xs text-slate-500">Save products and posts to monitor verified price changes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={clearWatchlist}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resolvedWatchlist.map((item) => {
                  const itemId = item.id || item.productId;
                  return (
                    <div key={itemId} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs hover:border-violet-200 transition-all">
                      <div className="flex items-center gap-3 truncate">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'} 
                          alt={item.title || 'Product'} 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0" 
                        />
                        <div className="truncate">
                          <h5 className="font-bold text-xs text-slate-900 truncate">{item.title || 'Saved Product'}</h5>
                          <span className="text-xs font-black text-[#7256c3] block mt-0.5">₹{(item.price || item.bestPrice || 0).toLocaleString('en-IN')}</span>
                          {item.merchant && (
                            <span className="text-[10px] text-slate-400 block">{item.merchant}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(itemId || item)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Remove from saved deals"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: SMART CART */}
      {activeTab === 'cart' && (
        <div>
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">Your Smart Cart is empty</h4>
              <p className="text-xs text-slate-500">Add verified products from the Smart Shop to compare prices.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h5>
                      <span className="text-xs text-slate-500">Qty: {item.quantity} • ₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Modal Inspection */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col sm:flex-row border border-slate-200 shadow-2xl animate-scaleUp relative"
          >
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 cursor-pointer shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="sm:w-1/2 bg-slate-100 relative min-h-[280px]">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <Avatar src={avatarPreview || user?.avatar} name={name} size="sm" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">@{username}</h5>
                    <span className="text-[10px] text-slate-400">{selectedPost.timeAgo || 'Recent'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">{selectedPost.title}</h4>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{selectedPost.caption}</p>
                </div>

                {selectedPost.currentPrice && (
                  <div className="p-3 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500">Verified Price</span>
                      <p className="text-lg font-black text-[#7256c3]">₹{selectedPost.currentPrice.toLocaleString('en-IN')}</p>
                    </div>
                    {selectedPost.lowestMerchant && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {selectedPost.lowestMerchant}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {selectedPost.lowestUrl && (
                <a
                  href={selectedPost.lowestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#5f44b0] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Visit Store <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal Dialog with Custom Link Heading */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-xl w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl animate-scaleUp text-slate-900"
          >
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Edit Profile & Links
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Photo Change Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={avatarPreview || user?.avatar} name={name} size="md" />
                  <div>
                    <h5 className="font-bold text-slate-900">@{username}</h5>
                    <p className="text-[11px] text-slate-500">{name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#7256c3] hover:bg-[#5f44b0] text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Change Photo
                </button>
              </div>

              {/* Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username (@handle)</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                  />
                </div>
              </div>

              {/* Custom Link Heading & Website Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Custom Link Heading
                  </label>
                  <input
                    type="text"
                    value={linkHeading}
                    onChange={(e) => setLinkHeading(e.target.value)}
                    placeholder="e.g. My Portfolio, Store, YouTube"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Bio</label>
                  <span className="text-[10px] text-slate-400">{bio.length} / 180</span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 180))}
                  rows={3}
                  placeholder="Share a short bio..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white leading-relaxed"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                  />
                </div>
              </div>

              {/* DOB, Gender & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Badge</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#5f44b0] text-white font-bold shadow-md cursor-pointer transition-colors"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Create Highlight Modal */}
      <CreateHighlightModal
        isOpen={isCreateHighlightOpen}
        onClose={() => setIsCreateHighlightOpen(false)}
        onHighlightCreated={handleHighlightCreated}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
      />

    </div>
  );
}
