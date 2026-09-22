import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { usePings } from '../../context/PingsContext';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { 
  ShoppingBag, 
  TrendingDown, 
  MessageSquare, 
  Bookmark, 
  Heart, 
  Share2, 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  Volume2, 
  Play, 
  Pause, 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Sparkles, 
  Star, 
  Plus, 
  Bot,
  Filter,
  CheckCircle2,
  Tag,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

// Authentic Social & Smart Commerce Feed matching Landing Page Promises (NO FOOD ITEMS)
const COMMERCE_FEED = [
  {
    id: 'post-sony-xm5',
    author: {
      name: 'Raman Raj',
      username: 'ramanraj',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      badge: 'Deal Hunter & Reviewer',
      isVerified: true
    },
    timeAgo: '12m ago',
    title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
    currentPrice: 26990,
    originalPrice: 28990,
    discount: 'Save ₹2,000',
    lowestMerchant: 'Amazon.in',
    lowestUrl: 'https://www.amazon.in',
    merchants: [
      { name: 'Amazon.in', price: 26990, isLowest: true, url: 'https://www.amazon.in' },
      { name: 'Flipkart', price: 27490, isLowest: false, url: 'https://www.flipkart.com' },
      { name: 'Croma', price: 28990, isLowest: false, url: 'https://www.croma.com' },
      { name: 'Reliance Digital', price: 28990, isLowest: false, url: 'https://www.reliancedigital.in' }
    ],
    isAudioNote: true,
    audioDuration: '0:34',
    audioTitle: 'Lossless Voice Note: Price alert strategy',
    audioMessage: 'Hey! Amazon just dropped Sony XM5 by ₹2,000 below Croma retail. Take a listen to my 30-second breakdown before buying!',
    specs: {
      'Noise Cancellation': 'Industry-leading Dual QN1 ANC',
      'Battery Life': '30 Hours with Fast Charge',
      'Weight': '250g Ultralight Comfort'
    },
    likesCount: 142,
    commentsCount: 28
  },
  {
    id: 'post-macbook-m3',
    author: {
      name: 'Sneha Kapoor',
      username: 'snehak',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      badge: 'Bangalore Tech Club',
      isVerified: true
    },
    timeAgo: '35m ago',
    title: 'Apple MacBook Air M3 (13.6-inch, 16GB Unified Memory, 512GB SSD)',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80',
    currentPrice: 114900,
    originalPrice: 134900,
    discount: 'Save ₹20,000',
    lowestMerchant: 'Croma',
    lowestUrl: 'https://www.croma.com',
    merchants: [
      { name: 'Croma', price: 114900, isLowest: true, url: 'https://www.croma.com' },
      { name: 'Amazon.in', price: 119900, isLowest: false, url: 'https://www.amazon.in' },
      { name: 'Reliance Digital', price: 122900, isLowest: false, url: 'https://www.reliancedigital.in' },
      { name: 'Apple Store', price: 134900, isLowest: false, url: 'https://www.apple.com/in' }
    ],
    aiSummary: [
      'Croma offers lowest verified deal at ₹1,14,900 with ₹5,000 instant HDFC card cashback.',
      'M3 chip delivers 18-hour battery life with silent fanless operation and dual external display support.'
    ],
    specs: {
      'Processor': 'Apple M3 8-core CPU / 10-core GPU',
      'Memory': '16GB Unified RAM',
      'Display': '13.6" Liquid Retina 500 nits'
    },
    likesCount: 318,
    commentsCount: 45
  },
  {
    id: 'post-nike-airmax',
    author: {
      name: 'Alex Chen',
      username: 'alexchen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      badge: 'Sneaker Scout',
      isVerified: false
    },
    timeAgo: '48m ago',
    title: 'Nike Air Max Impact 4 Basketball Shoes (Wolf Grey / Royal)',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80',
    currentPrice: 4299,
    originalPrice: 6995,
    discount: '38% OFF',
    lowestMerchant: 'Myntra',
    lowestUrl: 'https://www.myntra.com',
    merchants: [
      { name: 'Myntra', price: 4299, isLowest: true, url: 'https://www.myntra.com' },
      { name: 'Flipkart', price: 5499, isLowest: false, url: 'https://www.flipkart.com' },
      { name: 'Amazon.in', price: 5890, isLowest: false, url: 'https://www.amazon.in' },
      { name: 'Tata CLiQ', price: 6290, isLowest: false, url: 'https://www.tatacliq.com' }
    ],
    specs: {
      'Cushioning': 'Max Air heel air-pocket',
      'Traction': 'Herringbone outdoor rubber',
      'Weight': '340g Responsive Grip'
    },
    likesCount: 204,
    commentsCount: 19
  },
  {
    id: 'post-galaxy-watch6',
    author: {
      name: 'Marcus Vance',
      username: 'marcusv',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      badge: 'Wearables & Health Tech',
      isVerified: true
    },
    timeAgo: '1h 15m ago',
    title: 'Samsung Galaxy Watch6 LTE (44mm, Sapphire Crystal Glass)',
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
    currentPrice: 24999,
    originalPrice: 36999,
    discount: '32% OFF',
    lowestMerchant: 'Amazon.in',
    lowestUrl: 'https://www.amazon.in',
    merchants: [
      { name: 'Amazon.in', price: 24999, isLowest: true, url: 'https://www.amazon.in' },
      { name: 'Flipkart', price: 25499, isLowest: false, url: 'https://www.flipkart.com' },
      { name: 'Samsung Store', price: 29999, isLowest: false, url: 'https://www.samsung.com/in' },
      { name: 'Reliance Digital', price: 26999, isLowest: false, url: 'https://www.reliancedigital.in' }
    ],
    specs: {
      'Connectivity': 'Standalone 4G LTE + Bluetooth 5.3',
      'Health Sensors': 'BioActive Sensor (ECG + Body Comp)',
      'Water Resistance': '5ATM + IP68 Rating'
    },
    likesCount: 187,
    commentsCount: 22
  }
];

const INSTAGRAM_STORIES = [
  { name: 'Your Story', username: 'ramanraj', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', isSelf: true },
  { name: 'Sneha K.', username: 'snehak', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', hasUnseen: true },
  { name: 'Alex Chen', username: 'alexchen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', hasUnseen: true },
  { name: 'Priya S.', username: 'priya_tech', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', hasUnseen: true },
  { name: 'Marcus V.', username: 'marcusv', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', hasUnseen: false },
  { name: 'Elena R.', username: 'elena', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', hasUnseen: false }
];

export function DashboardView({ setActiveTab }) {
  const { user } = useAuth();
  const { addToCart, watchlist = [], toggleWatchlist, setIsCartOpen, cart = [] } = useShop();
  const { addToast } = useToast();

  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStore, setSelectedStore] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState({});

  // Audio Playback Simulation for Raman Raj's Lossless Voice Note
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Popping Inspection Detail Modal State
  const [inspectedPost, setInspectedPost] = useState(null);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const togglePlayAudio = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      addToast('Playing Lossless Voice Note', '48kHz AAC Lossless stream active from Raman Raj', 'info', 2500);
    }
  };

  // Filtered Feed
  const filteredFeed = useMemo(() => {
    return COMMERCE_FEED.filter((post) => {
      if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
      if (selectedStore !== 'All' && post.lowestMerchant !== selectedStore) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesAuthor = post.author.name.toLowerCase().includes(q);
        const matchesCategory = post.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesCategory) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedStore, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 animate-fadeIn text-slate-900">
      
      {/* ── Instagram-Style Story Circles (Active Contacts & Creators) ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6e2f8] shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-4 sm:gap-6 min-w-max">
          {INSTAGRAM_STORIES.map((story, sIdx) => (
            <button
              key={sIdx}
              type="button"
              onClick={() => {
                if (story.isSelf) setActiveTab?.('profile');
                else {
                  addToast(`Opening ${story.name}'s Profile`, `Viewing verified deal scout portfolio`, 'info', 2000);
                }
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="relative">
                <div className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${
                  story.isSelf 
                    ? 'bg-slate-200' 
                    : story.hasUnseen 
                      ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-[#7256c3]' 
                      : 'bg-slate-300'
                }`}>
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white bg-slate-50"
                  />
                </div>
                {story.isSelf && (
                  <div className="w-4 h-4 rounded-full bg-[#7256c3] text-white flex items-center justify-center absolute bottom-0 right-0 border-2 border-white font-bold text-[10px]">
                    +
                  </div>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-700 max-w-[68px] truncate">
                {story.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4 Top KPI Metric Cards (Matching Landing Page Promises) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Deals */}
        <div 
          onClick={() => setActiveTab?.('shop')}
          className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Verified Deals</span>
            <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">18</span>
            <span className="text-[10px] font-bold text-emerald-600 block">8 Stores Synced</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-violet-100 text-[#7256c3] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Price Drops */}
        <div 
          onClick={() => setSelectedCategory('All')}
          className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Live Price Drops</span>
            <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">7</span>
            <span className="text-[10px] font-bold text-emerald-600 block">Up to 47% OFF</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Direct Messages */}
        <div 
          onClick={() => setActiveTab?.('chats')}
          className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Direct Chats</span>
            <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">14</span>
            <span className="text-[10px] font-bold text-violet-600 block">Lossless Audio Online</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Smart Cart & Saved */}
        <div 
          onClick={() => setIsCartOpen(true)}
          className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Smart Cart Items</span>
            <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
              {cart.length > 0 ? cart.length : 4}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block">View Cart Drawer ↗</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ── Main Layout: Left Filters + Instagram/PingX Commerce Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Filter & Search Column */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-[#e6e2f8] shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold font-heading text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#7256c3]" /> Deal Scanner
              </h3>
              {(searchQuery || selectedCategory !== 'All' || selectedStore !== 'All') && (
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('All'); setSelectedStore('All'); setSearchQuery(''); }}
                  className="text-xs font-bold text-[#7256c3] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals, products, tech..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#f8f7ff] border border-[#e6e2f8] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#7256c3]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Selectors */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono block">Categories</span>
              <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                {['All', 'Audio', 'Laptops', 'Footwear', 'Wearables'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#7256c3] text-white shadow-xs'
                        : 'bg-[#f8f7ff] text-slate-600 hover:bg-slate-100 border border-[#e6e2f8]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Merchant Stores */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono block">Stores</span>
              <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                {['All', 'Amazon.in', 'Croma', 'Myntra'].map((store) => (
                  <button
                    key={store}
                    type="button"
                    onClick={() => setSelectedStore(store)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      selectedStore === store
                        ? 'bg-[#1e1b4b] text-white shadow-xs'
                        : 'bg-[#f8f7ff] text-slate-600 hover:bg-slate-100 border border-[#e6e2f8]'
                    }`}
                  >
                    {store}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Landing Page Guarantees Banner */}
          <div className="bg-[#f8f7ff] rounded-3xl p-5 border border-[#e6e2f8] space-y-3">
            <span className="text-[11px] font-extrabold font-mono text-[#7256c3] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7256c3]" />
              PingX Platform Promises
            </span>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Multi-Merchant Live Scanner (Amazon, Flipkart, Croma, Myntra)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Lossless 48kHz AAC Encrypted Voice Notes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Zero Ads, Zero Markups, Direct Retailer Links</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Central Instagram-Style Commerce & Social Feed */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
          
          {filteredFeed.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e6e2f8] space-y-3">
              <p className="text-slate-500 text-sm">No deals found matching your selected filters.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('All'); setSelectedStore('All'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl bg-[#7256c3] text-white text-xs font-bold cursor-pointer hover:bg-[#6245b5]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredFeed.map((post) => {
              const isLiked = !!likedPosts[post.id];
              const isPlaying = playingAudioId === post.id;

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-[#e6e2f8] shadow-xs overflow-hidden space-y-4 transition-all hover:shadow-md"
                >
                  
                  {/* Post Header: Creator Avatar + Name + Timestamp + Options */}
                  <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#e6e2f8] bg-slate-50"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {post.author.name}
                          </h4>
                          {post.author.isVerified && (
                            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">• {post.timeAgo}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">{post.author.badge}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-[#7256c3] border border-violet-200">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Photo (High-Resolution Original Tech Asset) */}
                  <div 
                    onClick={() => setInspectedPost(post)}
                    className="relative aspect-16/10 cursor-pointer overflow-hidden bg-slate-50 group"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Price Discount Pill Badge */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-extrabold text-slate-900">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Lowest on {post.lowestMerchant}: ₹{post.currentPrice.toLocaleString()}
                    </div>

                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#7256c3] text-white text-[11px] font-black font-mono shadow-md">
                      {post.discount}
                    </div>
                  </div>

                  {/* Post Actions Row (Instagram-Style Like, Comment, Share, Add to Cart) */}
                  <div className="px-5 pt-1 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className="flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500'}`} />
                        <span className={isLiked ? 'text-rose-600' : 'text-slate-600'}>
                          {post.likesCount + (isLiked ? 1 : 0)}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectedPost(post)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>{post.commentsCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: post.title, url: window.location.href });
                          } else {
                            addToast('Link Copied', 'Deal link copied to clipboard', 'success', 2000);
                          }
                        }}
                        className="text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Dual Action: Add to Cart & Buy Direct */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart({
                            id: post.id,
                            title: post.title,
                            price: post.currentPrice,
                            originalPrice: post.originalPrice,
                            image: post.image,
                            merchant: post.lowestMerchant,
                            url: post.lowestUrl
                          });
                          addToast('Added to Smart Cart', `${post.title} added at ₹${post.currentPrice.toLocaleString()}`, 'success', 2500);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-violet-100 text-[#7256c3] hover:bg-violet-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>

                      <a
                        href={post.lowestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-[#7256c3] hover:bg-[#6245b5] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        Buy on {post.lowestMerchant} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Post Content & Title */}
                  <div className="px-5 space-y-3 pb-5">
                    <div>
                      <h3 
                        onClick={() => setInspectedPost(post)}
                        className="text-sm sm:text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-[#7256c3] transition-colors"
                      >
                        {post.title}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-black font-mono text-[#7256c3]">
                          ₹{post.currentPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ₹{post.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {post.discount}
                        </span>
                      </div>
                    </div>

                    {/* Lossless Voice Note Waveform Player (Raman Raj promise) */}
                    {post.isAudioNote && (
                      <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#7256c3] flex items-center gap-1.5">
                            <Volume2 className="w-4 h-4" />
                            48kHz AAC Lossless Voice Note
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">
                            {isPlaying ? '0:14 / 0:34' : post.audioDuration}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => togglePlayAudio(post.id)}
                            className="w-9 h-9 rounded-full bg-[#7256c3] text-white flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 transition-transform shrink-0"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>

                          <div className="flex-1 flex items-center gap-1 h-8 px-2 bg-white rounded-xl border border-violet-200">
                            {[40, 75, 35, 95, 60, 85, 45, 100, 65, 30, 80, 50, 95, 40, 70, 55, 90, 35].map((h, bIdx) => (
                              <div
                                key={bIdx}
                                className={`w-1 rounded-full transition-all duration-200 ${
                                  isPlaying ? 'bg-[#7256c3] animate-pulse' : 'bg-slate-300'
                                }`}
                                style={{
                                  height: isPlaying ? `${Math.max(25, (h * Math.random()).toFixed(0))}%` : `${h}%`,
                                  transitionDelay: `${bIdx * 15}ms`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{post.audioMessage}</p>
                      </div>
                    )}

                    {/* AI 2-Bullet Summary if present */}
                    {post.aiSummary && (
                      <div className="p-3.5 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] space-y-1.5 text-xs">
                        <span className="text-[10px] font-extrabold text-[#7256c3] uppercase font-mono flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" /> 2-Bullet Fact Summary
                        </span>
                        {post.aiSummary.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                            <p className="leading-relaxed">{bullet}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Cross-Store Price Verification Pill Matrix */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] font-semibold text-slate-400">Cross-Store Matrix:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {post.merchants.map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border ${
                              m.isLowest
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                                : 'bg-[#f8f7ff] text-slate-600 border-[#e6e2f8]'
                            }`}
                          >
                            {m.name}: ₹{m.price.toLocaleString()}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>

      {/* ── Popping Product Details & Comparison Modal ── */}
      <AnimatePresence>
        {inspectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#e6e2f8] shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto text-slate-900"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setInspectedPost(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center absolute top-6 right-6 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Product Header */}
              <div className="space-y-1 pr-8">
                <span className="text-[10px] font-extrabold uppercase font-mono px-2.5 py-0.5 rounded-full bg-violet-100 text-[#7256c3]">
                  {inspectedPost.category} • Multi-Store Verified
                </span>
                <h3 className="text-xl font-extrabold font-heading text-slate-900">
                  {inspectedPost.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Posted by {inspectedPost.author.name} • {inspectedPost.timeAgo}
                </p>
              </div>

              {/* Main Photo + Pricing */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8]">
                <img
                  src={inspectedPost.image}
                  alt={inspectedPost.title}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 bg-white shrink-0"
                />
                <div className="space-y-1 flex-1 text-center sm:text-left">
                  <span className="text-[11px] font-extrabold text-slate-500 font-mono uppercase">Lowest Verified Deal</span>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₹{inspectedPost.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{inspectedPost.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {inspectedPost.discount}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 block">
                    Available on {inspectedPost.lowestMerchant} with direct zero-markup checkout.
                  </span>
                </div>
              </div>

              {/* Cross-Store Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase font-mono text-slate-500 block">
                  Cross-Store Live Price Comparison
                </span>
                <div className="border border-[#e6e2f8] rounded-2xl overflow-hidden divide-y divide-[#e6e2f8] text-xs">
                  {inspectedPost.merchants.map((merchant, mIdx) => (
                    <div key={mIdx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{merchant.name}</span>
                        {merchant.isLowest && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Cheapest Deal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">
                          ₹{merchant.price.toLocaleString()}
                        </span>
                        <a
                          href={merchant.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-violet-100 hover:bg-[#7256c3] hover:text-white transition-colors text-[11px] font-bold text-[#7256c3] flex items-center gap-1 cursor-pointer"
                        >
                          Visit Store <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs Breakdown */}
              {inspectedPost.specs && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase font-mono text-slate-500 block">Hardware Specifications</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(inspectedPost.specs).map(([specKey, specVal]) => (
                      <div key={specKey} className="p-2.5 rounded-xl bg-[#f8f7ff] border border-[#e6e2f8]">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">{specKey}</span>
                        <span className="font-bold text-slate-800">{specVal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    addToCart({
                      id: inspectedPost.id,
                      title: inspectedPost.title,
                      price: inspectedPost.currentPrice,
                      originalPrice: inspectedPost.originalPrice,
                      image: inspectedPost.image,
                      merchant: inspectedPost.lowestMerchant,
                      url: inspectedPost.lowestUrl
                    });
                    setInspectedPost(null);
                    addToast('Added to Cart', `${inspectedPost.title} added to cart`, 'success', 2500);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-[#7256c3] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>

                <a
                  href={inspectedPost.lowestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#6245b5] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  Buy Direct on {inspectedPost.lowestMerchant} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
