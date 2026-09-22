import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Lock, CheckCircle } from 'lucide-react';

const MERCHANTS = [
  { name: 'Amazon', domain: 'amazon.in', badge: 'Live API' },
  { name: 'Flipkart', domain: 'flipkart.com', badge: 'Verified' },
  { name: 'Myntra', domain: 'myntra.com', badge: 'Fashion' },
  { name: 'Croma', domain: 'croma.com', badge: 'Electronics' },
  { name: 'Tata CLiQ', domain: 'tatacliq.com', badge: 'Luxury' },
  { name: 'Sony India', domain: 'sony.co.in', badge: 'Direct' },
  { name: 'Apple Store', domain: 'apple.com/in', badge: 'Official' },
  { name: 'Samsung', domain: 'samsung.com/in', badge: 'Official' },
];

export function StoreMarquee() {
  return (
    <section className="relative z-10 bg-[#fcfbfe] border-y border-[#e6e2f8] py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        
        {/* Top Header / Subtitle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#e6e2f8]/70 pb-4">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Verified Real-Time Comparison Across India's Top Stores</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#7256c3]" /> 100% Direct Store Links
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#7256c3]" /> Zero Markup
            </span>
          </div>
        </div>

        {/* Merchant Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {MERCHANTS.map((store, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-3 border border-[#e6e2f8] shadow-xs hover:border-[#7256c3]/40 hover:shadow-md transition-all text-center group cursor-default"
            >
              <div className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-[#7256c3] transition-colors">
                {store.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {store.domain}
              </div>
              <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#f5f3ff] text-[#7256c3]">
                {store.badge}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Guarantees Bar (Matching ThemeHunk & ShopEase) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#e6e2f8]">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-[#7256c3] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Verified Retailer APIs</div>
              <div className="text-[11px] text-slate-500">Official real-time price feeds</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#e6e2f8]">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-[#7256c3] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Instant Price Drop Pings</div>
              <div className="text-[11px] text-slate-500">Alerts when prices drop</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#e6e2f8]">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-[#7256c3] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">End-to-End Encrypted</div>
              <div className="text-[11px] text-slate-500">Zero data selling or ads</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#e6e2f8]">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-[#7256c3] flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">2-Bullet AI Insights</div>
              <div className="text-[11px] text-slate-500">Concise facts in seconds</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default StoreMarquee;
