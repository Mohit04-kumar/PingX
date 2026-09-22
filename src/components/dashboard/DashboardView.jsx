import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { usePings } from '../../context/PingsContext';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { 
  Utensils, 
  Soup, 
  ConciergeBell, 
  XCircle, 
  Search, 
  SlidersHorizontal, 
  ArrowUpRight, 
  ExternalLink, 
  Volume2, 
  Play, 
  Pause, 
  ShieldCheck, 
  Check, 
  X, 
  ShoppingBag, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  Star, 
  Printer,
  ChevronRight,
  Filter,
  CheckCircle2,
  Bell,
  Mail,
  Tag
} from 'lucide-react';

// Comprehensive orders & live commerce feed matching Inntegrate reference image + landing page promises
const INITIAL_ORDERS_DATA = [
  {
    id: 'order-alex-299283',
    customerName: 'Alex Trie',
    orderNumber: '#299283',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'new',
    statusLabel: 'New',
    roomNumber: 'S-01',
    channel: 'Room Dining • S-01',
    totalPayment: '$27.50',
    totalPaymentRupees: '₹2,280',
    timeAgo: '4m ago',
    isElevatedFeatured: true,
    items: [
      {
        name: 'Grilled salmon with vegetables',
        price: '$18.50',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=160&auto=format&fit=crop&q=80'
      },
      {
        name: 'Garden salad',
        price: '$6.00',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=160&auto=format&fit=crop&q=80'
      }
    ],
    moreItemsCount: 2,
    moreItemsList: [
      { name: 'Organic Herbal Green Tea', price: '$2.00', qty: '1x' },
      { name: 'Garlic Sourdough Toast', price: '$1.00', qty: '1x' }
    ],
    orderNotes: 'No dressing on the salad.',
    category: 'restaurant'
  },
  {
    id: 'order-jerome-299265',
    customerName: 'Jerome Bell',
    orderNumber: '#299265',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    status: 'on_progress',
    statusLabel: 'On progress',
    roomNumber: 'D-08',
    channel: 'Executive Suite • D-08',
    totalPayment: '$31.00',
    totalPaymentRupees: '₹2,580',
    timeAgo: '14m ago',
    items: [
      {
        name: 'Beef steak',
        price: '$22.50',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=160&auto=format&fit=crop&q=80'
      },
      {
        name: 'Mashed potatoes',
        price: '$5.00',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=160&auto=format&fit=crop&q=80'
      }
    ],
    moreItemsCount: 2,
    moreItemsList: [
      { name: 'Truffle Garlic Butter', price: '$2.00', qty: '1x' },
      { name: 'Cold Pressed Lemon Iced Tea', price: '$1.50', qty: '1x' }
    ],
    orderNotes: 'Steak well-done, no gravy on potatoes.',
    category: 'restaurant'
  },
  {
    id: 'order-annette-299222',
    customerName: 'Annette Black',
    orderNumber: '#299222',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    status: 'ready_to_serve',
    statusLabel: 'Ready to serve',
    roomNumber: 'S-22',
    channel: 'Garden Terrace • S-22',
    totalPayment: '$36.50',
    totalPaymentRupees: '₹3,020',
    timeAgo: '22m ago',
    items: [
      {
        name: 'Chicken curry with basmati rice',
        price: '$16.50',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=160&auto=format&fit=crop&q=80'
      },
      {
        name: 'Garden salad',
        price: '$6.00',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=160&auto=format&fit=crop&q=80'
      }
    ],
    moreItemsCount: 3,
    moreItemsList: [
      { name: 'Organic Mango Lassi', price: '$5.00', qty: '1x' },
      { name: 'Butter Garlic Naan', price: '$4.00', qty: '2x' },
      { name: 'Roasted Spiced Papadum', price: '$2.00', qty: '1x' }
    ],
    orderNotes: 'Mild spice level.',
    category: 'restaurant'
  },
  {
    id: 'order-raman-299104',
    customerName: 'Raman Raj',
    orderNumber: '#PING-299104',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'new',
    statusLabel: 'New',
    roomNumber: 'Live Stream',
    channel: 'PingX Encrypted Audio Stream',
    totalPayment: '₹26,990',
    totalPaymentRupees: '₹26,990 ($325.00)',
    timeAgo: '12m ago',
    isAudioNote: true,
    audioDuration: '0:34',
    audioTitle: 'Lossless Voice Note: Price alert strategy',
    audioMessage: 'Hey! The price scanner found ₹2,000 off on the Sony XM5 on Amazon vs Croma. Tap play to listen!',
    items: [
      {
        name: 'Sony WH-1000XM5 Wireless ANC',
        price: '₹26,990',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&auto=format&fit=crop&q=80'
      },
      {
        name: 'Hard Shell Protective Travel Case',
        price: '₹1,490',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=160&auto=format&fit=crop&q=80'
      }
    ],
    moreItemsCount: 1,
    moreItemsList: [
      { name: 'USB-C 65W Fast Charging Braided Cable', price: '₹799', qty: '1x' }
    ],
    orderNotes: 'Lossless Voice Note: Amazon price is lowest across 8 verified retailers.',
    category: 'deal',
    dealDetails: {
      store: 'Amazon.in',
      originalPrice: '₹28,990',
      discount: 'Save ₹2,000',
      competitors: [
        { name: 'Amazon.in', price: 26990, isLowest: true, url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 27490, isLowest: false, url: 'https://www.flipkart.com' },
        { name: 'Croma', price: 28990, isLowest: false, url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 28990, isLowest: false, url: 'https://www.reliancedigital.in' }
      ]
    }
  },
  {
    id: 'order-kristin-291234',
    customerName: 'Kristin Watson',
    orderNumber: '#291234',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    status: 'ready_to_serve',
    statusLabel: 'Ready to serve',
    roomNumber: 'Suite 104',
    channel: 'Poolside Lounge • Suite 104',
    totalPayment: '$48.00',
    totalPaymentRupees: '₹3,990',
    timeAgo: '35m ago',
    items: [
      {
        name: 'Artisan Margherita Pizza',
        price: '$24.00',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=160&auto=format&fit=crop&q=80'
      },
      {
        name: 'Truffle Parmesan Fries',
        price: '$12.00',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=160&auto=format&fit=crop&q=80'
      }
    ],
    moreItemsCount: 2,
    moreItemsList: [
      { name: 'Sparkling Italian Blood Orange Soda', price: '$6.00', qty: '1x' },
      { name: 'Classic Espresso Tiramisu', price: '$6.00', qty: '1x' }
    ],
    orderNotes: 'Deliver to poolside lounge cabana 3.',
    category: 'restaurant'
  },
  {
    id: 'order-jenny-299244',
    customerName: 'Jenny Wilson',
    orderNumber: '#299244',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    status: 'on_progress',
    statusLabel: 'On progress',
    roomNumber: 'Room 302',
    channel: 'Deluxe Suite • Room 302',
    totalPayment: '$42.50',
    totalPaymentRupees: '₹3,520',
    timeAgo: '42m ago',
    items: [
      {
        name: 'Pan-Seared Seabass',
        price: '$28.50',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=160&auto=format&fit=crop&q=80'
      },
      {
        name: 'Roasted Asparagus with Lemon',
        price: '$8.00',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1515471204630-f633f8d6b241?w=160&auto=format&fit=crop&q=80'
      }
    ],
    moreItemsCount: 2,
    moreItemsList: [
      { name: 'Herb Vinaigrette Dip', price: '$2.50', qty: '1x' },
      { name: 'San Pellegrino Sparkling Mineral Water', price: '$3.50', qty: '1x' }
    ],
    orderNotes: 'Gluten-free preference confirmed with culinary team.',
    category: 'restaurant'
  },
  {
    id: 'order-sneha-298912',
    customerName: 'Sneha Kapoor',
    orderNumber: '#PING-298912',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'ready_to_serve',
    statusLabel: 'Ready to serve',
    roomNumber: 'Croma Hub',
    channel: 'Bangalore Tech Club Matrix',
    totalPayment: '₹1,14,900',
    totalPaymentRupees: '₹1,14,900 ($1,380.00)',
    timeAgo: '1h 10m ago',
    items: [
      {
        name: 'Apple MacBook Air M3 (16GB, 512GB)',
        price: '₹1,14,900',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=160&auto=format&fit=crop&q=80'
      },
      {
        name: 'USB-C 7-in-1 Multiport Adapter',
        price: '₹3,490',
        qty: '1x',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=160&auto=format&fit=crop&q=80'
      }
    ],
    moreItemsCount: 1,
    moreItemsList: [
      { name: 'MagSafe 3 Braided Fast Charging Cable', price: '₹2,100', qty: '1x' }
    ],
    orderNotes: 'AI Fact: Lowest verified price on Croma with ₹5,000 HDFC card cashback.',
    category: 'deal',
    dealDetails: {
      store: 'Croma',
      originalPrice: '₹1,34,900',
      discount: 'Save ₹20,000',
      competitors: [
        { name: 'Croma', price: 114900, isLowest: true, url: 'https://www.croma.com' },
        { name: 'Amazon.in', price: 119900, isLowest: false, url: 'https://www.amazon.in' },
        { name: 'Reliance Digital', price: 122900, isLowest: false, url: 'https://www.reliancedigital.in' },
        { name: 'Apple Store', price: 134900, isLowest: false, url: 'https://www.apple.com/in' }
      ]
    }
  }
];

export function DashboardView({ setActiveTab }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Top Nav active item state
  const [activeHeaderTab, setActiveHeaderTab] = useState('Restaurant');

  // Filter States matching Inntegrate reference
  const [statusFilters, setStatusFilters] = useState({
    new: true,
    on_progress: true,
    ready_to_serve: true,
    cancelled: false
  });

  const [filterByRadio, setFilterByRadio] = useState('recent'); // 'recent', 'last_hour', 'today', 'custom'
  const [cardViewToggle, setCardViewToggle] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback Simulation for Lossless Voice Notes
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Popping Inspection Detail Modal State
  const [inspectedOrder, setInspectedOrder] = useState(null);

  // Toggle checkbox handler
  const handleToggleStatus = (key) => {
    setStatusFilters((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Play audio toggle
  const togglePlayAudio = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      addToast('Playing Lossless Voice Note', '48kHz AAC Lossless stream active from Raman Raj', 'info', 2500);
    }
  };

  // Filter logic
  const filteredOrders = useMemo(() => {
    return INITIAL_ORDERS_DATA.filter((order) => {
      // Status checkbox filter
      if (!statusFilters[order.status]) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = order.customerName.toLowerCase().includes(q);
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesRoom = order.roomNumber.toLowerCase().includes(q);
        const matchesItem = order.items.some((i) => i.name.toLowerCase().includes(q));
        const matchesNote = order.orderNotes.toLowerCase().includes(q);
        if (!matchesName && !matchesNumber && !matchesRoom && !matchesItem && !matchesNote) {
          return false;
        }
      }

      return true;
    });
  }, [statusFilters, searchQuery]);

  // Counts for top 4 metric cards
  const newCount = 18;
  const onProgressCount = 2;
  const readyToServeCount = 7;
  const cancelledCount = 3;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-fadeIn text-slate-900">
      
      {/* ── Top Bar matching Inntegrate Restaurant Header ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6e2f8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Brand Icon Pill & Nav Links */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          
          {/* Logo / Brand Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-violet-50 border border-violet-200">
            <div className="w-6 h-6 rounded-xl bg-[#7256c3] text-white flex items-center justify-center font-black text-xs shadow-2xs">
              P
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 font-heading">
              Inntegrate
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold">
            {[
              { id: 'Dashboard', label: 'Dashboard', action: () => {} },
              { id: 'Guests', label: 'Guests', action: () => setActiveTab?.('connect') },
              { id: 'Reservations', label: 'Reservations', action: () => setActiveTab?.('pings') },
              { id: 'Rooms', label: 'Rooms', action: () => setActiveTab?.('chats') },
              { id: 'Restaurant', label: 'Restaurant', action: () => {} }
            ].map((tab) => {
              const isActive = activeHeaderTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveHeaderTab(tab.id);
                    tab.action();
                  }}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1e1b4b] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Action Icons & User Avatar */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          
          <button
            type="button"
            onClick={() => setActiveTab?.('shop')}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer border border-[#e6e2f8] transition-colors"
            title="Search Shop Deals"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab?.('chats')}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer border border-[#e6e2f8] transition-colors"
            title="Direct Messages"
          >
            <Mail className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab?.('pings')}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer border border-[#e6e2f8] transition-colors relative"
            title="Pings & Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 border-2 border-white" />
          </button>

          {/* User Avatar */}
          <div 
            onClick={() => setActiveTab?.('profile')}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Raman Raj'}
                className="w-9 h-9 rounded-full object-cover border-2 border-violet-200 group-hover:border-[#7256c3] transition-colors"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
            </div>
          </div>

        </div>

      </div>

      {/* ── Section Title: Restaurant & Smart Orders ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Restaurant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Live order queue, multi-merchant price comparison, and lossless direct communications.
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Orders Sync Active
        </div>
      </div>

      {/* ── 4 Top KPI Metric Cards (Matching Inntegrate Reference Image in Pure Light Theme) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: New orders */}
        <div className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">New orders</span>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              {newCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#1e1b4b] text-violet-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5 text-violet-200" />
          </div>
        </div>

        {/* Metric 2: On progress */}
        <div className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">On progress</span>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              {onProgressCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Soup className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Metric 3: Ready to serve */}
        <div className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Ready to serve</span>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              {readyToServeCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <ConciergeBell className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Metric 4: Cancelled orders */}
        <div className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-xs hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Cancelled orders</span>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              {cancelledCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <XCircle className="w-5 h-5 text-white" />
          </div>
        </div>

      </div>

      {/* ── Main Workspace Grid: Left Filter Column + Central Order Cards Matrix ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Filter Sidebar matching Inntegrate sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-[#e6e2f8] shadow-xs space-y-6">
            
            {/* Header: Filters with Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold font-heading text-slate-900">Filters</h3>
              {(searchQuery || !statusFilters.new || !statusFilters.on_progress || !statusFilters.ready_to_serve || statusFilters.cancelled) && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilters({ new: true, on_progress: true, ready_to_serve: true, cancelled: false });
                    setSearchQuery('');
                    setFilterByRadio('recent');
                  }}
                  className="text-xs font-bold text-[#7256c3] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guest or item..."
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

            {/* Section 1: Order status (Checkboxes from Inntegrate) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-600 block">Order status</span>
              
              <div className="space-y-2.5 text-xs font-medium text-slate-700">
                
                {/* Checkbox: New */}
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    statusFilters.new ? 'bg-[#1e1b4b] text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {statusFilters.new && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={statusFilters.new}
                    onChange={() => handleToggleStatus('new')}
                    className="sr-only"
                  />
                  <span className="font-semibold text-slate-800 group-hover:text-slate-900">New</span>
                </label>

                {/* Checkbox: On progress */}
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    statusFilters.on_progress ? 'bg-[#1e1b4b] text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {statusFilters.on_progress && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={statusFilters.on_progress}
                    onChange={() => handleToggleStatus('on_progress')}
                    className="sr-only"
                  />
                  <span className="font-semibold text-slate-800 group-hover:text-slate-900">On progress</span>
                </label>

                {/* Checkbox: Ready to serve */}
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    statusFilters.ready_to_serve ? 'bg-[#1e1b4b] text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {statusFilters.ready_to_serve && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={statusFilters.ready_to_serve}
                    onChange={() => handleToggleStatus('ready_to_serve')}
                    className="sr-only"
                  />
                  <span className="font-semibold text-slate-800 group-hover:text-slate-900">Ready to serve</span>
                </label>

                {/* Checkbox: Cancelled */}
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    statusFilters.cancelled ? 'bg-[#1e1b4b] text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {statusFilters.cancelled && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={statusFilters.cancelled}
                    onChange={() => handleToggleStatus('cancelled')}
                    className="sr-only"
                  />
                  <span className="font-semibold text-slate-800 group-hover:text-slate-900">Cancelled</span>
                </label>

              </div>
            </div>

            {/* Section 2: Filter by (Radio Buttons from Inntegrate) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 block">Filter by</span>
              
              <div className="space-y-2 text-xs font-medium text-slate-700">
                {[
                  { id: 'recent', label: 'Recent orders' },
                  { id: 'last_hour', label: 'Last hour' },
                  { id: 'today', label: 'Today' },
                  { id: 'custom', label: 'Custom date' }
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      filterByRadio === opt.id ? 'border-[#1e1b4b] bg-white' : 'border-slate-300 bg-white'
                    }`}>
                      {filterByRadio === opt.id && (
                        <div className="w-2 h-2 rounded-full bg-[#1e1b4b]" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="filterBy"
                      value={opt.id}
                      checked={filterByRadio === opt.id}
                      onChange={() => setFilterByRadio(opt.id)}
                      className="sr-only"
                    />
                    <span className={`font-semibold ${filterByRadio === opt.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: Card view toggle switch */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Card view</span>
              <button
                type="button"
                onClick={() => setCardViewToggle(!cardViewToggle)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  cardViewToggle ? 'bg-[#7256c3]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                    cardViewToggle ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Core Platform Guarantees matching Landing Page Promises */}
          <div className="bg-[#f8f7ff] rounded-3xl p-5 border border-[#e6e2f8] space-y-3">
            <span className="text-[11px] font-extrabold font-mono text-[#7256c3] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7256c3]" />
              Landing Page Guarantees
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

        {/* Central Matrix Grid of Order Cards */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e6e2f8] space-y-3">
              <p className="text-slate-500 text-sm">No orders or deals match the current filter selection.</p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilters({ new: true, on_progress: true, ready_to_serve: true, cancelled: false });
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#7256c3] text-white text-xs font-bold cursor-pointer hover:bg-[#6245b5] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={cardViewToggle ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-3'}>
              {filteredOrders.map((order, idx) => {
                const isPlaying = playingAudioId === order.id;

                // Status pill badge color
                const getStatusBadge = () => {
                  switch (order.status) {
                    case 'new':
                      return (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-[#7256c3]">
                          {order.statusLabel}
                        </span>
                      );
                    case 'on_progress':
                      return (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          {order.statusLabel}
                        </span>
                      );
                    case 'ready_to_serve':
                      return (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          {order.statusLabel}
                        </span>
                      );
                    case 'cancelled':
                      return (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          {order.statusLabel}
                        </span>
                      );
                    default:
                      return null;
                  }
                };

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className={`bg-white rounded-3xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                      order.isElevatedFeatured
                        ? 'border-violet-300 shadow-xl ring-2 ring-[#7256c3]/15 transform -translate-y-1'
                        : 'border-[#e6e2f8] shadow-xs hover:shadow-md'
                    }`}
                  >
                    
                    <div className="space-y-4">
                      
                      {/* Top Header: Avatar + Customer Name + Order # + Status Pill */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.avatar}
                            alt={order.customerName}
                            className="w-10 h-10 rounded-full object-cover border border-[#e6e2f8] bg-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {order.customerName}
                            </h4>
                            <span className="text-xs text-slate-400 font-medium">
                              Order {order.orderNumber}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {getStatusBadge()}
                        </div>
                      </div>

                      {/* Sub-Metadata Row: Room Number & Total Payment */}
                      <div className="grid grid-cols-2 gap-4 p-3 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] text-xs">
                        <div>
                          <span className="text-[11px] text-slate-500 font-medium block">Room number</span>
                          <span className="font-bold text-slate-900 font-heading">{order.roomNumber}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 font-medium block">Total payment</span>
                          <span className="font-bold text-slate-900 font-heading">{order.totalPayment}</span>
                        </div>
                      </div>

                      {/* Ordered Items List with small thumbnails */}
                      <div className="space-y-2.5">
                        {order.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate leading-snug">{item.name}</p>
                                <span className="text-[11px] text-slate-400 font-medium">{item.price}</span>
                              </div>
                            </div>
                            <span className="font-bold text-slate-700 text-xs shrink-0">{item.qty}</span>
                          </div>
                        ))}

                        {/* +X more items expander trigger */}
                        {order.moreItemsCount > 0 && (
                          <button
                            type="button"
                            onClick={() => setInspectedOrder(order)}
                            className="text-[11px] font-bold text-slate-400 hover:text-[#7256c3] cursor-pointer transition-colors block text-right w-full"
                          >
                            +{order.moreItemsCount} more items
                          </button>
                        )}
                      </div>

                      {/* Lossless Voice Note Waveform Player if present (Raman Raj promise) */}
                      {order.isAudioNote && (
                        <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#7256c3] flex items-center gap-1.5">
                              <Volume2 className="w-3.5 h-3.5" />
                              48kHz Lossless Voice Note
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                              {isPlaying ? '0:14 / 0:34' : order.audioDuration}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => togglePlayAudio(order.id)}
                              className="w-8 h-8 rounded-full bg-[#7256c3] text-white flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 transition-transform shrink-0"
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                            </button>

                            {/* Animated sound wave frequency bars */}
                            <div className="flex-1 flex items-center gap-1 h-7 px-2 bg-white rounded-xl border border-violet-200">
                              {[35, 75, 40, 95, 60, 85, 45, 100, 65, 30, 80, 50, 90, 40, 70, 55, 85, 30].map((h, bIdx) => (
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
                        </div>
                      )}

                      {/* Order Notes Section */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-400 block">Order Notes</span>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {order.orderNotes}
                        </p>
                      </div>

                    </div>

                    {/* Bottom CTA Button: Order details ↗ (Matching Inntegrate pill CTA) */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setInspectedOrder(order)}
                        className={`w-full py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                          order.isElevatedFeatured
                            ? 'bg-[#1e1b4b] hover:bg-[#2d2870] text-white shadow-md'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-[#7256c3]'
                        }`}
                      >
                        Order details <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* ── Popping Order Details Modal (Exact Inntegrate Popping Card Inspection) ── */}
      <AnimatePresence>
        {inspectedOrder && (
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
                onClick={() => setInspectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center absolute top-6 right-6 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 pr-10">
                <img
                  src={inspectedOrder.avatar}
                  alt={inspectedOrder.customerName}
                  className="w-14 h-14 rounded-2xl object-cover border border-[#e6e2f8] bg-slate-100 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold font-heading text-slate-900 leading-tight">
                      {inspectedOrder.customerName}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-[#7256c3]">
                      Order {inspectedOrder.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {inspectedOrder.channel} • Created {inspectedOrder.timeAgo}
                  </p>
                </div>
              </div>

              {/* Order Metadata Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">Room Number</span>
                  <span className="font-bold text-slate-900">{inspectedOrder.roomNumber}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">Total Payment</span>
                  <span className="font-bold text-slate-900 font-mono">{inspectedOrder.totalPayment} ({inspectedOrder.totalPaymentRupees})</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">Payment Status</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Paid
                  </span>
                </div>
              </div>

              {/* Full Itemized Order List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono block">
                  Itemized Order Breakdown
                </span>

                <div className="border border-[#e6e2f8] rounded-2xl overflow-hidden divide-y divide-[#e6e2f8] text-xs">
                  {/* Primary Items */}
                  {inspectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <span className="text-[11px] text-slate-500">{item.price} each</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 font-mono px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
                        {item.qty}
                      </span>
                    </div>
                  ))}

                  {/* Additional Items */}
                  {inspectedOrder.moreItemsList?.map((item, idx) => (
                    <div key={`more-${idx}`} className="p-3 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3 pl-2">
                        <span className="w-2 h-2 rounded-full bg-[#7256c3]" />
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <span className="text-[11px] text-slate-400">{item.price}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 font-mono px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Store Price Verification Table if tech deal */}
              {inspectedOrder.dealDetails && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase font-mono block">
                    Cross-Store Live Verification ({inspectedOrder.dealDetails.store})
                  </span>
                  <div className="border border-[#e6e2f8] rounded-2xl overflow-hidden divide-y divide-[#e6e2f8] text-xs">
                    {inspectedOrder.dealDetails.competitors.map((comp, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{comp.name}</span>
                          {comp.isLowest && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Lowest Price Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900">
                            ₹{comp.price.toLocaleString()}
                          </span>
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-violet-100 hover:bg-[#7256c3] hover:text-white transition-colors text-[11px] font-bold text-[#7256c3] flex items-center gap-1 cursor-pointer"
                          >
                            Verify <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-700">Special Instructions / Notes:</span>
                <p className="font-medium leading-relaxed">{inspectedOrder.orderNotes}</p>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    addToast('Print Triggered', `Ticket for Order ${inspectedOrder.orderNumber} sent to kitchen printer`, 'success', 3000);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#7256c3] bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" /> Print Order Ticket
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInspectedOrder(null);
                      setActiveTab?.('chats');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-violet-100 text-[#7256c3] hover:bg-violet-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> Message Guest
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectedOrder(null)}
                    className="px-5 py-2.5 rounded-xl bg-[#1e1b4b] hover:bg-[#2d2870] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Done
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
