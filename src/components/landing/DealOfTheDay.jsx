import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, ShieldCheck, ArrowRight, Star, TrendingDown, Bell } from 'lucide-react';

export function DealOfTheDay({ onEnterApp }) {
  // Countdown Timer State (e.g., 8 hours remaining)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 34,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n) => String(n).padStart(2, '0');

  return (
    <section className="py-20 md:py-24 bg-[#f8f7ff] border-y border-[#e6e2f8] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Context Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-violet-100 text-[#7256c3] border border-violet-200 shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>Real-Time Deal Scanner Demonstration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            How PingX Compares Live Retailers for You
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Instead of opening 4 browser tabs, PingX continuously scans Amazon, Flipkart, Croma, and Reliance Digital so you always get the lowest verified price.
          </p>
        </div>

        {/* Deal of the Day Comparison Card */}
        <div className="bg-white rounded-3xl border border-[#e6e2f8] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Deal Information & Countdown */}
          <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold uppercase tracking-wide shadow-xs">
                <span>⚡ LOWEST PRICE DETECTED ON FLIPKART</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
                Sony WH-1000XM5 Wireless ANC Headphones
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Industry-leading noise cancellation and 30-hour battery. PingX scanned 4 retailers live and found Flipkart is currently ₹2,000 cheaper than Croma.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">4.9 / 5.0 (3,420 verified buyer ratings)</span>
              </div>
            </div>

            {/* Countdown Timer Boxes (Matching ShopEase) */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Offer Expires In:
              </span>
              <div className="flex items-center gap-3">
                <div className="bg-[#f8f7ff] border border-[#e6e2f8] rounded-2xl px-4 py-2.5 text-center min-w-[70px]">
                  <span className="text-2xl font-black font-mono text-[#7256c3] block leading-none">
                    {formatNum(timeLeft.hours)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Hours</span>
                </div>
                <span className="text-xl font-black text-slate-400">:</span>
                <div className="bg-[#f8f7ff] border border-[#e6e2f8] rounded-2xl px-4 py-2.5 text-center min-w-[70px]">
                  <span className="text-2xl font-black font-mono text-[#7256c3] block leading-none">
                    {formatNum(timeLeft.minutes)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Mins</span>
                </div>
                <span className="text-xl font-black text-slate-400">:</span>
                <div className="bg-[#f8f7ff] border border-[#e6e2f8] rounded-2xl px-4 py-2.5 text-center min-w-[70px]">
                  <span className="text-2xl font-black font-mono text-[#7256c3] block leading-none">
                    {formatNum(timeLeft.seconds)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Secs</span>
                </div>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-heading text-slate-900">₹26,990</span>
                  <span className="text-base text-slate-400 line-through">₹28,990</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 block">
                  Lowest Price on Flipkart (Save ₹2,000)
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onEnterApp}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-[#7256c3] hover:bg-[#6348b6] shadow-lg shadow-[#7256c3]/25 transition-all cursor-pointer"
              >
                <span>Claim Verified Deal</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Right Column: Studio Pedestal Showcase & Store Price Matrix */}
          <div className="md:col-span-6 bg-[#fcfbfe] border-t md:border-t-0 md:border-l border-[#e6e2f8] p-8 sm:p-12 flex flex-col justify-between space-y-6">
            
            {/* Studio Pedestal Product Photography */}
            <div className="relative rounded-3xl bg-white border border-[#e6e2f8] p-6 shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Sony WH-1000XM5 Studio Pedestal"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Deal Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#7256c3] text-white shadow-sm flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Save ₹2,000 Today
                </span>
              </div>

              {/* Stock Urgency Pill */}
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  ⚡ Only 4 units left in stock
                </span>
              </div>
            </div>

            {/* Live Store Price Matrix */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Live Retailer Comparison:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 rounded-2xl bg-white border-2 border-[#7256c3] shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500">Flipkart</div>
                  <div className="text-sm font-extrabold text-[#7256c3]">₹26,990</div>
                  <span className="text-[9px] font-black text-emerald-600 uppercase">Lowest</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500">Amazon</div>
                  <div className="text-sm font-bold text-slate-800">₹27,490</div>
                  <span className="text-[9px] text-slate-400 uppercase">+₹500</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500">Croma</div>
                  <div className="text-sm font-bold text-slate-800">₹28,990</div>
                  <span className="text-[9px] text-slate-400 uppercase">+₹2,000</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500">Reliance</div>
                  <div className="text-sm font-bold text-slate-800">₹29,990</div>
                  <span className="text-[9px] text-slate-400 uppercase">+₹3,000</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default DealOfTheDay;
