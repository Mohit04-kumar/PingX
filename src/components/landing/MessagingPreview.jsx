import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, CheckCheck, Smile, Paperclip, Play, Pause, Mic, Lock, Calendar, Sparkles } from 'lucide-react';

export function MessagingPreview({ onEnterApp }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <section id="messaging" className="py-20 relative z-10 bg-white border-t border-[#e6e2f8] overflow-hidden scroll-mt-24">
      
      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#7256c3]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Visual Storytelling with Real Photo Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* High-Contrast Section Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-[#7256c3] border border-violet-200 text-xs font-extrabold uppercase tracking-wide shadow-xs">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>REAL-TIME SOCIAL MESSAGING</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
              Real-Time Messaging with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7256c3] via-[#6366f1] to-[#4f46e5]">
                Voice Notes & Instant Deals.
              </span>
            </h2>

            {/* Real Lifestyle Photo Card (Direct Visual Proof) */}
            <div className="relative rounded-3xl overflow-hidden border border-[#e6e2f8] shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&auto=format&fit=crop&q=80"
                alt="Friends messaging and connecting on PingX"
                className="w-full h-52 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/85 via-[#1e1b4b]/20 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-wide">1,240 Friends Connected Now</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    Live Stream
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 mt-1 font-medium">
                  Lossless audio streams, live typing indicators, and encrypted group pings.
                </p>
              </div>
            </div>

            {/* Visual Feature Badges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-100 text-[#7256c3] flex items-center justify-center font-bold text-xs shrink-0">
                  🎙️
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">Voice Notes</div>
                  <div className="text-[10px] text-slate-500 truncate">Equalizer waveform</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-100 text-[#7256c3] flex items-center justify-center font-bold text-xs shrink-0">
                  ⚡
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">Auto Reminders</div>
                  <div className="text-[10px] text-slate-500 truncate">Smart calendar sync</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Interactive Chat Window Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#e6e2f8] shadow-xl space-y-4 relative overflow-hidden"
            style={{ boxShadow: '0 20px 40px -10px rgba(114, 86, 195, 0.1)' }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                    alt="Rahul"
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-heading">Rahul Verma</h4>
                  <span className="text-xs text-[#7256c3] flex items-center gap-1.5 font-semibold">
                    ● Typing message...
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-700 bg-[#f8f7ff] px-3 py-1 rounded-full border border-[#e6e2f8] font-mono inline-flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#7256c3]" /> End-to-End Encrypted
              </span>
            </div>

            {/* Messages Feed */}
            <div className="space-y-3 py-1 text-xs">
              {/* Message 1: Incoming with Sneaker Product Deal Image */}
              <div className="bg-slate-50 p-3 rounded-2xl max-w-[88%] border border-slate-200 text-slate-800 shadow-xs space-y-2">
                <div className="rounded-xl overflow-hidden h-32 bg-white border border-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
                    alt="Nike Sneaker"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-[#7256c3] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    38% OFF on Myntra
                  </span>
                </div>
                <p className="leading-relaxed">
                  Hey Priyanjali! Have you seen this sneaker deal? PingX scanner just notified me it dropped to ₹4,299 🔥
                </p>
                <span className="block text-[10px] text-slate-400 text-right">10:30 AM</span>
              </div>

              {/* Message 2: Voice Note Player */}
              <div className="bg-[#f8f7ff] p-3 rounded-2xl max-w-[85%] border border-[#e6e2f8] text-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-9 h-9 rounded-xl bg-[#7256c3] text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform shrink-0"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#7256c3] font-bold">
                      <span>Voice Note (0:14)</span>
                      <span>10:31 AM</span>
                    </div>
                    {/* Audio Waveform Simulator */}
                    <div className="flex items-center gap-1 h-4">
                      {[10, 22, 14, 28, 18, 12, 26, 16, 20, 8, 24, 14, 18].map((h, i) => (
                        <span
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            isPlayingAudio ? 'bg-[#7256c3]' : 'bg-slate-300'
                          }`}
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message 3: Outgoing Message */}
              <div className="bg-[#7256c3] p-3 rounded-2xl max-w-[85%] ml-auto text-white shadow-xs">
                Yes! That's an unbelievable price. Grabbing one right now before it sells out 🚀
                <span className="flex items-center justify-end gap-1 text-[10px] text-violet-200 mt-1">
                  10:32 AM <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />
                </span>
              </div>

              {/* Message 4: Auto Event Detection Card */}
              <div className="bg-slate-50 p-3 rounded-2xl max-w-[88%] border border-slate-200 text-slate-800 shadow-xs">
                Let's meet tomorrow at 6 PM near the main cafeteria to check them out!
                
                {/* Event Schedule Chip */}
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-[#7256c3] font-semibold">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-[#7256c3]" /> Detected: Meeting Tomorrow, 6:00 PM
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-violet-100 text-[#7256c3] font-bold text-[10px]">
                    Synced
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Quick Reply Chips */}
            <div className="flex items-center gap-2 pt-1 text-[11px] overflow-x-auto">
              <span className="font-bold flex items-center gap-1 shrink-0 text-[#7256c3]">
                Quick Reply:
              </span>
              <button onClick={onEnterApp} className="bg-[#f8f7ff] text-[#7256c3] px-3 py-1 rounded-full border border-[#e6e2f8] hover:bg-violet-100 whitespace-nowrap cursor-pointer font-semibold">
                Sure, see you tomorrow at 6 PM!
              </button>
              <button onClick={onEnterApp} className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-100 whitespace-nowrap cursor-pointer font-medium">
                Reschedule to 7 PM?
              </button>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-slate-400">
                <Smile className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                <span>Type a message...</span>
                <Mic className="w-4 h-4 text-slate-400 ml-auto cursor-pointer hover:text-[#7256c3]" />
                <Paperclip className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
              <button onClick={onEnterApp} className="w-10 h-10 rounded-2xl bg-[#7256c3] hover:bg-[#6348b6] flex items-center justify-center text-white cursor-pointer shadow-md">
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default MessagingPreview;
