import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, CheckCheck, Smile, Paperclip, Play, Pause, Mic, ArrowRight, Lock, Calendar } from 'lucide-react';

export function MessagingPreview({ onEnterApp }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <section id="messaging" className="py-20 relative z-10 bg-white border-t border-[#e6e2f8] overflow-hidden scroll-mt-24">
      
      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#7256c3]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1b4b] text-white text-xs font-extrabold uppercase tracking-wide shadow-xs">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Real-Time Social Hub</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
              Real-Time Messaging with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7256c3] via-[#6366f1] to-[#4f46e5]">
                Voice Notes & Event Detection.
              </span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              Ultra-fast 1-on-1 and Group chats equipped with live typing status, verified read receipts, audio note visualizers, and automatic schedule detection.
            </p>

            <ul className="space-y-3.5 text-sm text-slate-700 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#f5f3ff] text-[#7256c3] flex items-center justify-center text-xs font-extrabold">✓</div>
                <span>One-click suggested replies with quick touch insertion</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#f5f3ff] text-[#7256c3] flex items-center justify-center text-xs font-extrabold">✓</div>
                <span>Auto-detect meeting times and add quick reminder pings</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#f5f3ff] text-[#7256c3] flex items-center justify-center text-xs font-extrabold">✓</div>
                <span>Lossless voice notes with live animated equalizer bars</span>
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-[#7256c3] hover:bg-[#6348b6] shadow-lg shadow-[#7256c3]/20 transition-all cursor-pointer"
            >
              <span>Explore Messaging Hub</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Chat Window Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-6 border border-[#e6e2f8] shadow-xl space-y-5 relative overflow-hidden"
            style={{ boxShadow: '0 20px 40px -10px rgba(114, 86, 195, 0.1)' }}
          >
            
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
              <span className="text-xs text-slate-600 bg-[#f8f7ff] px-3 py-1 rounded-full border border-[#e6e2f8] font-mono inline-flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#7256c3]" /> End-to-End Encrypted
              </span>
            </div>

            {/* Messages */}
            <div className="space-y-3.5 py-1 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl max-w-[85%] border border-slate-200 text-slate-800 shadow-xs">
                Hey Priyanjali! Have you reviewed the PingX presentation slides?
                <span className="block text-[10px] text-slate-400 mt-1">10:30 AM</span>
              </div>

              {/* Voice Note Message Bubble */}
              <div className="bg-[#f8f7ff] p-3.5 rounded-2xl max-w-[85%] border border-[#e6e2f8] text-slate-800 shadow-xs space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-9 h-9 rounded-xl bg-[#7256c3] text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
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
                      {[12, 24, 16, 30, 20, 14, 28, 18, 22, 10, 26, 16, 20].map((h, i) => (
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

              <div className="bg-[#7256c3] p-3.5 rounded-2xl max-w-[85%] ml-auto text-white shadow-sm">
                Yes! The light design system looks super clean and crisp 🚀
                <span className="flex items-center justify-end gap-1 text-[10px] text-violet-200 mt-1">
                  10:32 AM <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl max-w-[88%] border border-slate-200 text-slate-800 shadow-xs">
                Awesome! Let's meet tomorrow at 6 PM near the main cafeteria.
                
                {/* Smart Action Badge */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-[#7256c3] font-semibold">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Detected: Meeting 6:00 PM</span>
                  <button onClick={onEnterApp} className="px-2.5 py-1 rounded-lg bg-[#7256c3] text-white font-bold cursor-pointer hover:bg-[#6348b6] shadow-xs">
                    + Add Ping
                  </button>
                </div>
              </div>
            </div>

            {/* Smart reply chips */}
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
            <div className="flex items-center gap-2 pt-2">
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
