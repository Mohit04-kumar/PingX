import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useShop } from '../../context/ShopContext';
import { Avatar } from '../common/Avatar';
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

const INSTAGRAM_POSTS = [
  {
    id: 'post_1',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    caption: 'Pure lossless audio clarity with industry-leading active noise cancellation. Verified lowest price across Amazon.in and Croma today! 🎧⚡ #SonyWH1000XM5 #LosslessAudio #PingXDeals',
    price: 24990,
    originalPrice: 34990,
    merchant: 'Amazon.in',
    directUrl: 'https://www.amazon.in/s?k=Sony+WH-1000XM5',
    likes: 1420,
    comments: 84,
    date: '2 hours ago'
  },
  {
    id: 'post_2',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    title: 'Apple MacBook Air 15-inch M3 Chip (Midnight)',
    caption: '18 hours battery life, 500 nits Liquid Retina display, and silent fanless aluminum chassis. Best deal spotted on Croma with instant HDFC bank discount! 💻✨ #MacBookAirM3 #AppleIndia #DeskSetup',
    price: 124900,
    originalPrice: 134900,
    merchant: 'Croma',
    directUrl: 'https://www.croma.com/search/?text=MacBook+Air+M3',
    likes: 2410,
    comments: 156,
    date: '1 day ago'
  },
  {
    id: 'post_3',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    title: 'Nike Air Max Impact 4 Basketball & Lifestyle Sneakers',
    caption: 'Max Air cushioning in the heel with aggressive herringbone traction. Direct from official Myntra retailer with free 30-day exchange! 👟🔥 #NikeAirMax #SneakerHead #PingXStyle',
    price: 6495,
    originalPrice: 8995,
    merchant: 'Myntra',
    directUrl: 'https://www.myntra.com/nike-air-max',
    likes: 890,
    comments: 42,
    date: '2 days ago'
  },
  {
    id: 'post_4',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    title: 'Samsung Galaxy Watch6 LTE (44mm Sapphire Crystal)',
    caption: 'Advanced sleep coaching, continuous ECG, and stand-alone LTE connectivity on your wrist. Big price cut on Flipkart this week! ⌚⚡ #GalaxyWatch6 #Smartwatch #TechDeals',
    price: 28999,
    originalPrice: 36999,
    merchant: 'Flipkart',
    directUrl: 'https://www.flipkart.com/search?q=Galaxy+Watch+6',
    likes: 1140,
    comments: 67,
    date: '3 days ago'
  },
  {
    id: 'post_5',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    title: 'Minimalist Engineering Desk Setup',
    caption: 'Dual 4K displays, Keychron mechanical switches, and cable management perfected. What should I add next to the audio rig? 🖥️⌨️ #DeskSetup #MinimalSetup #Workstation',
    price: 18500,
    originalPrice: 22000,
    merchant: 'Amazon.in',
    directUrl: 'https://www.amazon.in/s?k=Desk+Setup+Accessories',
    likes: 3290,
    comments: 218,
    date: '5 days ago'
  },
  {
    id: 'post_6',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    title: 'Hi-Fi Audio Rig & Lossless DAC Listening Station',
    caption: 'Testing 48kHz lossless voice notes and high-resolution master audio files on PingX. Sounds unbelievable! 🎧🎵 #Audiophile #DAC #LosslessAudio',
    price: 14999,
    originalPrice: 19999,
    merchant: 'HeadphoneZone',
    directUrl: 'https://www.headphonezone.in',
    likes: 1680,
    comments: 94,
    date: '1 week ago'
  }
];

const HIGHLIGHTS = [
  { id: 'h1', title: 'Deals 🔥', icon: '🔥', count: 18 },
  { id: 'h2', title: 'Audio 🎧', icon: '🎧', count: 12 },
  { id: 'h3', title: 'MacBook 💻', icon: '💻', count: 8 },
  { id: 'h4', title: 'Kicks 👟', icon: '👟', count: 14 },
  { id: 'h5', title: 'PingX ⚡', icon: '⚡', count: 22 }
];

export function ProfileView() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const { chats } = useChat();
  const { watchlist, cart, removeFromWatchlist, addToCart } = useShop();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved' | 'cart' | 'tagged'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [shareNotice, setShareNotice] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  // Edit form state
  const [name, setName] = useState(user?.name || 'Raman Raj');
  const [username, setUsername] = useState(user?.username || 'ramanraj');
  const [email, setEmail] = useState(user?.email || 'raman@pingx.app');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [dob, setDob] = useState(user?.dob || '1998-08-15');
  const [website, setWebsite] = useState(user?.website || 'https://pingx.app/raman');
  const [bio, setBio] = useState(user?.bio || 'Exploring smart commerce & lossless audio 🎧 | Tech reviewer | Finding lowest verified prices on Amazon, Croma & Flipkart ⚡');
  const [role, setRole] = useState(user?.role || 'Lead Tech Reviewer');
  const [location, setLocation] = useState(user?.location || 'Bangalore, India');
  const [gender, setGender] = useState(user?.gender || 'Male');

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name || 'Raman Raj');
      setUsername(user.username || 'ramanraj');
      setEmail(user.email || 'raman@pingx.app');
      setPhone(user.phone || '+91 98765 43210');
      setDob(user.dob || '1998-08-15');
      setWebsite(user.website || 'https://pingx.app/raman');
      setBio(user.bio || 'Exploring smart commerce & lossless audio 🎧 | Tech reviewer | Finding lowest verified prices on Amazon, Croma & Flipkart ⚡');
      setRole(user.role || 'Lead Tech Reviewer');
      setLocation(user.location || 'Bangalore, India');
      setGender(user.gender || 'Male');
      setAvatarPreview(user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    updateProfile({
      name,
      username,
      email,
      phone,
      dob,
      website,
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
            <span>Profile and account information saved successfully!</span>
          </div>
          <button onClick={() => setSaveNotice(false)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {shareNotice && (
        <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200 text-[#7256c3] text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#7256c3]" />
            <span>Profile link copied to clipboard!</span>
          </div>
          <button onClick={() => setShareNotice(false)} className="text-[#7256c3] hover:text-[#5d43a6] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Instagram Header Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6e2f8] shadow-xs space-y-8">
        
        {/* Top Profile Header: Avatar + Meta */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          {/* Avatar with Instagram Gradient Ring */}
          <div className="relative group shrink-0">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-1 rounded-full bg-gradient-to-tr from-[#7256c3] via-pink-500 to-amber-400 cursor-pointer shadow-md group-hover:scale-105 transition-transform"
              title="Click to change profile picture"
            >
              <div className="bg-white p-1 rounded-full">
                <Avatar
                  src={avatarPreview}
                  name={name}
                  size="2xl"
                  className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-full"
                />
              </div>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 p-2 rounded-full bg-[#7256c3] text-white shadow-md hover:bg-[#6044b3] transition-colors cursor-pointer border-2 border-white"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Details & Action Buttons */}
          <div className="space-y-4 flex-1 text-center sm:text-left">
            
            {/* Row 1: Username & Instagram Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading flex items-center gap-1.5">
                {username ? `@${username}` : '@ramanraj'}
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7256c3] text-white text-[11px]" title="Verified PingX Member">
                  ✓
                </span>
              </h2>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                Edit profile
              </button>

              <button
                onClick={handleShareProfile}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5" /> Share profile
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Account Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Row 2: Stats Row */}
            <div className="flex items-center justify-center sm:justify-start gap-6 text-sm text-slate-800">
              <div>
                <span className="font-extrabold text-slate-900">24</span>{' '}
                <span className="text-slate-500 text-xs sm:text-sm">posts</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900">1,420</span>{' '}
                <span className="text-slate-500 text-xs sm:text-sm">followers</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900">380</span>{' '}
                <span className="text-slate-500 text-xs sm:text-sm">following</span>
              </div>
              <div>
                <span className="font-extrabold text-[#7256c3]">{watchlist.length}</span>{' '}
                <span className="text-slate-500 text-xs sm:text-sm">deals tracked</span>
              </div>
            </div>

            {/* Row 3: Name, Role & Multiline Bio */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-bold text-sm text-slate-900">{name || 'Raman Raj'}</span>
                <span className="px-2 py-0.5 rounded-md bg-violet-100 text-[#7256c3] text-[10px] font-bold">
                  {role || 'Lead Tech Reviewer'}
                </span>
              </div>

              <p className="leading-relaxed max-w-lg whitespace-pre-line text-slate-600">
                {bio || 'Exploring smart commerce & lossless audio 🎧 | Tech reviewer | Finding lowest verified prices on Amazon, Croma & Flipkart ⚡'}
              </p>

              {/* Website Link */}
              {website && (
                <div className="pt-0.5 flex items-center justify-center sm:justify-start gap-1 font-semibold text-[#7256c3] hover:underline">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <a href={website} target="_blank" rel="noopener noreferrer" className="truncate">
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                  <ExternalLink className="w-3 h-3 shrink-0" />
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

        {/* Stories Highlights Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-5 overflow-x-auto pb-2">
          {HIGHLIGHTS.map((hl) => (
            <div key={hl.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="p-1 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 group-hover:from-[#7256c3] group-hover:to-pink-500 transition-all">
                <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                  {hl.icon}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-[#7256c3] transition-colors truncate max-w-[4.5rem]">
                {hl.title}
              </span>
            </div>
          ))}

          {/* Add New Highlight */}
          <div 
            onClick={() => setIsEditModalOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 hover:border-[#7256c3] flex items-center justify-center text-slate-400 hover:text-[#7256c3] transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-slate-500">New</span>
          </div>
        </div>

      </div>

      {/* Instagram Navigation Tabs Bar */}
      <div className="border-t border-slate-200 flex items-center justify-center gap-8 text-xs font-bold tracking-wider">
        <button
          onClick={() => setActiveTab('posts')}
          className={`py-3 flex items-center gap-2 border-t-2 transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Grid className="w-3.5 h-3.5" /> POSTS ({INSTAGRAM_POSTS.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`py-3 flex items-center gap-2 border-t-2 transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" /> SAVED DEALS ({watchlist.length})
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

        <button
          onClick={() => setActiveTab('tagged')}
          className={`py-3 flex items-center gap-2 border-t-2 transition-all cursor-pointer ${
            activeTab === 'tagged'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Tag className="w-3.5 h-3.5" /> TAGGED
        </button>
      </div>

      {/* Tab Content 1: POSTS GRID (Authentic 3-Column Instagram Grid) */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 animate-fadeIn">
          {INSTAGRAM_POSTS.map((post) => (
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

              {/* Price Tag Pill */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-[#7256c3] border border-white/60 shadow-xs flex items-center gap-1 font-mono">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> ₹{post.price.toLocaleString()}
              </div>

              {/* Instagram Hover Overlay with Likes & Comments */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: SAVED DEALS */}
      {activeTab === 'saved' && (
        <div className="space-y-4 animate-fadeIn">
          {watchlist.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#e6e2f8] p-8 space-y-3">
              <Bookmark className="w-12 h-12 mx-auto text-slate-300" />
              <h4 className="text-base font-bold text-slate-800">No Saved Deals Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the PingX Store and click "Watch Price" on any tech deal to track price drops here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INSTAGRAM_POSTS.slice(0, 4).map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl p-4 border border-[#e6e2f8] flex items-center gap-4 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <img src={deal.image} alt={deal.title} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{deal.title}</h5>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-[#7256c3] font-mono">₹{deal.price.toLocaleString()}</span>
                      <span className="text-[10px] line-through text-slate-400 font-mono">₹{deal.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={deal.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-[#7256c3] hover:bg-[#6044b3] text-white text-[10px] font-bold transition-colors flex items-center gap-1"
                      >
                        Buy on {deal.merchant} <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => addToCart({ id: deal.id, title: deal.title, price: deal.price, image: deal.image }, { marketplace: deal.merchant, price: deal.price, url: deal.directUrl })}
                        className="px-3 py-1 rounded-lg bg-violet-100 hover:bg-violet-200 text-[#7256c3] text-[10px] font-bold transition-colors"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: SMART CART */}
      {activeTab === 'cart' && (
        <div className="space-y-4 animate-fadeIn">
          {cart.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#e6e2f8] p-8 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <h4 className="text-base font-bold text-slate-800">Your Smart Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add deals from your feed or store to compare prices and check out directly on official merchant websites.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white rounded-2xl p-4 border border-[#e6e2f8] flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 max-w-md">{item.title}</h5>
                      <span className="text-xs font-mono font-extrabold text-[#7256c3]">₹{item.price.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block">via {item.marketplace}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 font-mono">Qty: {item.quantity}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      Buy on {item.marketplace} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: TAGGED */}
      {activeTab === 'tagged' && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#e6e2f8] p-8 space-y-3 animate-fadeIn">
          <Tag className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="text-base font-bold text-slate-800">Photos of You</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When tech scouts and community members tag you in verified product drops, they will appear right here.
          </p>
        </div>
      )}

      {/* Expanded Post Inspection Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col sm:flex-row border border-slate-200 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Post Photo */}
            <div className="sm:w-1/2 bg-slate-100 relative min-h-[300px]">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            {/* Post Details & Direct Purchase */}
            <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
              <div className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <Avatar src={avatarPreview} name={name} size="md" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      @{username} <Check className="w-3 h-3 text-[#7256c3]" />
                    </h5>
                    <span className="text-[10px] text-slate-400">{selectedPost.date}</span>
                  </div>
                </div>

                {/* Title & Caption */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">{selectedPost.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedPost.caption}</p>
                </div>

                {/* Price Comparison Card */}
                <div className="p-3.5 rounded-2xl bg-violet-50/70 border border-violet-100 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">Lowest Verified Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-[#7256c3] font-mono">₹{selectedPost.price.toLocaleString()}</span>
                        <span className="text-xs line-through text-slate-400 font-mono">₹{selectedPost.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                      Lowest on {selectedPost.merchant}
                    </span>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> {selectedPost.likes} likes</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 text-slate-400" /> {selectedPost.comments} comments</span>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Direct */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    addToCart(
                      { id: selectedPost.id, title: selectedPost.title, price: selectedPost.price, image: selectedPost.image },
                      { marketplace: selectedPost.merchant, price: selectedPost.price, url: selectedPost.directUrl }
                    );
                    setSelectedPost(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-[#7256c3] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </button>

                <a
                  href={selectedPost.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center"
                >
                  Buy on {selectedPost.merchant} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instagram-Style "Edit Profile" Modal Dialog */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-xl w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl animate-scaleUp"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Edit Profile
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Photo Change Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={avatarPreview} name={name} size="md" />
                  <div>
                    <h5 className="font-bold text-slate-900">{username ? `@${username}` : 'user'}</h5>
                    <p className="text-[11px] text-slate-500">{name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white font-bold text-xs cursor-pointer transition-colors"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username (@handle)</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Website Link */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website / Portfolio Link</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                  />
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
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors leading-relaxed"
                />
              </div>

              {/* Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number (WhatsApp)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Date of Birth, Gender & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bangalore, India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Role / Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Profession / Role Tag</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Tech Reviewer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
                />
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
                  className="px-6 py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white font-bold shadow-md cursor-pointer transition-colors"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
