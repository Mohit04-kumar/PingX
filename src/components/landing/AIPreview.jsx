import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, CheckCircle2, ArrowRight, Zap, Check, Tag } from 'lucide-react';

export function AIPreview({ onEnterApp }) {
  const [activePrompt, setActivePrompt] = useState('summary');

  return (
    <section id="ai-assistant" className="py-20 relative z-10 bg-[#f8f7ff] border-y border-[#e6e2f8] overflow-hidden scroll-mt-24">
      
      {/* Soft Lavender Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#7256c3]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Smart Assistant Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="order-2 lg:order-1 bg-white rounded-3xl p-6 border border-[#e6e2f8] shadow-2xl space-y-5 relative overflow-hidden"
            style={{ boxShadow: '0 20px 45px -10px rgba(114, 86, 195, 0.12)' }}
          >
            
            {/* Header */}
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

            {/* Conversational Output Display */}
            <div className="p-4 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] space-y-3 text-xs">
              {activePrompt === 'summary' ? (
                <>
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span className="font-bold text-slate-900">Chat Recap • Product Planning Session</span>
                    <span className="text-[10px] text-slate-400">10:45 AM</span>
                  </div>
                  <div className="space-y-2 text-slate-700 leading-relaxed font-normal">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                      <p><strong>Approved Milestone:</strong> The frontend royal purple redesign is locked for review.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                      <p><strong>Action Item:</strong> Meeting confirmed at 6:00 PM near the main cafeteria with Rahul and team.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span className="font-bold text-slate-900">Store Scan • Sony WH-1000XM5</span>
                    <span className="text-[10px] text-slate-400">Live API</span>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#e6e2f8]">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80"
                      alt="Sony Headphones"
                      className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">Sony WH-1000XM5 ANC</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#7256c3] text-white shrink-0">
                          Save ₹2,000
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Flipkart: <strong className="text-[#7256c3]">₹26,990</strong> <span className="line-through text-slate-400">₹28,990</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-slate-700 leading-relaxed font-normal">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                      <p>Includes ₹2,000 instant bank discount • 4 units left with guaranteed free delivery by Friday.</p>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-[#e6e2f8] flex items-center justify-between text-[11px] text-[#7256c3] font-semibold">
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> One-click copy ready</span>
                <button onClick={onEnterApp} className="text-[#7256c3] hover:underline font-bold cursor-pointer">
                  Insert into Chat →
                </button>
              </div>
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

          {/* Text Description Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="order-1 lg:order-2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1b4b] text-white text-xs font-extrabold uppercase tracking-wide shadow-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Search & Facts</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
              Get Straight to the Answer<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7256c3] via-[#6366f1] to-[#4f46e5]">
                Without the Fluff.
              </span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              Need quick information while in the middle of a chat? The PingX Assistant gives you 2-bullet concise facts, extracts action dates, and checks real-time price trends directly inside your workflow.
            </p>

            <div className="space-y-3.5 text-sm text-slate-700 font-medium">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#f5f3ff] text-[#7256c3] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <strong className="text-slate-900">Zero Lengthy Babble:</strong> Short, scannable explanations tailored for quick decisions.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#f5f3ff] text-[#7256c3] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <strong className="text-slate-900">Contextual Chat Recaps:</strong> Missed a long conversation? Generate a bullet summary in one tap.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#f5f3ff] text-[#7256c3] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <strong className="text-slate-900">Deal Verification:</strong> Check price histories and discount validity before completing any purchase.
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-[#7256c3] hover:bg-[#6348b6] shadow-lg shadow-[#7256c3]/20 transition-all cursor-pointer"
            >
              <span>Try Smart Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default AIPreview;
