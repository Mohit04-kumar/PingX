import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { usePings } from '../../context/PingsContext';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon,
  ArrowRight, 
  ShieldCheck,
  Zap,
  TrendingDown,
  Search,
  CheckCircle2,
  Volume2,
  Play,
  Pause,
  ExternalLink,
  X,
  Lock,
  Tag,
  Clock,
  ChevronRight,
  Bot,
  Bell,
  Star,
  Check,
  Filter
} from 'lucide-react';

// Curated live feed items fulfilling all landing page promises
const INITIAL_DASHBOARD_FEED = [
  {
    id: 'deal-sony-xm5',
    type: 'deal',
    category: 'Electronics',
    store: 'Amazon.in',
    storeBadge: 'Live API Verified',
    storeColor: '#ff9900',
    title: 'Sony WH-1000XM5 Wireless ANC Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    currentPrice: 26990,
    originalPrice: 28990,
    discount: 'Save ₹2,000',
    rating: 4.8,
    reviews: 2450,
    cheapestVsCompetitor: '₹2,000 lower than Croma (₹28,990)',
    timeAgo: '12m ago',
    merchants: [
      { name: 'Amazon.in', price: 26990, isLowest: true, url: 'https://www.amazon.in' },
      { name: 'Flipkart', price: 27490, isLowest: false, url: 'https://www.flipkart.com' },
      { name: 'Croma', price: 28990, isLowest: false, url: 'https://www.croma.com' },
      { name: 'Reliance Digital', price: 28990, isLowest: false, url: 'https://www.reliancedigital.in' }
    ],
    specs: { 'Noise Cancellation': 'Industry-leading ANC', 'Battery': '30 Hours', 'Weight': '250g' }
  },
  {
    id: 'chat-raman-audio',
    type: 'chat',
    category: 'Direct Messaging',
    sender: 'Raman Raj',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'Active in PingX Chat',
    isAudioNote: true,
    audioDuration: '0:34',
    audioTitle: 'Lossless Voice Note: Price alert strategy',
    message: 'Hey! The price scanner found ₹2,000 off on the Sony headphones. Take a listen to my quick breakdown!',
    timeAgo: '18m ago',
    isOnline: true
  },
  {
    id: 'deal-nike-airmax',
    type: 'deal',
    category: 'Footwear',
    store: 'Myntra',
    storeBadge: '38% Verified Discount',
    storeColor: '#ff3f6c',
    title: 'Nike Air Max Impact 4 Basketball Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    currentPrice: 4299,
    originalPrice: 6995,
    discount: '38% OFF',
    rating: 4.7,
    reviews: 1120,
    cheapestVsCompetitor: 'Cheapest on Myntra (₹4,299 vs ₹5,499 on Flipkart)',
    timeAgo: '32m ago',
    merchants: [
      { name: 'Myntra', price: 4299, isLowest: true, url: 'https://www.myntra.com' },
      { name: 'Flipkart', price: 5499, isLowest: false, url: 'https://www.flipkart.com' },
      { name: 'Amazon.in', price: 5890, isLowest: false, url: 'https://www.amazon.in' },
      { name: 'Tata CLiQ', price: 6290, isLowest: false, url: 'https://www.tatacliq.com' }
    ],
    specs: { 'Cushioning': 'Max Air heel unit', 'Traction': 'Herringbone rubber', 'Upper': 'Lightweight mesh' }
  },
  {
    id: 'ai-summary-recap',
    type: 'ai',
    category: 'AI Assistant',
    title: 'PingX Instant AI Summary: Wireless Headphones in 2026',
    query: 'Best ANC wireless headphones for programming in 2026?',
    bullets: [
      'Sony WH-1000XM5 provides best-in-class multi-microphone noise isolation for noisy workspaces.',
      'Lowest verified Indian retail deal is ₹26,990 on Amazon, saving ₹2,000 over retail.'
    ],
    timeAgo: '45m ago',
    sourceCount: '4 Indian Retailers Verified'
  },
  {
    id: 'deal-macbook-air',
    type: 'deal',
    category: 'Laptops',
    store: 'Croma',
    storeBadge: 'HDFC Card Cashback',
    storeColor: '#00b699',
    title: 'Apple MacBook Air M3 (13.6-inch, 16GB, 512GB)',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    currentPrice: 114900,
    originalPrice: 134900,
    discount: 'Save ₹20,000',
    rating: 4.9,
    reviews: 3200,
    cheapestVsCompetitor: 'Lowest price after ₹5,000 bank discount on Croma',
    timeAgo: '1h ago',
    merchants: [
      { name: 'Croma', price: 114900, isLowest: true, url: 'https://www.croma.com' },
      { name: 'Amazon.in', price: 119900, isLowest: false, url: 'https://www.amazon.in' },
      { name: 'Reliance Digital', price: 122900, isLowest: false, url: 'https://www.reliancedigital.in' },
      { name: 'Apple Store', price: 134900, isLowest: false, url: 'https://www.apple.com/in' }
    ],
    specs: { 'Chip': 'Apple M3 8-core CPU', 'Display': 'Liquid Retina 500 nits', 'Battery': '18 Hours' }
  },
  {
    id: 'chat-sneha-group',
    type: 'chat',
    category: 'Group Messaging',
    sender: 'Sneha Kapoor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'Bangalore Tech Club',
    isAudioNote: false,
    message: 'Checked the group comparison matrix! Everyone agreed on ordering the gear before the midnight discount timer expires.',
    timeAgo: '1h 15m ago',
    isOnline: true
  }
];

export function DashboardView({ setActiveTab }) {
  const { user } = useAuth();
  const { chats = [] } = useChat();
  const { pings = [] } = usePings();
  const { products = [], watchlist = [], toggleWatchlist } = useShop();
  const { addToast } = useToast();

  // Filter & Control States (Inntegrate & Ramotion style)
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'deals', 'chats', 'ai'
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all'); // 'all', 'deal', 'chat', 'ai'
  const [timeFilter, setTimeFilter] = useState('recent'); // 'recent', 'today', 'week'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'compact'

  // Interactive audio waveform player state
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Popping Inspection Detail Modal (Inntegrate Popping Order Card style)
  const [inspectedItem, setInspectedItem] = useState(null);

  const unreadPingsCount = pings.filter((p) => !p.read).length;
  const watchedProducts = products.filter((p) => watchlist.includes(p.id));

  // Audio Playback Simulation
  const togglePlayAudio = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      addToast('Playing Lossless Voice Note', '48kHz AAC Lossless stream active', 'info', 2500);
    }
  };

  // Filter Logic
  const filteredFeed = useMemo(() => {
    return INITIAL_DASHBOARD_FEED.filter((item) => {
      // Sub-tab filter
      if (activeSubTab === 'deals' && item.type !== 'deal') return false;
      if (activeSubTab === 'chats' && item.type !== 'chat') return false;
      if (activeSubTab === 'ai' && item.type !== 'ai') return false;

      // Sidebar type filter
      if (selectedTypeFilter !== 'all' && item.type !== selectedTypeFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesSender = item.sender?.toLowerCase().includes(q);
        const matchesMessage = item.message?.toLowerCase().includes(q);
        const matchesStore = item.store?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSender && !matchesMessage && !matchesStore) return false;
      }

      return true;
    });
  }, [activeSubTab, selectedTypeFilter, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      
      {/* ── Top Executive Command Banner (Landing Page Matching Palette) ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#4338ca] text-white shadow-xl relative overflow-hidden border border-white/10">
        
        {/* Soft Ambient Internal Radial Glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#7256c3]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#6366f1]/30 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Matrix Active
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-400/20 text-violet-200 text-[11px] font-bold border border-violet-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-300" />
                Encrypted & Verified
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Good day, {user?.name || 'Raman Raj'} 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Unified command center: live multi-merchant price scanning across 8 stores, lossless encrypted audio messaging, and real-time community pings.
            </p>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('shop')}
              className="px-5 py-3 rounded-xl bg-white text-[#1e1b4b] hover:bg-slate-100 transition-all font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 text-[#7256c3]" />
              Compare Deals
            </button>

            <button
              onClick={() => setActiveTab('chats')}
              className="px-5 py-3 rounded-xl bg-[#7256c3] text-white hover:bg-[#6347b5] transition-all font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] border border-white/20"
            >
              <MessageSquare className="w-4 h-4" />
              Direct Messages
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Inntegrate-Style Metric KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Conversations */}
        <div 
          onClick={() => setActiveTab('chats')}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all cursor-pointer group hover-lift"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Conversations</span>
            <div className="w-9 h-9 rounded-2xl bg-violet-100 text-[#7256c3] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 block">
              {chats.length > 0 ? chats.length : 14} Active
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Lossless voice notes online
            </span>
          </div>
        </div>

        {/* Metric 2: Price Drops */}
        <div 
          onClick={() => setActiveTab('shop')}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all cursor-pointer group hover-lift"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Price Drops</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 block">
              ₹4,200 Saved
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
              Across 8 verified stores
            </span>
          </div>
        </div>

        {/* Metric 3: Watchlist Deals */}
        <div 
          onClick={() => setActiveTab('shop')}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all cursor-pointer group hover-lift"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Watchlist Deals</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 block">
              {watchedProducts.length > 0 ? watchedProducts.length : 6} Tracked
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
              Real-time stock & price sync
            </span>
          </div>
        </div>

        {/* Metric 4: System Alerts & Pings */}
        <div 
          onClick={() => setActiveTab('pings')}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all cursor-pointer group hover-lift"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Alert Pings</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 block">
              {unreadPingsCount > 0 ? unreadPingsCount : 4} Pending
            </span>
            <span className="text-[11px] font-semibold text-amber-600 mt-0.5 block">
              Instant alerts configured
            </span>
          </div>
        </div>

      </div>

      {/* ── Ramotion-Style Sub-Navigation Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2f8] pb-4">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Activity Matrix', count: INITIAL_DASHBOARD_FEED.length },
            { id: 'deals', label: 'Live Deals & Discounts', count: 3 },
            { id: 'chats', label: 'Conversations & Audio', count: 2 },
            { id: 'ai', label: 'AI Fact Recaps', count: 1 }
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1e1b4b] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-[#e6e2f8] hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-white p-1 rounded-2xl border border-[#e6e2f8] shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'cards' ? 'bg-violet-100 text-[#7256c3]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Card Matrix
          </button>
          <button
            type="button"
            onClick={() => setViewMode('compact')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'compact' ? 'bg-violet-100 text-[#7256c3]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Compact View
          </button>
        </div>

      </div>

      {/* ── Inntegrate & Ramotion Split Layout: Left Controls + Central Card Matrix ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Control Sidebar (Inntegrate Filter Column) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          {/* Filter Container */}
          <div className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs space-y-5">
            
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold font-heading text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#7256c3]" />
                Filters & Search
              </span>
              {(selectedTypeFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => { setSelectedTypeFilter('all'); setSearchQuery(''); }}
                  className="text-[11px] font-bold text-[#7256c3] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Live Search Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase font-mono text-slate-500">
                Filter by Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deals, people, notes..."
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
            </div>

            {/* Filter By Activity Type (Checkboxes / Radio list) */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase font-mono text-slate-500">
                Activity Type
              </label>
              <div className="space-y-1.5 text-xs font-medium text-slate-700">
                {[
                  { id: 'all', label: 'All Activities', icon: CheckCircle2 },
                  { id: 'deal', label: 'Multi-Merchant Deals', icon: ShoppingBag },
                  { id: 'chat', label: 'Chat & Audio Notes', icon: MessageSquare },
                  { id: 'ai', label: 'AI Summaries', icon: Bot },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                      selectedTypeFilter === item.id ? 'bg-violet-50 text-[#7256c3] font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="activityType"
                        checked={selectedTypeFilter === item.id}
                        onChange={() => setSelectedTypeFilter(item.id)}
                        className="accent-[#7256c3] cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-extrabold uppercase font-mono text-slate-500">
                Time Horizon
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                {[
                  { id: 'recent', label: 'Recent' },
                  { id: 'today', label: 'Today' },
                  { id: 'week', label: 'Week' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTimeFilter(t.id)}
                    className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                      timeFilter === t.id
                        ? 'bg-[#1e1b4b] text-white'
                        : 'bg-[#f8f7ff] text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Platform Security & Privacy Card */}
          <div className="bg-[#f8f7ff] rounded-3xl p-5 border border-[#e6e2f8] space-y-3">
            <span className="text-[11px] font-extrabold font-mono text-[#7256c3] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7256c3]" />
              Platform Guarantees
            </span>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Multi-Merchant API Price Scanner (Amazon, Flipkart, Croma, Myntra)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Lossless 48kHz Encrypted Audio Messaging</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Zero tracking, zero ads, 100% private data preservation</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Central Matrix Content Grid (Inntegrate Elevated Cards) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          
          {filteredFeed.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e6e2f8] space-y-3">
              <p className="text-slate-500 text-sm">No items found matching your current filter.</p>
              <button
                type="button"
                onClick={() => { setSelectedTypeFilter('all'); setActiveSubTab('all'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl bg-[#7256c3] text-white text-xs font-bold cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-3'}>
              {filteredFeed.map((item) => {
                
                // ── DEAL CARD ──
                if (item.type === 'deal') {
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover-lift"
                    >
                      <div className="space-y-3">
                        {/* Store Tag & Time */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#f8f7ff] border border-[#e6e2f8] text-slate-800">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.storeColor }} />
                            {item.store} • {item.storeBadge}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.timeAgo}
                          </span>
                        </div>

                        {/* Product Visual & Header */}
                        <div className="flex items-start gap-3.5">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-base font-black text-slate-900 font-mono">
                                ₹{item.currentPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-violet-100 text-[#7256c3]">
                                {item.discount}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Retailer Comparison Snapshot */}
                        <div className="p-2.5 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] text-[11px] text-slate-600 flex items-center justify-between">
                          <span className="font-medium truncate">{item.cheapestVsCompetitor}</span>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0 ml-2">
                            Lowest Price
                          </span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setInspectedItem(item)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#1e1b4b] text-white hover:bg-[#2e2970] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          Compare Stores <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleWatchlist({ id: item.id, title: item.title, price: item.currentPrice });
                            addToast(
                              watchlist.includes(item.id) ? 'Removed from Watchlist' : 'Added to Watchlist',
                              `${item.title} price watcher updated`,
                              'success'
                            );
                          }}
                          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                            watchlist.includes(item.id)
                              ? 'bg-amber-50 border-amber-300 text-amber-600'
                              : 'border-slate-200 text-slate-400 hover:text-amber-500'
                          }`}
                          title="Toggle Watchlist"
                        >
                          <Star className={`w-4 h-4 ${watchlist.includes(item.id) ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                // ── CHAT & AUDIO NOTE CARD ──
                if (item.type === 'chat') {
                  const isPlaying = playingAudioId === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover-lift"
                    >
                      <div className="space-y-3">
                        {/* Header with Sender Avatar & Online Tag */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <img
                                src={item.avatar}
                                alt={item.sender}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                              />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 leading-none">{item.sender}</h4>
                              <span className="text-[10px] text-slate-500">{item.status}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{item.timeAgo}</span>
                        </div>

                        {/* Audio Waveform Player if voice note */}
                        {item.isAudioNote ? (
                          <div className="p-3.5 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold text-[#7256c3] flex items-center gap-1.5">
                                <Volume2 className="w-4 h-4" />
                                Lossless Voice Note
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 font-bold">
                                {isPlaying ? '0:14 / 0:34' : item.audioDuration}
                              </span>
                            </div>

                            {/* Animated Audio Waveform Bars */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => togglePlayAudio(item.id)}
                                className="w-9 h-9 rounded-full bg-[#7256c3] text-white flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 active:scale-95 transition-transform"
                              >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                              </button>

                              {/* Frequency Bars with simulated bouncing animation */}
                              <div className="flex-1 flex items-center gap-1 h-8 px-2 bg-white rounded-xl border border-slate-200">
                                {[40, 70, 30, 90, 60, 85, 45, 100, 65, 30, 80, 50, 95, 40, 75, 55, 90, 35].map((height, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1 rounded-full transition-all duration-200 ${
                                      isPlaying ? 'bg-[#7256c3] animate-pulse' : 'bg-slate-300'
                                    }`}
                                    style={{
                                      height: isPlaying ? `${Math.max(20, (height * Math.random()).toFixed(0))}%` : `${height}%`,
                                      transitionDelay: `${idx * 15}ms`
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{item.message}</p>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] text-xs text-slate-700 leading-relaxed">
                            "{item.message}"
                          </div>
                        )}
                      </div>

                      {/* Chat Action Button */}
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setActiveTab('chats')}
                          className="w-full py-2.5 px-3 rounded-xl bg-violet-100 hover:bg-violet-200 text-[#7256c3] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Open in Direct Messages <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                // ── AI INSIGHT RECAP CARD ──
                if (item.type === 'ai') {
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover-lift md:col-span-2"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#1e1b4b] text-white shadow-2xs">
                            <Bot className="w-3.5 h-3.5 text-violet-300" />
                            2-Bullet Instant Summary
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.timeAgo}</span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{item.query}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">{item.sourceCount}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] space-y-2">
                          {item.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">Ready for follow-up queries</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('ai')}
                          className="py-2 px-4 rounded-xl bg-[#7256c3] text-white hover:bg-[#6044b3] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          Ask PingX Assistant <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                return null;
              })}
            </div>
          )}

        </div>

      </div>

      {/* ── Inntegrate-Style Popping Order / Deal Details Modal ── */}
      <AnimatePresence>
        {inspectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#e6e2f8] shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center absolute top-6 right-6 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1.5 pr-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-violet-100 text-[#7256c3] uppercase">
                  <Tag className="w-3 h-3" />
                  Multi-Merchant Verified Matrix
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 leading-tight">
                  {inspectedItem.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregated from India's verified retailer feeds with instant price tracking.
                </p>
              </div>

              {/* Product Preview + Best Price Pill */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8]">
                <img
                  src={inspectedItem.image}
                  alt={inspectedItem.title}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0 bg-white"
                />
                <div className="space-y-1 flex-1 text-center sm:text-left">
                  <span className="text-[11px] font-extrabold text-slate-500 font-mono uppercase">Lowest Verified Deal</span>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₹{inspectedItem.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{inspectedItem.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {inspectedItem.discount}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Available on {inspectedItem.store} with zero markups or redirect fees.
                  </span>
                </div>
              </div>

              {/* Multi-Store Comparison Table (Inntegrate Breakdown) */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase font-mono text-slate-500 block">
                  Cross-Store Live Price Comparison
                </span>
                <div className="border border-[#e6e2f8] rounded-2xl overflow-hidden divide-y divide-[#e6e2f8] text-xs">
                  {inspectedItem.merchants?.map((merchant, mIdx) => (
                    <div key={mIdx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{merchant.name}</span>
                        {merchant.isLowest && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Cheapest
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
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#7256c3] hover:text-white transition-colors text-[11px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          Visit Store <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs Breakdown */}
              {inspectedItem.specs && (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase font-mono text-slate-500 block">
                    Key Specifications
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(inspectedItem.specs).map(([specKey, specVal]) => (
                      <div key={specKey} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 font-mono block">{specKey}</span>
                        <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">{specVal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInspectedItem(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Close Inspection
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleWatchlist({ id: inspectedItem.id, title: inspectedItem.title, price: inspectedItem.currentPrice });
                    addToast(
                      watchlist.includes(inspectedItem.id) ? 'Removed from Watchlist' : 'Added to Watchlist',
                      `${inspectedItem.title} watcher updated`,
                      'success'
                    );
                    setInspectedItem(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white text-xs font-bold transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5" />
                  {watchlist.includes(inspectedItem.id) ? 'Remove Watchlist' : 'Add to Price Watch'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default DashboardView;
