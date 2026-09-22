import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ExternalLink, Star, ArrowRight, Tag, TrendingDown } from 'lucide-react';

const FEATURED_DEALS = [
  {
    id: 'sony-ch720n',
    title: 'Sony WH-CH720N Wireless ANC',
    category: 'Over-Ear Headphones',
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
    id: 'nike-air-max',
    title: 'Nike Air Max Impact 4 Basketball',
    category: 'Athletic Footwear',
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
    id: 'macbook-air-m3',
    title: 'Apple MacBook Air 13" (M3 Chip)',
    category: 'Ultra-thin Laptop',
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
    id: 'apple-watch-se',
    title: 'Apple Watch SE GPS (44mm)',
    category: 'Smart Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
    discount: '17% OFF',
    rating: '4.7',
    reviews: '1,750',
    currentPrice: '₹24,900',
    originalPrice: '₹29,900',
    store: 'Croma (Lowest)',
    otherStores: 'Amazon: ₹25,490 • Flipkart: ₹25,990',
  },
];

export function ShopPreview({ onEnterApp }) {
  return (
    <section id="smart-shop" className="py-20 lg:py-24 relative z-10 bg-white border-t border-[#e6e2f8] overflow-hidden scroll-mt-24">
      
      {/* Soft Violet Radial Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#7256c3]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1b4b] text-white text-xs font-extrabold uppercase tracking-wide shadow-xs">
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnterApp}
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm bg-[#7256c3] hover:bg-[#6348b6] shadow-md shadow-[#7256c3]/20 transition-all cursor-pointer"
          >
            <span>Explore All 10,000+ Deals</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* 4-Column High-Clarity Product Cards Grid (Matching ShopEase & Astra References) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_DEALS.map((deal, idx) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6e2f8] shadow-md hover:shadow-xl hover:border-[#7256c3]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Product Image & Studio Pedestal */}
              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 flex items-center justify-center">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Discount Tag */}
                <span className="absolute top-3 right-3 bg-[#7256c3] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> {deal.discount}
                </span>

                {/* Category Pill */}
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                  {deal.category}
                </span>
              </div>

              {/* Title & Reviews */}
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1 font-heading group-hover:text-[#7256c3] transition-colors">
                  {deal.title}
                </h4>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {deal.rating} ({deal.reviews} reviews)
                </div>
              </div>

              {/* Price & Struck-Through MSRP */}
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-xl font-extrabold text-[#7256c3] font-mono">{deal.currentPrice}</span>
                <span className="text-xs text-slate-400 line-through font-mono">{deal.originalPrice}</span>
              </div>

              {/* Store Pill & Compare Button */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[#7256c3] font-bold flex items-center gap-1 truncate max-w-[130px]">
                  <Tag className="w-3 h-3 text-[#7256c3] shrink-0" /> {deal.store}
                </span>
                <button
                  onClick={onEnterApp}
                  className="text-[#7256c3] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Compare <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Other Retailers Subtext */}
              <div className="text-[10px] text-slate-400 font-medium truncate pt-1">
                {deal.otherStores}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ShopPreview;
