import React from 'react';
import { motion } from 'motion/react';
import { Headphones, Smartphone, Laptop, Tag, Watch, ArrowRight, TrendingDown } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'audio',
    title: 'Wireless Audio & ANC',
    subtitle: 'Sony, Bose, Sennheiser, JBL',
    badge: 'Save Up to 47%',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    icon: Headphones,
    stores: 'Amazon • Flipkart • Croma',
  },
  {
    id: 'phones',
    title: 'Smartphones & Flagships',
    subtitle: 'iPhone 16, Galaxy S24, OnePlus',
    badge: 'Save Up to 28%',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    icon: Smartphone,
    stores: 'Flipkart • Amazon • Samsung',
  },
  {
    id: 'laptops',
    title: 'Laptops & Workstations',
    subtitle: 'MacBook Air, Dell XPS, ThinkPad',
    badge: 'Save Up to ₹15,000',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    icon: Laptop,
    stores: 'Croma • Amazon • Reliance',
  },
  {
    id: 'fashion',
    title: 'Sneakers & Streetwear',
    subtitle: 'Nike, Adidas, Puma, New Balance',
    badge: 'Save Up to 38%',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    icon: Tag,
    stores: 'Myntra • Flipkart • Tata CLiQ',
  },
  {
    id: 'wearables',
    title: 'Smartwatches & Fitness',
    subtitle: 'Apple Watch, Galaxy Watch, Noise',
    badge: 'Save Up to 50%',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    icon: Watch,
    stores: 'Amazon • Croma • Myntra',
  },
];

export function CategoryShowcase({ onEnterApp }) {
  return (
    <section id="features" className="py-20 lg:py-24 bg-white relative z-10 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1b4b] text-white text-xs font-extrabold uppercase tracking-wide shadow-xs">
              <span>SHOP BY CATEGORY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-slate-900 leading-tight">
              Compare Prices by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7256c3] via-[#6366f1] to-[#4f46e5]">Product Category.</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Skip opening 15 different browser tabs. PingX aggregates verified live prices and stock availability across major Indian retailers in one unified view.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnterApp}
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm bg-[#7256c3] hover:bg-[#6348b6] shadow-md shadow-[#7256c3]/20 transition-all cursor-pointer"
          >
            <span>Browse All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* 5-Column Clean Category Grid (Matching ThemeHunk & ShopEase) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                onClick={onEnterApp}
                className="bg-[#fcfbfe] rounded-3xl p-4 border border-[#e6e2f8] shadow-xs hover:shadow-xl hover:border-[#7256c3]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Image Container with Studio Pedestal Aesthetics */}
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-white border border-slate-100 relative mb-4">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Discount Pill Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#7256c3] text-white shadow-xs">
                      {cat.badge}
                    </span>
                  </div>
                </div>

                {/* Category Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#7256c3] font-bold">
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="truncate">{cat.stores}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-[#7256c3] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 mt-3 border-t border-[#e6e2f8]/70 flex items-center justify-between text-xs font-bold text-[#7256c3]">
                  <span>Explore Offers</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default CategoryShowcase;
