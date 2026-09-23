import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, CheckCircle2, Zap, Check, Tag } from 'lucide-react';

export function AIPreview({ onEnterApp }) {
  const [activePrompt, setActivePrompt] = useState('summary');

  return (
    <section id="ai-assistant" className="py-20 relative z-10 bg-[#f8f7ff] border-y border-[#e6e2f8] overflow-hidden scroll-mt-24">
      
      {/* Soft Lavender Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#7256c3]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Smart Assistant Live Demonstration Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#e6e2f8] shadow-2xl space-y-5 relative overflow-hidden"
            style={{ boxShadow: '0 20px 45px -10px rgba(114, 86, 195, 0.12)' }}
          >
            
            {/* Assistant Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                    alt="Assistant Lead"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-heading text-slate-900 flex items-center gap-1.5">
                    PingX Smart Assistant
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">Real-Time Search & Deal Insights</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-[#7256c3] border border-violet-200 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-[#7256c3]" />
                <span>Instant Mode</span>
              </div>
            </div>

            {/* Prompt Quick Actions Pills */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActivePrompt('summary')}
                className={`p-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer border ${
                  activePrompt === 'summary'
                    ? 'bg-[#f5f3ff] border-[#7256c3] text-[#7256c3] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-[#7256c3]" /> Summarize Discussion
              </button>
              
              <button
                type="button"
                onClick={() => setActivePrompt('price')}
                className={`p-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer border ${
                  activePrompt === 'price'
                    ? 'bg-[#f5f3ff] border-[#7256c3] text-[#7256c3] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Tag className="w-4 h-4 text-[#7256c3]" /> Find Lowest Store Price
              </button>
            </div>

            {/* Output Result Card with Product Image */}
            <div className="p-4 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] space-y-3 text-xs">
              {activePrompt === 'summary' ? (
                <>
                  <div className="flex items-center justify-between text-[11px] border-b border-[#e6e2f8] pb-2 font-mono">
                    <span className="font-bold text-slate-900">Chat Recap • Product Planning Session</span>
                    <span className="text-slate-400">10:45 AM</span>
                  </div>
                  <ul className="space-y-2 text-slate-700 leading-relaxed font-normal">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                      <span><strong>Approved Milestone:</strong> The frontend royal purple redesign is locked for review.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                      <span><strong>Action Item:</strong> Meeting confirmed at 6:00 PM near the main cafeteria with Rahul and team.</span>
                    </li>
                  </ul>
                  <div className="pt-2 border-t border-[#e6e2f8] flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> One-click copy ready
                    </span>
                    <span className="font-bold text-[#7256c3] hover:underline cursor-pointer">
                      Insert into Chat →
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-[11px] border-b border-[#e6e2f8] pb-2 font-mono">
                    <span className="font-bold text-slate-900">Store Scan • Sony WH-1000XM5</span>
                    <span className="text-[10px] text-slate-400">Live API</span>
                  </div>

                  {/* Product Image Deal Snapshot */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#e6e2f8]">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80"
                      alt="Sony Headphones"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">Sony WH-1000XM5 ANC</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#7256c3] text-white shrink-0">
                          Save ₹2,000
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Flipkart: <strong className="text-[#7256c3]">₹26,990</strong> <span className="line-through text-slate-400">₹28,990</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-700 leading-relaxed font-normal">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                      <p>Includes ₹2,000 instant bank discount • 4 units left with guaranteed free delivery by Friday.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Interactive Prompt Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                readOnly
                value="Find verified student discounts on iPad Air..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-700 outline-none"
              />
              <button onClick={onEnterApp} className="px-5 py-3 rounded-2xl bg-[#7256c3] hover:bg-[#6348b6] text-white font-bold text-xs cursor-pointer shadow-md transition-all">
                Search
              </button>
            </div>

          </motion.div>

          {/* Right Column: Visual Storytelling with Real Photo Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* High-Contrast Section Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-[#7256c3] border border-violet-200 text-xs font-extrabold uppercase tracking-wide shadow-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>SMART SEARCH & FACTS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
              Get Straight to the Answer<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7256c3] via-[#6366f1] to-[#4f46e5]">
                Without the Fluff.
              </span>
            </h2>

            {/* Real Lifestyle Photo Card (Direct Visual Proof) */}
            <div className="relative rounded-3xl overflow-hidden border border-[#e6e2f8] shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&auto=format&fit=crop&q=80"
                alt="Student getting instant answers on laptop"
                className="w-full h-52 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/85 via-[#1e1b4b]/20 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center justify-between text-white">
                  <span className="text-xs font-bold tracking-wide">2-Bullet Summaries & Deal Verifications</span>
                  <span className="text-[10px] font-mono font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    Instant Facts
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 mt-1 font-medium">
                  Zero lengthy paragraphs. Quick, verified factual insights while chatting or shopping.
                </p>
              </div>
            </div>

            {/* Visual Value Props */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-white border border-[#e6e2f8] text-center shadow-xs">
                <div className="text-lg mb-0.5">⚡</div>
                <div className="text-xs font-bold text-slate-900">2-Bullet Facts</div>
                <div className="text-[10px] text-slate-400">Zero babble</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#e6e2f8] text-center shadow-xs">
                <div className="text-lg mb-0.5">📝</div>
                <div className="text-xs font-bold text-slate-900">Chat Recaps</div>
                <div className="text-[10px] text-slate-400">1-tap summaries</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#e6e2f8] text-center shadow-xs">
                <div className="text-lg mb-0.5">🏷️</div>
                <div className="text-xs font-bold text-slate-900">Price Drops</div>
                <div className="text-[10px] text-slate-400">Store checks</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default AIPreview;
