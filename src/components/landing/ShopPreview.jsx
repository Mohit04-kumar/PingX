import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ExternalLink, Star, ArrowRight, Tag, TrendingDown, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['All Deals', 'Audio', 'Smartphones', 'Laptops', 'Wearables', 'Footwear'];

const FEATURED_DEALS = [
  {
    id: 'sony-ch720n',
    title: 'Sony WH-CH720N Wireless ANC',
    category: 'Audio',
    badge: 'Over-Ear Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    discount: '47% OFF',
    rating: '4.6',
    reviews: '1,420',
    currentPrice: '₹7,990',
    originalPrice: '₹14,990',
    store: 'Amazon (Lowest)',
    otherStores: 'Flipkart: ₹8,499 • Croma: ₹9,990',
  },
  {
    id: 'iphone-16',
    title: 'Apple iPhone 16 (128GB)',
    category: 'Smartphones',
    badge: 'Flagship Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
    discount: 'Save ₹7,000',
    rating: '4.8',
    reviews: '3,850',
    currentPrice: '₹72,900',
    originalPrice: '₹79,900',
    store: 'Flipkart (Lowest)',
    otherStores: 'Amazon: ₹74,900 • Croma: ₹76,900',
  },
  {
    id: 'macbook-air-m3',
    title: 'Apple MacBook Air 13" (M3 Chip)',
    category: 'Laptops',
    badge: 'Ultra-thin Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
    discount: 'Save ₹10,000',
    rating: '4.9',
    reviews: '980',
    currentPrice: '₹1,04,900',
    originalPrice: '₹1,14,900',
    store: 'Flipkart (Lowest)',
    otherStores: 'Amazon: ₹1,08,900 • Croma: ₹1,12,900',
  },
  {
    id: 'nike-air-max',
    title: 'Nike Air Max Impact 4 Basketball',
    category: 'Footwear',
    badge: 'Athletic Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
    discount: '38% OFF',
    rating: '4.8',
    reviews: '2,100',
    currentPrice: '₹4,299',
    originalPrice: '₹6,995',
    store: 'Myntra (Lowest)',
    otherStores: 'Flipkart: ₹4,899 • Nike: ₹5,995',
  },
  {
    id: 'apple-watch-se',
    title: 'Apple Watch SE GPS (44mm)',
    category: 'Wearables',
    badge: 'Smart Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
    discount: '17% OFF',
    rating: '4.7',
    reviews: '1,750',
    currentPrice: '₹24,900',
    originalPrice: '₹29,900',
    store: 'Croma (Lowest)',
    otherStores: 'Amazon: ₹25,490 • Flipkart: ₹25,990',
  },
  {
    id: 'oneplus-buds-3',
    title: 'OnePlus Buds 3 Hi-Res ANC',
    category: 'Audio',
    badge: 'True Wireless',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80',
    discount: '25% OFF',
    rating: '4.5',
    reviews: '1,120',
    currentPrice: '₹4,499',
    originalPrice: '₹5,999',
    store: 'Amazon (Lowest)',
    otherStores: 'Flipkart: ₹4,799 • Croma: ₹4,999',
  },
];

export function ShopPreview({ onEnterApp }) {
  const [selectedCategory, setSelectedCategory] = useState('All Deals');

  const filteredDeals = selectedCategory === 'All Deals'
    ? FEATURED_DEALS
    : FEATURED_DEALS.filter((deal) => deal.category === selectedCategory);

  return (
    <section id="smart-shop" className="py-20 lg:py-24 relative z-10 bg-white border-t border-[#e6e2f8] overflow-hidden scroll-mt-24">
      {/* Soft Violet Radial Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#7256c3]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-[#7256c3] border border-violet-200 text-xs font-extrabold uppercase tracking-wide shadow-xs">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>MULTI-STORE PRICE SCANNER</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
              Compare Verified Deals Across <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7256c3] via-[#6366f1] to-[#4f46e5]">
                India's Top E-Commerce Stores.
              </span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Direct store checkouts with verified merchant protection. Track price histories and discount drops without switching between multiple apps.
            </p>
          </div>

          {/* Action button leading into app shop */}
          <button
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#7256c3] hover:bg-[#5f45af] text-white font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer self-start md:self-end shrink-0 group hover:-translate-y-0.5"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#7256c3] text-white shadow-md shadow-[#7256c3]/20 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-[#7256c3] border border-transparent hover:border-violet-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl p-5 border border-[#e6e2f8] shadow-sm hover:shadow-xl hover:border-[#7256c3]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Product Image & Studio Pedestal */}
                <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 flex items-center justify-center">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Floating Discount Tag */}
                  <span className="absolute top-3 right-3 bg-[#7256c3] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> {deal.discount}
                  </span>

                  {/* Category Pill */}
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-slate-200">
                    {deal.badge}
                  </span>
                </div>

                {/* Title & Reviews */}
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-base font-bold text-slate-900 line-clamp-1 font-heading group-hover:text-[#7256c3] transition-colors">
                    {deal.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{deal.rating}</span>
                    <span className="text-slate-400">({deal.reviews} reviews)</span>
                  </div>
                </div>

                {/* Price & Struck-Through MSRP */}
                <div className="flex items-baseline justify-between pt-3">
                  <span className="text-2xl font-extrabold text-[#7256c3] font-mono">{deal.currentPrice}</span>
                  <span className="text-xs text-slate-400 line-through font-mono">{deal.originalPrice}</span>
                </div>

                {/* Lowest Store Pill & Compare Button */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 truncate max-w-[150px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {deal.store}
                  </span>
                  <button
                    onClick={onEnterApp}
                    className="text-[#7256c3] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    Compare <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Other Retailers Subtext */}
                <div className="text-[10px] text-slate-400 font-medium truncate pt-1.5">
                  {deal.otherStores}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="pt-6 border-t border-[#e6e2f8] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7256c3]" />
            <span>Prices updated live every 15 minutes across verified retailers</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Retailers:</span>
            <span className="font-bold text-slate-700">Amazon • Flipkart • Croma • Myntra • Reliance Digital</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ShopPreview;
