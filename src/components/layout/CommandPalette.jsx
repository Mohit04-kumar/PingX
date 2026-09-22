import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Bot, ShoppingBag, Bell, User, X, ArrowRight, Layers } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { useChat } from '../../context/ChatContext';

export function CommandPalette({ isOpen, onClose, onNavigate }) {
  const { chats = [] } = useChat();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
          setActiveCategory('All');
          setSelectedIndex(0);
        }
      }
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items based on search query
  const matchingChats = chats.filter((c) => {
    const name = c.user?.name || c.group?.name || '';
    return name.toLowerCase().includes(query.toLowerCase());
  }).map((c) => ({
    id: `chat_${c.id}`,
    category: 'Chats',
    title: c.user?.name || c.group?.name,
    subtitle: c.lastMessage?.content,
    action: () => { onNavigate('chats', c.id); onClose(); },
    icon: MessageSquare
  }));

  const matchingProducts = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  ).map((p) => ({
    id: `prod_${p.id}`,
    category: 'Products',
    title: p.name,
    subtitle: `₹${p.price} — ${p.merchants.map(m => m.name).join(', ')}`,
    action: () => { onNavigate('shop', p.id); onClose(); },
    icon: ShoppingBag
  }));

  const quickNav = [
    { id: 'nav_ai', category: 'AI', title: 'Open PingX AI Assistant', subtitle: 'Floating context-aware AI', action: () => { onNavigate('ai'); onClose(); }, icon: Bot },
    { id: 'nav_pings', category: 'Pings', title: 'View Activity Pings', subtitle: 'Reminders and price drop alerts', action: () => { onNavigate('pings'); onClose(); }, icon: Bell },
    { id: 'nav_showcase', category: 'Navigation', title: 'Open Page Flows UI Showcase', subtitle: 'Component gallery playground', action: () => { onNavigate('showcase'); onClose(); }, icon: Layers },
    { id: 'nav_profile', category: 'Navigation', title: 'User Profile & Bio', subtitle: 'Account settings', action: () => { onNavigate('profile'); onClose(); }, icon: User }
  ];

  let allResults = [...matchingChats, ...matchingProducts, ...quickNav];

  if (activeCategory !== 'All') {
    allResults = allResults.filter(item => item.category === activeCategory);
  }

  const categories = ['All', 'Chats', 'Products', 'AI', 'Pings'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1e2353] w-full max-w-2xl rounded-3xl border border-[#5865f2]/40 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#5865f2]/20 bg-[#0a0d3a] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#5865f2]" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search chats, products, AI commands, UI elements..."
            className="w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none font-bold"
            autoFocus
          />
          <kbd className="bg-[#1e2353] text-[10px] font-mono px-2 py-1 rounded border border-[#5865f2]/30 text-gray-300">ESC</kbd>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0d3a]/80 border-b border-[#5865f2]/20 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelectedIndex(0); }}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#5865f2] text-white shadow-md'
                  : 'bg-[#1e2353] text-gray-300 hover:text-white border border-[#5865f2]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {allResults.length === 0 ? (
            <div className="p-8 text-center text-gray-300 text-xs">
              No results found for "{query}" under <span className="text-[#35ed7e] font-bold">{activeCategory}</span>.
            </div>
          ) : (
            allResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected ? 'bg-[#5865f2] text-white shadow-lg' : 'bg-[#0a0d3a]/40 text-gray-200 hover:bg-[#0a0d3a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#35ed7e] block">{item.category}</span>
                      <h5 className="text-xs font-black text-white leading-tight font-heading">{item.title}</h5>
                      <p className="text-[11px] text-gray-300 line-clamp-1">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#35ed7e]" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-[#5865f2]/20 bg-[#0a0d3a] text-[11px] text-gray-300 flex items-center justify-between font-medium">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-[#1e2353] px-1.5 py-0.5 rounded text-[10px] border border-[#5865f2]/30">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-[#1e2353] px-1.5 py-0.5 rounded text-[10px] border border-[#5865f2]/30">↵</kbd> Select</span>
          </div>
          <span className="font-mono text-[#5865f2] font-bold">PingX Multi-Category Search</span>
        </div>

      </div>
    </div>
  );
}
