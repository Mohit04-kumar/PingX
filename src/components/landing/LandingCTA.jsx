import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export function LandingCTA({ onOpenAuth }) {
  return (
    <section className="py-20 px-6 relative overflow-hidden bg-[#f8f7ff] border-t border-[#e6e2f8]">
      <div className="max-w-5xl mx-auto rounded-3xl p-10 sm:p-16 border border-[#e6e2f8] bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#4338ca] text-white text-center space-y-6 relative shadow-2xl overflow-hidden">
        
        {/* Soft Ambient Internal Radial Glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#7256c3]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#6366f1]/30 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-violet-200 text-xs font-extrabold uppercase tracking-wide border border-white/20 relative z-10">
          <UserCheck className="w-3.5 h-3.5 text-violet-200" />
          <span>JOIN FREE IN SECONDS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold font-heading leading-tight tracking-tight text-white relative z-10">
          Ready to experience genuine chats & smarter deals?
        </h2>

        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed relative z-10">
          Create your free account today to start chatting in real time, sharing lossless voice audio, and scanning live e-commerce discounts across India's top retailers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm text-[#1e1b4b] bg-white hover:bg-slate-100 shadow-xl shadow-black/20 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#7256c3]" />
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 text-[#7256c3]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all cursor-pointer"
          >
            <span>Sign In to Account</span>
          </motion.button>
        </div>

      </div>
    </section>
  );
}

export default LandingCTA;
