import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Search, ShoppingBag, ArrowRight, ShieldCheck, Zap, TrendingDown, ExternalLink } from 'lucide-react';

export function HowItWorks({ onEnterApp }) {
  const steps = [
    {
      step: '01',
      badge: 'Real-Time Messaging',
      title: 'Chat & Connect Privately',
      description: 'Chat with friends and communities in real-time. Share product discoveries, voice notes, and group recommendations with end-to-end privacy.',
      icon: MessageSquare,
      accentColor: '#7256c3',
      bgGradient: 'from-violet-500/10 to-indigo-500/5',
      preview: (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-left">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-100 text-[#7256c3] flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">Alex Rivera</p>
              <span className="text-[10px] text-emerald-600 font-semibold">● Active in PingX Chat</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-violet-50/70 border border-violet-100 text-xs text-slate-800 leading-snug">
            "Looking for the iPhone 16 Pro Natural Titanium. Anyone know the lowest price today?"
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Encrypted • 10:14 AM</span>
            <span className="text-[#7256c3] font-bold">✓✓ Read</span>
          </div>
        </div>
      )
    },
    {
      step: '02',
      badge: 'Automated Price Scanner',
      title: 'PingX Scans 4+ Stores Live',
      description: 'Whenever a product is mentioned, shared, or searched, PingX instantly scans Amazon, Flipkart, Croma, and Myntra to extract live merchant pricing.',
      icon: Search,
      accentColor: '#6366f1',
      bgGradient: 'from-indigo-500/10 to-blue-500/5',
      preview: (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="text-[11px] font-extrabold text-slate-900">Live Retailer Scan</span>
            <span className="text-[10px] font-bold text-[#7256c3] bg-violet-50 px-2 py-0.5 rounded-full">
              4 Stores Synced
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Croma
              </span>
              <span className="font-extrabold text-emerald-700">₹1,14,900 (Lowest ✓)</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
              <span>Flipkart</span>
              <span>₹1,16,900</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
              <span>Amazon.in</span>
              <span>₹1,19,900</span>
            </div>
          </div>
        </div>
      )
    },
    {
      step: '03',
      badge: 'Direct Deep-Links',
      title: 'Buy at Lowest Price & Save',
      description: 'Click Buy to go directly to the verified merchant product page. No intermediary markups, no search result redirects—just direct savings.',
      icon: ShoppingBag,
      accentColor: '#059669',
      bgGradient: 'from-emerald-500/10 to-teal-500/5',
      preview: (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 text-left">
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=120&q=80"
              alt="iPhone 16 Pro"
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">iPhone 16 Pro (128GB)</p>
              <p className="text-[10px] text-emerald-600 font-extrabold">Instant Savings: ₹5,000</p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block">Lowest on Croma</span>
              <span className="text-xs font-black text-slate-900">₹1,14,900</span>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-2xs flex items-center gap-1">
              Buy Now <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-[#fcfbfe] border-b border-[#e6e2f8] relative z-10 overflow-hidden">
      {/* Background Subtle Ambient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#7256c3]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#6366f1]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-violet-100 text-[#7256c3] border border-violet-200 shadow-xs">
            <Zap className="w-3.5 h-3.5" />
            <span>How PingX Works in 3 Simple Steps</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            Chat with friends. We find the lowest price. You save money.
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            PingX is not an online store. It is your <strong>all-in-one social messenger and smart comparison engine</strong> that checks India's top retailers live so you never overpay.
          </p>
        </div>

        {/* 3 Step Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e6e2f8] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                {/* Header Row: Step Number & Badge */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-heading text-slate-200 group-hover:text-[#7256c3]/30 transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 text-[#7256c3] flex items-center justify-center font-bold shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight pt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Interactive Simulated Preview */}
                <div className="pt-2">
                  {item.preview}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white border border-[#e6e2f8] shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7256c3]" />
            <span>100% Free to Use • Zero Hidden Fees • Direct Merchant Checkout</span>
          </div>
          <button
            onClick={() => onEnterApp ? onEnterApp('shop') : null}
            className="text-[#7256c3] font-bold hover:text-[#5f44a8] inline-flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <span>See Live Deal Scanner in Action</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
