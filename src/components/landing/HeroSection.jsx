import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle, 
  Play, 
  Pause,
  ShoppingBag, 
  Search, 
  ArrowRight,
  TrendingDown,
  Volume2,
  Lock,
  ExternalLink
} from 'lucide-react';

const SLIDES = [
  {
    id: 0,
    tag: 'REAL-TIME SOCIAL MESSAGING',
    badge: '💬 Verified Realtime Network',
    title: 'CONNECT, CHAT & SHARE REAL MOMENTS',
    description: 'Ultra-fast 1-on-1 and group chats with live typing status, verified read receipts, audio note visualizers, and instant media sharing.',
    primaryAction: 'Start Chatting',
    secondaryAction: 'Sign In',
    type: 'chat_ui',
  },
  {
    id: 1,
    tag: 'SMART KNOWLEDGE & SEARCH',
    badge: '⚡ Verified Quick Answers',
    title: 'SEARCH ANYTHING, GET INSTANT FACTS',
    description: 'Concise 2-bullet answers, instant deal insights, and clear product summaries designed to save your time and give you immediate clarity.',
    primaryAction: 'Try Smart Search',
    secondaryAction: 'Explore Topics',
    type: 'search_ui',
  },
  {
    id: 2,
    tag: 'MULTI-STORE PRICE COMPARISON',
    badge: '🛍️ Save Up to 45% Across Stores',
    title: 'COMPARE PRICES & SAVE MONEY LIVE',
    description: 'Scan verified live offers across Amazon, Flipkart, Croma, and Myntra in real time. Track discounts without switching 10 different tabs.',
    primaryAction: 'Compare Live Deals',
    secondaryAction: 'Browse Catalog',
    type: 'deal_ui',
  },
  {
    id: 3,
    tag: 'VOICE STREAMS & ACTIVITY PINGS',
    badge: '🎙️ Encrypted Voice Stream',
    title: 'AUTHENTIC VOICE NOTES & LIVE PINGS',
    description: 'Share your genuine thoughts with lossless audio notes that capture authentic tone. Send real-time activity pings so friends know when you are free.',
    primaryAction: 'Send a Voice Note',
    secondaryAction: 'View Activity Feed',
    type: 'voice_ui',
  },
];

export function HeroSection({ onOpenAuth, onEnterApp }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const slide = SLIDES[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative pt-24 pb-14 min-h-[90vh] flex flex-col justify-between overflow-hidden bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── TOP LAYERED ORGANIC WAVE (Gupt Vrindavan Dham Royal Purple Theme) ── */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-0">
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-[160px] sm:max-h-[200px] object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradRoyal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7256c3" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="waveGradRoyalBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c4bbf0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7256c3" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Background Wave Layer */}
          <path
            d="M0,0 L1440,0 L1440,110 C1200,180 950,60 720,120 C480,180 240,80 0,140 Z"
            fill="url(#waveGradRoyalBack)"
          />

          {/* Foreground Wave Layer */}
          <path
            d="M0,0 L1440,0 L1440,75 C1240,140 1020,35 720,85 C420,135 180,50 0,95 Z"
            fill="url(#waveGradRoyal)"
          />
        </svg>


      </div>

      {/* ── Soft Lavender Ambient Glow ── */}
      <div
        className="absolute top-1/2 right-4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-25 bg-[#7256c3]"
        style={{ transform: 'translateY(-50%)' }}
      />

      {/* ── MAIN HERO GRID ── */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-12 sm:pt-16 lg:pt-20 pb-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center flex-1 my-auto">
        
        {/* ── LEFT: Dynamic Title, Deep Indigo Pill Badge & Royal Purple Pill CTA ── */}
        <div className="md:col-span-6 space-y-5 lg:space-y-6 text-left">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wide bg-violet-100 text-[#7256c3] border border-violet-200 shadow-xs"
            >
              <span>{slide.tag}</span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-extrabold font-heading tracking-tight leading-[1.14] text-slate-900">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenAuth ? onOpenAuth('register') : onEnterApp()}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#7256c3] hover:bg-[#6348b6] shadow-lg shadow-[#7256c3]/25 transition-all cursor-pointer"
            >
              <span>{slide.primaryAction}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenAuth ? onOpenAuth('login') : onEnterApp()}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm text-slate-800 bg-white border border-[#e6e2f8] hover:bg-[#f8f7ff] shadow-xs transition-all cursor-pointer"
            >
              <span>{slide.secondaryAction}</span>
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7256c3]" />
              100% Privacy Preserved
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#7256c3]" />
              Multi-Store Verified Sync
            </span>
          </div>

        </div>

        {/* ── RIGHT: Real Website UI Screenshots & Realistic Previews ── */}
        <div className="md:col-span-6 flex justify-center items-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`ui-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[520px] lg:max-w-lg rounded-3xl border border-[#e6e2f8] bg-white shadow-2xl overflow-hidden"
              style={{ boxShadow: '0 20px 45px -10px rgba(114, 86, 195, 0.12)' }}
            >

              {/* ── Mockup 0: Real PingX Chat Window ── */}
              {slide.id === 0 && (
                <div className="flex flex-col h-[380px] bg-slate-50/60">
                  {/* Mockup Header */}
                  <div className="p-3.5 px-4 bg-white border-b border-[#e6e2f8] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                          alt="Raman Raj"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Raman Raj</h4>
                        <p className="text-[10px] text-[#7256c3] font-semibold">Active now • Product Lead</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f8f7ff] text-[10px] font-semibold text-[#7256c3] border border-[#e6e2f8]">
                      <Lock className="w-3 h-3 text-[#7256c3]" />
                      <span>Encrypted</span>
                    </div>
                  </div>

                  {/* Chat Stream */}
                  <div className="flex-1 p-4 space-y-3.5 overflow-y-auto text-xs">
                    {/* Incoming */}
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-slate-200 text-slate-800 shadow-xs space-y-1">
                        <p className="leading-relaxed">
                          Hey Alex! Did you check out the new PingX real-time update? The speed is unbelievable ⚡
                        </p>
                        <span className="text-[10px] text-slate-400 block text-right">10:14 AM</span>
                      </div>
                    </div>

                    {/* Image Message in Chat */}
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="p-2 rounded-2xl rounded-tl-xs bg-white border border-slate-200 text-slate-800 shadow-xs space-y-1.5">
                        <div className="w-48 h-24 rounded-xl overflow-hidden relative">
                          <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80"
                            alt="Shared product"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 right-1.5 bg-[#7256c3] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                            ₹4,299 on Myntra
                          </span>
                        </div>
                        <p className="text-[11px] leading-snug px-1">Check out these Nike sneakers! 38% OFF 🔥</p>
                      </div>
                    </div>

                    {/* Outgoing */}
                    <div className="flex items-end justify-end">
                      <div className="p-3 rounded-2xl rounded-tr-xs bg-[#7256c3] text-white shadow-xs max-w-[85%] space-y-1">
                        <p className="leading-relaxed">
                          Yes! Audio notes and group sync are super smooth now. Meeting near the cafe at 5?
                        </p>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-violet-200">
                          <span>10:15 AM</span>
                          <span>✓✓</span>
                        </div>
                      </div>
                    </div>

                    {/* Audio Note Preview */}
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-8 h-8 rounded-full bg-[#7256c3] text-white flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 transition-transform"
                        >
                          {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 h-5">
                            {[12, 20, 8, 28, 16, 24, 10, 18, 30, 14, 22, 10, 16, 26, 12].map((height, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full ${i < 6 && isPlayingAudio ? 'bg-[#7256c3]' : 'bg-slate-300'}`}
                                style={{ height: `${height}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Voice note • 0:18 / 0:34</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Footer */}
                  <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="Sounds great, I'll see you there with the notes!"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none"
                    />
                    <button className="px-3.5 py-2 rounded-xl bg-[#7256c3] text-white text-xs font-bold cursor-pointer hover:bg-[#6348b6]">
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* ── Mockup 1: Smart Search & Instant Facts ── */}
              {slide.id === 1 && (
                <div className="p-5 space-y-4 bg-white">
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] text-slate-700 text-xs">
                    <Search className="w-4 h-4 text-[#7256c3] shrink-0" />
                    <span className="font-semibold text-slate-800">Best ANC wireless headphones for programming in 2026?</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#7256c3]" />
                        <span className="text-xs font-bold text-slate-900">Verified Instant Summary</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-[#7256c3]">
                        2 Key Points
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#e6e2f8]">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80"
                        alt="Sony Headphones"
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900 truncate">Sony WH-1000XM5 ANC</h5>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#7256c3] text-white shrink-0">
                            Save ₹2,000
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Flipkart: <strong className="text-[#7256c3]">₹26,990</strong> <span className="line-through text-slate-400">₹28,990</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7256c3] mt-1.5 shrink-0" />
                        <p className="leading-relaxed">
                          Top-tier active noise cancellation with 30-hour battery and seamless dual-device Bluetooth connectivity.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#e6e2f8] flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Store match verified 4 mins ago</span>
                      <button className="font-bold text-[#7256c3] hover:underline inline-flex items-center gap-1 cursor-pointer">
                        View Offer <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">#NoiseCancelling</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">#HardwareDeals</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">#VerifiedStore</span>
                  </div>
                </div>
              )}

              {/* ── Mockup 2: Multi-Store Deal Matrix ── */}
              {slide.id === 2 && (
                <div className="p-5 space-y-3.5 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 text-[#7256c3] flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Multi-Store Price Scanner</h4>
                        <p className="text-[10px] text-slate-500">Live API updates from 4 major retailers</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-violet-100 text-[#7256c3]">
                      Prices Verified
                    </span>
                  </div>

                  {/* Product Deal 1 */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80"
                        alt="Nike Air"
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">Nike Air Max Impact 4</h5>
                        <p className="text-[11px] text-slate-500">Lowest on <strong>Myntra</strong>: ₹4,299</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#7256c3] text-white">
                        Save 38%
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 line-through">₹6,995</p>
                    </div>
                  </div>

                  {/* Product Deal 2 */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&auto=format&fit=crop&q=80"
                        alt="MacBook"
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">Apple MacBook Air M3</h5>
                        <p className="text-[11px] text-slate-500">Lowest on <strong>Flipkart</strong>: ₹1,04,900</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#7256c3] text-white">
                        Save ₹10,000
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 line-through">₹1,14,900</p>
                    </div>
                  </div>

                  {/* Product Deal 3 */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80"
                        alt="Headphones"
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">Sony WH-1000XM5 ANC</h5>
                        <p className="text-[11px] text-slate-500">Lowest on <strong>Amazon</strong>: ₹26,990</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#7256c3] text-white">
                        Save ₹2,000
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 line-through">₹28,990</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Mockup 3: Voice Note Streams & Real-Time Pings ── */}
              {slide.id === 3 && (
                <div className="p-5 space-y-4 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 text-[#7256c3] flex items-center justify-center">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Voice Note Hub</h4>
                        <p className="text-[10px] text-slate-500">Lossless Audio Streams</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-[#7256c3]">
                      Lossless Audio
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f8f7ff] border border-[#e6e2f8] space-y-3">
                    {/* Visual Photo of Audio Stream */}
                    <div className="w-full h-24 rounded-xl overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
                        alt="Listening to Audio Stream"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-[#1e1b4b]/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Lossless FLAC • 24-bit
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                          alt="Mohit"
                          className="w-8 h-8 rounded-full object-cover border border-[#e6e2f8]"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Mohit Kumar</p>
                          <span className="text-[10px] text-[#7256c3] font-semibold">Project Discussion Voice Note</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#7256c3]">0:45 / 1:20</span>
                    </div>

                    {/* Equalizer Visualizer */}
                    <div className="flex items-center gap-1.5 h-10 px-2 rounded-xl bg-white border border-[#e6e2f8]">
                      {[8, 14, 24, 18, 32, 28, 12, 20, 36, 16, 26, 30, 14, 22, 34, 18, 28, 12, 16, 20].map((h, idx) => (
                        <div
                          key={idx}
                          className="flex-1 rounded-full bg-[#7256c3] transition-all duration-300"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="space-y-2 pt-1 text-xs">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Activity</p>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                      <span>⚡ Sarah sent an activity ping: <em>"Reviewing demo"</em></span>
                      <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* ── CAROUSEL CONTROLS ── */}
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between relative z-10 pt-2">
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Selector Pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx ? 'w-8 sm:w-10 bg-[#7256c3]' : 'w-2.5 sm:w-3 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Slide ${idx + 1}: ${s.tag}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-xs font-bold text-slate-500 font-mono">
          0{currentSlide + 1} / 0{SLIDES.length}
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
